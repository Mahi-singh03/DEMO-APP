import mongoose from 'mongoose';
import registered_students from '@/models/students'; 
import connectDB from '@/lib/DBconnection';

// POST - Upload/Update student photo
export async function POST(request, { params }) {
  await connectDB();

  try {
    const { id } = params;
    const { photo } = await request.json();
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return Response.json({
        success: false,
        message: 'Invalid student ID'
      }, { status: 400 });
    }

    if (!photo) {
      return Response.json({
        success: false,
        message: 'Photo data is required'
      }, { status: 400 });
    }

    const student = await registered_students.findById(id);
    
    if (!student) {
      return Response.json({
        success: false,
        message: 'Student not found'
      }, { status: 404 });
    }

    student.photo = photo;
    await student.save();

    return Response.json({
      success: true,
      message: 'Photo updated successfully',
      data: { photo: student.photo }
    });
  } catch (error) {
    console.error('API Error:', error);
    return Response.json({
      success: false,
      message: 'Server Error',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    }, { status: 500 });
  }
}