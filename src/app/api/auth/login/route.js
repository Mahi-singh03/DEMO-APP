import { NextResponse } from 'next/server';
import { Registered_Students } from '../../../../models/students.js';
import connectDB from '../../../../lib/connection.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(req) {
  try {
    await connectDB();

    const { emailAddress, password } = await req.json();

    // Validate required fields
    if (!emailAddress || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    // Find student
    const student = await Registered_Students.findOne({
      emailAddress: emailAddress.toLowerCase(),
    });

    if (!student) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: student._id, email: student.emailAddress },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Prepare response
    const studentResponse = {
      ...student.toObject(),
      password: undefined,
      __v: undefined,
      photo: student.photo
        ? { url: student.photo.url, message: 'Photo available' }
        : { message: 'No photo available' },
    };

    return NextResponse.json({
      message: 'Login successful',
      student: studentResponse,
      token,
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}