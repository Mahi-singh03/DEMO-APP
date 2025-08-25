const mongoose = require('mongoose');
const { Schema } = mongoose;

const CourseRegistrationSchema = new Schema({
  fullName: { type: String, required: true },
  fatherName: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  courseSelected: { 
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
  password: { type: String },
  registrationTimestamp: { type: Date, default: Date.now },
  role: { type: String, default: 'online-course-student' },
});

module.exports = mongoose.models.CourseRegistration || 
mongoose.model('CourseRegistration', CourseRegistrationSchema);