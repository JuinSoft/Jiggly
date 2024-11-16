import { defineChain } from 'viem'
import explorers from '../constants/explorers.json'

// Ethereum Sepolia
export const ethereumSepolia = defineChain({
  id: 11155111,
  name: 'Ethereum Sepolia',
  rpcUrls: {
    default: { http: ['wss://ethereum-sepolia-rpc.publicnode.com'] },
    public: { http: ['wss://ethereum-sepolia-rpc.publicnode.com'] },
  },
  blockExplorers: {
    default: {
      name: 'Sepolia Explorer',
      url: explorers['11155111'].explorers[0].url,
    },
  },
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
})

// Unichain Testnet
export const unichainTestnet = defineChain({
  id: 1301,
  name: 'Unichain Testnet',
  rpcUrls: {
    default: { http: ['https://sepolia.unichain.org'] },
    public: { http: ['https://sepolia.unichain.org'] },
  },
  blockExplorers: {
    default: {
      name: 'Unichain Explorer',
      url: explorers['1301'].explorers[0].url,
    },
  },
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
})

// Filecoin Calibration Testnet
export const filecoinCalibration = defineChain({
  id: 314159,
  name: 'Filecoin Calibration Testnet',
  rpcUrls: {
    default: { http: ['https://filecoin-calibration.drpc.org'] },
    public: { http: ['https://filecoin-calibration.drpc.org'] },
  },
  blockExplorers: {
    default: {
      name: 'Filecoin Explorer',
      url: explorers['314159'].explorers[0].url,
    },
  },
  nativeCurrency: {
    decimals: 18,
    name: 'Filecoin',
    symbol: 'FIL',
  },
})

// Polygon Amos
export const polygonAmos = defineChain({
  id: 80002,
  name: 'Polygon Amos',
  rpcUrls: {
    default: { http: ['wss://polygon-amoy-bor-rpc.publicnode.com'] },
    public: { http: ['wss://polygon-amoy-bor-rpc.publicnode.com'] },
  },
  blockExplorers: {
    default: {
      name: 'Polygon Explorer',
      url: "https://www.oklink.com/amoy",
    },
  },
  nativeCurrency: {
    decimals: 18,
    name: 'Matic',
    symbol: 'MATIC',
  },
})

// Hedera Testnet
export const hederaTestnet = defineChain({
  id: 296,
  name: 'Hedera Testnet',
  rpcUrls: {
    default: { http: ['https://testnet.hashio.io/api'] },
    public: { http: ['https://testnet.hashio.io/api'] },
  },
  blockExplorers: {
    default: {
      name: 'Hedera Explorer',
      url: "https://hashscan.io/testnet",
    },
  },
  nativeCurrency: {
    decimals: 18,
    name: 'Hedera',
    symbol: 'HBAR',
  },
})

const supportedTestNetworks = [
  ethereumSepolia,
  unichainTestnet,
  filecoinCalibration,
  polygonAmos,
  hederaTestnet,
]

export const evmTestNetworks = supportedTestNetworks.map((chain) => ({
  blockExplorerUrls: [chain.blockExplorers?.default?.url!],
  chainId: chain.id,
  chainName: chain.name,
  iconUrls: ['https://app.dynamic.xyz/assets/networks/eth.svg'],
  name: chain.name,
  nativeCurrency: chain.nativeCurrency,
  networkId: chain.id,
  rpcUrls: [chain.rpcUrls.default.http[0]],
}))
