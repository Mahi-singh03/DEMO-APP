import dbConnect from '@/lib/DBconnection';
import registered_students from '@/models/students';
import cloudinary from '@/lib/cloudinary';

// Upload profile photo
export async function PUT(request, { params }) {
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
    
    // For file uploads, you'll need to use a different approach
    // This is a simplified version - you might want to use FormData or a file upload service
    const formData = await request.formData();
    const file = formData.get('photo');
    
    if (!file) {
      return Response.json({
        success: false,
        message: 'No photo file provided'
      }, { status: 400 });
    }
    
    // Convert file to buffer for Cloudinary
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Delete old photo from Cloudinary if exists
    if (student.photo && student.photo.public_id) {
      try {
        await cloudinary.uploader.destroy(student.photo.public_id);
      } catch (cloudinaryError) {
        console.error('Error deleting old photo:', cloudinaryError);
      }
    }
    
    // Upload new photo to Cloudinary using base64
    const base64String = buffer.toString('base64');
    const dataURI = `data:${file.type};base64,${base64String}`;
    
    const result = await cloudinary.uploader.upload(dataURI, {
      folder: 'student-photos',
      transformation: [
        { width: 300, height: 300, crop: 'fill' },
        { quality: 'auto' },
        { format: 'auto' }
      ]
    });
    
    // Update student with new photo details
    student.photo = {
      public_id: result.public_id,
      url: result.secure_url
    };
    
    await student.save();
    
    return Response.json({
      success: true,
      data: {
        photo: student.photo
      }
    });
  } catch (error) {
    console.error('Photo upload error:', error);
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}

// Delete profile photo
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
      try {
        await cloudinary.uploader.destroy(student.photo.public_id);
      } catch (cloudinaryError) {
        console.error('Error deleting photo from Cloudinary:', cloudinaryError);
      }
      
      // Remove photo from student record
      student.photo = {
        public_id: null,
        url: null
      };
      
      await student.save();
    }
    
    return Response.json({
      success: true,
      message: 'Photo deleted successfully'
    });
  } catch (error) {
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};