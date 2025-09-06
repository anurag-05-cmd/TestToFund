process.env.NODE_ENV = 'test';
const request = require('supertest');
const express = require('express');
const bodyParser = require('express').json;
const authRoutes = require('../../routes/auth');
const { sequelize } = require('../../config/database');

let app;

beforeAll(async () => {
  app = express();
  app.use(bodyParser());
  app.use('/api/auth', authRoutes);
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

test('POST /api/auth/connect creates user', async () => {
  const res = await request(app).post('/api/auth/connect').send({ wallet: '0xABC' }).expect(200);
  expect(res.body.user).toBeDefined();
  expect(res.body.user.wallet).toBe('0xABC');
});
