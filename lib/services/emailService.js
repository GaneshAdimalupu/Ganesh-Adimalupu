// services/emailService.js - COMBINED AND REFACTORED
const nodemailer = require('nodemailer');

// --- Configuration ---
const { EMAIL_USER, EMAIL_PASS } = process.env;

let transporter = null;

if (EMAIL_USER && EMAIL_PASS) {
  try {
    transporter = nodemailer.createTransport({
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
    console.error('Failed to create nodemailer transporter:', error);
  }
} else {
  console.warn(
    'Email service is not configured. Please provide EMAIL_USER and EMAIL_PASS environment variables.'
  );
}

// --- Email Templates ---

const getMeetingEmailTemplates = (type, data) => {
  const {
    name,
    date,
    time,
    meetingType,
    timezone,
    bookingId,
    calendarEventId,
    email,
    phone,
    company,
    message,
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

  const templates = {
    confirmation: {
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
      `,
    },
    admin: {
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
              <tr><th>Email</th><td>${email}</td></tr>
              <tr><th>Phone</th><td>${phone || 'Not provided'}</td></tr>
              <tr><th>Company</th><td>${company || 'Not provided'}</td></tr>
              <tr><th>Meeting Type</th><td>${meetingLabel}</td></tr>
              <tr><th>Date</th><td>${formattedDate}</td></tr>
              <tr><th>Time</th><td>${time} (${timezone})</td></tr>
              <tr><th>Booking ID</th><td>${bookingId}</td></tr>
              <tr><th>Calendar Event</th><td>${
                calendarEventId || 'Failed to create'
              }</td></tr>
            </table>

            ${
              message
                ? `
              <h3>📝 Client Message:</h3>
              <div style="background: #f8f9fa; padding: 1rem; border-radius: 5px; font-style: italic;">
                "${message}"
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
    },
  };

  if (!templates[type]) {
    throw new Error(`Unknown email template type: ${type}`);
  }

  return templates[type];
};

// --- Core Email Sending Function ---

const sendEmail = async (mailOptions) => {
  if (!transporter) {
    throw new Error(
      'Email transporter is not initialized. Check environment variables.'
    );
  }

  try {
    // In a production environment, you might remove this verify call for performance
    // as it tries to connect to the SMTP server on every send.
    await transporter.verify();
  } catch (verifyError) {
    console.warn(
      `SMTP transporter verification failed, but attempting to send anyway. Error: ${verifyError.message}`
    );
  }

  return transporter.sendMail(mailOptions);
};

// --- Service Functions ---

/**
 * Sends a confirmation email to the client and a notification to the admin.
 * @param {object} bookingDetails - The details of the booking.
 */
exports.sendConfirmationEmail = async (bookingDetails) => {
  const { name, email, date, time } = bookingDetails;

  if (!name || !email || !date || !time) {
    throw new Error(
      'Missing required booking data: name, email, date, or time'
    );
  }

  // Ensure a booking ID exists
  if (!bookingDetails.bookingId) {
    bookingDetails.bookingId = `TEMP-${Date.now()}`;
  }

  try {
    // 1. Send confirmation email to the client
    const clientTemplate = getMeetingEmailTemplates(
      'confirmation',
      bookingDetails
    );
    const clientMailOptions = {
      from: `"Ganesh Adimalupu - ML Engineer" <${EMAIL_USER}>`,
      to: email,
      subject: clientTemplate.subject,
      html: clientTemplate.html,
    };
    const clientEmailResult = await sendEmail(clientMailOptions);

    // 2. Send notification email to the admin
    const adminTemplate = getMeetingEmailTemplates('admin', bookingDetails);
    const adminMailOptions = {
      from: `"Booking System" <${EMAIL_USER}>`,
      to: EMAIL_USER, // Send to yourself
      subject: adminTemplate.subject,
      html: adminTemplate.html,
    };
    const adminEmailResult = await sendEmail(adminMailOptions);

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
    console.error(`Email sending failed: ${error.message}`);
    // Check for specific SMTP errors if needed
    if (error.code) {
      switch (error.code) {
        case 'EAUTH':
          console.error(
            'SMTP Authentication error. Check your EMAIL_USER and EMAIL_PASS.'
          );
          break;
        case 'ESOCKET':
          console.error(
            'SMTP Socket connection error. Check your network or the email service provider status.'
          );
          break;
        case 'ETIMEDOUT':
          console.error('SMTP Connection timed out.');
          break;
        default:
          console.error(`SMTP Error Code: ${error.code}`);
      }
    }
    // Re-throw the error to be handled by the calling function
    throw new Error(`Failed to send confirmation emails: ${error.message}`);
  }
};

// --- Utility and Health-Check Functions ---

/**
 * Validates that the necessary email configuration is present.
 */
exports.validateEmailConfig = () => {
  return {
    isConfigured: !!EMAIL_USER && !!EMAIL_PASS,
    isTransporterReady: !!transporter,
  };
};

/**
 * A simple function to test the email service by verifying the transporter.
 */
exports.testEmailService = async () => {
  if (!transporter) {
    return {
      success: false,
      message: 'Email transporter is not available. Check configuration.',
    };
  }

  try {
    await transporter.verify();
    return {
      success: true,
      message: 'Email service is configured and working correctly.',
    };
  } catch (error) {
    return {
      success: false,
      message: `Email service verification failed: ${error.message}`,
    };
  }
};
