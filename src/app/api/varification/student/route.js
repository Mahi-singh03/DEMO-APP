import  connectToDatabase  from '@/lib/DBconnection'; 
import registered_students from '@/models/students'; 
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    // Connect to MongoDB
    await connectToDatabase();

    // Parse request body
    const { rollNo, dob } = await request.json();

    // Validate input
    if (!rollNo || !dob) {
      return NextResponse.json(
        { error: 'RollNo and DOB are required' },
        { status: 400 }
      );
    }

    // Find student by RollNo and DOB
    const student = await registered_students.findOne({
      rollNo: rollNo,
      dateOfBirth: new Date(dob),
    });

    // Check if student exists
    if (!student) {
      return NextResponse.json(
        { error: 'Invalid RollNo or DOB' },
        { status: 404 }
      );
    }

    // Return requested student data
    return NextResponse.json(
      {
        message: 'Student verified successfully',
        data: {
          name: student.fullName,
          parentsName: {
            fatherName: student.fatherName,
            motherName: student.motherName,
          },
          photo: {
            public_id: student.photo.public_id,
            url: student.photo.url,
          },
          courseDuration: student.courseDuration,
          startDate: student.joiningDate,
          endDate: student.farewellDate,
          aadharNumber: student.aadharNumber,
          percentage: student.percentage,
          phoneNumber: student.phoneNumber,
          finalGrade: student.finalGrade,
          certificate: student.certificate,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error verifying student:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}