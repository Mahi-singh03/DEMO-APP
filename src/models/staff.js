
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

  try {
    // Use the same model instance to avoid circular references
    const StaffModel = this.constructor;
    
    // Find the last staff member to get the highest StaffID
    const lastStaff = await StaffModel.findOne().sort({ StaffID: -1 });

    let newStaffID = 1; // Default starting ID
    if (lastStaff && lastStaff.StaffID) {
      newStaffID = lastStaff.StaffID + 1;
    }

    this.StaffID = newStaffID;
    next();
  } catch (error) {
    next(error);
  }
});

// Check if model already exists to prevent overwrite error
const Staff = mongoose.models['Staff Data'] || mongoose.model('Staff Data', staffSchema);

export default Staff;