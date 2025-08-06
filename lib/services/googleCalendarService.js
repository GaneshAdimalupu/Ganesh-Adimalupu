// services/googleCalendarService.js - ENHANCED VERSION
const { google } = require('googleapis');

console.log('📅 Initializing Enhanced Google Calendar Service...');

// Enhanced environment variable checking
const requiredEnvVars = [
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET',
  'GOOGLE_REDIRECT_URI',
  'GOOGLE_REFRESH_TOKEN',
  'CALENDAR_ID'
];

console.log('🔍 Checking Google Calendar environment variables:');
const envStatus = {};
requiredEnvVars.forEach(varName => {
  const value = process.env[varName];
  envStatus[varName] = !!value;
  console.log(`   ${varName}: ${value ? '✅ Set' : '❌ Missing'} ${value ? `(${value.length} chars)` : ''}`);
});

// Check if all required variables are present
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
if (missingVars.length > 0) {
  console.error('❌ Missing required environment variables:', missingVars);
  console.error('💡 Please ensure your .env file contains all Google Calendar credentials');
}

// Initialize OAuth2 client with enhanced error handling
let oAuth2Client = null;
let calendar = null;

try {
  console.log('🔑 Creating OAuth2 client...');
  oAuth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );
  console.log('✅ OAuth2 client created successfully');

  if (process.env.GOOGLE_REFRESH_TOKEN) {
    oAuth2Client.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });
    console.log('✅ Refresh token configured');
  } else {
    console.error('❌ No refresh token available');
  }

  calendar = google.calendar({ version: 'v3', auth: oAuth2Client });
  console.log('📅 Google Calendar API client initialized');

} catch (error) {
  console.error('❌ Failed to initialize Google Calendar service:');
  console.error('   Error:', error.message);
  console.error('💡 Check your Google Cloud Console configuration');
}

// Enhanced time conversion with better error handling and timezone support
const getDateTimeForCalendar = (date, time, timezone) => {
  console.log('\n🕐 Enhanced time conversion:');
  console.log(`   Input - Date: ${date}, Time: ${time}, Timezone: ${timezone}`);

  try {
    // Parse time with enhanced validation
    const timeMatch = time.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    if (!timeMatch) {
      throw new Error(`Invalid time format: ${time}. Expected format: HH:MM AM/PM`);
    }

    let [, hours, minutes, ampm] = timeMatch;
    hours = parseInt(hours);
    minutes = parseInt(minutes);

    console.log(`   Parsed - Hours: ${hours}, Minutes: ${minutes}, AM/PM: ${ampm}`);

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

    console.log(`   Converted to 24-hour - Hours: ${hours}, Minutes: ${minutes}`);

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
        console.log(`⚠️ Unknown timezone ${timezone}, defaulting to IST`);
        timeZoneOffset = '+05:30';
    }

    console.log(`   Using timezone offset: ${timeZoneOffset}`);

    // Create ISO datetime string
    const dateTimeString = `${date}T${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00.000${timeZoneOffset}`;
    const startDateTime = new Date(dateTimeString);

    // Validate the created date
    if (isNaN(startDateTime.getTime())) {
      throw new Error(`Invalid date created: ${dateTimeString}`);
    }

    console.log(`   Final ISO string: ${dateTimeString}`);
    console.log(`   Final start time: ${startDateTime.toISOString()}`);
    console.log(`   Local representation: ${startDateTime.toString()}`);

    return { startDateTime, timeZoneOffset };

  } catch (error) {
    console.error('❌ Enhanced time conversion failed:');
    console.error('   Input date:', date);
    console.error('   Input time:', time);
    console.error('   Input timezone:', timezone);
    console.error('   Error:', error.message);
    throw new Error(`Time conversion failed: ${error.message}`);
  }
};

// Enhanced calendar event creation with comprehensive error handling
exports.createCalendarEvent = async (bookingDetails) => {
  console.log('\n📅 CREATE ENHANCED CALENDAR EVENT');
  console.log('=' * 50);
  console.log('📋 Booking details:', JSON.stringify(bookingDetails, null, 2));

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

    console.log('\n🔍 Validating booking details...');
    const requiredFields = { name, email, date, time, meetingType };
    const missingFields = Object.entries(requiredFields)
      .filter(([key, value]) => !value)
      .map(([key]) => key);

    if (missingFields.length > 0) {
      throw new Error(`Missing required booking fields: ${missingFields.join(', ')}`);
    }
    console.log('✅ All required booking fields present');

    // Enhanced meeting duration mapping
    console.log('\n⏱️ Determining meeting duration...');
    const meetingDurations = {
      'consultation': 30,
      'project-discussion': 45,
      'technical-review': 60,
      'follow-up': 15
    };

    const duration = meetingDurations[meetingType];
    if (!duration) {
      console.log(`⚠️ Unknown meeting type: ${meetingType}, defaulting to 30 minutes`);
    }
    const finalDuration = duration || 30;

    console.log(`   Meeting type: ${meetingType}`);
    console.log(`   Duration: ${finalDuration} minutes`);

    // Enhanced datetime conversion
    console.log('\n🕐 Converting datetime...');
    const { startDateTime, timeZoneOffset } = getDateTimeForCalendar(date, time, timezone);
    const endDateTime = new Date(startDateTime.getTime() + finalDuration * 60000);

    console.log(`   Start: ${startDateTime.toISOString()}`);
    console.log(`   End: ${endDateTime.toISOString()}`);
    console.log(`   Duration: ${finalDuration} minutes`);

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

    console.log('\n📝 Building enhanced calendar event...');
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

    console.log('📋 Enhanced event object:');
    console.log(`   Summary: ${event.summary}`);
    console.log(`   Start: ${event.start.dateTime} (${event.start.timeZone})`);
    console.log(`   End: ${event.end.dateTime} (${event.end.timeZone})`);
    console.log(`   Attendees: ${event.attendees.length}`);
    console.log(`   Reminders: ${event.reminders.overrides.length}`);

    console.log('\n🔗 Checking authentication...');
    try {
      const credentials = await oAuth2Client.getAccessToken();
      console.log('✅ Authentication successful');
      console.log(`   Token type: ${credentials.token ? 'Valid' : 'Invalid'}`);

      if (credentials.token) {
        console.log(`   Token preview: ${credentials.token.substring(0, 20)}...`);
      }
    } catch (authError) {
      console.error('❌ Authentication failed:');
      console.error('   Error:', authError.message);
      throw new Error(`Google Calendar authentication failed: ${authError.message}`);
    }

    console.log('\n📅 Creating calendar event...');
    console.log(`   Calendar ID: ${process.env.CALENDAR_ID}`);
    console.log('   Conference data: Google Meet enabled');
    console.log('   Send notifications: true');

    const createdEvent = await calendar.events.insert({
      calendarId: process.env.CALENDAR_ID,
      resource: event,
      sendNotifications: true,
      conferenceDataVersion: 1, // Enable Google Meet
    });

    console.log('\n🎉 ENHANCED CALENDAR EVENT CREATED SUCCESSFULLY!');
    console.log('   Event ID:', createdEvent.data.id);
    console.log('   Event link:', createdEvent.data.htmlLink);
    console.log('   Status:', createdEvent.data.status);
    console.log('   Creator:', createdEvent.data.creator?.email);
    console.log('   Organizer:', createdEvent.data.organizer?.email);

    if (createdEvent.data.conferenceData?.entryPoints) {
      console.log('   Google Meet:', createdEvent.data.conferenceData.entryPoints[0]?.uri);
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
    console.error('\n🚨 ENHANCED CALENDAR EVENT CREATION FAILED');
    console.error('=' * 50);
    console.error('⏰ Time:', new Date().toISOString());
    console.error('🔥 Error type:', error.constructor.name);
    console.error('💬 Error message:', error.message);
    console.error('📚 Stack trace:', error.stack);

    // Enhanced error categorization
    if (error.message.includes('authentication') || error.message.includes('credentials')) {
      console.error('🔐 AUTHENTICATION ERROR');
      console.error('💡 Possible solutions:');
      console.error('   • Check GOOGLE_REFRESH_TOKEN validity');
      console.error('   • Verify GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET');
      console.error('   • Ensure OAuth2 consent screen is configured');
    } else if (error.message.includes('calendar') || error.message.includes('not found')) {
      console.error('📅 CALENDAR ACCESS ERROR');
      console.error('💡 Possible solutions:');
      console.error('   • Check CALENDAR_ID is correct');
      console.error('   • Verify calendar sharing permissions');
      console.error('   • Ensure Calendar API is enabled');
    } else if (error.message.includes('quota') || error.message.includes('limit')) {
      console.error('⚡ API QUOTA ERROR');
      console.error('💡 Possible solutions:');
      console.error('   • Check Google Cloud Console quotas');
      console.error('   • Wait for quota reset');
      console.error('   • Implement request throttling');
    }

    if (error.response) {
      console.error('🌐 HTTP Response details:');
      console.error('   Status:', error.response.status);
      console.error('   Status Text:', error.response.statusText);
      console.error('   Headers:', error.response.headers);
      console.error('   Data:', error.response.data);
    }

    console.error('📋 Failed booking details:', JSON.stringify(bookingDetails, null, 2));

    throw new Error(`Enhanced Google Calendar integration failed: ${error.message}`);
  }
};

// Enhanced calendar service health check
exports.testCalendarService = async () => {
  console.log('\n🧪 TESTING GOOGLE CALENDAR SERVICE');

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

    console.log('✅ Calendar service test passed');
    console.log(`   Calendar: ${calendarInfo.data.summary}`);
    console.log(`   Access Role: ${calendarInfo.data.accessRole}`);

    return {
      success: true,
      calendar: calendarInfo.data.summary,
      accessRole: calendarInfo.data.accessRole
    };

  } catch (error) {
    console.error('❌ Calendar service test failed:', error.message);
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

  console.log('📅 Calendar Configuration Status:');
  Object.entries(config).forEach(([key, value]) => {
    console.log(`   ${key}: ${value ? '✅' : '❌'}`);
  });

  return config;
};

console.log('📅 Enhanced Google Calendar Service initialized');
console.log('✨ Features: Google Meet integration, Enhanced error handling, Multiple reminders, Detailed logging');
