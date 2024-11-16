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
        redeemableLink: "0x0E2c9E13DEB5D2A638511F0C94E65491a8756032",
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
    
    // Polygon Amoy
    80002: {
        // redeemableLink: "0x71A7dac14d9FdE4396A800209c29d2Af2Ff6E6d7",
        // usdc: "0x41e94eb019c0762f9bfcf9fb1e58725bfb0e7582",
        redeemableLink: "0x38ecb7Aff1f657c7E84B2cFe23F6596Ce41E0aac",
        usdc: "0x3b3153fF11b5C73e29d1CfaF0A45bB3263872e9D",
        rpc: "wss://polygon-amoy-bor-rpc.publicnode.com",
        explorer: "https://www.oklink.com/amoy"
    },

    // Hedera Testnet
    296: {
        redeemableLink: "0x9719e29BcE3AF1ac6aF40D90e346Bcfd3D79fE25",
        usdc: "0x0000000000000000000000000000000000068cda",
        rpc: "https://testnet.hashio.io/api",
        explorer: "https://hashscan.io/testnet"
    },

    // Polygon Mainnet
    137: {
        redeemableLink: "",
        usdc: "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359",
        rpc: "https://polygon-mainnet.infura.io",
        explorer: explorers[137].explorers[0].url
    }
};

// Adding a function to access contracts by network ID
const getContractByNetworkId = (networkId) => {
    return contracts[networkId] || null;
};

export { contracts, getContractByNetworkId };