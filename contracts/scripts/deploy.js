// scripts/deploy.js
const fs = require("fs");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

async function main() {
  const hre = require("hardhat");
  const ethers = hre.ethers;
  const deployer = (await ethers.getSigners())[0];

  console.log(`🚀 Using deployer: ${deployer.address}`);

  // Deploy token, minting entire supply to deployer
  const Token = await ethers.getContractFactory("BDAGToken");
  const initialSupply = ethers.utils.parseUnits("1000000", 18); // 1M TTF
  const token = await Token.connect(deployer).deploy(initialSupply);
  await token.deployed();
  console.log(`✅ Deployed BDAGToken (TTF) at: ${token.address}`);

  // Balances
  const balance = await token.balanceOf(deployer.address);
  console.log(`Deployer balance: ${ethers.utils.formatUnits(balance, 18)} TTF`);

  // Write only TOKEN_ADDRESS, because your wallet is the pool
  const outPath = path.join(__dirname, "..", "deployed.env");
  const content = `TOKEN_ADDRESS=${token.address}\nPOOL_WALLET=${deployer.address}\n`;
  fs.writeFileSync(outPath, content, "utf8");
  console.log(`Wrote contracts/deployed.env with TOKEN_ADDRESS and POOL_WALLET`);
}

main()
  .then(() => process.exit(0))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
