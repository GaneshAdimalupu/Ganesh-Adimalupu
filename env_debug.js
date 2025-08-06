// debug-env.js - Run this to check your environment variables
require('dotenv').config();

console.log('🔍 Environment Variables Debug Report');
console.log('=====================================');

// Check Node environment
console.log('\n📦 Node.js Information:');
console.log('   Node Version:', process.version);
console.log('   Platform:', process.platform);
console.log('   Architecture:', process.arch);
console.log('   Working Directory:', process.cwd());

// Check environment variables
console.log('\n🔧 Environment Variables:');

const requiredVars = [
  'MONGO_URI',
  'EMAIL_USER', 
  'EMAIL_PASS',
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET', 
  'GOOGLE_REFRESH_TOKEN',
  'CALENDAR_ID'
];

const envStatus = {};

requiredVars.forEach(varName => {
  const value = process.env[varName];
  const exists = !!value;
  const length = value ? value.length : 0;
  const preview = value ? value.substring(0, 20) + '...' : 'NOT SET';
  
  envStatus[varName] = { exists, length, preview };
  
  console.log(`   ${varName}:`);
  console.log(`     ✓ Exists: ${exists ? '✅' : '❌'}`);
  console.log(`     ✓ Length: ${length} characters`);
  console.log(`     ✓ Preview: ${preview}`);
  console.log('');
});

// Check .env file
console.log('\n📄 .env File Check:');
const fs = require('fs');
const path = require('path');

const envFiles = ['.env', 'api/.env', '../.env'];
let envFileFound = false;

for (const envFile of envFiles) {
  try {
    const envPath = path.resolve(envFile);
    if (fs.existsSync(envPath)) {
      console.log(`   ✅ Found: ${envPath}`);
      const stats = fs.statSync(envPath);
      console.log(`   📊 Size: ${stats.size} bytes`);
      console.log(`   📅 Modified: ${stats.mtime.toLocaleString()}`);
      envFileFound = true;
      
      // Read and analyze .env file (without exposing sensitive data)
      const envContent = fs.readFileSync(envPath, 'utf8');
      const lines = envContent.split('\n').filter(line => line.trim() && !line.startsWith('#'));
      console.log(`   📝 Variables defined: ${lines.length}`);
      
      const definedVars = lines.map(line => line.split('=')[0]);
      const missingVars = requiredVars.filter(varName => !definedVars.includes(varName));
      
      if (missingVars.length > 0) {
        console.log(`   ⚠️ Missing variables: ${missingVars.join(', ')}`);
      } else {
        console.log('   ✅ All required variables present in .env file');
      }
      break;
    }
  } catch (error) {
    console.log(`   ❌ Error checking ${envFile}: ${error.message}`);
  }
}

if (!envFileFound) {
  console.log('   ❌ No .env file found in expected locations');
  console.log('   💡 Create a .env file with your environment variables');
}

// MongoDB URI analysis
console.log('\n🗄️ MongoDB URI Analysis:');
const mongoUri = process.env.MONGO_URI;

if (mongoUri) {
  try {
    // Parse MongoDB URI (safely)
    const uriParts = mongoUri.match(/mongodb(?:\+srv)?:\/\/([^:]+):([^@]+)@([^\/]+)\/(.+)/);
    
    if (uriParts) {
      console.log('   ✅ URI format appears valid');
      console.log(`   🌐 Protocol: ${mongoUri.startsWith('mongodb+srv') ? 'MongoDB+SRV' : 'MongoDB'}`);
      console.log(`   👤 Username: ${uriParts[1]}`);
      console.log(`   🔒 Password: ${'*'.repeat(uriParts[2].length)} (${uriParts[2].length} chars)`);
      console.log(`   🖥️ Host: ${uriParts[3]}`);
      console.log(`   💾 Database: ${uriParts[4].split('?')[0]}`);
      
      // Check for common issues
      if (mongoUri.includes('<password>')) {
        console.log('   ⚠️ WARNING: URI contains placeholder <password>');
      }
      if (mongoUri.includes('<username>')) {
        console.log('   ⚠️ WARNING: URI contains placeholder <username>');
      }
      if (mongoUri.includes(' ')) {
        console.log('   ⚠️ WARNING: URI contains spaces (this could cause issues)');
      }
    } else {
      console.log('   ❌ URI format appears invalid');
      console.log('   💡 Expected format: mongodb://username:password@host/database');
      console.log('   💡 Or: mongodb+srv://username:password@cluster.mongodb.net/database');
    }
  } catch (error) {
    console.log('   ❌ Error parsing MongoDB URI:', error.message);
  }
} else {
  console.log('   ❌ MONGO_URI not set');
  console.log('   💡 Get your connection string from MongoDB Atlas dashboard');
}

// Test MongoDB connection
console.log('\n🔌 Testing MongoDB Connection:');

if (mongoUri) {
  (async () => {
    try {
      const mongoose = require('mongoose');
      
      console.log('   🔄 Attempting connection...');
      const startTime = Date.now();
      
      await mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 10000
      });
      
      const endTime = Date.now();
      console.log(`   ✅ Connection successful! (${endTime - startTime}ms)`);
      console.log(`   📊 Database: ${mongoose.connection.db.databaseName}`);
      console.log(`   🔗 Ready state: ${mongoose.connection.readyState}`);
      
      // Test a simple operation
      const collections = await mongoose.connection.db.listCollections().toArray();
      console.log(`   📚 Collections found: ${collections.length}`);
      
      await mongoose.disconnect();
      console.log('   👋 Disconnected successfully');
      
    } catch (error) {
      console.log('   ❌ Connection failed:', error.message);
      
      if (error.message.includes('ENOTFOUND')) {
        console.log('   💡 DNS resolution failed - check your internet connection');
      } else if (error.message.includes('authentication')) {
        console.log('   💡 Authentication failed - check username/password');
      } else if (error.message.includes('timeout')) {
        console.log('   💡 Connection timeout - check if MongoDB is accessible');
      }
    }
  })();
} else {
  console.log('   ⏭️ Skipping connection test (MONGO_URI not set)');
}

// Summary
console.log('\n📋 Summary:');
const validVars = Object.values(envStatus).filter(status => status.exists).length;
console.log(`   Variables configured: ${validVars}/${requiredVars.length}`);

if (validVars === requiredVars.length) {
  console.log('   🎉 All required environment variables are set!');
} else {
  const missingVars = requiredVars.filter(varName => !envStatus[varName].exists);
  console.log(`   ⚠️ Missing variables: ${missingVars.join(', ')}`);
}

console.log('\n🚀 Next Steps:');
if (!envFileFound) {
  console.log('   1. Create a .env file in your api directory');
  console.log('   2. Add all required environment variables');
}
if (!envStatus.MONGO_URI.exists) {
  console.log('   1. Set up MongoDB Atlas account');
  console.log('   2. Create a cluster and get connection string');
  console.log('   3. Add MONGO_URI to your .env file');
}
if (validVars < requiredVars.length) {
  console.log('   1. Follow the setup guide to get missing credentials');
  console.log('   2. Test each service individually');
}
console.log('   3. Restart your server after updating .env file');
console.log('   4. Check server logs for any remaining issues');

console.log('\n✅ Debug report complete!');
