// Validate email format
export const isValidEmail = (email) => {
  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  return emailRegex.test(email);
};

// Validate phone number format (10 digits)
export const isValidPhone = (phone) => {
  const phoneRegex = /^[0-9]{10}$/;
  return phoneRegex.test(phone);
};

// Validate Aadhar number format (12 digits)
export const isValidAadhar = (aadhar) => {
  const aadharRegex = /^[0-9]{12}$/;
  return aadharRegex.test(aadhar);
};

// Validate password strength
export const isValidPassword = (password) => {
  return password && password.length >= 6;
};

// Validate if value is a number
export const isNumber = (value) => {
  return !isNaN(parseFloat(value)) && isFinite(value);
};

// Validate if value is a positive number
export const isPositiveNumber = (value) => {
  return isNumber(value) && parseFloat(value) >= 0;
};

// Validate if value is within a range
export const isInRange = (value, min, max) => {
  const numValue = parseFloat(value);
  return isNumber(value) && numValue >= min && numValue <= max;
};

// Validate required field
export const isRequired = (value) => {
  return value !== null && value !== undefined && value.toString().trim() !== '';
};

// Validate date format
export const isValidDate = (dateString) => {
  const date = new Date(dateString);
  return !isNaN(date.getTime());
};

// Validate if date is in the past
export const isPastDate = (dateString) => {
  if (!isValidDate(dateString)) return false;
  
  const date = new Date(dateString);
  const today = new Date();
  
  return date < today;
};

// Validate if date is in the future
export const isFutureDate = (dateString) => {
  if (!isValidDate(dateString)) return false;
  
  const date = new Date(dateString);
  const today = new Date();
  
  return date > today;
};

// Validate exam marks
export const isValidMarks = (marks, maxMarks = 100) => {
  const numMarks = parseFloat(marks);
  return isNumber(marks) && numMarks >= 0 && numMarks <= maxMarks;
};

// Validate percentage
export const isValidPercentage = (percentage) => {
  const numPercentage = parseFloat(percentage);
  return isNumber(percentage) && numPercentage >= 0 && numPercentage <= 100;
};