// api/contact/stats.js - REFACTORED to use central DB and Model
import connectDB from '../../lib/db/mongodb';
import ContactMessage from '../../lib/models/ContactMessage';

// The local connectDB function and contactMessageSchema have been removed from this file.

export default async function handler(req, res) {
  // Set CORS headers for admin dashboard access
  res.setHeader('Access-Control-Allow-Origin', '*'); // Or lock down to your specific admin domain
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }

  try {
    // Establish DB connection once for the request
    await connectDB();

    const { timeframe = '30d' } = req.query;

    const now = new Date();
    let startDate;

    switch (timeframe) {
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case '1y':
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      case 'all':
        startDate = new Date('2020-01-01');
        break;
      default: // 30d
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    const baseQuery = { createdAt: { $gte: startDate }, isSpam: { $ne: true } };

    const [totalStats, statusBreakdown, dailyTrend, responseTimeStats] =
      await Promise.all([
        // Total statistics
        ContactMessage.aggregate([
          { $match: baseQuery },
          {
            $group: {
              _id: null,
              totalMessages: { $sum: 1 },
              uniqueContacts: { $addToSet: '$email' },
            },
          },
          {
            $project: {
              _id: 0,
              totalMessages: 1,
              uniqueContacts: { $size: '$uniqueContacts' },
            },
          },
        ]),
        // Status breakdown
        ContactMessage.aggregate([
          { $match: baseQuery },
          { $group: { _id: '$status', count: { $sum: 1 } } },
        ]),
        // Daily trend (last 30 days regardless of timeframe filter)
        ContactMessage.aggregate([
          {
            $match: {
              createdAt: {
                $gte: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
              },
              isSpam: { $ne: true },
            },
          },
          {
            $group: {
              _id: {
                $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
              },
              count: { $sum: 1 },
            },
          },
          { $sort: { _id: 1 } },
          { $project: { _id: 0, date: '$_id', count: 1 } },
        ]),
        // Response time statistics
        ContactMessage.aggregate([
          {
            $match: {
              ...baseQuery,
              status: 'replied',
              repliedAt: { $exists: true },
            },
          },
          {
            $project: {
              responseTimeHours: {
                $divide: [
                  { $subtract: ['$repliedAt', '$createdAt'] },
                  1000 * 60 * 60,
                ],
              },
            },
          },
          {
            $group: {
              _id: null,
              avgResponseTime: { $avg: '$responseTimeHours' },
              totalReplied: { $sum: 1 },
            },
          },
        ]),
      ]);

    // Format final statistics object
    const stats = {
      overview: {
        ...totalStats[0],
        timeframe,
        startDate,
        endDate: now,
      },
      breakdown: {
        status: statusBreakdown.reduce(
          (acc, item) => ({ ...acc, [item._id]: item.count }),
          {}
        ),
      },
      trends: {
        daily: dailyTrend,
      },
      performance: {
        avgResponseTimeHours: responseTimeStats[0]
          ? Math.round(responseTimeStats[0].avgResponseTime * 10) / 10
          : 0,
        totalReplied: responseTimeStats[0]
          ? responseTimeStats[0].totalReplied
          : 0,
      },
    };

    return res.status(200).json({
      success: true,
      statistics: stats,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Failed to generate statistics:', error);
    return res.status(500).json({
      error: 'Failed to generate statistics',
      message: error.message,
    });
  }
}
