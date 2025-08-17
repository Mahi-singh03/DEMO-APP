import connectDB from '@/lib/DBconnection';
import Book from '@/models/books';
import { Storage } from 'megajs';
import { Readable } from 'stream';
import { v2 as cloudinary } from 'cloudinary';
import { NextResponse } from 'next/server';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const config = {
  api: {
    bodyParser: false,
  },
};

// Helper function to create MEGA storage
async function createMegaStorage() {
  try {
    const storage = new Storage({
      email: process.env.MEGA_EMAIL,
      password: process.env.MEGA_PASSWORD,
    });
    
    await new Promise((resolve, reject) => {
      storage.on('ready', resolve);
      storage.on('error', reject);
    });
    
    return storage;
  } catch (error) {
    console.error('MEGA storage initialization failed:', error);
    throw new Error('Failed to initialize cloud storage');
  }
}

// Helper function to upload file to MEGA
async function uploadToMega(file, storage) {
  try {
    const uploadStream = storage.upload({
      name: file.name,
      size: file.size,
    });

    const fileStream = new Readable();
    fileStream.push(Buffer.from(await file.arrayBuffer()));
    fileStream.push(null);
    fileStream.pipe(uploadStream);

    const uploadedFile = await new Promise((resolve, reject) => {
      uploadStream.on('complete', resolve);
      uploadStream.on('error', reject);
    });

    return {
      url: await uploadedFile.link(),
      nodeId: uploadedFile.nodeId,
    };
  } catch (error) {
    console.error('MEGA upload failed:', error);
    throw new Error('File upload failed');
  }
}

// Helper function to upload to Cloudinary
async function uploadToCloudinary(file, folder) {
  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { 
          resource_type: file.type.startsWith('image') ? 'image' : 'raw',
          folder: folder,
        },
        (error, result) => error ? reject(error) : resolve(result)
      ).end(buffer);
    });

    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch (error) {
    console.error('Cloudinary upload failed:', error);
    throw new Error('Image upload failed');
  }
}

// Helper function to delete from MEGA
async function deleteFromMega(nodeId) {
  if (!nodeId) return;
  
  try {
    const storage = await createMegaStorage();
    const file = storage.findByNodeId(nodeId);
    if (file) await file.delete();
  } catch (error) {
    console.error('MEGA deletion failed:', error);
    throw new Error('Failed to delete file');
  }
}

// Helper function to delete from Cloudinary
async function deleteFromCloudinary(publicId) {
  if (!publicId) return;
  
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Cloudinary deletion failed:', error);
    throw new Error('Failed to delete image');
  }
}

// GET all books
export async function GET() {
  await connectDB();
  
  try {
    const books = await Book.find().sort({ createdAt: -1 });
    return NextResponse.json(books);
  } catch (error) {
    console.error('Error fetching books:', error);
    return NextResponse.json(
      { error: 'Failed to fetch books' },
      { status: 500 }
    );
  }
}

// POST - Create new book
export async function POST(request) {
  await connectDB();

  try {
    const formData = await request.formData();
    
    const requiredFields = ['title', 'coverPhoto', 'pdf'];
    for (const field of requiredFields) {
      if (!formData.get(field)) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        );
      }
    }

    // Process file uploads in parallel
    const [coverResult, pdfResult] = await Promise.all([
      uploadToCloudinary(formData.get('coverPhoto'), 'book-covers'),
      (async () => {
        const storage = await createMegaStorage();
        return uploadToMega(formData.get('pdf'), storage);
      })(),
    ]);

    const bookData = {
      title: formData.get('title'),
      description: formData.get('description') || '',
      category: formData.get('category') || '',
      publishedDate: formData.get('publishedDate') || undefined,
      coverPhotoUrl: coverResult.url,
      coverPhotoId: coverResult.publicId,
      pdfUrl: pdfResult.url,
      pdfNodeId: pdfResult.nodeId,
    };

    const book = new Book(bookData);
    await book.save();

    return NextResponse.json(
      { message: 'Book created successfully', book },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating book:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create book' },
      { status: 500 }
    );
  }
}

// PUT - Update book
export async function PUT(request) {
  await connectDB();

  try {
    const formData = await request.formData();
    const id = formData.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Book ID is required' },
        { status: 400 }
      );
    }

    const book = await Book.findById(id);
    if (!book) {
      return NextResponse.json(
        { error: 'Book not found' },
        { status: 404 }
      );
    }

    // Update basic fields
    if (formData.has('title')) book.title = formData.get('title');
    if (formData.has('description')) book.description = formData.get('description');
    if (formData.has('category')) book.category = formData.get('category');
    if (formData.has('publishedDate')) book.publishedDate = formData.get('publishedDate');

    // Handle file updates only if new files are provided
    const updateOperations = [];
    const coverPhotoFile = formData.get('coverPhoto');
    const pdfFile = formData.get('pdf');

    if (coverPhotoFile && coverPhotoFile.size > 0) {
      updateOperations.push(
        (async () => {
          if (book.coverPhotoId) {
            await deleteFromCloudinary(book.coverPhotoId);
          }
          const { url, publicId } = await uploadToCloudinary(coverPhotoFile, 'book-covers');
          book.coverPhotoUrl = url;
          book.coverPhotoId = publicId;
        })()
      );
    }

    if (pdfFile && pdfFile.size > 0) {
      updateOperations.push(
        (async () => {
          if (book.pdfNodeId) {
            await deleteFromMega(book.pdfNodeId);
          }
          const storage = await createMegaStorage();
          const { url, nodeId } = await uploadToMega(pdfFile, storage);
          book.pdfUrl = url;
          book.pdfNodeId = nodeId;
        })()
      );
    }

    await Promise.all(updateOperations);
    await book.save();

    return NextResponse.json(
      { message: 'Book updated successfully', book },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating book:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update book' },
      { status: 500 }
    );
  }
}
// DELETE - Remove book
export async function DELETE(request) {
  await connectDB();

  try {
    const id = request.nextUrl.searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Book ID is required' },
        { status: 400 }
      );
    }

    const book = await Book.findById(id);
    if (!book) {
      return NextResponse.json(
        { error: 'Book not found' },
        { status: 404 }
      );
    }

    // Delete associated files
    await Promise.all([
      deleteFromCloudinary(book.coverPhotoId),
      deleteFromMega(book.pdfNodeId),
    ]);

    await Book.findByIdAndDelete(id);

    return NextResponse.json(
      { message: 'Book deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting book:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete book' },
      { status: 500 }
    );
  }
}