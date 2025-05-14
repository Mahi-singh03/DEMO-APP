import { NextResponse } from 'next/server';
import Students from '../../../../models/students';
import jwt from 'jsonwebtoken';
import { v2 as cloudinary } from 'cloudinary';
import connectDB from '../../../../lib/DBconnection';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request) {
  try {
    await connectDB();
    const formData = await request.formData();

    // Extract all fields from formData
    const fields = {};
    for (const [key, value] of formData.entries()) {
      fields[key] = value;
    }

    const {
      fullName,
      fatherName,
      motherName,
      gender,
      emailAddress,
      phoneNumber,
      parentsPhoneNumber,
      dateOfBirth,
      aadharNumber,
      selectedCourse,
      courseDuration,
      address,
      qualification,
      password,
      joiningDate
    } = fields;

    // Validate required fields
    if (!emailAddress || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Validate phone numbers
    if (!/^\d{10}$/.test(phoneNumber)) {
      return NextResponse.json(
        { error: 'Invalid phone number format. Must be 10 digits' },
        { status: 400 }
      );
    }

    if (!/^\d{10}$/.test(parentsPhoneNumber)) {
      return NextResponse.json(
        { error: 'Invalid parents phone number format. Must be 10 digits' },
        { status: 400 }
      );
    }

    // Validate Aadhar number
    if (!/^\d{12}$/.test(aadharNumber)) {
      return NextResponse.json(
        { error: 'Invalid Aadhar number format. Must be 12 digits' },
        { status: 400 }
      );
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
      const field = existingUser.emailAddress === emailAddress.toLowerCase()
        ? 'Email'
        : existingUser.aadharNumber === aadharNumber
          ? 'Aadhar number'
          : 'Phone number';
      return NextResponse.json(
        { error: `${field} is already registered` },
        { status: 409 }
      );
    }

    // Create new user
    const newUser = new Students({
      fullName,
      fatherName,
      motherName,
      gender,
      emailAddress: emailAddress.toLowerCase(),
      phoneNumber,
      parentsPhoneNumber,
      dateOfBirth: new Date(dateOfBirth),
      aadharNumber,
      selectedCourse,
      courseDuration,
      address,
      qualification,
      password,
      joiningDate: new Date(joiningDate)
    });

    await newUser.save();

    // Generate JWT token
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is not defined');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
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
      __v: undefined
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
      return NextResponse.json(
        { error: messages.join('. ') },
        { status: 400 }
      );
    }
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return NextResponse.json({
        error: `${field.charAt(0).toUpperCase() + field.slice(1)} already registered`
      }, { status: 409 });
    }
    return NextResponse.json(
      { error: 'Internal Server Error', details: error.message },
      { status: 500 }
    );
  }
}