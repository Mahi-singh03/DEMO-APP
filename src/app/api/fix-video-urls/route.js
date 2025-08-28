import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/DBconnection';
import Course from '@/models/courseVideos';

export async function POST() {
  try {
    console.log('Starting to fix video URLs...');
    
    await connectToDatabase();
    console.log('Database connected successfully');
    
    // Find all courses
    const courses = await Course.find({});
    console.log(`Found ${courses.length} courses`);
    
    let totalVideosFixed = 0;
    let totalVideosChecked = 0;
    
    for (const course of courses) {
      if (course.videos && Array.isArray(course.videos)) {
        totalVideosChecked += course.videos.length;
        
        for (const video of course.videos) {
          if (video.cloudinaryPublicId) {
            // Check if the URL needs fixing (contains 'demo' or is missing)
            if (!video.secureUrl || video.secureUrl.includes('demo')) {
              // Fix the URL
              video.secureUrl = `https://res.cloudinary.com/dyigmfiar/video/upload/${video.cloudinaryPublicId}.mp4`;
              totalVideosFixed++;
              console.log(`Fixed video: ${video.title} - ${video.secureUrl}`);
            }
          }
        }
        
        // Save the course if any videos were modified
        if (totalVideosFixed > 0) {
          await course.save();
        }
      }
    }
    
    console.log(`URL fix completed. Checked ${totalVideosChecked} videos, fixed ${totalVideosFixed} URLs.`);
    
    return NextResponse.json({
      success: true,
      message: 'Video URLs fixed successfully',
      totalVideosChecked,
      totalVideosFixed
    });
    
  } catch (error) {
    console.error('Error fixing video URLs:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fix video URLs',
      details: error.message
    }, { status: 500 });
  }
}
