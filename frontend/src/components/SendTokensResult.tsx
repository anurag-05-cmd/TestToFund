
import React from 'react';

type Props = {
  txHash?: string | null;
  senderBefore?: string;
  senderAfter?: string;
  receiver?: string;
  toAddress?: string;
  explorerBase?: string;
};

export default function SendTokensResult({ txHash, senderBefore, senderAfter, receiver, toAddress, explorerBase }: Props) {
  if (!txHash) return null;
  const explorer = (explorerBase || 'https://primordial.bdagscan.com/tx/') + txHash;
  return (
    <div className="p-4 border rounded-md bg-green-50 shadow-sm flex flex-col gap-2">
      <div className="flex items-center gap-2 mb-2">
        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-green-200 text-green-700">
          <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><circle cx="10" cy="10" r="10" fill="#4ade80"/><path d="M6 10.5l3 3 5-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </span>
        <h3 className="text-lg font-semibold text-green-700">Transfer Confirmed</h3>
      </div>
      <div className="text-sm flex flex-col gap-1">
        <span>
          <span className="font-medium">Tx:</span> <a href={explorer} target="_blank" rel="noreferrer" className="text-blue-600 underline break-all">{txHash}</a>
        </span>
        {toAddress && (
          <span><span className="font-medium">To:</span> <span className="font-mono bg-gray-100 px-1 rounded text-xs">{toAddress}</span></span>
        )}
        {senderBefore && (
          <span><span className="font-medium">Sender balance before:</span> <span className="font-mono">{senderBefore} TTF</span></span>
        )}
        {senderAfter && (
          <span><span className="font-medium">Sender balance after:</span> <span className="font-mono">{senderAfter} TTF</span></span>
        )}
        {receiver && (
          <span><span className="font-medium">Receiver balance:</span> <span className="font-mono">{receiver} TTF</span></span>
        )}
      </div>
    </div>
  );
}
