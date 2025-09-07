"use client";
import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, ExternalLink, RefreshCw } from 'lucide-react';
import { getCurrentNetwork, addBDAGNetwork, addTTFToken, NETWORK_CONFIG } from '../lib/web3';

interface NetworkStatusProps {
  isConnected: boolean;
  onNetworkChange?: () => void;
}

export default function NetworkStatus({ isConnected, onNetworkChange }: NetworkStatusProps) {
  const [networkInfo, setNetworkInfo] = useState<{
    chainId: number;
    name: string;
    isCorrect: boolean;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check network status
  const checkNetwork = async () => {
    if (!isConnected) return;
    
    try {
      const info = await getCurrentNetwork();
      setNetworkInfo(info);
      setError(null);
    } catch (err: any) {
      setError(err.message);
      setNetworkInfo(null);
    }
  };

  // Switch to BlockDAG network
  const handleSwitchNetwork = async () => {
    setLoading(true);
    setError(null);
    
    try {
      await addBDAGNetwork();
      await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for switch
      await checkNetwork();
      onNetworkChange?.();
    } catch (err: any) {
      setError(err.message || 'Failed to switch network');
    } finally {
      setLoading(false);
    }
  };

  // Add TTF token
  const handleAddToken = async () => {
    try {
      await addTTFToken();
    } catch (err: any) {
      console.error('Failed to add token:', err);
    }
  };

  useEffect(() => {
    if (isConnected) {
      checkNetwork();
    }
  }, [isConnected]);

  if (!isConnected) return null;

  if (error) {
    return (
      <div className="bg-red-900/30 border border-red-800 text-red-300 p-4 rounded-lg mb-6">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          <span>Network Error: {error}</span>
        </div>
      </div>
    );
  }

  if (!networkInfo) {
    return (
      <div className="bg-gray-800/50 border border-gray-700 text-gray-300 p-4 rounded-lg mb-6">
        <div className="flex items-center gap-2">
          <RefreshCw className="w-5 h-5 animate-spin" />
          <span>Checking network...</span>
        </div>
      </div>
    );
  }

  if (networkInfo.isCorrect) {
    return (
      <div className="bg-green-900/30 border border-green-800 text-green-300 p-4 rounded-lg mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            <span>Connected to {NETWORK_CONFIG.chainName}</span>
          </div>
          <div className="text-sm text-green-400">
            ✅ Network & Token Setup Complete
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-yellow-900/30 border border-yellow-800 text-yellow-300 p-4 rounded-lg mb-6">
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          <span>Wrong Network Detected</span>
        </div>
        
        <div className="text-sm space-y-1">
          <p>Current: {networkInfo.name} (Chain ID: {networkInfo.chainId})</p>
          <p>Required: {NETWORK_CONFIG.chainName} (Chain ID: {NETWORK_CONFIG.chainId})</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={handleSwitchNetwork}
            disabled={loading}
            className="px-4 py-2 bg-yellow-800 hover:bg-yellow-700 disabled:bg-yellow-900 rounded text-sm transition-colors flex items-center gap-2"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Switching...
              </>
            ) : (
              'Switch Network'
            )}
          </button>
          
          <a
            href="https://primordial.bdagscan.com/faucet"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 border border-yellow-700 hover:border-yellow-600 rounded text-sm transition-colors flex items-center gap-2"
          >
            <ExternalLink className="w-4 h-4" />
            Get BDAG Tokens
          </a>
        </div>
      </div>
    </div>
  );
}
