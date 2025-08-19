import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import registered_students from '@/models/students'; 
import connectDB from '@/lib/DBconnection'; 

// Connect to MongoDB
async function connectToDatabase() {
  try {
    await connectDB();
  } catch (error) {
    console.error('Database connection error:', error);
    throw new Error('Failed to connect to database');
  }
}

// GET request handler for fetching students with pagination and search
export async function GET(request) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = 20; // 20 students per page
    const search = searchParams.get('search') || '';
    const sort = searchParams.get('sort') || 'rollNo';
    const order = searchParams.get('order') || 'asc';

    // Build query for search
    let query = {};
    if (search) {
      query = {
        $or: [
          { rollNo: { $regex: search, $options: 'i' } },
          { phoneNumber: { $regex: search, $options: 'i' } },
          { fullName: { $regex: search, $options: 'i' } },
        ],
      };
    }

    // Calculate skip for pagination
    const skip = (page - 1) * limit;

    // Build sort object
    const sortObject = {};
    sortObject[sort] = order === 'asc' ? 1 : -1;

    // Fetch students with pagination, search, and sorting
    const students = await registered_students
      .find(query)
      .select('fullName rollNo phoneNumber parentsPhoneNumber selectedCourse courseDuration joiningDate farewellDate photo')
      .sort(sortObject)
      .skip(skip)
      .limit(limit)
      .lean();

    // Get total count for pagination
    const totalStudents = await registered_students.countDocuments(query);

    // Calculate total pages
    const totalPages = Math.ceil(totalStudents / limit);

    return NextResponse.json({
      success: true,
      data: students,
      pagination: {
        currentPage: page,
        totalPages,
        totalStudents,
        limit,
      },
    }, { status: 200 });

  } catch (error) {
    console.error('Error fetching students:', error);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}