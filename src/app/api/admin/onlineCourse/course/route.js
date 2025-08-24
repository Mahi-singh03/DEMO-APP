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

// ===================== GET =====================
export async function GET(req, { params } = {}) {
  await connectToDatabase();

  try {
    // If params and params.id exist, fetch single course
    if (params && params.id) {
      let course = await Course.findOne({ courseId: params.id }).lean();
      if (!course) {
        course = await Course.findById(params.id).lean();
      }
      if (!course) {
        return Response.json({ error: 'Course not found.' }, { status: 404 });
      }
      return Response.json(course, { status: 200 });
    }

    // Otherwise, fetch all courses
    const courses = await Course.find({}).lean();
    return Response.json(courses, { status: 200 });
  } catch (err) {
    console.error('Error fetching course(s):', err);
    return Response.json({ error: 'Failed to fetch course(s).' }, { status: 500 });
  }
}

// ===================== PUT =====================
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

    // Handle thumbnail update (Cloudinary)
    if (titlePhotoBase64) {
      if (course.titlePhotoUrl) {
        try {
          const publicId = course.titlePhotoUrl
            .split('/')
            .pop()
            .split('.')[0];
          await cloudinary.uploader.destroy(`course_thumbnails/${publicId}`);
        } catch (cloudErr) {
          console.warn('Cloudinary delete failed:', cloudErr.message);
        }
      }

      const uploadRes = await cloudinary.uploader.upload(titlePhotoBase64, {
        folder: 'course_thumbnails',
      });
      course.titlePhotoUrl = uploadRes.secure_url;
    }

    // Update videos if provided
    if (Array.isArray(videos)) {
      course.videos = videos.map((video, index) => ({
        ...video,
        order: index, // enforce order field
      }));
      course.videoCount = videos.length;
    }

    await course.save();
    return Response.json(course, { status: 200 });
  } catch (err) {
    console.error('Error updating course:', err);
    return Response.json({ error: 'Failed to update course.' }, { status: 500 });
  }
}

// ===================== DELETE =====================
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

    // Delete thumbnail from Cloudinary if exists
    if (course.titlePhotoUrl) {
      try {
        const publicId = course.titlePhotoUrl.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(`course_thumbnails/${publicId}`);
      } catch (cloudErr) {
        console.warn('Cloudinary delete failed:', cloudErr.message);
      }
    }

    // Delete the course
    await Course.deleteOne({ _id: course._id });

    return Response.json({ message: 'Course deleted successfully.' }, { status: 200 });
  } catch (err) {
    console.error('Error deleting course:', err);
    return Response.json({ error: 'Failed to delete course.' }, { status: 500 });
  }
}

// ===================== POST =====================
export async function POST(req) {
  await connectToDatabase();
  try {
    const body = await req.json();
    const { name, description, videos, titlePhotoBase64 } = body;

    // Upload thumbnail if provided
    let titlePhotoUrl = '';
    if (titlePhotoBase64) {
      const uploadRes = await cloudinary.uploader.upload(titlePhotoBase64, {
        folder: 'course_thumbnails',
      });
      titlePhotoUrl = uploadRes.secure_url;
    }

    // Create new course
    const newCourse = new Course({
      name,
      description,
      videos: (videos || []).map((video, index) => ({
        ...video,
        order: index,
      })),
      videoCount: videos ? videos.length : 0,
      titlePhotoUrl,
    });

    await newCourse.save();
    return Response.json(newCourse, { status: 201 });
  } catch (err) {
    console.error('Error creating course:', err);
    return Response.json({ error: 'Failed to create course.' }, { status: 500 });
  }
}
