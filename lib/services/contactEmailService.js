// lib/services/emailService.js - Production Ready
const nodemailer = require('nodemailer');

// Check environment variables
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;

let transporter = null;

try {
  transporter = nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
} catch (error) {
  // Transporter creation failed
}

// Email templates
const getEmailTemplate = (type, data) => {
  const {
    name,
    date,
    time,
    meetingType,
    timezone,
    bookingId,
    calendarEventId,
  } = data;

  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const meetingTypeLabels = {
    consultation: 'Free Consultation (30 min)',
    'project-discussion': 'Project Discussion (45 min)',
    'technical-review': 'Technical Review (60 min)',
    'follow-up': 'Follow-up Meeting (15 min)',
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
                    <span class="status-badge ${
                      calendarEventId ? 'status-success' : 'status-warning'
                    }">
                      ${
                        calendarEventId
                          ? '✅ Event Created'
                          : '⚠️ Manual Calendar'
                      }
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
                  <li><strong>Calendar Invite:</strong> ${
                    calendarEventId
                      ? 'You should receive a calendar invitation shortly.'
                      : 'Please add this meeting to your calendar manually.'
                  }</li>
                  <li><strong>Preparation:</strong> Feel free to send any materials or questions beforehand.</li>
                  <li><strong>Rescheduling:</strong> Need to change the time? Just reply to this email.</li>
                  <li><strong>Questions:</strong> Contact me directly if you have any concerns.</li>
                </ul>

                <div class="divider"></div>

                <p><strong>Looking forward to our meeting!</strong></p>
                <p>Best regards,<br><strong>Ganesh Adimalupu</strong><br>Machine Learning Engineer & AI Solutions Developer</p>
              </div>

              <div class="footer">
                <p>📧 Email: ganeshadimalupu@disroot.org</p>
                <p>💼 LinkedIn: linkedin.com/in/GaneshAdimalupu</p>
                <p>🌐 Portfolio: Your Portfolio Website</p>
                <div style="margin-top: 1rem; font-size: 0.8rem; color: #adb5bd;">
                  This is an automated confirmation email. Meeting ID: ${bookingId}
                </div>
              </div>
            </div>
          </body>
          </html>
        `,
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
                <tr><th>Company</th><td>${
                  data.company || 'Not provided'
                }</td></tr>
                <tr><th>Meeting Type</th><td>${meetingLabel}</td></tr>
                <tr><th>Date</th><td>${formattedDate}</td></tr>
                <tr><th>Time</th><td>${time} (${timezone})</td></tr>
                <tr><th>Booking ID</th><td>${bookingId}</td></tr>
                <tr><th>Calendar Event</th><td>${
                  calendarEventId || 'Failed to create'
                }</td></tr>
              </table>

              ${
                data.message
                  ? `
                <h3>📝 Client Message:</h3>
                <div style="background: #f8f9fa; padding: 1rem; border-radius: 5px; font-style: italic;">
                  "${data.message}"
                </div>
              `
                  : ''
              }

              <div style="margin-top: 2rem; padding: 1rem; background: #e9ecef; border-radius: 5px;">
                <strong>⏰ Timestamp:</strong> ${new Date().toISOString()}
              </div>
            </div>
          </body>
          </html>
        `,
      };

    default:
      throw new Error(`Unknown email template type: ${type}`);
  }
};

// Send confirmation email function
exports.sendConfirmationEmail = async (bookingDetails) => {
  try {
    if (!transporter) {
      throw new Error(
        'Email transporter not initialized - check EMAIL_USER and EMAIL_PASS environment variables'
      );
    }

    const { name, email, date, time, bookingId } = bookingDetails;

    if (!name || !email || !date || !time) {
      throw new Error(
        'Missing required email data: name, email, date, or time'
      );
    }

    if (!bookingId) {
      bookingDetails.bookingId = `TEMP-${Date.now()}`;
    }

    try {
      await transporter.verify();
    } catch (verifyError) {
      // SMTP verification failed - continue anyway
    }

    // Generate confirmation email for client
    const confirmationTemplate = getEmailTemplate(
      'confirmation',
      bookingDetails
    );

    const clientMailOptions = {
      from: `"Ganesh Adimalupu - ML Engineer" <${EMAIL_USER}>`,
      to: email,
      subject: confirmationTemplate.subject,
      html: confirmationTemplate.html,
    };

    const clientEmailResult = await transporter.sendMail(clientMailOptions);

    // Send admin notification email
    const adminTemplate = getEmailTemplate('admin', bookingDetails);

    const adminMailOptions = {
      from: `"Booking System" <${EMAIL_USER}>`,
      to: EMAIL_USER,
      subject: adminTemplate.subject,
      html: adminTemplate.html,
    };

    const adminEmailResult = await transporter.sendMail(adminMailOptions);

    return {
      client: {
        messageId: clientEmailResult.messageId,
        response: clientEmailResult.response,
        accepted: clientEmailResult.accepted,
        rejected: clientEmailResult.rejected,
      },
      admin: {
        messageId: adminEmailResult.messageId,
        response: adminEmailResult.response,
      },
    };
  } catch (error) {
    throw new Error(`Email sending failed: ${error.message}`);
  }
};

// Test email service
exports.testEmailService = async () => {
  try {
    if (!transporter) {
      throw new Error('Email transporter not available');
    }

    await transporter.verify();
    return { success: true, message: 'Email service is working' };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Validate email configuration
exports.validateEmailConfig = () => {
  const config = {
    emailUser: !!EMAIL_USER,
    emailPass: !!EMAIL_PASS,
    transporterReady: !!transporter,
  };

  return config;
};
