import mongoose from 'mongoose';

const staffSchema = new mongoose.Schema({
  Name: String,
  StaffID: { type: Number, unique: true },
  JoinningData: Date,
  Designation: String,
  DOB: { type: Date, required: true },
  LeavingDate: Date,
  FatherName: String,
  Address: String,
});

// Auto-generate StaffID before saving
staffSchema.pre('save', async function(next) {
  if (this.StaffID) return next(); // Skip if StaffID already exists

  // Find the last staff member to get the highest StaffID
  const lastStaff = await mongoose.model('Staff')
    .findOne()
    .sort({ StaffID: -1 });

  let newStaffID = 2025001; // Default starting ID
  if (lastStaff && lastStaff.StaffID) {
    newStaffID = lastStaff.StaffID + 1;
  }

  this.StaffID = newStaffID;
  next();
});

// Prevent model overwrite upon hot-reload
export default mongoose.models.staffs || mongoose.model('staffs', staffSchema);