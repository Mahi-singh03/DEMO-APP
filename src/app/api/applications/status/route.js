import mongoose from 'mongoose';
import JobCandidates from '@/models/JobCandidiates';
import { NextResponse } from 'next/server';

// Connect to MongoDB
const connectDB = async () => {
  if (mongoose.connections[0].readyState) return;
  await mongoose.connect(process.env.MONGODB_URI);
};

export async function GET() {
  await connectDB().catch(err => {
    console.error('Database connection error:', err);
    return NextResponse.json({ message: 'Database connection failed' }, { status: 500 });
  });

  try {
    const statusCounts = await JobCandidates.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);
    
    // Convert array to object for easier access
    const counts = {};
    statusCounts.forEach(item => {
      counts[item._id] = item.count;
    });
    
    // Ensure all statuses are represented
    const statuses = ['pending', 'reviewed', 'shortlisted', 'rejected', 'hired'];
    statuses.forEach(status => {
      if (!counts[status]) {
        counts[status] = 0;
      }
    });
    
    return NextResponse.json(counts);
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
