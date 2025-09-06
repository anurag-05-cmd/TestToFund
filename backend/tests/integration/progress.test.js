process.env.NODE_ENV = 'test';
const request = require('supertest');
const express = require('express');
const bodyParser = require('express').json;

// Boot a minimal app instance using the server code but with an in-memory DB
const { sequelize } = require('../../config/database');
const Video = require('../../models/Video');
const User = require('../../models/User');
const Progress = require('../../models/Progress');

jest.mock('../../services/blockchainService', () => ({
  sendReward: jest.fn(async (to, amount) => ({ success: true, txHash: '0xMOCK' }))
}));

const videoRoutes = require('../../routes/videos');

let app;

beforeAll(async () => {
  app = express();
  app.use(bodyParser());
  app.use('/api/videos', videoRoutes);
  await sequelize.sync({ force: true });
  // seed a video
  await Video.create({ title: 'Test Video', durationSec: 100, rewardAmount: 100 });
});

afterAll(async () => {
  await sequelize.close();
});

test('POST /api/videos/:id/progress - valid heartbeats issues reward', async () => {
  const res = await request(app)
    .post('/api/videos/1/progress')
    .send({ wallet: '0xTEST', heartbeats: Array.from({ length: 80 }, (_, i) => ({ ts: i * 1000, positionSec: i })) })
    .expect(200);

  expect(res.body.progress).toBeDefined();
  expect(res.body.progress.validated).toBeTruthy();
  expect(res.body.reward).toBeDefined();
  expect(res.body.reward.status).toBe('confirmed');
});
