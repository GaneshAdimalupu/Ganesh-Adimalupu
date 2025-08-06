// api/index.js - Production Ready (Refactored)
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Enhanced CORS configuration
const corsOptions = {
  origin:
    process.env.NODE_ENV === 'production'
      ? [
          'https://ganesh-adimalupu.vercel.app',
          'https://www.ganesh-adimalupu.vercel.app',
          'https://ganesh-portfolio.vercel.app',
        ]
      : ['http://localhost:3000', 'http://localhost:3001'],
  methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());

// Import services with new specific names
let createCalendarEvent, sendMeetingConfirmation;
try {
  const calendarService = require('../lib/services/googleCalendarService');
  const emailService = require('../lib/services/emailService');
  createCalendarEvent = calendarService.createCalendarEvent;
  // Use the specific function for meeting confirmation
  sendMeetingConfirmation = emailService.sendMeetingConfirmation;
} catch (error) {
  console.error('Failed to load core services:', error);
}

// Import contact routes
const contactRoutes = require('./routes/contactRoutes'); //

// Health check endpoint
app.get('/api/health', async (req, res) => {
  //
  let mongoStatus = 'Disconnected';
  let mongoDetails = {};

  try {
    if (mongoose.connection.readyState === 1) {
      //
      await mongoose.connection.db.admin().ping();
      mongoStatus = 'Connected';
      mongoDetails = {
        database: mongoose.connection.db.databaseName,
        readyState: mongoose.connection.readyState,
        host: mongoose.connection.host,
        port: mongoose.connection.port,
      };
    } else {
      mongoStatus = `State: ${mongoose.connection.readyState}`; //
    }
  } catch (error) {
    mongoStatus = `Error: ${error.message}`;
  }

  res.json({
    status: 'OK',
    message: 'Portfolio Server Running',
    features: ['MongoDB', 'Google Calendar', 'Email Notifications'],
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    mongodb: mongoStatus,
    mongoDetails,
  });
});

// CONTACT ROUTES
app.use('/api/contact', contactRoutes); //

// Schedule availability endpoint
app.get('/api/schedule/availability', async (req, res) => {
  //
  const { date } = req.query;

  if (!date) {
    return res.status(400).json({
      error: 'Date parameter required',
      example: '/api/schedule/availability?date=2025-08-21',
    });
  }

  try {
    if (mongoose.connection.readyState !== 1) {
      //
      return res.status(500).json({
        error: 'Database not connected',
        message: 'Please try again in a moment',
      });
    }

    const db = mongoose.connection.db;
    const collection = db.collection('bookings');

    const bookings = await collection
      .find(
        { date: date },
        {
          projection: { time: 1, name: 1, _id: 1 },
          maxTimeMS: 5000,
        }
      )
      .toArray();

    const unavailableSlots = bookings.map((booking) => booking.time);
    res.json(unavailableSlots);
  } catch (error) {
    res.json([]);
  }
});

// Schedule booking endpoint
app.post('/api/schedule/book', async (req, res) => {
  //
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
      return res.status(400).json({
        error: 'Missing required fields',
        missingFields,
        received: Object.keys(req.body),
      });
    }

    // Check MongoDB connection
    if (mongoose.connection.readyState !== 1) {
      //
      return res.status(500).json({
        error: 'Database not connected',
        message: 'Please try again in a moment',
      });
    }

    const db = mongoose.connection.db;
    const collection = db.collection('bookings');

    // Check for existing booking
    const existingBooking = await collection.findOne(
      //
      { date, time },
      { maxTimeMS: 5000 }
    );

    if (existingBooking) {
      return res.status(409).json({
        error: 'Time slot unavailable',
        message:
          'This time slot has been booked by another user. Please select a different time.',
      });
    }

    // Create Google Calendar event
    let calendarEventData = null;
    let calendarError = null;

    if (createCalendarEvent) {
      try {
        calendarEventData = await createCalendarEvent(req.body);
      } catch (error) {
        calendarError = error.message;
      }
    } else {
      calendarError = 'Service not loaded';
    }

    // Save to database
    const bookingData = {
      ...req.body,
      googleCalendarEventId: calendarEventData?.eventId || null,
      googleMeetLink: calendarEventData?.meetLink || null,
      googleCalendarLink: calendarEventData?.htmlLink || null,
      status: 'confirmed',
      timestamp: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const insertResult = await collection.insertOne(bookingData, {
      //
      maxTimeMS: 5000,
    });

    // Send confirmation email
    let emailError = null;

    // Use the renamed, specific function for meeting confirmations
    if (sendMeetingConfirmation) {
      try {
        await sendMeetingConfirmation({
          ...req.body,
          bookingId: insertResult.insertedId,
          calendarEventId: calendarEventData?.eventId || null, // Pass only the ID
        });
      } catch (error) {
        emailError = error.message;
      }
    } else {
      emailError = 'Service not loaded';
    }

    const processingTime = Date.now() - startTime;

    const response = {
      success: true,
      message: 'Meeting scheduled successfully!',
      booking: {
        id: insertResult.insertedId,
        name: bookingData.name,
        email: bookingData.email,
        date: bookingData.date,
        time: bookingData.time,
        meetingType: bookingData.meetingType,
        timezone: bookingData.timezone,
      },
      services: {
        database: { status: 'success', message: 'Booking saved' },
        calendar: calendarEventData
          ? {
              status: 'success',
              eventId: calendarEventData.eventId,
              meetLink: calendarEventData.meetLink,
            }
          : { status: 'failed', error: calendarError },
        email: !emailError
          ? { status: 'success', message: 'Confirmation sent' }
          : { status: 'failed', error: emailError },
      },
      processingTime: `${processingTime}ms`,
    };

    res.status(201).json(response);
  } catch (error) {
    const processingTime = Date.now() - startTime;

    res.status(500).json({
      success: false,
      error: 'Booking failed',
      message: error.message,
      details: {
        processingTime: `${processingTime}ms`,
        timestamp: new Date().toISOString(),
      },
    });
  }
});

// Admin endpoints
app.get('/api/schedule/bookings', async (req, res) => {
  //
  try {
    const { limit = 10, date } = req.query;
    const query = date ? { date } : {};

    if (mongoose.connection.readyState !== 1) {
      //
      return res.status(500).json({ error: 'Database not connected' });
    }

    const db = mongoose.connection.db;
    const collection = db.collection('bookings');

    const bookings = await collection
      .find(query, {
        maxTimeMS: 5000,
        sort: { createdAt: -1 },
        limit: parseInt(limit),
      })
      .toArray();

    res.json({
      count: bookings.length,
      bookings: bookings.map((booking) => ({
        id: booking._id,
        name: booking.name,
        email: booking.email,
        date: booking.date,
        time: booking.time,
        meetingType: booking.meetingType,
        status: booking.status,
        hasCalendarEvent: !!booking.googleCalendarEventId,
        hasMeetLink: !!booking.googleMeetLink,
        createdAt: booking.createdAt,
      })),
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: 'Failed to fetch bookings', message: error.message });
  }
});

app.delete('/api/schedule/booking/:id', async (req, res) => {
  //
  try {
    if (mongoose.connection.readyState !== 1) {
      //
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

    res.json({ message: 'Booking cancelled successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to cancel booking' });
  }
});

// 404 handler
app.use((req, res) => {
  //
  res.status(404).json({
    error: 'Route not found',
    method: req.method,
    url: req.url,
  });
});

// Global error handler
app.use((error, req, res, next) => {
  //
  res.status(500).json({
    error: 'Internal server error',
    message: error.message,
    timestamp: new Date().toISOString(),
  });
});

// Connect to MongoDB
const mongoOptions = {
  serverSelectionTimeoutMS: 10000,
  connectTimeoutMS: 15000,
  socketTimeoutMS: 30000,
  bufferCommands: false,
  maxPoolSize: 5,
  retryWrites: true,
};

mongoose
  .connect(process.env.MONGO_URI, mongoOptions)
  .then(() => {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  });

module.exports = app;
