import Onboard from '@web3-onboard/core';
import injectedModule from '@web3-onboard/injected-wallets';
import { ethers } from 'ethers';

// Web3 Onboard configuration
const injected = injectedModule();

const onboard = Onboard({
  wallets: [injected],
  chains: [
    {
      id: '0x413', // 1043 in hex (BlockDAG Testnet)
      token: 'BDAG',
      label: 'Primordial BlockDAG Testnet',
      rpcUrl: 'https://rpc.primordial.bdagscan.com/'
    }
  ],
  appMetadata: {
    name: 'TestToFund',
    icon: '/TestToFund Logo.svg',
    logo: '/TestToFund Logo.svg',
    description: 'Test Trust Fund - Transform your knowledge into rewards',
    recommendedInjectedWallets: [
      { name: 'MetaMask', url: 'https://metamask.io' },
      { name: 'Coinbase', url: 'https://wallet.coinbase.com/' }
    ]
  },
  accountCenter: {
    desktop: {
      enabled: false
    },
    mobile: {
      enabled: false
    }
  }
});

// Token configuration
export const TOKEN_CONFIG = {
  address: "0xC02953cdC83C79dB721A25a6d9F0bf5BcC530317",
  symbol: "TTF",
  decimals: 18,
  name: "TestToFund Token"
};

// Storage keys
const STORAGE_KEYS = {
  WALLET_CONNECTED: 'ttf_wallet_connected',
  WALLET_ADDRESS: 'ttf_wallet_address',
  TOKEN_ADDED: 'ttf_token_added'
};

// Wallet state management
class WalletManager {
  private static instance: WalletManager;
  private walletState: any = null;

  static getInstance(): WalletManager {
    if (!WalletManager.instance) {
      WalletManager.instance = new WalletManager();
    }
    return WalletManager.instance;
  }

  // Save wallet connection state
  saveWalletState(address: string, label: string) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.WALLET_CONNECTED, 'true');
      localStorage.setItem(STORAGE_KEYS.WALLET_ADDRESS, address);
      console.log('💾 Wallet state saved:', { address, label });
    }
  }

  // Get saved wallet address
  getSavedWalletAddress(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(STORAGE_KEYS.WALLET_ADDRESS);
    }
    return null;
  }

  // Check if wallet was previously connected
  isWalletPreviouslyConnected(): boolean {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(STORAGE_KEYS.WALLET_CONNECTED) === 'true';
    }
    return false;
  }

  // Clear wallet state
  clearWalletState() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEYS.WALLET_CONNECTED);
      localStorage.removeItem(STORAGE_KEYS.WALLET_ADDRESS);
      localStorage.removeItem(STORAGE_KEYS.TOKEN_ADDED);
      console.log('🗑️ Wallet state cleared');
    }
  }

  // Mark TTF token as added
  markTokenAsAdded() {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.TOKEN_ADDED, 'true');
    }
  }

  // Check if TTF token was previously added
  isTokenPreviouslyAdded(): boolean {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(STORAGE_KEYS.TOKEN_ADDED) === 'true';
    }
    return false;
  }
}

const walletManager = WalletManager.getInstance();

// Connect wallet function
export async function connectWallet(): Promise<{
  address: string;
  provider: ethers.BrowserProvider;
  label: string;
  tokenAdded: boolean;
}> {
  try {
    console.log('🚀 Connecting wallet with Web3 Onboard...');
    
    const wallets = await onboard.connectWallet();
    
    if (!wallets || wallets.length === 0) {
      throw new Error('No wallet connected');
    }

    const wallet = wallets[0];
    const address = wallet.accounts[0].address;
    const label = wallet.label;

    console.log('✅ Wallet connected:', { address, label });

    // Create ethers provider
    const provider = new ethers.BrowserProvider(wallet.provider);

    // Save wallet state
    walletManager.saveWalletState(address, label);

    // Add TTF token if not already added
    let tokenAdded = false;
    if (!walletManager.isTokenPreviouslyAdded()) {
      try {
        await addTTFToken(wallet.provider);
        walletManager.markTokenAsAdded();
        tokenAdded = true;
        console.log('✅ TTF Token added to wallet');
      } catch (error) {
        console.log('⚠️ TTF token addition failed or declined:', error);
      }
    } else {
      tokenAdded = true;
      console.log('✅ TTF Token was previously added');
    }

    return {
      address,
      provider,
      label,
      tokenAdded
    };

  } catch (error: any) {
    console.error('❌ Wallet connection failed:', error);
    throw new Error(error.message || 'Failed to connect wallet');
  }
}

// Restore wallet connection
export async function restoreWalletConnection(): Promise<{
  connected: boolean;
  address?: string;
  provider?: ethers.BrowserProvider;
  label?: string;
}> {
  try {
    if (!walletManager.isWalletPreviouslyConnected()) {
      return { connected: false };
    }

    const savedAddress = walletManager.getSavedWalletAddress();
    if (!savedAddress) {
      return { connected: false };
    }

    // Get the current wallet state from onboard
    const walletState = onboard.state.get();
    const connectedWallets = walletState.wallets;

    if (connectedWallets.length === 0) {
      // Try to reconnect using the previous wallet
      const lastConnectedWallet = walletState.wallets[0];
      if (lastConnectedWallet) {
        await onboard.connectWallet({
          autoSelect: {
            label: lastConnectedWallet.label,
            disableModals: true
          }
        });
      } else {
        // Clear state if we can't restore
        walletManager.clearWalletState();
        return { connected: false };
      }
    }

    const wallet = onboard.state.get().wallets[0];
    if (!wallet || !wallet.accounts[0]) {
      walletManager.clearWalletState();
      return { connected: false };
    }

    const address = wallet.accounts[0].address;
    
    // Verify the address matches
    if (address.toLowerCase() !== savedAddress.toLowerCase()) {
      walletManager.clearWalletState();
      return { connected: false };
    }

    const provider = new ethers.BrowserProvider(wallet.provider);

    console.log('✅ Wallet connection restored:', address);

    return {
      connected: true,
      address,
      provider,
      label: wallet.label
    };

  } catch (error) {
    console.error('Failed to restore wallet connection:', error);
    walletManager.clearWalletState();
    return { connected: false };
  }
}

// Disconnect wallet
export async function disconnectWallet(): Promise<void> {
  try {
    const walletState = onboard.state.get();
    const connectedWallets = walletState.wallets;

    if (connectedWallets.length > 0) {
      await onboard.disconnectWallet({ label: connectedWallets[0].label });
    }

    walletManager.clearWalletState();
    console.log('✅ Wallet disconnected');
  } catch (error) {
    console.error('Failed to disconnect wallet:', error);
    // Clear state anyway
    walletManager.clearWalletState();
  }
}

// Add TTF token to wallet
async function addTTFToken(provider: any): Promise<boolean> {
  try {
    const result = await provider.request({
      method: 'wallet_watchAsset',
      params: {
        type: 'ERC20',
        options: {
          address: TOKEN_CONFIG.address,
          symbol: TOKEN_CONFIG.symbol,
          decimals: TOKEN_CONFIG.decimals,
          image: '', // You can add a token logo URL here
        },
      },
    });

    return result;
  } catch (error: any) {
    console.error('Failed to add TTF token:', error);
    throw error;
  }
}

// Get current wallet state
export function getWalletState() {
  const state = onboard.state.get();
  return {
    wallets: state.wallets,
    connected: state.wallets.length > 0
  };
}

// Format address helper
export function formatAddress(address: string): string {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export default onboard;
