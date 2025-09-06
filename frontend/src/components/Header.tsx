"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ethers } from 'ethers';
import { connectWallet, getProvider, TOKEN_ADDRESS, ERC20_ABI, formatUnits } from '../lib/web3';

export default function Header() {
  const [address, setAddress] = useState<string | null>(null);
  const [network, setNetwork] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function refresh() {
    try {
      const provider: any = await getProvider();
      if (!provider) return;
      if ((provider as any).getSigner) {
        try {
          const signer = provider.getSigner ? provider.getSigner() : undefined;
          const addr = signer ? await signer.getAddress() : null;
          if (addr) setAddress(addr);
          try {
            const net = await provider.getNetwork();
            setNetwork(net.name || String(net.chainId));
          } catch (e) {
            setNetwork(null);
          }
          if (addr) {
            const token = new ethers.Contract(TOKEN_ADDRESS, ERC20_ABI, provider);
            const bal = await token.balanceOf(addr);
            setBalance(formatUnits(bal, 18));
          }
        } catch (err) {
          // no signer available
        }
      }
    } catch (err) {
      // ignore
    }
  }

  async function handleConnect() {
    setLoading(true);
    try {
      const provider: any = await connectWallet();
      const signer = provider.getSigner ? provider.getSigner() : undefined;
      const addr = signer ? await signer.getAddress() : null;
      if (addr) setAddress(addr);
      try {
        const net = await provider.getNetwork();
        setNetwork(net.name || String(net.chainId));
      } catch (e) {
        setNetwork(null);
      }
      if (addr) {
        const token = new ethers.Contract(TOKEN_ADDRESS, ERC20_ABI, provider);
        const bal = await token.balanceOf(addr);
        setBalance(formatUnits(bal, 18));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
    // listen for wallet changes
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      const anyW = (window as any).ethereum;
      anyW.on && anyW.on('accountsChanged', () => refresh());
      anyW.on && anyW.on('chainChanged', () => refresh());
    }
  }, []);

  return (
    <header className="w-full border-b py-3 px-6 bg-white/80 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/" className="font-semibold text-lg">TTF</Link>
          <nav className="flex items-center gap-3 text-sm text-gray-700">
            <Link href="/send-tokens" className="hover:underline">Send</Link>
            <Link href="/rewards" className="hover:underline">Rewards</Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {network && <div className="text-xs text-gray-600 font-mono">{network}</div>}
          {address ? (
            <div className="flex items-center gap-3">
              <div className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">{address.slice(0,6)}...{address.slice(-4)}</div>
              {balance && <div className="text-sm text-gray-700">{balance} TTF</div>}
            </div>
          ) : (
            <button onClick={handleConnect} disabled={loading} className="px-3 py-2 bg-blue-600 text-white rounded text-sm">
              {loading ? 'Connecting...' : 'Connect Wallet'}
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
