import mongoose from 'mongoose';
import registered_students from '@/models/students'; 
import connectDB from '@/lib/DBconnection';

// POST - Process fee payment
export async function POST(request, { params }) {
  await connectDB();

  try {
    const { id } = params;
    const { amount, installmentIndex, paymentMethod, paymentDate } = await request.json();
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return Response.json({
        success: false,
        message: 'Invalid student ID'
      }, { status: 400 });
    }

    if (!amount || amount <= 0) {
      return Response.json({
        success: false,
        message: 'Invalid payment amount'
      }, { status: 400 });
    }

    const student = await registered_students.findById(id);
    
    if (!student) {
      return Response.json({
        success: false,
        message: 'Student not found'
      }, { status: 404 });
    }

    // Initialize feeDetails if it doesn't exist
    if (!student.feeDetails) {
      student.feeDetails = {
        totalFees: 0,
        remainingFees: 0,
        installments: 0,
        installmentDetails: [],
        payments: []
      };
    }

    // Initialize payments array if it doesn't exist
    if (!student.feeDetails.payments) {
      student.feeDetails.payments = [];
    }

    // Add payment record
    const payment = {
      amount: parseFloat(amount),
      date: paymentDate ? new Date(paymentDate) : new Date(),
      method: paymentMethod || 'online',
      installmentIndex: installmentIndex !== null ? installmentIndex : null
    };

    student.feeDetails.payments.push(payment);
    
    // Update remaining fees
    const currentRemaining = student.feeDetails.remainingFees || 0;
    const newRemaining = Math.max(0, currentRemaining - parseFloat(amount));
    student.feeDetails.remainingFees = newRemaining;

    // Update installment if specified
    if (installmentIndex !== null && student.feeDetails.installmentDetails) {
      if (student.feeDetails.installmentDetails[installmentIndex]) {
        const installment = student.feeDetails.installmentDetails[installmentIndex];
        
        // Initialize payments array if it doesn't exist
        if (!installment.payments) {
          installment.payments = [];
        }
        
        // Store original amount if not already stored
        if (!installment.originalAmount) {
          installment.originalAmount = installment.amount;
        }
        
        installment.payments.push(payment);
        
        // Calculate total paid for this installment
        const totalPaid = installment.payments.reduce((sum, p) => sum + p.amount, 0);
        
        // NEW LOGIC: Mark installment as fully paid if any payment is made
        // and redistribute the remaining amount to the next installment
        if (totalPaid > 0 && !installment.paid) {
          installment.paid = true;
          
          // Calculate remaining amount to redistribute
          const remainingAmount = installment.originalAmount - totalPaid;
          
          if (remainingAmount > 0) {
            // Find the next unpaid installment and add the remaining amount
            for (let i = installmentIndex + 1; i < student.feeDetails.installmentDetails.length; i++) {
              const nextInstallment = student.feeDetails.installmentDetails[i];
              if (!nextInstallment.paid) {
                // Store original amount if not already stored
                if (!nextInstallment.originalAmount) {
                  nextInstallment.originalAmount = nextInstallment.amount;
                }
                // Add remaining amount to next installment
                nextInstallment.amount += remainingAmount;
                break; // Only add to the next unpaid installment
              }
            }
          }
        }
      }
    }

    await student.save();

    return Response.json({
      success: true,
      message: 'Payment processed successfully',
      data: {
        remainingFees: student.feeDetails.remainingFees,
        totalFees: student.feeDetails.totalFees,
        installmentDetails: student.feeDetails.installmentDetails
      }
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

// GET - Get payment history for a student
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
      .select('feeDetails.payments')
      .lean();

    if (!student) {
      return Response.json({
        success: false,
        message: 'Student not found'
      }, { status: 404 });
    }

    const payments = student.feeDetails?.payments || [];

    return Response.json({
      success: true,
      data: payments
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