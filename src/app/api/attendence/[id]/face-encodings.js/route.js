import { NextResponse } from 'next/server';
import FaceEncoding from '@/models/faceEncoding';
import dbConnect from '@/lib/DBconnection';

export async function GET(req, { params }) {
  await dbConnect();
  try {
    const { id } = params;
    const encodings = await FaceEncoding.find({ studentId: id })
      .select('createdAt')
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: encodings });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Error fetching face encodings',
      error: error.message
    }, { status: 500 });
  }
}