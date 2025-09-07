"use client";
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Copy, ExternalLink, CheckCircle } from 'lucide-react';
import { NETWORK_CONFIG } from '../lib/web3';

export default function NetworkSetupGuide() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const networkDetails = [
    { label: 'Network Name', value: NETWORK_CONFIG.chainName, field: 'name' },
    { label: 'Chain ID', value: NETWORK_CONFIG.chainId.toString(), field: 'chainId' },
    { label: 'RPC URL', value: NETWORK_CONFIG.rpcUrls[0], field: 'rpc' },
    { label: 'Explorer URL', value: NETWORK_CONFIG.blockExplorerUrls[0], field: 'explorer' },
    { label: 'Currency Symbol', value: NETWORK_CONFIG.nativeCurrency.symbol, field: 'symbol' },
    { label: 'Faucet', value: NETWORK_CONFIG.faucetUrls?.[0] || '', field: 'faucet' },
  ];

  return (
    <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 mb-8">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between text-left"
      >
        <h3 className="text-lg font-semibold text-white">Manual Network Setup Guide</h3>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-gray-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400" />
        )}
      </button>

      {isExpanded && (
        <div className="mt-6 space-y-6">
          <p className="text-gray-400 text-sm">
            If automatic network setup doesn't work, you can manually add the BlockDAG Testnet to your wallet:
          </p>

          {/* Network Parameters */}
          <div className="space-y-3">
            <h4 className="font-medium text-white">Network Parameters:</h4>
            {networkDetails.map((detail) => (
              <div key={detail.field} className="flex items-center justify-between bg-gray-800/50 p-3 rounded-lg">
                <div>
                  <span className="text-sm text-gray-400">{detail.label}:</span>
                  <p className="text-white font-mono text-sm break-all">{detail.value}</p>
                </div>
                <button
                  onClick={() => copyToClipboard(detail.value, detail.field)}
                  className="ml-2 p-2 text-gray-400 hover:text-white transition-colors"
                  title={`Copy ${detail.label}`}
                >
                  {copiedField === detail.field ? (
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            ))}
          </div>

          {/* TTF Token Contract */}
          <div className="space-y-3">
            <h4 className="font-medium text-white">TTF Token Contract:</h4>
            <div className="flex items-center justify-between bg-gray-800/50 p-3 rounded-lg">
              <div>
                <span className="text-sm text-gray-400">Contract Address:</span>
                <p className="text-white font-mono text-sm break-all">0xC02953cdC83C79dB721A25a6d9F0bf5BcC530317</p>
              </div>
              <button
                onClick={() => copyToClipboard('0xC02953cdC83C79dB721A25a6d9F0bf5BcC530317', 'contract')}
                className="ml-2 p-2 text-gray-400 hover:text-white transition-colors"
                title="Copy Contract Address"
              >
                {copiedField === 'contract' ? (
                  <CheckCircle className="w-4 h-4 text-green-400" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Manual Setup Steps */}
          <div className="space-y-3">
            <h4 className="font-medium text-white">Manual Setup Steps:</h4>
            <ol className="list-decimal list-inside space-y-2 text-sm text-gray-300">
              <li>Open your wallet (MetaMask, Trust Wallet, etc.)</li>
              <li>Go to Networks settings and click "Add Network"</li>
              <li>Fill in the network parameters above</li>
              <li>Save the network and switch to it</li>
              <li>Add the TTF token using the contract address above</li>
              <li>Get test BDAG tokens from the faucet if needed</li>
            </ol>
          </div>

          {/* Useful Links */}
          <div className="flex flex-wrap gap-3">
            <a
              href="https://primordial.bdagscan.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-blue-800 hover:bg-blue-700 rounded text-sm transition-colors flex items-center gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              Block Explorer
            </a>
            <a
              href="https://primordial.bdagscan.com/faucet"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-green-800 hover:bg-green-700 rounded text-sm transition-colors flex items-center gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              BDAG Faucet
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
