"use client";
import React, { useState } from 'react';
import { connectWallet, getCurrentNetwork, detectWalletType } from '../../src/lib/web3';

export default function WalletTest() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testConnection = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      console.log('=== WALLET CONNECTION TEST ===');
      
      // Check wallet type first
      const walletType = detectWalletType();
      console.log('Detected wallet type:', walletType);
      
      // Check current network before connection
      let currentNetwork;
      try {
        currentNetwork = await getCurrentNetwork();
        console.log('Current network before connection:', currentNetwork);
      } catch (err) {
        console.log('Could not get current network (expected if not connected)');
      }
      
      // Connect wallet
      console.log('Attempting to connect wallet...');
      const connectionResult = await connectWallet();
      
      // Check network after connection
      const networkAfter = await getCurrentNetwork();
      console.log('Network after connection:', networkAfter);
      
      setResult({
        walletType,
        networkBefore: currentNetwork,
        connectionResult,
        networkAfter,
        timestamp: new Date().toISOString()
      });
      
    } catch (err: any) {
      console.error('Connection test failed:', err);
      setError(err.message || 'Connection failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Wallet Connection Test</h1>
      
      <div className="space-y-4">
        <button
          onClick={testConnection}
          disabled={loading}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg font-semibold"
        >
          {loading ? 'Testing Connection...' : 'Test Wallet Connection'}
        </button>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <strong>Error:</strong> {error}
          </div>
        )}
        
        {result && (
          <div className="bg-gray-100 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-3">Connection Test Results:</h2>
            <div className="space-y-2 text-sm">
              <div><strong>Wallet Type:</strong> {result.walletType}</div>
              <div><strong>Network Before:</strong> {result.networkBefore ? `${result.networkBefore.name} (${result.networkBefore.chainId})` : 'Not connected'}</div>
              <div><strong>Connection Success:</strong> {result.connectionResult.address}</div>
              <div><strong>Network Switched:</strong> {result.connectionResult.networkSwitched ? 'Yes' : 'No'}</div>
              <div><strong>Token Added:</strong> {result.connectionResult.tokenAdded ? 'Yes' : 'No'}</div>
              <div><strong>Network After:</strong> {result.networkAfter.name} ({result.networkAfter.chainId})</div>
              <div><strong>Is Correct Network:</strong> {result.networkAfter.isCorrect ? 'Yes' : 'No'}</div>
            </div>
            
            <details className="mt-4">
              <summary className="cursor-pointer font-semibold">Full Result Object</summary>
              <pre className="mt-2 bg-gray-200 p-2 rounded text-xs overflow-auto">
                {JSON.stringify(result, null, 2)}
              </pre>
            </details>
          </div>
        )}
      </div>
      
      <div className="mt-8 bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
        <h3 className="font-semibold">Test Instructions:</h3>
        <ol className="list-decimal list-inside mt-2 space-y-1">
          <li>Make sure you have a wallet installed (MetaMask, Trust Wallet, etc.)</li>
          <li>Connect to a different network first (like Ethereum Mainnet)</li>
          <li>Click "Test Wallet Connection" above</li>
          <li>You should see prompts to switch network and add token</li>
          <li>Check the results to verify automatic switching worked</li>
        </ol>
      </div>
    </div>
  );
}
