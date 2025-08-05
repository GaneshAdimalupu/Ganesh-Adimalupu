// api/index.js - VERCEL-READY ENHANCED SERVER
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Enhanced CORS configuration for Vercel
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
  const calendarService = require('./services/googleCalendarService');
  const emailService = require('./services/emailService');
  createCalendarEvent = calendarService.createCalendarEvent;
  sendConfirmationEmail = emailService.sendConfirmationEmail;
  console.log('✅ Enhanced services loaded');
} catch (error) {
  console.error('⚠️ Services loading failed:', error.message);
}

// Import booking model
const Booking = require('./models/bookingModel');

// Import contact routes
const contactRoutes = require('./routes/contactRoutes');


// Health check endpoint
app.get('/api/health', (req, res) => {
  console.log('❤️ Health check requested');
  res.json({
    status: 'OK',
    message: 'Enhanced Vercel server is running!',
    features: ['Database', 'Google Calendar', 'Email Notifications', 'Schedule Booking', 'Contact Form' ],
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    mongodb: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
  });
});

// Add this debug endpoint after the health check in api/index.js
app.get('/api/debug', (req, res) => {
  console.log('🔍 Debug endpoint hit');
  res.json({
    hasMongoUri: !!process.env.MONGO_URI,
    mongoUriLength: process.env.MONGO_URI ? process.env.MONGO_URI.length : 0,
    mongoUriPreview: process.env.MONGO_URI ? process.env.MONGO_URI.substring(0, 50) + '...' : null,
    nodeEnv: process.env.NODE_ENV,
    allEnvKeys: Object.keys(process.env).filter(key => key.includes('MONGO') || key.includes('GOOGLE') || key.includes('EMAIL')),
    timestamp: new Date().toISOString(),
    availableRoutes: [
      'GET /api/health',
      'GET /api/debug',
      'GET /api/schedule/availability',
      'POST /api/schedule/book',
      'GET /api/schedule/bookings',
      'DELETE /api/schedule/booking/:id',
      'POST /api/contact/submit',
      'GET /api/contact/messages',
      'PUT /api/contact/messages/:messageId',
      'DELETE /api/contact/messages/:messageId',
      'GET /api/contact/stats'
    ]
  });
});

// CONTACT ROUTES - Mount the contact routes
app.use('/api/contact', contactRoutes);

// Enhanced availability endpoint
app.get('/api/schedule/availability', async (req, res) => {
  console.log('\n📅 VERCEL AVAILABILITY REQUEST');
  const { date } = req.query;

  if (!date) {
    console.log('❌ Missing date parameter');
    return res.status(400).json({
      error: 'Date parameter required',
      example: '/api/schedule/availability?date=2025-07-30'
    });
  }

  try {
    console.log(`🔍 Checking availability for: ${date}`);
    const bookings = await Booking.find({ date });
    const unavailableSlots = bookings.map(booking => booking.time);

    console.log(`📊 Found ${bookings.length} existing bookings`);
    console.log('⏰ Unavailable slots:', unavailableSlots);

    res.json(unavailableSlots);
  } catch (error) {
    console.error('❌ Availability check failed:', error);
    res.status(500).json({
      error: 'Failed to check availability',
      message: error.message
    });
  }
});

// Enhanced booking route with all integrations
app.post('/api/schedule/book', async (req, res) => {
  console.log('\n🎯 VERCEL ENHANCED BOOKING REQUEST');
  console.log('📋 Request data keys:', Object.keys(req.body));

  const startTime = Date.now();

  try {
    // Step 1: Validate required fields
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

    // Step 2: Check for existing booking
    console.log('\n[STEP 1] 🔍 Checking for conflicts...');
    const existingBooking = await Booking.findOne({ date, time });

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

    // Step 3: Create Google Calendar event
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
        // Continue with booking - don't fail for calendar issues
      }
    } else {
      console.log('⚠️ Google Calendar service not available');
      calendarError = 'Service not loaded';
    }

    // Step 4: Save to database
    console.log('\n[STEP 3] 💾 Saving to database...');
    const bookingData = {
      ...req.body,
      googleCalendarEventId: calendarEventData?.eventId || null,
      googleMeetLink: calendarEventData?.meetLink || null,
      googleCalendarLink: calendarEventData?.htmlLink || null,
      status: 'confirmed',
      timestamp: new Date()
    };

    const booking = new Booking(bookingData);
    const savedBooking = await booking.save();

    console.log('✅ Booking saved with ID:', savedBooking._id);

    // Step 5: Send confirmation email
    console.log('\n[STEP 4] 📧 Sending confirmation email...');
    let emailError = null;

    if (sendConfirmationEmail) {
      try {
        await sendConfirmationEmail({
          ...req.body,
          bookingId: savedBooking._id,
          calendarEventId: calendarEventData
        });
        console.log('✅ Confirmation email sent successfully');
      } catch (error) {
        console.error('⚠️ Email sending failed:', error.message);
        emailError = error.message;
        // Continue - don't fail booking for email issues
      }
    } else {
      console.log('⚠️ Email service not available');
      emailError = 'Service not loaded';
    }

    // Step 6: Prepare response
    const processingTime = Date.now() - startTime;
    console.log(`\n🎉 VERCEL BOOKING COMPLETED in ${processingTime}ms`);

    const response = {
      success: true,
      message: 'Meeting scheduled successfully!',
      booking: {
        id: savedBooking._id,
        name: savedBooking.name,
        email: savedBooking.email,
        date: savedBooking.date,
        time: savedBooking.time,
        meetingType: savedBooking.meetingType,
        timezone: savedBooking.timezone
      },
      services: {
        database: { status: 'success', message: 'Booking saved' },
        calendar: calendarEventData
          ? { status: 'success', eventId: calendarEventData.eventId, meetLink: calendarEventData.meetLink }
          : { status: 'failed', error: calendarError },
        email: !emailError
          ? { status: 'success', message: 'Confirmation sent' }
          : { status: 'failed', error: emailError }
      },
      processingTime: `${processingTime}ms`,
      environment: 'vercel'
    };

    console.log('📤 Sending response with', Object.keys(response).length, 'fields');
    res.status(201).json(response);

  } catch (error) {
    const processingTime = Date.now() - startTime;
    console.error('\n🚨 VERCEL BOOKING FAILED');
    console.error('⏰ Processing time:', `${processingTime}ms`);
    console.error('💥 Error:', error.message);

    res.status(500).json({
      success: false,
      error: 'Booking failed',
      message: error.message,
      details: {
        processingTime: `${processingTime}ms`,
        timestamp: new Date().toISOString(),
        environment: 'vercel'
      }
    });
  }
});

// Admin endpoints
app.get('/api/schedule/bookings', async (req, res) => {
  try {
    const { limit = 10, date } = req.query;
    const query = date ? { date } : {};

    const bookings = await Booking.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .select('-__v');

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
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

app.delete('/api/schedule/booking/:id', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    booking.status = 'cancelled';
    await booking.save();

    console.log(`📅 Booking cancelled: ${booking._id}`);
    res.json({ message: 'Booking cancelled successfully' });
  } catch (error) {
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
      'DELETE /api/schedule/booking/:id',
      'POST /api/contact/submit',
      'GET /api/contact/messages',
      'PUT /api/contact/messages/:messageId',
      'DELETE /api/contact/messages/:messageId',
      'GET /api/contact/stats'
    ]
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('🚨 GLOBAL ERROR:', error);
  res.status(500).json({
    error: 'Internal server error',
    message: error.message,
    timestamp: new Date().toISOString()
  });
});

// Connect to MongoDB
console.log('🔌 Connecting to MongoDB...');
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    console.log('📊 Database:', mongoose.connection.name);
  })
  .catch(err => {
    console.error('❌ MongoDB error:', err);
  });

// For Vercel serverless functions
module.exports = app;

// For local development
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log('\n🚀 DEVELOPMENT SERVER STARTED');
    console.log(`📍 Server: http://localhost:${PORT}`);
    console.log(`🏥 Health: http://localhost:${PORT}/api/health`);
    console.log('✨ Features: Schedule Booking + Contact Form + Google Calendar + Email + Analytics');
    console.log('\n📋 Available Endpoints:');
    console.log('   SCHEDULE:');
    console.log('   GET  /api/schedule/availability?date=2025-08-05');
    console.log('   POST /api/schedule/book');
    console.log('   GET  /api/schedule/bookings');
    console.log('   DELETE /api/schedule/booking/:id');
    console.log('   CONTACT:');
    console.log('   POST /api/contact/submit');
    console.log('   GET  /api/contact/messages');
    console.log('   PUT  /api/contact/messages/:messageId');
    console.log('   DELETE /api/contact/messages/:messageId');
    console.log('   GET  /api/contact/stats');
  });
}
