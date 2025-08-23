import dbConnect from '@/lib/DBconnection';
import CourseRegistration from '@/models/OnlineCourseRegistration';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { q, field = 'all' } = req.query;
    
    if (!q) {
      return res.status(400).json({ 
        success: false, 
        error: 'Search query is required' 
      });
    }

    let filter = {};
    
    if (field === 'all') {
      filter.$or = [
        { fullName: { $regex: q, $options: 'i' } },
        { email: { $regex: q, $options: 'i' } },
        { courseSelected: { $regex: q, $options: 'i' } },
        { phoneNumber: { $regex: q, $options: 'i' } }
      ];
    } else {
      filter[field] = { $regex: q, $options: 'i' };
    }

    const students = await CourseRegistration.find(filter)
      .limit(20)
      .select('-password')
      .sort({ registrationTimestamp: -1 });

    res.status(200).json({ 
      success: true, 
      data: students,
      count: students.length
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
}