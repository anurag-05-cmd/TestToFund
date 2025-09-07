"use client";
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { ethers } from 'ethers';
import { connectWallet, getProvider, TOKEN_ADDRESS, ERC20_ABI, formatUnits } from '../lib/web3';

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
    isLoading: false,
    isDisconnected: false,
  });

  async function refresh() {
    // Check if user manually disconnected
    if (state.isDisconnected || (typeof window !== 'undefined' && localStorage.getItem('walletDisconnected') === 'true')) {
      return;
    }

    try {
      // Check if wallet is actually connected first without triggering connection
      if (typeof window === 'undefined' || !window.ethereum) return;
      
      // Check if there are any connected accounts without prompting
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      if (!accounts || accounts.length === 0) {
        return;
      }

      // Only proceed if we have accounts and user hasn't disconnected
      if (accounts.length > 0 && !state.isDisconnected) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        
        try {
          // Try to get signer without triggering wallet popup
          const signer = await provider.getSigner();
          const addr = await signer.getAddress();
          
          if (addr && addr === accounts[0]) {
            const profileName = generateProfileName(addr);
            
            // Get token balance
            let balance = null;
            try {
              const token = new ethers.Contract(TOKEN_ADDRESS, ERC20_ABI, provider);
              const bal = await token.balanceOf(addr);
              balance = formatUnits(bal, 18);
            } catch (e) {
              console.log('Could not fetch token balance');
            }

            setState(prev => ({
              ...prev,
              address: addr,
              network: 'BlockDAG Testnet',
              balance,
              profileName,
              isConnected: true,
              isLoading: false,
            }));
          }
        } catch (err) {
          // Signer not available or user rejected - this is normal for disconnected state
          console.log('No active signer available');
        }
      }
    } catch (err) {
      // Silently handle any connection errors without prompting user
      console.log('Wallet connection check completed');
    }
  }

  async function connect() {
    setState(prev => ({ ...prev, isLoading: true }));
    try {
      // Clear disconnection state and flag when user manually connects
      setState(prev => ({ ...prev, isDisconnected: false }));
      localStorage.removeItem('walletDisconnected');
      
      const result = await connectWallet();
      const profileName = generateProfileName(result.address);
      
      // Get token balance
      let balance = null;
      if (result.address) {
        try {
          const provider = await getProvider();
          const token = new ethers.Contract(TOKEN_ADDRESS, ERC20_ABI, provider);
          const bal = await token.balanceOf(result.address);
          balance = formatUnits(bal, 18);
        } catch (e) {
          console.error('Failed to get token balance:', e);
        }
      }
      
      setState(prev => ({
        ...prev,
        address: result.address,
        network: 'BlockDAG Testnet',
        balance,
        profileName,
        isConnected: true,
        isLoading: false,
        isDisconnected: false,
      }));
      
      console.log('Wallet connected successfully');
    } catch (err: any) {
      console.error('Connect error:', err);
      setState(prev => ({ 
        ...prev, 
        isLoading: false,
        isDisconnected: false,
      }));
      localStorage.removeItem('walletDisconnected');
    }
  }

  async function disconnect() {
    const confirmed = window.confirm('Are you sure you want to disconnect your wallet? You will need to reconnect to access your account.');
    
    if (confirmed) {
      try {
        // Set disconnected state immediately
        setState({
          address: null,
          network: null,
          balance: null,
          profileName: '',
          isConnected: false,
          isLoading: false,
          isDisconnected: true,
        });
        
        // Store disconnection flag in localStorage
        localStorage.setItem('walletDisconnected', 'true');
        
        // Clear wallet caches
        if (typeof window !== 'undefined' && window.ethereum) {
          try {
            await window.ethereum.request({
              method: 'wallet_revokePermissions',
              params: [{
                eth_accounts: {}
              }]
            });
          } catch (e) {
            console.log('Wallet disconnected (permission revocation not supported)');
          }
        }
        
        // Clear storage
        Object.keys(localStorage).forEach(key => {
          if ((key.startsWith('metamask') || key.startsWith('wallet') || key.includes('connect')) && key !== 'walletDisconnected') {
            try {
              localStorage.removeItem(key);
            } catch (e) {
              // Ignore
            }
          }
        });
        
        console.log('Wallet successfully disconnected');
      } catch (error) {
        console.error('Error during disconnection:', error);
      }
    }
  }

  useEffect(() => {
    // Initialize disconnected state from localStorage
    const wasDisconnected = localStorage.getItem('walletDisconnected') === 'true';
    if (wasDisconnected) {
      setState(prev => ({ ...prev, isDisconnected: true }));
      return;
    }

    // Auto-refresh on mount if not disconnected
    refresh();
    
    // Set up event listeners if not disconnected
    if (typeof window !== 'undefined' && window.ethereum) {
      const handleAccountChange = (accounts: string[]) => {
        if (!state.isDisconnected && localStorage.getItem('walletDisconnected') !== 'true') {
          if (accounts.length === 0) {
            setState(prev => ({
              ...prev,
              address: null,
              network: null,
              balance: null,
              profileName: '',
              isConnected: false,
            }));
          } else {
            refresh();
          }
        }
      };
      
      const handleChainChange = () => {
        if (!state.isDisconnected && localStorage.getItem('walletDisconnected') !== 'true') {
          refresh();
        }
      };
      
      const handleDisconnect = () => {
        setState(prev => ({
          ...prev,
          address: null,
          network: null,
          balance: null,
          profileName: '',
          isConnected: false,
        }));
      };
      
      window.ethereum.on?.('accountsChanged', handleAccountChange);
      window.ethereum.on?.('chainChanged', handleChainChange);
      window.ethereum.on?.('disconnect', handleDisconnect);
      
      return () => {
        window.ethereum.removeListener?.('accountsChanged', handleAccountChange);
        window.ethereum.removeListener?.('chainChanged', handleChainChange);
        window.ethereum.removeListener?.('disconnect', handleDisconnect);
      };
    }
  }, [state.isDisconnected]);

  const contextValue: WalletContextType = {
    ...state,
    connect,
    disconnect,
    refresh,
  };

  return (
    <WalletContext.Provider value={contextValue}>
      {children}
    </WalletContext.Provider>
  );
}
