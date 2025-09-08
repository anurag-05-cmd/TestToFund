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

// Balance monitoring for notifications
let previousBalance: string | null = null;
let balanceMonitorInterval: NodeJS.Timeout | null = null;

export function startBalanceMonitoring(
  walletAddress: string, 
  onBalanceChange: (newBalance: string, difference: string) => void
) {
  // Clear any existing monitoring
  stopBalanceMonitoring();
  
  // Get initial balance
  checkTokenBalance(walletAddress).then(result => {
    previousBalance = result.balance;
  }).catch(console.error);
  
  // Monitor balance every 10 seconds
  balanceMonitorInterval = setInterval(async () => {
    try {
      const result = await checkTokenBalance(walletAddress);
      const currentBalance = result.balance;
      
      if (previousBalance !== null && currentBalance !== previousBalance) {
        const prev = parseFloat(previousBalance);
        const curr = parseFloat(currentBalance);
        const difference = (curr - prev).toFixed(2);
        
        // Only notify for positive changes (deposits)
        if (curr > prev) {
          onBalanceChange(currentBalance, difference);
        }
        
        previousBalance = currentBalance;
      } else if (previousBalance === null) {
        previousBalance = currentBalance;
      }
    } catch (error) {
      console.error('Balance monitoring error:', error);
    }
  }, 10000); // Check every 10 seconds
}

export function stopBalanceMonitoring() {
  if (balanceMonitorInterval) {
    clearInterval(balanceMonitorInterval);
    balanceMonitorInterval = null;
  }
  previousBalance = null;
}
