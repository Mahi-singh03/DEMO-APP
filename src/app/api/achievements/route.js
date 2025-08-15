import { NextResponse } from 'next/server';
import connectDB from '@/lib/DBconnection';
import Achievement from '@/models/achievements';

export async function GET(req) {
  try {
    // Connect to database
    await connectDB();
    
    // Extract query parameters
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const sortBy = searchParams.get('sortBy') || 'date';
    const sortOrder = parseInt(searchParams.get('sortOrder')) || -1;
    const search = searchParams.get('search') || '';
    
    // Build search query
    let query = {};
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { studentName: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Calculate pagination
    const skip = (page - 1) * limit;
    
    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder;
    
    // Fetch achievements with pagination and sorting
    const achievements = await Achievement.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit);
    
    // Get total count for pagination
    const totalItems = await Achievement.countDocuments(query);
    const totalPages = Math.ceil(totalItems / limit);
    
    // Return formatted response
    return NextResponse.json({
      data: achievements,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems,
        itemsPerPage: limit
      }
    });
  } catch (error) {
    return NextResponse.json(
      { error: error.message }, 
      { status: 500 }
    );
  }
}