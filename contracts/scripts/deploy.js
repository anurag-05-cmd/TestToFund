const hre = require("hardhat");

async function main() {
  console.log("Deploying TestToFund contract...");

  // Get the deployer account
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  // Check deployer balance
  const balance = await deployer.getBalance();
  console.log("Account balance:", hre.ethers.utils.formatEther(balance), "ETH");

  // Initial supply: 1 billion tokens with 18 decimals
  const initialSupply = hre.ethers.utils.parseEther("1000000000");

  // Deploy the contract
  const TestToFund = await hre.ethers.getContractFactory("TestToFund");
  const token = await TestToFund.deploy(initialSupply);

  await token.deployed();

  console.log("TestToFund deployed to:", token.address);
  console.log("Initial supply:", hre.ethers.utils.formatEther(initialSupply), "TTF");

  // Log deployment info for records
  console.log("\n--- Deployment Summary ---");
  console.log("Network:", hre.network.name);
  const network = await hre.ethers.provider.getNetwork();
  console.log("Chain ID:", network.chainId.toString());
  console.log("Contract Address:", token.address);
  console.log("Deployer:", deployer.address);
  console.log("Transaction Hash:", token.deployTransaction.hash);

  return token.address;
}

main()
  .then((address) => {
    console.log("\nDeployment successful!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Deployment failed:", error);
    process.exit(1);
  });
