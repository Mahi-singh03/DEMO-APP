
import dbConnect from '@/lib/DBconnection';
import CourseRegistration from '@/models/OnlineCourseRegistration';
import bcrypt from 'bcryptjs';

export async function GET(request, { params }) {
  await dbConnect();
  const { id } = params;
  try {
    const student = await CourseRegistration.findById(id).select('-password');
    if (!student) {
      return new Response(JSON.stringify({ success: false, error: 'Student not found' }), { status: 404 });
    }
    return new Response(JSON.stringify({ success: true, data: student }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 400 });
  }
}

export async function PUT(request, { params }) {
  await dbConnect();
  const { id } = params;
  try {
    const body = await request.json();
    let updateData = { ...body };
    if (body.password) {
      const saltRounds = 10;
      updateData.password = await bcrypt.hash(body.password, saltRounds);
    } else {
      delete updateData.password;
    }
    const student = await CourseRegistration.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).select('-password');
    if (!student) {
      return new Response(JSON.stringify({ success: false, error: 'Student not found' }), { status: 404 });
    }
    return new Response(JSON.stringify({ success: true, data: student }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 400 });
  }
}

export async function DELETE(request, { params }) {
  await dbConnect();
  const { id } = params;
  try {
    const deletedStudent = await CourseRegistration.deleteOne({ _id: id });
    if (!deletedStudent.deletedCount) {
      return new Response(JSON.stringify({ success: false, error: 'Student not found' }), { status: 404 });
    }
    return new Response(JSON.stringify({ success: true, data: {} }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 400 });
  }
}