const mongoose = require('mongoose');

async function connectMongo() {
  const mongoUrl = process.env.MONGO_URI;
  if (!mongoUrl) {
    console.warn('MONGO_URI not set, skipping Mongo connection');
    return null;
  }
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(mongoUrl, {
      autoIndex: true,
      // Increase server selection timeout to allow slower networks
      serverSelectionTimeoutMS: 30000,
      connectTimeoutMS: 30000,
    });
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('Failed to connect to MongoDB:', err && err.message ? err.message : err);
    throw err;
  }
  return mongoose.connection;
}

module.exports = { connectMongo };
