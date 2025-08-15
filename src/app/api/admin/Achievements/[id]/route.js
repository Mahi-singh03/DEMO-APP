// app/api/achievements/[id]/route.js
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

export async function PUT(req, { params }) {
  try {
    await connectDB();
    const formData = await req.formData();
    const title = formData.get('title');
    const description = formData.get('description');
    const studentName = formData.get('studentName');
    const date = formData.get('date');
    const photoFile = formData.get('photo');

    const achievement = await Achievement.findById(params.id);
    if (!achievement) {
      return NextResponse.json({ error: 'Achievement not found' }, { status: 404 });
    }

    if (title) achievement.title = title;
    if (description) achievement.description = description;
    if (studentName) achievement.studentName = studentName;
    if (date) achievement.date = new Date(date);

    if (photoFile) {
      // Upload new photo to Cloudinary
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

      // Delete old photo if exists
      if (achievement.photo && achievement.photo.publicId) {
        await cloudinary.uploader.destroy(achievement.photo.publicId);
      }

      achievement.photo = {
        publicId: uploadResult.public_id,
        url: uploadResult.secure_url,
      };
    }

    await achievement.save();
    return NextResponse.json(achievement);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await connectDB();
    const achievement = await Achievement.findById(params.id);
    if (!achievement) {
      return NextResponse.json({ error: 'Achievement not found' }, { status: 404 });
    }

    // Delete photo from Cloudinary if exists
    if (achievement.photo && achievement.photo.publicId) {
      await cloudinary.uploader.destroy(achievement.photo.publicId);
    }

    await Achievement.findByIdAndDelete(params.id);
    return NextResponse.json({ message: 'Achievement deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}