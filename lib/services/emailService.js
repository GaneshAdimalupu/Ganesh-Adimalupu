// lib/services/emailService.js - COMPLETE FIXED VERSION
const nodemailer = require('nodemailer');

// --- Configuration ---
const { EMAIL_USER, EMAIL_PASS } = process.env;

let transporter = null;

if (EMAIL_USER && EMAIL_PASS) {
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
  await transporter
    .verify()
    .catch((err) => console.warn(`SMTP verify failed: ${err.message}`));
  return transporter.sendMail(mailOptions);
};

// --- FIXED DATE HANDLING FUNCTION ---
const formatDateForEmail = (dateString) => {
  try {
    console.log('🔍 Email date formatting input:', dateString);

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

      console.log('✅ Email date formatting result:', {
        originalDate: dateString,
        dateParts: { year, month: month + 1, day },
        createdDateObj: dateObj.toString(),
        formattedDate: formattedDate,
        isoString: dateObj.toISOString(),
      });

      return formattedDate;
    } else {
      // Fallback for other formats
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

  // FIXED: Use the new date formatting function
  const formattedDate = formatDateForEmail(date);

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
              .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
              .header { background: linear-gradient(135deg, #00CDFE 0%, #0099cc 100%); color: white; padding: 2rem; text-align: center; }
              .content { padding: 2rem; }
              .meeting-details { background: #f8f9fa; padding: 1.5rem; border-radius: 10px; margin: 1.5rem 0; border-left: 4px solid #00CDFE; }
              .detail-row { display: flex; justify-content: space-between; margin: 0.8rem 0; padding: 0.5rem 0; border-bottom: 1px solid #e9ecef; }
              .detail-row:last-child { border-bottom: none; }
              .detail-label { font-weight: 600; color: #495057; }
              .detail-value { color: #212529; font-weight: 500; }
              .status-badge { display: inline-block; padding: 0.3rem 0.8rem; border-radius: 20px; font-size: 0.8rem; font-weight: 600; }
              .status-success { background: #d4edda; color: #155724; }
              .status-warning { background: #fff3cd; color: #856404; }
              .footer { background: #f8f9fa; padding: 1.5rem; text-align: center; color: #6c757d; font-size: 0.9rem; }
              .divider { height: 1px; background: #e9ecef; margin: 1.5rem 0; }
              .debug-info { background: #e3f2fd; padding: 1rem; margin: 1rem 0; border-radius: 8px; font-size: 0.85rem; color: #1565c0; border: 1px solid #bbdefb; }
              .highlight { background: #fff3cd; padding: 0.5rem; border-radius: 4px; }
              .next-steps { background: #f8f9fa; padding: 1.5rem; border-radius: 8px; margin: 1.5rem 0; }
              .next-steps ul { margin: 0; padding-left: 1.5rem; }
              .next-steps li { margin: 0.5rem 0; line-height: 1.6; }
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
                <p>Thank you for scheduling a meeting! Your booking has been confirmed and I'm looking forward to our conversation.</p>
                
                <div class="meeting-details">
                  <h3>📅 Meeting Details</h3>
                  <div class="detail-row">
                    <span class="detail-label">Meeting Type:</span>
                    <span class="detail-value">${meetingLabel}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">Date:</span>
                    <span class="detail-value highlight">${formattedDate}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">Time:</span>
                    <span class="detail-value">${time} (${timezone})</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">Duration:</span>
                    <span class="detail-value">30 minutes</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">Booking ID:</span>
                    <span class="detail-value">${bookingId}</span>
                  </div>
                </div>

                <div class="debug-info">
                  <strong>🔍 Technical Details (for verification):</strong><br>
                  Original Date Input: <code>${date}</code><br>
                  Processed Date: <strong>${formattedDate}</strong><br>
                  Time Zone: ${timezone}<br>
                  Booking Timestamp: ${new Date().toISOString()}
                </div>

                <div class="meeting-details">
                  <h3>🔧 Service Status</h3>
                  <div class="detail-row">
                    <span class="detail-label">Google Calendar:</span>
                    <span class="status-badge ${
                      calendarEventId ? 'status-success' : 'status-warning'
                    }">
                      ${
                        calendarEventId
                          ? '✅ Event Created'
                          : '⚠️ Please Add Manually'
                      }
                    </span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">Email Confirmation:</span>
                    <span class="status-badge status-success">✅ Sent</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">Database:</span>
                    <span class="status-badge status-success">✅ Saved</span>
                  </div>
                </div>

                <div class="divider"></div>

                <div class="next-steps">
                  <h3>📝 What's Next?</h3>
                  <ul>
                    <li><strong>Calendar:</strong> ${
                      calendarEventId
                        ? 'You should receive a calendar invitation shortly with meeting details and Google Meet link.'
                        : 'Please add this meeting to your calendar manually.'
                    }</li>
                    <li><strong>Preparation:</strong> Feel free to send any materials, documents, or specific questions beforehand by replying to this email.</li>
                    <li><strong>Platform:</strong> We'll use Google Meet for the video call (link will be provided).</li>
                    <li><strong>Rescheduling:</strong> Need to change the time? Just reply to this email at least 2 hours before the meeting.</li>
                    <li><strong>Questions:</strong> If you have any questions, don't hesitate to reach out!</li>
                  </ul>
                </div>

                <div class="highlight">
                  <p><strong>📞 Meeting Details Summary:</strong><br>
                  <strong>${formattedDate}</strong> at <strong>${time}</strong><br>
                  Duration: 30 minutes | Type: ${meetingLabel}</p>
                </div>

                <p>Looking forward to our meeting and discussing your project!</p>
                <p>Best regards,<br><strong>Ganesh Adimalupu</strong><br>
                <em>Machine Learning Engineer & AI Solutions Developer</em></p>
              </div>
              <div class="footer">
                <p>📧 ganeshadimalupu@disroot.org | 💼 linkedin.com/in/GaneshAdimalupu<br>
                This is an automated confirmation email | Booking ID: ${bookingId}</p>
              </div>
            </div>
          </body>
        </html>`,
    },
    admin: {
      subject: `📅 New Meeting Booked: ${name} - ${formattedDate}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <title>New Meeting Booking Alert</title>
            <style>
              body { font-family: 'Courier New', monospace; background: #f8f9fa; margin: 0; padding: 2rem; }
              .container { max-width: 700px; margin: 0 auto; background: white; padding: 2rem; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
              .header { background: #28a745; color: white; padding: 1.5rem; border-radius: 8px; margin-bottom: 2rem; text-align: center; }
              .section { margin: 2rem 0; }
              .data-table { width: 100%; border-collapse: collapse; margin: 1rem 0; }
              .data-table th, .data-table td { padding: 0.8rem; text-align: left; border-bottom: 1px solid #dee2e6; }
              .data-table th { background: #f8f9fa; font-weight: 600; }
              .debug-section { background: #fff3cd; padding: 1rem; border-radius: 8px; margin: 1rem 0; border: 1px solid #ffeaa7; }
              .status-ok { color: #28a745; }
              .status-warning { color: #856404; }
              .highlight { background: #e3f2fd; padding: 0.5rem; border-radius: 4px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h2>📅 New Meeting Booking Alert</h2>
                <p>A new consultation has been scheduled through your portfolio website</p>
              </div>

              <div class="section">
                <h3>👤 Client Information</h3>
                <table class="data-table">
                  <tr><th>Client Name</th><td>${name}</td></tr>
                  <tr><th>Email</th><td><a href="mailto:${email}">${email}</a></td></tr>
                  <tr><th>Phone</th><td>${phone || 'Not provided'}</td></tr>
                  <tr><th>Company</th><td>${company || 'Not provided'}</td></tr>
                </table>
              </div>

              <div class="section">
                <h3>📅 Meeting Information</h3>
                <table class="data-table">
                  <tr><th>Meeting Type</th><td>${meetingLabel}</td></tr>
                  <tr><th>Date</th><td class="highlight"><strong>${formattedDate}</strong></td></tr>
                  <tr><th>Time</th><td>${time} (${timezone})</td></tr>
                  <tr><th>Duration</th><td>30 minutes</td></tr>
                  <tr><th>Booking ID</th><td>${bookingId}</td></tr>
                </table>
              </div>

              ${
                message
                  ? `
              <div class="section">
                <h3>💬 Client Message</h3>
                <div style="background: #f8f9fa; padding: 1rem; border-radius: 8px; border-left: 4px solid #00CDFE;">
                  <p style="margin: 0; white-space: pre-wrap;">"${message}"</p>
                </div>
              </div>
              `
                  : ''
              }

              <div class="section">
                <h3>🔧 System Status</h3>
                <table class="data-table">
                  <tr><th>Calendar Event</th><td class="${
                    calendarEventId ? 'status-ok' : 'status-warning'
                  }">${calendarEventId || 'Failed to create'}</td></tr>
                  <tr><th>Email Notifications</th><td class="status-ok">✅ Sent to client</td></tr>
                  <tr><th>Database</th><td class="status-ok">✅ Booking saved</td></tr>
                  <tr><th>Timestamp</th><td>${new Date().toISOString()}</td></tr>
                </table>
              </div>

              <div class="debug-section">
                <h4>🔍 Debug Information</h4>
                <p><strong>Original Date Input:</strong> <code>${date}</code></p>
                <p><strong>Processed Date:</strong> <strong>${formattedDate}</strong></p>
                <p><strong>Time Zone:</strong> ${timezone}</p>
                <p><strong>Meeting Type:</strong> ${meetingType}</p>
                <p><strong>Calendar Event ID:</strong> ${
                  calendarEventId || 'None'
                }</p>
              </div>

              <div class="section">
                <h3>⚡ Quick Actions</h3>
                <p>• Add to your personal calendar if not automated</p>
                <p>• Prepare any materials or questions for the consultation</p>
                <p>• Reply to client email: <a href="mailto:${email}?subject=Re: Meeting Confirmation - ${formattedDate}">${email}</a></p>
              </div>

              <div style="margin-top: 2rem; padding-top: 1rem; border-top: 1px solid #dee2e6; text-align: center; color: #6c757d; font-size: 0.9rem;">
                <p>This notification was automatically generated by your portfolio booking system.<br>
                Booking ID: ${bookingId} | Generated: ${new Date().toLocaleString()}</p>
              </div>
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

  console.log('📧 Sending meeting confirmation emails for:', {
    name,
    email,
    date,
    time,
    bookingId: bookingDetails.bookingId,
  });

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

    console.log('✅ Meeting confirmation emails sent successfully');
    return { status: 'success', message: 'Confirmation emails sent' };
  } catch (error) {
    console.error(
      `❌ Failed to send meeting confirmation emails: ${error.message}`
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
                <p><strong>Phone:</strong> ${data.phone || 'Not provided'}</p>
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
