import { NextResponse } from 'next/server';
import Students from '@/models/students.js';
import jwt from 'jsonwebtoken';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';
import { connectDB } from '@/lib/DBconnection.js';
import { File } from 'buffer';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Helper function to upload photo to Cloudinary
async function uploadToCloudinary(fileBuffer, mimetype, rollNo) {
  const b64 = Buffer.from(fileBuffer).toString("base64");
  const dataURI = "data:" + mimetype + ";base64," + b64;

  return await cloudinary.uploader.upload(dataURI, {
    folder: 'StudentProfilePhoto',
    public_id: `student_${rollNo}_${Date.now()}`,
    transformation: [
      { width: 500, height: 500, crop: 'fill', gravity: 'face' },
      { quality: 'auto:best' }
    ]
  });
}

export async function POST(request) {
  try {
    await connectDB();
    const formData = await request.formData();
    const file = formData.get('photo');
    const emailAddress = formData.get('emailAddress');
    const password = formData.get('password');
    const phoneNumber = formData.get('phoneNumber');
    const aadharNumber = formData.get('aadharNumber');
    const rollNo = formData.get('rollNo');

    // Validate required fields
    if (!emailAddress || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    // Validate phone number (10 digits)
    if (!/^\d{10}$/.test(phoneNumber)) {
      return NextResponse.json({ error: 'Invalid phone number format. Must be 10 digits' }, { status: 400 });
    }

    // Validate Aadhar number (12 digits)
    if (!/^\d{12}$/.test(aadharNumber)) {
      return NextResponse.json({ error: 'Invalid Aadhar number format. Must be 12 digits' }, { status: 400 });
    }

    // Check for existing user
    const existingUser = await Students.findOne({
      $or: [
        { emailAddress: emailAddress.toLowerCase() },
        { aadharNumber },
        { phoneNumber }
      ]
    });

    if (existingUser) {
      const field = existingUser.emailAddress === emailAddress.toLowerCase() ? 'Email' :
                   existingUser.aadharNumber === aadharNumber ? 'Aadhar number' :
                   'Phone number';
      return NextResponse.json({ error: `${field} is already registered` }, { status: 409 });
    }

    let photoData = null;
    if (file) {
      // Validate file type and size
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json({ error: 'Only JPEG, PNG, and JPG files are allowed' }, { status: 400 });
      }
      if (file.size > 2 * 1024 * 1024) {
        return NextResponse.json({ error: 'File size must not exceed 2MB' }, { status: 400 });
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const cloudinaryResponse = await uploadToCloudinary(buffer, file.type, rollNo || 'new');
      photoData = {
        public_id: cloudinaryResponse.public_id,
        url: cloudinaryResponse.secure_url
      };
    }

    // Create new user
    const newUser = new Students({
      emailAddress: emailAddress.toLowerCase(),
      password,
      phoneNumber,
      aadharNumber,
      rollNo,
      ...(photoData && { photo: photoData })
    });

    await newUser.save();

    // Generate JWT token
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is not defined');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const token = jwt.sign(
      { id: newUser._id, email: newUser.emailAddress },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Prepare response
    const userResponse = {
      ...newUser.toObject(),
      password: undefined,
      __v: undefined,
      photo: photoData 
        ? { url: photoData.url, message: 'Photo uploaded successfully' }
        : { message: 'No photo uploaded' }
    };

    return NextResponse.json({
      message: 'Registration successful',
      student: userResponse,
      token
    }, { status: 201 });

  } catch (error) {
    console.error('Registration error:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return NextResponse.json({ error: messages.join('. ') }, { status: 400 });
    }
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return NextResponse.json({
        error: `${field.charAt(0).toUpperCase() + field.slice(1)} already registered`
      }, { status: 409 });
    }
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}
