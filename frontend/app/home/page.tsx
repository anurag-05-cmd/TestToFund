"use client";
import Image from "next/image";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Clock, Coins, BookOpen, Zap, Users, CheckCircle, TrendingUp } from 'lucide-react';
import BackgroundVideo from '../../src/components/BackgroundVideo';

export default function HomePage() {
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await fetch('/api/videos');
        if (res.ok) {
          const data = await res.json();
          setVideos(data || []);
        }
      } catch (e) {
        // ignore
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <>
      <BackgroundVideo />
      <div className="relative z-10 min-h-screen w-full">
        {/* Hero Section */}
        <div className="relative overflow-hidden w-full">
          <div className="relative w-full px-4 sm:px-6 lg:px-8 pt-20 pb-32">
            <div className="text-center max-w-7xl mx-auto">
              <div className="flex justify-center mb-12">
                <div className="relative group">
                  <Image
                    src="/TestToFund Logo.svg"
                    alt="TestToFund Logo"
                    width={120}
                    height={120}
                    className="w-24 h-24 md:w-32 md:h-32 animate-float drop-shadow-2xl"
                  />
                  <div className="absolute inset-0 bg-[#00A88E]/30 rounded-full blur-2xl animate-pulse-glow"></div>
                </div>
              </div>
              
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-8 tracking-tight">
                Test. Trust.{' '}
                <span className="bg-gradient-to-r from-gray-100 to-gray-400 bg-clip-text text-transparent">
                  Fund.
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-4xl mx-auto leading-relaxed font-light">
                The future of education is here. Complete courses, validate your knowledge,
                and get rewarded with <span className="text-gray-200 font-medium">TTF tokens</span>.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
                <Link 
                  href="/rewards" 
                  className="group flex items-center justify-center gap-3 px-8 py-4 bg-white text-gray-900 font-semibold rounded-xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-105"
                >
                  <TrendingUp className="w-5 h-5" />
                  <span>Start Earning</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                
                <Link 
                  href="/send-tokens" 
                  className="group flex items-center justify-center gap-3 px-8 py-4 border border-gray-600 text-gray-200 font-semibold rounded-xl hover:border-gray-500 hover:bg-gray-800/50 transition-all duration-300 transform hover:scale-105"
                >
                  <Coins className="w-5 h-5" />
                  <span>Send Tokens</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="border-y border-gray-800 bg-gray-900/50 backdrop-blur-sm w-full">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center group">
                <div className="flex justify-center mb-4">
                  <BookOpen className="w-8 h-8 text-gray-400 group-hover:text-gray-300 transition-colors" />
                </div>
                <div className="text-4xl md:text-5xl font-bold text-white mb-3 group-hover:scale-105 transition-transform">
                  {videos.length}+
                </div>
                <div className="text-gray-300 text-lg font-medium">Available Courses</div>
                <div className="text-gray-500 text-sm mt-1">Ready to watch & learn</div>
              </div>
              <div className="text-center group">
                <div className="flex justify-center mb-4">
                  <TrendingUp className="w-8 h-8 text-gray-400 group-hover:text-gray-300 transition-colors" />
                </div>
                <div className="text-4xl md:text-5xl font-bold text-white mb-3 group-hover:scale-105 transition-transform">
                  ∞
                </div>
                <div className="text-gray-300 text-lg font-medium">Earning Potential</div>
                <div className="text-gray-500 text-sm mt-1">No limits on rewards</div>
              </div>
              <div className="text-center group">
                <div className="flex justify-center mb-4">
                  <Zap className="w-8 h-8 text-gray-400 group-hover:text-gray-300 transition-colors" />
                </div>
                <div className="text-4xl md:text-5xl font-bold text-white mb-3 group-hover:scale-105 transition-transform">
                  <Zap className="w-6 h-6 inline" />
                </div>
                <div className="text-gray-300 text-lg font-medium">Instant Rewards</div>
                <div className="text-gray-500 text-sm mt-1">Immediate token distribution</div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="w-full px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-7xl mx-auto">
            <section>
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
                  Available Courses
                </h2>
                <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed font-light">
                  Explore our curated educational content. Complete courses and earn
                  <span className="text-gray-200 font-medium"> TTF tokens</span> instantly.
                </p>
              </div>
              
              {loading && (
                <div className="flex justify-center items-center py-20">
                  <div className="relative">
                    <div className="animate-spin rounded-full h-12 w-12 border-2 border-gray-700"></div>
                    <div className="animate-spin rounded-full h-12 w-12 border-2 border-t-white absolute top-0"></div>
                  </div>
                  <span className="ml-4 text-gray-300 text-lg">Loading courses...</span>
                </div>
              )}
              
              {!loading && videos.length === 0 && (
                <div className="text-center py-20">
                  <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-12 max-w-2xl mx-auto border border-gray-800">
                    <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                      <BookOpen className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4">New Courses Coming Soon</h3>
                    <p className="text-gray-400 text-lg">We're preparing exciting educational content for you.</p>
                    <p className="text-gray-500 mt-2">Check back soon for new learning opportunities.</p>
                  </div>
                </div>
              )}
              
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {videos.map((v: any) => (
                  <div 
                    key={v._id || v.id} 
                    className="group bg-gray-900/50 backdrop-blur-sm border border-gray-800 hover:border-gray-700 rounded-xl p-6 transition-all duration-300 hover:bg-gray-900/70"
                  >
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex-1">
                        <h3 className="font-semibold text-white text-lg mb-4 group-hover:text-gray-200 transition-colors leading-tight">
                          {v.title}
                        </h3>
                        <div className="flex items-center gap-6 text-sm text-gray-500">
                          <span className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            {v.durationSec}s
                          </span>
                          <span className="flex items-center gap-2 text-gray-400 font-medium">
                            <Coins className="w-4 h-4" />
                            {v.rewardAmount} TTF
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <Link 
                      href={`/videos/${v._id || v.id}`} 
                      className="inline-flex items-center justify-center w-full px-4 py-3 bg-white text-gray-900 font-semibold rounded-lg hover:bg-gray-100 transition-all duration-300 group"
                    >
                      <span className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4" />
                        Start Learning
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </Link>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}