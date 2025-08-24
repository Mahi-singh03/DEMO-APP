import connectToDatabase from '@/lib/DBconnection';
import Course from '@/models/courseVideos';
import cloudinary from '@/lib/cloudinary';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

export async function GET(req, { params }) {
  await connectToDatabase();
  const { id } = params;
  
  try {
    // Try to find by courseId first, then by MongoDB _id
    let course = await Course.findOne({ courseId: id });
    if (!course) {
      course = await Course.findById(id);
    }
    
    
    if (!course) {
      return Response.json({ error: 'Course not found.' }, { status: 404 });
    }
    
    return Response.json(course);
  } catch (err) {
    console.error('Error fetching course:', err);
    return Response.json({ error: 'Failed to fetch course.' }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  await connectToDatabase();
  const { id } = params;
  
  try {
    const body = await req.json();
    const { name, description, videos, titlePhotoBase64 } = body;
    
    // Find course by courseId or _id
    let course = await Course.findOne({ courseId: id });
    if (!course) {
      course = await Course.findById(id);
    }
    
    if (!course) {
      return Response.json({ error: 'Course not found.' }, { status: 404 });
    }
    
    // Update fields
    if (name) course.name = name;
    if (description) course.description = description;
    
    // Handle thumbnail update
    if (titlePhotoBase64) {
      // Delete old image from Cloudinary if it exists
      if (course.titlePhotoUrl) {
        const publicId = course.titlePhotoUrl.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(`course_thumbnails/${publicId}`);
      }
      
      // Upload new image
      const uploadRes = await cloudinary.uploader.upload(titlePhotoBase64, {
        folder: 'course_thumbnails',
      });
      course.titlePhotoUrl = uploadRes.secure_url;
    }
    
    // Update videos if provided
    if (videos) {
      course.videos = videos.map((video, index) => ({
        ...video,
        order: index
      }));
      course.videoCount = videos.length;
    }
    
    await course.save();
    return Response.json(course);
  } catch (err) {
    console.error('Error updating course:', err);
    return Response.json({ error: 'Failed to update course.' }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  await connectToDatabase();
  const { id } = params;
  
  try {
    // Find course by courseId or _id
    let course = await Course.findOne({ courseId: id });
    if (!course) {
      course = await Course.findById(id);
    }
    
    if (!course) {
      return Response.json({ error: 'Course not found.' }, { status: 404 });
    }
    
    // Delete thumbnail from Cloudinary if it exists
    if (course.titlePhotoUrl) {
      const publicId = course.titlePhotoUrl.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(`course_thumbnails/${publicId}`);
    }
    
    // Delete the course
    await Course.deleteOne({ _id: course._id });
    
    return Response.json({ message: 'Course deleted successfully.' });
  } catch (err) {
    console.error('Error deleting course:', err);
    return Response.json({ error: 'Failed to delete course.' }, { status: 500 });
  }
}