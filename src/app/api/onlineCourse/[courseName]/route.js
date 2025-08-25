import mongoose from 'mongoose';
import Course from '@/models/courseVideos';
import connectDB from '@/lib/DBconnection';
import cloudinary from '@/lib/cloudinary';

export async function GET(request, { params }) {
  const { courseName } = params;

  try {
    await connectDB();
    const course = await Course.findOne({ name: decodeURIComponent(courseName) }).lean();

    if (!course) {
      return new Response(JSON.stringify({ message: 'Course not found' }), { status: 404 });
    }

    const videosWithSecureUrls = await Promise.all(
      course.videos.map(async (video) => {
        try {
          const urlParts = video.videoUrl.split('/');
          const publicId = urlParts[urlParts.length - 1].split('.')[0];
          const videoUrl = cloudinary.url(publicId, {
            resource_type: 'video',
            expires_at: Math.floor(Date.now() / 1000) + 3600,
            sign_url: true
            // Remove transformation or use correct flags if needed
          });
          return {
            _id: video._id,
            title: video.title,
            description: video.description,
            duration: video.duration,
            order: video.order,
            videoUrl: videoUrl
          };
        } catch (error) {
          return {
            ...video,
            videoUrl: null,
            error: 'Failed to generate secure video URL'
          };
        }
      })
    );

    const courseData = {
      ...course,
      videos: videosWithSecureUrls
    };

    return new Response(JSON.stringify(courseData), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Internal server error' }), { status: 500 });
  }
}