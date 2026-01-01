
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
  const explorer = (explorerBase || 'https://Awakening.bdagscan.com/tx/') + txHash;
  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (e) {
      // ignore
    }
  };
  return (
    <div className="p-4 border border-[#00A88E]/20 rounded-md bg-[#00A88E]/5 shadow-sm flex flex-col gap-2">
      <div className="flex items-center gap-2 mb-2">
        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#00A88E]/20 text-[#00A88E]">
          <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><circle cx="10" cy="10" r="10" fill="#00A88E"/><path d="M6 10.5l3 3 5-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </span>
        <h3 className="text-lg font-semibold text-[#00A88E]">Transfer Confirmed</h3>
      </div>
      <div className="text-sm flex flex-col gap-1">
        <span className="flex items-center gap-2">
          <span className="font-medium">Tx:</span>
          <a href={explorer} target="_blank" rel="noreferrer" className="text-[#409F01] hover:text-[#367A01] underline break-all transition-colors">{txHash}</a>
          <button onClick={() => copy(txHash)} className="ml-2 text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded transition-colors">Copy</button>
        </span>
        {toAddress && (
          <span className="flex items-center gap-2"><span className="font-medium">To:</span> <span className="font-mono bg-gray-100 px-1 rounded text-xs">{toAddress}</span><button onClick={() => copy(toAddress)} className="ml-2 text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded transition-colors">Copy</button></span>
        )}
        {senderBefore && (
          <span><span className="font-medium">Sender balance before:</span> <span className="font-mono text-[#00A88E]">{senderBefore} TTF</span></span>
        )}
        {senderAfter && (
          <span><span className="font-medium">Sender balance after:</span> <span className="font-mono text-[#00A88E]">{senderAfter} TTF</span></span>
        )}
        {receiver && (
          <span><span className="font-medium">Receiver balance:</span> <span className="font-mono text-[#00A88E]">{receiver} TTF</span></span>
        )}
      </div>
    </div>
  );
}
