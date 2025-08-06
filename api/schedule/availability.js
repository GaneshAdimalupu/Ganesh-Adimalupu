// api/schedule/availability.js - WORKING VERSION
import mongoose from 'mongoose';

// MongoDB connection
const MONGODB_URI = process.env.MONGO_URI;
let isConnected = false;

async function connectDB() {
  if (isConnected && mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  try {
    if (!MONGODB_URI) {
      throw new Error('MONGO_URI environment variable is not defined');
    }

    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };

    await mongoose.connect(MONGODB_URI, opts);
    isConnected = true;

    return mongoose.connection;
  } catch (error) {

    isConnected = false;
    throw error;
  }
}

// Booking Model Schema
const bookingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  company: { type: String },
  message: { type: String },
  meetingType: {
    type: String,
    required: true,
    enum: ['consultation', 'project-discussion', 'technical-review', 'follow-up']
  },
  date: { type: String, required: true },
  time: { type: String, required: true },
  timezone: { type: String, required: true, default: 'UTC+05:30' },
  status: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'confirmed' }
}, {
  timestamps: true
});

bookingSchema.index({ date: 1, time: 1 }, { unique: true });

// Export model safely for serverless
const Booking = mongoose.models.Booking || mongoose.model('Booking', bookingSchema);

// MAIN SERVERLESS FUNCTION
export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({
      error: 'Method not allowed',
      allowedMethods: ['GET'],
      received: req.method
    });
  }

  // Extract date from query parameters
  const { date } = req.query;

  if (!date) {
    return res.status(400).json({
      error: 'Date parameter required',
      example: '/api/schedule/availability?date=2025-07-31',
      received: req.query
    });
  }

  // Validate date format
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(date)) {
    return res.status(400).json({
      error: 'Invalid date format',
      expected: 'YYYY-MM-DD',
      received: date
    });
  }

  try {

    // Connect to MongoDB
    await connectDB();

    // Query bookings for the specified date
    const bookings = await Booking.find({ date }).lean();
    const unavailableSlots = bookings.map(booking => booking.time);

    // Return the unavailable slots array
    return res.status(200).json(unavailableSlots);

  } catch (error) {

    return res.status(500).json({
      error: 'Failed to check availability',
      message: error.message,
      timestamp: new Date().toISOString(),
      requestedDate: date
    });
  }
}
