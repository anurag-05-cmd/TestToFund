"use client";
import Image from "next/image";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Home() {
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
    <div className="font-sans min-h-[70vh] p-8 sm:p-20">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Skill-to-Earn (TTF)</h1>
            <p className="text-sm text-gray-600">Watch videos, pass validation, and earn TTF tokens.</p>
          </div>
          <div className="flex gap-2">
            <Link href="/send-tokens" className="px-4 py-2 bg-blue-600 text-white rounded">Send TTF</Link>
            <Link href="/rewards" className="px-4 py-2 border rounded">My rewards</Link>
          </div>
        </div>

        <section>
          <h2 className="text-xl font-semibold mb-3">Videos</h2>
          {loading && <div className="text-sm text-gray-600">Loading...</div>}
          {!loading && videos.length === 0 && <div className="text-sm text-gray-600">No videos found.</div>}
          <div className="space-y-3">
            {videos.map((v: any) => (
              <div key={v._id || v.id} className="p-3 border rounded flex items-center justify-between">
                <div>
                  <div className="font-medium">{v.title}</div>
                  <div className="text-xs text-gray-600">Duration: {v.durationSec}s • Reward: {v.rewardAmount} TTF</div>
                </div>
                <div>
                  <Link href={`/videos/${v._id || v.id}`} className="px-3 py-1 bg-gray-100 rounded text-sm">View</Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
