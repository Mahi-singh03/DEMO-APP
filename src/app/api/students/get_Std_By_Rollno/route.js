import { NextResponse } from 'next/server';
import StudentS from '../../../../models/students';
import connectDB from '../../../../lib/DBconnection';

export async function GET(request, { params }) {
  try {
    await connectDB();
    const { rollNo } = params;

    if (!rollNo) {
      return NextResponse.json({ error: 'Roll number is required' }, { status: 400 });
    }

    const student = await StudentS.findOne({ rollNo });

    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    const studentResponse = {
      ...student.toObject(),
      password: undefined,
      __v: undefined,
      photo: student.photo 
        ? { url: student.photo.url, message: 'Photo available' }
        : { message: 'No photo available' }
    };

    return NextResponse.json({
      message: 'Student details retrieved successfully',
      student: studentResponse
    }, { status: 200 });

  } catch (error) {
    console.error('Get student by roll number error:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}