import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/DBconnection';
import Course from '@/models/courseVideos';

// Singular alias for .../videos/[videoIndex]
export async function GET(req, { params }) {
  try {
    const { courseId, videoIndex } = params || {};
    
    if (!courseId) {
      return NextResponse.json({ success: false, error: 'Course ID is required' }, { status: 400 });
    }
    
    if (!videoIndex) {
      return NextResponse.json({ success: false, error: 'Video index is required' }, { status: 400 });
    }
    
    await connectToDatabase();
    const index = parseInt(videoIndex);

    if (isNaN(index) || index < 0) {
      return NextResponse.json({ success: false, error: 'Invalid video index' }, { status: 400 });
    }

    const course = await Course.findOne({ courseId });
    if (!course) {
      return NextResponse.json({ success: false, error: 'Course not found' }, { status: 404 });
    }

    // Ensure videos array exists
    if (!Array.isArray(course.videos)) {
      return NextResponse.json({ success: false, error: 'No videos found in course' }, { status: 404 });
    }

    if (index >= course.videos.length) {
      return NextResponse.json({ success: false, error: 'Video not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: course.videos[index] }, { status: 200 });
  } catch (error) {
    console.error('Error in video GET operation (alias):', error);
    return NextResponse.json({ success: false, error: 'Internal server error', details: error.message }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    const { courseId, videoIndex } = params || {};
    
    if (!courseId) {
      return NextResponse.json({ success: false, error: 'Course ID is required' }, { status: 400 });
    }
    
    if (!videoIndex) {
      return NextResponse.json({ success: false, error: 'Video index is required' }, { status: 400 });
    }
    
    await connectToDatabase();
    const index = parseInt(videoIndex);

    if (isNaN(index) || index < 0) {
      return NextResponse.json({ success: false, error: 'Invalid video index' }, { status: 400 });
    }

    const course = await Course.findOne({ courseId });
    if (!course) {
      return NextResponse.json({ success: false, error: 'Course not found' }, { status: 404 });
    }

    // Ensure videos array exists
    if (!Array.isArray(course.videos)) {
      return NextResponse.json({ success: false, error: 'No videos found in course' }, { status: 404 });
    }

    if (index >= course.videos.length) {
      return NextResponse.json({ success: false, error: 'Video not found' }, { status: 404 });
    }

    const updateData = await req.json();
    
    // Validate required fields
    if (updateData.title !== undefined && !updateData.title) {
      return NextResponse.json({ success: false, error: 'Video title cannot be empty' }, { status: 400 });
    }
    
    if (updateData.cloudinaryPublicId !== undefined && !updateData.cloudinaryPublicId) {
      return NextResponse.json({ success: false, error: 'Cloudinary public ID cannot be empty' }, { status: 400 });
    }

    // Update the video
    Object.assign(course.videos[index], updateData);

    // Ensure order is valid
    if (updateData.order !== undefined) {
      const order = parseInt(updateData.order);
      course.videos[index].order = isNaN(order) ? index : Math.max(0, order);
    }

    // Ensure duration is valid
    if (updateData.duration !== undefined) {
      const duration = parseInt(updateData.duration);
      course.videos[index].duration = isNaN(duration) ? 0 : Math.max(0, duration);
    }

    // Ensure secureUrl present if cloudinaryPublicId exists
    if (!course.videos[index].secureUrl && course.videos[index].cloudinaryPublicId) {
      const cloudName = process.env.CLOUDINARY_NAME || process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_NAME || 'dyigmfiar';
      course.videos[index].secureUrl = `https://res.cloudinary.com/${cloudName}/video/upload/${course.videos[index].cloudinaryPublicId}.mp4`;
    }

    await course.save();

    return NextResponse.json({ success: true, data: course, message: 'Video updated successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error in video PUT operation (alias):', error);
    
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

export async function DELETE(req, { params }) {
  try {
    const { courseId, videoIndex } = params || {};
    
    if (!courseId) {
      return NextResponse.json({ success: false, error: 'Course ID is required' }, { status: 400 });
    }
    
    if (!videoIndex) {
      return NextResponse.json({ success: false, error: 'Video index is required' }, { status: 400 });
    }
    
    await connectToDatabase();
    const index = parseInt(videoIndex);

    if (isNaN(index) || index < 0) {
      return NextResponse.json({ success: false, error: 'Invalid video index' }, { status: 400 });
    }

    const course = await Course.findOne({ courseId });
    if (!course) {
      return NextResponse.json({ success: false, error: 'Course not found' }, { status: 404 });
    }

    // Ensure videos array exists
    if (!Array.isArray(course.videos)) {
      return NextResponse.json({ success: false, error: 'No videos found in course' }, { status: 404 });
    }

    if (index >= course.videos.length) {
      return NextResponse.json({ success: false, error: 'Video not found' }, { status: 404 });
    }

    const deletedVideo = course.videos[index];
    course.videos.splice(index, 1);
    
    // Reorder remaining videos
    course.videos.forEach((video, idx) => { 
      video.order = idx; 
    });

    await course.save();

    return NextResponse.json({ 
      success: true, 
      data: course, 
      message: 'Video deleted successfully', 
      deletedVideo: { 
        title: deletedVideo.title, 
        cloudinaryPublicId: deletedVideo.cloudinaryPublicId 
      } 
    }, { status: 200 });
  } catch (error) {
    console.error('Error in video DELETE operation (alias):', error);
    return NextResponse.json({ success: false, error: 'Internal server error', details: error.message }, { status: 500 });
  }
}
