import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/DBconnection';
import Course from '@/models/courseVideos';

export async function GET(request) {
  try {
    await connectToDatabase();
    const courses = await Course.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: courses }, { status: 200 });
  } catch (error) {
    console.error('GET courses error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error', details: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    
    // Log the incoming data to debug
    console.log('Creating course with data:', body);
    
    // Validate required fields
    if (!body.name || typeof body.name !== 'string' || body.name.trim() === '') {
      return NextResponse.json({
        success: false,
        error: 'Course name is required and must be a non-empty string'
      }, { status: 400 });
    }
    
    // Validate course name is in allowed enum
    const allowedNames = [
      "VN video editing",
      "AI and ChatGPT",
      "MS Excel Course",
      "Canva Course",
      "HTML Course"
    ];
    
    if (!allowedNames.includes(body.name)) {
      return NextResponse.json({
        success: false,
        error: `Course name must be one of: ${allowedNames.join(', ')}`
      }, { status: 400 });
    }
    
    // Ensure titlePhotoUrl is properly handled
    const courseData = {
      name: body.name.trim(),
      description: body.description ? body.description.trim() : '',
      titlePhotoUrl: body.titlePhotoUrl || '',
      videos: Array.isArray(body.videos) ? body.videos : []
    };
    
    const course = await Course.create(courseData);
    
    console.log('Course created successfully:', course);
    return NextResponse.json({ success: true, data: course, message: 'Course created successfully' }, { status: 201 });
  } catch (error) {
    console.error('POST course error:', error);
    
    // Handle validation errors specifically
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return NextResponse.json({
        success: false,
        error: 'Validation failed',
        details: validationErrors
      }, { status: 400 });
    }
    
    // Handle duplicate key errors
    if (error.code === 11000) {
      return NextResponse.json({
        success: false,
        error: 'Course with this name already exists'
      }, { status: 409 });
    }
    
    return NextResponse.json({ success: false, error: 'Internal server error', details: error.message }, { status: 500 });
  }
}

// Handle course updates (PUT/PATCH)
export async function PUT(request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const { id, courseId, ...updateData } = body;
    
    console.log('Updating course:', id || courseId, 'with data:', updateData);
    
    if (!id && !courseId) {
      return NextResponse.json({
        success: false,
        error: 'Course identifier (id or courseId) is required for updates'
      }, { status: 400 });
    }
    
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
    
    // Find and update the course
    const filter = id ? { _id: id } : { courseId };
    const course = await Course.findOneAndUpdate(
      filter,
      {
        ...updateData,
        // Explicitly handle titlePhotoUrl
        ...(updateData.titlePhotoUrl !== undefined && { titlePhotoUrl: updateData.titlePhotoUrl })
      },
      {
        new: true, // Return the updated document
        runValidators: true // Run schema validations
      }
    );
    
    if (!course) {
      return NextResponse.json({
        success: false,
        error: 'Course not found'
      }, { status: 404 });
    }
    
    console.log('Course updated successfully:', course);
    return NextResponse.json({ success: true, data: course, message: 'Course updated successfully' }, { status: 200 });
  } catch (error) {
    console.error('PUT course error:', error);
    
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

// Handle course deletion
export async function DELETE(request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const { id, courseId } = body || {};

    if (!id && !courseId) {
      return NextResponse.json({
        success: false,
        error: 'Course identifier (id or courseId) is required for deletion'
      }, { status: 400 });
    }

    const filter = id ? { _id: id } : { courseId };
    const deleted = await Course.findOneAndDelete(filter);

    if (!deleted) {
      return NextResponse.json({ success: false, error: 'Course not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: {}, message: 'Course deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('DELETE course error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error', details: error.message }, { status: 500 });
  }
}