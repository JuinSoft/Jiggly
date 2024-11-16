import { getSigner } from "@dynamic-labs/ethers-v6";
import { isEthereumWallet } from "@dynamic-labs/ethereum";
import { ethers } from "ethers";
import { randomUUID } from "crypto";
import { redeemableLinkAbi } from "../constants/abi";
import { getContractByNetworkId } from "../constants/contracts";
import { Contract } from "ethers";

export function generateLinkId(): string {
  return randomUUID();
}

const ERC20_ABI = [
  {
    name: "approve",
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    name: "allowance",
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
    ],
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

export async function createRedeemableLink(
  primaryWallet: any,
  amount: number,
  linkId: string,
  network: number
) {
  if (primaryWallet && isEthereumWallet(primaryWallet) && network) {
    const publicClient = await primaryWallet.getPublicClient();
    console.log("Creating link: ", publicClient);
    const created = await publicClient.readContract({
      address: "0x38ecb7Aff1f657c7E84B2cFe23F6596Ce41E0aac", //getContractByNetworkId(network).redeemableLink,
      abi: redeemableLinkAbi,
      functionName: "createLink",
      args: ["12324", BigInt(amount)]
    });
    console.log("Created link: ", created, linkId.toString(), BigInt(amount));
    return created;
  }
  return null;
}

export async function redeemLink(
  primaryWallet: any,
  linkId: string,
  network: number
) {
  if (primaryWallet && isEthereumWallet(primaryWallet) && network) {
    const publicClient = await primaryWallet.getPublicClient();
    const redeemed = await publicClient.readContract({
      address: getContractByNetworkId(network).redeemableLink,
      abi: redeemableLinkAbi,
      functionName: "redeem",
      args: [linkId],
    });
    return redeemed;
  }
  return null;
}
