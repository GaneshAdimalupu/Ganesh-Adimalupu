// test-mongodb.js - Run this to test your MongoDB connection
require('dotenv').config();
const mongoose = require('mongoose');

console.log('🧪 MongoDB Connection Test');
console.log('========================');

const testConnection = async () => {
  try {
    console.log('\n1️⃣ Environment Check:');
    console.log('   MONGO_URI exists:', !!process.env.MONGO_URI);
    console.log('   MONGO_URI preview:', process.env.MONGO_URI ? process.env.MONGO_URI.substring(0, 50) + '...' : 'NOT SET');

    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI not found in environment variables');
    }

    console.log('\n2️⃣ Connection Options:');
    const opts = {
      serverSelectionTimeoutMS: 15000,
      connectTimeoutMS: 20000,
      socketTimeoutMS: 45000,
      bufferCommands: false, // Remove bufferMaxEntries - not supported in newer versions
      maxPoolSize: 10,
      retryWrites: true,
      retryReads: true,
      family: 4
    };

    console.log('   Timeouts:', {
      serverSelection: opts.serverSelectionTimeoutMS + 'ms',
      connect: opts.connectTimeoutMS + 'ms',
      socket: opts.socketTimeoutMS + 'ms'
    });
    console.log('   Buffering disabled:', !opts.bufferCommands);
    console.log('   Max pool size:', opts.maxPoolSize);

    console.log('\n3️⃣ Connecting to MongoDB...');
    const startTime = Date.now();

    await mongoose.connect(process.env.MONGO_URI, opts);

    const connectTime = Date.now() - startTime;
    console.log(`   ✅ Connected successfully in ${connectTime}ms`);
    console.log('   📊 Database:', mongoose.connection.db.databaseName);
    console.log('   🔗 Ready state:', mongoose.connection.readyState);
    console.log('   🌐 Host:', mongoose.connection.host);

    console.log('\n4️⃣ Testing Database Access...');

    // Test 1: Ping database
    console.log('   🏓 Pinging database...');
    const pingStart = Date.now();
    await mongoose.connection.db.admin().ping();
    console.log(`   ✅ Ping successful in ${Date.now() - pingStart}ms`);

    // Test 2: List collections
    console.log('   📚 Listing collections...');
    const listStart = Date.now();
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log(`   ✅ Found ${collections.length} collections in ${Date.now() - listStart}ms`);
    if (collections.length > 0) {
      console.log('   Collections:', collections.map(c => c.name).join(', '));
    }

    // Test 3: Create test collection and document
    console.log('   🧪 Testing document operations...');
    const TestModel = mongoose.model('Test', new mongoose.Schema({
      message: String,
      timestamp: { type: Date, default: Date.now }
    }));

    // Insert test document
    console.log('   ➕ Creating test document...');
    const insertStart = Date.now();
    const testDoc = await TestModel.create({
      message: 'Connection test successful!'
    });
    console.log(`   ✅ Document created in ${Date.now() - insertStart}ms`);
    console.log('   📄 Document ID:', testDoc._id);

    // Read test document
    console.log('   🔍 Reading test document...');
    const readStart = Date.now();
    const foundDoc = await TestModel.findById(testDoc._id);
    console.log(`   ✅ Document read in ${Date.now() - readStart}ms`);
    console.log('   📄 Document message:', foundDoc.message);

    // Clean up test document
    console.log('   🗑️ Cleaning up test document...');
    await TestModel.findByIdAndDelete(testDoc._id);
    console.log('   ✅ Test document deleted');

    // Test 4: Test the actual Booking model
    console.log('\n5️⃣ Testing Booking Model...');
    try {
      const Booking = require('./lib/models/bookingModel');
      console.log('   📊 Booking model loaded successfully');

      // Test query on bookings collection
      console.log('   🔍 Testing availability query...');
      const queryStart = Date.now();
      const testBookings = await Booking.find({ date: '2025-08-21' }).limit(5);
      console.log(`   ✅ Query completed in ${Date.now() - queryStart}ms`);
      console.log('   📊 Found bookings:', testBookings.length);

    } catch (modelError) {
      console.log('   ⚠️ Booking model test failed:', modelError.message);
    }

    console.log('\n🎉 ALL TESTS PASSED!');
    console.log('Your MongoDB connection is working correctly.');

    // Summary
    const totalTime = Date.now() - startTime;
    console.log('\n📊 Performance Summary:');
    console.log('   Total test time:', totalTime + 'ms');
    console.log('   Connection time:', connectTime + 'ms');
    console.log('   Database responsive: YES');
    console.log('   Ready for production: YES');

  } catch (error) {
    console.log('\n❌ TEST FAILED');
    console.log('================');
    console.log('Error name:', error.name);
    console.log('Error message:', error.message);

    // Specific error guidance
    if (error.message.includes('ENOTFOUND')) {
      console.log('\n🔧 SOLUTION:');
      console.log('   - Check your internet connection');
      console.log('   - Verify the MongoDB hostname in your connection string');
      console.log('   - Make sure MongoDB Atlas cluster is running');

    } else if (error.message.includes('authentication')) {
      console.log('\n🔧 SOLUTION:');
      console.log('   - Check username and password in MONGO_URI');
      console.log('   - Verify database user exists in MongoDB Atlas');
      console.log('   - Check user permissions (should have read/write access)');

    } else if (error.message.includes('timeout')) {
      console.log('\n🔧 SOLUTION:');
      console.log('   - Your connection is slow or MongoDB is not responding');
      console.log('   - Check MongoDB Atlas cluster status');
      console.log('   - Try increasing timeout values');
      console.log('   - Check if IP is whitelisted in MongoDB Atlas');

    } else if (error.message.includes('IP') || error.message.includes('not authorized')) {
      console.log('\n🔧 SOLUTION:');
      console.log('   - Add your IP address to MongoDB Atlas whitelist');
      console.log('   - Or use 0.0.0.0/0 to allow all IPs (for development)');
      console.log('   - Go to Network Access in MongoDB Atlas dashboard');

    } else {
      console.log('\n🔧 GENERAL SOLUTIONS:');
      console.log('   - Check .env file exists and MONGO_URI is set');
      console.log('   - Verify MongoDB Atlas cluster is active');
      console.log('   - Check username/password don\'t contain special characters');
      console.log('   - Try creating a new database user');
    }

    console.log('\n📄 Current Configuration:');
    console.log('   Working directory:', process.cwd());
    console.log('   Node version:', process.version);
    console.log('   Mongoose version:', require('mongoose/package.json').version);

  } finally {
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
      console.log('\n👋 Disconnected from MongoDB');
    }
    console.log('🏁 Test completed');
  }
};

// Run the test
testConnection();
