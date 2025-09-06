const { Sequelize } = require('sequelize');
const path = require('path');

const isTest = process.env.NODE_ENV === 'test';

let sequelize;

// Prefer DATABASE_URL (e.g. Supabase) when provided
const databaseUrl = process.env.DATABASE_URL || process.env.SUPABASE_DB_URL;
if (databaseUrl) {
  // Use Postgres via connection string
  sequelize = new Sequelize(databaseUrl, {
    dialect: 'postgres',
    protocol: 'postgres',
    logging: false,
    dialectOptions: (process.env.DB_SSL === 'true' || process.env.NODE_ENV === 'production') ? {
      ssl: {
        rejectUnauthorized: false,
      }
    } : {},
  });
} else {
  // Fallback to a local sqlite file (dev)
  const dbPath = isTest ? ':memory:' : (process.env.DB_PATH || path.join(__dirname, '..', 'database', 'dev.sqlite'));
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: dbPath,
    logging: false,
  });
}

module.exports = { sequelize };
