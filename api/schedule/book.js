// api/schedule/book.js - WITH EMAIL SUPPORT
import mongoose from 'mongoose';
//import nodemailer from 'nodemailer';
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

// Email service
async function sendConfirmationEmail(bookingDetails) {
  console.log('📧 Attempting to send confirmation email');

  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      throw new Error('Email credentials not configured');
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const { name, email, date, time, meetingType, timezone, bookingId } = bookingDetails;

    const formattedDate = new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const meetingTypeLabels = {
      'consultation': 'Free Consultation (30 min)',
      'project-discussion': 'Project Discussion (45 min)',
      'technical-review': 'Technical Review (60 min)',
      'follow-up': 'Follow-up Meeting (15 min)'
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

            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #00CDFE; margin-top: 0;">📅 Meeting Details</h3>
              <p style="margin: 8px 0;"><strong>Type:</strong> ${meetingLabel}</p>
              <p style="margin: 8px 0;"><strong>Date:</strong> ${formattedDate}</p>
              <p style="margin: 8px 0;"><strong>Time:</strong> ${time} (${timezone})</p>
              <p style="margin: 8px 0;"><strong>Booking ID:</strong> ${bookingId}</p>
            </div>

            <div style="margin: 30px 0;">
              <h3 style="color: #333;">📝 What's Next?</h3>
              <ul style="color: #666; line-height: 1.8;">
                <li>Add this meeting to your calendar</li>
                <li>Feel free to send any materials or questions beforehand</li>
                <li>Need to reschedule? Just reply to this email</li>
              </ul>
            </div>

            <p style="color: #666;">Looking forward to our meeting!</p>
            <p style="color: #333;"><strong>Best regards,<br>Ganesh Adimalupu</strong><br>Machine Learning Engineer & AI Solutions Developer</p>

            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; color: #999; font-size: 12px;">
              📧 ganeshadimalupu@disroot.org | 💼 linkedin.com/in/GaneshAdimalupu
            </div>
          </div>
        </div>
      `
    };

    // Email to you (admin notification)
    const adminMailOptions = {
      from: `"Booking System" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: `🔔 New Meeting Booked: ${name} - ${formattedDate}`,
      html: `
        <div style="font-family: monospace; background: #f8f9fa; padding: 20px;">
          <h2 style="color: #28a745;">📅 New Meeting Booking Alert</h2>
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Client:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Meeting Type:</strong> ${meetingLabel}</p>
            <p><strong>Date:</strong> ${formattedDate}</p>
            <p><strong>Time:</strong> ${time} (${timezone})</p>
            <p><strong>Booking ID:</strong> ${bookingId}</p>
            ${bookingDetails.message ? `<p><strong>Message:</strong> "${bookingDetails.message}"</p>` : ''}
          </div>
          <p style="color: #666; font-size: 12px;">Timestamp: ${new Date().toISOString()}</p>
        </div>
      `
    };

    // Send both emails
    const clientResult = await transporter.sendMail(clientMailOptions);
    const adminResult = await transporter.sendMail(adminMailOptions);

    console.log('✅ Emails sent successfully');
    return {
      client: { messageId: clientResult.messageId },
      admin: { messageId: adminResult.messageId }
    };

  } catch (error) {
    console.error('❌ Email sending failed:', error);
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
      received: req.method
    });
  }

  const startTime = Date.now();

  try {
    console.log('🎯 Processing booking request');

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
        received: Object.keys(req.body)
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: 'Invalid email format',
        received: email
      });
    }

    // Connect to database
    await connectDB();

    // Check for existing booking
    const existingBooking = await Booking.findOne({ date, time });
    if (existingBooking) {
      return res.status(409).json({
        error: 'Time slot unavailable',
        message: 'This time slot has been booked by another user. Please select a different time.',
        conflictingBooking: {
          id: existingBooking._id,
          date: existingBooking.date,
          time: existingBooking.time
        }
      });
    }

    // Save booking
    const bookingData = {
      ...req.body,
      status: 'confirmed',
      timestamp: new Date()
    };

    const booking = new Booking(bookingData);
    const savedBooking = await booking.save();

    console.log('✅ Booking saved successfully:', savedBooking._id);

    // Send confirmation email
    let emailResult = null;
    let emailError = null;

    try {
      emailResult = await sendConfirmationEmail({
        ...req.body,
        bookingId: savedBooking._id
      });
      console.log('✅ Confirmation emails sent');
    } catch (error) {
      console.error('⚠️ Email sending failed:', error.message);
      emailError = error.message;
      // Continue - don't fail booking for email issues
    }

    const processingTime = Date.now() - startTime;

    // Return success response
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
        timezone: savedBooking.timezone
      },
      services: {
        database: { status: 'success', message: 'Booking saved' },
        calendar: { status: 'disabled', message: 'Not configured' },
        email: emailResult
          ? { status: 'success', message: 'Confirmation emails sent' }
          : { status: 'failed', error: emailError }
      },
      processingTime: `${processingTime}ms`,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    const processingTime = Date.now() - startTime;
    console.error('❌ Booking failed:', error);

    return res.status(500).json({
      success: false,
      error: 'Booking failed',
      message: error.message,
      details: {
        processingTime: `${processingTime}ms`,
        timestamp: new Date().toISOString()
      }
    });
  }
}
