import { NextResponse } from 'next/server';
import registered_students from '@/models/students.js';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/DBconnection';
import { registrationLimiter } from '@/app/middleware/rateLimiter';

export async function POST(request) {
  try {
    // Apply rate limiter
    const rateLimitResult = await registrationLimiter(request);
    if (rateLimitResult) {
      return rateLimitResult;
    }

    // Check for required environment variables
    if (!process.env.MONGO_URI) {
      console.error('MONGO_URI is not defined');
      return NextResponse.json(
        { error: 'Server configuration error: Database connection string is missing' },
        { status: 500 }
      );
    }

    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is not defined');
      return NextResponse.json(
        { error: 'Server configuration error: JWT secret is missing' },
        { status: 500 }
      );
    }

    await connectDB();
    
    // Parse JSON body
    let requestBody;
    try {
      requestBody = await request.json();
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid JSON payload' },
        { status: 400 }
      );
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
      joiningDate,
    } = requestBody;

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
    const existingUser = await registered_students.findOne({
      $or: [
        { emailAddress: emailAddress.toLowerCase() },
        { aadharNumber },
        { phoneNumber },
      ],
    }).select('+password');

    if (existingUser) {
      const field =
        existingUser.emailAddress === emailAddress.toLowerCase()
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
    const newUser = new registered_students({
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
      joiningDate: new Date(joiningDate),
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
    };

    return NextResponse.json(
      {
        message: 'Registration successful',
        student: userResponse,
        token,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    
    // Handle specific error types
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return NextResponse.json(
        { error: validationErrors.join('. ') },
        { status: 400 }
      );
    }
    
    if (error.name === 'MongoServerError' && error.code === 11000) {
      return NextResponse.json(
        { error: 'A user with this email, phone number, or Aadhar number already exists' },
        { status: 409 }
      );
    }

    // Generic error response
    return NextResponse.json(
      { error: 'Registration failed. Please try again.' },
      { status: 500 }
    );
  }
}