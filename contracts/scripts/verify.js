require("dotenv").config();
const { ethers } = require("hardhat");

async function main() {
  const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

  const tokenAddress = process.env.TOKEN_ADDRESS;

  // ERC20 ABI (only needed parts)
  const erc20ABI = [
    "function balanceOf(address owner) view returns (uint256)",
    "function transfer(address to, uint256 value) returns (bool)"
  ];

  const token = new ethers.Contract(tokenAddress, erc20ABI, wallet);

  // Receiver BDAG testnet wallet
  const to = "0x74E61884E61Eb483AF2C076b48D99A0Baa96AD67"; // Anurag
  const amount = ethers.utils.parseUnits("2000", 18); // 2000 TTF

  // Show sender balance before
  const balanceBefore = await token.balanceOf(wallet.address);
  console.log(`Sender balance before: ${ethers.utils.formatUnits(balanceBefore, 18)} TTF`);

  console.log(`🚀 Sending 2000 TTF to ${to}...`);
  const tx = await token.transfer(to, amount);
  await tx.wait();

  // Print tx hash + BDAGScan URL
  console.log("✅ Transfer confirmed!");
  console.log("Transaction Hash:", tx.hash);
  console.log(`View on Explorer: https://primordial.bdagscan.com/tx/${tx.hash}?chain=EVM`);

  // Show balances after
  const balanceAfter = await token.balanceOf(wallet.address);
  console.log(`Sender balance after: ${ethers.utils.formatUnits(balanceAfter, 18)} TTF`);

  const receiverBalance = await token.balanceOf(to);
  console.log(`Receiver balance: ${ethers.utils.formatUnits(receiverBalance, 18)} TTF`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
