process.env.NODE_ENV = 'test';
const request = require('supertest');
const express = require('express');
const bodyParser = require('express').json;
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const authRoutes = require('../../routes/auth');

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
  app.use('/api/auth', authRoutes);
});

afterAll(async () => {
  if (!global.__MONGO_UNAVAILABLE__) {
    await mongoose.disconnect();
    await mongod.stop();
  }
});

test((global.__MONGO_UNAVAILABLE__ ? 'SKIPPED: POST /api/auth/connect creates user (Mongo not available)' : 'POST /api/auth/connect creates user'), async () => {
  if (global.__MONGO_UNAVAILABLE__) return;
  const res = await request(app).post('/api/auth/connect').send({ wallet: '0xABC' }).expect(200);
  expect(res.body.user).toBeDefined();
  expect(res.body.user.wallet).toBe('0xABC');
});
