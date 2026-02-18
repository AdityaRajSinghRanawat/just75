const mongoose = require('mongoose');

async function connectDB() {
  const uri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB_NAME;
  if (!uri) throw new Error('MONGODB_URI not set in environment');
  try {
    const opts = dbName ? { dbName } : undefined;
    await mongoose.connect(uri, opts);
    console.log('MongoDB connected', { db: mongoose.connection.name, readyState: mongoose.connection.readyState });
  } catch (err) {
    console.error('MongoDB connection error:', err && err.message ? err.message : err);
    throw err;
  }
}

module.exports = connectDB;
