"use client";
import React from 'react';

interface BackgroundVideoProps {
  className?: string;
  overlay?: boolean;
}

export default function BackgroundVideo({ className = "", overlay = true }: BackgroundVideoProps) {
  return (
    <div className={`fixed inset-0 w-full h-full z-0 ${className}`}>
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/bg-video.mp4" type="video/mp4" />
        {/* Fallback for browsers that don't support video */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"></div>
      </video>
      
      {overlay && (
        <>
          {/* Dark overlay for better text readability */}
          <div className="absolute inset-0 bg-black/50"></div>
          
          {/* Gradient overlay for enhanced visual depth */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900/30 via-transparent to-[#00A88E]/10"></div>
          
          {/* Subtle pattern overlay */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(0,168,142,0.1)_0%,_transparent_50%)]"></div>
          </div>
        </>
      )}
    </div>
  );
}
