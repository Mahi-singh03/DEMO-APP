import { NextResponse } from 'next/server';
import registered_students from '@/models/students'; 
import connectDB from '@/lib/DBconnection';

export async function GET() {
  try {
    await connectDB();
    
    const currentDate = new Date();
    
    // Get counts for different student statuses
    const totalStudents = await registered_students.countDocuments();
    const activeStudents = await registered_students.countDocuments({ 
      farewellDate: { $gte: currentDate } 
    });
    const completedStudents = await registered_students.countDocuments({ 
      farewellDate: { $lt: currentDate } 
    });
    const certifiedStudents = await registered_students.countDocuments({ 
      farewellDate: { $lt: currentDate },
      certificate: true 
    });
    
    // Get course-wise statistics
    const courseStats = await registered_students.aggregate([
      {
        $group: {
          _id: '$selectedCourse',
          total: { $sum: 1 },
          active: {
            $sum: {
              $cond: [{ $gte: ['$farewellDate', currentDate] }, 1, 0]
            }
          },
          completed: {
            $sum: {
              $cond: [{ $lt: ['$farewellDate', currentDate] }, 1, 0]
            }
          },
          certified: {
            $sum: {
              $cond: [
                { $and: [
                  { $lt: ['$farewellDate', currentDate] },
                  { $eq: ['$certificate', true] }
                ]},
                1,
                0
              ]
            }
          }
        }
      }
    ]);
    
    return NextResponse.json({
      success: true,
      data: {
        totalStudents,
        activeStudents,
        completedStudents,
        certifiedStudents,
        courseStats
      }
    }, { status: 200 });
    
  } catch (error) {
    console.error('Error fetching student statistics:', error);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
