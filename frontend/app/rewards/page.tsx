"use client";
import React, { useState, useEffect } from 'react';
import { connectWallet, formatAddress } from '../../src/lib/web3';

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

export default function RewardsPage() {
  const [walletAddress, setWalletAddress] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [certificate, setCertificate] = useState<File | null>(null);
  const [certificateUrl, setCertificateUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [claimStatus, setClaimStatus] = useState<ClaimStatus>({ canClaim: false });
  const [claimHistory, setClaimHistory] = useState<ClaimHistory[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Connect wallet
  async function handleConnectWallet() {
    try {
      setError(null);
      const result = await connectWallet();
      setWalletAddress(result.address);
      setIsConnected(true);
      
      // Load claim status and history after connecting
      await Promise.all([
        checkClaimEligibility(result.address),
        loadClaimHistory(result.address)
      ]);
    } catch (err: any) {
      setError(err?.message || 'Failed to connect wallet');
    }
  }

  // Check if user can claim rewards
  async function checkClaimEligibility(address: string) {
    try {
      const res = await fetch(`/api/rewards/check-eligibility/${address}`);
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to check eligibility');
      }
      
      setClaimStatus(data);
    } catch (err: any) {
      console.error('Eligibility check failed:', err);
      setClaimStatus({ canClaim: false, reason: 'Unable to verify eligibility' });
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
  if (!walletAddress || (!certificate && !certificateUrl)) {
    setError('Please connect wallet and provide certificate');
    return;
  }

  setLoading(true);
  setError(null);
  setSuccess(null);

  try {
    const formData = new FormData();
    formData.append('walletAddress', walletAddress);
    
    if (certificate) {
      formData.append('certificate', certificate);
    }
    
    if (certificateUrl) {
      formData.append('certificateUrl', certificateUrl);
    }

    const res = await fetch('/api/rewards/claim', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || 'Failed to claim rewards');
    }

    setSuccess(`🎉 Successfully claimed 2000 TTF tokens! Transaction: ${data.txHash}`);
    
    // Refresh claim status and history
    await Promise.all([
      checkClaimEligibility(walletAddress),
      loadClaimHistory(walletAddress)
    ]);
    
    // Clear form
    setCertificate(null);
    setCertificateUrl('');
    
  } catch (err: any) {
    setError(err?.message || 'Failed to claim rewards');
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
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-gradient-to-r from-[#00A88E] to-[#409F01] text-white p-6 rounded-lg mb-6">
        <h1 className="text-3xl font-bold mb-2">🎓 Learning Rewards</h1>
        <p className="text-lg opacity-90">Complete Udemy courses and claim 2000 TTF tokens!</p>
      </div>

      {/* Wallet Connection */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Connect Your Wallet</h2>
        {!isConnected ? (
          <button 
            onClick={handleConnectWallet}
            className="bg-[#00A88E] hover:bg-[#00967D] text-white px-6 py-3 rounded-lg transition-colors"
          >
            Connect Wallet
          </button>
        ) : (
          <div className="flex items-center gap-3">
            <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
              ✓ Connected
            </div>
            <span className="font-mono text-sm">{formatAddress(walletAddress)}</span>
          </div>
        )}
      </div>

      {/* Claim Section */}
      {isConnected && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">📜 Submit Your Certificate</h2>
          
          {/* Claim Status */}
          <div className="mb-4">
            {claimStatus.alreadyClaimed ? (
              <div className="bg-blue-50 border border-blue-200 text-blue-800 p-3 rounded-lg">
                🎉 You have already claimed your rewards!
              </div>
            ) : claimStatus.canClaim ? (
              <div className="bg-green-50 border border-green-200 text-green-800 p-3 rounded-lg">
                ✅ You are eligible to claim 2000 TTF tokens!
              </div>
            ) : (
              <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-3 rounded-lg">
                📋 Please upload your Udemy certificate to claim rewards
              </div>
            )}
          </div>

          {!claimStatus.alreadyClaimed && (
            <div className="space-y-4">
              {/* File Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Certificate (JPG, PNG, PDF - Max 5MB)
                </label>
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png,.pdf"
                  onChange={handleCertificateUpload}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#00A88E] file:text-white hover:file:bg-[#00967D] file:cursor-pointer cursor-pointer"
                />
              </div>

              {/* OR divider */}
              <div className="flex items-center">
                <div className="flex-1 border-t border-gray-300"></div>
                <span className="px-3 text-gray-500 text-sm">OR</span>
                <div className="flex-1 border-t border-gray-300"></div>
              </div>

              {/* Certificate URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Udemy Certificate URL
                </label>
                <input
                  type="url"
                  value={certificateUrl}
                  onChange={(e) => setCertificateUrl(e.target.value)}
                  placeholder="https://www.udemy.com/certificate/..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00A88E] focus:border-[#00A88E] outline-none"
                />
              </div>

              {/* Claim Button */}
              <button
                onClick={handleClaimRewards}
                disabled={loading || (!certificate && !certificateUrl)}
                className="w-full bg-[#409F01] hover:bg-[#367A01] disabled:bg-gray-400 text-white py-3 px-6 rounded-lg font-semibold transition-colors"
              >
                {loading ? '⏳ Verifying & Processing...' : '🎁 Claim 2000 TTF Tokens'}
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
        <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded-lg mb-6">
          {success}
        </div>
      )}

      {/* Claim History */}
      {isConnected && claimHistory.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">📈 Your Claim History</h2>
          <div className="space-y-3">
            {claimHistory.map((claim) => (
              <div key={claim.id} className="border border-gray-100 rounded-lg p-4 hover:border-[#00A88E]/30 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <div className="text-lg font-semibold text-[#00A88E]">
                    +{claim.amount} TTF
                  </div>
                  <div className={`px-2 py-1 rounded text-xs font-medium ${
                    claim.status === 'completed' ? 'bg-green-100 text-green-800' :
                    claim.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
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
  );
}