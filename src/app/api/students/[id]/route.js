import mongoose from 'mongoose';
import registered_students from '@/models/students'; 
import connectDB from '@/lib/DBconnection';

// GET - Fetch individual student details (for the student themselves)
export async function GET(request, { params }) {
  await connectDB();

  try {
    const { id } = params;
    
    // Verify authorization
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return Response.json({
        success: false,
        message: 'Authorization token required'
      }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return Response.json({
        success: false,
        message: 'Invalid student ID'
      }, { status: 400 });
    }

    // Fetch student data (excluding password)
    const student = await registered_students.findById(id)
      .select('-password')
      .lean();

    if (!student) {
      return Response.json({
        success: false,
        message: 'Student not found'
      }, { status: 404 });
    }

    // Return complete student data
    return Response.json(student);

  } catch (error) {
    console.error('API Error:', error);
    return Response.json({
      success: false,
      message: 'Server Error',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    }, { status: 500 });
  }
}
