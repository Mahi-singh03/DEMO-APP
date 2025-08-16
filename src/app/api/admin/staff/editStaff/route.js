import connectDB from '@/lib/DBconnection';
import Staff from '@/models/staff';

export async function GET(request) {
  await connectDB();
  
  try {
    const { searchParams } = new URL(request.url);
    const name = searchParams.get('name');
    const query = name ? { Name: { $regex: name, $options: 'i' } } : {};
    const staff = await Staff.find(query).sort({ StaffID: 1 });
    return Response.json(staff);
  } catch (error) {
    return Response.json({ message: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  await connectDB();
  
  try {
    const body = await request.json();
    const staff = new Staff(body);
    await staff.save();
    return Response.json(staff, { status: 201 });
  } catch (error) {
    return Response.json({ message: error.message }, { status: 400 });
  }
}