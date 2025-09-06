const Transaction = require('../models/Transaction');
const blockchain = require('./blockchainService');

async function issueRewardForUser(user, amount, meta = {}) {
  // Create pending transaction
  const tx = await Transaction.create({ userId: user.id, amount, status: 'pending', meta });
  try {
    const res = await blockchain.sendReward(user.wallet, amount);
    if (res && res.success) {
      tx.txHash = res.txHash;
      tx.status = 'confirmed';
      await tx.save();
      return { txHash: res.txHash, status: 'confirmed' };
    } else {
      tx.status = 'failed';
      tx.meta = Object.assign(tx.meta || {}, { error: res && res.error });
      await tx.save();
      return { status: 'failed', error: res && res.error };
    }
  } catch (err) {
    tx.status = 'error';
    tx.meta = Object.assign(tx.meta || {}, { error: String(err) });
    await tx.save();
    return { status: 'error', error: String(err) };
  }
}

module.exports = { issueRewardForUser };
