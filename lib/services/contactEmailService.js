// services/contactEmailService.js - CONTACT EMAIL SERVICE FOR EXPRESS
const nodemailer = require('nodemailer');

console.log('📧 Initializing Contact Email Service...');

// Check email environment variables
console.log('🔍 Checking contact email environment variables:');
console.log(`   EMAIL_USER: ${process.env.EMAIL_USER ? '✅ Set' : '❌ Missing'} ${process.env.EMAIL_USER || ''}`);
console.log(`   EMAIL_PASS: ${process.env.EMAIL_PASS ? '✅ Set' : '❌ Missing'} ${process.env.EMAIL_PASS ? '(App Password)' : ''}`);

let transporter = null;

try {
  console.log('🔧 Creating contact email transporter...');
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
  console.log('✅ Contact email transporter created successfully');
} catch (error) {
  console.error('❌ Failed to create contact email transporter:');
  console.error('   Error:', error.message);
}

// Enhanced email templates for contact form
const getContactEmailTemplate = (type, data) => {
  const { name, email, subject, message, messageType, priority, contactId, phone, company } = data;

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

  switch (type) {
    case 'auto_reply':
      return {
        subject: `✅ Message Received: ${subject || 'Your inquiry'}`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Message Received</title>
            <style>
              body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #0D0D0D; color: #f0e6f0; }
              .container { max-width: 600px; margin: 0 auto; background: linear-gradient(145deg, #1a0f23 0%, #0D0D0D 100%); }
              .header { background: linear-gradient(135deg, #F72585 0%, #7209B7 100%); color: white; padding: 2rem; text-align: center; }
              .content { padding: 2rem; }
              .message-details { background: rgba(247, 37, 133, 0.1); padding: 1.5rem; border-radius: 10px; margin: 1.5rem 0; border: 1px solid rgba(247, 37, 133, 0.2); }
              .detail-row { display: flex; justify-content: space-between; margin: 0.8rem 0; }
              .detail-label { font-weight: 600; color: #a89db2; }
              .detail-value { color: #f0e6f0; }
              .status-badge { display: inline-block; padding: 0.3rem 0.8rem; border-radius: 20px; font-size: 0.8rem; font-weight: 600; }
              .priority-${priority} { background: ${priority === 'urgent' ? '#F72585' : priority === 'high' ? '#7209B7' : priority === 'medium' ? '#4CC9F0' : '#28a745'}; color: white; }
              .footer { background: rgba(255,255,255,0.03); padding: 1.5rem; text-align: center; color: #a89db2; font-size: 0.9rem; }
              .divider { height: 1px; background: rgba(247, 37, 133, 0.2); margin: 1.5rem 0; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🎉 Message Received!</h1>
                <p>Thank you for reaching out. I'll get back to you soon!</p>
              </div>

              <div class="content">
                <h2>Hello ${name},</h2>
                <p>Thank you for your message! I've received your inquiry and will review it shortly.</p>

                <div class="message-details">
                  <h3>📝 Your Message Details</h3>
                  <div class="detail-row">
                    <span class="detail-label">Subject:</span>
                    <span class="detail-value">${subject || 'No subject provided'}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">Message Type:</span>
                    <span class="detail-value">${typeLabel}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">Priority:</span>
                    <span class="status-badge priority-${priority}">${priorityLabel}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">Reference ID:</span>
                    <span class="detail-value">${contactId}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">Submitted:</span>
                    <span class="detail-value">${new Date().toLocaleString()}</span>
                  </div>
                </div>

                <div class="divider"></div>

                <h3>⏱️ What's Next?</h3>
                <ul style="color: #a89db2; line-height: 1.8;">
                  <li><strong>Response Time:</strong> I typically respond within 24-48 hours</li>
                  <li><strong>Priority Messages:</strong> Urgent inquiries are prioritized</li>
                  <li><strong>Project Discussions:</strong> I'll schedule a call if needed</li>
                  <li><strong>Follow-up:</strong> Feel free to add more details by replying</li>
                </ul>

                <div class="divider"></div>

                <p><strong>Best regards,</strong></p>
                <p><strong>Ganesh Adimalupu</strong><br>Machine Learning Engineer & AI Solutions Developer</p>
              </div>

              <div class="footer">
                <p>📧 Email: ganeshadimalupu@disroot.org</p>
                <p>💼 LinkedIn: linkedin.com/in/GaneshAdimalupu</p>
                <p>🌐 Portfolio: Your Portfolio Website</p>
                <div style="margin-top: 1rem; font-size: 0.8rem; color: #666;">
                  This is an automated confirmation. Message ID: ${contactId}
                </div>
              </div>
            </div>
          </body>
          </html>
        `
      };

    case 'admin_notification':
      return {
        subject: `📧 New Contact Message: ${name} - ${priorityLabel} Priority`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <title>New Contact Message</title>
            <style>
              body { font-family: monospace; background: #0D0D0D; color: #f0e6f0; margin: 0; padding: 2rem; }
              .container { max-width: 700px; margin: 0 auto; background: #1a0f23; padding: 2rem; border-radius: 10px; border: 1px solid #F72585; }
              .header { background: linear-gradient(135deg, #F72585 0%, #7209B7 100%); color: white; padding: 1.5rem; border-radius: 5px; margin-bottom: 2rem; }
              .data-table { width: 100%; border-collapse: collapse; margin: 1rem 0; }
              .data-table th, .data-table td { padding: 0.8rem; text-align: left; border-bottom: 1px solid rgba(247, 37, 133, 0.2); }
              .data-table th { background: rgba(247, 37, 133, 0.1); font-weight: 600; color: #F72585; }
              .data-table td { color: #f0e6f0; }
              .message-content { background: rgba(76, 201, 240, 0.1); padding: 1.5rem; border-radius: 8px; margin: 1.5rem 0; border-left: 4px solid #4CC9F0; }
              .priority-badge { padding: 0.3rem 0.8rem; border-radius: 15px; font-size: 0.8rem; font-weight: 600; }
              .priority-urgent { background: #F72585; color: white; }
              .priority-high { background: #7209B7; color: white; }
              .priority-medium { background: #4CC9F0; color: white; }
              .priority-low { background: #28a745; color: white; }
              .spam-warning { background: rgba(255, 193, 7, 0.1); border: 1px solid #ffc107; color: #ffc107; padding: 1rem; border-radius: 5px; margin: 1rem 0; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h2>📧 New Contact Message Alert</h2>
                <p>A new message has been received through your portfolio contact form</p>
              </div>

              <table class="data-table">
                <tr><th>From</th><td>${name} &lt;${email}&gt;</td></tr>
                <tr><th>Subject</th><td>${subject || 'No subject provided'}</td></tr>
                <tr><th>Phone</th><td>${phone || 'Not provided'}</td></tr>
                <tr><th>Company</th><td>${company || 'Not provided'}</td></tr>
                <tr><th>Message Type</th><td>${typeLabel}</td></tr>
                <tr><th>Priority</th><td><span class="priority-badge priority-${priority}">${priorityLabel}</span></td></tr>
                <tr><th>Contact ID</th><td>${contactId}</td></tr>
                <tr><th>IP Address</th><td>${data.ipAddress || 'Not captured'}</td></tr>
                <tr><th>User Agent</th><td>${data.userAgent ? data.userAgent.substring(0, 50) + '...' : 'Not captured'}</td></tr>
              </table>

              ${data.isSpam ? `
                <div class="spam-warning">
                  ⚠️ <strong>Potential Spam Detected:</strong> This message has been flagged by the spam detection system. Please review carefully.
                </div>
              ` : ''}

              <div class="message-content">
                <h3>📝 Message Content:</h3>
                <p style="white-space: pre-wrap; line-height: 1.6;">${message}</p>
              </div>

              <div style="margin-top: 2rem; padding: 1rem; background: rgba(255,255,255,0.03); border-radius: 5px;">
                <strong>⏰ Submitted:</strong> ${new Date().toISOString()}<br>
                <strong>🔗 Quick Actions:</strong>
                <a href="mailto:${email}?subject=Re: ${subject || 'Your inquiry'}" style="color: #4CC9F0;">Reply</a> |
                <a href="http://localhost:5000/api/contact/messages" style="color: #4CC9F0;">View in Admin</a>
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

// Enhanced contact form email function
exports.sendContactFormEmails = async function(contactDetails) {
  console.log('\n📧 SEND CONTACT FORM EMAILS');
  console.log('📋 Contact details:', JSON.stringify({
    name: contactDetails.name,
    email: contactDetails.email,
    subject: contactDetails.subject,
    messageLength: contactDetails.message?.length,
    priority: contactDetails.priority
  }, null, 2));

  try {
    if (!transporter) {
      throw new Error('Email transporter not initialized - check EMAIL_USER and EMAIL_PASS environment variables');
    }

    console.log('\n🔍 Validating contact form data...');
    const { name, email, message, contactId } = contactDetails;

    if (!name || !email || !message) {
      throw new Error('Missing required contact form data: name, email, or message');
    }

    if (!contactId) {
      console.log('⚠️ No contact ID provided, generating temporary ID');
      contactDetails.contactId = `CONTACT-${Date.now()}`;
    }

    console.log('✅ All required contact form fields present');

    console.log('\n🔗 Verifying SMTP connection...');
    try {
      await transporter.verify();
      console.log('✅ SMTP connection verified successfully');
    } catch (verifyError) {
      console.error('⚠️ SMTP verification failed:', verifyError.message);
      console.log('⏭️ Continuing with email send attempt...');
    }

    console.log('\n✍️ Generating contact form email templates...');

    // Generate auto-reply email for the contact
    const autoReplyTemplate = getContactEmailTemplate('auto_reply', contactDetails);

    const contactMailOptions = {
      from: `"Ganesh Adimalupu - Portfolio" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: autoReplyTemplate.subject,
      html: autoReplyTemplate.html,
    };

    console.log('📧 Auto-reply email prepared:');
    console.log(`   To: ${contactMailOptions.to}`);
    console.log(`   Subject: ${contactMailOptions.subject}`);

    console.log('\n📤 Sending auto-reply email to contact...');
    const contactEmailResult = await transporter.sendMail(contactMailOptions);

    console.log('✅ Auto-reply email sent successfully!');
    console.log(`   Message ID: ${contactEmailResult.messageId}`);
    console.log(`   Response: ${contactEmailResult.response}`);

    // Send admin notification email (to yourself)
    console.log('\n📤 Sending admin notification...');
    const adminTemplate = getContactEmailTemplate('admin_notification', contactDetails);

    const adminMailOptions = {
      from: `"Portfolio Contact Form" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER, // Send to yourself
      subject: adminTemplate.subject,
      html: adminTemplate.html,
    };

    const adminEmailResult = await transporter.sendMail(adminMailOptions);
    console.log('✅ Admin notification sent successfully!');
    console.log(`   Admin Message ID: ${adminEmailResult.messageId}`);

    console.log('\n🎉 ALL CONTACT FORM EMAILS SENT SUCCESSFULLY');

    return {
      autoReply: {
        messageId: contactEmailResult.messageId,
        response: contactEmailResult.response,
        accepted: contactEmailResult.accepted,
        rejected: contactEmailResult.rejected
      },
      adminNotification: {
        messageId: adminEmailResult.messageId,
        response: adminEmailResult.response
      }
    };

  } catch (error) {
    console.error('\n🚨 CONTACT FORM EMAIL SENDING FAILED');
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

    console.error('📋 Failed contact details:', JSON.stringify(contactDetails, null, 2));

    throw new Error(`Contact form email sending failed: ${error.message}`);
  }
};

// Enhanced email test function for contact form
exports.testContactEmailService = async function() {
  console.log('\n🧪 TESTING CONTACT EMAIL SERVICE');

  try {
    if (!transporter) {
      throw new Error('Contact email transporter not available');
    }

    await transporter.verify();
    console.log('✅ Contact email service test passed');
    return { success: true, message: 'Contact email service is working' };

  } catch (error) {
    console.error('❌ Contact email service test failed:', error.message);
    return { success: false, error: error.message };
  }
};

// Helper function to validate contact email configuration
exports.validateContactEmailConfig = function() {
  const config = {
    emailUser: !!process.env.EMAIL_USER,
    emailPass: !!process.env.EMAIL_PASS,
    transporterReady: !!transporter
  };

  console.log('📧 Contact Email Configuration Status:');
  console.log(`   EMAIL_USER: ${config.emailUser ? '✅' : '❌'}`);
  console.log(`   EMAIL_PASS: ${config.emailPass ? '✅' : '❌'}`);
  console.log(`   Transporter: ${config.transporterReady ? '✅' : '❌'}`);

  return config;
};

console.log('📧 Contact Email Service initialized');
console.log('✨ Features: Auto-reply, Admin notifications, Spam detection, Priority handling, Error handling');
