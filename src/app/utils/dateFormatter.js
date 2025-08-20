// Format date for display
export const formatDate = (dateString, options = {}) => {
  if (!dateString) return '-';
  
  const defaultOptions = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  };
  
  const date = new Date(dateString);
  
  if (isNaN(date.getTime())) return '-';
  
  return date.toLocaleDateString('en-IN', { ...defaultOptions, ...options });
};

// Format date for input fields (YYYY-MM-DD)
export const formatDateForInput = (dateString) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  
  if (isNaN(date.getTime())) return '';
  
  return date.toISOString().split('T')[0];
};

// Calculate age from date of birth
export const calculateAge = (dateOfBirth) => {
  if (!dateOfBirth) return null;
  
  const birthDate = new Date(dateOfBirth);
  const today = new Date();
  
  if (isNaN(birthDate.getTime())) return null;
  
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
};

// Check if a date is in the past
export const isPastDate = (dateString) => {
  if (!dateString) return false;
  
  const date = new Date(dateString);
  const today = new Date();
  
  if (isNaN(date.getTime())) return false;
  
  return date < today;
};

// Check if a date is in the future
export const isFutureDate = (dateString) => {
  if (!dateString) return false;
  
  const date = new Date(dateString);
  const today = new Date();
  
  if (isNaN(date.getTime())) return false;
  
  return date > today;
};