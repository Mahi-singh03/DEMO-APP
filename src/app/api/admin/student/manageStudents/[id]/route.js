import dbConnect from '@/lib/DBconnection';
import registered_students from '@/models/students';
import { protect } from '@/app/middleware/adminMiddleware';
import cloudinary from '@/lib/cloudinary';

// Get student by ID, rollNo, or phoneNumber
export async function GET(request, { params }) {
  try {
    await dbConnect();
    
    const { id } = params;
    let student;
    
    // Check if it's a MongoDB ID
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      student = await registered_students.findById(id).select('-password');
    } else {
      // Search by rollNo or phoneNumber
      student = await registered_students.findOne({
        $or: [
          { rollNo: id },
          { phoneNumber: id }
        ]
      }).select('-password');
    }
    
    if (!student) {
      return Response.json({
        success: false,
        message: 'Student not found'
      }, { status: 404 });
    }
    
    return Response.json({
      success: true,
      data: student
    });
  } catch (error) {
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}

// Update student
export async function PUT(request, { params }) {
  try {
    await dbConnect();
    
    const { id } = params;
    const body = await request.json();
    let student;
    
    // Check if it's a MongoDB ID
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      student = await registered_students.findById(id);
    } else {
      // Search by rollNo or phoneNumber
      student = await registered_students.findOne({
        $or: [
          { rollNo: id },
          { phoneNumber: id }
        ]
      });
    }
    
    if (!student) {
      return Response.json({
        success: false,
        message: 'Student not found'
      }, { status: 404 });
    }
    
    // If password is being updated, hash it
    if (body.password) {
      const bcrypt = require('bcryptjs');
      const salt = await bcrypt.genSalt(10);
      body.password = await bcrypt.hash(body.password, salt);
    }
    
    // Update student
    const updatedStudent = await registered_students.findByIdAndUpdate(
      student._id,
      body,
      { new: true, runValidators: true }
    ).select('-password');
    
    return Response.json({
      success: true,
      data: updatedStudent
    });
  } catch (error) {
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return Response.json({
        success: false,
        message: `${field} already exists`
      }, { status: 400 });
    } else {
      return Response.json({ success: false, message: error.message }, { status: 400 });
    }
  }
}

// Delete student
export async function DELETE(request, { params }) {
  try {
    await dbConnect();
    
    const { id } = params;
    let student;
    
    // Check if it's a MongoDB ID
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      student = await registered_students.findById(id);
    } else {
      // Search by rollNo or phoneNumber
      student = await registered_students.findOne({
        $or: [
          { rollNo: id },
          { phoneNumber: id }
        ]
      });
    }
    
    if (!student) {
      return Response.json({
        success: false,
        message: 'Student not found'
      }, { status: 404 });
    }
    
    // Delete photo from Cloudinary if exists
    if (student.photo && student.photo.public_id) {
      await cloudinary.uploader.destroy(student.photo.public_id);
    }
    
    await registered_students.findByIdAndDelete(student._id);
    
    return Response.json({
      success: true,
      message: 'Student deleted successfully'
    });
  } catch (error) {
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}