import { getSigner } from '@dynamic-labs/ethers-v6';
import { isEthereumWallet } from '@dynamic-labs/ethereum';
import { ethers } from 'ethers';
import { randomUUID } from 'crypto';
import { redeemableLinkAbi } from '../constants/abi';
import { getContractByNetworkId } from '../constants/contracts';
import { Contract } from 'ethers';

export function generateLinkId(): string {
  return randomUUID();
}


const ERC20_ABI = [
    {
        "name": "approve",
        "inputs": [
            {
                "internalType": "address",
                "name": "spender",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "name": "allowance",
        "inputs": [
            {
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "spender",
                "type": "address"
            }
        ],
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];

// Get the current allowance and update it if needed
export const checkAndSetAllowance = async (wallet: any, tokenAddress: string, approvalAddress: string, amount: string) => {
    // Transactions with the native token don't need approval
    if (tokenAddress === ethers.ZeroAddress) {
        return
    }

    const erc20 = new Contract(tokenAddress, ERC20_ABI, wallet);
    const allowance = await erc20.allowance(await wallet.getAddress(), approvalAddress);

    if (allowance.lt(amount)) {
        const approveTx = await erc20.approve(approvalAddress, amount);
        await approveTx.wait();
    }
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
