import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Check environment variables
    const envCheck = {
      CLOUDINARY_NAME: process.env.CLOUDINARY_NAME ? 'SET' : 'NOT_SET',
      CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY ? 'SET' : 'NOT_SET',
      CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET ? 'SET' : 'NOT_SET',
      NODE_ENV: process.env.NODE_ENV || 'NOT_SET',
    };

    // Check if all required variables are present
    const allSet = Object.values(envCheck).every(value => value === 'SET');
    
    return NextResponse.json({
      success: true,
      message: allSet ? 'All Cloudinary environment variables are set' : 'Some Cloudinary environment variables are missing',
      environment: envCheck,
      allVariablesSet: allSet
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Failed to check environment variables',
      details: error.message
    }, { status: 500 });
  }
}
