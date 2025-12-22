"use client";
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { connectWallet, restoreWalletConnection } from '../src/lib/web3Onboard';

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
      window.location.href = '/home';
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div 
      ref={containerRef}
      className="min-h-screen relative overflow-hidden"
    >
      {/* Background Video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source src="/bg-video.mp4" type="video/mp4" />
        <source src="/bg-video.webm" type="video/webm" />
      </video>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-slate-900/60 z-10"></div>

      {/* Background Text with Torch Reveal Effect */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
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
            className="object-contain opacity-70"
            priority
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-30 min-h-screen flex flex-col items-center justify-center px-6 py-12">
        {/* Logo */}
        <div className="mb-8 transform hover:scale-105 transition-transform duration-300">
          <Image
            src="/TestToFund Logo.svg"
            alt="TestToFund Logo"
            width={80}
            height={80}
            className="drop-shadow-lg"
          />
        </div>

        {/* Welcome Card */}
        <div className="bg-slate-800/40 backdrop-blur-md border border-slate-700/50 rounded-3xl p-10 max-w-2xl w-full text-center shadow-2xl">
          <h1 className="text-5xl font-light text-white mb-5 tracking-tight">
            Welcome to <span className="font-medium text-[#00A88E]">TestToFund</span>
          </h1>
          <p className="text-xl text-slate-300 mb-10 leading-relaxed font-light">
            Complete Courses, Get Verified and Earn TTF
          </p>
          
          {/* Action Button */}
          <div className="flex justify-center">
            <Link 
              href="/home"
              className="px-8 py-4 bg-[#00A88E] hover:bg-[#00967D] text-white font-medium rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Get Started
            </Link>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="mt-12 mb-8 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full">
          <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 text-center group hover:bg-slate-800/50 hover:shadow-xl transition-all duration-300">
            <div className="w-12 h-12 bg-[#00A88E]/20 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-[#00A88E]/30 transition-colors">
              <svg className="w-6 h-6 text-[#00A88E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-white font-medium text-base mb-2">Learn & Earn</h3>
            <p className="text-slate-400 text-xs leading-relaxed">Watch educational content and earn TTF tokens for your engagement and completion</p>
          </div>

          <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 text-center group hover:bg-slate-800/50 hover:shadow-xl transition-all duration-300">
            <div className="w-12 h-12 bg-[#00A88E]/20 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-[#00A88E]/30 transition-colors">
              <svg className="w-6 h-6 text-[#00A88E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-white font-medium text-base mb-2">Get Verified</h3>
            <p className="text-slate-400 text-xs leading-relaxed">Complete validation challenges to prove your understanding and unlock rewards</p>
          </div>

          <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 text-center group hover:bg-slate-800/50 hover:shadow-xl transition-all duration-300">
            <div className="w-12 h-12 bg-[#00A88E]/20 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-[#00A88E]/30 transition-colors">
              <svg className="w-6 h-6 text-[#00A88E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <h3 className="text-white font-medium text-base mb-2">Earn Rewards</h3>
            <p className="text-slate-400 text-xs leading-relaxed">Receive TTF tokens directly to your wallet upon successful completion</p>
          </div>
        </div>
      </div>
    </div>
  );
}
