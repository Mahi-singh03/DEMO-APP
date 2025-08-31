import dbConnect from '@/lib/DBconnection';
import registered_students from '@/models/students';

// Add or update exam marks
export async function POST(request, { params }) {
  try {
    await dbConnect();
    
    const { id } = params;
    const body = await request.json();
    const { examResults } = body;
    
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
    
    // Update exam results
    if (examResults && Array.isArray(examResults)) {
      examResults.forEach(newResult => {
        const existingIndex = student.examResults.findIndex(
          result => result.subjectCode === newResult.subjectCode
        );
        
        if (existingIndex >= 0) {
          // Update existing result
          student.examResults[existingIndex] = {
            ...student.examResults[existingIndex],
            ...newResult,
            totalMarks: (newResult.theoryMarks || 0) + (newResult.practicalMarks || 0)
          };
        } else {
          // Add new result
          student.examResults.push({
            ...newResult,
            totalMarks: (newResult.theoryMarks || 0) + (newResult.practicalMarks || 0)
          });
        }
      });
      
      // Calculate total achieved marks and percentage
      const totalMarks = student.examResults.reduce((sum, result) => sum + (result.totalMarks || 0), 0);
      const maxPossibleMarks = student.examResults.length * 100; // Assuming each subject has max 100 marks
      
      student.totalAchievedMarks = totalMarks;
      student.percentage = maxPossibleMarks > 0 ? (totalMarks / maxPossibleMarks) * 100 : 0;
      
      // Determine final grade based on percentage
      if (student.percentage >= 90) student.finalGrade = 'A';
      else if (student.percentage >= 80) student.finalGrade = 'B';
      else if (student.percentage >= 70) student.finalGrade = 'C';
      else if (student.percentage >= 60) student.finalGrade = 'D';
      else student.finalGrade = 'F';
    }
    
    await student.save();
    
    return Response.json({
      success: true,
      data: {
        examResults: student.examResults,
        totalAchievedMarks: student.totalAchievedMarks,
        percentage: student.percentage,
        finalGrade: student.finalGrade
      }
    });
  } catch (error) {
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}