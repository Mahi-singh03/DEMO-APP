import { NextResponse } from 'next/server';

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      message: 'Environment check',
      cloudinary: {
        name: process.env.CLOUDINARY_NAME ? 'SET' : 'NOT_SET',
        apiKey: process.env.CLOUDINARY_API_KEY ? 'SET' : 'NOT_SET',
        apiSecret: process.env.CLOUDINARY_API_SECRET ? 'SET' : 'NOT_SET',
      }
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
