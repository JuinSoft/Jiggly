import { defineChain } from 'viem'
import explorers from '../constants/explorers.json'

export const arbitrum = defineChain({
  id: 42161,
  name: 'Arbitrum',
  rpcUrls: {
    default: { http: ['https://arb1.arbitrum.io/rpc'] },
    public: { http: ['https://arb1.arbitrum.io/rpc'] },
  },
  blockExplorers: {
    default: {
      name: 'Arbitrum Explorer',
      url: explorers['42161'].explorers[0].url,
    },
  },
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
})

export const aurora = defineChain({
  id: 1313161554,
  name: 'Aurora',
  rpcUrls: {
    default: { http: ['https://mainnet.aurora.dev'] },
    public: { http: ['https://mainnet.aurora.dev'] },
  },
  blockExplorers: {
    default: {
      name: 'Aurora Explorer',
      url: explorers['1313161554'].explorers[0].url,
    },
  },
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
})

export const bnbSmartChain = defineChain({
  id: 56,
  name: 'BNB Smart Chain',
  rpcUrls: {
    default: { http: ['https://bsc-dataseed.binance.org/'] },
    public: { http: ['https://bsc-dataseed.binance.org/'] },
  },
  blockExplorers: {
    default: {
      name: 'BSC Explorer',
      url: explorers['56'].explorers[0].url,
    },
  },
  nativeCurrency: {
    decimals: 18,
    name: 'Binance Coin',
    symbol: 'BNB',
  },
})

export const base = defineChain({
  id: 8453,
  name: 'Base',
  rpcUrls: {
    default: { http: ['https://mainnet.base.org'] },
    public: { http: ['https://mainnet.base.org'] },
  },
  blockExplorers: {
    default: {
      name: 'Base Explorer',
      url: explorers['8453'].explorers[0].url,
    },
  },
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
})

export const celo = defineChain({
  id: 42220,
  name: 'Celo',
  rpcUrls: {
    default: { http: ['https://forno.celo.org'] },
    public: { http: ['https://forno.celo.org'] },
  },
  blockExplorers: {
    default: {
      name: 'Celo Explorer',
      url: explorers['42220'].explorers[0].url,
    },
  },
  nativeCurrency: {
    decimals: 18,
    name: 'Celo',
    symbol: 'CELO',
  },
})

export const chiliz = defineChain({
    id: 88888,
    name: 'Chiliz',
    rpcUrls: {
      default: { http: ['https://rpc.chiliz.com'] },
      public: { http: ['https://rpc.chiliz.com'] },
    },
    nativeCurrency: {
      decimals: 18,
      name: 'Chiliz',
      symbol: 'CHZ',
    },
});

export const ethereum = defineChain({
  id: 1,
  name: 'Ethereum',
  rpcUrls: {
    default: { http: ['https://mainnet.infura.io/v3/YOUR-PROJECT-ID'] },
    public: { http: ['https://mainnet.infura.io/v3/YOUR-PROJECT-ID'] },
  },
  blockExplorers: {
    default: {
      name: 'Etherscan',
      url: explorers['1'].explorers[0].url,
    },
  },
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
})

export const gnosis = defineChain({
  id: 100,
  name: 'Gnosis',
  rpcUrls: {
    default: { http: ['https://rpc.gnosischain.com'] },
    public: { http: ['https://rpc.gnosischain.com'] },
  },
  blockExplorers: {
    default: {
      name: 'Gnosis Explorer',
      url: explorers['100'].explorers[0].url,
    },
  },
  nativeCurrency: {
    decimals: 18,
    name: 'Gnosis',
    symbol: 'XDAI',
  },
})

export const optimism = defineChain({
  id: 10,
  name: 'Optimism',
  rpcUrls: {
    default: { http: ['https://mainnet.optimism.io'] },
    public: { http: ['https://mainnet.optimism.io'] },
  },
  blockExplorers: {
    default: {
      name: 'Optimism Explorer',
      url: explorers['10'].explorers[0].url,
    },
  },
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
})

export const polygon = defineChain({
  id: 137,
  name: 'Polygon',
  rpcUrls: {
    default: { http: ['https://polygon-rpc.com'] },
    public: { http: ['https://polygon-rpc.com'] },
  },
  blockExplorers: {
    default: {
      name: 'Polygon Explorer',
      url: explorers['137'].explorers[0].url,
    },
  },
  nativeCurrency: {
    decimals: 18,
    name: 'Matic',
    symbol: 'MATIC',
  },
})

export const zora = defineChain({
  id: 7777777,
  name: 'Zora',
  rpcUrls: {
    default: { http: ['https://rpc.zora.energy'] },
    public: { http: ['https://rpc.zora.energy'] },
  },
  blockExplorers: {
    default: {
      name: 'Zora Explorer',
      url: explorers['7777777'].explorers[0].url,
    },
  },
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
})

export const zksync = defineChain({
  id: 324,
  name: 'zkSync',
  rpcUrls: {
    default: { http: ['https://mainnet.era.zksync.io'] },
    public: { http: ['https://mainnet.era.zksync.io'] },
  },
  blockExplorers: {
    default: {
      name: 'zkSync Explorer',
      url: explorers['324'].explorers[0].url,
    },
  },
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
})

export const bitkub = defineChain({
  id: 96,
  name: 'Bitkub',
  rpcUrls: {
    default: { http: ['https://rpc.bitkubchain.io'] },
    public: { http: ['https://rpc.bitkubchain.io'] }
  },
  blockExplorers: {
    default: { name: "Bitkub", url: explorers['96'].explorers[0].url }
  },
  nativeCurrency: {
    decimals: 18,
    name: 'Bitkub Coin',
    symbol: 'KUB'
  },
})

const supportedNetworks = [
  arbitrum,
  aurora,
  bnbSmartChain,
  base,
  celo,
  chiliz,
  ethereum,
  gnosis,
  optimism,
  polygon,
  zora,
  zksync,
]

export const evmNetworks = supportedNetworks.map((chain) => ({
  blockExplorerUrls: [chain.blockExplorers?.default?.url!],
  chainId: chain.id,
  chainName: chain.name,
  iconUrls: ['https://app.dynamic.xyz/assets/networks/eth.svg'],
  name: chain.name,
  nativeCurrency: chain.nativeCurrency,
  networkId: chain.id,
  rpcUrls: [chain.rpcUrls.default.http[0]],
}))
