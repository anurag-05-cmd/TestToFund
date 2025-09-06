const hre = require("hardhat");
const { ethers } = hre;

async function main() {
  const TOKEN_ADDRESS = "0x1fC39F5a1497C042A47054D94c6f473e39598853";
  const token = await ethers.getContractAt("BDAGToken", TOKEN_ADDRESS);

  const totalSupply = await token.totalSupply();
  console.log("Total Supply:", ethers.utils.formatUnits(totalSupply, 18), "TTF");

  const deployer = "0x0b5d9566909BC47694bbD42F6dF300565A2523e9"; // your wallet
  const balDeployer = await token.balanceOf(deployer);
  console.log("Your Wallet Balance:", ethers.utils.formatUnits(balDeployer, 18), "TTF");

  // Try checking contract’s own balance
  const balContract = await token.balanceOf(TOKEN_ADDRESS);
  console.log("Token Contract Balance:", ethers.utils.formatUnits(balContract, 18), "TTF");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
