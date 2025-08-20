// Prepare form data for API submission
export const prepareFormData = (formData, file) => {
  const formDataToSend = new FormData();
  
  // Append all form data
  for (const key in formData) {
    if (formData[key] !== null && formData[key] !== undefined) {
      if (key === 'photo') continue;
      
      if (typeof formData[key] === 'object') {
        formDataToSend.append(key, JSON.stringify(formData[key]));
      } else {
        formDataToSend.append(key, formData[key]);
      }
    }
  }
  
  // Handle date fields
  const dateFields = ['dateOfBirth', 'joiningDate', 'farewellDate'];
  dateFields.forEach(field => {
    if (formData[field]) {
      formDataToSend.append(field, new Date(formData[field]).toISOString());
    }
  });
  
  // Append file if exists
  if (file) {
    formDataToSend.append('photo', file);
  }
  
  return formDataToSend;
};

// Parse form data from API response
export const parseFormData = (studentData) => {
  if (!studentData) return {};
  
  // Create a copy of the student data
  const parsedData = { ...studentData };
  
  // Parse nested objects if they are strings
  if (typeof parsedData.feeDetails === 'string') {
    try {
      parsedData.feeDetails = JSON.parse(parsedData.feeDetails);
    } catch (e) {
      parsedData.feeDetails = {};
    }
  }
  
  if (typeof parsedData.examResults === 'string') {
    try {
      parsedData.examResults = JSON.parse(parsedData.examResults);
    } catch (e) {
      parsedData.examResults = [];
    }
  }
  
  // Ensure installmentDetails is an array
  if (parsedData.feeDetails && !Array.isArray(parsedData.feeDetails.installmentDetails)) {
    parsedData.feeDetails.installmentDetails = [];
  }
  
  // Ensure examResults is an array
  if (!Array.isArray(parsedData.examResults)) {
    parsedData.examResults = [];
  }
  
  return parsedData;
};

// Get field value from nested object path
export const getNestedValue = (obj, path) => {
  if (!obj || !path) return undefined;
  
  const keys = path.split('.');
  let value = obj;
  
  for (const key of keys) {
    if (value === null || value === undefined) {
      return undefined;
    }
    
    // Handle array index access (e.g., installmentDetails[0].amount)
    const arrayMatch = key.match(/(\w+)\[(\d+)\]/);
    if (arrayMatch) {
      const arrayName = arrayMatch[1];
      const arrayIndex = parseInt(arrayMatch[2], 10);
      
      if (!Array.isArray(value[arrayName]) || arrayIndex >= value[arrayName].length) {
        return undefined;
      }
      
      value = value[arrayName][arrayIndex];
    } else {
      value = value[key];
    }
  }
  
  return value;
};

// Set field value in nested object path
export const setNestedValue = (obj, path, value) => {
  if (!obj || !path) return obj;
  
  const keys = path.split('.');
  const newObj = { ...obj };
  let current = newObj;
  
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    
    // Handle array index access (e.g., installmentDetails[0].amount)
    const arrayMatch = key.match(/(\w+)\[(\d+)\]/);
    if (arrayMatch) {
      const arrayName = arrayMatch[1];
      const arrayIndex = parseInt(arrayMatch[2], 10);
      
      if (!current[arrayName]) {
        current[arrayName] = [];
      }
      
      if (!current[arrayName][arrayIndex]) {
        current[arrayName][arrayIndex] = {};
      }
      
      current = current[arrayName][arrayIndex];
    } else {
      if (!current[key]) {
        current[key] = {};
      }
      
      current = current[key];
    }
  }
  
  const lastKey = keys[keys.length - 1];
  
  // Handle array index access for the last key
  const arrayMatch = lastKey.match(/(\w+)\[(\d+)\]/);
  if (arrayMatch) {
    const arrayName = arrayMatch[1];
    const arrayIndex = parseInt(arrayMatch[2], 10);
    
    if (!current[arrayName]) {
      current[arrayName] = [];
    }
    
    current[arrayName][arrayIndex] = value;
  } else {
    current[lastKey] = value;
  }
  
  return newObj;
};