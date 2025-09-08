import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, Wallet, LogOut } from 'lucide-react';
import { connectWallet, disconnectWallet, restoreWalletConnection, formatAddress } from '../lib/web3Onboard';
import { checkTokenBalance } from '../lib/tokenUtils';

interface NavbarProps {
  showWalletConnect?: boolean;
}

export default function Navbar({ showWalletConnect = true }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [tokenBalance, setTokenBalance] = useState<string>('0');
  const [balanceLoading, setBalanceLoading] = useState(false);

  useEffect(() => {
    checkWalletConnection();
  }, []);

  const checkWalletConnection = async () => {
    try {
      const restored = await restoreWalletConnection();
      if (restored.connected && restored.address) {
        setWalletAddress(restored.address);
        setIsConnected(true);
        await checkWalletBalance(restored.address);
      }
    } catch (error) {
      console.error('Failed to restore wallet:', error);
    }
  };

  const checkWalletBalance = async (address?: string) => {
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
  };

  // Auto-refresh balance when wallet address changes
  useEffect(() => {
    if (walletAddress) {
      checkWalletBalance();
    }
  }, [walletAddress]);

  const handleConnectWallet = async () => {
    try {
      setIsConnecting(true);
      const result = await connectWallet();
      setWalletAddress(result.address);
      setIsConnected(true);
      await checkWalletBalance(result.address);
      setIsMenuOpen(false); // Close mobile menu after connecting
    } catch (error: any) {
      console.error('Failed to connect wallet:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnectWallet = async () => {
    try {
      await disconnectWallet();
      setWalletAddress('');
      setIsConnected(false);
      setTokenBalance('0');
      setIsMenuOpen(false); // Close mobile menu after disconnecting
    } catch (error: any) {
      console.error('Failed to disconnect wallet:', error);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-md border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3" onClick={closeMenu}>
            <Image
              src="/TestToFund Logo.svg"
              alt="TestToFund Logo"
              width={32}
              height={32}
              className="w-8 h-8"
            />
            <span className="font-bold text-xl text-white">TestToFund</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              href="/home" 
              className="text-gray-300 hover:text-white transition-colors duration-200"
            >
              Courses
            </Link>
            <Link 
              href="/rewards" 
              className="text-gray-300 hover:text-white transition-colors duration-200"
            >
              Rewards
            </Link>
            <Link 
              href="/faucet" 
              className="text-gray-300 hover:text-white transition-colors duration-200"
            >
              Faucet
            </Link>
            
            {/* Wallet Connection - Desktop */}
            {showWalletConnect && (
              <div className="flex items-center">
                {isConnected ? (
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 bg-gray-800 px-3 py-2 rounded-lg">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-300">{formatAddress(walletAddress)}</span>
                        <span className="text-xs text-gray-500">|</span>
                        <span className="text-sm text-[#00A88E] font-medium">
                          {balanceLoading ? '...' : `${parseFloat(tokenBalance).toFixed(2)} TTF`}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={handleDisconnectWallet}
                      className="flex items-center gap-2 px-3 py-2 text-gray-300 hover:text-red-400 transition-colors duration-200"
                      title="Disconnect Wallet"
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleConnectWallet}
                    disabled={isConnecting}
                    className="flex items-center gap-2 bg-white text-gray-900 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    <Wallet className="w-4 h-4" />
                    {isConnecting ? 'Connecting...' : 'Connect Wallet'}
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-300 hover:text-white transition-colors duration-200"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-gray-900/95 backdrop-blur-md border-t border-gray-800">
              <Link
                href="/home"
                className="block px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-md transition-all duration-200"
                onClick={closeMenu}
              >
                Courses
              </Link>
              <Link
                href="/rewards"
                className="block px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-md transition-all duration-200"
                onClick={closeMenu}
              >
                Rewards
              </Link>
              <Link
                href="/faucet"
                className="block px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-md transition-all duration-200"
                onClick={closeMenu}
              >
                Faucet
              </Link>
              
              {/* Wallet Connection - Mobile */}
              {showWalletConnect && (
                <div className="border-t border-gray-800 pt-3 mt-3">
                  {isConnected ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 px-3 py-2 bg-gray-800 rounded-md">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        <div className="flex flex-col gap-1">
                          <span className="text-sm text-gray-300">{formatAddress(walletAddress)}</span>
                          <span className="text-xs text-[#00A88E] font-medium">
                            {balanceLoading ? 'Loading...' : `${parseFloat(tokenBalance).toFixed(2)} TTF`}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={handleDisconnectWallet}
                        className="flex items-center gap-2 w-full px-3 py-2 text-gray-300 hover:text-red-400 hover:bg-gray-800 rounded-md transition-all duration-200"
                      >
                        <LogOut className="w-4 h-4" />
                        Disconnect Wallet
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={handleConnectWallet}
                      disabled={isConnecting}
                      className="flex items-center gap-2 w-full bg-white text-gray-900 px-3 py-2 rounded-md font-medium hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    >
                      <Wallet className="w-4 h-4" />
                      {isConnecting ? 'Connecting...' : 'Connect Wallet'}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
