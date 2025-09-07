import { ethers } from "ethers";

// --- Network Config ---
export const NETWORK_CONFIG = {
  chainId: 1043,
  chainName: "BDAG Testnet",
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
  return ethers.utils.formatUnits(value, decimals);
}

export function parseUnits(value: string, decimals = 18) {
  return ethers.utils.parseUnits(value, decimals);
}

export function formatAddress(address: string): string {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

// --- Wrap provider to fix network name ---
function wrapProvider<T extends ethers.providers.Provider>(prov: T): T {
  const origGetNetwork = prov.getNetwork.bind(prov);
  prov.getNetwork = async () => {
    const net = await origGetNetwork();
    if (net.chainId === CHAIN_ID) return { chainId: CHAIN_ID, name: NETWORK_NAME };
    return net;
  };
  return prov;
}

// --- Get injected provider (MetaMask / Trust Wallet) ---
export async function getProvider(): Promise<ethers.providers.Web3Provider> {
  if (typeof window !== "undefined" && window.ethereum) {
    const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    return wrapProvider(provider);
  }
  throw new Error("No wallet found. Please install MetaMask or use Trust Wallet.");
}

// --- Connect wallet and add BDAG Testnet ---
export async function connectWallet(): Promise<{
  provider: ethers.providers.Web3Provider;
  address: string;
  isCorrectNetwork: boolean;
}> {
  const provider = await getProvider();
  
  // Request account access
  await provider.send("eth_requestAccounts", []);
  const signer = provider.getSigner();
  const address = await signer.getAddress();
  
  // Check if we're on the right network
  const net = await provider.getNetwork();
  const isCorrectNetwork = net.chainId === CHAIN_ID;
  
  if (!isCorrectNetwork) {
    console.log(`Currently on chain ${net.chainId}, need ${CHAIN_ID}`);
  }
  
  return {
    provider,
    address,
    isCorrectNetwork
  };
}

// --- Add BDAG Testnet to wallet ---
export async function addBDAGNetwork(): Promise<boolean> {
  try {
    const provider = await getProvider();
    
    // First try to switch to the network
    try {
      await provider.send("wallet_switchEthereumChain", [{ 
        chainId: `0x${CHAIN_ID.toString(16)}` 
      }]);
      return true;
    } catch (switchError: any) {
      // If network doesn't exist (error 4902), add it
      if (switchError.code === 4902) {
        await provider.send("wallet_addEthereumChain", [{
          chainId: `0x${CHAIN_ID.toString(16)}`,
          chainName: NETWORK_CONFIG.chainName,
          nativeCurrency: NETWORK_CONFIG.nativeCurrency,
          rpcUrls: NETWORK_CONFIG.rpcUrls,
          blockExplorerUrls: NETWORK_CONFIG.blockExplorerUrls
        }]);
        return true;
      } else {
        throw switchError;
      }
    }
  } catch (error: any) {
    console.error("Failed to add BDAG network:", error);
    throw new Error(`Failed to add ${NETWORK_NAME}. Please add it manually.`);
  }
}

// --- Check if user is on correct network ---
export async function isOnBDAGNetwork(): Promise<boolean> {
  try {
    const provider = await getProvider();
    const network = await provider.getNetwork();
    return network.chainId === CHAIN_ID;
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
      chainId: network.chainId,
      name: network.name || `Chain ${network.chainId}`,
      isCorrect: network.chainId === CHAIN_ID
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
        address: accounts[0]
      };
    }
    
    return { connected: false };
  } catch (error) {
    return { connected: false };
  }
}