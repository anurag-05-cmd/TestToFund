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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function doSend(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setTxHash(null);
    setLogs([]);
    setLoading(true);
    try {
      const provider = await connectWallet();
      const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = web3Provider.getSigner();
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

      const tx = await token.transfer(to, ethers.utils.parseUnits(amount || '0', 18));
      const receipt = await tx.wait();
      setTxHash(receipt.transactionHash);
  setLogs((l: string[]) => [...l, `✅ Transfer confirmed: ${receipt.transactionHash}`]);

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
      <h1 className="text-2xl font-bold mb-4">Send TTF Tokens</h1>
      <form onSubmit={doSend} className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium">Recipient address</label>
          <input className="mt-1 block w-full rounded border p-2" value={to} onChange={(e) => setTo(e.target.value)} placeholder="0x..." />
        </div>
        <div>
          <label className="block text-sm font-medium">Amount (TTF)</label>
          <input className="mt-1 block w-full rounded border p-2" value={amount} onChange={(e) => setAmount(e.target.value)} />
        </div>
        <div>
          <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded">
            {loading ? 'Sending...' : 'Send tokens'}
          </button>
        </div>
        {error && <div className="text-red-600">{error}</div>}
      </form>

      {logs.length > 0 && (
        <div className="mb-4 p-3 bg-gray-50 border rounded text-sm font-mono whitespace-pre-line">
          {logs.map((ln, i) => (
            <div key={i}>{ln}</div>
          ))}
        </div>
      )}

      <SendTokensResult txHash={txHash} senderBefore={senderBefore} senderAfter={senderAfter} receiver={receiverBal} toAddress={to} />
    </div>
  );
}
