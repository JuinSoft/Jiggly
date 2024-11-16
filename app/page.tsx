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
import { isEthereumWallet } from "@dynamic-labs/ethereum";
import { usdcContractAbi, redeemableLinkAbi } from "../constants/abi";
import { parseGwei } from "viem";
import styles from "./page.module.css";
import { contracts, getContractByNetworkId } from "../constants/contracts";
import {
  getQuote,
  sendTransaction,
  getTokenConnections,
} from "@/lib/transactions";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ethers } from "ethers";

async function fetchPartnerLogos() {
  const response = await fetch("/api/partnerLogos");
  if (!response.ok) {
    throw new Error("Failed to fetch partner logos");
  }
  return response.json();
}

export default function Main() {
  const [partnerLogos, setPartnerLogos] = useState<string[]>([]);
  const [messages, setMessages] = useState<{ role: string; content: string }[]>(
    []
  );
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [ethAmount, setEthAmount] = useState("");
  const [selectedNetworkId, setSelectedNetworkId] = useState(11155111); // Default to Ethereum Sepolia
  const [redeemId, setRedeemId] = useState("");
  const [showRedeemPopup, setShowRedeemPopup] = useState(false);
  const [showConnectionsPopup, setShowConnectionsPopup] = useState(false);
  const [fromChain, setFromChain] = useState("");
  const [toChain, setToChain] = useState("");
  const [fromToken, setFromToken] = useState("");
  const [toToken, setToToken] = useState("");
  const [showTransferPopup, setShowTransferPopup] = useState(false);
  const [transferAmount, setTransferAmount] = useState("");
  const [transferToAddress, setTransferToAddress] = useState("");
  const [transferFromToken, setTransferFromToken] = useState("");
  const [transferToToken, setTransferToToken] = useState("");
  const [transferFromChain, setTransferFromChain] = useState("");
  const [transferToChain, setTransferToChain] = useState("");

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const pathname = usePathname();
  const { user, primaryWallet, network } = useDynamicContext();
  const router = useRouter();

  useEffect(() => {
    fetchPartnerLogos()
      .then(setPartnerLogos)
      .catch((error) => {
        console.error(error);
        toast.error("Failed to load partner logos");
      });
  }, []);

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!user) {
    return null;
  }

  const navItems = [
    {
      name: "My Account",
      icon: () => (
        <img
          src="/assets/profiles/noun.png"
          alt="Noun"
          className={styles.icon_size + " rounded-full"}
        />
      ),
      href: "/account",
    },
    {
      name: "My Contacts",
      icon: () => (
        <img
          src="/assets/3-heads/head-cordlessphone.svg"
          alt="Cordless Phone"
          className={styles.icon_size}
          style={{ transform: "rotate(90deg)" }}
        />
      ),
      href: "/contacts",
    },
    {
      name: "My Messages",
      icon: () => (
        <img
          src="/assets/3-heads/head-mailbox.svg"
          alt="Mailbox"
          className={styles.icon_size}
        />
      ),
      href: "/messages",
    },
    {
      name: "Notifications",
      icon: () => (
        <img
          src="/assets/3-heads/head-bell.svg"
          alt="Bell"
          className={styles.icon_size}
        />
      ),
      href: "/notifications",
    },
  ];

  const handleTransaction = async (response: any) => {
    if (!primaryWallet) {
      toast.error("No wallet connected");
      return;
    }

    try {
      if (primaryWallet && isEthereumWallet(primaryWallet) && network) {
        toast.info("Initializing transaction...");
        const client = await primaryWallet.getWalletClient(network.toString());
        const publicClient = await primaryWallet.getPublicClient();
        
        switch (response.type) {
          case "link_create":
            toast.info("Checking balance...");
            const balance = await publicClient.readContract({
              address: getContractByNetworkId(Number(network)).usdc,
              abi: usdcContractAbi,
              functionName: "balanceOf",
              args: [primaryWallet.address],
            });

            if (Number(balance) < response.amount) {
              toast.error("Insufficient balance");
              return;
            }

            toast.info("Checking allowance...");
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
              toast.info("Approving USDC...");
              const approveTx = await client.writeContract({
                address: getContractByNetworkId(Number(network)).usdc,
                abi: usdcContractAbi,
                functionName: "approve",
                args: [
                  getContractByNetworkId(Number(network)).redeemableLink,
                  BigInt(
                    "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
                  ),
                ],
              });
              toast.info("Waiting for approval confirmation...");
              await publicClient.waitForTransactionReceipt({ hash: approveTx });
            }

            toast.info("Creating link...");
            await client.writeContract({
              address: getContractByNetworkId(Number(network)).redeemableLink,
              abi: redeemableLinkAbi,
              functionName: "createLink",
              args: [response.linkId, BigInt(response.amount)],
            });
            break;

          case "link_redeem":
            toast.info("Initiating redeem...");
            const redeemed = await client.writeContract({
              address: getContractByNetworkId(network).redeemableLink,
              abi: redeemableLinkAbi,
              functionName: "redeem",
              args: [response.linkId],
            });
            toast.info("Waiting for redeem confirmation...");
            const receipt = await publicClient.waitForTransactionReceipt({
              hash: redeemed,
            });
            break;

          case "transfer":
            if (response.network) {
              toast.info("Getting quote...");
              const quote = await getQuote(
                response.network.fromChain,
                response.network.toChain,
                response.token.fromToken,
                response.token.toToken,
                response.amount.toString(),
                response.toAddress,
                primaryWallet.address
              );
              
              toast.info("Checking approval...");
              await ensureUSDCApproval(
                primaryWallet,
                network,
                response.amount.toString()
              );
              
              toast.info("Sending transaction...");
              const transactionReceipt = await sendTransaction(
                primaryWallet,
                response.toAddress,
                response.amount.toString(),
                quote.transactionRequest
              );
              toast.info("Waiting for confirmation...");
            }
            break;

          case "connections":
            toast.info("Fetching token connections...");
            const connections = await getTokenConnections(
              response.fromChain || undefined,
              response.toChain || undefined,
              response.fromToken || undefined,
              response.toToken || undefined
            );
            // Create a Blob and URL for the connections data
            const blob = new Blob([JSON.stringify(connections, null, 2)], {
              type: "application/json",
            });
            const url = URL.createObjectURL(blob);
            // Add the URL to the messages
            setMessages((prev) => [
              ...prev,
              {
                role: "assistant",
                content: `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-blue-500 hover:underline">Click here to view connections data</a>`,
              },
            ]);
            return;
        }
        toast.success("Transaction completed successfully!");
        return;
      } else {
        toast.error("Wallet not supported");
        return;
      }
    } catch (error) {
      console.error("Transaction failed:", error);
      toast.error(`Transaction N: ${error.message || 'Unknown error'}`);
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
      toast.success("Message sent successfully.");
    } catch (error) {
      console.error("Error fetching chat response:", error);
      toast.error("Failed to send message.");
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
      toast.info("Checking approval...");
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
        toast.info("Approving USDC spend...");
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
        toast.success("Approval confirmed!");
      }
    }
  }

  const handleQuickAction = () => {
    setShowPopup(true);
  };

  const handlePopupSubmit = () => {
    const weiAmount = BigInt(parseFloat(ethAmount) * 1e18).toString();
    const message = `Create ${weiAmount} wei USDC to chain id ${selectedNetworkId}`;
    setInput(message);
    setShowPopup(false);
    // Optionally, submit the form automatically
    // handleSubmit(new Event('submit'));
  };

  const handleRedeemAction = () => {
    setShowRedeemPopup(true);
  };

  const handleRedeemSubmit = async () => {
    if (!redeemId.trim()) {
      console.error("Redeem ID is required");
      return;
    }

    try {
      const response = {
        type: "link_redeem",
        linkId: redeemId,
        network: selectedNetworkId,
      };
      await handleTransaction(response);
      console.log("Redeem successful");
      toast.success("Redeem successful");
    } catch (error) {
      console.error("Redeem failed:", error);
      toast.error("Redeem failed.");
    } finally {
      setShowRedeemPopup(false);
    }
  };

  const handleConnectionsAction = () => {
    setShowConnectionsPopup(true);
  };

  const handleConnectionsSubmit = async () => {
    try {
      const response = {
        type: "connections",
        fromChain: fromChain || undefined,
        toChain: toChain || undefined,
        fromToken: fromToken || undefined,
        toToken: toToken || undefined,
      };
      await handleTransaction(response);
      setShowConnectionsPopup(false);
      // Reset form
      setFromChain("");
      setToChain("");
      setFromToken("");
      setToToken("");
    } catch (error) {
      console.error("Connections request failed:", error);
      toast.error("Failed to fetch connections.");
    }
  };

  const handleTransferAction = () => {
    setShowTransferPopup(true);
  };

  const handleTransferSubmit = async () => {
    if (!transferAmount || !transferToAddress) {
      toast.error("Amount and recipient address are required");
      return;
    }

    try {
      const response = {
        type: "transfer",
        amount: ethers.parseEther(transferAmount.toString()),
        toAddress: transferToAddress,
        network: {
          fromChain: transferFromChain,
          toChain: transferToChain,
        },
        token: {
          fromToken: transferFromToken,
          toToken: transferToToken,
        }
      };
      console.log("response: ", response);
      await handleTransaction(response);
      setShowTransferPopup(false);
      // Reset form
      setTransferAmount("");
      setTransferToAddress("");
      setTransferFromChain("");
      setTransferToChain("");
      setTransferFromToken("");
      setTransferToToken("");
    } catch (error) {
      console.error("Transfer failed:", error);
      toast.error("Transfer failed. No quote found or use higher token amount.");
    }
  };

  return (
    <div className={`flex h-screen bg-gray-50 ${isDarkMode ? "dark" : ""}`}>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={isDarkMode ? "dark" : "light"}
      />
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
        {/* <nav className="space-y-2">
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
        </nav> */}

        {/*  // Partner Logos Section
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
            <div className={styles.partnerLogosContainer}>
              {partnerLogos.map((logo, index) => (
                <img
                  key={index}
                  src={`/partner-logos/${logo}`}
                  alt={`${logo}`}
                  className={styles.partnerLogoImage}
                />
              ))}
            </div>
          </motion.div>
        </div> */}

        {/* Quick Actions Section */}
        <div className="mt-6">
          <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
            Quick Actions
          </h2>
          <Button onClick={handleQuickAction} className="w-full mb-2">
            Create Sharable Links for USDC
          </Button>
          <Button onClick={handleRedeemAction} className="w-full mb-2">
            Redeem Shared Tokens
          </Button>
          <Button onClick={handleConnectionsAction} className="w-full mb-2">
            View Connections
          </Button>
          <Button onClick={handleTransferAction} className="w-full mb-2">
            Transfer Tokens (Only Mainnet)
          </Button>
        </div>

        {/* Popup for Quick Action */}
        {showPopup && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-4 rounded shadow-lg">
              <h3 className="text-lg font-bold mb-2">Create USDC</h3>
              <div className="mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Amount in ETH
                </label>
                <input
                  type="number"
                  value={ethAmount}
                  onChange={(e) => setEthAmount(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Select Network
                </label>
                <select
                  value={selectedNetworkId}
                  onChange={(e) => setSelectedNetworkId(Number(e.target.value))}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
                >
                  {Object.entries(contracts).map(([networkId, contract]) => {
                    const networkNames = {
                      "11155111": "Ethereum Sepolia",
                      "1301": "Unichain Testnet",
                      "314159": "Filecoin Calibration Testnet",
                      "80002": "Polygon Amoy",
                      "296": "Hedera Testnet",
                      "137": "Polygon Mainnet",
                    };
                    return (
                      <option key={networkId} value={networkId}>
                        {networkNames[networkId as keyof typeof networkNames] ||
                          `Network ID: ${networkId}`}
                      </option>
                    );
                  })}
                </select>
              </div>
              <Button onClick={handlePopupSubmit} className="mr-2">
                Submit
              </Button>
              <Button onClick={() => setShowPopup(false)}>Cancel</Button>
            </div>
          </div>
        )}

        {/* Popup for Redeem Action */}
        {showRedeemPopup && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-4 rounded shadow-lg">
              <h3 className="text-lg font-bold mb-2">Redeem Token</h3>
              <div className="mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Redeem ID
                </label>
                <input
                  type="text"
                  value={redeemId}
                  onChange={(e) => setRedeemId(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Select Network
                </label>
                <select
                  value={selectedNetworkId}
                  onChange={(e) => setSelectedNetworkId(Number(e.target.value))}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
                >
                  {Object.entries(contracts).map(([networkId, contract]) => {
                    const networkNames = {
                      "11155111": "Ethereum Sepolia",
                      "1301": "Unichain Testnet",
                      "314159": "Filecoin Calibration Testnet",
                      "80002": "Polygon Amoy",
                      "296": "Hedera Testnet",
                      "137": "Polygon Mainnet",
                    };
                    return (
                      <option key={networkId} value={networkId}>
                        {networkNames[networkId as keyof typeof networkNames] ||
                          `Network ID: ${networkId}`}
                      </option>
                    );
                  })}
                </select>
              </div>
              <Button onClick={handleRedeemSubmit} className="mr-2">
                Submit
              </Button>
              <Button onClick={() => setShowRedeemPopup(false)}>Cancel</Button>
            </div>
          </div>
        )}

        {showConnectionsPopup && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-4 rounded shadow-lg w-96">
              <h3 className="text-lg font-bold mb-4">View Token Connections</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    From Chain (optional)
                  </label>
                  <select
                    value={fromChain}
                    onChange={(e) => setFromChain(e.target.value)}
                    className="w-full border border-gray-300 rounded-md shadow-sm p-2"
                  >
                    <option value="">Select Chain</option>
                    {Object.entries(contracts).map(([networkId]) => (
                      <option key={networkId} value={networkId}>
                        {networkId === "1"
                          ? "Ethereum Mainnet"
                          : networkId === "1301"
                          ? "Unichain Testnet"
                          : networkId === "314"
                          ? "Filecoin Mainnet"
                          : networkId === "137"
                          ? "Polygon Mainnet"
                          : networkId === "295"
                          ? "Hedera Mainnet"
                          : networkId === "56"
                          ? "Binance Smart Chain Mainnet"
                          : `Network ${networkId}`}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    To Chain (optional)
                  </label>
                  <select
                    value={toChain}
                    onChange={(e) => setToChain(e.target.value)}
                    className="w-full border border-gray-300 rounded-md shadow-sm p-2"
                  >
                    <option value="">Select Chain</option>
                    {Object.entries(contracts).map(([networkId]) => (
                      <option key={networkId} value={networkId}>
                        {networkId === "11155111"
                          ? "Ethereum Sepolia"
                          : networkId === "1301"
                          ? "Unichain Testnet"
                          : networkId === "314159"
                          ? "Filecoin Calibration"
                          : networkId === "80002"
                          ? "Polygon Amoy"
                          : networkId === "296"
                          ? "Hedera Testnet"
                          : networkId === "137"
                          ? "Polygon Mainnet"
                          : `Network ${networkId}`}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    From Token (optional)
                  </label>
                  <input
                    type="text"
                    value={fromToken}
                    onChange={(e) => setFromToken(e.target.value)}
                    placeholder="Token (Eg: USDC)"
                    className="w-full border border-gray-300 rounded-md shadow-sm p-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    To Token (optional)
                  </label>
                  <input
                    type="text"
                    value={toToken}
                    onChange={(e) => setToToken(e.target.value)}
                    placeholder="Token (Eg: ETH)"
                    className="w-full border border-gray-300 rounded-md shadow-sm p-2"
                  />
                </div>

                <div className="flex justify-end space-x-2 mt-4">
                  <Button onClick={handleConnectionsSubmit} className="mr-2">
                    View Connections
                  </Button>
                  <Button onClick={() => setShowConnectionsPopup(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {showTransferPopup && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-4 rounded shadow-lg w-96">
              <h3 className="text-lg font-bold mb-4">Transfer Tokens</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Amount*
                  </label>
                  <input
                    type="text"
                    value={transferAmount}
                    onChange={(e) => setTransferAmount(e.target.value)}
                    placeholder="Enter amount"
                    className="w-full border border-gray-300 rounded-md shadow-sm p-2"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Recipient Address*
                  </label>
                  <input
                    type="text"
                    value={transferToAddress}
                    onChange={(e) => setTransferToAddress(e.target.value)}
                    placeholder="0x..."
                    className="w-full border border-gray-300 rounded-md shadow-sm p-2"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    From Chain
                  </label>
                  <select
                    value={transferFromChain}
                    onChange={(e) => setTransferFromChain(e.target.value)}
                    className="w-full border border-gray-300 rounded-md shadow-sm p-2"
                  >
                    <option value="">Select Source Chain</option>
                    {Object.entries(contracts).map(([networkId]) => (
                      <option key={networkId} value={networkId}>
                        {networkId === "11155111" ? "Ethereum Sepolia" :
                         networkId === "1301" ? "Unichain Testnet" :
                         networkId === "314159" ? "Filecoin Calibration" :
                         networkId === "80002" ? "Polygon Amoy" :
                         networkId === "296" ? "Hedera Testnet" :
                         networkId === "137" ? "Polygon Mainnet" :
                         networkId === "1" ? "Ethereum Mainnet" :
                         `Network ${networkId}`}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    To Chain
                  </label>
                  <select
                    value={transferToChain}
                    onChange={(e) => setTransferToChain(e.target.value)}
                    className="w-full border border-gray-300 rounded-md shadow-sm p-2"
                  >
                    <option value="">Select Destination Chain</option>
                    {Object.entries(contracts).map(([networkId]) => (
                      <option key={networkId} value={networkId}>
                        {networkId === "11155111" ? "Ethereum Sepolia" :
                         networkId === "1301" ? "Unichain Testnet" :
                         networkId === "314159" ? "Filecoin Calibration" :
                         networkId === "80002" ? "Polygon Amoy" :
                         networkId === "296" ? "Hedera Testnet" :
                         networkId === "137" ? "Polygon Mainnet" :
                         networkId === "1" ? "Ethereum Mainnet" :
                         `Network ${networkId}`}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    From Token
                  </label>
                  <input
                    type="text"
                    value={transferFromToken}
                    onChange={(e) => setTransferFromToken(e.target.value)}
                    placeholder="Source token (e.g., USDC)"
                    className="w-full border border-gray-300 rounded-md shadow-sm p-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    To Token
                  </label>
                  <input
                    type="text"
                    value={transferToToken}
                    onChange={(e) => setTransferToToken(e.target.value)}
                    placeholder="Destination token (e.g., ETH)"
                    className="w-full border border-gray-300 rounded-md shadow-sm p-2"
                  />
                </div>

                <div className="flex justify-end space-x-2 mt-4">
                  <Button onClick={handleTransferSubmit} className="mr-2">
                    Transfer
                  </Button>
                  <Button onClick={() => setShowTransferPopup(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
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
                      dangerouslySetInnerHTML={{ __html: message.content }}
                    />
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
                      <img
                        src="/assets/3-heads/head-plane.svg"
                        alt="Plane"
                        className="h-8 w-8"
                      />
                    </motion.div>
                  ) : (
                    <img
                      src="/assets/3-heads/head-plane.svg"
                      alt="Plane"
                      className="h-8 w-8"
                    />
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
