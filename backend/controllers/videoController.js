const User = require('../models/User');
const Video = require('../models/Video');
const Progress = require('../models/Progress');
const antiCheat = require('../services/antiCheatService');
const rewards = require('./rewardController');

// POST /api/videos/:id/progress
async function reportProgress(req, res) {
  const videoId = Number(req.params.id);
  const { wallet, heartbeats } = req.body;
  if (!wallet) return res.status(400).json({ error: 'wallet_required' });

  try {
    const user = await User.findOrCreate({ where: { wallet } }).then(r => r[0]);
    const video = await Video.findByPk(videoId);
    if (!video) return res.status(404).json({ error: 'video_not_found' });

    const result = antiCheat.validateProgress(heartbeats, video.durationSec);

    const progress = await Progress.create({
      userId: user.id,
      videoId: video.id,
      watchedSec: result.watchedSec || 0,
      watchedPct: result.watchedPct || 0,
      validated: !!result.valid,
      evidence: { heartbeats, reason: result.reason },
    });

    let rewardResult = null;
    if (result.valid) {
      // issue reward (async) and attach tx info
      rewardResult = await rewards.issueReward(user, video.rewardAmount, { reason: 'video_completion', videoId: video.id });
    }

    return res.json({ progress, reward: rewardResult });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'server_error' });
  }
}

module.exports = { reportProgress };
