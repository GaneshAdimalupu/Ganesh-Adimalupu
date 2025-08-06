// services/googleCalendarService.js - ENHANCED VERSION
const { google } = require('googleapis');

// Enhanced environment variable checking
const requiredEnvVars = [
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET',
  'GOOGLE_REDIRECT_URI',
  'GOOGLE_REFRESH_TOKEN',
  'CALENDAR_ID'
];

const envStatus = {};
requiredEnvVars.forEach(varName => {
  const value = process.env[varName];
  envStatus[varName] = !!value;

});

// Check if all required variables are present
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
if (missingVars.length > 0) {

}

// Initialize OAuth2 client with enhanced error handling
let oAuth2Client = null;
let calendar = null;

try {

  oAuth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );

  if (process.env.GOOGLE_REFRESH_TOKEN) {
    oAuth2Client.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });

  } else {

  }

  calendar = google.calendar({ version: 'v3', auth: oAuth2Client });

} catch (error) {

}

// Enhanced time conversion with better error handling and timezone support
const getDateTimeForCalendar = (date, time, timezone) => {

  try {
    // Parse time with enhanced validation
    const timeMatch = time.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    if (!timeMatch) {
      throw new Error(`Invalid time format: ${time}. Expected format: HH:MM AM/PM`);
    }

    let [, hours, minutes, ampm] = timeMatch;
    hours = parseInt(hours);
    minutes = parseInt(minutes);

    // Validate time components
    if (hours < 1 || hours > 12) {
      throw new Error(`Invalid hours: ${hours}. Must be 1-12`);
    }
    if (minutes < 0 || minutes > 59) {
      throw new Error(`Invalid minutes: ${minutes}. Must be 0-59`);
    }

    // Convert to 24-hour format
    if (ampm.toUpperCase() === 'PM' && hours < 12) {
      hours += 12;
    }
    if (ampm.toUpperCase() === 'AM' && hours === 12) {
      hours = 0;
    }

    // Enhanced timezone handling
    let timeZoneOffset;
    switch (timezone) {
      case 'UTC+05:30':
        timeZoneOffset = '+05:30';
        break;
      case 'UTC+00:00':
        timeZoneOffset = '+00:00';
        break;
      case 'UTC-05:00':
        timeZoneOffset = '-05:00';
        break;
      case 'UTC-08:00':
        timeZoneOffset = '-08:00';
        break;
      default:

        timeZoneOffset = '+05:30';
    }

    // Create ISO datetime string
    const dateTimeString = `${date}T${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00.000${timeZoneOffset}`;
    const startDateTime = new Date(dateTimeString);

    // Validate the created date
    if (isNaN(startDateTime.getTime())) {
      throw new Error(`Invalid date created: ${dateTimeString}`);
    }

    return { startDateTime, timeZoneOffset };

  } catch (error) {

    throw new Error(`Time conversion failed: ${error.message}`);
  }
};

// Enhanced calendar event creation with comprehensive error handling
exports.createCalendarEvent = async (bookingDetails) => {

  try {
    // Validate calendar service availability
    if (!calendar || !oAuth2Client) {
      throw new Error('Google Calendar service not properly initialized');
    }

    if (missingVars.length > 0) {
      throw new Error(`Missing environment variables: ${missingVars.join(', ')}`);
    }

    // Extract and validate booking details
    const { name, email, phone, company, message, date, time, timezone, meetingType } = bookingDetails;

    const requiredFields = { name, email, date, time, meetingType };
    const missingFields = Object.entries(requiredFields)
      .filter(([key, value]) => !value)
      .map(([key]) => key);

    if (missingFields.length > 0) {
      throw new Error(`Missing required booking fields: ${missingFields.join(', ')}`);
    }

    // Enhanced meeting duration mapping

    const meetingDurations = {
      'consultation': 30,
      'project-discussion': 45,
      'technical-review': 60,
      'follow-up': 15
    };

    const duration = meetingDurations[meetingType];
    if (!duration) {

    }
    const finalDuration = duration || 30;

    // Enhanced datetime conversion

    const { startDateTime, timeZoneOffset } = getDateTimeForCalendar(date, time, timezone);
    const endDateTime = new Date(startDateTime.getTime() + finalDuration * 60000);

    // Enhanced meeting type labels
    const meetingTypeLabels = {
      'consultation': 'Free Consultation',
      'project-discussion': 'Project Discussion',
      'technical-review': 'Technical Review',
      'follow-up': 'Follow-up Meeting'
    };

    const meetingLabel = meetingTypeLabels[meetingType] || meetingType.replace('-', ' ');

    // Enhanced event description with better formatting
    const eventDescription = `
📅 Meeting Details:
• Type: ${meetingLabel} (${finalDuration} minutes)
• Client: ${name}
• Email: ${email}
• Phone: ${phone || 'Not provided'}
• Company: ${company || 'Not provided'}

📝 Client Message:
${message || 'No specific message provided'}

🔗 Booking Info:
• Date: ${new Date(date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
• Time: ${time} (${timezone})
• Booking System: Portfolio Website

⚙️ Generated automatically by booking system
    `.trim();

    const event = {
      summary: `${meetingLabel}: ${name}${company ? ` (${company})` : ''}`,
      description: eventDescription,
      start: {
        dateTime: startDateTime.toISOString(),
        timeZone: timezone === 'UTC+05:30' ? 'Asia/Kolkata' : 'UTC',
      },
      end: {
        dateTime: endDateTime.toISOString(),
        timeZone: timezone === 'UTC+05:30' ? 'Asia/Kolkata' : 'UTC',
      },
      attendees: [
        { email, displayName: name, responseStatus: 'needsAction' }
      ],
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 }, // 1 day before
          { method: 'email', minutes: 60 },      // 1 hour before
          { method: 'popup', minutes: 30 },      // 30 minutes before
          { method: 'popup', minutes: 10 },      // 10 minutes before
        ],
      },
      conferenceData: {
        createRequest: {
          requestId: `meeting-${Date.now()}`,
          conferenceSolutionKey: { type: 'hangoutsMeet' }
        }
      },
      guestsCanModify: false,
      guestsCanInviteOthers: false,
      guestsCanSeeOtherGuests: false,
      transparency: 'opaque',
      visibility: 'private'
    };

    try {
      const credentials = await oAuth2Client.getAccessToken();

      if (credentials.token) {

      }
    } catch (authError) {

      throw new Error(`Google Calendar authentication failed: ${authError.message}`);
    }

    const createdEvent = await calendar.events.insert({
      calendarId: process.env.CALENDAR_ID,
      resource: event,
      sendNotifications: true,
      conferenceDataVersion: 1, // Enable Google Meet
    });

    if (createdEvent.data.conferenceData?.entryPoints) {

    }

    // Return enhanced response
    return {
      eventId: createdEvent.data.id,
      htmlLink: createdEvent.data.htmlLink,
      meetLink: createdEvent.data.conferenceData?.entryPoints?.[0]?.uri,
      status: createdEvent.data.status,
      created: createdEvent.data.created
    };

  } catch (error) {

    // Enhanced error categorization
    if (error.message.includes('authentication') || error.message.includes('credentials')) {

    } else if (error.message.includes('calendar') || error.message.includes('not found')) {

    } else if (error.message.includes('quota') || error.message.includes('limit')) {

    }

    if (error.response) {

    }

    throw new Error(`Enhanced Google Calendar integration failed: ${error.message}`);
  }
};

// Enhanced calendar service health check
exports.testCalendarService = async () => {

  try {
    if (!calendar || !oAuth2Client) {
      throw new Error('Calendar service not initialized');
    }

    // Test authentication
    await oAuth2Client.getAccessToken();

    // Test calendar access
    const calendarInfo = await calendar.calendars.get({
      calendarId: process.env.CALENDAR_ID
    });

    return {
      success: true,
      calendar: calendarInfo.data.summary,
      accessRole: calendarInfo.data.accessRole
    };

  } catch (error) {

    return { success: false, error: error.message };
  }
};

// Enhanced configuration validator
exports.validateCalendarConfig = () => {
  const config = {
    clientId: !!process.env.GOOGLE_CLIENT_ID,
    clientSecret: !!process.env.GOOGLE_CLIENT_SECRET,
    redirectUri: !!process.env.GOOGLE_REDIRECT_URI,
    refreshToken: !!process.env.GOOGLE_REFRESH_TOKEN,
    calendarId: !!process.env.CALENDAR_ID,
    oAuthReady: !!oAuth2Client,
    calendarReady: !!calendar
  };

  Object.entries(config).forEach(([key, value]) => {

  });

  return config;
};
