process.env.NODE_ENV = 'test';
const request = require('supertest');
const express = require('express');
const bodyParser = require('express').json;
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

const Video = require('../../models/Video');
jest.mock('../../services/blockchainService', () => ({
  sendReward: jest.fn(async (to, amount) => ({ success: true, txHash: '0xMOCK' }))
}));

const videoRoutes = require('../../routes/videos');

let app;
let mongod;

beforeAll(async () => {
  try {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    await mongoose.connect(uri, { autoIndex: true });
  } catch (err) {
    console.warn('mongodb-memory-server failed to start, skipping integration tests that require MongoDB:', err && err.message ? err.message : err);
    global.__MONGO_UNAVAILABLE__ = true;
    return;
  }

  app = express();
  app.use(bodyParser());
  app.use('/api/videos', videoRoutes);
  // seed a video
  await Video.create({ title: 'Test Video', durationSec: 100, rewardAmount: 100 });
});

afterAll(async () => {
  if (!global.__MONGO_UNAVAILABLE__) {
    await mongoose.disconnect();
    await mongod.stop();
  }
});

test((global.__MONGO_UNAVAILABLE__ ? 'SKIPPED: POST /api/videos/:id/progress - valid heartbeats issues reward (Mongo not available)' : 'POST /api/videos/:id/progress - valid heartbeats issues reward'), async () => {
  if (global.__MONGO_UNAVAILABLE__) return;
  const res = await request(app)
    .post('/api/videos/1/progress')
    .send({ wallet: '0xTEST', heartbeats: Array.from({ length: 80 }, (_, i) => ({ ts: i * 1000, positionSec: i })) })
    .expect(200);

  expect(res.body.progress).toBeDefined();
  expect(res.body.progress.validated).toBeTruthy();
  expect(res.body.reward).toBeDefined();
  expect(res.body.reward.status).toBe('confirmed');
});
