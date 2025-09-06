"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { connectWallet } from '../../../src/lib/web3';

export default function VideoPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const [video, setVideo] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await fetch(`/api/videos/${id}`);
        if (res.ok) {
          const data = await res.json();
          setVideo(data);
        }
      } catch (e) {
        // ignore
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  async function simulateProgress() {
    setStatus(null);
    try {
      const provider: any = await connectWallet();
      const signer = provider.getSigner();
      const addr = await signer.getAddress();
      // create simplistic heartbeats simulating full watch
      const heartbeats = Array.from({ length: Math.max(5, Math.floor((video?.durationSec||60)/10)) }, (_, i) => ({ ts: i*1000, positionSec: Math.floor((i+1)*(video?.durationSec||60)/5) }));
      setStatus('Sending progress...');
      const res = await fetch(`/api/videos/${id}/progress`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ wallet: addr, heartbeats }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'server error');
      setStatus(`Progress reported. Reward: ${data.reward?.status || 'none'} ${data.reward?.txHash ? data.reward.txHash : ''}`);
    } catch (err: any) {
      setStatus(err?.message || String(err));
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="mb-4">
        <button onClick={() => history.back()} className="text-sm text-blue-600">← Back</button>
      </div>
      {loading && <div>Loading...</div>}
      {!loading && video && (
        <div>
          <h1 className="text-2xl font-semibold">{video.title}</h1>
          <div className="text-sm text-gray-600 mb-4">Duration: {video.durationSec}s • Reward: {video.rewardAmount} TTF</div>
          <div className="space-y-3">
            <div className="p-3 border rounded">
              <p className="text-sm text-gray-700">Simulate watching this video and report progress to claim reward (anti-cheat applies).</p>
            </div>
            <div className="flex gap-2">
              <button onClick={simulateProgress} className="px-4 py-2 bg-blue-600 text-white rounded">Simulate progress</button>
              <div className="text-sm text-gray-600">{status}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
