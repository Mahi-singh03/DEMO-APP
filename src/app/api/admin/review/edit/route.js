import { NextResponse } from 'next/server';
import dbConnect from '@/lib/DBconnection';
import Review from '@/models/review';

export async function PUT(request) {
  try {
    await dbConnect();

    const body = await request.json();
    const { id, name, category, review, rating } = body;

    if (!id) {
      return NextResponse.json({ message: 'Review ID is required' }, { status: 400 });
    }

    if (!name || !category || !review || !rating) {
      return NextResponse.json({ message: 'All fields are required' }, { status: 400 });
    }

    if (!['student', 'staff', 'visitor'].includes(category)) {
      return NextResponse.json({ message: 'Invalid category' }, { status: 400 });
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json({ message: 'Rating must be between 1 and 5' }, { status: 400 });
    }

    const updatedReview = await Review.findByIdAndUpdate(
      id,
      { name, category, review, rating, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    if (!updatedReview) {
      return NextResponse.json({ message: 'Review not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Review updated successfully', review: updatedReview }, { status: 200 });
  } catch (error) {
    console.error('Error updating review:', error);
    if (error.name === 'CastError') {
      return NextResponse.json({ message: 'Invalid review ID' }, { status: 400 });
    }
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}