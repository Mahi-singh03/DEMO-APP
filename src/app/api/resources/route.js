import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { Storage } from 'megajs';
import connectDB from '@/lib/DBconnection';
import Resource from '@/models/books';

export const runtime = 'nodejs';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req) {
  try {
    await connectDB();
    const formData = await req.formData();
    const title = formData.get('title');
    const description = formData.get('description') || '';
    const category = formData.get('category') || 'Other';
    const publishedDate = formData.get('publishedDate');
    const pdfFile = formData.get('pdfFile');
    const coverPhoto = formData.get('coverPhoto');

    if (!title || !pdfFile) {
      return NextResponse.json({ error: 'Title and PDF file are required' }, { status: 400 });
    }

    // Connect to MEGA
    const storage = new Storage({
      email: process.env.MEGA_EMAIL,
      password: process.env.MEGA_PASSWORD,
    });
    
    await new Promise((resolve, reject) => {
      storage.on('ready', resolve);
      storage.on('error', reject);
    });

    // Upload PDF to MEGA
    const pdfBuffer = Buffer.from(await pdfFile.arrayBuffer());
    const uploadStream = storage.upload(pdfFile.name, pdfBuffer);
    
    let uploadedFile;
    await new Promise((resolve, reject) => {
      uploadStream.on('complete', (file) => {
        uploadedFile = file;
        resolve();
      });
      uploadStream.on('error', reject);
    });
    
    const pdfUrl = await uploadedFile.link();
    const pdfLink = pdfUrl;

    // Handle cover photo upload to Cloudinary
    let coverPhotoData = {};
    if (coverPhoto) {
      const bytes = await coverPhoto.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const uploadResult = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: 'resource_covers' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        uploadStream.end(buffer);
      });

      coverPhotoData = {
        coverPhotoId: uploadResult.public_id,
        coverPhotoUrl: uploadResult.secure_url,
      };
    }

    const resource = new Resource({
      title,
      description,
      category,
      publishedDate: publishedDate ? new Date(publishedDate) : null,
      pdfUrl,
      pdfLink,
      ...coverPhotoData,
    });

    await resource.save();
    return NextResponse.json(resource, { status: 201 });
  } catch (error) {
    console.error('Error creating resource:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const name = searchParams.get('name');
    const category = searchParams.get('category');

    let resources;
    if (name) {
      resources = await Resource.find({ $text: { $search: name } });
    } else if (category) {
      resources = await Resource.find({ category });
    } else {
      resources = await Resource.find({});
    }

    return NextResponse.json(resources);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}