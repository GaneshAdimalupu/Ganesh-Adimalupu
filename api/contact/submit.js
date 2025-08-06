// api/contact/submit.js - ENHANCED CONTACT FORM ENDPOINT
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

    return mongoose.connection;
  } catch (error) {

    isConnected = false;
    throw error;
  }
}

// Contact Message Model Schema
const contactMessageSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 100 },
  email: { type: String, required: true, trim: true, lowercase: true },
  subject: { type: String, trim: true, maxlength: 200, default: 'General Inquiry' },
  message: { type: String, required: true, trim: true, maxlength: 2000 },
  phone: { type: String, trim: true, maxlength: 20 },
  company: { type: String, trim: true, maxlength: 100 },
  messageType: {
    type: String,
    enum: ['general', 'project', 'collaboration', 'support', 'other'],
    default: 'general'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['new', 'read', 'replied', 'archived'],
    default: 'new'
  },
  ipAddress: { type: String, default: null },
  userAgent: { type: String, default: null },
  source: {
    type: String,
    enum: ['website', 'linkedin', 'email', 'referral', 'other'],
    default: 'website'
  },
  isSpam: { type: Boolean, default: false }
}, {
  timestamps: true
});

// Auto-detect spam and set priority
contactMessageSchema.pre('save', function(next) {
  // Simple spam detection
  const spamKeywords = ['casino', 'lottery', 'viagra', 'crypto', 'bitcoin', 'investment opportunity'];
  const messageContent = (this.message + ' ' + (this.subject || '')).toLowerCase();
  const hasSpamKeywords = spamKeywords.some(keyword => messageContent.includes(keyword));

  if (hasSpamKeywords) {
    this.isSpam = true;
    this.priority = 'low';
  }

  // Auto-set priority based on keywords
  const urgentKeywords = ['urgent', 'asap', 'emergency', 'critical'];
  const highPriorityKeywords = ['project', 'collaboration', 'job', 'opportunity'];

  if (urgentKeywords.some(keyword => messageContent.includes(keyword))) {
    this.priority = 'urgent';
  } else if (highPriorityKeywords.some(keyword => messageContent.includes(keyword))) {
    this.priority = 'high';
  }

  next();
});

// Export model safely for serverless
const ContactMessage = mongoose.models.ContactMessage || mongoose.model('ContactMessage', contactMessageSchema);

// Email service
async function sendContactFormEmails(contactDetails) {

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

    const { name, email, subject, message, messageType, priority, contactId } = contactDetails;

    const priorityLabels = {
      'low': '🟢 Low',
      'medium': '🟡 Medium',
      'high': '🟠 High',
      'urgent': '🔴 Urgent'
    };

    const messageTypeLabels = {
      'general': 'General Inquiry',
      'project': 'Project Discussion',
      'collaboration': 'Collaboration Opportunity',
      'support': 'Support Request',
      'other': 'Other'
    };

    const priorityLabel = priorityLabels[priority] || '🟡 Medium';
    const typeLabel = messageTypeLabels[messageType] || 'General Inquiry';

    // Auto-reply email to contact
    const autoReplyOptions = {
      from: `"Ganesh Adimalupu - Portfolio" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `✅ Message Received: ${subject || 'Your inquiry'}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: linear-gradient(145deg, #1a0f23 0%, #0D0D0D 100%); color: #f0e6f0;">
          <div style="background: linear-gradient(135deg, #F72585 0%, #7209B7 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0;">🎉 Message Received!</h1>
            <p style="margin: 10px 0 0 0;">Thank you for reaching out. I'll get back to you soon!</p>
          </div>

          <div style="background: rgba(255,255,255,0.03); padding: 30px; border-radius: 0 0 10px 10px;">
            <h2 style="color: #f0e6f0;">Hello ${name},</h2>
            <p style="color: #a89db2; line-height: 1.6;">Thank you for your message! I've received your inquiry and will review it shortly.</p>

            <div style="background: rgba(247, 37, 133, 0.1); padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid rgba(247, 37, 133, 0.2);">
              <h3 style="color: #F72585; margin-top: 0;">📝 Your Message Details</h3>
              <p style="margin: 8px 0; color: #f0e6f0;"><strong>Subject:</strong> ${subject || 'No subject provided'}</p>
              <p style="margin: 8px 0; color: #f0e6f0;"><strong>Message Type:</strong> ${typeLabel}</p>
              <p style="margin: 8px 0; color: #f0e6f0;"><strong>Priority:</strong> ${priorityLabel}</p>
              <p style="margin: 8px 0; color: #f0e6f0;"><strong>Reference ID:</strong> ${contactId}</p>
            </div>

            <div style="margin: 30px 0;">
              <h3 style="color: #f0e6f0;">⏱️ What's Next?</h3>
              <ul style="color: #a89db2; line-height: 1.8;">
                <li>I typically respond within 24-48 hours</li>
                <li>Priority messages get faster responses</li>
                <li>I'll schedule a call if needed for projects</li>
                <li>Feel free to add more details by replying</li>
              </ul>
            </div>

            <p style="color: #a89db2;">Looking forward to connecting!</p>
            <p style="color: #f0e6f0;"><strong>Best regards,<br>Ganesh Adimalupu</strong><br>Machine Learning Engineer & AI Solutions Developer</p>

            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid rgba(247, 37, 133, 0.2); text-align: center; color: #666; font-size: 12px;">
              📧 ganeshadimalupu@disroot.org | 💼 linkedin.com/in/GaneshAdimalupu | Reference: ${contactId}
            </div>
          </div>
        </div>
      `
    };

    // Admin notification email
    const adminNotificationOptions = {
      from: `"Portfolio Contact Form" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: `📧 New Contact: ${name} - ${priorityLabel} Priority`,
      html: `
        <div style="font-family: monospace; background: #0D0D0D; color: #f0e6f0; padding: 20px;">
          <div style="background: linear-gradient(135deg, #F72585 0%, #7209B7 100%); color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h2 style="margin: 0;">📧 New Contact Message Alert</h2>
            <p style="margin: 10px 0 0 0;">Priority: ${priorityLabel} | Type: ${typeLabel}</p>
          </div>

          <div style="background: #1a0f23; padding: 20px; border-radius: 8px; border: 1px solid #F72585;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 8px; border-bottom: 1px solid rgba(247, 37, 133, 0.2); font-weight: bold; color: #F72585;">From:</td><td style="padding: 8px; border-bottom: 1px solid rgba(247, 37, 133, 0.2); color: #f0e6f0;">${name} &lt;${email}&gt;</td></tr>
              <tr><td style="padding: 8px; border-bottom: 1px solid rgba(247, 37, 133, 0.2); font-weight: bold; color: #F72585;">Subject:</td><td style="padding: 8px; border-bottom: 1px solid rgba(247, 37, 133, 0.2); color: #f0e6f0;">${subject || 'No subject'}</td></tr>
              <tr><td style="padding: 8px; border-bottom: 1px solid rgba(247, 37, 133, 0.2); font-weight: bold; color: #F72585;">Phone:</td><td style="padding: 8px; border-bottom: 1px solid rgba(247, 37, 133, 0.2); color: #f0e6f0;">${contactDetails.phone || 'Not provided'}</td></tr>
              <tr><td style="padding: 8px; border-bottom: 1px solid rgba(247, 37, 133, 0.2); font-weight: bold; color: #F72585;">Company:</td><td style="padding: 8px; border-bottom: 1px solid rgba(247, 37, 133, 0.2); color: #f0e6f0;">${contactDetails.company || 'Not provided'}</td></tr>
              <tr><td style="padding: 8px; border-bottom: 1px solid rgba(247, 37, 133, 0.2); font-weight: bold; color: #F72585;">Priority:</td><td style="padding: 8px; border-bottom: 1px solid rgba(247, 37, 133, 0.2); color: #f0e6f0;">${priorityLabel}</td></tr>
              <tr><td style="padding: 8px; border-bottom: 1px solid rgba(247, 37, 133, 0.2); font-weight: bold; color: #F72585;">Contact ID:</td><td style="padding: 8px; border-bottom: 1px solid rgba(247, 37, 133, 0.2); color: #f0e6f0;">${contactId}</td></tr>
              ${contactDetails.isSpam ? '<tr><td colspan="2" style="padding: 8px; background: rgba(255, 193, 7, 0.1); color: #ffc107; border: 1px solid #ffc107; border-radius: 4px;">⚠️ Potential spam detected</td></tr>' : ''}
            </table>

            <div style="background: rgba(76, 201, 240, 0.1); padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #4CC9F0;">
              <h3 style="color: #4CC9F0; margin-top: 0;">📝 Message:</h3>
              <p style="white-space: pre-wrap; line-height: 1.6; color: #f0e6f0;">${message}</p>
            </div>

            <div style="margin-top: 20px; padding: 15px; background: rgba(255,255,255,0.03); border-radius: 5px;">
              <strong>⏰ Submitted:</strong> ${new Date().toISOString()}<br>
              <strong>🔗 Quick Reply:</strong> <a href="mailto:${email}?subject=Re: ${subject || 'Your inquiry'}" style="color: #4CC9F0;">Reply to ${name}</a>
            </div>
          </div>
        </div>
      `
    };

    // Send both emails
    const autoReplyResult = await transporter.sendMail(autoReplyOptions);
    const adminResult = await transporter.sendMail(adminNotificationOptions);

    return {
      autoReply: { messageId: autoReplyResult.messageId },
      adminNotification: { messageId: adminResult.messageId }
    };

  } catch (error) {

    throw error;
  }
}

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

    // Validate required fields
    const { name, email, message } = req.body;
    const missingFields = [];

    if (!name || name.trim().length < 2) missingFields.push('name (minimum 2 characters)');
    if (!email) missingFields.push('email');
    if (!message || message.trim().length < 10) missingFields.push('message (minimum 10 characters)');

    if (missingFields.length > 0) {
      return res.status(400).json({
        error: 'Invalid form data',
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

    // Rate limiting - check for recent submissions from same email
    await connectDB();

    const recentSubmission = await ContactMessage.findOne({
      email: email.toLowerCase(),
      createdAt: { $gte: new Date(Date.now() - 5 * 60 * 1000) } // 5 minutes
    });

    if (recentSubmission) {
      return res.status(429).json({
        error: 'Rate limit exceeded',
        message: 'Please wait 5 minutes before submitting another message',
        nextAllowedTime: new Date(recentSubmission.createdAt.getTime() + 5 * 60 * 1000)
      });
    }

    // Capture request metadata
    const getClientIP = (req) => {
      return req.headers['x-forwarded-for'] ||
             req.headers['x-real-ip'] ||
             req.connection?.remoteAddress ||
             req.socket?.remoteAddress ||
             'unknown';
    };

    // Save contact message
    const contactData = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: req.body.subject?.trim() || 'Contact Form Submission',
      message: message.trim(),
      phone: req.body.phone?.trim() || null,
      company: req.body.company?.trim() || null,
      messageType: req.body.messageType || 'general',
      ipAddress: getClientIP(req),
      userAgent: req.headers['user-agent'] || null,
      source: 'website'
    };

    const contactMessage = new ContactMessage(contactData);
    const savedMessage = await contactMessage.save();

    // Send emails
    let emailResult = null;
    let emailError = null;

    try {
      emailResult = await sendContactFormEmails({
        ...contactData,
        contactId: savedMessage._id,
        priority: savedMessage.priority,
        isSpam: savedMessage.isSpam
      });

    } catch (error) {

      emailError = error.message;
      // Continue - don't fail contact submission for email issues
    }

    const processingTime = Date.now() - startTime;

    // Return success response
    return res.status(201).json({
      success: true,
      message: 'Message sent successfully! Thank you for reaching out.',
      contact: {
        id: savedMessage._id,
        name: savedMessage.name,
        email: savedMessage.email,
        subject: savedMessage.subject,
        messageType: savedMessage.messageType,
        priority: savedMessage.priority,
        status: savedMessage.status
      },
      services: {
        database: { status: 'success', message: 'Contact message saved' },
        autoReply: emailResult?.autoReply
          ? { status: 'success', message: 'Auto-reply sent' }
          : { status: 'failed', error: emailError },
        adminNotification: emailResult?.adminNotification
          ? { status: 'success', message: 'Admin notification sent' }
          : { status: 'failed', error: emailError }
      },
      processingTime: `${processingTime}ms`,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    const processingTime = Date.now() - startTime;

    return res.status(500).json({
      success: false,
      error: 'Contact form submission failed',
      message: error.message,
      details: {
        processingTime: `${processingTime}ms`,
        timestamp: new Date().toISOString()
      }
    });
  }
}
