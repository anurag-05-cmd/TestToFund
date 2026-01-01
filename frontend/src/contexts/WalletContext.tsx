"use client";
import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { ethers } from 'ethers';
import { 
  connectWallet as connectWalletOnboard, 
  disconnectWallet as disconnectWalletOnboard, 
  restoreWalletConnection, 
  getWalletState, 
  formatAddress as formatAddr 
} from '../lib/web3Onboard';
import { checkTokenBalance, startBalanceMonitoring, stopBalanceMonitoring } from '../lib/tokenUtils';

interface WalletState {
  address: string | null;
  network: string | null;
  balance: string | null;
  profileName: string;
  isConnected: boolean;
  isLoading: boolean;
  isDisconnected: boolean;
}

interface WalletContextType extends WalletState {
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  refresh: () => Promise<void>;
  refreshBalance: () => Promise<void>;
  getSigner: () => Promise<ethers.Signer | null>;
  formatAddress: (address: string) => string;
}

const WalletContext = createContext<WalletContextType | null>(null);

export function useWallet() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}

// Random profile name generator
const generateProfileName = (address: string) => {
  const adjectives = ['Swift', 'Bold', 'Clever', 'Wise', 'Brave', 'Noble', 'Quick', 'Sharp', 'Bright', 'Cool', 'Epic', 'Prime', 'Elite', 'Alpha', 'Stellar'];
  const nouns = ['Trader', 'Pioneer', 'Explorer', 'Builder', 'Creator', 'Innovator', 'Founder', 'Sage', 'Master', 'Champion', 'Legend', 'Hero', 'Warrior', 'Guardian', 'Seeker'];
  
  // Use address to generate consistent random name
  const addressNum = parseInt(address.slice(2, 8), 16);
  const adjIndex = addressNum % adjectives.length;
  const nounIndex = Math.floor(addressNum / adjectives.length) % nouns.length;
  
  return `${adjectives[adjIndex]} ${nouns[nounIndex]}`;
};

export function WalletProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<WalletState>({
    address: null,
    network: null,
    balance: null,
    profileName: '',
    isConnected: false,
    isLoading: true, // Start with loading true for initial check
    isDisconnected: false,
  });

  // Get signer for transactions
  const getSigner = useCallback(async (): Promise<ethers.Signer | null> => {
    try {
      const walletState = getWalletState();
      if (!walletState.connected || !walletState.wallets[0]) {
        return null;
      }
      const provider = new ethers.BrowserProvider(walletState.wallets[0].provider, 'any');
      return await provider.getSigner();
    } catch (error) {
      console.error('Failed to get signer:', error);
      return null;
    }
  }, []);

  // Format address helper
  const formatAddress = useCallback((address: string): string => {
    return formatAddr(address);
  }, []);

  // Fetch balance for an address
  const fetchBalance = useCallback(async (address: string): Promise<string | null> => {
    try {
      const balanceData = await checkTokenBalance(address);
      return balanceData.balance;
    } catch (e) {
      console.log('Could not fetch token balance');
      return null;
    }
  }, []);

  // Refresh balance function
  const refreshBalance = useCallback(async () => {
    if (!state.address) return;
    try {
      const balance = await fetchBalance(state.address);
      setState(prev => ({ ...prev, balance }));
    } catch (e) {
      console.error('Failed to refresh balance:', e);
    }
  }, [state.address, fetchBalance]);

  // Refresh wallet connection
  async function refresh() {
    // Check if user manually disconnected (walletDisconnected flag)
    if (typeof window !== 'undefined' && localStorage.getItem('walletDisconnected') === 'true') {
      setState(prev => ({ ...prev, isLoading: false, isDisconnected: true }));
      return;
    }

    try {
      // First try to restore via web3Onboard
      const restored = await restoreWalletConnection();
      
      if (restored.connected && restored.address) {
        const profileName = generateProfileName(restored.address);
        const balance = await fetchBalance(restored.address);
        
        // Start balance monitoring
        startBalanceMonitoring(restored.address, (newBalance) => {
          setState(prev => ({ ...prev, balance: newBalance }));
        });
        
        setState({
          address: restored.address,
          network: 'BlockDAG Testnet',
          balance,
          profileName,
          isConnected: true,
          isLoading: false,
          isDisconnected: false,
        });
        
        console.log('✅ Wallet connection restored via web3Onboard:', restored.address);
        return;
      }
      
      // Fallback: Check MetaMask directly
      if (typeof window !== 'undefined' && window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts && accounts.length > 0) {
          const address = accounts[0];
          const profileName = generateProfileName(address);
          const balance = await fetchBalance(address);
          
          // Start balance monitoring
          startBalanceMonitoring(address, (newBalance) => {
            setState(prev => ({ ...prev, balance: newBalance }));
          });
          
          setState({
            address,
            network: 'BlockDAG Testnet',
            balance,
            profileName,
            isConnected: true,
            isLoading: false,
            isDisconnected: false,
          });
          
          console.log('✅ Wallet connection restored via MetaMask:', address);
          return;
        }
      }
      
      // No wallet connected
      setState(prev => ({ ...prev, isLoading: false }));
    } catch (err) {
      console.log('Wallet connection check completed');
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }

  // Connect wallet
  async function connect() {
    setState(prev => ({ ...prev, isLoading: true }));
    try {
      // Clear disconnection state and flag when user manually connects
      setState(prev => ({ ...prev, isDisconnected: false }));
      localStorage.removeItem('walletDisconnected');
      
      const result = await connectWalletOnboard();
      const profileName = generateProfileName(result.address);
      
      // Get token balance
      const balance = await fetchBalance(result.address);
      
      // Start balance monitoring
      startBalanceMonitoring(result.address, (newBalance) => {
        setState(prev => ({ ...prev, balance: newBalance }));
      });
      
      setState({
        address: result.address,
        network: 'BlockDAG Testnet',
        balance,
        profileName,
        isConnected: true,
        isLoading: false,
        isDisconnected: false,
      });
      
      console.log('✅ Wallet connected successfully:', result.address);
    } catch (err: any) {
      console.error('Connect error:', err);
      setState(prev => ({ 
        ...prev, 
        isLoading: false,
        isDisconnected: false,
      }));
      localStorage.removeItem('walletDisconnected');
      throw err;
    }
  }

  // Disconnect wallet - clears all storage and reloads
  async function disconnect() {
    const confirmed = window.confirm('Are you sure you want to disconnect your wallet? You will need to reconnect to access your account.');
    
    if (confirmed) {
      try {
        // Stop balance monitoring
        stopBalanceMonitoring();
        
        // Disconnect via web3Onboard
        await disconnectWalletOnboard();
        
        // Try to revoke MetaMask permissions
        if (typeof window !== 'undefined' && window.ethereum) {
          try {
            await window.ethereum.request({
              method: 'wallet_revokePermissions',
              params: [{ eth_accounts: {} }]
            });
            console.log('✅ MetaMask permissions revoked');
          } catch (e) {
            console.log('Permission revocation not supported, continuing...');
          }
        }
        
        // Clear ALL localStorage
        localStorage.clear();
        
        // Set a disconnect flag in sessionStorage (survives reload but not tab close)
        sessionStorage.setItem('wallet_just_disconnected', 'true');
        
        console.log('✅ Wallet disconnected, reloading page...');
        
        // Reload the page
        window.location.reload();
      } catch (error) {
        console.error('Error during disconnection:', error);
        // Still clear and reload even on error
        localStorage.clear();
        sessionStorage.setItem('wallet_just_disconnected', 'true');
        window.location.reload();
      }
    }
  }

  // Initialize on mount
  useEffect(() => {
    const initialize = async () => {
      console.log('🔄 WalletContext initializing...');
      
      // Check if user just disconnected - don't auto-reconnect
      if (typeof window !== 'undefined' && sessionStorage.getItem('wallet_just_disconnected') === 'true') {
        console.log('🔌 User just disconnected, skipping auto-connect');
        sessionStorage.removeItem('wallet_just_disconnected');
        setState(prev => ({ ...prev, isLoading: false }));
        return;
      }
      
      // Try to restore wallet connection
      await refresh();
    };

    initialize();

    // Cleanup on unmount
    return () => {
      stopBalanceMonitoring();
    };
  }, []);
  
  // Set up event listeners for wallet changes
  useEffect(() => {
    if (typeof window === 'undefined' || !window.ethereum) return;
    
    const handleAccountChange = (accounts: string[]) => {
      if (state.isDisconnected || localStorage.getItem('walletDisconnected') === 'true') return;
      
      if (accounts.length === 0) {
        stopBalanceMonitoring();
        setState({
          address: null,
          network: null,
          balance: null,
          profileName: '',
          isConnected: false,
          isLoading: false,
          isDisconnected: false,
        });
      } else {
        refresh();
      }
    };
    
    const handleChainChange = () => {
      if (state.isDisconnected || localStorage.getItem('walletDisconnected') === 'true') return;
      refresh();
    };
    
    window.ethereum.on?.('accountsChanged', handleAccountChange);
    window.ethereum.on?.('chainChanged', handleChainChange);
    
    return () => {
      window.ethereum?.removeListener?.('accountsChanged', handleAccountChange);
      window.ethereum?.removeListener?.('chainChanged', handleChainChange);
    };
  }, [state.isDisconnected]);

  const contextValue: WalletContextType = {
    ...state,
    connect,
    disconnect,
    refresh,
    refreshBalance,
    getSigner,
    formatAddress,
  };

  return (
    <WalletContext.Provider value={contextValue}>
      {children}
    </WalletContext.Provider>
  );
}
