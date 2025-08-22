'use client'
import { useState } from 'react';
import { FiSearch, FiUser, FiMail, FiPhone, FiBook, FiAlertCircle } from 'react-icons/fi';
import { toast } from 'react-toastify';
import axios from 'axios';
import ClipLoader from 'react-spinners/ClipLoader'; 

const StudentSearch = ({ onStudentLoad, onSearchError, isLoading, setIsLoading }) => {
  const [searchInput, setSearchInput] = useState('');
  const [studentData, setStudentData] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [inputError, setInputError] = useState('');

  const validateInput = (input) => {
    // Check if input is empty
    if (!input.trim()) {
      return 'Please enter a roll number, phone number, or email address';
    }
    
    // Check if input is a phone number (10 digits)
    if (/^\d{10}$/.test(input.trim())) {
      return '';
    }
    
    // Check if input is an email
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.trim())) {
      return '';
    }
    
    // Check if input is a roll number (alphanumeric, at least 2 characters)
    if (/^[a-zA-Z0-9]{2,}$/.test(input.trim())) {
      return '';
    }
    
    return 'Please enter a valid roll number, phone number (10 digits), or email address';
  };

  const fetchStudent = async () => {
    const error = validateInput(searchInput);
    if (error) {
      setInputError(error);
      toast.error(error);
      return;
    }
    
    setInputError('');
    setIsLoading(true);
    
    try {
      const response = await axios.get(`/api/student/editStudent/getStudent?identifier=${encodeURIComponent(searchInput.trim())}`);
      onStudentLoad(response.data.student);
      setStudentData(response.data.student);
      setShowResults(true);
      toast.success('Student found successfully!');
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Student not found. Please check the details.';
      onSearchError(errorMessage);
      setStudentData(null);
      setShowResults(true);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const clearSearch = () => {
    setSearchInput('');
    setStudentData(null);
    setShowResults(false);
    setInputError('');
    onStudentLoad(null);
  };

  const handleInputChange = (e) => {
    setSearchInput(e.target.value);
    // Clear error when user starts typing
    if (inputError) {
      setInputError('');
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-2xl p-6 mb-6 transition-all duration-300 hover:shadow-xl animate-fade-in-up">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center flex items-center justify-center">
        <FiSearch className="mr-2 text-blue-500" /> Student Search
      </h2>
      
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <div className="flex-1 relative w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="h-5 w-5 text-gray-400 transition-colors duration-300" />
          </div>
          <input
            type="text"
            placeholder="Search by Roll No, Phone, or Email"
            className={`block w-full pl-10 pr-24 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-300 shadow-sm ${
              inputError ? 'border-red-500' : 'border-gray-300'
            }`}
            value={searchInput}
            onChange={handleInputChange}
            onKeyPress={(e) => e.key === 'Enter' && fetchStudent()}
          />
          {inputError && (
            <div className="absolute -bottom-5 left-0 flex items-center text-red-500 text-xs mt-1">
              <FiAlertCircle className="mr-1" /> {inputError}
            </div>
          )}
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 gap-1">
            {searchInput && (
              <button
                onClick={clearSearch}
                className="p-1 rounded-full hover:bg-gray-100 transition-colors duration-200"
                aria-label="Clear search"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
            <button
              onClick={fetchStudent}
              disabled={isLoading}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              {isLoading ? (
                <ClipLoader color="#ffffff" size={20} />
              ) : (
                'Search'
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Hint Text */}
      <p className="text-sm text-gray-500 mt-6 text-center animate-pulse">
        Try searching by roll number, phone number (10 digits).
      </p>

    </div>
  );
};

export default StudentSearch;