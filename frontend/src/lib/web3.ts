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
  chainName: "Primordial BlockDAG Testnet",
  nativeCurrency: {
    name: "BDAG",
    symbol: "BDAG",
    decimals: 18
  },
  rpcUrls: ["https://rpc.primordial.bdagscan.com/"],
  blockExplorerUrls: ["https://primordial.bdagscan.com/"],
  faucetUrls: ["https://primordial.bdagscan.com/faucet"]
};

export const NETWORK_NAME = NETWORK_CONFIG.chainName;
export const CHAIN_ID = NETWORK_CONFIG.chainId;
export const RPC_URL = NETWORK_CONFIG.rpcUrls[0];
export const EXPLORER_URL = NETWORK_CONFIG.blockExplorerUrls[0];
export const TOKEN_ADDRESS = "0xC02953cdC83C79dB721A25a6d9F0bf5BcC530317";

// --- Cache Keys ---
const CACHE_KEY_NETWORK_ADDED = `ttf_network_added_${CHAIN_ID}`;
const CACHE_KEY_TOKEN_ADDED = `ttf_token_added_${TOKEN_ADDRESS}`;

// --- Cache Management ---
function hasNetworkBeenAdded(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(CACHE_KEY_NETWORK_ADDED) === 'true';
}

function markNetworkAsAdded(): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(CACHE_KEY_NETWORK_ADDED, 'true');
  }
}

function hasTokenBeenAdded(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(CACHE_KEY_TOKEN_ADDED) === 'true';
}

function markTokenAsAdded(): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(CACHE_KEY_TOKEN_ADDED, 'true');
  }
}

function clearWalletSetupCache(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(CACHE_KEY_NETWORK_ADDED);
    localStorage.removeItem(CACHE_KEY_TOKEN_ADDED);
    console.log('🗑️ Wallet setup cache cleared');
  }
}

// Export the clear function for manual cache clearing if needed
export { clearWalletSetupCache };

// --- Debug function to check cache status ---
export function getWalletSetupCacheStatus(): {
  networkAdded: boolean;
  tokenAdded: boolean;
} {
  return {
    networkAdded: hasNetworkBeenAdded(),
    tokenAdded: hasTokenBeenAdded()
  };
}

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

// --- Detect wallet type ---
export function detectWalletType(): string {
  if (typeof window === "undefined" || !window.ethereum) {
    return 'none';
  }
  
  if (window.ethereum.isMetaMask) {
    return 'metamask';
  }
  
  if (window.ethereum.isTrust) {
    return 'trust';
  }
  
  if (window.ethereum.isCoinbaseWallet) {
    return 'coinbase';
  }
  
  if (window.ethereum.isWalletConnect) {
    return 'walletconnect';
  }
  
  return 'unknown';
}

// --- Check if wallet supports programmatic network addition ---
export function supportsNetworkSwitching(): boolean {
  return typeof window !== "undefined" && 
         window.ethereum && 
         typeof window.ethereum.request === 'function';
}

// --- Get wallet installation status and recommendations ---
export function getWalletRecommendations(): {
  hasWallet: boolean;
  walletType: string;
  supportsAutoSetup: boolean;
  installUrl?: string;
} {
  const walletType = detectWalletType();
  const hasWallet = walletType !== 'none';
  const supportsAutoSetup = supportsNetworkSwitching();
  
  let installUrl;
  if (!hasWallet) {
    installUrl = 'https://metamask.io/download/';
  }
  
  return {
    hasWallet,
    walletType,
    supportsAutoSetup,
    installUrl
  };
}

// --- Connect wallet and add BDAG Testnet ---
export async function connectWallet(): Promise<{
  provider: ethers.BrowserProvider;
  address: string;
  isCorrectNetwork: boolean;
  networkSwitched: boolean;
  tokenAdded: boolean;
}> {
  const provider = await getProvider();
  
  // Step 1: Request account access first
  console.log('🔐 Requesting wallet access...');
  await provider.send("eth_requestAccounts", []);
  const signer = await provider.getSigner();
  const address = await signer.getAddress();
  console.log('✅ Wallet connected:', formatAddress(address));
  
  // Step 2: Check current network
  const net = await provider.getNetwork();
  const currentChainId = Number(net.chainId);
  const isCorrectNetwork = currentChainId === CHAIN_ID;
  let networkSwitched = false;
  
  console.log(`🌐 Current network: Chain ID ${currentChainId}`);
  
  // Step 3: Add/switch to BlockDAG Testnet if needed
  if (!isCorrectNetwork) {
    // Check if we've already added this network before
    const networkAlreadyAdded = hasNetworkBeenAdded();
    
    if (networkAlreadyAdded) {
      console.log('🔄 Network was previously added, attempting silent switch...');
      try {
        // Try silent switch first since we know the network exists
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: `0x${CHAIN_ID.toString(16)}` }],
        });
        console.log('✅ Silently switched to BlockDAG Testnet');
        networkSwitched = true;
      } catch (silentSwitchError: any) {
        console.log('⚠️ Silent switch failed, falling back to full setup');
        // Fall back to normal process if silent switch fails
        await addBDAGNetwork();
        networkSwitched = true;
      }
    } else {
      console.log(`🔄 Switching from chain ${currentChainId} to ${CHAIN_ID} (${NETWORK_CONFIG.chainName})`);
      
      try {
        await addBDAGNetwork();
        networkSwitched = true;
        markNetworkAsAdded(); // Cache that we've added this network
        console.log('✅ BlockDAG Testnet added/switched successfully');
      } catch (error: any) {
        console.error('❌ Failed to add/switch to BlockDAG Testnet:', error);
        if (error.code === 4001) {
          throw new Error('Please approve the network switch to continue using the application.');
        }
        throw new Error('Failed to switch to BlockDAG Testnet. Please manually add the network and try again.');
      }
    }
    
    // Wait longer for network switch to complete and verify
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Get a fresh provider instance after network switch
    const newProvider = new ethers.BrowserProvider(window.ethereum);
    const newNet = await newProvider.getNetwork();
    const newChainId = Number(newNet.chainId);
    
    console.log(`🔍 Verification: New chain ID is ${newChainId}`);
    
    if (newChainId !== CHAIN_ID) {
      console.warn(`⚠️ Network switch verification failed. Expected ${CHAIN_ID}, got ${newChainId}`);
      // Don't throw error, but log the issue
    }
  } else {
    console.log('✅ Already on the correct network');
    // Even if on correct network, mark it as added for future reference
    markNetworkAsAdded();
  }
  
  // Step 4: Add TTF token to wallet (check cache first)
  let tokenAdded = false;
  
  if (hasTokenBeenAdded()) {
    console.log('✅ TTF Token was previously added (cached)');
    tokenAdded = true; // Mark as added since we cached it
  } else {
    try {
      console.log('🪙 Adding TTF token to wallet...');
      await addTTFToken();
      markTokenAsAdded(); // Cache successful token addition
      tokenAdded = true;
      console.log('✅ TTF Token addition completed and cached');
    } catch (error: any) {
      console.log('⚠️ TTF token addition failed or was declined by user:', error);
      // Don't throw error here as token addition is optional
      // User might have declined the request
    }
  }
  
  return {
    provider,
    address,
    isCorrectNetwork: true, // We've ensured we're on the correct network
    networkSwitched,
    tokenAdded
  };
}

// --- Add BlockDAG Testnet to wallet ---
export async function addBDAGNetwork(): Promise<void> {
  console.log('🔍 addBDAGNetwork() called');
  
  if (!window.ethereum) {
    throw new Error('MetaMask not found');
  }

  const chainIdHex = `0x${CHAIN_ID.toString(16)}`;
  console.log(`🌐 Target chain ID: ${CHAIN_ID} (${chainIdHex})`);

  try {
    console.log('🔄 Attempting to switch to existing network...');
    // First try to switch to the network
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: chainIdHex }],
    });
    console.log('✅ Successfully switched to existing network');
  } catch (switchError: any) {
    console.log('⚠️ Switch failed:', switchError.code, switchError.message);
    
    // If network doesn't exist (error 4902), add it
    if (switchError.code === 4902) {
      console.log('➕ Network does not exist, adding it...');
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: chainIdHex,
            chainName: NETWORK_CONFIG.chainName,
            nativeCurrency: NETWORK_CONFIG.nativeCurrency,
            rpcUrls: NETWORK_CONFIG.rpcUrls,
            blockExplorerUrls: NETWORK_CONFIG.blockExplorerUrls,
          }],
        });
        console.log('✅ Successfully added and switched to network');
      } catch (addError: any) {
        console.error('❌ Failed to add network:', addError);
        throw new Error('Failed to add BlockDAG Testnet. Please add it manually.');
      }
    } else if (switchError.code === 4001) {
      // User rejected the request
      console.error('❌ User rejected network switch');
      throw new Error('Please approve the network switch to continue.');
    } else {
      console.error('❌ Unexpected network switch error:', switchError);
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
export async function addTTFToken(): Promise<boolean> {
  console.log('🔍 addTTFToken() called');
  
  if (!window.ethereum) {
    console.error('❌ No window.ethereum found');
    throw new Error('MetaMask not found');
  }

  console.log('📋 Requesting to add token:', {
    address: TOKEN_CONFIG.address,
    symbol: TOKEN_CONFIG.symbol,
    decimals: TOKEN_CONFIG.decimals
  });

  try {
    const result = await window.ethereum.request({
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
    
    console.log('🪙 Token addition result:', result);
    
    // If user approved, mark as added
    if (result === true) {
      markTokenAsAdded();
    }
    
    return result;
  } catch (error: any) {
    console.error('❌ Token addition error:', error);
    throw error;
  }
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