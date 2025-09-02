import { uploadToMega } from '@/lib/megaStorage';
import JobSeeker from '@/models/JobCandidiates';
import dbConnect from '@/lib/DBconnection';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    await dbConnect();

    // Parse form data using Next.js FormData API
    const formData = await request.formData();
    
    // Extract form fields
    const name = formData.get('name');
    const email = formData.get('email');
    const phone = formData.get('phone');
    const location = formData.get('location');
    const skills = formData.get('skills');
    const preferredPosition = formData.get('preferredPosition');
    const cvFile = formData.get('cv');

    // Validate required fields
    if (!name || !email || !cvFile) {
      return NextResponse.json({ 
        message: 'Name, email, and CV file are required' 
      }, { status: 400 });
    }

    // Check file size (10MB limit)
    if (cvFile.size > 10 * 1024 * 1024) {
      return NextResponse.json({ 
        message: 'File size must be less than 10MB' 
      }, { status: 400 });
    }
    
    // Convert file to buffer
    const fileBuffer = Buffer.from(await cvFile.arrayBuffer());
    
    // Generate a unique filename
    const timestamp = Date.now();
    const originalName = cvFile.name;
    const fileExtension = originalName.split('.').pop();
    const fileName = `cv_${timestamp}.${fileExtension}`;

    // Upload to MEGA
    const uploadResult = await uploadToMega(fileBuffer, fileName);
    
    // Parse skills (handle both string and array)
    let skillsArray = [];
    if (skills) {
      try {
        skillsArray = typeof skills === 'string' ? JSON.parse(skills) : skills;
        if (!Array.isArray(skillsArray)) {
          skillsArray = [skillsArray];
        }
      } catch (e) {
        skillsArray = [skills];
      }
    }
    
    // Create job seeker record
    const jobSeeker = new JobSeeker({
      name,
      email,
      phone,
      location,
      skills: skillsArray,
      preferredPosition,
      cvUrl: uploadResult.url,
      cvFileName: uploadResult.fileName,
    });

    await jobSeeker.save();

    return NextResponse.json({
      message: 'Job application submitted successfully',
      data: jobSeeker,
    }, { status: 201 });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ 
      message: 'Error processing application',
      error: error.message 
    }, { status: 500 });
  }
}