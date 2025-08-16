import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Book title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters'],
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters'],
  },
  coverPhotoId: {
    type: String,
    trim: true,
  },
  pdfUrl: {
    type: String,
    required: [true, 'PDF URL is required'],
    trim: true,
  },
  coverPhotoUrl: {
    type: String,
    trim: true,
  },
  category: {
    type: String,
    enum: ['Basic Computer', 'MS word', 'AutoCAD', 
      'Programming', 'Web Designing', 'Graphic Designing', 
      'Animation', 'Computer Accountancy'],
    default: 'Other',
  },
  publishedDate: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  driveLink: {
    type: String,
    required: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

bookSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.models.Book || mongoose.model('Book', bookSchema)