// api/contact/stats.js - CONTACT FORM STATISTICS ENDPOINT
import mongoose from 'mongoose';

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
    console.log('✅ MongoDB connected successfully');
    return mongoose.connection;
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    isConnected = false;
    throw error;
  }
}

// Contact Message Model Schema (same as other endpoints)
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
  isSpam: { type: Boolean, default: false },
  readAt: { type: Date, default: null },
  repliedAt: { type: Date, default: null }
}, {
  timestamps: true
});

// Export model safely for serverless
const ContactMessage = mongoose.models.ContactMessage || mongoose.model('ContactMessage', contactMessageSchema);

// MAIN SERVERLESS FUNCTION
export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({
      error: 'Method not allowed',
      allowedMethods: ['GET'],
      received: req.method
    });
  }

  try {
    console.log('📊 Generating contact form statistics');
    await connectDB();

    const { timeframe = '30d' } = req.query;

    // Calculate date range based on timeframe
    const now = new Date();
    let startDate;

    switch (timeframe) {
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case '1y':
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      case 'all':
        startDate = new Date('2020-01-01'); // Far back date
        break;
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    // Base query (exclude spam for main stats)
    const baseQuery = {
      createdAt: { $gte: startDate },
      isSpam: { $ne: true }
    };

    // Execute all aggregation queries in parallel
    const [
      totalStats,
      statusBreakdown,
      priorityBreakdown,
      messageTypeBreakdown,
      sourceBreakdown,
      dailyTrend,
      responseTimeStats,
      topCompanies,
      recentActivity,
      spamStats
    ] = await Promise.all([
      // Total statistics
      ContactMessage.aggregate([
        { $match: baseQuery },
        {
          $group: {
            _id: null,
            totalMessages: { $sum: 1 },
            avgMessageLength: { $avg: { $strLenCP: '$message' } },
            uniqueContacts: { $addToSet: '$email' }
          }
        },
        {
          $project: {
            totalMessages: 1,
            avgMessageLength: { $round: ['$avgMessageLength', 0] },
            uniqueContacts: { $size: '$uniqueContacts' }
          }
        }
      ]),

      // Status breakdown
      ContactMessage.aggregate([
        { $match: baseQuery },
        { $group: { _id: '$status', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]),

      // Priority breakdown
      ContactMessage.aggregate([
        { $match: baseQuery },
        { $group: { _id: '$priority', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]),

      // Message type breakdown
      ContactMessage.aggregate([
        { $match: baseQuery },
        { $group: { _id: '$messageType', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]),

      // Source breakdown
      ContactMessage.aggregate([
        { $match: baseQuery },
        { $group: { _id: '$source', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]),

      // Daily trend (last 30 days)
      ContactMessage.aggregate([
        {
          $match: {
            createdAt: { $gte: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000) },
            isSpam: { $ne: true }
          }
        },
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' },
              day: { $dayOfMonth: '$createdAt' }
            },
            count: { $sum: 1 }
          }
        },
        {
          $project: {
            date: {
              $dateFromParts: {
                year: '$_id.year',
                month: '$_id.month',
                day: '$_id.day'
              }
            },
            count: 1
          }
        },
        { $sort: { date: 1 } }
      ]),

      // Response time statistics
      ContactMessage.aggregate([
        {
          $match: {
            ...baseQuery,
            status: { $in: ['replied'] },
            repliedAt: { $exists: true }
          }
        },
        {
          $project: {
            responseTime: {
              $divide: [
                { $subtract: ['$repliedAt', '$createdAt'] },
                1000 * 60 * 60 // Convert to hours
              ]
            }
          }
        },
        {
          $group: {
            _id: null,
            avgResponseTime: { $avg: '$responseTime' },
            minResponseTime: { $min: '$responseTime' },
            maxResponseTime: { $max: '$responseTime' },
            totalReplied: { $sum: 1 }
          }
        }
      ]),

      // Top companies (excluding null/empty)
      ContactMessage.aggregate([
        {
          $match: {
            ...baseQuery,
            company: { $exists: true, $ne: null, $ne: '' }
          }
        },
        { $group: { _id: '$company', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ]),

      // Recent activity (last 24 hours)
      ContactMessage.find({
        createdAt: { $gte: new Date(now.getTime() - 24 * 60 * 60 * 1000) },
        isSpam: { $ne: true }
      })
      .select('name email subject priority status createdAt')
      .sort({ createdAt: -1 })
      .limit(10)
      .lean(),

      // Spam statistics
      ContactMessage.aggregate([
        { $match: { createdAt: { $gte: startDate } } },
        {
          $group: {
            _id: '$isSpam',
            count: { $sum: 1 }
          }
        }
      ])
    ]);

    // Process and format results
    const stats = {
      overview: {
        totalMessages: totalStats[0]?.totalMessages || 0,
        uniqueContacts: totalStats[0]?.uniqueContacts || 0,
        avgMessageLength: totalStats[0]?.avgMessageLength || 0,
        timeframe,
        startDate,
        endDate: now
      },
      breakdown: {
        status: statusBreakdown.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
        priority: priorityBreakdown.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
        messageType: messageTypeBreakdown.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
        source: sourceBreakdown.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {})
      },
      trends: {
        daily: dailyTrend.map(item => ({
          date: item.date.toISOString().split('T')[0],
          count: item.count
        }))
      },
      performance: {
        responseTime: responseTimeStats[0] ? {
          average: Math.round(responseTimeStats[0].avgResponseTime * 100) / 100,
          minimum: Math.round(responseTimeStats[0].minResponseTime * 100) / 100,
          maximum: Math.round(responseTimeStats[0].maxResponseTime * 100) / 100,
          totalReplied: responseTimeStats[0].totalReplied
        } : null
      },
      insights: {
        topCompanies: topCompanies.map(item => ({
          company: item._id,
          count: item.count
        })),
        recentActivity: recentActivity.map(item => ({
          id: item._id,
          name: item.name,
          email: item.email,
          subject: item.subject,
          priority: item.priority,
          status: item.status,
          createdAt: item.createdAt
        })),
        spam: {
          total: spamStats.reduce((sum, item) => sum + item.count, 0),
          spam: spamStats.find(item => item._id === true)?.count || 0,
          legitimate: spamStats.find(item => item._id !== true)?.count || 0
        }
      }
    };

    // Calculate additional metrics
    const responseRate = stats.overview.totalMessages > 0
      ? Math.round(((stats.breakdown.status.replied || 0) / stats.overview.totalMessages) * 100)
      : 0;

    stats.performance.responseRate = responseRate;

    console.log('✅ Contact form statistics generated successfully');
    console.log(`   Total messages: ${stats.overview.totalMessages}`);
    console.log(`   Unique contacts: ${stats.overview.uniqueContacts}`);
    console.log(`   Response rate: ${responseRate}%`);

    return res.status(200).json({
      success: true,
      statistics: stats,
      meta: {
        generatedAt: new Date().toISOString(),
        timeframe,
        databaseStatus: 'connected'
      }
    });

  } catch (error) {
    console.error('❌ Failed to generate contact statistics:', error);
    return res.status(500).json({
      error: 'Failed to generate statistics',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
}
