import { NextResponse } from 'next/server';
import dbConnect from '@/lib/DBconnection';
import Attendance from '@/models/attendance';

export async function GET() {
  await dbConnect();
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const records = await Attendance.find({
      date: { $gte: startOfDay, $lte: endOfDay }
    }).populate('studentId', 'fullName');

    return NextResponse.json({ success: true, data: records });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Error fetching today\'s attendance',
      error: error.message
    }, { status: 500 });
  }
}


