const { Sequelize } = require('sequelize');
const path = require('path');


const isTest = process.env.NODE_ENV === 'test';
const dbPath = isTest ? ':memory:' : (process.env.DB_PATH || path.join(__dirname, '..', 'database', 'dev.sqlite'));

const options = {
  dialect: 'sqlite',
  storage: dbPath,
  logging: false,
};

const sequelize = new Sequelize(options);

module.exports = { sequelize };
