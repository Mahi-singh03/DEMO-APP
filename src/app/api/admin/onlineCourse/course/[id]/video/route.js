import connectToDatabase from '@/lib/DBconnection';
import Course from '@/models/courseVideos';

// ===================== ADD VIDEO =====================
export async function POST(req, { params }) {
  await connectToDatabase();
  const { id } = params;

  try {
    const body = await req.json();
    const { title, description, videoUrl, duration = 0 } = body;

    if (!title || !videoUrl) {
      return Response.json({ error: 'Title and video URL are required.' }, { status: 400 });
    }

    // Find course by courseId or _id
    let course = await Course.findOne({ courseId: id });
    if (!course) {
      course = await Course.findById(id);
    }

    if (!course) {
      return Response.json({ error: 'Course not found.' }, { status: 404 });
    }

    // Create new video
    const newVideo = {
      title,
      description,
      videoUrl,
      duration,
      order: course.videos.length, // append at the end
    };

    // Add video to course
    course.videos.push(newVideo);
    course.videoCount = course.videos.length;

    await course.save();
    return Response.json(course, { status: 201 });
  } catch (err) {
    console.error('Error adding video:', err);
    return Response.json({ error: 'Failed to add video.' }, { status: 500 });
  }
}

// ===================== UPDATE VIDEO =====================
export async function PUT(req, { params }) {
  await connectToDatabase();
  const { id } = params;

  try {
    const body = await req.json();
    const { videoId, title, description, videoUrl, duration, order } = body;

    if (!videoId) {
      return Response.json({ error: 'Video ID is required.' }, { status: 400 });
    }

    // Find course by courseId or _id
    let course = await Course.findOne({ courseId: id });
    if (!course) {
      course = await Course.findById(id);
    }

    if (!course) {
      return Response.json({ error: 'Course not found.' }, { status: 404 });
    }

    // Find the video
    const videoIndex = course.videos.findIndex(v => v._id.toString() === videoId);
    if (videoIndex === -1) {
      return Response.json({ error: 'Video not found.' }, { status: 404 });
    }

    // Update video fields
    if (title !== undefined) course.videos[videoIndex].title = title;
    if (description !== undefined) course.videos[videoIndex].description = description;
    if (videoUrl !== undefined) course.videos[videoIndex].videoUrl = videoUrl;
    if (duration !== undefined) course.videos[videoIndex].duration = duration;
    if (order !== undefined) {
      course.videos[videoIndex].order = order;

      // Sort and reindex orders so they are consecutive
      course.videos.sort((a, b) => a.order - b.order);
      course.videos.forEach((v, idx) => (v.order = idx));
    }

    await course.save();
    return Response.json(course, { status: 200 });
  } catch (err) {
    console.error('Error updating video:', err);
    return Response.json({ error: 'Failed to update video.' }, { status: 500 });
  }
}

// ===================== DELETE VIDEO =====================
export async function DELETE(req, { params }) {
  await connectToDatabase();
  const { id } = params;
  const { searchParams } = new URL(req.url);
  const videoId = searchParams.get('videoId');

  try {
    if (!videoId) {
      return Response.json({ error: 'Video ID is required.' }, { status: 400 });
    }

    // Find course by courseId or _id
    let course = await Course.findOne({ courseId: id });
    if (!course) {
      course = await Course.findById(id);
    }

    if (!course) {
      return Response.json({ error: 'Course not found.' }, { status: 404 });
    }

    // Remove the video
    course.videos = course.videos.filter(v => v._id.toString() !== videoId);

    // Reorder remaining videos to keep order consistent
    course.videos.forEach((video, index) => {
      video.order = index;
    });

    course.videoCount = course.videos.length;

    await course.save();
    return Response.json(course, { status: 200 });
  } catch (err) {
    console.error('Error deleting video:', err);
    return Response.json({ error: 'Failed to delete video.' }, { status: 500 });
  }
}
