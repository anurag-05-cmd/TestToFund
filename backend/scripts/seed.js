const Video = require('../models/Video');
const User = require('../models/User');
const mongoose = require('mongoose');
require('dotenv').config();


async function seed() {
  if (!process.env.MONGO_URI) {
    console.error('MONGO_URI not set. Seed requires MongoDB now.');
    process.exit(1);
  }

  try {
    console.log('Connecting to Mongo for seed...');
    await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 30000, connectTimeoutMS: 30000 });
    await Video.create({ title: 'Intro to Skill-to-Earn', durationSec: 120, rewardAmount: 2000 });
    await User.create({ wallet: '0xDEMO' });
    console.log('Seeding complete (mongo)');
    process.exit(0);
  } catch (err) {
    console.error('Seed failed (mongo):', err && err.message ? err.message : err);
    process.exit(1);
  }
}

seed().catch(err => {
  console.error('Seed failed', err);
  process.exit(1);
});
