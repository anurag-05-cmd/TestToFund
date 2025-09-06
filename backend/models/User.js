const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  wallet: { type: String, required: true, unique: true },
  suspended: { type: Boolean, default: false },
  metadata: { type: mongoose.Schema.Types.Mixed, default: null },
}, { collection: 'users', timestamps: true });

module.exports = mongoose.models.User || mongoose.model('User', UserSchema);
