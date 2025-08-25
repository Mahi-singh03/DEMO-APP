'use client';

import React, { useState, useEffect } from 'react';

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    fatherName: '',
    phoneNumber: '',
    email: '',
    courseSelected: '',
  });
  const [error, setError] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [successData, setSuccessData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  // Courses from your MongoDB schema
  const courses = [
    "VN video editing",
    "AI and ChatGPT",
    "MS Excel Course",
    "Canva Course",
    "HTML Course"
  ];

  useEffect(() => {
    // Add CSS animations dynamically
    const style = document.createElement('style');
    style.textContent = `
      @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.02); }
        100% { transform: scale(1); }
      }
      @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
      }
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes slideIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes float {
        0% { transform: translateY(0px); }
        50% { transform: translateY(-5px); }
        100% { transform: translateY(0px); }
      }
      .animate-pulse { animation: pulse 0.5s ease; }
      .animate-shake { animation: shake 0.5s ease; }
      .animate-fadeIn { animation: fadeIn 0.5s ease; }
      .animate-slideIn { animation: slideIn 0.5s ease; }
      .animate-float { animation: float 3s ease-in-out infinite; }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const validateField = (name, value) => {
    let error = '';
    
    switch (name) {
      case 'fullName':
      case 'fatherName':
        if (!value.trim()) error = 'This field is required';
        else if (value.trim().length < 2) error = 'Must be at least 2 characters';
        break;
      case 'phoneNumber':
        if (!value.trim()) error = 'Phone number is required';
        else if (!/^[0-9]{10}$/.test(value)) error = 'Please enter a valid 10-digit phone number';
        break;
      case 'email':
        if (!value.trim()) error = 'Email is required';
        else if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value)) error = 'Please enter a valid email address';
        break;
      case 'courseSelected':
        if (!value) error = 'Please select a course';
        break;
      default:
        break;
    }
    
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear general error when user starts typing
    if (error) setError('');
    
    // Validate the current field
    const fieldError = validateField(name, value);
    setFieldErrors({ ...fieldErrors, [name]: fieldError });
    
    // Add animation to the active field
    if (e.target.parentElement) {
      e.target.parentElement.classList.add('animate-pulse');
      setTimeout(() => {
        if (e.target.parentElement) {
          e.target.parentElement.classList.remove('animate-pulse');
        }
      }, 500);
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const fieldError = validateField(name, value);
    setFieldErrors({ ...fieldErrors, [name]: fieldError });
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    Object.keys(formData).forEach(field => {
      const error = validateField(field, formData[field]);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });

    setFieldErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setError('Please fix the errors in the form');
      const errorElement = document.getElementById('error-message');
      if (errorElement) {
        errorElement.classList.add('animate-shake');
        setTimeout(() => {
          errorElement.classList.remove('animate-shake');
        }, 1000);
      }
      
      // Scroll to the first error
      const firstErrorField = document.querySelector('[data-error="true"]');
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
        const inputElement = firstErrorField.querySelector('input, select');
        if (inputElement) inputElement.focus();
      }
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/onlineCourse/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Registration failed');
      }

      setSuccessData(result.data);
      setShowPopup(true);
      setFormData({
        fullName: '',
        fatherName: '',
        phoneNumber: '',
        email: '',
        courseSelected: '',
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setSuccessData(null);
  };

  const generateWhatsAppLink = () => {
    if (!successData) return '';
    const message = `Hello, I am ${successData.fullName}. I have registered for the ${successData.courseSelected} course. Please provide payment details and my password.`;
    const phoneNumber = '+919781278770'; // Replace with your WhatsApp number
    return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 hover:shadow-2xl">
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-6 text-center">
          <h1 className="text-3xl font-bold text-white animate-fadeIn">Course Registration</h1>
          <p className="text-blue-100 mt-2 animate-fadeIn" style={{ animationDelay: '0.1s' }}>
            Join thousands of students learning in-demand skills
          </p>
        </div>

        <div className="p-6">
          {error && (
            <div id="error-message" className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start animate-slideIn">
              <svg
                className="h-5 w-5 text-red-500 mt-0.5 mr-2 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <div>
                <h3 className="font-medium text-red-800">Registration Error</h3>
                <p className="text-sm text-red-600 mt-1">{error}</p>
              </div>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-5">
            {['fullName', 'fatherName', 'phoneNumber', 'email'].map((field, index) => (
              <div key={field} className="animate-fadeIn" style={{ animationDelay: `${index * 0.1}s` }} data-error={!!fieldErrors[field]}>
                <label htmlFor={field} className="block text-sm font-medium text-gray-700 mb-1">
                  {field === 'fullName' && 'Full Name'}
                  {field === 'fatherName' && 'Father\'s Name'}
                  {field === 'phoneNumber' && 'Phone Number'}
                  {field === 'email' && 'Email Address'}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-5 w-5 text-gray-400" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      {field.includes('Name') && (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      )}
                      {field === 'phoneNumber' && (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      )}
                      {field === 'email' && (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      )}
                    </svg>
                  </div>
                  <input
                    type={field === 'email' ? 'email' : field === 'phoneNumber' ? 'tel' : 'text'}
                    name={field}
                    id={field}
                    value={formData[field]}
                    onChange={handleChange}
                     spellCheck="false"
                    onBlur={handleBlur}
                    className={`pl-10 mt-1 block w-full px-4 py-3 border ${fieldErrors[field] ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'} rounded-lg placeholder-gray-400 focus:outline-none transition duration-300 ease-in-out`}
                    placeholder={
                      field === 'fullName' ? 'Enter your full name' :
                      field === 'fatherName' ? 'Enter your father\'s name' :
                      field === 'phoneNumber' ? 'Enter your 10-digit phone number' :
                      'Enter your email address'
                    }
                  />
                </div>
                {fieldErrors[field] && (
                  <p className="mt-1 text-sm text-red-600 animate-fadeIn">{fieldErrors[field]}</p>
                )}
              </div>
            ))}
            
            <div className="animate-fadeIn" style={{ animationDelay: '0.4s' }} data-error={!!fieldErrors.courseSelected}>
              <label htmlFor="courseSelected" className="block text-sm font-medium text-gray-700 mb-1">
                Select Course
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <select
                  name="courseSelected"
                  id="courseSelected"
                  value={formData.courseSelected}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`pl-10 mt-1 block w-full px-4 py-3 border ${fieldErrors.courseSelected ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'} rounded-lg placeholder-gray-400 focus:outline-none transition duration-300 ease-in-out appearance-none`}
                >
                  <option value="">Select a course</option>
                  {courses.map((course) => (
                    <option key={course} value={course}>
                      {course}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <svg className="h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              {fieldErrors.courseSelected && (
                <p className="mt-1 text-sm text-red-600 animate-fadeIn">{fieldErrors.courseSelected}</p>
              )}
            </div>
            
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-white font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 ${isSubmitting ? 'bg-blue-400' : 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 transform hover:-translate-y-0.5'}`}
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Register Now
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        <div className="bg-gray-50 px-6 py-4 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <a
              href="/login"
              className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-300"
            >
              Sign in
            </a>
          </p>
          <p className="text-gray-600 text-center mb-6 pt-4">
              If the registration completes successfully, please contact us on 
              +91 ******** WhatsApp for payment details and your password.
            </p>
        </div>
      </div>

      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-blur bg-opacity-50 backdrop-blur-sm z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl transform transition-all duration-300 scale-95 hover:scale-100">
            <div className="text-center mb-4">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 animate-float">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            
            <h3 className="text-xl font-bold text-gray-800 text-center mb-2">Registration Successful!</h3>
            <p className="text-gray-600 text-center mb-6">
              To complete your enrollment and get access to the course materials, please contact us on WhatsApp for payment details and your password.
            </p>
            
            
            <div className="flex flex-col gap-3">
              <a
                href={generateWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-green-500 text-white py-3 px-4 rounded-lg hover:bg-green-600 transition duration-300"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .160 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.864 3.49"/>
                </svg>
                Contact via WhatsApp
              </a>
              <button
                onClick={handleClosePopup}
                className="bg-gray-100 text-gray-800 py-3 px-4 rounded-lg hover:bg-gray-200 transition duration-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegistrationForm;