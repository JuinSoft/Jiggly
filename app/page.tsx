'use client'

import React, { useState, useEffect, useRef, FormEvent } from 'react';
import { motion, AnimatePresence } from "framer-motion"
import { Bell, Home, Mail, MessageSquare, Send, User } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { DynamicWidget } from '@dynamic-labs/sdk-react-core';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core'
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import axios from 'axios';
import { createRedeemableLink, redeemLink } from '@/lib/contracts';
import { getWeb3Provider,getSigner, } from '@dynamic-labs/ethers-v6'
import { isEthereumWallet } from '@dynamic-labs/ethereum'

export default function Main() {
  // State hooks
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)

  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Context and router hooks
  const pathname = usePathname()
  const { user, primaryWallet, network } = useDynamicContext()
  const router = useRouter();

  // Authentication effect
  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  // Scroll effect
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  if (!user) {
    return null;
  }

  const navItems = [
    { name: "My Account", icon: User, href: "/account" },
    { name: "My Contacts", icon: Home, href: "/contacts" },
    { name: "My Messages", icon: MessageSquare, href: "/messages" },
    { name: "Notifications", icon: Bell, href: "/notifications" }
  ]
  
  const handleTransaction = async (response) => {
    if (!primaryWallet) {
      console.error('No wallet connected');
      return;
    }

    try {
      if (primaryWallet && isEthereumWallet(primaryWallet) && network) {
        console.log(response)
        switch (response.type) {
          case 'link_create':
            await createRedeemableLink(
              primaryWallet,
              response.amount,
              response.linkId,
              Number(network)
            );
            break;
        }
        return;
      }
      else {
        console.error('Not supported');
        return;
      }
    } catch (error) {
      console.error('Transaction failed:', error);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setIsLoading(true);
    setMessages((prev) => [...prev, { role: "user", content: input }]);
    setInput("");

    try {
      const response = await axios.post('/api/chat', { message: input });
      const parsedResponse = response.data;
      
      if (parsedResponse.type !== 'unknown') {
        await handleTransaction(parsedResponse);
      }
      
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: parsedResponse.additionalInfo },
      ]);
    } catch (error) {
      console.error('Error fetching chat response:', error);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, I couldn't process your request." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`flex h-screen bg-gray-50 ${isDarkMode ? 'dark' : ''}`}>
      {/* Sidebar */}
      <motion.div
        initial={{ x: -300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="w-64 bg-white p-4 shadow-lg dark:bg-gray-800"
      >
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-6 text-2xl font-bold dark:text-white"
        >
          Jiggly
        </motion.h1>
        <nav className="space-y-2">
          {navItems.map((item) => (
            <Link key={item.name} href={item.href}>
              <motion.div
                whileHover={{ scale: 1.02, backgroundColor: "#f3f4f6" }}
                whileTap={{ scale: 0.98 }}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                  pathname === item.href ? "bg-gray-100 text-gray-900" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </motion.div>
            </Link>
          ))}
        </nav>
      </motion.div>

      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        <div className="flex items-center bg-gray-200 text-[#121212] px-4 py-2 rounded-full text-sm">
          <div className="flex-1" style={{ width: '80%' }}>
            <DynamicWidget />
          </div>
          <Button onClick={() => setIsDarkMode(!isDarkMode)} className="ml-2">
            Toggle Mode
          </Button>
        </div>
        <main className="flex-1 p-4">
          <Card className="flex h-full flex-col bg-white dark:bg-gray-900">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4">
              <AnimatePresence>
                {messages.map((message, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className={`mb-4 flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
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
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <Mail className="h-4 w-4" />
                    </motion.div>
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                  <span className="sr-only">Send message</span>
                </Button>
              </div>
            </form>
          </Card>
        </main>
      </div>
    </div>
  )
}