import axios from "axios";
import { parseEther } from "viem";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { isEthereumWallet } from "@dynamic-labs/ethereum";

// Get token quotes for tx
const getQuote = async (
  fromChain: string,
  toChain: string,
  fromToken: string,
  toToken: string,
  fromAmount: string,
  fromAddress: string,
  toAddress: string
) => {
  console.log(
    "Getting quote: ",
    fromChain,
    toChain,
    fromToken,
    toToken,
    fromAmount,
    fromAddress,
    toAddress
  );
  const result = await axios.get(process.env.GET_QUOTE_API as string, {
    params: {
      fromChain,
      toChain,
      fromToken,
      toToken,
      fromAmount,
      fromAddress,
      toAddress,
    },
  });
  console.log("Quote: ", result.data);
  return result.data;
};

// Use Dynamic wallet to send tx
const sendTransaction = async (
  primaryWallet: any,
  address: string,
  amount: string,
  transaction: any
) => {
  console.log("Received tx: ", transaction, primaryWallet, address, amount);
  if (!primaryWallet || !isEthereumWallet(primaryWallet)) return null;
  const publicClient = await primaryWallet.getPublicClient();
  const walletClient = await primaryWallet.getWalletClient();
  const hash = await walletClient.sendTransaction(transaction);
  const receipt = await publicClient.getTransactionReceipt({
    hash,
  });
  console.log("Receipt: ", receipt);
  return receipt;
};

export { getQuote, sendTransaction };
