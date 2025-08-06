// api/index.js - Using raw MongoDB operations to bypass buffering issues
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Enhanced CORS configuration
const corsOptions = {
  origin: process.env.NODE_ENV === 'production'
    ? [
        'https://ganesh-adimalupu.vercel.app',
        'https://www.ganesh-adimalupu.vercel.app',
        'https://ganesh-portfolio.vercel.app'
      ]
    : [
        'http://localhost:3000',
        'http://localhost:3001'
      ],
  methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  if (req.body && Object.keys(req.body).length > 0) {
    console.log('Body:', Object.keys(req.body));
  }
  next();
});

// Import enhanced services
let createCalendarEvent, sendConfirmationEmail;
try {
  const calendarService = require('../lib/services/googleCalendarService');
  const emailService = require('../lib/services/emailService');
  createCalendarEvent = calendarService.createCalendarEvent;
  sendConfirmationEmail = emailService.sendConfirmationEmail;
  console.log('✅ Enhanced services loaded');
} catch (error) {
  console.error('⚠️ Services loading failed:', error.message);
}

// Import contact routes
const contactRoutes = require('./routes/contactRoutes');

// Health check endpoint
app.get('/api/health', async (req, res) => {
  console.log('❤️ Health check requested');

  let mongoStatus = 'Disconnected';
  let mongoDetails = {};

  try {
    if (mongoose.connection.readyState === 1) {
      // Test with a ping using raw MongoDB
      await mongoose.connection.db.admin().ping();
      mongoStatus = 'Connected';
      mongoDetails = {
        database: mongoose.connection.db.databaseName,
        readyState: mongoose.connection.readyState,
        host: mongoose.connection.host,
        port: mongoose.connection.port
      };
    } else {
      mongoStatus = `State: ${mongoose.connection.readyState}`;
    }
  } catch (error) {
    mongoStatus = `Error: ${error.message}`;
  }

  res.json({
    status: 'OK',
    message: 'Server with RAW MongoDB operations (no buffering)!',
    features: ['Raw MongoDB', 'Google Calendar', 'Email Notifications', 'No Buffering'],
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    mongodb: mongoStatus,
    mongoDetails
  });
});

// Debug endpoint
app.get('/api/debug', async (req, res) => {
  console.log('🔍 Debug endpoint hit');

  let collectionInfo = 'Not connected';
  if (mongoose.connection.readyState === 1) {
    try {
      const collections = await mongoose.connection.db.listCollections().toArray();
      collectionInfo = `${collections.length} collections: ${collections.map(c => c.name).join(', ')}`;
    } catch (error) {
      collectionInfo = `Error: ${error.message}`;
    }
  }

  res.json({
    mongooseState: mongoose.connection.readyState,
    mongooseStateLabels: {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting'
    },
    currentState: {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting'
    }[mongoose.connection.readyState],
    database: mongoose.connection.readyState === 1 ? mongoose.connection.db.databaseName : 'Not connected',
    host: mongoose.connection.host,
    collections: collectionInfo,
    timestamp: new Date().toISOString()
  });
});

// CONTACT ROUTES
app.use('/api/contact', contactRoutes);

// RAW MONGODB availability endpoint (bypasses Mongoose completely)
app.get('/api/schedule/availability', async (req, res) => {
  console.log('\n📅 RAW MONGODB AVAILABILITY REQUEST');
  const { date } = req.query;

  if (!date) {
    console.log('❌ Missing date parameter');
    return res.status(400).json({
      error: 'Date parameter required',
      example: '/api/schedule/availability?date=2025-08-21'
    });
  }

  try {
    console.log(`🔍 Checking availability for: ${date} (using RAW MongoDB)`);

    // Check connection state
    if (mongoose.connection.readyState !== 1) {
      console.log('⚠️ MongoDB not connected');
      return res.status(500).json({
        error: 'Database not connected',
        message: 'Please try again in a moment'
      });
    }

    // Use RAW MongoDB operations (bypasses Mongoose buffering entirely)
    console.log('📊 Executing RAW MongoDB query...');
    const startTime = Date.now();

    const db = mongoose.connection.db;
    const collection = db.collection('bookings');

    // Raw MongoDB find operation with timeout
    const bookings = await collection.find(
      { date: date },
      {
        projection: { time: 1, name: 1, _id: 1 },
        maxTimeMS: 5000 // 5 second timeout on the query itself
      }
    ).toArray();

    const queryTime = Date.now() - startTime;
    const unavailableSlots = bookings.map(booking => booking.time);

    console.log(`📊 RAW MongoDB query completed in ${queryTime}ms`);
    console.log(`📊 Found ${bookings.length} existing bookings`);
    console.log('⏰ Unavailable slots:', unavailableSlots);

    res.json(unavailableSlots);

  } catch (error) {
    console.error('❌ RAW MongoDB availability check failed:', error.message);

    // Return empty array as fallback so UI still works
    console.log('🔄 Returning empty availability as fallback');
    res.json([]);
  }
});

// RAW MONGODB booking route
app.post('/api/schedule/book', async (req, res) => {
  console.log('\n🎯 RAW MONGODB BOOKING REQUEST');
  console.log('📋 Request data keys:', Object.keys(req.body));

  const startTime = Date.now();

  try {
    // Validate required fields
    const { name, email, date, time, meetingType } = req.body;
    const missingFields = [];

    if (!name) missingFields.push('name');
    if (!email) missingFields.push('email');
    if (!date) missingFields.push('date');
    if (!time) missingFields.push('time');
    if (!meetingType) missingFields.push('meetingType');

    if (missingFields.length > 0) {
      console.log('❌ Missing required fields:', missingFields);
      return res.status(400).json({
        error: 'Missing required fields',
        missingFields,
        received: Object.keys(req.body)
      });
    }

    console.log('✅ All required fields present');

    // Check MongoDB connection
    if (mongoose.connection.readyState !== 1) {
      console.log('⚠️ MongoDB not connected');
      return res.status(500).json({
        error: 'Database not connected',
        message: 'Please try again in a moment'
      });
    }

    const db = mongoose.connection.db;
    const collection = db.collection('bookings');

    // Check for existing booking using RAW MongoDB
    console.log('\n[STEP 1] 🔍 Checking for conflicts with RAW MongoDB...');
    const existingBooking = await collection.findOne(
      { date, time },
      { maxTimeMS: 5000 }
    );

    if (existingBooking) {
      console.log('❌ Time slot already booked');
      return res.status(409).json({
        error: 'Time slot unavailable',
        message: 'This time slot has been booked by another user. Please select a different time.',
        conflictingBooking: {
          id: existingBooking._id,
          name: existingBooking.name,
          date: existingBooking.date,
          time: existingBooking.time
        }
      });
    }

    console.log('✅ Time slot is available');

    // Create Google Calendar event
    console.log('\n[STEP 2] 📅 Creating Google Calendar event...');
    let calendarEventData = null;
    let calendarError = null;

    if (createCalendarEvent) {
      try {
        calendarEventData = await createCalendarEvent(req.body);
        console.log('✅ Google Calendar event created:', calendarEventData?.eventId);
      } catch (error) {
        console.error('⚠️ Google Calendar failed:', error.message);
        calendarError = error.message;
      }
    } else {
      console.log('⚠️ Google Calendar service not available');
      calendarError = 'Service not loaded';
    }

    // Save to database using RAW MongoDB
    console.log('\n[STEP 3] 💾 Saving to database with RAW MongoDB...');
    const bookingData = {
      ...req.body,
      googleCalendarEventId: calendarEventData?.eventId || null,
      googleMeetLink: calendarEventData?.meetLink || null,
      googleCalendarLink: calendarEventData?.htmlLink || null,
      status: 'confirmed',
      timestamp: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const insertResult = await collection.insertOne(bookingData, { maxTimeMS: 5000 });
    console.log('✅ RAW MongoDB booking saved with ID:', insertResult.insertedId);

    // Send confirmation email
    console.log('\n[STEP 4] 📧 Sending confirmation email...');
    let emailError = null;

    if (sendConfirmationEmail) {
      try {
        await sendConfirmationEmail({
          ...req.body,
          bookingId: insertResult.insertedId,
          calendarEventId: calendarEventData
        });
        console.log('✅ Confirmation email sent successfully');
      } catch (error) {
        console.error('⚠️ Email sending failed:', error.message);
        emailError = error.message;
      }
    } else {
      console.log('⚠️ Email service not available');
      emailError = 'Service not loaded';
    }

    const processingTime = Date.now() - startTime;
    console.log(`\n🎉 RAW MONGODB BOOKING COMPLETED in ${processingTime}ms`);

    const response = {
      success: true,
      message: 'Meeting scheduled successfully using RAW MongoDB!',
      booking: {
        id: insertResult.insertedId,
        name: bookingData.name,
        email: bookingData.email,
        date: bookingData.date,
        time: bookingData.time,
        meetingType: bookingData.meetingType,
        timezone: bookingData.timezone
      },
      services: {
        database: { status: 'success', message: 'Booking saved with RAW MongoDB' },
        calendar: calendarEventData
          ? { status: 'success', eventId: calendarEventData.eventId, meetLink: calendarEventData.meetLink }
          : { status: 'failed', error: calendarError },
        email: !emailError
          ? { status: 'success', message: 'Confirmation sent' }
          : { status: 'failed', error: emailError }
      },
      processingTime: `${processingTime}ms`
    };

    res.status(201).json(response);

  } catch (error) {
    const processingTime = Date.now() - startTime;
    console.error('\n🚨 RAW MONGODB BOOKING FAILED');
    console.error('⏰ Processing time:', `${processingTime}ms`);
    console.error('💥 Error:', error.message);

    res.status(500).json({
      success: false,
      error: 'Booking failed',
      message: error.message,
      details: {
        processingTime: `${processingTime}ms`,
        timestamp: new Date().toISOString()
      }
    });
  }
});

// Admin endpoints using RAW MongoDB
app.get('/api/schedule/bookings', async (req, res) => {
  try {
    const { limit = 10, date } = req.query;
    const query = date ? { date } : {};

    if (mongoose.connection.readyState !== 1) {
      return res.status(500).json({ error: 'Database not connected' });
    }

    const db = mongoose.connection.db;
    const collection = db.collection('bookings');

    const bookings = await collection.find(query, {
      maxTimeMS: 5000,
      sort: { createdAt: -1 },
      limit: parseInt(limit)
    }).toArray();

    res.json({
      count: bookings.length,
      bookings: bookings.map(booking => ({
        id: booking._id,
        name: booking.name,
        email: booking.email,
        date: booking.date,
        time: booking.time,
        meetingType: booking.meetingType,
        status: booking.status,
        hasCalendarEvent: !!booking.googleCalendarEventId,
        hasMeetLink: !!booking.googleMeetLink,
        createdAt: booking.createdAt
      }))
    });
  } catch (error) {
    console.error('❌ Failed to fetch bookings:', error.message);
    res.status(500).json({ error: 'Failed to fetch bookings', message: error.message });
  }
});

app.delete('/api/schedule/booking/:id', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(500).json({ error: 'Database not connected' });
    }

    const db = mongoose.connection.db;
    const collection = db.collection('bookings');
    const { ObjectId } = require('mongodb');

    const result = await collection.updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: { status: 'cancelled', updatedAt: new Date() } },
      { maxTimeMS: 5000 }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    console.log(`📅 Booking cancelled: ${req.params.id}`);
    res.json({ message: 'Booking cancelled successfully' });
  } catch (error) {
    console.error('❌ Failed to cancel booking:', error.message);
    res.status(500).json({ error: 'Failed to cancel booking' });
  }
});

// 404 handler
app.use((req, res) => {
  console.log('❓ 404 - Route not found:', req.method, req.url);
  res.status(404).json({
    error: "Route not found",
    method: req.method,
    url: req.url,
    availableRoutes: [
      'GET /api/health',
      'GET /api/debug',
      'GET /api/schedule/availability?date=YYYY-MM-DD',
      'POST /api/schedule/book',
      'GET /api/schedule/bookings',
      'DELETE /api/schedule/booking/:id'
    ]
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('🚨 GLOBAL ERROR:', error.message);
  res.status(500).json({
    error: 'Internal server error',
    message: error.message,
    timestamp: new Date().toISOString()
  });
});

// Connect to MongoDB with the WORKING configuration
console.log('🔌 Connecting to MongoDB (for RAW operations only)...');
const mongoOptions = {
  serverSelectionTimeoutMS: 10000,
  connectTimeoutMS: 15000,
  socketTimeoutMS: 30000,
  bufferCommands: false,
  maxPoolSize: 5,
  retryWrites: true
};

mongoose.connect(process.env.MONGO_URI, mongoOptions)
  .then(async () => {
    console.log('✅ MongoDB connected successfully for RAW operations');
    console.log('📊 Database:', mongoose.connection.db.databaseName);
    console.log('🔗 Host:', mongoose.connection.host);

    // Test raw operations immediately
    console.log('🧪 Testing RAW MongoDB operations...');
    try {
      const db = mongoose.connection.db;
      await db.admin().ping();
      console.log('✅ RAW MongoDB ping successful');

      const collections = await db.listCollections().toArray();
      console.log('📚 Available collections:', collections.map(c => c.name));

      // Test bookings collection specifically
      const bookingsCollection = db.collection('bookings');
      const testQuery = await bookingsCollection.countDocuments({}, { maxTimeMS: 5000 });
      console.log('📊 Bookings collection test successful, documents:', testQuery);

    } catch (testError) {
      console.error('❌ RAW MongoDB test failed:', testError.message);
    }

    // Start server
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log('\n🚀 RAW MONGODB SERVER STARTED');
      console.log(`📍 Server: http://localhost:${PORT}`);
      console.log(`🏥 Health: http://localhost:${PORT}/api/health`);
      console.log(`🔍 Debug: http://localhost:${PORT}/api/debug`);
      console.log('✨ Using RAW MongoDB operations - NO Mongoose buffering!');
      console.log('\n📋 Test Commands:');
      console.log(`   curl http://localhost:${PORT}/api/health`);
      console.log(`   curl "http://localhost:${PORT}/api/schedule/availability?date=2025-08-21"`);
    });
  })
  .catch(error => {
    console.error('❌ MongoDB connection failed:', error.message);
    console.error('💡 Please check your connection string and try again');
    process.exit(1);
  });

// Connection event handlers
mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB connection error:', err.message);
});

mongoose.connection.on('disconnected', () => {
  console.log('⚠️ MongoDB disconnected');
});

mongoose.connection.on('reconnected', () => {
  console.log('🔄 MongoDB reconnected');
});

module.exports = app;
