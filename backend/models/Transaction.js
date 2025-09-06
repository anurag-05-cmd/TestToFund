const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  txHash: { type: String, default: null },
  amount: { type: Number, required: true },
  status: { type: String, default: 'pending' },
  meta: { type: mongoose.Schema.Types.Mixed, default: null },
}, { collection: 'transactions', timestamps: true });

module.exports = mongoose.models.Transaction || mongoose.model('Transaction', TransactionSchema);
