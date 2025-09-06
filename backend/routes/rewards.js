const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');


// GET /api/rewards/transactions/:wallet
router.get('/transactions/:wallet', async (req, res) => {
  const wallet = req.params.wallet;
  try {
    // Mongo-only backend: query transactions by meta.wallet
    let txs = [];
    if (process.env.MONGO_URI) {
      txs = await Transaction.find({ 'meta.wallet': wallet }).limit(50).lean();
    } else {
      // If no Mongo configured, return empty list to avoid crashing (dev).
      txs = [];
    }
    res.json(txs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'server_error' });
  }
});

module.exports = router;
