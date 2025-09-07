"use client";
import React, { useState } from 'react';
import { connectWallet } from '../../src/lib/web3';

export default function RewardsPage() {
  const [wallet, setWallet] = useState('');
  const [txs, setTxs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fillWallet() {
    try {
      const provider: any = await connectWallet();
      const signer = provider.getSigner();
      const addr = await signer.getAddress();
      setWallet(addr);
    } catch (err: any) {
      setError(err?.message || String(err));
    }
  }

  async function loadTxs() {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`/api/rewards/transactions/${wallet}`);
      if (!res.ok) throw new Error(`server returned ${res.status}`);
      const data = await res.json();
      setTxs(data || []);
    } catch (err: any) {
      setError(err?.message || String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4 text-gray-900">Reward Transactions</h1>
      <div className="flex gap-2 mb-4">
        <input className="flex-1 rounded border border-gray-300 focus:border-[#00A88E] focus:ring-2 focus:ring-[#00A88E]/20 p-2 outline-none transition-colors" value={wallet} onChange={(e) => setWallet(e.target.value)} placeholder="0x..." />
        <button onClick={fillWallet} className="px-3 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded transition-colors">Use wallet</button>
        <button onClick={loadTxs} disabled={!wallet || loading} className="px-3 py-2 bg-[#00A88E] hover:bg-[#00967D] disabled:bg-gray-400 text-white rounded transition-colors">{loading ? 'Loading...' : 'Load'}</button>
      </div>
      {error && <div className="text-red-600 bg-red-50 border border-red-200 rounded p-3 mb-4">{error}</div>}

      <div className="space-y-3">
        {txs.length === 0 && <div className="text-sm text-gray-600">No transactions</div>}
        {txs.map((t, i) => (
          <div key={i} className="p-3 border border-gray-200 rounded-lg bg-white hover:border-[#00A88E]/30 transition-colors">
            <div className="text-sm"><strong>Amount:</strong> <span className="text-[#00A88E] font-mono">{t.amount} TTF</span></div>
            <div className="text-sm"><strong>Status:</strong> <span className={t.status === 'completed' ? 'text-green-600' : t.status === 'pending' ? 'text-yellow-600' : 'text-red-600'}>{t.status}</span></div>
            {t.txHash && (
              <div className="text-sm">
                <strong>Tx:</strong>{' '}
                <a href={`https://primordial.bdagscan.com/tx/${t.txHash}`} target="_blank" rel="noreferrer" className="text-[#409F01] hover:text-[#367A01] underline break-all transition-colors">{t.txHash}</a>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
