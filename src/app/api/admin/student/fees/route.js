import mongoose from 'mongoose';
import registered_students from '@/models/students'; 
import connectDB from '@/lib/DBconnection';

// GET - Fetch students with filtering options
export async function GET(request) {
  await connectDB();

  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const phoneNumber = searchParams.get('phoneNumber');
    const rollNo = searchParams.get('rollNo');
    const name = searchParams.get('name');
    const feeStatus = searchParams.get('feeStatus'); // 'paid', 'unpaid', or 'partial'
    const courseCompleted = searchParams.get('courseCompleted'); // 'true' or 'false'
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 15;
    const skip = (page - 1) * limit;

    // Build query object
    let query = {};

    // Search across multiple fields
    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { rollNo: { $regex: search, $options: 'i' } },
        { phoneNumber: { $regex: search, $options: 'i' } },
        { emailAddress: { $regex: search, $options: 'i' } }
      ];
    }

    // Specific field searches
    if (phoneNumber) query.phoneNumber = phoneNumber;
    if (rollNo) query.rollNo = rollNo;
    if (name) query.fullName = { $regex: name, $options: 'i' };

    // Get total count for pagination
    const totalStudents = await registered_students.countDocuments(query);
    const totalPages = Math.ceil(totalStudents / limit);

    // Fetch students with basic info and pagination
    let students = await registered_students.find(query)
      .select('fullName photo rollNo phoneNumber emailAddress feeDetails farewellDate')
      .skip(skip)
      .limit(limit)
      .lean();

    // Apply fee status filter
    if (feeStatus) {
      students = students.filter(student => {
        const { totalFees, remainingFees } = student.feeDetails || { totalFees: 0, remainingFees: 0 };
        
        if (feeStatus === 'paid') return remainingFees === 0;
        if (feeStatus === 'unpaid') return remainingFees === totalFees;
        if (feeStatus === 'partial') return remainingFees > 0 && remainingFees < totalFees;
        return true;
      });
    }

    // Apply course completion filter
    if (courseCompleted) {
      const isCompleted = courseCompleted === 'true';
      const currentDate = new Date();
      
      students = students.filter(student => {
        const completed = student.farewellDate && new Date(student.farewellDate) < currentDate;
        return isCompleted ? completed : !completed;
      });
    }

    // Format response with fee status
    const formattedStudents = students.map(student => {
      const { totalFees = 0, remainingFees = 0, installmentDetails = [] } = student.feeDetails || {};
      const paidFees = totalFees - remainingFees;
      
      let feeStatus = 'unpaid';
      if (remainingFees === 0 && totalFees > 0) feeStatus = 'paid';
      else if (paidFees > 0 && remainingFees > 0) feeStatus = 'partial';
      
      const currentDate = new Date();
      const isCourseCompleted = student.farewellDate && new Date(student.farewellDate) < currentDate;
      
      return {
        _id: student._id,
        fullName: student.fullName,
        photo: student.photo || null,
        rollNo: student.rollNo,
        phoneNumber: student.phoneNumber,
        emailAddress: student.emailAddress,
        feeDetails: {
          totalFees,
          paidFees,
          remainingFees,
          status: feeStatus,
          installmentDetails: installmentDetails.map(installment => ({
            amount: installment.amount,
            submissionDate: installment.submissionDate,
            paid: installment.paid,
            payments: installment.payments || []
          }))
        },
        isCourseCompleted
      };
    });

    return Response.json({
      success: true,
      count: formattedStudents.length,
      totalStudents,
      totalPages,
      currentPage: page,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
      data: formattedStudents
    });
  } catch (error) {
    console.error('API Error:', error);
    return Response.json({
      success: false,
      message: 'Server Error',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    }, { status: 500 });
  }
}

// POST - Add a new student
export async function POST(request) {
  await connectDB();

  try {
    const studentData = await request.json();
    
    // Check if student already exists
    const existingStudent = await registered_students.findOne({
      $or: [
        { emailAddress: studentData.emailAddress },
        { aadharNumber: studentData.aadharNumber }
      ]
    });
    
    if (existingStudent) {
      return Response.json({
        success: false,
        message: 'Student with this email or Aadhar number already exists'
      }, { status: 400 });
    }
    
    const student = await registered_students.create(studentData);
    return Response.json({
      success: true,
      data: student
    }, { status: 201 });
  } catch (error) {
    console.error('API Error:', error);
    return Response.json({
      success: false,
      message: 'Server Error',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    }, { status: 500 });
  }
}

// PUT - Update fee structure for a student
export async function PUT(request) {
  await connectDB();

  try {
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get('id');
    const feeData = await request.json();

    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      return Response.json({
        success: false,
        message: 'Invalid student ID'
      }, { status: 400 });
    }

    const student = await registered_students.findById(studentId);
    
    if (!student) {
      return Response.json({
        success: false,
        message: 'Student not found'
      }, { status: 404 });
    }

    // Update fee details
    if (feeData.totalFees !== undefined) {
      student.feeDetails.totalFees = feeData.totalFees;
      
      // If remainingFees is not provided, set it to totalFees
      if (feeData.remainingFees === undefined) {
        student.feeDetails.remainingFees = feeData.totalFees;
      }
    }

    if (feeData.remainingFees !== undefined) {
      student.feeDetails.remainingFees = feeData.remainingFees;
    }

    if (feeData.installments !== undefined) {
      student.feeDetails.installments = feeData.installments;
      
      // Regenerate installment details if installments changed
      if (student.feeDetails.totalFees && feeData.installments) {
        const amountPerInstallment = Math.floor(student.feeDetails.totalFees / feeData.installments);
        const remainingAmount = student.feeDetails.totalFees % feeData.installments;
        const joining = new Date(student.joiningDate);
        
        student.feeDetails.installmentDetails = Array.from({ length: feeData.installments }, (_, index) => {
          const submissionDate = new Date(joining);
          submissionDate.setMonth(joining.getMonth() + index);
          
          // Distribute remaining amount to first installment
          const installmentAmount = index === 0 ? amountPerInstallment + remainingAmount : amountPerInstallment;
          
          return {
            amount: installmentAmount,
            submissionDate,
            paid: false
          };
        });
      }
    }

    await student.save();

    return Response.json({
      success: true,
      message: 'Fee details updated successfully',
      data: student.feeDetails
    });
  } catch (error) {
    console.error('API Error:', error);
    return Response.json({
      success: false,
      message: 'Server Error',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    }, { status: 500 });
  }
}