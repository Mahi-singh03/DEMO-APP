import mongoose from 'mongoose';

const videoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  videoUrl: { type: String, required: true },
  duration: { type: Number, default: 0 },
  order: { type: Number, default: 0 },
}, { _id: true });

const courseSchema = new mongoose.Schema({
  courseId: { type: String, unique: true }, // Removed required, will be set in pre-save hook
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
  videoCount: { type: Number, default: 0 },
  titlePhotoUrl: { type: String },
  videos: [videoSchema],
}, { timestamps: true });

// Generate courseId before saving
courseSchema.pre('save', async function (next) {
  if (this.isNew && !this.courseId) {
    try {
      const lastCourse = await mongoose.model('Course')
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
      next();
    } catch (err) {
      next(err);
    }
  } else {
    next();
  }
});

if (mongoose.models.Course) {
  delete mongoose.models.Course;
}
const Course = mongoose.model('Course', courseSchema);

export default Course;
