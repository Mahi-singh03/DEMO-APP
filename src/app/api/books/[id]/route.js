import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import connectDB from '@/lib/DBconnection';
import Book from '@/models/books';

export const runtime = 'nodejs';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function PUT(req, { params }) {
  try {
    await connectDB();
    const formData = await req.formData();
    const title = formData.get('title');
    const description = formData.get('description');
    const category = formData.get('category');
    const publishedDate = formData.get('publishedDate');
    const pdfUrl = formData.get('pdfUrl');
    const coverPhoto = formData.get('coverPhoto');

    const book = await Book.findById(params.id);
    if (!book) {
      return NextResponse.json({ error: 'Book not found' }, { status: 404 });
    }

    if (title) book.title = title;
    if (description !== undefined) book.description = description;
    if (category) book.category = category;
    if (publishedDate) book.publishedDate = new Date(publishedDate);
    if (pdfUrl) book.pdfUrl = pdfUrl;
  

    if (coverPhoto) {
      const bytes = await coverPhoto.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const uploadResult = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: 'book_covers' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        uploadStream.end(buffer);
      });

      if (book.coverPhotoId) {
        await cloudinary.uploader.destroy(book.coverPhotoId);
      }

      book.coverPhotoId = uploadResult.public_id;
      book.coverPhotoUrl = uploadResult.secure_url;
    }

    await book.save();
    return NextResponse.json(book);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await connectDB();
    const book = await Book.findById(params.id);
    if (!book) {
      return NextResponse.json({ error: 'Book not found' }, { status: 404 });
    }

    if (book.coverPhotoId) {
      await cloudinary.uploader.destroy(book.coverPhotoId);
    }

    await Book.findByIdAndDelete(params.id);
    return NextResponse.json({ message: 'Book deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}