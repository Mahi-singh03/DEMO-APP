'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { format, parseISO } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { FiTrash2, FiSave, FiX, FiAlertCircle, FiCheckCircle, FiLoader, FiCalendar, FiUser, FiBriefcase, FiHome, FiChevronLeft } from 'react-icons/fi';

const EditStaff = () => {
  const router = useRouter();
  const params = useParams();
  const id = params.id;
  const [staff, setStaff] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [darkMode, setDarkMode] = useState(false);
  
  const [formData, setFormData] = useState({
    Name: '',
    StaffID: '',
    JoinningData: '',
    Designation: '',
    DOB: '',
    LeavingDate: '',
    FatherName: '',
    Address: ''
  });

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

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

  // Fetch staff data
  useEffect(() => {
    if (!id) return;
    
    const fetchStaff = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const res = await fetch(`/api/admin/staff/editStaff/${id}`);
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || 'Failed to fetch staff data');
        }
        
        const data = await res.json();
        setStaff(data);
        
        const formatDateSafely = (dateString) => {
          if (!dateString) return '';
          try {
            return format(parseISO(dateString), 'yyyy-MM-dd');
          } catch {
            return dateString;
          }
        };
        
        setFormData({
          Name: data.Name || '',
          StaffID: data.StaffID || '',
          JoinningData: formatDateSafely(data.JoinningData),
          Designation: data.Designation || '',
          DOB: formatDateSafely(data.DOB),
          LeavingDate: formatDateSafely(data.LeavingDate),
          FatherName: data.FatherName || '',
          Address: data.Address || ''
        });
      } catch (err) {
        setError(err.message);
        console.error('Fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchStaff();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is edited
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);
    
    try {
      const res = await fetch(`/api/admin/staff/editStaff/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to update staff');
      }
      
      setSuccess(true);
      setError(null);
      
      setTimeout(() => {
        router.push('/mahi/staff/editStaff');
      }, 1500);
    } catch (err) {
      setError(err.message);
      console.error('Update error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    try {
      setIsSubmitting(true);
      setError(null);
      
      const res = await fetch(`/api/admin/staff/editStaff/${id}`, {
        method: 'DELETE',
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to delete staff');
      }
      
      router.push('/mahi/staff/editStaff');
    } catch (err) {
      setError(err.message);
      console.error('Delete error:', err);
    } finally {
      setIsSubmitting(false);
      setShowDeleteConfirm(false);
    }
  };

  if (isLoading) return (
    <div className="flex items-center justify-center min-h-screen px-4 bg-gray-50 dark:bg-[#030712]">
      <div className="w-full max-w-4xl">
        <div className="animate-pulse space-y-6">
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i}>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-2"></div>
                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            ))}
          </div>
          <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="flex justify-end space-x-4">
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
          </div>
        </div>
      </div>
    </div>
  );
  
  if (error && !staff) return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex items-center justify-center min-h-screen px-4 bg-gray-50 dark:bg-[#030712]"
    >
      <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 dark:border-red-400 text-red-700 dark:text-red-100 p-6 max-w-md w-full rounded-lg shadow-sm">
        <div className="flex items-start">
          <FiAlertCircle className="w-6 h-6 mr-2 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-bold text-lg">Error Loading Staff</h3>
            <p className="mt-1">{error}</p>
            <div className="mt-4 flex space-x-3">
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
              >
                Try Again
              </button>
              <button
                onClick={() => router.push('/mahi/staff/editStaff')}
                className="px-4 py-2 bg-gray-500 dark:bg-gray-600 text-white rounded hover:bg-gray-600 dark:hover:bg-gray-700 transition"
              >
                Back to List
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
  
  if (!staff) return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex items-center justify-center min-h-screen px-4 bg-gray-50 dark:bg-[#030712]"
    >
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm text-center max-w-md w-full">
        <FiAlertCircle className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-500" />
        <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">Staff Member Not Found</h3>
        <p className="mt-1 text-gray-500 dark:text-gray-400">The staff member you're looking for doesn't exist.</p>
        <button
          onClick={() => router.push('/mahi/staff/editStaff')}
          className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Back to Staff List
        </button>
      </div>
    </motion.div>
  );

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen bg-gray-50 dark:bg-[#030712]  md:pt-15 py-8 px-4 sm:px-6 transition-colors duration-300"
    >
      <div className="max-w-4xl mx-auto">
        <motion.header variants={itemVariants} className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => router.push('/mahi/staff/editStaff')}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label="Back to staff list"
            >
              <FiChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Edit Staff Member</h1>
          </div>
          <div className="flex space-x-3 w-full sm:w-auto">
            <button 
              onClick={() => setShowDeleteConfirm(true)}
              disabled={isSubmitting}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              <FiTrash2 className="mr-2" />
              Delete
            </button>
            <button 
              onClick={toggleDarkMode}
              className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>
          </div>
        </motion.header>

        <motion.div 
          variants={itemVariants}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-colors duration-300 border border-gray-200 dark:border-gray-700"
        >
          <form onSubmit={handleSubmit} className="p-6">
            <AnimatePresence>
              {success && (
                <motion.div 
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 dark:border-green-400 text-green-700 dark:text-green-100 rounded"
                >
                  <div className="flex items-center">
                    <FiCheckCircle className="w-5 h-5 mr-2" />
                    <p className="font-medium">Staff member updated successfully! Redirecting...</p>
                  </div>
                </motion.div>
              )}
              
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 dark:border-red-400 text-red-700 dark:text-red-100 rounded"
                >
                  <div className="flex items-center">
                    <FiAlertCircle className="w-5 h-5 mr-2" />
                    <p className="font-medium">{error}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            <motion.div 
              variants={containerVariants}
              className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6"
            >
              {[
                {
                  id: 'Name',
                  label: 'Full Name *',
                  type: 'text',
                  icon: <FiUser className="text-gray-400 dark:text-gray-500" />,
                  required: true,
                  error: formErrors.Name
                },
                {
                  id: 'StaffID',
                  label: 'Staff ID',
                  type: 'text',
                  icon: <FiBriefcase className="text-gray-400 dark:text-gray-500" />,
                  readOnly: true,
                  disabled: true
                },
                {
                  id: 'Designation',
                  label: 'Designation *',
                  type: 'text',
                  icon: <FiBriefcase className="text-gray-400 dark:text-gray-500" />,
                  required: true,
                  error: formErrors.Designation
                },
                {
                  id: 'DOB',
                  label: 'Date of Birth *',
                  type: 'date',
                  icon: <FiCalendar className="text-gray-400 dark:text-gray-500" />,
                  required: true,
                  error: formErrors.DOB
                },
                {
                  id: 'JoinningData',
                  label: 'Joining Date *',
                  type: 'date',
                  icon: <FiCalendar className="text-gray-400 dark:text-gray-500" />,
                  required: true,
                  error: formErrors.JoinningData
                },
                {
                  id: 'LeavingDate',
                  label: 'Leaving Date (if applicable)',
                  type: 'date',
                  icon: <FiCalendar className="text-gray-400 dark:text-gray-500" />
                },
                {
                  id: 'FatherName',
                  label: 'Father\'s Name',
                  type: 'text',
                  icon: <FiUser className="text-gray-400 dark:text-gray-500" />
                }
              ].map((field, index) => (
                <motion.div 
                  key={field.id}
                  variants={itemVariants}
                  className="space-y-1"
                >
                  <label htmlFor={field.id} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {field.label}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      {field.icon}
                    </div>
                    <input
                      type={field.type}
                      id={field.id}
                      name={field.id}
                      value={formData[field.id]}
                      onChange={handleChange}
                      required={field.required}
                      readOnly={field.readOnly}
                      disabled={field.disabled}
                      className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        field.error ? 'border-red-300 bg-red-50 dark:bg-red-900/10' : 'border-gray-300 dark:border-gray-600'
                      } ${field.readOnly || field.disabled ? 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400' : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white'}`}
                    />
                  </div>
                  {field.error && (
                    <p className="text-sm text-red-600 dark:text-red-400">{field.error}</p>
                  )}
                </motion.div>
              ))}
            </motion.div>
            
            <motion.div variants={itemVariants} className="mb-6 space-y-1">
              <label htmlFor="Address" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 pt-3 pointer-events-none">
                  <FiHome className="text-gray-400 dark:text-gray-500" />
                </div>
                <textarea
                  id="Address"
                  name="Address"
                  value={formData.Address}
                  onChange={handleChange}
                  rows={4}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>
            </motion.div>
            
            <motion.div 
              variants={itemVariants}
              className="flex flex-col-reverse sm:flex-row justify-end space-y-4 sm:space-y-0 space-x-0 sm:space-x-4"
            >
              <button
                type="button"
                onClick={() => router.push('/mahi/staff/editStaff')}
                className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                disabled={isSubmitting}
              >
                <FiX className="mr-2" />
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <FiLoader className="animate-spin mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <FiSave className="mr-2" />
                    Save Changes
                  </>
                )}
              </button>
            </motion.div>
          </form>
        </motion.div>
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-blur bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div 
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6 border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-start">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                  <FiAlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Delete Staff Member</h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Are you sure you want to delete {formData.Name}? This action cannot be undone.
                    </p>
                  </div>
                  <div className="mt-4 flex space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowDeleteConfirm(false)}
                      className="px-4 py-2 bg-gray-500 dark:bg-gray-600 text-white rounded-md hover:bg-gray-600 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 flex items-center justify-center"
                      disabled={isSubmitting}
                    >
                      <FiX className="mr-2" />
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleDelete}
                      className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 flex items-center justify-center"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <FiLoader className="animate-spin mr-2" />
                          Deleting...
                        </>
                      ) : (
                        <>
                          <FiTrash2 className="mr-2" />
                          Delete
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default EditStaff;