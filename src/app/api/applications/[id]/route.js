import mongoose from 'mongoose';
import JobCandidates from '@/models/JobCandidiates';
import { NextResponse } from 'next/server';

// Connect to MongoDB
const connectDB = async () => {
  if (mongoose.connections[0].readyState) return;
  await mongoose.connect(process.env.MONGODB_URI);
};

export async function GET(request, { params }) {
  await connectDB().catch(err => {
    console.error('Database connection error:', err);
    return NextResponse.json({ message: 'Database connection failed' }, { status: 500 });
  });

  const { id } = await params;

  if (!id) {
    return NextResponse.json({ message: 'Application ID is required' }, { status: 400 });
  }

  try {
    const application = await JobCandidates.findById(id).lean();
    
    if (!application) {
      return NextResponse.json({ message: 'Application not found' }, { status: 404 });
    }
    
    return NextResponse.json({ application });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  await connectDB().catch(err => {
    console.error('Database connection error:', err);
    return NextResponse.json({ message: 'Database connection failed' }, { status: 500 });
  });

  const { id } = await params;

  if (!id) {
    return NextResponse.json({ message: 'Application ID is required' }, { status: 400 });
  }

  try {
    const updates = await request.json();
    
    // Remove immutable fields
    delete updates._id;
    delete updates.appliedAt;
    delete updates.createdAt;
    delete updates.updatedAt;
    
    const updatedApplication = await JobCandidates.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    ).lean();
    
    if (!updatedApplication) {
      return NextResponse.json({ message: 'Application not found' }, { status: 404 });
    }
    
    return NextResponse.json({ application: updatedApplication });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
