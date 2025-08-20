import connectDB from '@/lib/DBconnection';
import registered_students from '@/models/students'; // Adjust path to your model
import cloudinary from 'cloudinary';
import asyncHandler from 'express-async-handler';
import { v4 as uuidv4 } from 'uuid';
import { upload } from '@/lib/multer';
import { createRouter } from 'next-connect';
import fs from 'fs';
import path from 'path';

// Ensure uploads directory exists
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Create Next.js router
const router = createRouter();

// Connect to MongoDB before handling any request
router.use(async (req, res, next) => {
  await connectDB();
  next();
});

// Middleware to handle authentication (implement your own logic)
const protect = async (req, res, next) => {
  // Add your authentication logic here (e.g., verify JWT token)
  // Example: const token = req.headers.authorization?.split(' ')[1];
  // If no valid token, throw error
  // if (!token) throw new Error('Not authorized');
  next();
};

// Multer middleware for file uploads
const uploadMiddleware = upload.single('photo');

// Handle GET/POST/PUT requests based on action
router
  .get(
    asyncHandler(async (req, res) => {
      const action = req.query.action;

      if (action === 'find') {
        const { phoneNumber, rollNo } = req.body;

        if (!phoneNumber && !rollNo) {
          res.status(400);
          throw new Error('Please provide either phoneNumber or rollNo');
        }

        const query = {};
        if (phoneNumber) query.phoneNumber = phoneNumber;
        if (rollNo) query.rollNo = rollNo;

        const student = await registered_students.findOne(query).select('-password');

        if (!student) {
          res.status(404);
          throw new Error('Student not found');
        }

        res.status(200).json({
          success: true,
          data: student,
          message: 'Student retrieved successfully',
        });
      } else {
        res.status(400);
        throw new Error('Invalid action');
      }
    })
  )
  .post(
    asyncHandler(async (req, res) => {
      const action = req.query.action;

      if (action === 'fees') {
        const { amount, submissionDate, paid } = req.body;
        const student = await registered_students.findById(req.body.id);

        if (!student) {
          res.status(404);
          throw new Error('Student not found');
        }

        const newInstallment = {
          amount,
          submissionDate: submissionDate || new Date(),
          paid: paid || false,
        };

        student.feeDetails.installmentDetails.push(newInstallment);

        if (paid) {
          student.feeDetails.remainingFees -= amount;
        }

        await student.save();

        res.status(200).json({
          success: true,
          data: student.feeDetails,
          message: 'Fee installment added successfully',
        });
      } else if (action === 'results') {
        const { id, subjectCode, subjectName, theoryMarks, practicalMarks, examDate } = req.body;
        const student = await registered_students.findById(id);

        if (!student) {
          res.status(404);
          throw new Error('Student not found');
        }

        const totalMarks = (theoryMarks || 0) + (practicalMarks || 0);
        const newResult = {
          subjectCode,
          subjectName,
          theoryMarks,
          practicalMarks,
          totalMarks,
          examDate: examDate || new Date(),
        };

        student.examResults.push(newResult);

        const totalPossibleMarks = student.examResults.length * 100;
        const totalObtained = student.examResults.reduce((sum, result) => sum + (result.totalMarks || 0), 0);
        student.percentage = (totalObtained / totalPossibleMarks) * 100;

        if (student.percentage >= 90) student.finalGrade = 'A';
        else if (student.percentage >= 80) student.finalGrade = 'B';
        else if (student.percentage >= 70) student.finalGrade = 'C';
        else if (student.percentage >= 60) student.finalGrade = 'D';
        else student.finalGrade = 'F';

        await student.save();

        res.status(200).json({
          success: true,
          data: student.examResults,
          percentage: student.percentage,
          finalGrade: student.finalGrade,
          message: 'Exam result added successfully',
        });
      } else {
        res.status(400);
        throw new Error('Invalid action');
      }
    })
  )
  .put(
    asyncHandler(async (req, res) => {
      const action = req.query.action;

      if (action === 'update') {
        const { phoneNumber, rollNo } = req.body;
        const updateData = req.body;

        if (!phoneNumber && !rollNo) {
          res.status(400);
          throw new Error('Please provide either phoneNumber or rollNo');
        }

        delete updateData.password;
        delete updateData.feeDetails;
        delete updateData.examResults;
        delete updateData.rollNo;
        delete updateData.phoneNumber;

        const query = {};
        if (phoneNumber) query.phoneNumber = phoneNumber;
        if (rollNo) query.rollNo = rollNo;

        const student = await registered_students.findOneAndUpdate(
          query,
          { $set: updateData },
          { new: true, runValidators: true }
        );

        if (!student) {
          res.status(404);
          throw new Error('Student not found');
        }

        res.status(200).json({
          success: true,
          data: student,
          message: 'Student information updated successfully',
        });
      } else if (action === 'password') {
        const { phoneNumber, rollNo, currentPassword, newPassword } = req.body;

        if (!phoneNumber && !rollNo) {
          res.status(400);
          throw new Error('Please provide either phoneNumber or rollNo');
        }

        if (!currentPassword || !newPassword) {
          res.status(400);
          throw new Error('Please provide both currentPassword and newPassword');
        }

        const query = {};
        if (phoneNumber) query.phoneNumber = phoneNumber;
        if (rollNo) query.rollNo = rollNo;

        const student = await registered_students.findOne(query).select('+password');

        if (!student) {
          res.status(404);
          throw new Error('Student not found');
        }

        const isMatch = await student.comparePassword(currentPassword);
        if (!isMatch) {
          res.status(401);
          throw new Error('Current password is incorrect');
        }

        student.password = newPassword;
        await student.save();

        res.status(200).json({
          success: true,
          message: 'Password updated successfully',
        });
      } else if (action === 'updateById') {
        const updateData = req.body;

        delete updateData.password;
        delete updateData.feeDetails;
        delete updateData.examResults;
        delete updateData.rollNo;

        const student = await registered_students.findByIdAndUpdate(
          req.body.id,
          { $set: updateData },
          { new: true, runValidators: true }
        );

        if (!student) {
          res.status(404);
          throw new Error('Student not found');
        }

        res.status(200).json({
          success: true,
          data: student,
          message: 'Student information updated successfully',
        });
      } else if (action === 'passwordById') {
        const { id, currentPassword, newPassword } = req.body;

        const student = await registered_students.findById(id).select('+password');

        if (!student) {
          res.status(404);
          throw new Error('Student not found');
        }

        const isMatch = await student.comparePassword(currentPassword);
        if (!isMatch) {
          res.status(401);
          throw new Error('Current password is incorrect');
        }

        student.password = newPassword;
        await student.save();

        res.status(200).json({
          success: true,
          message: 'Password updated successfully',
        });
      } else if (action === 'fees') {
        const { id, installmentId, paid } = req.body;
        const student = await registered_students.findById(id);

        if (!student) {
          res.status(404);
          throw new Error('Student not found');
        }

        const installment = student.feeDetails.installmentDetails.id(installmentId);
        if (!installment) {
          res.status(404);
          throw new Error('Installment not found');
        }

        installment.paid = paid;
        if (paid) {
          student.feeDetails.remainingFees -= installment.amount;
        } else {
          student.feeDetails.remainingFees += installment.amount;
        }

        await student.save();

        res.status(200).json({
          success: true,
          data: student.feeDetails,
          message: 'Fee payment status updated successfully',
        });
      } else if (action === 'photo') {
        // Handle file upload
        uploadMiddleware(req, res, async (err) => {
          if (err) {
            res.status(400);
            throw new Error(err.message);
          }

          const student = await registered_students.findById(req.body.id);

          if (!student) {
            res.status(404);
            throw new Error('Student not found');
          }

          if (!req.file) {
            res.status(400);
            throw new Error('No file uploaded');
          }

          // Upload to Cloudinary
          const result = await cloudinary.v2.uploader.upload(req.file.path, {
            folder: 'student_profiles',
            public_id: `student_${student._id}_${uuidv4()}`,
          });

          // Delete local file
          fs.unlinkSync(req.file.path);

          // Update student photo
          student.photo = {
            public_id: result.public_id,
            url: result.secure_url,
          };

          await student.save();

          res.status(200).json({
            success: true,
            data: student.photo,
            message: 'Profile photo uploaded successfully',
          });
        });
      } else {
        res.status(400);
        throw new Error('Invalid action');
      }
    })
  );

// Error handling middleware
router.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Server Error',
  });
});

export default router.handler({
  onError: (err, req, res) => {
    res.status(err.status || 500).json({
      success: false,
      message: err.message || 'Server Error',
    });
  },
});