"use client";

import { DynamicContextProvider } from "@dynamic-labs/sdk-react-core";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import { FlowWalletConnectors } from "@dynamic-labs/flow";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <DynamicContextProvider
      theme="auto"
      settings={{
        environmentId: process.env.DYNAMIC_ENV_ID || "",
        walletConnectors: [EthereumWalletConnectors, FlowWalletConnectors],
      }}
    >
      {children}
    </DynamicContextProvider>
  );
}
