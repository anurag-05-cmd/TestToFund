const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');

// GET /api/rewards/transactions/:wallet
router.get('/transactions/:wallet', async (req, res) => {
  const wallet = req.params.wallet;
  try {
    const txs = await Transaction.findAll({ where: { '$meta.wallet$': wallet }, limit: 50 });
    res.json(txs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'server_error' });
  }
});

module.exports = router;
