// api/schedule/book.js - COMPLETE FIXED VERSION
import mongoose from 'mongoose';
import * as nodemailer from 'nodemailer';

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
    console.log('✅ MongoDB connected successfully');
    return mongoose.connection;
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    isConnected = false;
    throw error;
  }
}

// FIXED: Enhanced date formatting function
const formatDateForEmail = (dateString) => {
  try {
    console.log('🔍 Formatting date for email:', dateString);

    // Parse date string properly to avoid timezone issues
    const dateParts = dateString.split('-');
    if (dateParts.length === 3) {
      const year = parseInt(dateParts[0]);
      const month = parseInt(dateParts[1]) - 1; // Month is 0-indexed
      const day = parseInt(dateParts[2]);

      // Create date object in local timezone
      const dateObj = new Date(year, month, day);

      const formattedDate = dateObj.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: 'Asia/Kolkata',
      });

      console.log('✅ Date formatted successfully:', {
        originalDate: dateString,
        dateParts: { year, month: month + 1, day },
        createdDateObj: dateObj.toString(),
        formattedDate: formattedDate,
      });

      return formattedDate;
    } else {
      // Fallback
      const fallbackDate = new Date(dateString + 'T12:00:00');
      const formatted = fallbackDate.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: 'Asia/Kolkata',
      });

      console.log('⚠️ Using fallback date formatting:', {
        originalDate: dateString,
        fallbackDate: fallbackDate.toString(),
        formattedDate: formatted,
      });

      return formatted;
    }
  } catch (error) {
    console.error('❌ Date parsing error in email:', error);
    return dateString; // Fallback to original string
  }
};

// Enhanced email service
async function sendConfirmationEmail(bookingDetails) {
  console.log('📧 Starting email confirmation process...');

  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      throw new Error('Email credentials not configured');
    }

    const transporter = nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const { name, email, date, time, meetingType, timezone, bookingId } =
      bookingDetails;

    // FIXED: Use the enhanced date formatting
    const formattedDate = formatDateForEmail(date);

    const meetingTypeLabels = {
      consultation: 'Free Consultation (30 min)',
      'project-discussion': 'Project Discussion (45 min)',
      'technical-review': 'Technical Review (60 min)',
      'follow-up': 'Follow-up Meeting (15 min)',
    };

    const meetingLabel = meetingTypeLabels[meetingType] || meetingType;

    // Email to client
    const clientMailOptions = {
      from: `"Ganesh Adimalupu - ML Engineer" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `✅ Meeting Confirmed: ${meetingLabel} - ${formattedDate}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
          <div style="background: linear-gradient(135deg, #00CDFE 0%, #0099cc 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0;">🎉 Meeting Confirmed!</h1>
            <p style="margin: 10px 0 0 0;">Your booking has been successfully scheduled</p>
          </div>

          <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h2 style="color: #333;">Hello ${name},</h2>
            <p style="color: #666; line-height: 1.6;">Thank you for scheduling a meeting! Your booking has been confirmed.</p>

            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #00CDFE;">
              <h3 style="color: #00CDFE; margin-top: 0;">📅 Meeting Details</h3>
              <p style="margin: 8px 0;"><strong>Type:</strong> ${meetingLabel}</p>
              <p style="margin: 8px 0;"><strong>Date:</strong> <span style="background: #fff3cd; padding: 4px 8px; border-radius: 4px; font-weight: 600;">${formattedDate}</span></p>
              <p style="margin: 8px 0;"><strong>Time:</strong> ${time} (${timezone})</p>
              <p style="margin: 8px 0;"><strong>Duration:</strong> 30 minutes</p>
              <p style="margin: 8px 0;"><strong>Booking ID:</strong> ${bookingId}</p>
            </div>

            <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 20px 0; border: 1px solid #bbdefb;">
              <strong>🔍 Technical Verification:</strong><br>
              Original Date: <code>${date}</code><br>
              Processed Date: <strong>${formattedDate}</strong><br>
              Time Zone: ${timezone}<br>
              Processing Time: ${new Date().toISOString()}
            </div>

            <div style="margin: 30px 0;">
              <h3 style="color: #333;">📝 What's Next?</h3>
              <ul style="color: #666; line-height: 1.8;">
                <li><strong>Calendar:</strong> Add this meeting to your calendar</li>
                <li><strong>Preparation:</strong> Feel free to send any materials or questions beforehand</li>
                <li><strong>Platform:</strong> We'll use Google Meet (link will be provided)</li>
                <li><strong>Rescheduling:</strong> Need to change the time? Just reply to this email</li>
              </ul>
            </div>

            <div style="background: #fff3cd; padding: 15px; border-radius: 8px; text-align: center;">
              <strong>📞 Quick Summary:</strong><br>
              <strong>${formattedDate}</strong> at <strong>${time}</strong><br>
              Duration: 30 minutes | Type: ${meetingLabel}
            </div>

            <p style="color: #666; margin-top: 20px;">Looking forward to our meeting!</p>
            <p style="color: #333;"><strong>Best regards,<br>Ganesh Adimalupu</strong><br>
            <em>Machine Learning Engineer & AI Solutions Developer</em></p>

            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; color: #999; font-size: 12px;">
              📧 ganeshadimalupu@disroot.org | 💼 linkedin.com/in/GaneshAdimalupu<br>
              This is an automated confirmation | Booking ID: ${bookingId}
            </div>
          </div>
        </div>
      `,
    };

    // Email to admin
    const adminMailOptions = {
      from: `"Booking System" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: `📅 New Meeting Booked: ${name} - ${formattedDate}`,
      html: `
        <div style="font-family: monospace; background: #f8f9fa; padding: 20px;">
          <div style="max-width: 700px; margin: 0 auto; background: white; padding: 20px; border-radius: 10px;">
            <div style="background: #28a745; color: white; padding: 1rem; border-radius: 5px; margin-bottom: 2rem; text-align: center;">
              <h2>📅 New Meeting Booking Alert</h2>
            </div>
            
            <h3>👤 Client Information</h3>
            <table style="width: 100%; border-collapse: collapse; margin: 1rem 0;">
              <tr style="border-bottom: 1px solid #dee2e6;"><th style="padding: 0.8rem; text-align: left;">Client</th><td style="padding: 0.8rem;">${name}</td></tr>
              <tr style="border-bottom: 1px solid #dee2e6;"><th style="padding: 0.8rem; text-align: left;">Email</th><td style="padding: 0.8rem;"><a href="mailto:${email}">${email}</a></td></tr>
              <tr style="border-bottom: 1px solid #dee2e6;"><th style="padding: 0.8rem; text-align: left;">Phone</th><td style="padding: 0.8rem;">${
                bookingDetails.phone || 'Not provided'
              }</td></tr>
              <tr style="border-bottom: 1px solid #dee2e6;"><th style="padding: 0.8rem; text-align: left;">Company</th><td style="padding: 0.8rem;">${
                bookingDetails.company || 'Not provided'
              }</td></tr>
            </table>

            <h3>📅 Meeting Details</h3>
            <table style="width: 100%; border-collapse: collapse; margin: 1rem 0;">
              <tr style="border-bottom: 1px solid #dee2e6;"><th style="padding: 0.8rem; text-align: left;">Type</th><td style="padding: 0.8rem;">${meetingLabel}</td></tr>
              <tr style="border-bottom: 1px solid #dee2e6;"><th style="padding: 0.8rem; text-align: left;">Date</th><td style="padding: 0.8rem; background: #fff3cd;"><strong>${formattedDate}</strong></td></tr>
              <tr style="border-bottom: 1px solid #dee2e6;"><th style="padding: 0.8rem; text-align: left;">Time</th><td style="padding: 0.8rem;">${time} (${timezone})</td></tr>
              <tr style="border-bottom: 1px solid #dee2e6;"><th style="padding: 0.8rem; text-align: left;">Booking ID</th><td style="padding: 0.8rem;">${bookingId}</td></tr>
            </table>

            ${
              bookingDetails.message
                ? `
            <h3>💬 Client Message</h3>
            <div style="background: #f8f9fa; padding: 1rem; border-radius: 8px; border-left: 4px solid #00CDFE;">
              <p style="margin: 0; white-space: pre-wrap;">"${bookingDetails.message}"</p>
            </div>
            `
                : ''
            }

            <div style="background: #fff3cd; padding: 1rem; border-radius: 8px; margin: 1rem 0;">
              <h4>🔍 Debug Information</h4>
              <p><strong>Original Date:</strong> <code>${date}</code></p>
              <p><strong>Processed Date:</strong> <strong>${formattedDate}</strong></p>
              <p><strong>Timezone:</strong> ${timezone}</p>
              <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
            </div>

            <div style="text-align: center; margin-top: 2rem; padding-top: 1rem; border-top: 1px solid #dee2e6; color: #6c757d; font-size: 0.9rem;">
              Automated booking notification | ID: ${bookingId}
            </div>
          </div>
        </div>
      `,
    };

    // Send both emails
    console.log('📧 Sending client confirmation email...');
    const clientResult = await transporter.sendMail(clientMailOptions);

    console.log('📧 Sending admin notification email...');
    const adminResult = await transporter.sendMail(adminMailOptions);

    console.log('✅ Both emails sent successfully');
    return {
      client: { messageId: clientResult.messageId },
      admin: { messageId: adminResult.messageId },
    };
  } catch (error) {
    console.error('❌ Email sending failed:', error);
    throw error;
  }
}

// Booking Model Schema
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
    // FIXED: Enhanced date validation
    date: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          // Validate YYYY-MM-DD format
          const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
          if (!dateRegex.test(v)) return false;

          // Validate it's a real date
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

// Create unique index for date and time
bookingSchema.index({ date: 1, time: 1 }, { unique: true });

// Add debugging middleware
bookingSchema.pre('save', function (next) {
  console.log('💾 About to save booking:', {
    date: this.date,
    time: this.time,
    name: this.name,
    email: this.email,
  });
  next();
});

bookingSchema.post('save', function (doc, next) {
  console.log('✅ Booking saved to database:', {
    id: doc._id,
    date: doc.date,
    time: doc.time,
    createdAt: doc.createdAt,
  });
  next();
});

// Export model safely for serverless
const Booking =
  mongoose.models.Booking || mongoose.model('Booking', bookingSchema);

// MAIN SERVERLESS FUNCTION
export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Method not allowed',
      allowedMethods: ['POST'],
      received: req.method,
    });
  }

  const startTime = Date.now();
  console.log('🚀 Booking request started');

  try {
    // Validate required fields
    const { name, email, date, time, meetingType } = req.body;

    // 🔍 COMPREHENSIVE LOGGING
    console.log('🔍 BOOKING REQUEST DEBUG:', {
      rawBody: req.body,
      dateInfo: {
        value: date,
        type: typeof date,
        length: date?.length,
        format: /^\d{4}-\d{2}-\d{2}$/.test(date)
          ? 'Valid YYYY-MM-DD'
          : 'Invalid format',
      },
      timeInfo: {
        value: time,
        type: typeof time,
        format: /^\d{1,2}:\d{2} (AM|PM)$/.test(time)
          ? 'Valid HH:MM AM/PM'
          : 'Invalid format',
      },
    });

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

    // FIXED: Enhanced date validation
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      return res.status(400).json({
        error: 'Invalid date format',
        expected: 'YYYY-MM-DD',
        received: date,
      });
    }

    // Validate it's a real date
    const dateParts = date.split('-');
    const testDate = new Date(
      parseInt(dateParts[0]),
      parseInt(dateParts[1]) - 1,
      parseInt(dateParts[2])
    );

    if (isNaN(testDate.getTime())) {
      return res.status(400).json({
        error: 'Invalid date value',
        received: date,
      });
    }

    console.log('✅ Date validation passed:', {
      originalDate: date,
      parsedDate: testDate.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      isoString: testDate.toISOString(),
    });

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: 'Invalid email format',
        received: email,
      });
    }

    // Connect to database
    console.log('🔌 Connecting to MongoDB...');
    await connectDB();

    // Check for existing booking with the EXACT same date and time
    console.log('🔍 Checking for conflicts...');
    const existingBooking = await Booking.findOne({ date, time });

    if (existingBooking) {
      console.log('❌ Conflict found:', {
        requestedDate: date,
        requestedTime: time,
        existingBooking: {
          id: existingBooking._id,
          date: existingBooking.date,
          time: existingBooking.time,
          name: existingBooking.name,
          createdAt: existingBooking.createdAt,
        },
      });

      return res.status(409).json({
        error: 'Time slot unavailable',
        message:
          'This time slot has been booked by another user. Please select a different time.',
        conflictingBooking: {
          id: existingBooking._id,
          date: existingBooking.date,
          time: existingBooking.time,
        },
      });
    }

    // Prepare booking data
    const bookingData = {
      ...req.body,
      status: 'confirmed',
      timestamp: new Date(),
      timezone: req.body.timezone || 'UTC+05:30',
    };

    console.log('💾 Saving booking with data:', {
      name: bookingData.name,
      email: bookingData.email,
      date: bookingData.date,
      time: bookingData.time,
      meetingType: bookingData.meetingType,
      timezone: bookingData.timezone,
    });

    // Save booking to database
    const booking = new Booking(bookingData);
    const savedBooking = await booking.save();

    console.log('✅ Booking saved successfully:', {
      id: savedBooking._id,
      savedDate: savedBooking.date,
      savedTime: savedBooking.time,
      createdAt: savedBooking.createdAt,
    });

    // Send confirmation email with enhanced debug info
    let emailResult = null;
    let emailError = null;

    try {
      console.log('📧 Sending confirmation emails...');
      emailResult = await sendConfirmationEmail({
        ...bookingData,
        bookingId: savedBooking._id,
      });
      console.log('✅ Emails sent successfully');
    } catch (error) {
      console.error('❌ Email sending failed:', error.message);
      emailError = error.message;
      // Continue - don't fail booking for email issues
    }

    const processingTime = Date.now() - startTime;

    // Return comprehensive success response
    return res.status(201).json({
      success: true,
      message: 'Meeting scheduled successfully!',
      booking: {
        id: savedBooking._id,
        name: savedBooking.name,
        email: savedBooking.email,
        date: savedBooking.date,
        time: savedBooking.time,
        meetingType: savedBooking.meetingType,
        timezone: savedBooking.timezone,
        status: savedBooking.status,
        createdAt: savedBooking.createdAt,
      },
      debug: {
        originalDate: date,
        savedDate: savedBooking.date,
        dateValidation: {
          format: 'YYYY-MM-DD',
          isValid: true,
          parsedCorrectly: testDate.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }),
        },
        processingTime: `${processingTime}ms`,
        timestamp: new Date().toISOString(),
      },
      services: {
        database: {
          status: 'success',
          message: 'Booking saved successfully',
          documentId: savedBooking._id,
        },
        calendar: {
          status: 'disabled',
          message: 'Google Calendar integration not configured',
        },
        email: emailResult
          ? {
              status: 'success',
              message: 'Confirmation emails sent to both client and admin',
              clientMessageId: emailResult.client?.messageId,
              adminMessageId: emailResult.admin?.messageId,
            }
          : {
              status: 'failed',
              error: emailError,
              message: 'Email sending failed but booking was saved',
            },
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    const processingTime = Date.now() - startTime;
    console.error('❌ Booking process failed:', {
      error: error.message,
      stack: error.stack,
      processingTime: `${processingTime}ms`,
    });

    return res.status(500).json({
      success: false,
      error: 'Booking failed',
      message: error.message,
      details: {
        type: error.name || 'UnknownError',
        processingTime: `${processingTime}ms`,
        timestamp: new Date().toISOString(),
      },
    });
  }
}
