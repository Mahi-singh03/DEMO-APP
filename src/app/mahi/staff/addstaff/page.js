"use client"
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

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

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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

  const handleGoToHome = () => router.push('/CS');

  if (!isMounted) return null;

  return (
    <div className="min-h-screen bg-[#030712] pt-12 px-4 py-6 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-gray-800 p-6 sm:p-8 rounded-xl shadow-2xl"
      >
        <motion.h1 
          className="text-2xl sm:text-3xl font-bold text-blue-400 text-center mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          Add New Staff Member
        </motion.h1>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {[
            { label: 'Name', name: 'Name', type: 'text', required: true },
            { label: 'Joining Date', name: 'JoinningData', type: 'date', required: true },
            { label: 'Designation', name: 'Designation', type: 'text', required: true },
            { label: 'Date of Birth', name: 'DOB', type: 'date', required: true },
            { label: "Father's Name", name: 'FatherName', type: 'text', required: true },
            { label: 'Address', name: 'Address', type: 'text', required: true },
          ].map((field, index) => (
            <motion.div
              key={field.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
            >
              <label className="block text-gray-300 text-sm font-medium mb-1">
                {field.label}
              </label>
              <input
                type={field.type}
                name={field.name}
                required={field.required}
                className="w-full px-4 py-2 sm:py-3 text-sm sm:text-base bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-200 placeholder-gray-400 disabled:opacity-50 transition-colors duration-200"
                placeholder={`Enter ${field.label.toLowerCase()}`}
                value={formData[field.name]}
                onChange={handleChange}
                disabled={loading}
              />
            </motion.div>
          ))}

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <label className="block text-gray-300 text-sm font-medium mb-1">
              Leaving Date (Optional)
            </label>
            <input
              type="date"
              name="LeavingDate"
              className="w-full px-4 py-2 sm:py-3 text-sm sm:text-base bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-200 placeholder-gray-400 disabled:opacity-50 transition-colors duration-200"
              value={formData.LeavingDate}
              onChange={handleChange}
              disabled={loading}
            />
          </motion.div>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="text-red-400 text-sm flex items-center gap-2 bg-red-900/30 p-2 rounded-lg">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  {error}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
          >
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 sm:py-3 px-4 rounded-lg font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-sm sm:text-base transform hover:scale-[1.01] active:scale-[0.99]"
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6z" />
                  </svg>
                  Add Staff
                </span>
              )}
            </button>
          </motion.div>
        </form>
        <AnimatePresence>
            {showPopup && (
                <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 flex items-center justify-center z-50 p-4"
                >
                {/* Blurred background overlay */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-blur bg-opacity-70 backdrop-blur-sm"
                />
                
                {/* Popup content */}
                <motion.div
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: 20 }}
                    className="bg-gray-800 p-6 sm:p-8 rounded-lg shadow-xl max-w-md w-full border border-gray-700 relative z-10"
                >
                    <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-full bg-green-900/30">
                        <svg className="w-6 h-6 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-bold text-green-400">Success!</h2>
                    </div>
                    <p className="text-gray-300 mb-6">
                    New staff member <strong className="text-white">{formData.Name || 'Staff'}</strong> has been added
                    successfully. {generatedStaffId && (
                        <span className="block mt-2 bg-gray-700 px-3 py-2 rounded-md text-blue-300 font-mono">
                        Staff ID: {generatedStaffId}
                        </span>
                    )}
                    </p>
                    <button
                    onClick={handleGoToHome}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2"
                    >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                    </svg>
                    Go to Dashboard
                    </button>
                </motion.div>
                </motion.div>
            )}
            </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default AddStaff;