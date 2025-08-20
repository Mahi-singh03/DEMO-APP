"use client"
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiUser, 
  FiCalendar, 
  FiBriefcase, 
  FiHome, 
  FiCheckCircle, 
  FiAlertCircle, 
  FiLoader, 
  FiX,
  FiArrowLeft,
  FiArrowUp
} from 'react-icons/fi';

const AddStaff = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    Name: '',
    JoinningData: '',
    Designation: '',
    DOB: '',
    FatherName: '',
    Address: '',
    LeavingDate: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [generatedStaffId, setGeneratedStaffId] = useState(null);
  const [isMounted, setIsMounted] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  
  const formRef = useRef(null);

  useEffect(() => {
    setIsMounted(true);
    
    // Handle scroll events for scroll-to-top button
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      setIsMounted(false);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        when: "beforeChildren"
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    }
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 }
  };

  // Validate form
  const validateForm = () => {
    const errors = {};
    if (!formData.Name.trim()) errors.Name = 'Name is required';
    if (!formData.Designation.trim()) errors.Designation = 'Designation is required';
    if (!formData.DOB) errors.DOB = 'Date of birth is required';
    if (!formData.JoinningData) errors.JoinningData = 'Joining date is required';
    if (!formData.FatherName.trim()) errors.FatherName = 'Father\'s name is required';
    if (!formData.Address.trim()) errors.Address = 'Address is required';
    
    // Validate dates
    if (formData.DOB && formData.JoinningData) {
      const dobDate = new Date(formData.DOB);
      const joinDate = new Date(formData.JoinningData);
      
      if (dobDate > joinDate) {
        errors.DOB = 'Date of birth cannot be after joining date';
      }
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error when field is edited
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    setError('');
    setShowPopup(false);

    try {
      const payload = { ...formData };
      if (!payload.LeavingDate) delete payload.LeavingDate;

      const response = await fetch('/api/admin/staff/addstaff', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Failed to add staff');
      }

      const data = await response.json();
      setGeneratedStaffId(data.StaffID);
      setShowPopup(true);
      setFormData({
        Name: '',
        JoinningData: '',
        Designation: '',
        DOB: '',
        FatherName: '',
        Address: '',
        LeavingDate: '',
      });
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to add staff');
      console.error('Error adding staff:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoToHome = () => router.push('/mahi');
  const handleGoToStaffList = () => router.push('/mahi/staff/editStaff');

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!isMounted) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200"
        >
          <div className="p-6">
            <motion.header variants={itemVariants} className="flex items-center space-x-4 mb-6">
              <button 
                onClick={() => router.push('/mahi/staff/editStaff')}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Back to staff list"
              >
                <FiArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-blue-600">Add New Staff</h1>
                <p className="text-gray-600 text-sm">Create a new staff member profile</p>
              </div>
            </motion.header>

            <form onSubmit={handleSubmit} className="space-y-4" ref={formRef}>
              {[
                {
                  label: 'Full Name *',
                  name: 'Name',
                  type: 'text',
                  icon: <FiUser className="text-gray-400" />,
                  error: formErrors.Name
                },
                {
                  label: 'Joining Date *',
                  name: 'JoinningData',
                  type: 'date',
                  icon: <FiCalendar className="text-gray-400" />,
                  error: formErrors.JoinningData
                },
                {
                  label: 'Designation *',
                  name: 'Designation',
                  type: 'text',
                  icon: <FiBriefcase className="text-gray-400" />,
                  error: formErrors.Designation
                },
                {
                  label: 'Date of Birth *',
                  name: 'DOB',
                  type: 'date',
                  icon: <FiCalendar className="text-gray-400" />,
                  error: formErrors.DOB
                },
                {
                  label: "Father's Name *",
                  name: 'FatherName',
                  type: 'text',
                  icon: <FiUser className="text-gray-400" />,
                  error: formErrors.FatherName
                },
                {
                  label: 'Leaving Date (Optional)',
                  name: 'LeavingDate',
                  type: 'date',
                  icon: <FiCalendar className="text-gray-400" />
                }
              ].map((field, index) => (
                <motion.div
                  key={field.name}
                  variants={itemVariants}
                  className="space-y-1"
                >
                  <label className="block text-sm font-medium text-gray-700">
                    {field.label}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      {field.icon}
                    </div>
                    <input
                      type={field.type}
                      name={field.name}
                      className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        field.error ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder={`Enter ${field.label.toLowerCase()}`}
                      value={formData[field.name]}
                      onChange={handleChange}
                      disabled={loading}
                    />
                  </div>
                  {field.error && (
                    <p className="text-sm text-red-600">{field.error}</p>
                  )}
                </motion.div>
              ))}

              <motion.div variants={itemVariants} className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Address *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 pt-3 pointer-events-none">
                    <FiHome className="text-gray-400" />
                  </div>
                  <textarea
                    name="Address"
                    rows={3}
                    className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical ${
                      formErrors.Address ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="Enter address"
                    value={formData.Address}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>
                {formErrors.Address && (
                  <p className="text-sm text-red-600">{formErrors.Address}</p>
                )}
              </motion.div>

              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg flex items-start gap-3">
                      <FiAlertCircle className="mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Error:</p>
                        <p>{error}</p>
                      </div>
                      <button 
                        onClick={() => setError('')} 
                        className="ml-auto text-red-500 hover:text-red-700"
                      >
                        <FiX />
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.div variants={itemVariants}>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white py-2 px-4 rounded-lg font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <FiLoader className="animate-spin mr-2" />
                      Adding Staff...
                    </>
                  ) : (
                    <>
                      <FiUser className="mr-2" />
                      Add Staff Member
                    </>
                  )}
                </button>
              </motion.div>
            </form>
          </div>
        </motion.div>

        <AnimatePresence>
          {showPopup && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            >
              <motion.div
                variants={modalVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 border border-gray-200"
              >
                <div className="flex items-start mb-4">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                    <FiCheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Success!</h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-600">
                        New staff member <strong className="text-gray-900">{formData.Name || 'Staff'}</strong> has been added successfully.
                      </p>
                      {generatedStaffId && (
                        <div className="mt-3 bg-blue-50 p-3 rounded-lg">
                          <p className="text-sm font-medium text-blue-800">Staff ID:</p>
                          <p className="text-lg font-bold text-blue-900">{generatedStaffId}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 mt-6">
                  <button
                    onClick={handleGoToStaffList}
                    className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                  >
                    View Staff List
                  </button>
                  <button
                    onClick={handleGoToHome}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                  >
                    Go to Dashboard
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Scroll to Top Button */}
        <AnimatePresence>
          {showScrollTop && (
            <motion.button
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              onClick={scrollToTop}
              className="fixed bottom-6 right-6 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition z-50"
              aria-label="Scroll to top"
            >
              <FiArrowUp size={20} />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AddStaff;