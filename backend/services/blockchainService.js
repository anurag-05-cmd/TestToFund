const { ethers } = require('ethers');

const TOKEN_ADDRESS = process.env.TOKEN_ADDRESS;
const RPC_URL = process.env.RPC_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

const ERC20_ABI = [
  'function balanceOf(address) view returns (uint256)',
  'function transfer(address to, uint256 amount) returns (bool)'
];

async function sendReward(to, amount) {
  // amount expected as integer token units (e.g., 2000 -> will be converted to 2000 * 10^18 below)
  if (!RPC_URL || !PRIVATE_KEY || !TOKEN_ADDRESS) {
    // fallback: behave like the stub so callers can function in dev without keys
    return {
      success: true,
      txHash: `0xFAKE_TX_${Date.now()}`,
    };
  }

  try {
    const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
    const token = new ethers.Contract(TOKEN_ADDRESS, ERC20_ABI, wallet);

    const amountUnits = ethers.utils.parseUnits(String(amount), 18);
    const tx = await token.transfer(to, amountUnits);
    const receipt = await tx.wait();

    return { success: true, txHash: receipt.transactionHash, receipt };
  } catch (err) {
    return { success: false, error: String(err) };
  }
}

module.exports = { sendReward };
