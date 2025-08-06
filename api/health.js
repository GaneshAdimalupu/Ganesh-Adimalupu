// api/health.js
const connectDB = require('../lib/db/mongodb');

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  let mongoStatus = 'Disconnected';

  try {
    await connectDB();
    mongoStatus = 'Connected';
  } catch (error) {
    mongoStatus = 'Failed: ' + error.message;
  }

  res.json({
    status: 'OK',
    message: 'Enhanced Vercel server is running!',
    features: ['Database', 'Google Calendar', 'Email Notifications'],
    timestamp: new Date().toISOString(),
    environment: 'production',
    mongodb: mongoStatus,
  });
};
