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
        redeemableLink: "0xcB32c2df9C31A41Ce003c10aaCd1896dE262b1c8",
        usdc: "0xD7EbB8244f65809F5a8De58456B019b0CD498e0B",
        rpc: "https://sepolia.drpc.org",
        explorer: explorers[11155111].explorers[0].url
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
        redeemableLink: "0x04c6232C06f2db148061E412e9Ca2242e09095a2",
        usdc: "0x7eF93513e6f693da2D0b5719820E0dD4eB7e919b",
        rpc: "https://rpc-amoy.polygon.technology",
        explorer: "https://www.oklink.com/amoy"
    },

    // Hedera Testnet
    296: {
        redeemableLink: "0xe468b64D4c59AA00C0287e29FFdbA006E0F4468b",
        usdc: "0xBb95A888B4EBF96f8A7279Ea7A49A69cd4b12Ac9",
        rpc: "https://testnet.hashio.io/api",
        explorer: "https://hashscan.io/testnet"  //Account ID: 0.0.5138157
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
        redeemableLink: "0xe468b64D4c59AA00C0287e29FFdbA006E0F4468b",
        usdc: "0xBb95A888B4EBF96f8A7279Ea7A49A69cd4b12Ac9",
        rpc: "https://testnet.evm.nodes.onflow.org",
        explorer: "https://evm-testnet.flowscan.io"
    },

    // Unichain V4 Testnet
    1301: {
        redeemableLink: "0x2418c9Ff4494b37227b5c525601A64F8c58c4152",
        usdc: "0x71A7dac14d9FdE4396A800209c29d2Af2Ff6E6d7",
        rpc: "https://sepolia.unichain.org",
        explorer: explorers[1301].explorers[0].url
    },

    // Scroll Sepolia Testnet
    534351: {
        redeemableLink: "0xe468b64D4c59AA00C0287e29FFdbA006E0F4468b",
        usdc: "0xBb95A888B4EBF96f8A7279Ea7A49A69cd4b12Ac9",
        rpc: "https://sepolia.scroll.io",
        explorer: explorers[534351].explorers[0].url
    },

    // Mantle Testnet
    5003: {
        redeemableLink: "0xe468b64D4c59AA00C0287e29FFdbA006E0F4468b",
        usdc: "0xBb95A888B4EBF96f8A7279Ea7A49A69cd4b12Ac9",
        rpc: "https://rpc.sepolia.mantle.xyz/",
        explorer: explorers[5003].explorers[0].url
    },

    // Inco Rivest Testnet
    21097: {
        redeemableLink: "0xe468b64D4c59AA00C0287e29FFdbA006E0F4468b",
        usdc: "0xBb95A888B4EBF96f8A7279Ea7A49A69cd4b12Ac9",
        rpc: "https://validator.rivest.inco.org",
        explorer: "https://explorer.rivest.inco.org"
    },

    // Zircuit Testnet
    48899: {
        redeemableLink: "0xe468b64D4c59AA00C0287e29FFdbA006E0F4468b",
        usdc: "0xBb95A888B4EBF96f8A7279Ea7A49A69cd4b12Ac9",
        rpc: "https://zircuit1-testnet.liquify.com",
        explorer: "https://explorer.testnet.zircuit.com"
    },

    // Rootstock Testnet
    31: {
        redeemableLink: "",
        usdc: "",
        rpc: "https://public-node.testnet.rsk.co",
        explorer: "https://explorer.testnet.rootstock.io/"
    },

    // Morpho Testnet
    2810: {
        redeemableLink: "",
        usdc: "",
        rpc: "https://rpc-holesky.morphl2.io",
        explorer: explorers[2810].explorers[0].url
    },

    // Linea Sepolia Testnet
    59141: {
        redeemableLink: "",
        usdc: "",
        rpc: "https://linea-sepolia.blockpi.network/v1/rpc/public",
        explorer: "https://sepolia.lineascan.build"
    }
};

// Adding a function to access contracts by network ID
const getContractByNetworkId = (networkId) => {
    return contracts[networkId] || null;
};

export { contracts, getContractByNetworkId };