process.env.NODE_ENV = 'test';
const request = require('supertest');
const express = require('express');
const bodyParser = require('express').json;
const videoRoutes = require('../../routes/videos');
const { sequelize } = require('../../config/database');
const Video = require('../../models/Video');

jest.mock('../../services/blockchainService', () => ({
  sendReward: jest.fn(async (to, amount) => ({ success: true, txHash: '0xMOCK_REWARD' }))
}));

let app;

beforeAll(async () => {
  app = express();
  app.use(bodyParser());
  app.use('/api/videos', videoRoutes);
  await sequelize.sync({ force: true });
  await Video.create({ title: 'Reward Video', durationSec: 100, rewardAmount: 50 });
});

afterAll(async () => {
  await sequelize.close();
});

test('reward flow creates transaction', async () => {
  const res = await request(app)
    .post('/api/videos/1/progress')
    .send({ wallet: '0xREWARD', heartbeats: Array.from({ length: 80 }, (_, i) => ({ ts: i * 1000, positionSec: i })) })
    .expect(200);

  expect(res.body.reward).toBeDefined();
  expect(res.body.reward.status).toBe('confirmed');
  expect(res.body.reward.txHash).toBe('0xMOCK_REWARD');
});
