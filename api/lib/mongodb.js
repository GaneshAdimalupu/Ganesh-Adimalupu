// api/lib/mongodb.js - Enhanced with better error handling and debugging
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGO_URI;

console.log('🔍 MongoDB Configuration Check:');
console.log('   MONGO_URI exists:', !!MONGODB_URI);
console.log('   MONGO_URI length:', MONGODB_URI ? MONGODB_URI.length : 0);
console.log('   MONGO_URI preview:', MONGODB_URI ? MONGODB_URI.substring(0, 50) + '...' : 'NOT SET');

if (!MONGODB_URI) {
  console.error('❌ MONGO_URI environment variable is not defined');
  console.error('💡 Please check your .env file or environment variables');
  throw new Error('Please define the MONGO_URI environment variable');
}

// Global variable to cache the connection
let isConnected = false;

async function connectDB() {
  // If already connected and connection is healthy, return existing connection
  if (isConnected && mongoose.connection.readyState === 1) {
    console.log('✅ Using existing MongoDB connection');
    return mongoose.connection;
  }

  try {
    console.log('🔌 Attempting to connect to MongoDB...');

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
    console.log('📊 Connection options:', {
      serverSelectionTimeoutMS: opts.serverSelectionTimeoutMS,
      socketTimeoutMS: opts.socketTimeoutMS,
      maxPoolSize: opts.maxPoolSize,
      bufferCommands: opts.bufferCommands
    });

    // Attempt connection
    const connection = await mongoose.connect(MONGODB_URI, opts);

    isConnected = true;
    console.log('✅ MongoDB connected successfully');
    console.log('📊 Database name:', connection.connection.db.databaseName);
    console.log('🔗 Connection state:', mongoose.connection.readyState);
    console.log('🌐 Host:', connection.connection.host);
    console.log('📡 Port:', connection.connection.port);

    return connection.connection;
  } catch (error) {
    isConnected = false;
    console.error('❌ MongoDB connection failed:');
    console.error('   Error name:', error.name);
    console.error('   Error message:', error.message);

    // Provide specific error guidance
    if (error.message.includes('ENOTFOUND') || error.message.includes('getaddrinfo')) {
      console.error('🌐 DNS/Network Issue:');
      console.error('   - Check your internet connection');
      console.error('   - Verify the MongoDB server hostname');
      console.error('   - Check if you\'re behind a firewall');
    } else if (error.message.includes('authentication')) {
      console.error('🔐 Authentication Issue:');
      console.error('   - Check your username and password');
      console.error('   - Verify database user has correct permissions');
    } else if (error.message.includes('timeout')) {
      console.error('⏱️ Timeout Issue:');
      console.error('   - MongoDB server might be down');
      console.error('   - Network latency too high');
      console.error('   - Try increasing timeout values');
    } else if (error.message.includes('IP')) {
      console.error('🚫 IP Whitelist Issue:');
      console.error('   - Add your IP to MongoDB Atlas whitelist');
      console.error('   - Consider allowing all IPs (0.0.0.0/0) for development');
    }

    console.error('   Full error:', error);
    throw error;
  }
}

// Connection event handlers for better monitoring
mongoose.connection.on('connected', () => {
  console.log('🎉 Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ Mongoose connection error:', err.message);
  isConnected = false;
});

mongoose.connection.on('disconnected', () => {
  console.log('⚠️ Mongoose disconnected from MongoDB');
  isConnected = false;
});

// Graceful shutdown
process.on('SIGINT', async () => {
  try {
    await mongoose.connection.close();
    console.log('👋 MongoDB connection closed through app termination');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during MongoDB disconnection:', error);
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
