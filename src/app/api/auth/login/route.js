import { NextResponse } from 'next/server';
import Students from '../../../../models/students';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import connectDB from '../../../../lib/DBconnection';

export async function POST(request) {
  try {
    await connectDB();
    const { emailAddress, password } = await request.json();

    // Validate required fields
    if (!emailAddress || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    // Find student by email
    const student = await Students.findOne({
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
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is not defined');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

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
    }, { status: 200 });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}
