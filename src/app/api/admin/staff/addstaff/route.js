import dbConnect from '@/lib/DBconnection';
import Staff from '@/models/staff';

export async function POST(request) {
  await dbConnect();

  try {
    const body = await request.json();
    const newStaff = new Staff(body);
    await newStaff.save();
    return Response.json(newStaff, { status: 201 });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return Response.json({ message: error.message }, { status: 400 });
    }
    if (error.code === 11000) {
      return Response.json({ message: 'StaffID already exists' }, { status: 400 });
    }
    return Response.json({ message: 'Server error' }, { status: 500 });
  }
}