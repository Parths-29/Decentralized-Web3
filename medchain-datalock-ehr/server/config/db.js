const mongoose = require('mongoose');

const connectDB = async () => {
  let uri = process.env.MONGODB_URI;

  if (!uri || uri.includes('<db_password>')) {
    console.warn('\n⚠️  MongoDB password placeholder "<db_password>" detected or URI is missing.');
    console.warn('⚠️  Please set your actual database password in "server/.env".');
    console.warn('⚠️  Falling back to local MongoDB "mongodb://127.0.0.1:27017/medchain" for testing...\n');
    uri = 'mongodb://127.0.0.1:27017/medchain';
  }

  try {
    // Set a fast connection timeout so we do not hang on offline environments
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000
    });
    console.log(`\n✅ MongoDB Connected successfully to host: ${conn.connection.host}`);
    console.log(`📂 Database Name: ${conn.connection.name}\n`);
    process.env.USE_MOCK_DB = 'false';
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`);
    console.warn('\n⚠️  Neither Cloud Atlas nor Local MongoDB is reachable.');
    console.warn('⚡ ACTIVATING: High-Fidelity DataLock In-Memory Simulator Mode');
    console.warn('💡 You can fully test logins, registry, prescriptions, and cryptographic scans in-memory!\n');
    process.env.USE_MOCK_DB = 'true';
  }
};

module.exports = connectDB;
