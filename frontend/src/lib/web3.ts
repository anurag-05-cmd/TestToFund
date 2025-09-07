import { ethers } from "ethers";

// Add global type for window.ethereum
declare global {
  interface Window {
    ethereum?: any;
  }
}

// --- Network Config ---
export const NETWORK_CONFIG = {
  chainId: 1043,
  chainName: "BlockDAG Testnet",
  nativeCurrency: {
    name: "BDAG",
    symbol: "BDAG",
    decimals: 18
  },
  rpcUrls: ["https://rpc.primordial.bdagscan.com"],
  blockExplorerUrls: ["https://primordial.bdagscan.com/"]
};

export const NETWORK_NAME = NETWORK_CONFIG.chainName;
export const CHAIN_ID = NETWORK_CONFIG.chainId;
export const RPC_URL = NETWORK_CONFIG.rpcUrls[0];
export const EXPLORER_URL = NETWORK_CONFIG.blockExplorerUrls[0];
export const TOKEN_ADDRESS = "0xC02953cdC83C79dB721A25a6d9F0bf5BcC530317";

// --- Token Config ---
export const TOKEN_CONFIG = {
  address: TOKEN_ADDRESS,
  symbol: "TTF",
  decimals: 18,
  name: "TestToFund Token"
};

// --- ERC20 ABI ---
export const ERC20_ABI = [
  "function balanceOf(address) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
  "function name() view returns (string)",
  "function totalSupply() view returns (uint256)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function approve(address spender, uint256 amount) returns (bool)"
];

// --- Helpers ---
export function formatUnits(value: ethers.BigNumberish, decimals = 18) {
  return ethers.formatUnits(value, decimals);
}

export function parseUnits(value: string, decimals = 18) {
  return ethers.parseUnits(value, decimals);
}

export function formatAddress(address: string): string {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

// --- Get injected provider (MetaMask / Trust Wallet) ---
export async function getProvider(): Promise<ethers.BrowserProvider> {
  if (typeof window !== "undefined" && window.ethereum) {
    const provider = new ethers.BrowserProvider(window.ethereum);
    return provider;
  }
  throw new Error("No wallet found. Please install MetaMask or use Trust Wallet.");
}

// --- Connect wallet and add BDAG Testnet ---
export async function connectWallet(): Promise<{
  provider: ethers.BrowserProvider;
  address: string;
  isCorrectNetwork: boolean;
}> {
  const provider = await getProvider();
  
  // Step 1: Request account access first
  await provider.send("eth_requestAccounts", []);
  const signer = await provider.getSigner();
  const address = await signer.getAddress();
  
  // Step 2: Check current network
  const net = await provider.getNetwork();
  const currentChainId = Number(net.chainId);
  const isCorrectNetwork = currentChainId === CHAIN_ID;
  
  // Step 3: Add/switch to BlockDAG Testnet if needed
  if (!isCorrectNetwork) {
    console.log(`Currently on chain ${currentChainId}, switching to ${CHAIN_ID}`);
    
    try {
      await addBDAGNetwork();
      console.log('BlockDAG Testnet added/switched successfully');
      
      // Wait a moment for network switch to complete
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error('Failed to add/switch to BlockDAG Testnet:', error);
      throw new Error('Please manually add BlockDAG Testnet to your wallet and try again');
    }
  }
  
  // Step 4: Try to add TTF token to wallet (only if not already present)
  try {
    await addTTFToken();
    console.log('TTF Token check/addition completed');
  } catch (error) {
    console.log('Failed to add TTF token (user may have declined or token already exists):', error);
    // Don't throw error here as token addition is optional
  }
  
  return {
    provider,
    address,
    isCorrectNetwork: true // We've ensured we're on the correct network
  };
}

// --- Add BlockDAG Testnet to wallet ---
export async function addBDAGNetwork(): Promise<void> {
  if (!window.ethereum) {
    throw new Error('MetaMask not found');
  }

  try {
    // First try to switch to the network
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: `0x${CHAIN_ID.toString(16)}` }],
    });
  } catch (switchError: any) {
    // If network doesn't exist (error 4902), add it
    if (switchError.code === 4902) {
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: `0x${CHAIN_ID.toString(16)}`,
            chainName: NETWORK_CONFIG.chainName,
            nativeCurrency: NETWORK_CONFIG.nativeCurrency,
            rpcUrls: NETWORK_CONFIG.rpcUrls,
            blockExplorerUrls: NETWORK_CONFIG.blockExplorerUrls,
          }],
        });
      } catch (addError: any) {
        console.error('Failed to add network:', addError);
        throw new Error('Failed to add BlockDAG Testnet. Please add it manually.');
      }
    } else if (switchError.code === 4001) {
      // User rejected the request
      throw new Error('Please approve the network switch to continue.');
    } else {
      console.error('Network switch error:', switchError);
      throw switchError;
    }
  }
}

// --- Check if token is already in wallet ---
export async function isTokenInWallet(): Promise<boolean> {
  if (!window.ethereum) {
    return false;
  }

  try {
    // Get the current chain ID
    const chainId = await window.ethereum.request({ method: 'eth_chainId' });
    
    // Only check if we're on the correct network
    if (parseInt(chainId, 16) !== CHAIN_ID) {
      return false;
    }

    // Try to get token balance - if token exists, this won't throw
    const provider = new ethers.BrowserProvider(window.ethereum);
    const tokenContract = new ethers.Contract(TOKEN_ADDRESS, ERC20_ABI, provider);
    const accounts = await provider.listAccounts();
    
    if (accounts.length === 0) {
      return false;
    }

    // Try to call balanceOf - if token is added, this should work
    await tokenContract.balanceOf(accounts[0].address);
    return true;
  } catch (error) {
    console.log('Token not in wallet or error checking:', error);
    return false;
  }
}

// --- Add TTF Token to wallet ---
export async function addTTFToken(): Promise<void> {
  if (!window.ethereum) {
    throw new Error('MetaMask not found');
  }

  // Check if token already exists
  const tokenExists = await isTokenInWallet();
  if (tokenExists) {
    console.log('TTF Token already exists in wallet');
    return;
  }

  await window.ethereum.request({
    method: 'wallet_watchAsset',
    params: {
      type: 'ERC20',
      options: {
        address: TOKEN_CONFIG.address,
        symbol: TOKEN_CONFIG.symbol,
        decimals: TOKEN_CONFIG.decimals,
        image: '', // Optional: You can add a token logo URL here
      },
    },
  });
}

// --- Check if user is on correct network ---
export async function isOnBDAGNetwork(): Promise<boolean> {
  try {
    const provider = await getProvider();
    const network = await provider.getNetwork();
    return Number(network.chainId) === CHAIN_ID;
  } catch (error) {
    return false;
  }
}

// --- Get current network info ---
export async function getCurrentNetwork(): Promise<{
  chainId: number;
  name: string;
  isCorrect: boolean;
}> {
  try {
    const provider = await getProvider();
    const network = await provider.getNetwork();
    
    return {
      chainId: Number(network.chainId),
      name: network.name || `Chain ${network.chainId}`,
      isCorrect: Number(network.chainId) === CHAIN_ID
    };
  } catch (error) {
    throw new Error("Could not get network information");
  }
}

// --- Check if wallet is connected ---
export async function isWalletConnected(): Promise<{
  connected: boolean;
  address?: string;
}> {
  try {
    const provider = await getProvider();
    const accounts = await provider.listAccounts();
    
    if (accounts.length > 0) {
      return {
        connected: true,
        address: accounts[0].address
      };
    }
    
    return { connected: false };
  } catch (error) {
    return { connected: false };
  }
}