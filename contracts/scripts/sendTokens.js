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

  // Receiver BDAG testnet wallet - make this configurable via env var TO or CLI arg
  const to = process.env.TO || process.argv[2];
  if (!to || !ethers.utils.isAddress(to)) {
    throw new Error('Recipient address not provided or invalid. Set TO env var or pass as first CLI argument');
  }
  const amount = ethers.utils.parseUnits("2000", 18); // 2000 TTF

  console.log(`Token Address: ${tokenAddress}`);
  console.log(`From (sender): ${wallet.address}`);
  console.log(`To (recipient): ${to}`);
  console.log(`Amount (raw): ${amount.toString()}`);
  console.log(`Amount (TTF): ${ethers.utils.formatUnits(amount, 18)}`);

  // Show sender balance before
  const balanceBefore = await token.balanceOf(wallet.address);
  console.log(`Sender balance before: ${ethers.utils.formatUnits(balanceBefore, 18)} TTF`);

  // Check if token contract exists at address
  const code = await provider.getCode(tokenAddress);
  if (code === "0x") {
    throw new Error(`No contract deployed at ${tokenAddress}`);
  }

  try {
    console.log(`🚀 Sending 2000 TTF to ${to}...`);
    const tx = await token.transfer(to, amount);
    const receipt = await tx.wait();

    if (receipt.status !== 1) {
      throw new Error("Transaction failed (status != 1)");
    }

    // Print tx hash + BDAGScan URL
    console.log("✅ Transfer confirmed!");
    console.log("Transaction Hash:", tx.hash);
    console.log(`View on Explorer: https://Awakening.bdagscan.com/tx/${tx.hash}?chain=EVM`);

    // Show balances after
    const balanceAfter = await token.balanceOf(wallet.address);
    console.log(`Sender balance after: ${ethers.utils.formatUnits(balanceAfter, 18)} TTF`);

    const receiverBalance = await token.balanceOf(to);
    console.log(`Receiver balance: ${ethers.utils.formatUnits(receiverBalance, 18)} TTF`);
  } catch (err) {
    // Try to decode revert reason if possible
    if (err && err.error && err.error.data) {
      const revertData = err.error.data;
      try {
        const reason = ethers.utils.toUtf8String('0x' + revertData.substr(138));
        console.error('Revert reason:', reason);
      } catch (decodeErr) {
        console.error('Failed to decode revert reason:', decodeErr);
      }
    }
    throw new Error('Transfer failed: ' + (err && err.message ? err.message : err));
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
