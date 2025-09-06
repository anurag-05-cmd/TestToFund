const User = require('../models/User');

// Simple wallet connect endpoint: create or return user by wallet
async function connect(req, res, next) {
  try {
    const { wallet } = req.body;
    if (!wallet) return res.status(400).json({ error: 'wallet is required' });

    let user = await User.findOne({ where: { wallet } });
    if (!user) {
      user = await User.create({ wallet });
    }
    return res.json({ user });
  } catch (err) {
    next(err);
  }
}

module.exports = { connect };
