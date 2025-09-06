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
      <h1 className="text-2xl font-bold mb-4">Reward Transactions</h1>
      <div className="flex gap-2 mb-4">
        <input className="flex-1 rounded border p-2" value={wallet} onChange={(e) => setWallet(e.target.value)} placeholder="0x..." />
        <button onClick={fillWallet} className="px-3 py-2 bg-gray-200 rounded">Use wallet</button>
        <button onClick={loadTxs} disabled={!wallet || loading} className="px-3 py-2 bg-blue-600 text-white rounded">{loading ? 'Loading...' : 'Load'}</button>
      </div>
      {error && <div className="text-red-600 mb-4">{error}</div>}

      <div className="space-y-3">
        {txs.length === 0 && <div className="text-sm text-gray-600">No transactions</div>}
        {txs.map((t, i) => (
          <div key={i} className="p-3 border rounded bg-white">
            <div className="text-sm"><strong>Amount:</strong> {t.amount}</div>
            <div className="text-sm"><strong>Status:</strong> {t.status}</div>
            {t.txHash && (
              <div className="text-sm">
                <strong>Tx:</strong>{' '}
                <a href={`https://primordial.bdagscan.com/tx/${t.txHash}`} target="_blank" rel="noreferrer" className="text-blue-600 underline break-all">{t.txHash}</a>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
