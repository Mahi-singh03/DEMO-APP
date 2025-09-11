import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema({
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
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['Present', 'Absent', 'Late', 'Half-day'],
    default: 'Present'
  },
  checkInTime: {
    type: Date,
    default: Date.now
  },
  checkOutTime: {
    type: Date
  },
  recognizedBy: {
    type: String,
    default: 'Face Recognition'
  },
  session: {
    type: String,
    enum: ['Morning', 'Afternoon', 'Full-day'],
    default: 'Full-day'
  }
});

// Create compound indexes for better query performance
attendanceSchema.index({ date: 1, rollNo: 1 });
attendanceSchema.index({ studentId: 1, date: 1 });

// Virtual for attendance duration
attendanceSchema.virtual('duration').get(function() {
  if (this.checkOutTime) {
    return (this.checkOutTime - this.checkInTime) / (1000 * 60 * 60); // Duration in hours
  }
  return null;
});

// Ensure virtuals are included when converting to JSON
attendanceSchema.set('toJSON', { virtuals: true });

// Pre-save middleware to set date to beginning of day for consistent grouping
attendanceSchema.pre('save', function(next) {
  if (this.isModified('date') || this.isNew) {
    const date = new Date(this.date);
    date.setHours(0, 0, 0, 0);
    this.date = date;
  }
  next();
});

const Attendance = mongoose.models.Attendance || mongoose.model('Attendance', attendanceSchema);
export default Attendance;