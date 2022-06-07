const HDWalletProvider = require("@truffle/hdwallet-provider");
require('dotenv').config()

const privateKeys = process.env.WALLET_PRIVATE_KEY || "";


module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*", // Match any network id
    },

    rinkeby: {
      provider: function () {
        return new HDWalletProvider(
          privateKeys.split(","), // Array of account private keys
          `https://rinkeby.infura.io/v3/${process.env.INFURA_API_KEY}` // Url to an Ethereum Node
        );
      },
      gas: 5000000,
      gasPrice: 20000000000, // 15 gwei
      network_id: 4,
    },
    polygon: {
      provider: function () {
        return new HDWalletProvider(
          privateKeys.split(","), // Array of account private keys
          `https://polygon-mainnet.infura.io/v3/${process.env.INFURA_API_KEY}` // Url to an Ethereum Node
        );
      },
      gas: 5000000,
      gasPrice: 35000000000, // 35 gwei
      network_id: 137,
    },
  },
  contracts_directory: "./contracts/",
  contracts_build_directory: "./contracts/abis/",
  compilers: {
    solc: {
      version: "^0.8.0",
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
};
