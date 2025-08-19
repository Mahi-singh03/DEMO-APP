import { NextResponse } from 'next/server';
import registered_students from '../../../../models/students'; 
import dbConnect from '../../../../lib/DBconnection'; 
import staff from "../../../../models/staff"

export async function GET(request) {
  await dbConnect();

  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');

  try {
    switch (type) {
      case 'total':
        const totalStudents = await registered_students.countDocuments();
        return NextResponse.json({
          success: true,
          data: { totalStudents },
          message: 'Total students count retrieved successfully',
        }, { status: 200 });

      case 'active':
        const activeStudents = await registered_students.countDocuments({ certificate: false });
        return NextResponse.json({
          success: true,
          data: { activeStudents },
          message: 'Active students count retrieved successfully',
        }, { status: 200 });

      case 'certified':
        const certifiedStudents = await registered_students.countDocuments({ certificate: true });
        return NextResponse.json({
          success: true,
          data: { certifiedStudents },
          message: 'Certified students count retrieved successfully',
        }, { status: 200 });

      case 'staff':
        const certifiedStaff = await staff.countDocuments();
        return NextResponse.json({
          success: true,
          data: { certifiedStaff },
          message: 'Staff count retrieved successfully',
        }, { status: 200 });

      default:
        return NextResponse.json({
          success: false,
          message: 'Invalid query type',
        }, { status: 400 });
    }
  } catch (error) {
    console.error(`Error fetching ${type} stats:`, error);
    return NextResponse.json({
      success: false,
      message: `Error retrieving ${type} stats`,
      error: error.message,
    }, { status: 500 });
  }
}