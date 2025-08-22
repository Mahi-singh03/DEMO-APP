import { v2 as cloudinary } from 'cloudinary';
import { NextResponse } from 'next/server';

// Configure Cloudinary using environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// GET method to fetch all photos
export async function GET() {
  try {
    // Verify Cloudinary configuration
    if (!process.env.CLOUDINARY_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      return NextResponse.json(
        { error: 'Cloudinary configuration is incomplete' },
        { status: 500 }
      );
    }

    const result = await cloudinary.search
      .expression('folder:gallery/*') 
      .sort_by('public_id', 'desc')
      .with_field('context') 
      .max_results(100)
      .execute();

    if (!result || !result.resources) {
      return NextResponse.json(
        { error: 'Invalid response from Cloudinary' },
        { status: 500 }
      );
    }

    const images = result.resources.map(file => ({
      url: file.secure_url,
      public_id: file.public_id, // match frontend usage
      created_at: file.created_at, // add created_at for display
      width: file.width,
      height: file.height,
      context: file.context || null,
    }));

    return NextResponse.json({ success: true, photos: images });
  } catch (error) {
    console.error('Cloudinary fetch error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch images from Cloudinary' },
      { status: 500 }
    );
  }
}

// POST method to upload a photo
export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder: 'gallery' },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(buffer);
    });

    return NextResponse.json({
      publicId: result.public_id,
      url: result.secure_url
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to upload image' },
      { status: 500 }
    );
  }
}

// DELETE method to delete a photo
export async function DELETE(request) {
  try {
    const { public_id } = await request.json();
    
    if (!public_id) {
      return NextResponse.json(
        { error: 'No public_id provided' },
        { status: 400 }
      );
    }

    // Delete from Cloudinary
    const result = await cloudinary.uploader.destroy(public_id);

    if (result.result !== 'ok') {
      return NextResponse.json(
        { error: 'Failed to delete image from Cloudinary' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete image' },
      { status: 500 }
    );
  }
}