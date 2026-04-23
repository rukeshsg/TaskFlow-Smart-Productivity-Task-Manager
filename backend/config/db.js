const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    mongoose.connection.on('connected',    () => console.log('✅ MongoDB Connected'));
    mongoose.connection.on('error',        (err) => console.error('❌ MongoDB Error:', err.message));
    mongoose.connection.on('disconnected', () => console.warn('⚠️  MongoDB Disconnected'));

    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
  } catch (error) {
    console.error(`❌ MongoDB Connection Failed: ${error.message}`);
    console.error('👉 Please check your MONGO_URI in .env and ensure your IP is whitelisted in Atlas.');
    process.exit(1);
  }
};

module.exports = connectDB;
