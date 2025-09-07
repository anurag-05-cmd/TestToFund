"use client";
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { connectWallet } from '../../src/lib/web3';

export default function WelcomePage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isConnecting, setIsConnecting] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      return () => container.removeEventListener('mousemove', handleMouseMove);
    }
  }, []);

  const handleConnectWallet = async () => {
    setIsConnecting(true);
    try {
      await connectWallet();
      // Redirect to home after successful connection
      window.location.href = '/';
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div 
      ref={containerRef}
      className="min-h-screen relative overflow-hidden cursor-none"
      style={{
        background: `
          radial-gradient(circle at 20% 80%, #00A88E 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, #409F01 0%, transparent 50%),
          radial-gradient(circle at 40% 40%, #00A88E 0%, transparent 50%),
          linear-gradient(135deg, #0F1629 0%, #1a2332 25%, #2a3441 50%, #1a2332 75%, #0F1629 100%)
        `
      }}
    >
      {/* Background Text with Torch Reveal Effect */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div 
          className="relative w-full h-full flex items-center justify-center"
          style={{
            maskImage: `radial-gradient(circle 150px at ${mousePosition.x}px ${mousePosition.y}px, rgba(0,0,0,1) 0%, rgba(0,0,0,0.8) 40%, rgba(0,0,0,0) 100%)`,
            WebkitMaskImage: `radial-gradient(circle 150px at ${mousePosition.x}px ${mousePosition.y}px, rgba(0,0,0,1) 0%, rgba(0,0,0,0.8) 40%, rgba(0,0,0,0) 100%)`,
          }}
        >
          <Image
            src="/TestToFund Background Text.png"
            alt="TestToFund Background"
            fill
            className="object-contain opacity-30"
            priority
          />
        </div>
      </div>

      {/* Cursor Glow Effect */}
      <div 
        className="fixed pointer-events-none z-50"
        style={{
          left: mousePosition.x - 75,
          top: mousePosition.y - 75,
          width: 150,
          height: 150,
          background: `radial-gradient(circle, rgba(0,168,142,0.3) 0%, rgba(0,168,142,0.1) 30%, transparent 70%)`,
          borderRadius: '50%',
          filter: 'blur(20px)',
        }}
      />

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6">
        {/* Logo */}
        <div className="mb-8 transform hover:scale-105 transition-transform duration-300 animate-float">
          <Image
            src="/TestToFund Logo.svg"
            alt="TestToFund Logo"
            width={120}
            height={120}
            className="drop-shadow-2xl"
          />
        </div>

        {/* Welcome Card */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 max-w-lg text-center shadow-2xl animate-reveal">
          <h1 className="text-4xl font-bold text-white mb-4 bg-gradient-to-r from-white via-[#00A88E] to-white bg-clip-text text-transparent">
            Welcome to TestToFund
          </h1>
          <p className="text-xl text-gray-200 mb-8 leading-relaxed">
            Complete Courses, Get Verified and Earn TTF
          </p>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/"
              className="group relative px-8 py-3 bg-[#00A88E] hover:bg-[#00967D] text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg overflow-hidden"
            >
              <span className="relative z-10">Go Home</span>
              <div className="absolute inset-0 bg-gradient-to-r from-[#00A88E] to-[#409F01] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
            
            <button 
              onClick={handleConnectWallet}
              disabled={isConnecting}
              className="group relative px-8 py-3 bg-transparent border-2 border-[#00A88E] text-[#00A88E] hover:bg-[#00A88E] hover:text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="relative z-10">
                {isConnecting ? 'Connecting...' : 'Connect Wallet'}
              </span>
            </button>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-center group hover:bg-white/10 transition-all duration-300">
            <div className="w-12 h-12 bg-[#00A88E]/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-[#00A88E]/30 transition-colors">
              <svg className="w-6 h-6 text-[#00A88E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1a3 3 0 000-6h-1m1 6V9a3 3 0 003-3m-3 6h3m-3 0v1a3 3 0 003 3M9 10v1a3 3 0 003 3m0-4V9a3 3 0 00-3-3" />
              </svg>
            </div>
            <h3 className="text-white font-semibold mb-2">Learn & Earn</h3>
            <p className="text-gray-300 text-sm">Watch educational videos and earn TTF tokens for your engagement</p>
          </div>

          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-center group hover:bg-white/10 transition-all duration-300">
            <div className="w-12 h-12 bg-[#409F01]/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-[#409F01]/30 transition-colors">
              <svg className="w-6 h-6 text-[#409F01]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-white font-semibold mb-2">Get Verified</h3>
            <p className="text-gray-300 text-sm">Complete validation challenges to prove your understanding</p>
          </div>

          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-center group hover:bg-white/10 transition-all duration-300">
            <div className="w-12 h-12 bg-[#00A88E]/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-[#00A88E]/30 transition-colors">
              <svg className="w-6 h-6 text-[#00A88E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <h3 className="text-white font-semibold mb-2">Earn Rewards</h3>
            <p className="text-gray-300 text-sm">Receive TTF tokens directly to your wallet upon completion</p>
          </div>
        </div>

        {/* Floating particles effect */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-[#00A88E]/30 rounded-full animate-pulse-glow"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
