import { NextResponse } from 'next/server';
import Student from '@/models/students';
import dbConnect from '@/lib/DBconnection';

export async function GET(req) {
  await dbConnect();
  try {
    const { searchParams } = new URL(req.url);
    const rollNo = searchParams.get('rollNo');
    const phoneNumber = searchParams.get('phoneNumber');

    if (!rollNo && !phoneNumber) {
      return NextResponse.json({
        success: false,
        message: 'Please provide either roll number or phone number'
      }, { status: 400 });
    }

    const query = {};
    if (rollNo) query.rollNo = rollNo;
    if (phoneNumber) query.phoneNumber = phoneNumber;

    const student = await Student.findOne(query).select('-password');
    if (!student) {
      return NextResponse.json({
        success: false,
        message: 'Student not found'
      }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: student });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Server error',
      error: error.message
    }, { status: 500 });
  }
}