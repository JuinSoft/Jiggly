import { getSigner } from '@dynamic-labs/ethers-v6';
import { isEthereumWallet } from '@dynamic-labs/ethereum';
import { ethers } from 'ethers';
import { randomUUID } from 'crypto';
import { redeemableLinkAbi } from '../constants/abi';
import { getContractByNetworkId } from '../constants/contracts';

export function generateLinkId(): string {
  return randomUUID();
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
        address: getContractByNetworkId(network).redeemableLink,
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
  linkId: string,
  network: number
) {
  if (primaryWallet && isEthereumWallet(primaryWallet) && network) {
    const publicClient = await primaryWallet.getPublicClient()
    const redeemed = await publicClient.readContract({
      address: getContractByNetworkId(network).redeemableLink,
      abi: redeemableLinkAbi,
      functionName: 'redeem',
      args: [linkId],
    })
    return redeemed
  }
  return null;
}
