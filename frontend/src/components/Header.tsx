"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Wallet, 
  TrendingUp, 
  Droplets, 
  Home, 
  Activity, 
  User, 
  ChevronDown, 
  Copy, 
  ExternalLink, 
  LogOut 
} from 'lucide-react';
import { useWallet } from '../contexts/WalletContext';
import { EXPLORER_URL } from '../lib/web3';

const Header = () => {
  const { 
    address, 
    balance, 
    profileName, 
    isConnected, 
    isLoading, 
    connect, 
    disconnect 
  } = useWallet();
  
  const [showProfileDropdown, setShowProfileDropdown] = useState<boolean>(false);
  const [copySuccess, setCopySuccess] = useState<boolean>(false);

  const handleCopyAddress = async (): Promise<void> => {
    if (address) {
      try {
        await navigator.clipboard.writeText(address);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      } catch (error) {
        console.error('Failed to copy address:', error);
      }
    }
  };

  const handleConnect = async (): Promise<void> => {
    try {
      await connect();
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  };

  const handleDisconnect = async (): Promise<void> => {
    try {
      await disconnect();
      setShowProfileDropdown(false);
    } catch (error) {
      console.error('Failed to disconnect wallet:', error);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Background with blur effect */}
      <div className="absolute inset-0 bg-gray-900/80 backdrop-blur-xl border-b border-gray-800/50"></div>
      
      <div className="relative">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4">
          {/* Logo Section */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative">
                <Image
                  src="/TestToFund Logo.svg"
                  alt="TestToFund Logo"
                  width={32}
                  height={32}
                  className="w-8 h-8 group-hover:scale-110 transition-all duration-300"
                />
                <div className="absolute inset-0 bg-[#00A88E]/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
              </div>
              <span className="font-bold text-lg text-gray-100 group-hover:text-white transition-colors">
                TestToFund
              </span>
            </Link>
            
            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              <Link 
                href="/home" 
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-400 hover:text-gray-100 hover:bg-gray-800/50 rounded-lg transition-all duration-200 group"
              >
                <Home className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span className="font-medium">Home</span>
              </Link>
              <Link 
                href="/rewards" 
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-400 hover:text-gray-100 hover:bg-gray-800/50 rounded-lg transition-all duration-200 group"
              >
                <TrendingUp className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span className="font-medium">Earn</span>
              </Link>
              <Link 
                href="/faucet" 
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-400 hover:text-gray-100 hover:bg-gray-800/50 rounded-lg transition-all duration-200 group"
              >
                <Droplets className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span className="font-medium">Faucet</span>
              </Link>
            </nav>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            {isConnected ? (
              <div className="flex items-center gap-3">
                {/* Balance Display */}
                {balance && (
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-800/50 border border-gray-700/50 rounded-lg">
                    <Activity className="w-4 h-4 text-[#00A88E]" />
                    <span className="text-sm text-gray-200 font-medium">
                      {parseFloat(balance).toFixed(2)}
                    </span>
                    <span className="text-xs text-[#00A88E] font-bold">TTF</span>
                  </div>
                )}
                
                {/* Network Status */}
                <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-800/50 border border-gray-700/50 rounded-lg">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-xs text-gray-300 font-mono">BlockDAG Testnet</span>
                </div>
                
                {/* Profile Name Display */}
                <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-800/20 border border-purple-700/30 rounded-lg">
                  <User className="w-3 h-3 text-purple-400" />
                  <span className="text-xs text-purple-300 font-medium">
                    {profileName || 'Anonymous Trader'}
                  </span>
                </div>
                
                {/* Profile Button */}
                <div className="relative">
                  <button 
                    onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                    className="flex items-center gap-2 px-3 py-1.5 bg-[#00A88E]/10 border border-[#00A88E]/20 rounded-lg hover:bg-[#00A88E]/20 transition-colors"
                    type="button"
                  >
                    <User className="w-4 h-4 text-[#00A88E]" />
                    <span className="text-sm text-[#00A88E] font-mono font-medium">
                      {address ? `${address.slice(0,6)}...${address.slice(-4)}` : ''}
                    </span>
                    <ChevronDown className={`w-3 h-3 text-[#00A88E] transition-transform ${showProfileDropdown ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Profile Dropdown */}
                  {showProfileDropdown && (
                    <div className="absolute right-0 top-full mt-2 w-72 bg-gray-800 border border-gray-700 rounded-lg shadow-xl p-4 z-50">
                      <div className="space-y-4">
                        {/* Profile Name */}
                        <div>
                          <label className="text-xs text-gray-400 uppercase tracking-wide font-medium">
                            Profile Name
                          </label>
                          <div className="flex items-center gap-2 mt-1">
                            <User className="w-4 h-4 text-[#00A88E]" />
                            <span className="text-lg text-white font-semibold">
                              {profileName || 'Anonymous Trader'}
                            </span>
                          </div>
                        </div>

                        {/* Wallet Address */}
                        {address && (
                          <div>
                            <label className="text-xs text-gray-400 uppercase tracking-wide font-medium">
                              Wallet Address
                            </label>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-sm text-gray-200 font-mono flex-1 truncate">
                                {address}
                              </span>
                              <button
                                onClick={handleCopyAddress}
                                className="p-1.5 hover:bg-gray-700 rounded transition-colors"
                                title="Copy address"
                                type="button"
                              >
                                <Copy className={`w-3 h-3 ${copySuccess ? 'text-green-400' : 'text-gray-400'}`} />
                              </button>
                            </div>
                            {copySuccess && (
                              <p className="text-xs text-green-400 mt-1">Address copied!</p>
                            )}
                          </div>
                        )}

                        {/* Balance */}
                        {balance && (
                          <div>
                            <label className="text-xs text-gray-400 uppercase tracking-wide font-medium">
                              TTF Balance
                            </label>
                            <div className="flex items-center gap-2 mt-1">
                              <Activity className="w-4 h-4 text-[#00A88E]" />
                              <span className="text-lg text-white font-semibold">
                                {parseFloat(balance).toFixed(4)}
                              </span>
                              <span className="text-sm text-[#00A88E] font-bold">TTF</span>
                            </div>
                          </div>
                        )}

                        {/* Network */}
                        <div>
                          <label className="text-xs text-gray-400 uppercase tracking-wide font-medium">
                            Network
                          </label>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                            <span className="text-sm text-gray-200">BlockDAG Testnet</span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="border-t border-gray-700 pt-4 space-y-2">
                          {address && (
                            <a
                              href={`${EXPLORER_URL}/address/${address}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 w-full p-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded transition-colors text-sm"
                            >
                              <ExternalLink className="w-4 h-4" />
                              View on Explorer
                            </a>
                          )}
                          <button
                            onClick={handleDisconnect}
                            className="flex items-center gap-2 w-full p-2 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded transition-colors text-sm"
                            type="button"
                          >
                            <LogOut className="w-4 h-4" />
                            Disconnect
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <button 
                onClick={handleConnect} 
                disabled={isLoading} 
                className="group flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-gray-800 to-gray-700 hover:from-[#00A88E] hover:to-[#00967D] border border-gray-600 hover:border-[#00A88E] text-gray-200 hover:text-white rounded-lg font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-[#00A88E]/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                type="button"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-sm">Connecting...</span>
                  </>
                ) : (
                  <>
                    <Wallet className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    <span className="text-sm">Connect</span>
                  </>
                )}
              </button>
            )}
            
            {/* Mobile Menu Trigger */}
            <button 
              className="md:hidden p-2 text-gray-400 hover:text-gray-100 hover:bg-gray-800/50 rounded-lg transition-colors"
              type="button"
            >
              <ChevronDown className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
