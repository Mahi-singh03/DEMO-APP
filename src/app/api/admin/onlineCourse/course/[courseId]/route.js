import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/DBconnection';
import Course from '@/models/courseVideos';

// GET a specific course
export async function GET(req, { params }) {
  try {
    console.log('GET /api/admin/onlineCourse/course/[courseId] called');
    console.log('Params:', params);
    
    const { courseId } = params;
    console.log('Course ID:', courseId);
    
    if (!courseId) {
      console.log('No courseId provided');
      return NextResponse.json({ success: false, error: 'Course ID is required' }, { status: 400 });
    }
    
    console.log('Connecting to database...');
    await connectToDatabase();
    console.log('Database connected successfully');

    console.log('Searching for course with courseId:', courseId);
    const course = await Course.findOne({ courseId });
    console.log('Course found:', course ? 'Yes' : 'No');
    
    if (!course) {
      console.log('Course not found');
      return NextResponse.json({ success: false, error: 'Course not found' }, { status: 404 });
    }
    
    console.log('Returning course data');
    return NextResponse.json({ success: true, data: course }, { status: 200 });
  } catch (error) {
    console.error('Error in course GET operation:', error);
    console.error('Error stack:', error.stack);
    return NextResponse.json({ success: false, error: 'Internal server error', details: error.message }, { status: 500 });
  }
}

// PUT update a course
export async function PUT(req, { params }) {
  try {
    const { courseId } = params;
    
    if (!courseId) {
      return NextResponse.json({ success: false, error: 'Course ID is required' }, { status: 400 });
    }
    
    await connectToDatabase();

    const body = await req.json();
    
    // Remove courseId from update data to prevent changing it
    const { courseId: _, ...updateData } = body;
    
    // Validate course name if it's being updated
    if (updateData.name !== undefined) {
      if (typeof updateData.name !== 'string' || updateData.name.trim() === '') {
        return NextResponse.json({
          success: false,
          error: 'Course name must be a non-empty string'
        }, { status: 400 });
      }
      
      const allowedNames = [
        "VN video editing",
        "AI and ChatGPT",
        "MS Excel Course",
        "Canva Course",
        "HTML Course"
      ];
      
      if (!allowedNames.includes(updateData.name)) {
        return NextResponse.json({
          success: false,
          error: `Course name must be one of: ${allowedNames.join(', ')}`
        }, { status: 400 });
      }
      
      updateData.name = updateData.name.trim();
    }
    
    // Validate description if it's being updated
    if (updateData.description !== undefined) {
      updateData.description = updateData.description ? updateData.description.trim() : '';
    }
    
    const course = await Course.findOneAndUpdate({ courseId }, updateData, {
      new: true,
      runValidators: true,
    });
    
    if (!course) {
      return NextResponse.json({ success: false, error: 'Course not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, data: course, message: 'Course updated successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error in course PUT operation:', error);
    
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return NextResponse.json({ 
        success: false, 
        error: 'Validation failed', 
        details: validationErrors 
      }, { status: 400 });
    }
    
    return NextResponse.json({ success: false, error: 'Internal server error', details: error.message }, { status: 500 });
  }
}

// DELETE a course
export async function DELETE(req, { params }) {
  try {
    const { courseId } = params;
    
    if (!courseId) {
      return NextResponse.json({ success: false, error: 'Course ID is required' }, { status: 400 });
    }
    
    await connectToDatabase();

    const deletedCourse = await Course.findOneAndDelete({ courseId });
    if (!deletedCourse) {
      return NextResponse.json({ success: false, error: 'Course not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: {}, message: 'Course deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error in course DELETE operation:', error);
    return NextResponse.json({ success: false, error: 'Internal server error', details: error.message }, { status: 500 });
  }
}
