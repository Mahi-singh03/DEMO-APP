import { NextResponse } from 'next/server';
import formidable from 'formidable';
import { Registered_Students } from '../../../../models/register';
import connectDB from '../../../../lib/mongodb';
import { uploadToCloudinary } from '../../../../lib/cloudinary';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export async function POST(req) {
  try {
    await connectDB();

    const form = formidable({
      maxFileSize: 2 * 1024 * 1024, // 2MB limit
      filter: ({ mimetype }) => ['image/jpeg', 'image/png', 'image/jpg'].includes(mimetype),
    });

    const [fields, files] = await form.parse(req);
    const { emailAddress, password, phoneNumber, aadharNumber, rollNo } = fields;
    const photo = files.photo?.[0];

    // Validate required fields
    if (!emailAddress || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    // Validate phone number
    if (!/^\d{10}$/.test(phoneNumber)) {
      return NextResponse.json({ error: 'Invalid phone number format. Must be 10 digits' }, { status: 400 });
    }

    // Validate Aadhar number
    if (!/^\d{12}$/.test(aadharNumber)) {
      return NextResponse.json({ error: 'Invalid Aadhar number format. Must be 12 digits' }, { status: 400 });
    }

    // Check for existing user
    const existingUser = await Registered_Students.findOne({
      $or: [
        { emailAddress: emailAddress.toLowerCase() },
        { aadharNumber },
        { phoneNumber },
      ],
    });

    if (existingUser) {
      const field = existingUser.emailAddress === emailAddress.toLowerCase() ? 'Email' :
                    existingUser.aadharNumber === aadharNumber ? 'Aadhar number' : 'Phone number';
      return NextResponse.json({ error: `${field} is already registered` }, { status: 409 });
    }

    let photoData = null;
    if (photo) {
      const cloudinaryResponse = await uploadToCloudinary(
        await photo.arrayBuffer(),
        photo.mimetype,
        rollNo || 'new'
      );
      photoData = {
        public_id: cloudinaryResponse.public_id,
        url: cloudinaryResponse.secure_url,
      };
    }

    // Create new user
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new Registered_Students({
      emailAddress: emailAddress.toLowerCase(),
      password: hashedPassword,
      phoneNumber,
      aadharNumber,
      rollNo,
      ...(photoData && { photo: photoData }),
    });

    await newUser.save();

    // Generate JWT token
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
        : { message: 'No photo uploaded' },
    };

    return NextResponse.json({
      message: 'Registration successful',
      student: userResponse,
      token,
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
        error: `${field.charAt(0).toUpperCase() + field.slice(1)} already registered`,
      }, { status: 409 });
    }
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}