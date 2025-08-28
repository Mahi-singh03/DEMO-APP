import cloudinary from '@/lib/cloudinary';

export async function POST(request) {
  try {
    const body = await request.json();
    const { resource_type = 'image' } = body;
    
    // Validate resource_type
    if (!['image', 'video'].includes(resource_type)) {
      return Response.json({ 
        success: false, 
        error: 'Invalid resource_type. Must be "image" or "video"' 
      }, { status: 400 });
    }
    
    const timestamp = Math.round(new Date().getTime() / 1000);

    // Set folder based on resource type
    const folder = resource_type === 'video' ? 'courses/videos' : 'courses/title-photos';

    // Validate required environment variables
    if (!process.env.CLOUDINARY_API_SECRET) {
      console.error('CLOUDINARY_API_SECRET is not defined in environment variables');
      return Response.json({ 
        success: false, 
        error: 'Server configuration error: CLOUDINARY_API_SECRET missing'
      }, { status: 500 });
    }

    if (!process.env.CLOUDINARY_API_KEY) {
      console.error('CLOUDINARY_API_KEY is not defined in environment variables');
      return Response.json({ 
        success: false, 
        error: 'Server configuration error: CLOUDINARY_API_KEY missing'
      }, { status: 500 });
    }

    if (!process.env.CLOUDINARY_NAME) {
      console.error('CLOUDINARY_NAME is not defined in environment variables');
      return Response.json({ 
        success: false, 
        error: 'Server configuration error: CLOUDINARY_NAME missing'
      }, { status: 500 });
    }

    // Create a signature for client-direct upload
    const signature = cloudinary.utils.api_sign_request(
      { timestamp, folder },
      process.env.CLOUDINARY_API_SECRET
    );

    return Response.json({
      success: true,
      data: {
        timestamp,
        signature,
        apiKey: process.env.CLOUDINARY_API_KEY,
        cloudName: process.env.CLOUDINARY_NAME,
        folder,
        resource_type,
      },
    });
  } catch (error) {
    console.error('Cloudinary sign-upload error:', error);
    
    // Handle specific error types
    if (error.name === 'SyntaxError') {
      return Response.json({ 
        success: false, 
        error: 'Invalid JSON in request body' 
      }, { status: 400 });
    }
    
    return Response.json({ 
      success: false, 
      error: 'Failed to create upload signature',
      details: error.message
    }, { status: 500 });
  }
}


