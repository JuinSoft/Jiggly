import { getSigner } from '@dynamic-labs/ethers-v6';
import { isEthereumWallet } from '@dynamic-labs/ethereum';
import { ethers } from 'ethers';


export const USDC_ADDRESS = "0x2480C5e37Cf30967CacDd953550D56E3Fe63a19A";
export const REDEEMABLE_LINK_ADDRESS = "0xd6f8084fFa6aF6B6b0E1493479a21456457ee071";

export function generateLinkId(): string {
  return "12";
}

export async function createRedeemableLink(
  primaryWallet: any,
  amount: number,
  linkId: string,
  network: number
) {

  if (primaryWallet && isEthereumWallet(primaryWallet) && network) {
    const publicClient = await primaryWallet.getPublicClient()
    const created = await publicClient.readContract({
        address: REDEEMABLE_LINK_ADDRESS,
        abi: redeemableLinkAbi,
        functionName: 'createLink',
        args: [linkId, ethers.parseEther(amount.toString())],
    })
    return created
  }
  return null;
}

export async function redeemLink(
  primaryWallet: any,
  linkId: string
) {
  if (primaryWallet && isEthereumWallet(primaryWallet)) {
    const publicClient = await primaryWallet.getPublicClient()
    const redeemed = await publicClient.readContract({
      address: REDEEMABLE_LINK_ADDRESS,
      abi: redeemableLinkAbi,
      functionName: 'redeem',
      args: [linkId],
    })
    return redeemed
  }
  return null;
}
