// lib/services/emailService.js - COMBINED AND REFACTORED
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

// --- Core Email Sending Function ---
const sendEmail = async (mailOptions) => {
  if (!transporter) {
    throw new Error(
      'Email transporter is not initialized. Check environment variables.'
    );
  }
  // For production, you might remove the verify call to improve performance
  // as it attempts a connection on every send.
  await transporter
    .verify()
    .catch((err) => console.warn(`SMTP verify failed: ${err.message}`));
  return transporter.sendMail(mailOptions);
};

// =================================================================
// --- 1. MEETING SCHEDULING EMAILS ---
// =================================================================

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
              .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; }
              .header { background: linear-gradient(135deg, #00CDFE 0%, #0099cc 100%); color: white; padding: 2rem; text-align: center; }
              .content { padding: 2rem; }
              .meeting-details { background: #f8f9fa; padding: 1.5rem; border-radius: 10px; margin: 1.5rem 0; }
              .detail-row { display: flex; justify-content: space-between; margin: 0.8rem 0; }
              .detail-label { font-weight: 600; color: #495057; }
              .status-badge { display: inline-block; padding: 0.3rem 0.8rem; border-radius: 20px; font-size: 0.8rem; font-weight: 600; }
              .status-success { background: #d4edda; color: #155724; }
              .status-warning { background: #fff3cd; color: #856404; }
              .footer { background: #f8f9fa; padding: 1.5rem; text-align: center; color: #6c757d; font-size: 0.9rem; }
              .divider { height: 1px; background: #e9ecef; margin: 1.5rem 0; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header"><h1>🎉 Meeting Confirmed!</h1><p>Your meeting has been successfully scheduled.</p></div>
              <div class="content">
                <h2>Hello ${name},</h2>
                <p>Thank you for scheduling a meeting! Your booking has been confirmed.</p>
                <div class="meeting-details">
                  <h3>📅 Meeting Details</h3>
                  <div class="detail-row"><span>Meeting Type:</span><span>${meetingLabel}</span></div>
                  <div class="detail-row"><span>Date:</span><span>${formattedDate}</span></div>
                  <div class="detail-row"><span>Time:</span><span>${time} (${timezone})</span></div>
                  <div class="detail-row"><span>Booking ID:</span><span>${bookingId}</span></div>
                </div>
                <div class="meeting-details">
                  <h3>🔧 Service Status</h3>
                  <div class="detail-row"><span>Google Calendar:</span><span class="status-badge ${
                    calendarEventId ? 'status-success' : 'status-warning'
                  }">${
        calendarEventId ? '✅ Event Created' : '⚠️ Please Add Manually'
      }</span></div>
                  <div class="detail-row"><span>Email Confirmation:</span><span class="status-badge status-success">✅ Sent</span></div>
                </div>
                <div class="divider"></div>
                <h3>📝 What's Next?</h3>
                <ul>
                  <li><strong>Calendar Invite:</strong> ${
                    calendarEventId
                      ? 'You should receive a calendar invitation shortly.'
                      : 'Please add this meeting to your calendar manually.'
                  }</li>
                  <li><strong>Rescheduling:</strong> Need to change the time? Just reply to this email.</li>
                </ul>
                <p>Looking forward to our meeting!</p>
                <p>Best regards,<br><strong>Ganesh Adimalupu</strong></p>
              </div>
              <div class="footer"><p>This is an automated confirmation email. Meeting ID: ${bookingId}</p></div>
            </div>
          </body>
        </html>`,
    },
    admin: {
      subject: `🔔 New Meeting Booked: ${name} - ${formattedDate}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head><title>New Meeting Booking</title></head>
          <body style="font-family: monospace; background: #f8f9fa; margin: 0; padding: 2rem;">
            <div style="max-width: 600px; margin: 0 auto; background: white; padding: 2rem; border-radius: 10px;">
              <div style="background: #28a745; color: white; padding: 1rem; border-radius: 5px; margin-bottom: 2rem;"><h2>📅 New Meeting Booking Alert</h2></div>
              <table style="width: 100%; border-collapse: collapse;">
                <tr><th style="padding: 0.8rem; text-align: left; border-bottom: 1px solid #dee2e6;">Client Name</th><td style="padding: 0.8rem; text-align: left; border-bottom: 1px solid #dee2e6;">${name}</td></tr>
                <tr><th style="padding: 0.8rem; text-align: left; border-bottom: 1px solid #dee2e6;">Email</th><td style="padding: 0.8rem; text-align: left; border-bottom: 1px solid #dee2e6;">${email}</td></tr>
                <tr><th style="padding: 0.8rem; text-align: left; border-bottom: 1px solid #dee2e6;">Meeting Type</th><td style="padding: 0.8rem; text-align: left; border-bottom: 1px solid #dee2e6;">${meetingLabel}</td></tr>
                <tr><th style="padding: 0.8rem; text-align: left; border-bottom: 1px solid #dee2e6;">Date</th><td style="padding: 0.8rem; text-align: left; border-bottom: 1px solid #dee2e6;">${formattedDate}</td></tr>
                <tr><th style="padding: 0.8rem; text-align: left; border-bottom: 1px solid #dee2e6;">Time</th><td style="padding: 0.8rem; text-align: left; border-bottom: 1px solid #dee2e6;">${time} (${timezone})</td></tr>
                <tr><th style="padding: 0.8rem; text-align: left; border-bottom: 1px solid #dee2e6;">Booking ID</th><td style="padding: 0.8rem; text-align: left; border-bottom: 1px solid #dee2e6;">${bookingId}</td></tr>
                <tr><th style="padding: 0.8rem; text-align: left; border-bottom: 1px solid #dee2e6;">Calendar Event</th><td style="padding: 0.8rem; text-align: left; border-bottom: 1px solid #dee2e6;">${
                  calendarEventId || 'Failed to create'
                }</td></tr>
              </table>
            </div>
          </body>
        </html>`,
    },
  };
  return templates[type];
};

/**
 * Sends a confirmation email for a scheduled meeting.
 * @param {object} bookingDetails - The details of the meeting booking.
 */
exports.sendMeetingConfirmation = async (bookingDetails) => {
  const { name, email, date, time } = bookingDetails;
  if (!name || !email || !date || !time) {
    throw new Error('Missing required booking data for email.');
  }
  if (!bookingDetails.bookingId) {
    bookingDetails.bookingId = `TEMP-${Date.now()}`;
  }

  try {
    const clientTemplate = getMeetingEmailTemplates(
      'confirmation',
      bookingDetails
    );
    await sendEmail({
      from: `"Ganesh Adimalupu - ML Engineer" <${EMAIL_USER}>`,
      to: email,
      subject: clientTemplate.subject,
      html: clientTemplate.html,
    });

    const adminTemplate = getMeetingEmailTemplates('admin', bookingDetails);
    await sendEmail({
      from: `"Booking System" <${EMAIL_USER}>`,
      to: EMAIL_USER,
      subject: adminTemplate.subject,
      html: adminTemplate.html,
    });
    return { status: 'success' };
  } catch (error) {
    console.error(
      `Failed to send meeting confirmation emails: ${error.message}`
    );
    throw error;
  }
};

// =================================================================
// --- 2. CONTACT FORM SUBMISSION EMAILS ---
// =================================================================

const getContactEmailTemplates = (type, data) => {
  const { name, email, subject, message, contactId } = data;
  const templates = {
    'auto-reply': {
      subject: `✅ Message Received: ${subject || 'Your inquiry'}`,
      html: `
              <!DOCTYPE html>
              <html>
              <body style="font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f4f4f4;">
                  <div style="max-width: 600px; margin: auto; background: white; padding: 20px; border-radius: 8px;">
                      <h1 style="color: #333;">Thank You, ${name}!</h1>
                      <p>I have received your message and will get back to you as soon as possible. I typically respond within 24-48 hours.</p>
                      <div style="background: #f9f9f9; border-left: 4px solid #007bff; padding: 15px; margin: 20px 0;">
                          <p><strong>Your Inquiry:</strong></p>
                          <p><em>"${message}"</em></p>
                      </div>
                      <p>Best regards,<br><strong>Ganesh Adimalupu</strong></p>
                      <hr>
                      <p style="font-size: 12px; color: #777;">Reference ID: ${contactId}</p>
                  </div>
              </body>
              </html>
            `,
    },
    'admin-notification': {
      subject: `📧 New Contact Form Message from ${name}`,
      html: `
              <!DOCTYPE html>
              <html>
              <body style="font-family: monospace; background: #f4f4f4; padding: 20px;">
                  <div style="max-width: 600px; margin: auto; background: white; padding: 20px; border: 1px solid #ddd;">
                      <h2>New Contact Submission</h2><hr>
                      <p><strong>Name:</strong> ${name}</p>
                      <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
                      <p><strong>Subject:</strong> ${
                        subject || 'No subject provided'
                      }</p>
                      <p><strong>Company:</strong> ${
                        data.company || 'Not provided'
                      }</p>
                      <p><strong>Phone:</strong> ${
                        data.phone || 'Not provided'
                      }</p>
                      <hr><h3>Message:</h3><p style="white-space: pre-wrap;">${message}</p><hr>
                      <p style="font-size: 12px; color: #777;">Contact ID: ${contactId}</p>
                  </div>
              </body>
              </html>
            `,
    },
  };
  return templates[type];
};

/**
 * Sends notifications for a new contact form submission.
 * @param {object} contactDetails - The details from the contact form.
 */
exports.sendContactNotification = async (contactDetails) => {
  const { name, email, message } = contactDetails;
  if (!name || !email || !message) {
    throw new Error('Missing required contact data for email.');
  }

  try {
    const autoReplyTemplate = getContactEmailTemplates(
      'auto-reply',
      contactDetails
    );
    await sendEmail({
      from: `"Ganesh Adimalupu" <${EMAIL_USER}>`,
      to: email,
      subject: autoReplyTemplate.subject,
      html: autoReplyTemplate.html,
    });

    const adminNotificationTemplate = getContactEmailTemplates(
      'admin-notification',
      contactDetails
    );
    await sendEmail({
      from: `"Portfolio Contact Form" <${EMAIL_USER}>`,
      to: EMAIL_USER,
      subject: adminNotificationTemplate.subject,
      html: adminNotificationTemplate.html,
    });
    return { status: 'success' };
  } catch (error) {
    console.error(
      `Failed to send contact notification emails: ${error.message}`
    );
    throw error;
  }
};

// =================================================================
// --- 3. UTILITY AND HEALTH-CHECK FUNCTIONS ---
// =================================================================

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

/**
 * Validates that the necessary email configuration is present.
 */
exports.validateEmailConfig = () => {
  return {
    isConfigured: !!EMAIL_USER && !!EMAIL_PASS,
    isTransporterReady: !!transporter,
  };
};
