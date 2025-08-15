// /src/app/api/cloudinary/route.js

import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary using environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// GET method export for Next.js App Router
export async function GET() {
  try {
    // Verify Cloudinary configuration
    if (!process.env.CLOUDINARY_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      throw new Error('Cloudinary configuration is incomplete');
    }

    const result = await cloudinary.search
      .expression('folder:gallery/*') // Adjust if your folder name is different
      .sort_by('public_id', 'desc')
      .with_field('context') // Ensure context metadata (alt, order, etc.) is included
      .max_results(100)
      .execute();

    // Validate the response
    if (!result || !result.resources) {
      throw new Error('Invalid response from Cloudinary');
    }

    const images = result.resources.map(file => ({
      url: file.secure_url,
      publicId: file.public_id,
      context: file.context || null,
    }));

    // Return a properly formatted JSON response
    return new Response(JSON.stringify({ images }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Cloudinary fetch error:', error);
    // Return a properly formatted error response
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Failed to fetch images from Cloudinary',
        details: error.stack
      }), 
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}
