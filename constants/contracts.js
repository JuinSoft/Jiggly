import explorers from './explorers.json';
const contracts = {

    /*

        NOTE: For testing purposes, we are using the Mock USDC contract for testnets which is fully compatible with ERC20.
        The below contracts can be replaced with the actual USDC contract for mainnet.

    */

    // Ethereum Mainnet
    1: {
        redeemableLink: "", // Not supported yet
        usdc: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",  // Actual USDC Contract
        rpc: "https://mainnet.infura.io",
        explorer: explorers[1].explorers[0].url
    },
    //Ethereum Sepolia
    11155111: {
        redeemableLink: "",
        usdc: "",
        rpc: "wss://ethereum-sepolia-rpc.publicnode.com",
        explorer: explorers[11155111].explorers[0].url
    },
    // Unichain Testnet
    1301: {
        redeemableLink: "",
        usdc: "",
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
        redeemableLink: "",
        usdc: "",
        rpc: "wss://polygon-amoy-bor-rpc.publicnode.com",
        explorer: "https://www.oklink.com/amoy"
    },

    // Hedera Testnet
    296: {
        redeemableLink: "",
        usdc: "",
        rpc: "https://testnet.hashio.io/api",
        explorer: "https://hashscan.io/testnet"
    },

    // Polygon Mainnet
    137: {
        redeemableLink: "", // Not supported yet
        usdc: "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359",
        rpc: "https://polygon-mainnet.infura.io",
        explorer: explorers[137].explorers[0].url
    },

    //  Flow Testnet
    545: {
        redeemableLink: "", // Not supported yet
        usdc: "", // Actual USDC Contract
        rpc: "https://testnet.evm.nodes.onflow.org",
        explorer: "https://evm-testnet.flowscan.io"
    },

    // Unichain V4 Testnet
    1301: {
        redeemableLink: "", // Not supported yet
        usdc: "", // Actual USDC Contract
        rpc: "https://sepolia.unichain.org",
        explorer: explorers[1301].explorers[0].url
    },

    // Scroll Sepolia Testnet
    534351: {
        redeemableLink: "", // Not supported yet
        usdc: "", // Actual USDC Contract
        rpc: "https://sepolia.scroll.io",
        explorer: explorers[534351].explorers[0].url
    },

    // Mantle Testnet
    5003: {
        redeemableLink: "", // Not supported yet
        usdc: "", // Actual USDC Contract
        rpc: "https://rpc.sepolia.mantle.xyz/",
        explorer: explorers[5003].explorers[0].url
    },

    // Inco Rivest Testnet
    21097: {
        redeemableLink: "", // Not supported yet
        usdc: "", // Actual USDC Contract
        rpc: "https://validator.rivest.inco.org",
        explorer: "https://explorer.rivest.inco.org"
    },

    // Hedera Testnet
    296: {
        redeemableLink: "", // Not supported yet
        usdc: "", // Actual USDC Contract
        rpc: "https://testnet.hashio.io/api",
        explorer: "https://hashscan.io/testnet"
    },

    // Zircuit Testnet
    48899: {
        redeemableLink: "", // Not supported yet
        usdc: "", // Actual USDC Contract
        rpc: "https://zircuit1-testnet.liquify.com",
        explorer: "https://explorer.testnet.zircuit.com"
    },

    // Rootstock Testnet
    31: {
        redeemableLink: "", // Not supported yet
        usdc: "", // Actual USDC Contract
        rpc: "https://public-node.testnet.rsk.co",
        explorer: "https://explorer.testnet.rootstock.io/"
    },

    // Morpho Testnet
    2810: {
        redeemableLink: "", // Not supported yet
        usdc: "", // Actual USDC Contract
        rpc: "https://rpc-holesky.morphl2.io",
        explorer: explorers[2810].explorers[0].url
    },

    // Linea Sepolia Testnet
    59141: {
        redeemableLink: "", // Not supported yet
        usdc: "", // Actual USDC Contract
        rpc: "https://linea-sepolia.blockpi.network/v1/rpc/public",
        explorer: "https://sepolia.lineascan.build"
    }
};

// Adding a function to access contracts by network ID
const getContractByNetworkId = (networkId) => {
    return contracts[networkId] || null;
};

export { contracts, getContractByNetworkId };