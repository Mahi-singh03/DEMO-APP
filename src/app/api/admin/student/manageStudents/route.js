import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import registered_students from '@/models/students'; 
import connectDB from '@/lib/DBconnection';
import cloudinary from '@/lib/cloudinary';

// Connect to MongoDB
async function connectToDatabase() {
  try {
    await connectDB();
  } catch (error) {
    console.error('Database connection error:', error);
    throw new Error('Failed to connect to database');
  }
}

// GET request handler for fetching students with pagination, search, filtering and sorting
export async function GET(request) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 20;
    const search = searchParams.get('search') || '';
    const course = searchParams.get('course') || '';
    const sort = searchParams.get('sort') || 'rollNo';
    const order = searchParams.get('order') || 'asc';
    const status = searchParams.get('status') || ''; // 'active', 'completed', 'certified'
    const certifiedOnly = searchParams.get('certifiedOnly') === 'true';

    // Build query for search and filtering
    let query = {};
    
    // Search across multiple fields
    if (search) {
      query.$or = [
        { rollNo: { $regex: search, $options: 'i' } },
        { phoneNumber: { $regex: search, $options: 'i' } },
        { fullName: { $regex: search, $options: 'i' } },
        { emailAddress: { $regex: search, $options: 'i' } },
        { parentsPhoneNumber: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Filter by course
    if (course) {
      query.selectedCourse = course;
    }
    
    // Filter by student status
    if (status) {
      const currentDate = new Date();
      
      switch (status) {
        case 'active':
          query.farewellDate = { $gte: currentDate };
          break;
        case 'completed':
          query.farewellDate = { $lt: currentDate };
          break;
        case 'certified':
          query.farewellDate = { $lt: currentDate };
          query.certificate = true;
          break;
      }
    }
    
    // Filter by certified only
    if (certifiedOnly) {
      query.certificate = true;
    }

    // Calculate skip for pagination
    const skip = (page - 1) * limit;

    // Build sort object
    const sortObject = {};
    sortObject[sort] = order === 'asc' ? 1 : -1;

    // Fetch students with pagination, search, filtering and sorting
    const students = await registered_students
      .find(query)
      .select('-password') // Exclude password field
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

// Create a new student
export async function POST(request) {
  try {
    await connectToDatabase();
    
    const body = await request.json();
    
    // Check if student with same rollNo or phoneNumber already exists
    const existingStudent = await registered_students.findOne({
      $or: [
        { rollNo: body.rollNo },
        { phoneNumber: body.phoneNumber }
      ]
    });
    
    if (existingStudent) {
      return NextResponse.json(
        { 
          success: false, 
          message: existingStudent.rollNo === body.rollNo 
            ? 'Roll number already exists' 
            : 'Phone number already exists' 
        },
        { status: 400 }
      );
    }
    
    const student = await registered_students.create(body);
    
    return NextResponse.json({
      success: true,
      data: student
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating student:', error);
    
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return NextResponse.json(
        { success: false, message: `${field} already exists` },
        { status: 400 }
      );
    } else {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 400 }
      );
    }
  }
}

// Delete a student
export async function DELETE(request) {
  try {
    await connectToDatabase();
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Student ID is required' },
        { status: 400 }
      );
    }
    
    let student;
    
    // Check if it's a MongoDB ID
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      student = await registered_students.findById(id);
    } else {
      // Search by rollNo or phoneNumber
      student = await registered_students.findOne({
        $or: [
          { rollNo: id },
          { phoneNumber: id }
        ]
      });
    }
    
    if (!student) {
      return NextResponse.json(
        { success: false, message: 'Student not found' },
        { status: 404 }
      );
    }
    
    // Delete photo from Cloudinary if exists
    if (student.photo && student.photo.public_id) {
      try {
        await cloudinary.uploader.destroy(student.photo.public_id);
      } catch (cloudinaryError) {
        console.error('Error deleting photo from Cloudinary:', cloudinaryError);
        // Continue with deletion even if Cloudinary deletion fails
      }
    }
    
    // Delete the student
    await registered_students.findByIdAndDelete(student._id);
    
    return NextResponse.json({
      success: true,
      message: 'Student deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting student:', error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// New endpoint to get student statistics
export async function GET_STATS() {
  try {
    await connectToDatabase();
    
    const currentDate = new Date();
    
    // Get counts for different student statuses
    const totalStudents = await registered_students.countDocuments();
    const activeStudents = await registered_students.countDocuments({ 
      farewellDate: { $gte: currentDate } 
    });
    const completedStudents = await registered_students.countDocuments({ 
      farewellDate: { $lt: currentDate } 
    });
    const certifiedStudents = await registered_students.countDocuments({ 
      farewellDate: { $lt: currentDate },
      certificate: true 
    });
    
    // Get course-wise statistics
    const courseStats = await registered_students.aggregate([
      {
        $group: {
          _id: '$selectedCourse',
          total: { $sum: 1 },
          active: {
            $sum: {
              $cond: [{ $gte: ['$farewellDate', currentDate] }, 1, 0]
            }
          },
          completed: {
            $sum: {
              $cond: [{ $lt: ['$farewellDate', currentDate] }, 1, 0]
            }
          },
          certified: {
            $sum: {
              $cond: [
                { $and: [
                  { $lt: ['$farewellDate', currentDate] },
                  { $eq: ['$certificate', true] }
                ]},
                1,
                0
              ]
            }
          }
        }
      }
    ]);
    
    return NextResponse.json({
      success: true,
      data: {
        totalStudents,
        activeStudents,
        completedStudents,
        certifiedStudents,
        courseStats
      }
    }, { status: 200 });
    
  } catch (error) {
    console.error('Error fetching student statistics:', error);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}