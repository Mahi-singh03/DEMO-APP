import { NextResponse } from 'next/server';
import dbConnect from '@/lib/DBconnection';
import Attendance from '@/models/attendance';
import Student from '@/models/students';

export async function POST(req) {
  await dbConnect();
  try {
    const { studentId, rollNo } = await req.json();
    if (!studentId || !rollNo) {
      return NextResponse.json({ success: false, message: 'studentId and rollNo are required' }, { status: 400 });
    }

    const student = await Student.findById(studentId);
    if (!student) {
      return NextResponse.json({ success: false, message: 'Student not found' }, { status: 404 });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existing = await Attendance.findOne({ studentId, date: { $gte: today } });
    if (existing) {
      return NextResponse.json({ success: true, message: 'Attendance already marked for today', data: existing });
    }

    const record = new Attendance({
      studentId,
      rollNo,
      status: 'Present',
      checkInTime: new Date()
    });
    await record.save();

    return NextResponse.json({ success: true, data: record }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Error marking attendance', error: error.message }, { status: 500 });
  }
}


