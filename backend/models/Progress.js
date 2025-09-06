const mongoose = require('mongoose');

const ProgressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  videoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Video', required: true },
  watchedSec: { type: Number, default: 0 },
  watchedPct: { type: Number, default: 0 },
  validated: { type: Boolean, default: false },
  evidence: { type: mongoose.Schema.Types.Mixed, default: null },
}, { collection: 'progress', timestamps: true });

module.exports = mongoose.models.Progress || mongoose.model('Progress', ProgressSchema);
