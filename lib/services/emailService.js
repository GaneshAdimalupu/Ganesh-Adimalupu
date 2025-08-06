// services/emailService.js - ENHANCED VERSION
const nodemailer = require('nodemailer');

console.log('📧 Initializing Enhanced Email Service...');

// Check email environment variables
console.log('🔍 Checking email environment variables:');
console.log(`   EMAIL_USER: ${process.env.EMAIL_USER ? '✅ Set' : '❌ Missing'} ${process.env.EMAIL_USER || ''}`);
console.log(`   EMAIL_PASS: ${process.env.EMAIL_PASS ? '✅ Set' : '❌ Missing'} ${process.env.EMAIL_PASS ? '(App Password)' : ''}`);

let transporter = null;

try {
  console.log('🔧 Creating enhanced nodemailer transporter...');
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false
    }
  });
  console.log('✅ Enhanced email transporter created successfully');
} catch (error) {
  console.error('❌ Failed to create email transporter:');
  console.error('   Error:', error.message);
}

// Enhanced email templates
const getEmailTemplate = (type, data) => {
  const { name, date, time, meetingType, timezone, bookingId, calendarEventId } = data;

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

  switch (type) {
    case 'confirmation':
      return {
        subject: `✅ Meeting Confirmed: ${meetingLabel} - ${formattedDate}`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Meeting Confirmation</title>
            <style>
              body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f8f9fa; }
              .container { max-width: 600px; margin: 0 auto; background: white; }
              .header { background: linear-gradient(135deg, #00CDFE 0%, #0099cc 100%); color: white; padding: 2rem; text-align: center; }
              .content { padding: 2rem; }
              .meeting-details { background: #f8f9fa; padding: 1.5rem; border-radius: 10px; margin: 1.5rem 0; }
              .detail-row { display: flex; justify-content: space-between; margin: 0.8rem 0; }
              .detail-label { font-weight: 600; color: #495057; }
              .detail-value { color: #212529; }
              .status-badge { display: inline-block; padding: 0.3rem 0.8rem; border-radius: 20px; font-size: 0.8rem; font-weight: 600; }
              .status-success { background: #d4edda; color: #155724; }
              .status-warning { background: #fff3cd; color: #856404; }
              .footer { background: #f8f9fa; padding: 1.5rem; text-align: center; color: #6c757d; font-size: 0.9rem; }
              .button { display: inline-block; padding: 1rem 2rem; background: #00CDFE; color: white; text-decoration: none; border-radius: 5px; margin: 1rem 0; }
              .divider { height: 1px; background: #e9ecef; margin: 1.5rem 0; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🎉 Meeting Confirmed!</h1>
                <p>Your meeting has been successfully scheduled</p>
              </div>

              <div class="content">
                <h2>Hello ${name},</h2>
                <p>Thank you for scheduling a meeting! Your booking has been confirmed and saved to our system.</p>

                <div class="meeting-details">
                  <h3>📅 Meeting Details</h3>
                  <div class="detail-row">
                    <span class="detail-label">Meeting Type:</span>
                    <span class="detail-value">${meetingLabel}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">Date:</span>
                    <span class="detail-value">${formattedDate}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">Time:</span>
                    <span class="detail-value">${time} (${timezone})</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">Booking ID:</span>
                    <span class="detail-value">${bookingId}</span>
                  </div>
                </div>

                <div class="meeting-details">
                  <h3>🔧 Service Status</h3>
                  <div class="detail-row">
                    <span class="detail-label">Database:</span>
                    <span class="status-badge status-success">✅ Saved</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">Google Calendar:</span>
                    <span class="status-badge ${calendarEventId ? 'status-success' : 'status-warning'}">
                      ${calendarEventId ? '✅ Event Created' : '⚠️ Manual Calendar'}
                    </span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">Email Confirmation:</span>
                    <span class="status-badge status-success">✅ Sent</span>
                  </div>
                </div>

                <div class="divider"></div>

                <h3>📝 What's Next?</h3>
                <ul>
                  <li><strong>Calendar Invite:</strong> ${calendarEventId ? 'You should receive a calendar invitation shortly.' : 'Please add this meeting to your calendar manually.'}</li>
                  <li><strong>Preparation:</strong> Feel free to send any materials or questions beforehand.</li>
                  <li><strong>Rescheduling:</strong> Need to change the time? Just reply to this email.</li>
                  <li><strong>Questions:</strong> Contact me directly if you have any concerns.</li>
                </ul>

                <div class="divider"></div>

                <p><strong>Looking forward to our meeting!</strong></p>
                <p>Best regards,<br><strong>Ganesh Adimalupu</strong><br>Machine Learning Engineer & AI Solutions Developer</p>
              </div>

              <div class="footer">
                <p>📧 Email: ganeshjohn253@gmail.com</p>
                <p>💼 LinkedIn: linkedin.com/in/GaneshAdimalupu</p>
                <p>🌐 Portfolio: Your Portfolio Website</p>
                <div style="margin-top: 1rem; font-size: 0.8rem; color: #adb5bd;">
                  This is an automated confirmation email. Meeting ID: ${bookingId}
                </div>
              </div>
            </div>
          </body>
          </html>
        `
      };

    case 'admin':
      return {
        subject: `🔔 New Meeting Booked: ${name} - ${formattedDate}`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <title>New Meeting Booking</title>
            <style>
              body { font-family: monospace; background: #f8f9fa; margin: 0; padding: 2rem; }
              .container { max-width: 600px; margin: 0 auto; background: white; padding: 2rem; border-radius: 10px; }
              .header { background: #28a745; color: white; padding: 1rem; border-radius: 5px; margin-bottom: 2rem; }
              .data-table { width: 100%; border-collapse: collapse; margin: 1rem 0; }
              .data-table th, .data-table td { padding: 0.8rem; text-align: left; border-bottom: 1px solid #dee2e6; }
              .data-table th { background: #f8f9fa; font-weight: 600; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h2>📅 New Meeting Booking Alert</h2>
                <p>A new meeting has been scheduled on your calendar</p>
              </div>

              <table class="data-table">
                <tr><th>Client Name</th><td>${name}</td></tr>
                <tr><th>Email</th><td>${data.email}</td></tr>
                <tr><th>Phone</th><td>${data.phone || 'Not provided'}</td></tr>
                <tr><th>Company</th><td>${data.company || 'Not provided'}</td></tr>
                <tr><th>Meeting Type</th><td>${meetingLabel}</td></tr>
                <tr><th>Date</th><td>${formattedDate}</td></tr>
                <tr><th>Time</th><td>${time} (${timezone})</td></tr>
                <tr><th>Booking ID</th><td>${bookingId}</td></tr>
                <tr><th>Calendar Event</th><td>${calendarEventId || 'Failed to create'}</td></tr>
              </table>

              ${data.message ? `
                <h3>📝 Client Message:</h3>
                <div style="background: #f8f9fa; padding: 1rem; border-radius: 5px; font-style: italic;">
                  "${data.message}"
                </div>
              ` : ''}

              <div style="margin-top: 2rem; padding: 1rem; background: #e9ecef; border-radius: 5px;">
                <strong>⏰ Timestamp:</strong> ${new Date().toISOString()}
              </div>
            </div>
          </body>
          </html>
        `
      };

    default:
      throw new Error(`Unknown email template type: ${type}`);
  }
};

// Enhanced confirmation email function
exports.sendConfirmationEmail = async (bookingDetails) => {
  console.log('\n📧 SEND ENHANCED CONFIRMATION EMAIL');
  console.log('📋 Booking details:', JSON.stringify(bookingDetails, null, 2));

  try {
    if (!transporter) {
      throw new Error('Email transporter not initialized - check EMAIL_USER and EMAIL_PASS environment variables');
    }

    console.log('\n🔍 Validating email data...');
    const { name, email, date, time, bookingId } = bookingDetails;

    if (!name || !email || !date || !time) {
      throw new Error('Missing required email data: name, email, date, or time');
    }

    if (!bookingId) {
      console.log('⚠️ No booking ID provided, generating temporary ID');
      bookingDetails.bookingId = `TEMP-${Date.now()}`;
    }

    console.log('✅ All required email fields present');

    console.log('\n🔗 Verifying SMTP connection...');
    try {
      await transporter.verify();
      console.log('✅ SMTP connection verified successfully');
    } catch (verifyError) {
      console.error('⚠️ SMTP verification failed:', verifyError.message);
      console.log('⏭️ Continuing with email send attempt...');
    }

    console.log('\n✍️ Generating email templates...');

    // Generate confirmation email for client
    const confirmationTemplate = getEmailTemplate('confirmation', bookingDetails);

    const clientMailOptions = {
      from: `"Ganesh Adimalupu - ML Engineer" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: confirmationTemplate.subject,
      html: confirmationTemplate.html,
    };

    console.log('📧 Client email prepared:');
    console.log(`   To: ${clientMailOptions.to}`);
    console.log(`   Subject: ${clientMailOptions.subject}`);

    console.log('\n📤 Sending confirmation email to client...');
    const clientEmailResult = await transporter.sendMail(clientMailOptions);

    console.log('✅ Client email sent successfully!');
    console.log(`   Message ID: ${clientEmailResult.messageId}`);
    console.log(`   Response: ${clientEmailResult.response}`);

    // Send admin notification email (to yourself)
    console.log('\n📤 Sending admin notification...');
    const adminTemplate = getEmailTemplate('admin', bookingDetails);

    const adminMailOptions = {
      from: `"Booking System" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER, // Send to yourself
      subject: adminTemplate.subject,
      html: adminTemplate.html,
    };

    const adminEmailResult = await transporter.sendMail(adminMailOptions);
    console.log('✅ Admin notification sent successfully!');
    console.log(`   Admin Message ID: ${adminEmailResult.messageId}`);

    console.log('\n🎉 ALL EMAILS SENT SUCCESSFULLY');

    return {
      client: {
        messageId: clientEmailResult.messageId,
        response: clientEmailResult.response,
        accepted: clientEmailResult.accepted,
        rejected: clientEmailResult.rejected
      },
      admin: {
        messageId: adminEmailResult.messageId,
        response: adminEmailResult.response
      }
    };

  } catch (error) {
    console.error('\n🚨 ENHANCED EMAIL SENDING FAILED');
    console.error('⏰ Time:', new Date().toISOString());
    console.error('🔥 Error type:', error.constructor.name);
    console.error('💬 Error message:', error.message);
    console.error('📚 Stack trace:', error.stack);

    // Detailed SMTP error handling
    if (error.code) {
      console.error('🔧 SMTP Error code:', error.code);

      switch (error.code) {
        case 'EAUTH':
          console.error('🔐 Authentication failed - check EMAIL_USER and EMAIL_PASS');
          break;
        case 'ESOCKET':
          console.error('🌐 Network connection failed - check internet connection');
          break;
        case 'ETIMEDOUT':
          console.error('⏱️ Connection timeout - Gmail SMTP may be blocked');
          break;
        default:
          console.error('❓ Unknown SMTP error');
      }
    }

    if (error.response) {
      console.error('📨 SMTP Response:', error.response);
    }

    console.error('📋 Failed booking details:', JSON.stringify(bookingDetails, null, 2));

    throw new Error(`Enhanced email sending failed: ${error.message}`);
  }
};

// Enhanced email test function
exports.testEmailService = async () => {
  console.log('\n🧪 TESTING EMAIL SERVICE');

  try {
    if (!transporter) {
      throw new Error('Email transporter not available');
    }

    await transporter.verify();
    console.log('✅ Email service test passed');
    return { success: true, message: 'Email service is working' };

  } catch (error) {
    console.error('❌ Email service test failed:', error.message);
    return { success: false, error: error.message };
  }
};

// Helper function to validate email configuration
exports.validateEmailConfig = () => {
  const config = {
    emailUser: !!process.env.EMAIL_USER,
    emailPass: !!process.env.EMAIL_PASS,
    transporterReady: !!transporter
  };

  console.log('📧 Email Configuration Status:');
  console.log(`   EMAIL_USER: ${config.emailUser ? '✅' : '❌'}`);
  console.log(`   EMAIL_PASS: ${config.emailPass ? '✅' : '❌'}`);
  console.log(`   Transporter: ${config.transporterReady ? '✅' : '❌'}`);

  return config;
};

console.log('📧 Enhanced Email Service initialized');
console.log('✨ Features: HTML templates, Admin notifications, Error handling, SMTP verification');
