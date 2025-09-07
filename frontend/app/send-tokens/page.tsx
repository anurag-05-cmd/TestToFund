"use client";
import React, { useState } from 'react';
import { ethers } from 'ethers';
import SendTokensResult from '../../src/components/SendTokensResult';
import { TOKEN_ADDRESS, ERC20_ABI, connectWallet, getProvider, formatUnits } from '../../src/lib/web3';

declare global {
  interface Window {
    ethereum?: any;
  }
}

export default function SendTokensPage() {
  const [to, setTo] = useState('');
  const [amount, setAmount] = useState('2000');
  const [txHash, setTxHash] = useState<string | null>(null);
  const [senderBefore, setSenderBefore] = useState<string | undefined>();
  const [senderAfter, setSenderAfter] = useState<string | undefined>();
  const [receiverBal, setReceiverBal] = useState<string | undefined>();
  const [logs, setLogs] = useState<string[]>([]);
  const [networkName, setNetworkName] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [dryRun, setDryRun] = useState(true);
  const [encodedData, setEncodedData] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function doSend(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setTxHash(null);
    setLogs([]);
    setLoading(true);
    try {
      const provider = await connectWallet();
  // provider may be a Web3Provider when injected by wallet
  const signer = (provider as any).getSigner ? (provider as any).getSigner() : undefined;
      // try to read network name
      try {
        const net = await provider.getNetwork();
        setNetworkName(net.name || String(net.chainId));
      } catch (e) {
        setNetworkName(null);
      }
      const from = await signer.getAddress();
      const token = new ethers.Contract(TOKEN_ADDRESS, ERC20_ABI, signer);

    const beforeSender = await token.balanceOf(from);
    const beforeReceiver = await token.balanceOf(to);
    setSenderBefore(formatUnits(beforeSender, 18));
  setLogs((l: string[]) => [...l, `Sender balance before: ${formatUnits(beforeSender, 18)} TTF`]);

      // basic validation for recipient
      if (!ethers.utils.isAddress(to)) {
        throw new Error('Invalid recipient address');
      }

  setLogs((l: string[]) => [...l, `Sending ${amount || '0'} TTF to ${to}...`]);

      // Dry-run: just encode data and show it
      const decimals = 18;
      const parsed = ethers.utils.parseUnits(amount || '0', decimals);
      const iface = new ethers.utils.Interface(ERC20_ABI);
      const data = iface.encodeFunctionData('transfer', [to, parsed]);
      setEncodedData(data);

      if (dryRun) {
        setLogs((l: string[]) => [...l, `Dry-run encoded tx data prepared`]);
      } else {
        const tx = await token.transfer(to, parsed);
        const receipt = await tx.wait();
        setTxHash(receipt.transactionHash);
    setLogs((l: string[]) => [...l, `✅ Transfer confirmed: ${receipt.transactionHash}`]);
      }

      const afterSender = await token.balanceOf(from);
      const afterReceiver = await token.balanceOf(to);
      setSenderAfter(formatUnits(afterSender, 18));
      setReceiverBal(formatUnits(afterReceiver, 18));
  setLogs((l: string[]) => [...l, `Sender balance after: ${formatUnits(afterSender, 18)} TTF`]);
  setLogs((l: string[]) => [...l, `Receiver balance: ${formatUnits(afterReceiver, 18)} TTF`]);
    } catch (err: any) {
      setError(err?.message || String(err));
  setLogs((l: string[]) => [...l, `Error: ${err?.message || String(err)}`]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4 text-gray-900">Send TTF Tokens</h1>
  <form onSubmit={doSend} className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Recipient address</label>
          <input className="mt-1 block w-full rounded border border-gray-300 focus:border-[#00A88E] focus:ring-2 focus:ring-[#00A88E]/20 p-2 outline-none transition-colors" value={to} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTo(e.target.value)} placeholder="0x..." />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Amount (TTF)</label>
          <input className="mt-1 block w-full rounded border border-gray-300 focus:border-[#00A88E] focus:ring-2 focus:ring-[#00A88E]/20 p-2 outline-none transition-colors" value={amount} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAmount(e.target.value)} />
        </div>
        <div>
          <div className="flex items-center gap-4">
            <label className="inline-flex items-center">
              <input type="checkbox" checked={dryRun} onChange={(e) => setDryRun(e.target.checked)} className="mr-2 accent-[#00A88E]" />
              <span className="text-gray-700">Dry-run (simulate)</span>
            </label>
            <button type="submit" disabled={loading} className="px-4 py-2 bg-[#00A88E] hover:bg-[#00967D] disabled:bg-gray-400 text-white rounded transition-colors">
              {loading ? (dryRun ? 'Simulating...' : 'Sending...') : (dryRun ? 'Simulate' : 'Send tokens')}
            </button>
          </div>
        </div>
        {error && <div className="text-red-600 bg-red-50 border border-red-200 rounded p-3">{error}</div>}
      </form>

      {logs.length > 0 && (
        <div className="mb-4 p-3 bg-gray-50 border border-gray-200 rounded text-sm font-mono whitespace-pre-line">
          {logs.map((ln, i) => (
            <div key={i} className={ln.includes('✅') ? 'text-[#00A88E]' : ln.includes('Error') ? 'text-red-600' : 'text-gray-700'}>{ln}</div>
          ))}
        </div>
      )}

      {encodedData && (
        <div className="mb-4 p-3 bg-[#00A88E]/5 border border-[#00A88E]/20 rounded text-sm font-mono">
          <div className="font-medium text-[#00A88E]">Encoded transaction data (transfer)</div>
          <div className="break-all mt-2 text-gray-700">{encodedData}</div>
        </div>
      )}

      {networkName && (
        <div className="mb-4 text-sm text-gray-700">Connected network: <span className="font-mono text-[#00A88E]">{networkName}</span></div>
      )}

      <SendTokensResult txHash={txHash} senderBefore={senderBefore} senderAfter={senderAfter} receiver={receiverBal} toAddress={to} />
    </div>
  );
}
