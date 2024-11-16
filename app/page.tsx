"use client";

import React, { useState, useEffect, useRef, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Home, Mail, MessageSquare, Send, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { DynamicWidget } from "@dynamic-labs/sdk-react-core";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import axios from "axios";
import { createRedeemableLink, redeemLink } from "@/lib/contracts";
import { getWeb3Provider, getSigner } from "@dynamic-labs/ethers-v6";
import { isEthereumWallet } from "@dynamic-labs/ethereum";
import { getContractByNetworkId } from "../constants/contracts";
import { usdcContractAbi, redeemableLinkAbi } from "../constants/abi";
import { parseGwei } from "viem";
import styles from "./page.module.css";

async function fetchPartnerLogos() {
  const response = await fetch("/api/partnerLogos");
  if (!response.ok) {
    throw new Error("Failed to fetch partner logos");
  }
  return response.json();
}
import { getQuote, sendTransaction } from "@/lib/transactions";

export default function Main() {
  const [partnerLogos, setPartnerLogos] = useState<string[]>([]);

  useEffect(() => {
    fetchPartnerLogos()
      .then(setPartnerLogos)
      .catch((error) => console.error(error));
  }, []);

  // State hooks
  const [messages, setMessages] = useState<{ role: string; content: string }[]>(
    []
  );
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Context and router hooks
  const pathname = usePathname();
  const { user, primaryWallet, network } = useDynamicContext();
  const router = useRouter();

  // Authentication effect
  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  // Scroll effect
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!user) {
    return null;
  }

  const navItems = [
    { name: "My Account", icon: () => <img src="/assets/profiles/noun.png" alt="Noun" className={styles.icon_size + " rounded-full"} />, href: "/account" },
    { name: "My Contacts", icon: () => <img src="/assets/3-heads/head-cordlessphone.svg" alt="Cordless Phone" className={styles.icon_size} style={{ transform: 'rotate(90deg)' }} />, href: "/contacts" },
    { name: "My Messages", icon: () => <img src="/assets/3-heads/head-mailbox.svg" alt="Mailbox" className={styles.icon_size} />, href: "/messages" },
    { name: "Notifications", icon: () => <img src="/assets/3-heads/head-bell.svg" alt="Bell" className={styles.icon_size} />, href: "/notifications" },
  ];

  const handleTransaction = async (response: any) => {
    if (!primaryWallet) {
      console.error("No wallet connected");
      return;
    }

    try {
      if (primaryWallet && isEthereumWallet(primaryWallet) && network) {
        const client = await primaryWallet.getWalletClient(network.toString());
        const publicClient = await primaryWallet.getPublicClient();
        console.log("response: ", response);
        switch (response.type) {
          case "link_create":
            console.log("Creating link");
            const balance = await publicClient.readContract({
              address: getContractByNetworkId(Number(network)).usdc,
              abi: usdcContractAbi,
              functionName: "balanceOf",
              args: [primaryWallet.address],
            });

            console.log("balance: ", balance);

            if (Number(balance) < response.amount) {
              console.log("Insufficient balance: ", balance, response.amount);
              return;
            }

            const approveAmount = await publicClient.readContract({
              address: getContractByNetworkId(Number(network)).usdc,
              abi: usdcContractAbi,
              functionName: "allowance",
              args: [
                primaryWallet.address,
                getContractByNetworkId(Number(network)).redeemableLink,
              ],
            });

            if (Number(approveAmount) < response.amount) {
              const approveTx = await client.writeContract({
                address: getContractByNetworkId(Number(network)).usdc,
                abi: usdcContractAbi,
                functionName: "approve",
                args: [
                  getContractByNetworkId(Number(network)).redeemableLink,
                  BigInt(
                    "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
                  ), // Approve unlimited amount
                ],
              });
              await publicClient.waitForTransactionReceipt({ hash: approveTx });
            }

            const client = await primaryWallet.getWalletClient(network.toString());
            const createLink = await client.writeContract({
              address: getContractByNetworkId(Number(network)).redeemableLink,
              abi: redeemableLinkAbi,
              functionName: "createLink",
              args: [response.linkId, BigInt(response.amount)]
            });
            break;

          case "transfer":
            if (response.network) {
              console.log("Getting quote");
              const quote = await getQuote(
                response.network.fromChain,
                response.network.toChain,
                response.token.fromToken,
                response.token.toToken,
                response.amount.toString(),
                response.toAddress,
                primaryWallet.address
              );
              await ensureUSDCApproval(
                primaryWallet,
                network,
                response.amount.toString()
              );
              const transactionReceipt = await sendTransaction(
                primaryWallet,
                response.toAddress,
                response.amount.toString(),
                quote.transactionRequest
              );

              console.log("transactionReceipt", transactionReceipt);
            }
            break;

          case "swap":
            console.log("Swap transaction: ", response);
            break;
        }
        return;
      } else {
        console.error("Not supported");
        return;
      }
      console.log("Transaction handled");
    } catch (error) {
      console.error("Transaction failed:", error);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setIsLoading(true);
    setMessages((prev) => [...prev, { role: "user", content: input }]);
    setInput("");

    try {
      const response = await axios.post("/api/chat", { message: input });
      const parsedResponse = response.data;
      console.log("parsedResponse: ", parsedResponse);
      let assistantMessage = "";
      if (
        parsedResponse.type === "clarification" &&
        Array.isArray(parsedResponse.questions)
      ) {
        // Format clarification questions
        assistantMessage = parsedResponse.questions.join("\n");
      } else if (parsedResponse.type !== "unknown") {
        await handleTransaction(parsedResponse);
        assistantMessage =
          parsedResponse.additionalInfo ||
          "Transaction processed successfully.";
      } else {
        assistantMessage = parsedResponse.additionalInfo;
      }

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: assistantMessage },
      ]);
    } catch (error) {
      console.error("Error fetching chat response:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I couldn't process your request.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  async function ensureUSDCApproval(
    primaryWallet: any,
    network: any,
    tokenAmount: any
  ) {
    if (primaryWallet && isEthereumWallet(primaryWallet) && network) {
      const client = await primaryWallet.getWalletClient(network.toString());
      const publicClient = await primaryWallet.getPublicClient();

      const approveAmount = await publicClient.readContract({
        address: getContractByNetworkId(Number(network)).usdc,
        abi: usdcContractAbi,
        functionName: "allowance",
        args: [
          primaryWallet.address,
          getContractByNetworkId(Number(network)).usdc,
        ],
      });

      if (Number(approveAmount) < tokenAmount) {
        const approveTx = await client.writeContract({
          address: getContractByNetworkId(Number(network)).usdc,
          abi: usdcContractAbi,
          functionName: "approve",
          args: [
            getContractByNetworkId(Number(network)).usdc,
            BigInt(tokenAmount),
          ],
          gasPrice: Number(network) === 545 ? parseGwei("20") : undefined,
        });

        await publicClient.waitForTransactionReceipt({
          hash: approveTx,
        });

        console.log("Approval successful: ", approveTx);
      }
    }
  }

  return (
    <div className={`flex h-screen bg-gray-50 ${isDarkMode ? "dark" : ""}`}>
      {/* Sidebar */}
      <motion.div
        initial={{ x: -300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="w-64 bg-white p-4 shadow-lg dark:bg-gray-800"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center mb-6"
        >
          {/* <img src="/assets/3-heads/head-jellyfish.svg" alt="App Logo" className="h-8 w-8 mr-2" /> */}
          <motion.img
            src="/assets/3-heads/head-jellyfish.svg"
            alt="Jiggly Logo"
            className="h-8 w-8 mr-2"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          />
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`text-2xl font-bold ${
              pathname === "/account"
                ? "bg-gray-100 text-gray-900"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Jiggly
          </motion.h1>
        </motion.div>
        <nav className="space-y-2">
          {navItems.map((item) => (
            <Link key={item.name} href={item.href}>
              <motion.div
                whileHover={{ scale: 1.02, backgroundColor: "#f3f4f6" }}
                whileTap={{ scale: 0.98 }}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                  pathname === item.href
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <item.icon />
                {item.name}
              </motion.div>
            </Link>
          ))}
        </nav>

        {/* Partner Logos Section */}
        <div className={styles.partnerLogos}>
          <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
            Our Partners
          </h2>
          <motion.div
            className="overflow-hidden w-full"
            initial={{ y: "100%" }}
            animate={{ y: "0%" }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            {/* <div className={styles.partnerLogosContainer}>
              {partnerLogos.map((logo, index) => (
                <img
                  key={index}
                  src={`/partner-logos/${logo}`}
                  alt={`${logo}`}
                  className={styles.partnerLogoImage}
                />
              ))}
            </div> */}
          </motion.div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        <div className="flex items-center bg-gray-200 text-[#121212] px-4 py-2 rounded-full text-sm">
          <div className="flex-1" style={{ width: "80%" }}>
            <DynamicWidget />
          </div>
          <Button onClick={() => setIsDarkMode(!isDarkMode)} className="ml-2">
            Toggle Mode
          </Button>
        </div>
        <main className="flex-1 p-4">
          <Card className="flex h-full flex-col bg-white dark:bg-gray-900">
            {/* Messages Area */}
            <div
              className="flex-1 overflow-y-auto p-4"
              style={{ maxHeight: "calc(100vh - 200px)" }}
            >
              <AnimatePresence>
                {messages.map((message, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className={`mb-4 flex ${
                      message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`rounded-lg px-4 py-2 ${
                        message.role === "user"
                          ? "bg-blue-500 text-white"
                          : "bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white"
                      }`}
                    >
                      {message.content}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </div>

            <Separator />

            {/* Input Area */}
            <form onSubmit={handleSubmit} className="p-4">
              <div className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your message here..."
                  className="flex-1"
                  disabled={isLoading}
                />
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <motion.div
                      animate={{ y: [0, -10, 0] }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      <img src="/assets/3-heads/head-plane.svg" alt="Plane" className="h-8 w-8" />
                    </motion.div>
                  ) : (
                    <img src="/assets/3-heads/head-plane.svg" alt="Plane" className="h-8 w-8" />
                  )}
                  <span className="sr-only">Send message</span>
                </Button>
              </div>
            </form>
          </Card>
        </main>
      </div>
    </div>
  );
}
