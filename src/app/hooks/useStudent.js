import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

export const useStudent = () => {
  const [student, setStudent] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchStudent = async (identifier) => {
    if (!identifier?.trim()) {
      toast.error('Please enter a roll number or phone number');
      return null;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const response = await axios.get(`/api/admin/student/editStudent/getStudent?identifier=${identifier.trim()}`);
      setStudent(response.data.student);
      toast.success('Student found successfully!');
      return response.data.student;
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Student not found. Please check the details.';
      setError(errorMsg);
      toast.error(errorMsg);
      setStudent(null);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const updateStudent = async (studentId, formData, file) => {
    setIsLoading(true);
    setError(null);
    
    try {
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
  
      const response = await axios.put(`/api/admin/student/editStudent/${studentId}`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      setStudent(response.data.student);
      toast.success('Student updated successfully!');
      return response.data.student;
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to update student';
      setError(errorMsg);
      toast.error(errorMsg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const resetStudent = () => {
    setStudent(null);
    setError(null);
  };

  return {
    student,
    isLoading,
    error,
    fetchStudent,
    updateStudent,
    resetStudent
  };
};