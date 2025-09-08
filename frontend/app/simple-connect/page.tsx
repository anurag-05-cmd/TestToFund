"use client";
import React, { useState } from 'react';

export default function SimpleWalletConnect() {
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const connectSimple = async () => {
    setLoading(true);
    setResult('Starting connection...\n');

    try {
      // Check if wallet exists
      if (!window.ethereum) {
        throw new Error('No wallet found');
      }

      // Request account access
      setResult(prev => prev + 'Requesting account access...\n');
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      // Get current chain
      const currentChain = await window.ethereum.request({ method: 'eth_chainId' });
      const currentChainId = parseInt(currentChain, 16);
      setResult(prev => prev + `Current chain: ${currentChainId}\n`);
      
      // If not on BlockDAG testnet (1043), switch/add it
      if (currentChainId !== 1043) {
        setResult(prev => prev + 'Switching to BlockDAG testnet...\n');
        
        try {
          // Try to switch first
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x413' }], // 1043 in hex
          });
          setResult(prev => prev + 'Successfully switched to existing network!\n');
        } catch (switchError: any) {
          if (switchError.code === 4902) {
            // Network doesn't exist, add it
            setResult(prev => prev + 'Network not found, adding it...\n');
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId: '0x413',
                chainName: 'Primordial BlockDAG Testnet',
                nativeCurrency: {
                  name: 'BDAG',
                  symbol: 'BDAG',
                  decimals: 18
                },
                rpcUrls: ['https://rpc.primordial.bdagscan.com/'],
                blockExplorerUrls: ['https://primordial.bdagscan.com/']
              }]
            });
            setResult(prev => prev + 'Successfully added and switched to network!\n');
          } else {
            throw switchError;
          }
        }
      } else {
        setResult(prev => prev + 'Already on correct network!\n');
      }

      // Add TTF token
      setResult(prev => prev + 'Adding TTF token...\n');
      try {
        await window.ethereum.request({
          method: 'wallet_watchAsset',
          params: {
            type: 'ERC20',
            options: {
              address: '0xC02953cdC83C79dB721A25a6d9F0bf5BcC530317',
              symbol: 'TTF',
              decimals: 18,
            },
          },
        });
        setResult(prev => prev + 'Token addition requested!\n');
      } catch (tokenError: any) {
        setResult(prev => prev + `Token addition failed or declined: ${tokenError.message}\n`);
      }

      setResult(prev => prev + '✅ Connection process completed!\n');

    } catch (error: any) {
      setResult(prev => prev + `❌ Error: ${error.message}\n`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Simple Wallet Connect Test</h1>
      
      <button
        onClick={connectSimple}
        disabled={loading}
        className="px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg font-semibold mb-4"
      >
        {loading ? 'Connecting...' : 'Connect Wallet (Auto Setup)'}
      </button>
      
      <div className="bg-gray-100 p-4 rounded-lg">
        <h3 className="font-semibold mb-2">Connection Log:</h3>
        <pre className="text-sm whitespace-pre-wrap">{result || 'Click button to start...'}</pre>
      </div>
      
      <div className="mt-4 text-sm text-gray-600">
        <p><strong>What this does:</strong></p>
        <ol className="list-decimal list-inside mt-1 space-y-1">
          <li>Request wallet access</li>
          <li>Check current network</li>
          <li>If not on BlockDAG testnet, automatically switch/add it</li>
          <li>Add TTF token to wallet</li>
        </ol>
      </div>
    </div>
  );
}

declare global {
  interface Window {
    ethereum?: any;
  }
}
