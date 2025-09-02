import mongoose from 'mongoose';

const jobCandidatesSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  skills: [{
    type: String,
    trim: true
  }],
  preferredPosition: {
    type: String,
    required: true,
    trim: true
  },
  cvUrl: {
    type: String,
    required: true
  },
  cvFileName: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'shortlisted', 'rejected', 'hired'],
    default: 'pending'
  },
  appliedAt: {
    type: Date,
    default: Date.now
  },
  notes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Create indexes for better query performance
jobCandidatesSchema.index({ email: 1 });
jobCandidatesSchema.index({ status: 1 });
jobCandidatesSchema.index({ appliedAt: -1 });

const JobCandidiates = mongoose.models.JobCandidiates || mongoose.model('JobCandidiates', jobCandidatesSchema);

export default JobCandidiates;
