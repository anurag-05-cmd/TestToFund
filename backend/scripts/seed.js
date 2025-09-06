const { sequelize } = require('../config/database');
const Video = require('../models/Video');
const User = require('../models/User');

async function seed() {
  await sequelize.sync({ force: true });
  await Video.create({ title: 'Intro to Skill-to-Earn', durationSec: 120, rewardAmount: 2000 });
  await User.create({ wallet: '0xDEMO' });
  console.log('Seeding complete');
  process.exit(0);
}

seed().catch(err => {
  console.error('Seed failed', err);
  process.exit(1);
});
