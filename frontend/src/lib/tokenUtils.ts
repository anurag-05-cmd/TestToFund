import { ethers } from 'ethers';

const TOKEN_ADDRESS = '0xC02953cdC83C79dB721A25a6d9F0bf5BcC530317';
const RPC_URL = 'https://rpc.primordial.bdagscan.com/';

// ERC20 ABI for balance checking
const ERC20_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
  "function name() view returns (string)"
];

export async function checkTokenBalance(walletAddress: string) {
  try {
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const contract = new ethers.Contract(TOKEN_ADDRESS, ERC20_ABI, provider);
    
    const [balance, decimals, symbol] = await Promise.all([
      contract.balanceOf(walletAddress),
      contract.decimals(),
      contract.symbol()
    ]);
    
    return {
      balance: ethers.formatUnits(balance, decimals),
      symbol,
      raw: balance,
      decimals
    };
  } catch (error) {
    console.error('Error checking token balance:', error);
    throw error;
  }
}

export async function verifyTransaction(txHash: string) {
  try {
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const receipt = await provider.getTransactionReceipt(txHash);
    
    if (!receipt) {
      return { status: 'pending', confirmed: false };
    }
    
    return {
      status: receipt.status === 1 ? 'success' : 'failed',
      confirmed: true,
      blockNumber: receipt.blockNumber,
      gasUsed: receipt.gasUsed.toString()
    };
  } catch (error: any) {
    console.error('Error verifying transaction:', error);
    return { status: 'unknown', confirmed: false, error: error?.message || 'Unknown error' };
  }
}

export function getExplorerUrl(txHash: string) {
  return `https://primordial.bdagscan.com/tx/${txHash}?chain=EVM`;
}
