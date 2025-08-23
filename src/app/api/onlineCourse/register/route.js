
import mongoose from 'mongoose';
import CourseRegistration from '@/models/OnlineCourseRegistration';

export async function POST(request) {
  try {
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGO_URI);
    }

    const body = await request.json();
    const { fullName, fatherName, phoneNumber, email, courseSelected } = body;

    if (!fullName || !fatherName || !phoneNumber || !email || !courseSelected) {
      return new Response(JSON.stringify({ error: 'All fields are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const registration = new CourseRegistration({
      fullName,
      fatherName,
      phoneNumber,
      email,
      courseSelected,
      role: 'online-course-student',
    });
    const savedRegistration = await registration.save();

    return new Response(
      JSON.stringify({
        message: 'Registration successful',
        data: {
          fullName: savedRegistration.fullName,
          fatherName: savedRegistration.fatherName,
          phoneNumber: savedRegistration.phoneNumber,
          email: savedRegistration.email,
          courseSelected: savedRegistration.courseSelected,
          registrationTimestamp: savedRegistration.registrationTimestamp,
          role: savedRegistration.role,
        },
      }),
      {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Registration API error:', error);
    if (error.code === 11000) {
      return new Response(JSON.stringify({ error: 'Email already registered' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}