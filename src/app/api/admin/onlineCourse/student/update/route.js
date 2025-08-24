import dbConnect from '@/lib/DBconnection';
import CourseRegistration from '@/models/OnlineCourseRegistration';

export async function GET(request) {
  await dbConnect();

  const { searchParams } = request.nextUrl;
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  const search = searchParams.get('search') || '';

  // Build search filter
  const filter = {};
  if (search) {
    filter.$or = [
      { fullName: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { courseSelected: { $regex: search, $options: 'i' } }
    ];
  }

  try {
    const students = await CourseRegistration.find(filter)
      .limit(limit)
      .skip((page - 1) * limit)
      .sort({ registrationTimestamp: -1 })
      .select('-password');

    const total = await CourseRegistration.countDocuments(filter);

    return Response.json({
      success: true,
      data: students,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function POST(request) {
  await dbConnect();

  try {
    const body = await request.json();

    // Check if email already exists
    const existingStudent = await CourseRegistration.findOne({ email: body.email });

    if (existingStudent) {
      return Response.json({
        success: false,
        error: 'Email already registered'
      }, { status: 400 });
    }

    const student = await CourseRegistration.create(body);
    return Response.json({ success: true, data: student }, { status: 201 });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 400 });
  }
}