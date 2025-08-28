import mongoose from 'mongoose';

const videoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  cloudinaryPublicId: { type: String, required: true },
  secureUrl: { type: String },
  format: { type: String },
  bytes: { type: Number },
  width: { type: Number },
  height: { type: Number },
  duration: { type: Number, default: 0, min: 0 },
  order: { type: Number, default: 0, min: 0 },
  watermarkTemplate: { type: String, default: '' },
  createdByUserId: { type: String },
  createdAt: { type: Date, default: Date.now }
}, { _id: true, timestamps: true });

const courseSchema = new mongoose.Schema({
  courseId: { type: String, unique: true },
  name: {
    type: String,
    required: true,
    enum: [
      "VN video editing",
      "AI and ChatGPT",
      "MS Excel Course",
      "Canva Course",
      "HTML Course"
    ]
  },
  description: String,
  videoCount: { type: Number, default: 0, min: 0 },
  titlePhotoUrl: { type: String },
  videos: [videoSchema],
}, { timestamps: true });

// Auto-generate courseId sequentially
courseSchema.pre('save', async function (next) {
  try {
    if (this.isNew && !this.courseId) {
      // Use atomic operation to ensure unique sequential IDs
      const lastCourse = await this.constructor
        .findOne({})
        .sort({ createdAt: -1 })
        .select('courseId')
        .exec();

      let nextId = 1;
      if (lastCourse && lastCourse.courseId) {
        const match = lastCourse.courseId.match(/CourseID_(\d+)/);
        if (match) {
          nextId = parseInt(match[1], 10) + 1;
        }
      }
      this.courseId = `CourseID_${nextId}`;
    }

    // Keep videoCount in sync
    if (this.videos && Array.isArray(this.videos)) {
      this.videoCount = this.videos.length;
      
      // Ensure all videos have valid order values
      this.videos.forEach((video, index) => {
        if (typeof video.order !== 'number' || isNaN(video.order)) {
          video.order = index;
        }
      });
    }

    next();
  } catch (err) {
    next(err);
  }
});

// Ensure videoCount is updated when videos are modified
courseSchema.pre('findOneAndUpdate', function(next) {
  try {
    const update = this.getUpdate();
    if (update.$set && update.$set.videos) {
      update.$set.videoCount = Array.isArray(update.$set.videos) ? update.$set.videos.length : 0;
    }
    next();
  } catch (err) {
    next(err);
  }
});

// Add index for better query performance (only add if not already defined)
if (!courseSchema.indexes().some(idx => idx.key && idx.key.name)) {
  courseSchema.index({ name: 1 });
  courseSchema.index({ createdAt: -1 });
}

export default mongoose.models.Course || mongoose.model('Course', courseSchema);