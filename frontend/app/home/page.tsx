"use client";
import Image from "next/image";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Clock, Coins, BookOpen, Zap, Users, CheckCircle, TrendingUp, ExternalLink } from 'lucide-react';
import BackgroundVideo from '../../src/components/BackgroundVideo';
import Navbar from '../../src/components/Navbar';
import TestMate from '../../src/components/TestMate';

export default function HomePage() {
  const [loading, setLoading] = useState(false);

  const udemyCourses = [
    {
      id: 1,
      title: "Introduction to Software Testing or Software QA",
      url: "https://www.udemy.com/course/introduction-to-software-testing-or-software-qa/",
      category: "Software Testing",
      level: "Beginner",
      rewardAmount: 2000
    },
    {
      id: 2,
      title: "Software Testing Simple (Software Quality Assurance QA)",
      url: "https://www.udemy.com/course/software-testing-simple/",
      category: "Software Testing",
      level: "Beginner",
      rewardAmount: 2000
    },
    {
      id: 3,
      title: "Free Software Testing Tutorial",
      url: "https://www.udemy.com/course/software-testing-k/",
      category: "Software Testing",
      level: "Beginner",
      rewardAmount: 2000
    },
    {
      id: 4,
      title: "Python For Beginners",
      url: "https://www.udemy.com/course/python-for-every1/",
      category: "Python",
      level: "Beginner",
      rewardAmount: 2000
    },
    {
      id: 5,
      title: "Python for Absolute Beginners!",
      url: "https://www.udemy.com/course/free-python/",
      category: "Python",
      level: "Beginner",
      rewardAmount: 2000
    },
    {
      id: 6,
      title: "Python for Beginners [2025]: Zero to Hero",
      url: "https://www.udemy.com/course/python-for-beginners-zero-to-hero-e/",
      category: "Python",
      level: "Beginner",
      rewardAmount: 2000
    },
    {
      id: 7,
      title: "Introduction To Python Programming",
      url: "https://www.udemy.com/course/pythonforbeginnersintro/",
      category: "Python",
      level: "Beginner",
      rewardAmount: 2000
    },
    {
      id: 8,
      title: "Python from Beginner to Intermediate in 30 min.",
      url: "https://www.udemy.com/course/python-from-beginner-to-expert-starter-free/",
      category: "Python",
      level: "Intermediate",
      rewardAmount: 2000
    },
    {
      id: 9,
      title: "Getting started with Python for free",
      url: "https://www.udemy.com/course/python-3-essential-training/",
      category: "Python",
      level: "Beginner",
      rewardAmount: 2000
    },
    {
      id: 10,
      title: "Python For Beginners – Learn Python Completely From Scratch",
      url: "https://www.udemy.com/course/pythonbasics/",
      category: "Python",
      level: "Beginner",
      rewardAmount: 2000
    },
    {
      id: 11,
      title: "Free Software Testing Courses and Tutorials",
      url: "https://www.udemy.com/topic/software-testing/free/",
      category: "General",
      level: "All Levels",
      rewardAmount: 2000
    },
    {
      id: 12,
      title: "Top Free Python Courses & Tutorials Online",
      url: "https://www.udemy.com/topic/python/free/",
      category: "General",
      level: "All Levels",
      rewardAmount: 2000
    },
    {
      id: 13,
      title: "Software Testing Courses | Learn Online",
      url: "https://www.udemy.com/topic/software-testing/",
      category: "General",
      level: "All Levels",
      rewardAmount: 2000
    },
    {
      id: 14,
      title: "Python Category Listing",
      url: "https://www.udemy.com/topic/python/",
      category: "General",
      level: "All Levels",
      rewardAmount: 2000
    },
    {
      id: 15,
      title: "Getting started with Python for free (Featured)",
      url: "https://www.udemy.com/course/python-3-essential-training/",
      category: "Python",
      level: "Beginner",
      rewardAmount: 2000
    },
    {
      id: 16,
      title: "Introduction to Software Testing or Software QA (Featured)",
      url: "https://www.udemy.com/course/introduction-to-software-testing-or-software-qa/",
      category: "Software Testing",
      level: "Beginner",
      rewardAmount: 2000
    },
    {
      id: 17,
      title: "Udemy Free Resource Center",
      url: "https://www.udemy.com/courses/free/",
      category: "Bonus Resources",
      level: "All Levels",
      rewardAmount: 2000
    },
    {
      id: 18,
      title: "Free Essential Tech Skills Courses",
      url: "https://www.udemy.com/courses/essential-tech/free/",
      category: "Bonus Resources",
      level: "All Levels",
      rewardAmount: 2000
    },
    {
      id: 19,
      title: "Free Productivity & Professional Skills Courses",
      url: "https://www.udemy.com/courses/productivity-professional/free/",
      category: "Bonus Resources",
      level: "All Levels",
      rewardAmount: 2000
    },
    {
      id: 20,
      title: "Free Online Business Courses and Tutorials",
      url: "https://www.udemy.com/topic/online-business/free/",
      category: "Bonus Resources",
      level: "All Levels",
      rewardAmount: 2000
    }
  ];

  return (
    <>
      <Navbar />
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
                  href="/faucet" 
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
                  {udemyCourses.length}+
                </div>
                <div className="text-gray-300 text-lg font-medium">Available Courses</div>
                <div className="text-gray-500 text-sm mt-1">Free Udemy courses to learn & earn</div>
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
                  Featured Udemy Courses
                </h2>
                <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed font-light">
                  Access free Udemy courses and earn <span className="text-gray-200 font-medium">2000 TTF tokens</span> upon completion and verification on our portal.
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
              
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {udemyCourses.map((course: any) => (
                  <div 
                    key={course.id} 
                    className="group bg-gray-900/50 backdrop-blur-sm border border-gray-800 hover:border-gray-700 rounded-xl p-6 transition-all duration-300 hover:bg-gray-900/70"
                  >
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-3">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            course.level === 'Beginner' ? 'bg-green-900/50 text-green-300' :
                            course.level === 'Intermediate' ? 'bg-yellow-900/50 text-yellow-300' :
                            course.level === 'Advanced' ? 'bg-red-900/50 text-red-300' :
                            'bg-purple-900/50 text-purple-300'
                          }`}>
                            {course.level}
                          </span>
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-900/50 text-blue-300">
                            {course.category}
                          </span>
                        </div>
                        <h3 className="font-semibold text-white text-lg mb-4 group-hover:text-gray-200 transition-colors leading-tight">
                          {course.title}
                        </h3>
                        <div className="flex items-center gap-6 text-sm text-gray-500 mb-4">
                          <span className="flex items-center gap-2 text-gray-400 font-medium">
                            <Coins className="w-4 h-4" />
                            {course.rewardAmount} TTF
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => window.open(course.url, '_blank')}
                      className="inline-flex items-center justify-center w-full px-4 py-3 bg-white text-gray-900 font-semibold rounded-lg hover:bg-gray-100 transition-all duration-300 group"
                    >
                      <span className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4" />
                        Start Course
                        <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </button>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
      
      {/* TestMate Chatbot */}
      <TestMate apiKey="sLni4WmoTYtLho7u0bFW9PSCYcfIr0QcBhBi7Dyd" />
    </>
  );
}