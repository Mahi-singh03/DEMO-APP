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
    default: '',
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
    enum: [
      'Basic Computer', 
      'MS Word', 
      'AutoCAD', 
      'Programming', 
      'Web Designing', 
      'Graphic Designing', 
      'Animation', 
      'Computer Accountancy',
      'Other'  // Added 'Other' to match your default value
    ],
    default: 'Other',
  },
  publishedDate: {
    type: Date,
    default: null,
  },
  driveLink: {
    type: String,
    required: [true, 'Drive link is required'],
    trim: true,
  },
  username: {  // Added username field for user association
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: false, // Disabling automatic timestamps since we're handling them manually
  toJSON: {
    virtuals: true,
    transform: function(doc, ret) {
      delete ret._id;
      delete ret.__v;
      ret.id = doc._id.toString();
      return ret;
    }
  },
  toObject: {
    virtuals: true
  }
});

// Indexes for better query performance
bookSchema.index({ title: 'text', description: 'text' });
bookSchema.index({ category: 1 });
bookSchema.index({ username: 1 });

// Update timestamp before saving
bookSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Update timestamp before findOneAndUpdate operations
bookSchema.pre('findOneAndUpdate', function() {
  this.set({ updatedAt: new Date() });
});

const Book = mongoose.models.Book || mongoose.model('Book', bookSchema);
export default Book;