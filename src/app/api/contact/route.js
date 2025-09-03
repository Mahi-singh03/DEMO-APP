import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, phone, subject, message, userId, userRollNo } = body;

    // Validate required fields
    if (!name || !email || !phone || !message) {
      return NextResponse.json(
        { message: 'All required fields must be filled' },
        { status: 400 }
      );
    }

    // Here you would typically:
    // 1. Save to database
    // 2. Send email notification
    // 3. Log the contact request
    
    // For now, we'll just log it and return success
    console.log('Contact form submission:', {
      name,
      email,
      phone,
      subject,
      message,
      userId,
      userRollNo,
      timestamp: new Date().toISOString()
    });

    // In a real application, you might want to:
    // - Save to a database
    // - Send an email to the admin
    // - Send a confirmation email to the user
    
    return NextResponse.json(
      { 
        message: 'Your request has been submitted successfully! We will contact you soon.',
        success: true 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { message: 'Failed to submit your request. Please try again.' },
      { status: 500 }
    );
  }
}
