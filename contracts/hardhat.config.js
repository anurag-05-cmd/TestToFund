require("dotenv").config({ path: __dirname + "/.env" });
require("@nomicfoundation/hardhat-toolbox");

const { RPC_URL, PRIVATE_KEY } = process.env;

module.exports = {
  solidity: "0.8.19",
  networks: {
    testnet: {
      url: RPC_URL || "https://rpc.primordial.bdagscan.com/",
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : []
    },
    hardhat: {}
  }
};