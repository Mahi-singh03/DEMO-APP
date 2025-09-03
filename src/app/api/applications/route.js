import mongoose from 'mongoose';
import JobCandidates from '@/models/JobCandidiates';
import { NextResponse } from 'next/server';

// Connect to MongoDB
const connectDB = async () => {
  if (mongoose.connections[0].readyState) return;
  await mongoose.connect(process.env.MONGODB_URI);
};

export async function GET(request) {
  await connectDB().catch(err => {
    console.error('Database connection error:', err);
    return NextResponse.json({ message: 'Database connection failed' }, { status: 500 });
  });

  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 12;
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    
    // Build filter object
    const filter = {};
    if (status && status !== 'all') {
      filter.status = status;
    }
    
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { preferredPosition: { $regex: search, $options: 'i' } },
        { skills: { $in: [new RegExp(search, 'i')] } }
      ];
    }
    
    // Calculate skip value for pagination
    const skip = (page - 1) * limit;
    
    // Get total count for pagination info
    const total = await JobCandidates.countDocuments(filter);
    
    // Get applications with sorting, filtering and pagination
    const applications = await JobCandidates.find(filter)
      .sort({ appliedAt: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
    
    // Calculate pagination info
    const totalPages = Math.ceil(total / limit);
    const hasNext = page < totalPages;
    const hasPrev = page > 1;
    
    return NextResponse.json({
      applications,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext,
        hasPrev
      }
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request) {
  await connectDB().catch(err => {
    console.error('Database connection error:', err);
    return NextResponse.json({ message: 'Database connection failed' }, { status: 500 });
  });

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ message: 'Application ID is required' }, { status: 400 });
    }
    
    const deletedApplication = await JobCandidates.findByIdAndDelete(id);
    
    if (!deletedApplication) {
      return NextResponse.json({ message: 'Application not found' }, { status: 404 });
    }
    
    return NextResponse.json({ 
      message: 'Application deleted successfully',
      deletedId: id
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
