// app/api/achievements/route.js
import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import connectDB from '@/lib/DBconnection';
import Achievement from '@/models/achievements';

export const runtime = 'nodejs';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req) {
  try {
    await connectDB();
    const formData = await req.formData();
    const title = formData.get('title');
    const description = formData.get('description');
    const studentName = formData.get('studentName');
    const date = formData.get('date');
    const photoFile = formData.get('photo');

    if (!title || !description || !studentName || !date || !photoFile) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Upload photo to Cloudinary
    const bytes = await photoFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'achievements' },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(buffer);
    });

    const photo = {
      publicId: uploadResult.public_id,
      url: uploadResult.secure_url,
    };

    const achievement = new Achievement({
      title,
      description,
      studentName,
      date: new Date(date),
      photo,
    });

    await achievement.save();
    return NextResponse.json(achievement, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Optional: GET all achievements
export async function GET() {
  try {
    await connectDB();
    const achievements = await Achievement.find({});
    return NextResponse.json(achievements);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}