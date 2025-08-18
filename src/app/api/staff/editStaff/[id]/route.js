import connectDB from '@/lib/DBconnection';
import Staff from '@/models/staff';

export async function GET(request, { params }) {
  await connectDB();
  const { id } = params;

  // Input validation
  if (!id) {
    return Response.json({ message: 'Staff ID is required' }, { status: 400 });
  }

  try {
    const staff = await Staff.findOne({ StaffID: id });
    if (!staff) {
      return Response.json({ message: 'Staff not found' }, { status: 404 });
    }
    return Response.json(staff);
  } catch (error) {
    console.error('API Error:', error);
    return Response.json({ message: 'An unexpected error occurred' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  await connectDB();
  const { id } = params;

  // Input validation
  if (!id) {
    return Response.json({ message: 'Staff ID is required' }, { status: 400 });
  }

  try {
    const body = await request.json();
    
    // Validate request body
    if (!body || Object.keys(body).length === 0) {
      return Response.json({ message: 'Request body is required' }, { status: 400 });
    }

    const updatedStaff = await Staff.findOneAndUpdate(
      { StaffID: id },
      body,
      { new: true, runValidators: true }
    );
    
    if (!updatedStaff) {
      return Response.json({ message: 'Staff not found' }, { status: 404 });
    }
    return Response.json(updatedStaff);
  } catch (error) {
    console.error('API Error:', error);
    const statusCode = error.name === 'ValidationError' ? 400 : 500;
    return Response.json({
      message: error.message || 'An unexpected error occurred'
    }, { status: statusCode });
  }
}

export async function DELETE(request, { params }) {
  await connectDB();
  const { id } = params;

  // Input validation
  if (!id) {
    return Response.json({ message: 'Staff ID is required' }, { status: 400 });
  }

  try {
    const deletedStaff = await Staff.findOneAndDelete({ StaffID: id });
    if (!deletedStaff) {
      return Response.json({ message: 'Staff not found' }, { status: 404 });
    }
    return Response.json({ message: 'Staff deleted successfully' });
  } catch (error) {
    console.error('API Error:', error);
    return Response.json({ message: 'An unexpected error occurred' }, { status: 500 });
  }
}