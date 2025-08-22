// import connectDB from '@/lib/DBconnection';
// import registered_students from '@/models/students';
// import { NextResponse } from 'next/server';

// export async function GET(request) {
//   await connectDB();
//   const { searchParams } = new URL(request.url);
//   const identifier = searchParams.get('identifier');

//   if (!identifier) {
//     return NextResponse.json({ error: 'Identifier is required' }, { status: 400 });
//   }

//   // Search by rollNo, phoneNumber, or emailAddress
//   const student = await registered_students.findOne({
//     $or: [
//       { rollNo: identifier },
//       { phoneNumber: identifier },
//       { emailAddress: identifier }
//     ]
//   }).select('-password');

//   if (!student) {
//     return NextResponse.json({ error: 'Student not found' }, { status: 404 });
//   }

//   return NextResponse.json({ student }, { status: 200 });
// }