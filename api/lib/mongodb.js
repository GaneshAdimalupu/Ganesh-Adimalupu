// api/lib/mongodb.js - Enhanced with better error handling and debugging
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGO_URI;

if (!MONGODB_URI) {

  throw new Error('Please define the MONGO_URI environment variable');
}

// Global variable to cache the connection
let isConnected = false;

async function connectDB() {
  // If already connected and connection is healthy, return existing connection
  if (isConnected && mongoose.connection.readyState === 1) {

    return mongoose.connection;
  }

  try {

    // Enhanced connection options for better reliability
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000,
      family: 4, // Use IPv4, skip trying IPv6
      heartbeatFrequencyMS: 10000, // Check connection every 10s
      maxIdleTimeMS: 30000, // Close connections after 30s of inactivity
      retryWrites: true,
      retryReads: true
    };

    // Log connection attempt

    // Attempt connection
    const connection = await mongoose.connect(MONGODB_URI, opts);

    isConnected = true;

    return connection.connection;
  } catch (error) {
    isConnected = false;

    // Provide specific error guidance
    if (error.message.includes('ENOTFOUND') || error.message.includes('getaddrinfo')) {

    } else if (error.message.includes('authentication')) {

    } else if (error.message.includes('timeout')) {

    } else if (error.message.includes('IP')) {

    }

    throw error;
  }
}

// Connection event handlers for better monitoring
mongoose.connection.on('connected', () => {

});

mongoose.connection.on('error', (err) => {

  isConnected = false;
});

mongoose.connection.on('disconnected', () => {

  isConnected = false;
});

// Graceful shutdown
process.on('SIGINT', async () => {
  try {
    await mongoose.connection.close();

    process.exit(0);
  } catch (error) {

    process.exit(1);
  }
});

// Health check function
const checkConnection = async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      // Ping the database
      await mongoose.connection.db.admin().ping();
      return { healthy: true, state: 'connected' };
    } else {
      return { healthy: false, state: 'disconnected' };
    }
  } catch (error) {
    return { healthy: false, state: 'error', error: error.message };
  }
};

module.exports = { connectDB, checkConnection };
