import  connectToDatabase  from '@/lib/DBconnection'; 
import Staff from '@/models/staff';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    // Connect to MongoDB
    await connectToDatabase();

    // Parse request body
    const { staffID, dob } = await request.json();

    // Validate input
    if (!staffID || !dob) {
      return NextResponse.json(
        { error: 'StaffID and DOB are required' },
        { status: 400 }
      );
    }

    // Find staff member by StaffID and DOB
    const staff = await Staff.findOne({
      StaffID: Number(staffID),
      DOB: new Date(dob),
    });

    // Check if staff exists
    if (!staff) {
      return NextResponse.json(
        { error: 'Invalid StaffID or DOB' },
        { status: 404 }
      );
    }

    // Return all staff data
    return NextResponse.json(
      {
        message: 'Staff verified successfully',
        data: {
          Name: staff.Name,
          StaffID: staff.StaffID,
          JoinningData: staff.JoinningData,
          Designation: staff.Designation,
          DOB: staff.DOB,
          LeavingDate: staff.LeavingDate,
          FatherName: staff.FatherName,
          Address: staff.Address,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error verifying staff:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}