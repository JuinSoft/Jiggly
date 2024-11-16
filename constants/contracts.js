import explorers from './explorers.json';
const contracts = {
    //Ethereum Sepolia
    11155111: {
        redeemableLink: "0xf17c556e24085aB1780ac4e44E3Cd4b6aF7a23bD",
        usdc: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238",
        rpc: "wss://ethereum-sepolia-rpc.publicnode.com",
        explorer: explorers[11155111].explorers[0].url
    },
    // Unichain Testnet
    1301: {
        redeemableLink: "0xd6f8084fFa6aF6B6b0E1493479a21456457ee071",
        usdc: "0x31d0220469e10c4E71834a79b1f276d740d3768F",
        rpc: "https://sepolia.unichain.org",
        explorer: explorers[1301].explorers[0].url
    },

    // Filecoin Calibration testnet
    314159: {
        redeemableLink: "0xd6f8084fFa6aF6B6b0E1493479a21456457ee071",
        usdc: "N/A",
        rpc: "https://filecoin-calibration.drpc.org",
        explorer: explorers[314159].explorers[0].url
    },
    
    // Polygon Amos
    80002: {
        redeemableLink: "0xd6f8084fFa6aF6B6b0E1493479a21456457ee071",
        usdc: "0x41e94eb019c0762f9bfcf9fb1e58725bfb0e7582",
        rpc: "wss://polygon-amoy-bor-rpc.publicnode.com",
        explorer: "https://www.oklink.com/amoy"
    },

    // Hedera Testnet
    296: {
        redeemableLink: "0xd6f8084fFa6aF6B6b0E1493479a21456457ee071",
        usdc: "0.0.429274",
        rpc: "https://testnet.hashio.io/api",
        explorer: "https://hashscan.io/testnet"
    }
};

// Adding a function to access contracts by network ID
const getContractByNetworkId = (networkId) => {
    return contracts[networkId] || null;
};

export { contracts, getContractByNetworkId };