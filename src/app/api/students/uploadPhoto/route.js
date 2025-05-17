import { NextResponse } from 'next/server';
import Students from '../../../../models/students';
import { v2 as cloudinary } from 'cloudinary';
import connectDB from '../../../../lib/DBconnection';

export async function POST(request) {
  try {
    await connectDB();
    const formData = await request.formData();
    const file = formData.get('photo');
    const rollNo = formData.get('rollNo');

    if (!file) {
      return NextResponse.json({ error: 'No photo uploaded' }, { status: 400 });
    }

    if (!rollNo) {
      return NextResponse.json({ error: 'Roll number is required' }, { status: 400 });
    }

    // Validate file type and size
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Only JPEG, PNG, and JPG files are allowed' }, { status: 400 });
    }
    if (file.size > 2 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size must not exceed 2MB' }, { status: 400 });
    }

    const student = await Students.findOne({ rollNo });
    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    // Delete old photo from Cloudinary if exists
    if (student.photo?.public_id) {
      try {
        await cloudinary.uploader.destroy(student.photo.public_id);
      } catch (cloudinaryErr) {
        console.error('Error deleting old photo:', cloudinaryErr);
      }
    }

    // Upload new photo to Cloudinary
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const cloudinaryResponse = await uploadToCloudinary(buffer, file.type, rollNo);

    // Update student record with photo details
    student.photo = {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url,
    };

    await student.save();

    return NextResponse.json({
      message: 'Photo updated successfully',
      photo: {
        public_id: cloudinaryResponse.public_id,
        url: cloudinaryResponse.secure_url,
        size: file.size,
      },
    }, { status: 200 });

  } catch (error) {
    console.error('Photo update error:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}