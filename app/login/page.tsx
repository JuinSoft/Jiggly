'use client';

import { DynamicWidget, useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { LogIn } from 'lucide-react';

export default function Login() {
  const { user } = useDynamicContext();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [ user, router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <motion.div
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md flex flex-col items-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
          <LogIn className="inline-block mr-2 h-6 w-6" />
          Login to Jiggly
        </h1>
        <div className="flex justify-center w-full">
          <DynamicWidget />
        </div>
      </motion.div>
    </div>
  );
}