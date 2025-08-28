import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/DBconnection';
import Course from '@/models/courseVideos';

// Get all videos for a course
export async function GET(req, { params }) {
  try {
    const { courseId } = params || {};
    
    if (!courseId) {
      return NextResponse.json({ success: false, error: 'Course ID is required' }, { status: 400 });
    }
    
    await connectToDatabase();

    const course = await Course.findOne({ courseId });
    if (!course) {
      return NextResponse.json({ success: false, error: 'Course not found' }, { status: 404 });
    }

    // Ensure videos array exists and sort by order
    const videos = course.videos || [];
    const sortedVideos = videos.sort((a, b) => {
      const orderA = typeof a.order === 'number' && !isNaN(a.order) ? a.order : 0;
      const orderB = typeof b.order === 'number' && !isNaN(b.order) ? b.order : 0;
      return orderA - orderB;
    });
    
    return NextResponse.json({ success: true, data: sortedVideos }, { status: 200 });
  } catch (error) {
    console.error('Error in videos GET operation:', error);
    return NextResponse.json({ success: false, error: 'Internal server error', details: error.message }, { status: 500 });
  }
}

// Add a new video to a course
export async function POST(req, { params }) {
  try {
    console.log('POST /api/admin/onlineCourse/course/[courseId]/video called');
    console.log('Params:', params);
    
    const { courseId } = params || {};
    console.log('Course ID:', courseId);
    
    if (!courseId) {
      console.log('No courseId provided');
      return NextResponse.json({ success: false, error: 'Course ID is required' }, { status: 400 });
    }
    
    console.log('Connecting to database...');
    await connectToDatabase();
    console.log('Database connected successfully');

    const course = await Course.findOne({ courseId });
    if (!course) {
      return NextResponse.json({ success: false, error: 'Course not found' }, { status: 404 });
    }

    const videoData = await req.json();
    if (!videoData || !videoData.title || !videoData.cloudinaryPublicId) {
      return NextResponse.json({ success: false, error: 'Title and cloudinaryPublicId are required' }, { status: 400 });
    }

    // Ensure order is valid
    if (videoData.order === undefined || videoData.order === null) {
      videoData.order = course.videos ? course.videos.length : 0;
    }

    // Ensure duration is valid
    if (videoData.duration !== undefined && videoData.duration !== null) {
      const duration = parseInt(videoData.duration);
      videoData.duration = isNaN(duration) ? 0 : Math.max(0, duration);
    }

    // Set createdAt if not provided
    if (!videoData.createdAt) {
      videoData.createdAt = new Date();
    }

    // Derive secureUrl if not provided
    if (!videoData.secureUrl && videoData.cloudinaryPublicId) {
      const cloudName = process.env.CLOUDINARY_NAME || process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_NAME || 'dyigmfiar';
      videoData.secureUrl = `https://res.cloudinary.com/${cloudName}/video/upload/${videoData.cloudinaryPublicId}.mp4`;
    }

    // Ensure course.videos is an array
    if (!Array.isArray(course.videos)) {
      course.videos = [];
    }

    course.videos.push(videoData);
    
    // Sort videos by order
    course.videos.sort((a, b) => {
      const orderA = typeof a.order === 'number' && !isNaN(a.order) ? a.order : 0;
      const orderB = typeof b.order === 'number' && !isNaN(b.order) ? b.order : 0;
      return orderA - orderB;
    });

    // Update videoCount
    course.videoCount = course.videos.length;

    await course.save();

    return NextResponse.json({ success: true, data: course, message: 'Video added successfully', newVideo: videoData }, { status: 201 });
  } catch (error) {
    console.error('Error in videos POST operation:', error);
    
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

// Update all videos (bulk update)
export async function PUT(req, { params }) {
  try {
    const { courseId } = params || {};
    
    if (!courseId) {
      return NextResponse.json({ success: false, error: 'Course ID is required' }, { status: 400 });
    }
    
    await connectToDatabase();

    const course = await Course.findOne({ courseId });
    if (!course) {
      return NextResponse.json({ success: false, error: 'Course not found' }, { status: 404 });
    }

    const videosData = await req.json();
    if (!Array.isArray(videosData)) {
      return NextResponse.json({ success: false, error: 'Expected an array of videos' }, { status: 400 });
    }

    // Validate each video has required fields
    for (const video of videosData) {
      if (!video.title || !video.cloudinaryPublicId) {
        return NextResponse.json({ 
          success: false, 
          error: 'Each video must have title and cloudinaryPublicId' 
        }, { status: 400 });
      }
    }

    // Update all videos
    course.videos = videosData;
    
    // Ensure order is sequential and valid
    course.videos.forEach((video, index) => {
      video.order = index;
      
      // Ensure duration is valid
      if (video.duration !== undefined && video.duration !== null) {
        const duration = parseInt(video.duration);
        video.duration = isNaN(duration) ? 0 : Math.max(0, duration);
      }
      
      // Derive secureUrl if not provided
      if (!video.secureUrl && video.cloudinaryPublicId) {
        const cloudName = process.env.CLOUDINARY_NAME || process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_NAME || 'dyigmfiar';
        video.secureUrl = `https://res.cloudinary.com/${cloudName}/video/upload/${video.cloudinaryPublicId}.mp4`;
      }
    });

    // Update videoCount
    course.videoCount = course.videos.length;

    await course.save();

    return NextResponse.json({ success: true, data: course, message: 'All videos updated successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error in videos PUT operation:', error);
    
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

// Delete all videos from a course
export async function DELETE(req, { params }) {
  try {
    const { courseId } = params || {};
    
    if (!courseId) {
      return NextResponse.json({ success: false, error: 'Course ID is required' }, { status: 400 });
    }
    
    await connectToDatabase();

    const course = await Course.findOne({ courseId });
    if (!course) {
      return NextResponse.json({ success: false, error: 'Course not found' }, { status: 404 });
    }

    // Store deleted videos info for response
    const deletedVideos = (course.videos || []).map(video => ({
      title: video.title,
      cloudinaryPublicId: video.cloudinaryPublicId
    }));

    // Clear all videos
    course.videos = [];
    course.videoCount = 0;

    await course.save();

    return NextResponse.json({
      success: true,
      data: course,
      message: 'All videos deleted successfully',
      deletedVideos
    }, { status: 200 });
  } catch (error) {
    console.error('Error in videos DELETE operation:', error);
    return NextResponse.json({ success: false, error: 'Internal server error', details: error.message }, { status: 500 });
  }
}
