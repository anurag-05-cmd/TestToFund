"use client";
import React, { useState, useEffect } from 'react';
import { AlertCircle, Download, ExternalLink, Smartphone, Monitor } from 'lucide-react';
import { getWalletRecommendations } from '../lib/web3';

export default function WalletDetection() {
  const [walletInfo, setWalletInfo] = useState<{
    hasWallet: boolean;
    walletType: string;
    supportsAutoSetup: boolean;
    installUrl?: string;
  } | null>(null);

  useEffect(() => {
    const info = getWalletRecommendations();
    setWalletInfo(info);
  }, []);

  if (!walletInfo || walletInfo.hasWallet) {
    return null; // Don't show if wallet is detected
  }

  return (
    <div className="bg-blue-900/30 border border-blue-800 text-blue-300 p-6 rounded-lg mb-8">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          <h3 className="font-semibold">No Wallet Detected</h3>
        </div>
        
        <p className="text-sm">
          To use this application, you need a Web3 wallet that supports the BlockDAG Testnet. 
          Here are the recommended options:
        </p>

        <div className="grid md:grid-cols-2 gap-4">
          {/* Desktop Wallets */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Monitor className="w-4 h-4" />
              <h4 className="font-medium">Desktop Browsers</h4>
            </div>
            
            <div className="space-y-2">
              <a
                href="https://metamask.io/download/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 bg-blue-800/50 hover:bg-blue-700/50 rounded transition-colors"
              >
                <div>
                  <div className="font-medium">MetaMask</div>
                  <div className="text-xs text-blue-200">Most popular wallet</div>
                </div>
                <ExternalLink className="w-4 h-4" />
              </a>
              
              <a
                href="https://www.coinbase.com/wallet"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 bg-blue-800/50 hover:bg-blue-700/50 rounded transition-colors"
              >
                <div>
                  <div className="font-medium">Coinbase Wallet</div>
                  <div className="text-xs text-blue-200">Easy to use</div>
                </div>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Mobile Wallets */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4" />
              <h4 className="font-medium">Mobile Apps</h4>
            </div>
            
            <div className="space-y-2">
              <a
                href="https://trustwallet.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 bg-blue-800/50 hover:bg-blue-700/50 rounded transition-colors"
              >
                <div>
                  <div className="font-medium">Trust Wallet</div>
                  <div className="text-xs text-blue-200">Mobile-first wallet</div>
                </div>
                <ExternalLink className="w-4 h-4" />
              </a>
              
              <a
                href="https://metamask.io/download/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 bg-blue-800/50 hover:bg-blue-700/50 rounded transition-colors"
              >
                <div>
                  <div className="font-medium">MetaMask Mobile</div>
                  <div className="text-xs text-blue-200">Mobile version</div>
                </div>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-4 p-3 bg-blue-800/30 rounded text-sm">
          <p className="font-medium mb-1">After installing a wallet:</p>
          <ol className="list-decimal list-inside space-y-1 text-blue-200">
            <li>Create or import your wallet</li>
            <li>Return to this page and click "Connect Wallet"</li>
            <li>The BlockDAG Testnet will be automatically added</li>
            <li>The TTF token will be added to your wallet</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
