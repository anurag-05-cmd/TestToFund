"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ethers } from 'ethers';
import { 
  Droplets, 
  Send, 
  ExternalLink, 
  Wallet, 
  ArrowRight, 
  Info,
  Zap,
  Gift,
  Copy,
  CheckCircle,
  X
} from 'lucide-react';
import BackgroundVideo from '../../src/components/BackgroundVideo';
import Navbar from '../../src/components/Navbar';
import TestMate from '../../src/components/TestMate';
import { connectWallet, restoreWalletConnection, getWalletState, formatAddress } from '../../src/lib/web3Onboard';
import { checkTokenBalance, startBalanceMonitoring, stopBalanceMonitoring } from '../../src/lib/tokenUtils';

// Constants
const TOKEN_ADDRESS = "0xC02953cdC83C79dB721A25a6d9F0bf5BcC530317";
const EXPLORER_URL = "https://Awakening.bdagscan.com/";

const ERC20_ABI = [
  "function balanceOf(address) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
  "function name() view returns (string)"
];

interface TransactionResult {
  from: string;
  to: string;
  amount: string;
  txHash: string;
}

export default function FaucetPage() {
  const [walletAddress, setWalletAddress] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [sendLoading, setSendLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [transactionResult, setTransactionResult] = useState<TransactionResult | null>(null);
  const [tokenBalance, setTokenBalance] = useState<string>('0');
  const [balanceLoading, setBalanceLoading] = useState(false);
  const [copyMessage, setCopyMessage] = useState('');
  const [isInitializing, setIsInitializing] = useState(true);

  // Initialize wallet connection on page load
  useEffect(() => {
    initializeWalletConnection();
  }, []);

  // Cleanup balance monitoring on unmount
  useEffect(() => {
    return () => {
      stopBalanceMonitoring();
    };
  }, []);

  async function initializeWalletConnection() {
    try {
      setIsInitializing(true);
      console.log('🔄 Initializing wallet connection...');
      
      const restored = await restoreWalletConnection();
      
      if (restored.connected && restored.address) {
        console.log('✅ Wallet connection restored:', restored.address);
        setWalletAddress(restored.address);
        setIsConnected(true);
        
        // Load wallet balance
        await checkWalletBalance(restored.address);
        
        // Start balance monitoring
        startBalanceMonitoring(restored.address, (newBalance) => {
          setTokenBalance(newBalance);
        });
      } else {
        console.log('ℹ️ No previous wallet connection found');
      }
    } catch (error) {
      console.error('Failed to initialize wallet:', error);
    } finally {
      setIsInitializing(false);
    }
  }

  // Check token balance
  async function checkWalletBalance(address?: string) {
    const targetAddress = address || walletAddress;
    if (!targetAddress) return;
    
    setBalanceLoading(true);
    try {
      const balance = await checkTokenBalance(targetAddress);
      setTokenBalance(balance.balance);
    } catch (err) {
      console.error('Failed to check balance:', err);
    } finally {
      setBalanceLoading(false);
    }
  }

  // Auto-refresh balance when wallet address changes
  useEffect(() => {
    if (walletAddress) {
      checkWalletBalance();
    }
  }, [walletAddress]);

  const handleConnect = async () => {
    setIsLoading(true);
    try {
      const result = await connectWallet();
      if (result.address) {
        setWalletAddress(result.address);
        setIsConnected(true);
        await checkWalletBalance(result.address);
        
        // Start balance monitoring
        startBalanceMonitoring(result.address, (newBalance) => {
          setTokenBalance(newBalance);
        });
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendTTF = async () => {
    if (!isConnected || !recipient || !amount) {
      alert('Please connect wallet and fill all fields');
      return;
    }

    setSendLoading(true);
    try {
      // Get provider from Web3 Onboard
      const state = getWalletState();
      const wallet = state.wallets[0];
      const ethersProvider = new ethers.BrowserProvider(wallet.provider, 'any');
      const signer = await ethersProvider.getSigner();
      const token = new ethers.Contract(TOKEN_ADDRESS, ERC20_ABI, signer);
      
      // Convert amount to wei (18 decimals)
      const amountWei = ethers.parseUnits(amount, 18);
      
      // Send transaction
      const tx = await token.transfer(recipient, amountWei);
      console.log('Transaction sent:', tx.hash);
      
      // Wait for confirmation
      await tx.wait();
      console.log('Transaction confirmed');
      
      // Set transaction result and show success modal
      setTransactionResult({
        from: walletAddress,
        to: recipient,
        amount: amount,
        txHash: tx.hash
      });
      setShowSuccessModal(true);
      
      // Clear form
      setRecipient('');
      setAmount('');
    } catch (error) {
      console.error('Send failed:', error);
      alert('Transaction failed. Please try again.');
    } finally {
      setSendLoading(false);
    }
  };

  const copyAddress = (addr: string) => {
    navigator.clipboard.writeText(addr);
  };

  return (
    <>
      <Navbar />
      <BackgroundVideo />
      <div className="relative z-10 min-h-screen">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Success Modal */}
      {showSuccessModal && transactionResult && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 border border-gray-700 rounded-2xl p-8 max-w-md w-full mx-4 relative">
            {/* Close Button */}
            <button
              onClick={() => setShowSuccessModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Success Icon */}
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Transaction Successful!</h3>
              <p className="text-gray-400">Your TTF tokens have been sent successfully</p>
            </div>

            {/* Transaction Details */}
            <div className="space-y-4">
              <div className="bg-gray-700/50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">From:</span>
                  <button
                    onClick={() => copyAddress(transactionResult.from)}
                    className="text-xs text-[#00A88E] hover:text-[#00967D] flex items-center gap-1"
                  >
                    <Copy className="w-3 h-3" />
                    Copy
                  </button>
                </div>
                <p className="text-sm font-mono text-white break-all">{transactionResult.from}</p>
              </div>

              <div className="bg-gray-700/50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">To:</span>
                  <button
                    onClick={() => copyAddress(transactionResult.to)}
                    className="text-xs text-[#00A88E] hover:text-[#00967D] flex items-center gap-1"
                  >
                    <Copy className="w-3 h-3" />
                    Copy
                  </button>
                </div>
                <p className="text-sm font-mono text-white break-all">{transactionResult.to}</p>
              </div>

              <div className="bg-gray-700/50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">Amount:</span>
                </div>
                <p className="text-lg font-semibold text-[#00A88E]">{transactionResult.amount} TTF</p>
              </div>

              <div className="bg-gray-700/50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">Transaction ID:</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => copyAddress(transactionResult.txHash)}
                      className="text-xs text-[#00A88E] hover:text-[#00967D] flex items-center gap-1"
                    >
                      <Copy className="w-3 h-3" />
                      Copy
                    </button>
                    <a
                      href={`https://Awakening.bdagscan.com/tx/${transactionResult.txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-[#00A88E] hover:text-[#00967D] flex items-center gap-1"
                    >
                      <ExternalLink className="w-3 h-3" />
                      View
                    </a>
                  </div>
                </div>
                <p className="text-sm font-mono text-white break-all">{transactionResult.txHash}</p>
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={() => setShowSuccessModal(false)}
              className="w-full mt-6 bg-gradient-to-r from-[#00A88E] to-[#00967D] hover:from-[#00967D] hover:to-[#007A6A] text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300"
            >
              Close
            </button>
          </div>
        </div>
      )}
          {/* Hero Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center">
                <Droplets className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                TestToFund <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Faucet</span>
              </h1>
            </div>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto font-light">
              Get BDAG testnet tokens and send TTF tokens to other addresses
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* BDAG Faucet Section */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                  <Gift className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">BDAG Faucet</h2>
                  <p className="text-gray-400">Get testnet BDAG tokens for gas fees</p>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-start gap-3 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <Info className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-blue-200">
                    <p className="font-medium mb-1">What is BDAG?</p>
                    <p>BDAG is the native token of BlockDAG Testnet used for transaction fees (gas). You need BDAG to send TTF tokens or interact with smart contracts.</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="font-semibold text-white flex items-center gap-2">
                    <Zap className="w-4 h-4 text-yellow-400" />
                    How to get BDAG:
                  </h3>
                  <div className="space-y-2 text-gray-300">
                    <p className="flex items-start gap-2">
                      <span className="text-green-400 font-bold">1.</span>
                      Connect your wallet to BlockDAG Testnet
                    </p>
                    <p className="flex items-start gap-2">
                      <span className="text-green-400 font-bold">2.</span>
                      Visit the official BDAG faucet
                    </p>
                    <p className="flex items-start gap-2">
                      <span className="text-green-400 font-bold">3.</span>
                      Enter your wallet address and request tokens
                    </p>
                    <p className="flex items-start gap-2">
                      <span className="text-green-400 font-bold">4.</span>
                      Wait for the tokens to arrive in your wallet
                    </p>
                  </div>
                </div>
              </div>

              <a
                href="https://Awakening.bdagscan.com/faucet?chain=EVM"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 group"
              >
                <Droplets className="w-5 h-5 group-hover:scale-110 transition-transform" />
                Get BDAG Tokens
                <ExternalLink className="w-4 h-4 group-hover:scale-110 transition-transform" />
              </a>
            </div>

            {/* TTF Token Send Section */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-[#00A88E] to-[#00967D] rounded-xl flex items-center justify-center">
                  <Send className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Send TTF Tokens</h2>
                  <p className="text-gray-400">Transfer TTF tokens to another address</p>
                </div>
              </div>

              {!isConnected ? (
                <div className="text-center py-8">
                  <Wallet className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-400 mb-6">Connect your wallet to send TTF tokens</p>
                  <button
                    onClick={handleConnect}
                    disabled={isLoading}
                    className="bg-gradient-to-r from-[#00A88E] to-[#00967D] hover:from-[#00967D] hover:to-[#007A6A] text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 mx-auto disabled:opacity-50"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Connecting...
                      </>
                    ) : (
                      <>
                        <Wallet className="w-5 h-5" />
                        Connect Wallet
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Wallet Info */}
                  <div className="bg-gray-700/30 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-400">Your Address:</span>
                      <button
                        onClick={() => copyAddress(walletAddress)}
                        className="text-xs text-[#00A88E] hover:text-[#00967D] flex items-center gap-1"
                      >
                        <Copy className="w-3 h-3" />
                        Copy
                      </button>
                    </div>
                    <p className="text-sm font-mono text-white break-all">{walletAddress}</p>
                    
                    {tokenBalance && (
                      <div className="mt-3 pt-3 border-t border-gray-600">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-400">TTF Balance:</span>
                          <span className="text-lg font-semibold text-[#00A88E]">
                            {parseFloat(tokenBalance).toFixed(4)} TTF
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Send Form */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Recipient Address
                      </label>
                      <input
                        type="text"
                        value={recipient}
                        onChange={(e) => setRecipient(e.target.value)}
                        placeholder="0x..."
                        className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#00A88E] transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Amount (TTF)
                      </label>
                      <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.0"
                        step="0.0001"
                        min="0"
                        className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#00A88E] transition-colors"
                      />
                    </div>

                    <button
                      onClick={handleSendTTF}
                      disabled={sendLoading || !recipient || !amount}
                      className="w-full bg-gradient-to-r from-[#00A88E] to-[#00967D] hover:from-[#00967D] hover:to-[#007A6A] text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {sendLoading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          Send TTF Tokens
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Additional Information */}
          <div className="mt-12 bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Info className="w-6 h-6 text-blue-400" />
              Important Information
            </h3>
            <div className="grid md:grid-cols-2 gap-6 text-gray-300">
              <div>
                <h4 className="font-semibold text-white mb-2">Before Sending TTF:</h4>
                <ul className="space-y-1 text-sm">
                  <li>• Make sure you have BDAG tokens for gas fees</li>
                  <li>• Double-check the recipient address</li>
                  <li>• Verify you have sufficient TTF balance</li>
                  <li>• Transactions are irreversible</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-2">Network Information:</h4>
                <ul className="space-y-1 text-sm">
                  <li>• Network: BlockDAG Testnet</li>
                  <li>• Chain ID: 1043</li>
                  <li>• RPC: rpc.Awakening.bdagscan.com</li>
                  <li>• TTF Contract: {TOKEN_ADDRESS.slice(0, 10)}...</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="mt-8 text-center">
            <Link
              href="/rewards"
              className="inline-flex items-center gap-2 text-[#00A88E] hover:text-[#00967D] font-medium transition-colors"
            >
              <ArrowRight className="w-4 h-4 rotate-180" />
              Back to Rewards
            </Link>
          </div>
        </div>
      </div>
      
      <TestMate apiKey="sLni4WmoTYtLho7u0bFW9PSCYcfIr0QcBhBi7Dyd" />
    </>
  );
}
