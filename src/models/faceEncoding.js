import mongoose from 'mongoose';

const faceEncodingSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'registered_students',
    required: true
  },
  rollNo: {
    type: String,
    required: true,
    index: true
  },
  encoding: {
    type: [Number], // Array of numbers representing facial features
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create index for faster queries
faceEncodingSchema.index({ studentId: 1 });
faceEncodingSchema.index({ rollNo: 1 });

const FaceEncoding = mongoose.models.FaceEncoding || mongoose.model('FaceEncoding', faceEncodingSchema);
export default FaceEncoding;