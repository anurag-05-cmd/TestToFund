const express = require('express');
const router = express.Router();
const User = require('../models/User');
const rewards = require('../controllers/rewardController');

// POST /api/admin/issue-reward
// body: { wallet, amount }
router.post('/issue-reward', async (req, res) => {
  const adminToken = req.headers['x-admin-token'];
  if (!process.env.ADMIN_TOKEN || adminToken !== process.env.ADMIN_TOKEN) {
    return res.status(403).json({ error: 'forbidden' });
  }

  const { wallet, amount } = req.body;
  if (!wallet || !amount) return res.status(400).json({ error: 'wallet_and_amount_required' });

  try {
    // find or create user by wallet (upsert)
    const user = await User.findOneAndUpdate({ wallet }, { wallet }, { upsert: true, new: true, setDefaultsOnInsert: true });
    const result = await rewards.issueReward(user, amount, { reason: 'manual_issue', admin: true });
    res.json({ success: true, result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'server_error' });
  }
});

module.exports = router;
