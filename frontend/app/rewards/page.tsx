"use client";
import React, { useState, useEffect } from 'react';
import { Wallet, Award, Upload, CheckCircle, Clock, ExternalLink, AlertCircle, TrendingUp, RefreshCw } from 'lucide-react';
import { connectWallet, formatAddress } from '../../src/lib/web3';
import { checkTokenBalance } from '../../src/lib/tokenUtils';
import BackgroundVideo from '../../src/components/BackgroundVideo';
import NetworkStatus from '../../src/components/NetworkStatus';
import NetworkSetupGuide from '../../src/components/NetworkSetupGuide';
import WalletDetection from '../../src/components/WalletDetection';

interface ClaimStatus {
  canClaim: boolean;
  reason?: string;
  alreadyClaimed?: boolean;
  certificateVerified?: boolean;
}

interface ClaimHistory {
  id: string;
  amount: string;
  status: 'completed' | 'pending' | 'failed';
  txHash?: string;
  claimedAt: string;
  certificateUrl?: string;
}

interface SuccessMessage {
  message: string;
  transactionHash?: string;
  explorerUrl?: string;
  amount?: string;
  balance?: string;
}

export default function RewardsPage() {
  const [walletAddress, setWalletAddress] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [certificate, setCertificate] = useState<File | null>(null);
  const [certificateUrl, setCertificateUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [claimStatus, setClaimStatus] = useState<ClaimStatus>({ canClaim: false });
  const [claimHistory, setClaimHistory] = useState<ClaimHistory[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<SuccessMessage | null>(null);
  const [tokenBalance, setTokenBalance] = useState<string>('0');
  const [balanceLoading, setBalanceLoading] = useState(false);

  // Check token balance
  async function checkWalletBalance() {
    if (!walletAddress) return;
    
    setBalanceLoading(true);
    try {
      const balance = await checkTokenBalance(walletAddress);
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

  // Connect wallet
  async function handleConnectWallet() {
    try {
      setError(null);
      setLoading(true);
      
      console.log('🚀 Starting wallet connection process...');
      const result = await connectWallet();
      
      setWalletAddress(result.address);
      setIsConnected(true);
      
      // Show success message with details
      const messages = [];
      if (result.networkSwitched) {
        messages.push('✅ Connected to Primordial BlockDAG Testnet');
      }
      if (result.tokenAdded) {
        messages.push('✅ TTF Token ready in your wallet');
      }
      
      if (messages.length > 0) {
        setSuccess({
          message: `Wallet connected successfully! ${messages.join(', ')}`,
          amount: '',
          balance: ''
        });
        
        // Clear success message after 4 seconds
        setTimeout(() => setSuccess(null), 4000);
      }
      
      // Load claim status, history, and token balance after connecting
      await Promise.all([
        checkClaimEligibility(result.address),
        loadClaimHistory(result.address),
        checkWalletBalance()
      ]);
      
    } catch (err: any) {
      console.error('❌ Wallet connection failed:', err);
      setError(err?.message || 'Failed to connect wallet. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  // Disconnect wallet
  async function handleDisconnectWallet() {
    const confirmed = window.confirm('Are you sure you want to disconnect your wallet? The page will refresh.');
    
    if (confirmed) {
      // Clear all wallet-related state
      setWalletAddress('');
      setIsConnected(false);
      setClaimStatus({ canClaim: false });
      setClaimHistory([]);
      setTokenBalance('0');
      setError(null);
      setSuccess(null);
      
      // Auto refresh the page
      window.location.reload();
    }
  }

  // Check if user can claim rewards (requires Udemy link)
  async function checkClaimEligibility(address: string, udemyLink?: string) {
    try {
      // Build URL with Udemy link parameter
      const url = new URL(`/api/rewards/check-eligibility/${address}`, window.location.origin);
      if (udemyLink) {
        url.searchParams.set('udemyLink', udemyLink);
      }
      
      const res = await fetch(url.toString());
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to check eligibility');
      }
      
      setClaimStatus(data);
    } catch (err: any) {
      console.error('Eligibility check failed:', err);
      setClaimStatus({ 
        canClaim: false, 
        reason: err.message || 'Unable to verify eligibility' 
      });
    }
  }

  // Load claim history
  async function loadClaimHistory(address: string) {
    try {
      const res = await fetch(`/api/rewards/history/${address}`);
      if (res.ok) {
        const data = await res.json();
        setClaimHistory(data || []);
      }
    } catch (err) {
      console.error('Failed to load claim history:', err);
    }
  }

  // Handle certificate file upload
  function handleCertificateUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
      if (!validTypes.includes(file.type)) {
        setError('Please upload a valid certificate file (JPG, PNG, or PDF)');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }



      setCertificate(file);
      setError(null);
    }
  }

  // Verify certificate and claim rewards
  async function handleClaimRewards() {
    // Validate prerequisites
    if (!walletAddress) {
      setError('Please connect your wallet first');
      return;
    }

    if (!certificateUrl) {
      setError('Please provide a valid Udemy certificate URL');
      return;
    }

    if (!claimStatus.canClaim) {
      setError('You are not eligible to claim tokens with this certificate');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Create form data with security measures
      const formData = new FormData();
      formData.append('walletAddress', walletAddress);
      formData.append('certificateUrl', certificateUrl);
      
      // Add timestamp to prevent replay attacks
      formData.append('timestamp', Date.now().toString());
      
      // Only send certificateUrl (no file upload needed)
      const res = await fetch('/api/rewards/claim', {
        method: 'POST',
        body: formData,
        headers: {
          // Add additional security headers if needed
        }
      });

      const data = await res.json();

      // Handle different response scenarios
      if (res.ok) {
        // Success case
        setSuccess({
          message: data.message || 'Successfully claimed 2000 TTF tokens!',
          transactionHash: data.transactionHash,
          explorerUrl: data.explorerUrl,
          amount: data.amount,
          balance: data.receiverBalance
        });
        
        // Refresh claim status, history, and balance
        await Promise.all([
          checkClaimEligibility(walletAddress, certificateUrl),
          loadClaimHistory(walletAddress),
          checkWalletBalance()
        ]);
        
        // Clear form
        setCertificateUrl('');
        
      } else if (res.status === 202) {
        // Transaction submitted but confirmation timeout
        setSuccess({
          message: 'Transaction submitted successfully! Please check your wallet balance.',
          transactionHash: data.transactionHash,
          explorerUrl: data.explorerUrl,
          amount: data.amount || '2000',
          balance: data.receiverBalance
        });
        
        // Also show a warning
        setTimeout(() => {
          setError(`${data.error}\n\nNote: ${data.note || 'Check your wallet balance to confirm the transfer.'}`);
        }, 100);
        
      } else {
        // Error case
        throw new Error(data.error || 'Failed to claim rewards');
      }
      
    } catch (err: any) {
      console.error('Claim error:', err);
      setError(err?.message || 'Failed to claim rewards. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  // Format date
  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  return (
    <>
      <BackgroundVideo />
      <div className="relative z-10 min-h-screen">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Hero Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
              Learning <span className="bg-gradient-to-r from-gray-100 to-gray-400 bg-clip-text text-transparent">Rewards</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto font-light">
              Complete educational courses, validate your learning, and earn 
              <span className="text-gray-200 font-medium"> 2000 TTF tokens</span> for each certificate.
            </p>
          </div>

          {/* Wallet Detection */}
          <WalletDetection />

          {/* Wallet Connection */}
          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <Wallet className="w-6 h-6 text-gray-400" />
              Connect Your Wallet
            </h2>
        {!isConnected ? (
          <div className="text-center">
            <p className="text-gray-400 mb-6">Connect your wallet to start earning TTF tokens</p>
            <button 
              onClick={handleConnectWallet}
              disabled={loading}
              className="px-8 py-4 bg-white text-gray-900 font-semibold rounded-xl hover:bg-gray-100 disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed transition-all duration-300 flex items-center gap-2 mx-auto"
            >
              {loading ? (
                <>
                  <Clock className="w-5 h-5 animate-spin" />
                  Connecting Wallet...
                </>
              ) : (
                <>
                  <Wallet className="w-5 h-5" />
                  Connect Wallet
                </>
              )}
            </button>
            
            {/* Network Information */}
            <div className="mt-6 p-4 bg-gray-800/50 border border-gray-700 rounded-lg text-sm text-gray-300">
              <h4 className="font-semibold mb-2 text-white">Network Requirements:</h4>
              <div className="space-y-1 text-left">
                <p><span className="text-gray-400">Network:</span> Primordial BlockDAG Testnet</p>
                <p><span className="text-gray-400">Chain ID:</span> 1043</p>
                <p><span className="text-gray-400">RPC URL:</span> https://rpc.primordial.bdagscan.com/</p>
                <p><span className="text-gray-400">Currency:</span> BDAG</p>
              </div>
              <p className="mt-2 text-xs text-gray-500">
                🔄 The network and TTF token will be automatically added to your wallet
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-green-900/50 text-green-400 px-3 py-1 rounded-full text-sm border border-green-800 flex items-center gap-1">
                  <CheckCircle className="w-4 h-4" />
                  Connected
                </div>
                <span className="font-mono text-sm text-gray-300">{formatAddress(walletAddress)}</span>
              </div>
              
              {/* Disconnect Button */}
              <button
                onClick={handleDisconnectWallet}
                disabled={loading}
                className="px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-900/20 border border-red-800 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Disconnect wallet"
              >
                Disconnect
              </button>
            </div>
            
            {/* Token Balance Display */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Your TTF Balance</p>
                  <p className="text-2xl font-bold text-white">
                    {balanceLoading ? (
                      <span className="flex items-center gap-2">
                        <Clock className="w-5 h-5 animate-spin" />
                        Loading...
                      </span>
                    ) : (
                      `${parseFloat(tokenBalance).toLocaleString()} TTF`
                    )}
                  </p>
                </div>
                <button
                  onClick={checkWalletBalance}
                  disabled={balanceLoading}
                  className="p-2 text-gray-400 hover:text-white transition-colors disabled:opacity-50"
                  title="Refresh balance"
                >
                  <RefreshCw className={`w-5 h-5 ${balanceLoading ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Network Status */}
      <NetworkStatus 
        isConnected={isConnected} 
        onNetworkChange={() => {
          // Refresh data when network changes
          if (walletAddress) {
            Promise.all([
              checkClaimEligibility(walletAddress),
              loadClaimHistory(walletAddress),
              checkWalletBalance()
            ]);
          }
        }}
      />

      {/* Network Setup Guide */}
      <NetworkSetupGuide />

      {/* Claim Section */}
      {isConnected && (
        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <Award className="w-6 h-6 text-gray-400" />
            Submit Your Certificate
          </h2>
          
          {/* Claim Status */}
          <div className="mb-6">
            {claimStatus.alreadyClaimed ? (
              <div className="bg-blue-900/30 border border-blue-800 text-blue-300 p-4 rounded-lg">
                <CheckCircle className="w-5 h-5 inline mr-2" />
                You have already claimed your rewards!
              </div>
            ) : claimStatus.canClaim ? (
              <div className="bg-green-900/30 border border-green-800 text-green-300 p-4 rounded-lg">
                <CheckCircle className="w-5 h-5 inline mr-2" />
                Valid certificate detected! Ready to claim 2000 TTF tokens.
              </div>
            ) : claimStatus.reason ? (
              <div className="bg-red-900/30 border border-red-800 text-red-300 p-4 rounded-lg">
                <AlertCircle className="w-5 h-5 inline mr-2" />
                {claimStatus.reason}
              </div>
            ) : (
              <div className="bg-yellow-900/30 border border-yellow-800 text-yellow-300 p-4 rounded-lg">
                <Upload className="w-5 h-5 inline mr-2" />
                Please provide your Udemy certificate URL to claim rewards
              </div>
            )}
          </div>

          {!claimStatus.alreadyClaimed && (
            <div className="space-y-6">
              {/* Certificate URL */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Udemy Certificate URL (Required)
                </label>
                <input
                  type="url"
                  value={certificateUrl}
                  onChange={(e) => {
                    const url = e.target.value;
                    setCertificateUrl(url);
                    
                    // Clear any file upload when URL is entered
                    if (url && certificate) {
                      setCertificate(null);
                    }
                    
                    // Check eligibility when URL changes and wallet is connected
                    if (walletAddress && url) {
                      checkClaimEligibility(walletAddress, url);
                    } else if (walletAddress) {
                      // Reset status if URL is cleared
                      setClaimStatus({ 
                        canClaim: false, 
                        reason: 'Udemy certificate link is required' 
                      });
                    }
                  }}
                  placeholder="https://www.udemy.com/certificate/..."
                  className="w-full px-4 py-3 border border-gray-700 rounded-lg bg-gray-800/50 text-gray-200 placeholder-gray-500 focus:ring-2 focus:ring-gray-600 focus:border-gray-600 outline-none"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Please provide a valid Udemy certificate URL to claim your tokens
                </p>
              </div>

              {/* Claim Button */}
              <button
                onClick={handleClaimRewards}
                disabled={loading || !certificateUrl || !claimStatus.canClaim}
                className="w-full bg-white text-gray-900 hover:bg-gray-100 disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed py-4 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Clock className="w-5 h-5 animate-spin" />
                    Verifying & Processing...
                  </>
                ) : !claimStatus.canClaim ? (
                  <>
                    <AlertCircle className="w-5 h-5" />
                    {claimStatus.reason || 'Cannot Claim'}
                  </>
                ) : (
                  <>
                    <TrendingUp className="w-5 h-5" />
                    Claim 2000 TTF Tokens
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Error/Success Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg mb-6">
          ❌ {error}
        </div>
      )}

      {success && (
        <div className="bg-green-900/30 border border-green-800 text-green-300 p-4 rounded-lg mb-6">
          <div className="space-y-2">
            <div className="font-semibold flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              {success.message}
            </div>
            {success.amount && (
              <div className="flex items-center gap-2 text-green-400">
                <TrendingUp className="w-4 h-4" />
                Amount: {success.amount} TTF
              </div>
            )}
            {success.balance && (
              <div className="flex items-center gap-2 text-green-400">
                <Wallet className="w-4 h-4" />
                New Balance: {success.balance} TTF
              </div>
            )}
            {success.transactionHash && success.explorerUrl && (
              <div className="flex items-center gap-2">
                <ExternalLink className="w-4 h-4" />
                <a 
                  href={success.explorerUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="underline hover:text-green-200"
                >
                  View Transaction: {success.transactionHash.slice(0, 8)}...{success.transactionHash.slice(-6)}
                </a>
              </div>
            )}
            <div className="text-sm text-green-400 mt-2 p-2 bg-green-900/20 rounded border border-green-800 flex items-center justify-between">
              <span>💡 Tip: If you don't see the tokens immediately, please refresh your wallet or check the transaction on the explorer above.</span>
              <button
                onClick={checkWalletBalance}
                className="ml-2 px-3 py-1 bg-green-800 hover:bg-green-700 rounded text-sm flex items-center gap-1 transition-colors"
              >
                <RefreshCw className="w-3 h-3" />
                Refresh Balance
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Claim History */}
      {isConnected && claimHistory.length > 0 && (
        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <Clock className="w-6 h-6 text-gray-400" />
            Claim History
          </h2>
          <div className="space-y-4">
            {claimHistory.map((claim) => (
              <div key={claim.id} className="border border-gray-700 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="text-lg font-semibold text-white">
                    +{claim.amount} TTF
                  </div>
                  <div className={`px-2 py-1 rounded text-xs font-medium ${
                    claim.status === 'completed' ? 'bg-green-900/50 text-green-400 border border-green-800' :
                    claim.status === 'pending' ? 'bg-yellow-900/50 text-yellow-400 border border-yellow-800' :
                    'bg-red-900/50 text-red-400 border border-red-800'
                  }`}>
                    {claim.status.toUpperCase()}
                  </div>
                </div>
                <div className="text-sm text-gray-600 mb-1">
                  Claimed: {formatDate(claim.claimedAt)}
                </div>
                {claim.txHash && (
                  <div className="text-sm">
                    <span className="text-gray-600">Transaction: </span>
                    <a
                      href={`https://primordial.bdagscan.com/tx/${claim.txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#409F01] hover:text-[#367A01] underline break-all"
                    >
                      {claim.txHash}
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
        </div>
      </div>
    </>
  );
}