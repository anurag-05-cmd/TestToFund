require("dotenv").config({ path: __dirname + "/.env" });
require("@nomicfoundation/hardhat-toolbox");

const { RPC_URL, PRIVATE_KEY, CHAIN_ID } = process.env;

module.exports = {
  solidity: "0.8.19",
  networks: {
    testnet: {
      url: RPC_URL || "https://rpc.awakening.bdagscan.com/",
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
      chainId: parseInt(CHAIN_ID) || 1043
    },
    hardhat: {}
  }
};