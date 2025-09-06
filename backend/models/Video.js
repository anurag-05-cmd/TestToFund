const mongoose = require('mongoose');

const VideoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  durationSec: { type: Number, default: 0 },
  rewardAmount: { type: Number, default: 2000 },
  metadata: { type: mongoose.Schema.Types.Mixed, default: null },
}, { collection: 'videos', timestamps: true });

module.exports = mongoose.models.Video || mongoose.model('Video', VideoSchema);
