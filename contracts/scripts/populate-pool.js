/**
 * Populate pool with tokens (requires deployer to hold tokens)
 * Usage:
 *  cd contracts
 *  npx hardhat run scripts/populate-pool.js --network testnet --POOL=<poolAddress> --AMOUNT=<tokens>
 */

const fs = require("fs");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });
const hre = require("hardhat");
const ethers = hre.ethers;

function readDeployedEnv() {
  const p = path.join(__dirname, "..", "deployed.env");
  if (!fs.existsSync(p)) return {};
  const raw = fs.readFileSync(p, "utf8");
  return raw.split(/\r?\n/).filter(Boolean).reduce((acc, line) => {
    const [k, v] = line.split("=");
    acc[k] = v;
    return acc;
  }, {});
}

async function main() {
  const poolArg = process.env.npm_config_POOL || process.env.POOL || process.argv.find(a => a.startsWith("--POOL="))?.split("=")[1];
  const amountArg = process.env.npm_config_AMOUNT || process.env.AMOUNT || process.argv.find(a => a.startsWith("--AMOUNT="))?.split("=")[1] || "1000";

  const deployed = readDeployedEnv();
  const tokenAddress = process.env.TOKEN_ADDRESS || deployed.TOKEN_ADDRESS;
  const poolAddress = poolArg || deployed.POOL_CONTRACT_ADDRESS;

  if (!tokenAddress) {
    console.error("TOKEN_ADDRESS not found in env or deployed.env");
    process.exit(1);
  }
  if (!poolAddress) {
    console.error("POOL address not provided (env, --POOL or deployed.env)");
    process.exit(1);
  }

  const [deployer] = await ethers.getSigners();
  const ERC20 = await ethers.getContractAt("IERC20", tokenAddress);
  const amount = ethers.parseUnits(amountArg, 18);

  const tx = await ERC20.connect(deployer).transfer(poolAddress, amount);
  const receipt = await tx.wait();
  console.log("Populated pool tx:", receipt.transactionHash);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});