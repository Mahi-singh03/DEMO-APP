import mongoose from 'mongoose';
import registered_students from '@/models/students'; 
import connectDB from '@/lib/DBconnection';

// GET - Fetch individual student details
export async function GET(request, { params }) {
  await connectDB();

  try {
    const { id } = params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return Response.json({
        success: false,
        message: 'Invalid student ID'
      }, { status: 400 });
    }

    const student = await registered_students.findById(id)
      .select('fullName photo rollNo phoneNumber emailAddress feeDetails farewellDate joiningDate')
      .lean();

    if (!student) {
      return Response.json({
        success: false,
        message: 'Student not found'
      }, { status: 404 });
    }

    // Format response with fee status
    const { totalFees = 0, remainingFees = 0, installmentDetails = [] } = student.feeDetails || {};
    const paidFees = totalFees - remainingFees;
    
    let feeStatus = 'unpaid';
    if (remainingFees === 0 && totalFees > 0) feeStatus = 'paid';
    else if (paidFees > 0 && remainingFees > 0) feeStatus = 'partial';
    
    const currentDate = new Date();
    const isCourseCompleted = student.farewellDate && new Date(student.farewellDate) < currentDate;
    
    const formattedStudent = {
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
      isCourseCompleted,
      farewellDate: student.farewellDate,
      joiningDate: student.joiningDate
    };

    return Response.json({
      success: true,
      data: formattedStudent
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

// PUT - Update student details including fee structure
export async function PUT(request, { params }) {
  await connectDB();

  try {
    const { id } = params;
    const updateData = await request.json();
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return Response.json({
        success: false,
        message: 'Invalid student ID'
      }, { status: 400 });
    }

    const student = await registered_students.findById(id);
    
    if (!student) {
      return Response.json({
        success: false,
        message: 'Student not found'
      }, { status: 404 });
    }

    // Handle fee details update
    if (updateData.feeDetails) {
      if (updateData.feeDetails.totalFees !== undefined) {
        student.feeDetails.totalFees = updateData.feeDetails.totalFees;
        
        // If remainingFees is not provided, set it to totalFees
        if (updateData.feeDetails.remainingFees === undefined) {
          student.feeDetails.remainingFees = updateData.feeDetails.totalFees;
        }
      }

      if (updateData.feeDetails.remainingFees !== undefined) {
        student.feeDetails.remainingFees = updateData.feeDetails.remainingFees;
      }

      if (updateData.feeDetails.installments !== undefined) {
        student.feeDetails.installments = updateData.feeDetails.installments;
        
        // Regenerate installment details if installments changed
        if (student.feeDetails.totalFees && updateData.feeDetails.installments) {
          const amountPerInstallment = Math.floor(student.feeDetails.totalFees / updateData.feeDetails.installments);
          const remainingAmount = student.feeDetails.totalFees % updateData.feeDetails.installments;
          const joining = new Date(student.joiningDate);
          
          student.feeDetails.installmentDetails = Array.from({ length: updateData.feeDetails.installments }, (_, index) => {
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

      // Update specific installment if provided
      if (updateData.feeDetails.installmentDetails) {
        updateData.feeDetails.installmentDetails.forEach((updatedInstallment, index) => {
          if (student.feeDetails.installmentDetails[index]) {
            if (updatedInstallment.amount !== undefined) {
              student.feeDetails.installmentDetails[index].amount = updatedInstallment.amount;
            }
            if (updatedInstallment.submissionDate !== undefined) {
              student.feeDetails.installmentDetails[index].submissionDate = updatedInstallment.submissionDate;
            }
            if (updatedInstallment.paid !== undefined) {
              student.feeDetails.installmentDetails[index].paid = updatedInstallment.paid;
            }
          }
        });
      }
    }

    // Update other student details
    if (updateData.fullName) student.fullName = updateData.fullName;
    if (updateData.phoneNumber) student.phoneNumber = updateData.phoneNumber;
    if (updateData.emailAddress) student.emailAddress = updateData.emailAddress;
    if (updateData.photo) student.photo = updateData.photo;

    await student.save();

    return Response.json({
      success: true,
      message: 'Student details updated successfully',
      data: student
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