// api/schedule/availability.js - COMPLETE FIXED VERSION
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
    console.log('✅ MongoDB connected for availability check');
    return mongoose.connection;
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    isConnected = false;
    throw error;
  }
}

// Booking Model Schema (same as in book.js)
const bookingSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    company: { type: String },
    message: { type: String },
    meetingType: {
      type: String,
      required: true,
      enum: [
        'consultation',
        'project-discussion',
        'technical-review',
        'follow-up',
      ],
    },
    date: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
          if (!dateRegex.test(v)) return false;

          const dateParts = v.split('-');
          const testDate = new Date(
            parseInt(dateParts[0]),
            parseInt(dateParts[1]) - 1,
            parseInt(dateParts[2])
          );
          return !isNaN(testDate.getTime());
        },
        message: 'Date must be in YYYY-MM-DD format and be a valid date',
      },
    },
    time: { type: String, required: true, match: /^\d{1,2}:\d{2} (AM|PM)$/ },
    timezone: { type: String, required: true, default: 'UTC+05:30' },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled'],
      default: 'confirmed',
    },
  },
  {
    timestamps: true,
  }
);

bookingSchema.index({ date: 1, time: 1 }, { unique: true });

// Export model safely for serverless
const Booking =
  mongoose.models.Booking || mongoose.model('Booking', bookingSchema);

// Helper function to validate date format
const validateDateFormat = (dateString) => {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(dateString)) {
    return {
      isValid: false,
      error: 'Invalid date format. Expected YYYY-MM-DD',
    };
  }

  // Check if it's a real date
  const dateParts = dateString.split('-');
  const testDate = new Date(
    parseInt(dateParts[0]),
    parseInt(dateParts[1]) - 1,
    parseInt(dateParts[2])
  );

  if (isNaN(testDate.getTime())) {
    return { isValid: false, error: 'Invalid date value' };
  }

  return {
    isValid: true,
    dateObject: testDate,
    formattedDate: testDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
  };
};

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
      received: req.method,
      message:
        'This endpoint only accepts GET requests for checking availability',
    });
  }

  const startTime = Date.now();

  // Extract and validate date from query parameters
  const { date } = req.query;

  console.log('🔍 Availability check request:', {
    requestedDate: date,
    query: req.query,
    method: req.method,
    timestamp: new Date().toISOString(),
  });

  if (!date) {
    return res.status(400).json({
      error: 'Date parameter required',
      message: 'Please provide a date parameter in YYYY-MM-DD format',
      example: '/api/schedule/availability?date=2025-08-22',
      received: req.query,
    });
  }

  // FIXED: Enhanced date validation
  const dateValidation = validateDateFormat(date);
  if (!dateValidation.isValid) {
    return res.status(400).json({
      error: 'Invalid date format',
      message: dateValidation.error,
      expected: 'YYYY-MM-DD (e.g., 2025-08-22)',
      received: date,
      examples: ['2025-08-22', '2025-12-31', '2025-01-01'],
    });
  }

  try {
    console.log('✅ Date validation passed:', {
      requestedDate: date,
      formattedDate: dateValidation.formattedDate,
      dateObject: dateValidation.dateObject.toString(),
    });

    // Connect to MongoDB
    console.log('🔌 Connecting to MongoDB for availability check...');
    await connectDB();

    // Query bookings for the EXACT date string
    console.log('🔍 Searching for bookings on date:', date);
    const bookings = await Booking.find({
      date: date, // Exact string match
      status: { $ne: 'cancelled' }, // Exclude cancelled bookings
    })
      .select('time name email createdAt') // Only select needed fields
      .lean(); // Use lean() for better performance

    const unavailableSlots = bookings.map((booking) => booking.time);

    const processingTime = Date.now() - startTime;

    console.log('📊 Availability check result:', {
      requestedDate: date,
      formattedDate: dateValidation.formattedDate,
      foundBookings: bookings.length,
      unavailableSlots: unavailableSlots,
      processingTime: `${processingTime}ms`,
      bookingDetails: bookings.map((b) => ({
        time: b.time,
        name: b.name,
        email: b.email?.substring(0, 5) + '***', // Partial email for privacy
        createdAt: b.createdAt,
      })),
    });

    // Return the unavailable slots array
    return res.status(200).json({
      success: true,
      date: date,
      formattedDate: dateValidation.formattedDate,
      unavailableSlots: unavailableSlots,
      totalBookings: bookings.length,
      availableSlots: [
        '09:00 AM',
        '10:00 AM',
        '11:00 AM',
        '12:00 PM',
        '02:00 PM',
        '03:00 PM',
        '04:00 PM',
        '05:00 PM',
      ].filter((slot) => !unavailableSlots.includes(slot)),
      metadata: {
        processingTime: `${processingTime}ms`,
        timestamp: new Date().toISOString(),
        timezone: 'UTC+05:30',
      },
    });
  } catch (error) {
    const processingTime = Date.now() - startTime;
    console.error('❌ Availability check error:', {
      error: error.message,
      stack: error.stack,
      requestedDate: date,
      processingTime: `${processingTime}ms`,
    });

    return res.status(500).json({
      success: false,
      error: 'Failed to check availability',
      message: error.message,
      details: {
        requestedDate: date,
        processingTime: `${processingTime}ms`,
        timestamp: new Date().toISOString(),
        errorType: error.name || 'UnknownError',
      },
      // Return empty array as fallback so frontend doesn't break
      unavailableSlots: [],
    });
  }
}
