// Minimal blockchain service stub. Replace with real web3 provider (ethers/web3)

async function sendReward(to, amount) {
  // TODO: implement real on-chain transfer using signer/provider
  // For now return a fake tx hash to exercise flows.
  return {
    success: true,
    txHash: `0xFAKE_TX_${Date.now()}`,
  };
}

module.exports = { sendReward };
