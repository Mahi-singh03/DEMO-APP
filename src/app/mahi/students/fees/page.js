"use client"
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const StudentManagementDashboard = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [feeEditData, setFeeEditData] = useState({});
  const [paymentAmount, setPaymentAmount] = useState('');
  const [modalLoading, setModalLoading] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [paymentInstallmentIndex, setPaymentInstallmentIndex] = useState(null);
  const [installmentPaymentAmounts, setInstallmentPaymentAmounts] = useState({});
  
  // Date formatting function
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);
    return `${day}-${month}-${year}`;
  };
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalStudents, setTotalStudents] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPrevPage, setHasPrevPage] = useState(false);

  // Filters
  const [filters, setFilters] = useState({
    feeStatus: '',
    courseCompleted: ''
  });

  // Fetch students from API with pagination
  const fetchStudents = async (page = 1) => {
    try {
      setLoading(true);
      
      // Build query parameters
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '15'
      });
      
      if (searchTerm) params.append('search', searchTerm);
      if (filters.feeStatus) params.append('feeStatus', filters.feeStatus);
      if (filters.courseCompleted) params.append('courseCompleted', filters.courseCompleted);
      
      const response = await fetch(`/api/admin/student/fees?${params.toString()}`);
      const data = await response.json();
      
      if (data.success) {
        setStudents(data.data);
        setFilteredStudents(data.data);
        setCurrentPage(data.currentPage);
        setTotalPages(data.totalPages);
        setTotalStudents(data.totalStudents);
        setHasNextPage(data.hasNextPage);
        setHasPrevPage(data.hasPrevPage);
      } else {
        setError('Failed to fetch students');
      }
    } catch (err) {
      setError('Error connecting to server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents(1);
  }, []);

  // Apply filters and search
  useEffect(() => {
    let result = students;

    // Apply tab filter
    if (activeTab === 'active') {
      result = result.filter(student => !student.isCourseCompleted);
    } else if (activeTab === 'completed') {
      result = result.filter(student => student.isCourseCompleted);
    }

    // Apply fee status filter
    if (filters.feeStatus) {
      result = result.filter(student => student.feeDetails.status === filters.feeStatus);
    }

    // Apply course completion filter
    if (filters.courseCompleted) {
      const isCompleted = filters.courseCompleted === 'completed';
      result = result.filter(student => student.isCourseCompleted === isCompleted);
    }

    setFilteredStudents(result);
  }, [students, activeTab, filters]);

  // Handle search with debouncing
  useEffect(() => {
    if (searchTerm.trim() === '' || searchTerm.length >= 2) {
      const timer = setTimeout(() => {
        fetchStudents(1);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [searchTerm]);

  // Handle filter changes
  useEffect(() => {
    fetchStudents(1);
  }, [filters]);

  // Handle pagination
  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchStudents(page);
  };

  // Handle student selection
  const handleSelectStudent = async (id) => {
    try {
      const response = await fetch(`/api/admin/student/fees/${id}`);
      const data = await response.json();
      
      if (data.success) {
        setSelectedStudent(data.data);
        setFeeEditData({
          totalFees: data.data.feeDetails.totalFees,
          remainingFees: data.data.feeDetails.remainingFees,
          installments: data.data.feeDetails.installmentDetails?.length || 0
        });
        setShowModal(true);
      }
    } catch (err) {
      setError('Error fetching student details');
    }
  };

  // Handle fee payment
  const handleFeePayment = async (studentId, amount, installmentIndex = null) => {
    try {
      setModalLoading(true);
      const response = await fetch(`/api/admin/student/fees/${studentId}/payments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: parseFloat(amount),
          installmentIndex,
          paymentMethod: 'online'
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Refresh student data
        fetchStudents(currentPage);
        if (selectedStudent && selectedStudent._id === studentId) {
          const updatedResponse = await fetch(`/api/admin/student/fees/${studentId}`);
          const updatedData = await updatedResponse.json();
          if (updatedData.success) {
            setSelectedStudent(updatedData.data);
            // Update fee edit data to reflect new installment amounts
            setFeeEditData({
              totalFees: updatedData.data.feeDetails.totalFees,
              remainingFees: updatedData.data.feeDetails.remainingFees,
              installments: updatedData.data.feeDetails.installmentDetails?.length || 0
            });
          }
        }
        setPaymentAmount('');
        setPaymentInstallmentIndex(null);
        setSuccessMessage('Payment successful! Installment amounts have been updated.');
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        setError('Payment failed');
      }
    } catch (err) {
      setError('Error processing payment');
    } finally {
      setModalLoading(false);
    }
  };

  // Handle fee structure update
  const handleFeeUpdate = async (studentId) => {
    try {
      setModalLoading(true);
      
      // Calculate installment amounts
      const totalFees = parseFloat(feeEditData.totalFees);
      const installmentsCount = parseInt(feeEditData.installments);
      const installmentAmounts = [];
      
      if (installmentsCount > 0) {
        const baseAmount = Math.floor(totalFees / installmentsCount);
        const remainder = totalFees % installmentsCount;
        
        // Create equal installments with remainder added to the first installment
        for (let i = 0; i < installmentsCount; i++) {
          installmentAmounts.push(i === 0 ? baseAmount + remainder : baseAmount);
        }
      }
      
      const response = await fetch(`/api/admin/student/fees/${studentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          feeDetails: {
            totalFees: feeEditData.totalFees,
            remainingFees: feeEditData.remainingFees,
            installments: feeEditData.installments,
            installmentAmounts: installmentAmounts
          }
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Refresh student data
        fetchStudents(currentPage);
        if (selectedStudent && selectedStudent._id === studentId) {
          const updatedResponse = await fetch(`/api/admin/student/fees/${studentId}`);
          const updatedData = await updatedResponse.json();
          if (updatedData.success) {
            setSelectedStudent(updatedData.data);
            setFeeEditData({
              totalFees: updatedData.data.feeDetails.totalFees,
              remainingFees: updatedData.data.feeDetails.remainingFees,
              installments: updatedData.data.feeDetails.installmentDetails?.length || 0
            });
          }
        }
        setEditMode(false);
        setSuccessMessage('Fee structure updated successfully!');
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        setError('Failed to update fee structure');
      }
    } catch (err) {
      setError('Error updating fee structure');
    } finally {
      setModalLoading(false);
    }
  };

  // Handle photo upload
  const handlePhotoUpload = async (studentId, file) => {
    try {
      setModalLoading(true);
      // Convert file to base64
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result;
        
        const response = await fetch(`/api/admin/student/fees/${studentId}/photo`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            photo: base64String
          }),
        });
        
        const data = await response.json();
        
        if (data.success) {
          // Refresh student data
          fetchStudents(currentPage);
          if (selectedStudent && selectedStudent._id === studentId) {
            const updatedResponse = await fetch(`/api/admin/student/fees/${studentId}`);
            const updatedData = await updatedResponse.json();
            if (updatedData.success) {
              setSelectedStudent(updatedData.data);
            }
          }
          setSuccessMessage('Photo uploaded successfully!');
          setTimeout(() => setSuccessMessage(null), 3000);
        } else {
          setError('Failed to upload photo');
        }
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setError('Error uploading photo');
    } finally {
      setModalLoading(false);
    }
  };

  // Test function to demonstrate the new payment logic
  const testPaymentLogic = () => {
    console.log('=== NEW PAYMENT REDISTRIBUTION LOGIC ===');
    console.log('Example: Total fees: ₹99, split into 3 installments of ₹33 each');
    console.log('Payment: ₹23 on first installment');
    console.log('');
    console.log('Expected behavior:');
    console.log('1. First installment: ₹33 (marked as PAID with ₹23 payment)');
    console.log('2. Remaining ₹10 from first installment moved to second installment');
    console.log('3. Second installment becomes: ₹33 + ₹10 = ₹43');
    console.log('4. Third installment remains: ₹33');
    console.log('');
    console.log('This ensures installments are marked as complete when any payment is made,');
    console.log('and remaining amounts are automatically redistributed to subsequent installments.');
    console.log('==========================================');
  };

  // Handle installment update
  const handleInstallmentUpdate = async (studentId, installmentIndex, updates) => {
    try {
      setModalLoading(true);
      const response = await fetch(`/api/admin/student/fees/${studentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          feeDetails: {
            installmentDetails: {
              [installmentIndex]: updates
            }
          }
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Refresh student data
        if (selectedStudent && selectedStudent._id === studentId) {
          const updatedResponse = await fetch(`/api/admin/student/fees/${studentId}`);
          const updatedData = await updatedResponse.json();
          if (updatedData.success) {
            setSelectedStudent(updatedData.data);
          }
        }
        setSuccessMessage('Installment updated successfully!');
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        setError('Failed to update installment');
      }
    } catch (err) {
      setError('Error updating installment');
    } finally {
      setModalLoading(false);
    }
  };

  // Render loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-red-500 mb-4">{error}</p>
          <button 
            onClick={() => fetchStudents(currentPage)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Student Management</h1>
            <p className="text-gray-600">Manage and track student information</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => fetchStudents(currentPage)}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
              disabled={loading}
            >
              <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              {loading ? 'Refreshing...' : 'Refresh'}
            </button>
            <button
              onClick={testPaymentLogic}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Test Logic
            </button>
          </div>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Showing {filteredStudents.length} of {totalStudents} students (Page {currentPage} of {totalPages})
        </p>
        
        {/* Success Message */}
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg"
          >
            {successMessage}
          </motion.div>
        )}
        
        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg"
          >
            {error}
            <button 
              onClick={() => setError(null)}
              className="ml-2 text-red-500 hover:text-red-700 font-bold"
            >
              ×
            </button>
          </motion.div>
        )}
      </motion.header>

      {/* Summary Statistics */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6"
      >
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Total Students</p>
              <p className="text-2xl font-bold text-gray-900">{totalStudents}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Fees Paid</p>
              <p className="text-2xl font-bold text-gray-900">
                {filteredStudents.filter(s => s.feeDetails.status === 'paid').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Partial Payment</p>
              <p className="text-2xl font-bold text-gray-900">
                {filteredStudents.filter(s => s.feeDetails.status === 'partial').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Unpaid</p>
              <p className="text-2xl font-bold text-gray-900">
                {filteredStudents.filter(s => s.feeDetails.status === 'unpaid').length}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Filters and Search */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-white p-4 rounded-lg shadow-md mb-6"
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search students..."
              className="w-full p-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              disabled={loading}
            />
            {loading && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            )}
          </div>
          
          <div className="flex gap-2">
            <select
              className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={filters.feeStatus}
              onChange={(e) => setFilters({...filters, feeStatus: e.target.value})}
            >
              <option value="">All Fee Status</option>
              <option value="paid">Paid</option>
              <option value="unpaid">Unpaid</option>
              <option value="partial">Partial</option>
            </select>
            
            <select
              className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={filters.courseCompleted}
              onChange={(e) => setFilters({...filters, courseCompleted: e.target.value})}
            >
              <option value="">All Courses</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="flex border-b border-gray-200 mt-4">
          <button
            className={`px-4 py-2 font-medium ${activeTab === 'all' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('all')}
          >
            All Students
          </button>
          <button
            className={`px-4 py-2 font-medium ${activeTab === 'active' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('active')}
          >
            Active
          </button>
          <button
            className={`px-4 py-2 font-medium ${activeTab === 'completed' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('completed')}
          >
            Completed
          </button>
        </div>
      </motion.div>

      {/* Student Cards Grid */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <AnimatePresence>
          {filteredStudents.map((student, index) => (
            <motion.div
              key={student._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => handleSelectStudent(student._id)}
            >
              <div className="p-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    {student.photo && typeof student.photo === 'object' && student.photo.url ? (
                      <img 
                        src={student.photo.url} 
                        alt={student.fullName}
                        className="h-16 w-16 rounded-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : student.photo && typeof student.photo === 'string' ? (
                      <img 
                        src={student.photo} 
                        alt={student.fullName}
                        className="h-16 w-16 rounded-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div className={`h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center ${(student.photo && ((typeof student.photo === 'object' && student.photo.url) || (typeof student.photo === 'string' && student.photo.trim() !== ''))) ? 'hidden' : 'flex'}`}>
                      <span className="text-xl font-semibold text-blue-600">
                        {student.fullName.charAt(0)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-800">{student.fullName}</h3>
                    <p className="text-gray-600">Roll No: {student.rollNo}</p>
                    <p className="text-gray-600">{student.emailAddress}</p>
                  </div>
                </div>
                
                <div className="mt-4">
                  <div className="flex justify-between items-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      student.feeDetails.status === 'paid' 
                        ? 'bg-green-100 text-green-800' 
                        : student.feeDetails.status === 'partial'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {student.feeDetails.status.toUpperCase()}
                    </span>
                    
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      student.isCourseCompleted
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {student.isCourseCompleted ? 'Completed' : 'Active'}
                    </span>
                  </div>
                  
                  <div className="mt-4 bg-gray-100 rounded-lg p-3">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Paid: ₹{student.feeDetails.paidFees}</span>
                      <span>Remaining: ₹{student.feeDetails.remainingFees}</span>
                    </div>
                    <div className="w-full bg-gray-300 rounded-full h-2 mt-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ 
                          width: `${student.feeDetails.totalFees > 0 ? (student.feeDetails.paidFees / student.feeDetails.totalFees) * 100 : 0}%` 
                        }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1 text-right">
                      Total: ₹{student.feeDetails.totalFees}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Pagination */}
      {totalPages > 1 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex justify-center items-center mt-8 gap-2"
        >
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={!hasPrevPage}
            className={`px-4 py-2 rounded-lg font-medium ${
              hasPrevPage 
                ? 'bg-blue-500 text-white hover:bg-blue-600' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            } transition-colors`}
          >
            Previous
          </button>
          
          <div className="flex gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              
              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`px-3 py-2 rounded-lg font-medium ${
                    currentPage === pageNum
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  } transition-colors`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>
          
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={!hasNextPage}
            className={`px-4 py-2 rounded-lg font-medium ${
              hasNextPage 
                ? 'bg-blue-500 text-white hover:bg-blue-600' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            } transition-colors`}
          >
            Next
          </button>
        </motion.div>
      )}

      {/* Empty State */}
      {filteredStudents.length === 0 && !loading && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="text-gray-400 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-700">No students found</h3>
          <p className="text-gray-500">Try adjusting your search or filters</p>
        </motion.div>
      )}

      {/* Student Detail Modal */}
      <AnimatePresence>
        {showModal && selectedStudent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-blur bg-opacity-40 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => {
              setShowModal(false);
              setEditMode(false);
              setPaymentInstallmentIndex(null);
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-screen overflow-y-auto relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Loading Overlay */}
              {modalLoading && (
                <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10 rounded-xl">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Processing...</p>
                  </div>
                </div>
              )}
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex items-start">
                    <div className="relative">
                      {selectedStudent.photo && typeof selectedStudent.photo === 'object' && selectedStudent.photo.url ? (
                        <img 
                          src={selectedStudent.photo.url} 
                          alt={selectedStudent.fullName}
                          className="h-20 w-20 rounded-full object-cover"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                      ) : selectedStudent.photo && typeof selectedStudent.photo === 'string' ? (
                        <img 
                          src={selectedStudent.photo} 
                          alt={selectedStudent.fullName}
                          className="h-20 w-20 rounded-full object-cover"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      <div className={`h-20 w-20 rounded-full bg-blue-100 flex items-center justify-center ${(selectedStudent.photo && ((typeof selectedStudent.photo === 'object' && selectedStudent.photo.url) || (typeof selectedStudent.photo === 'string' && selectedStudent.photo.trim() !== ''))) ? 'hidden' : 'flex'}`}>
                        <span className="text-2xl font-semibold text-blue-600">
                          {selectedStudent.fullName.charAt(0)}
                        </span>
                      </div>
                      
                      <label htmlFor="photo-upload" className="absolute bottom-0 right-0 bg-blue-500 text-white p-1 rounded-full cursor-pointer">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <input
                          id="photo-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.files[0]) {
                              handlePhotoUpload(selectedStudent._id, e.target.files[0]);
                            }
                          }}
                        />
                      </label>
                    </div>
                    
                    <div className="ml-4">
                      <h2 className="text-2xl font-bold text-gray-800">{selectedStudent.fullName}</h2>
                      <p className="text-gray-600">Roll No: {selectedStudent.rollNo}</p>
                      <p className="text-gray-600">{selectedStudent.phoneNumber}</p>
                      <p className="text-gray-600">{selectedStudent.emailAddress}</p>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => {
                      setShowModal(false);
                      setEditMode(false);
                      setPaymentInstallmentIndex(null);
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-lg font-semibold text-gray-800">Fee Details</h3>
                      <button
                        onClick={() => setEditMode(!editMode)}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        {editMode ? 'Cancel' : 'Edit'}
                      </button>
                    </div>
                    
                    {editMode ? (
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Total Fees</label>
                          <input
                            type="number"
                            className="w-full p-2 border border-gray-300 rounded"
                            value={feeEditData.totalFees}
                            onChange={(e) => setFeeEditData({
                              ...feeEditData,
                              totalFees: parseFloat(e.target.value),
                              remainingFees: parseFloat(e.target.value) - (feeEditData.totalFees - feeEditData.remainingFees)
                            })}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Remaining Fees</label>
                          <input
                            type="number"
                            className="w-full p-2 border border-gray-300 rounded"
                            value={feeEditData.remainingFees}
                            onChange={(e) => setFeeEditData({
                              ...feeEditData,
                              remainingFees: parseFloat(e.target.value)
                            })}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Number of Installments</label>
                          <input
                            type="number"
                            className="w-full p-2 border border-gray-300 rounded"
                            value={feeEditData.installments}
                            onChange={(e) => setFeeEditData({
                              ...feeEditData,
                              installments: parseInt(e.target.value)
                            })}
                          />
                        </div>
                        <button
                          onClick={() => {
                            setConfirmAction(() => () => handleFeeUpdate(selectedStudent._id));
                            setShowConfirmDialog(true);
                          }}
                          className="w-full mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                          disabled={!feeEditData.totalFees || feeEditData.totalFees < 0 || feeEditData.remainingFees < 0 || feeEditData.remainingFees > feeEditData.totalFees || modalLoading}
                        >
                          Save Changes
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total Fees:</span>
                          <span className="font-medium">₹{selectedStudent.feeDetails.totalFees}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Paid Fees:</span>
                          <span className="font-medium text-green-600">₹{selectedStudent.feeDetails.paidFees}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Remaining Fees:</span>
                          <span className="font-medium text-red-600">₹{selectedStudent.feeDetails.remainingFees}</span>
                        </div>
                        
                        <div className="pt-3">
                          <div className="w-full bg-gray-300 rounded-full h-3">
                            <div 
                              className="bg-blue-600 h-3 rounded-full" 
                              style={{ 
                                width: `${selectedStudent.feeDetails.totalFees > 0 ? (selectedStudent.feeDetails.paidFees / selectedStudent.feeDetails.totalFees) * 100 : 0}%` 
                              }}
                            ></div>
                          </div>
                        </div>
                        
                        {!selectedStudent.feeDetails.totalFees && (
                          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <p className="text-sm text-yellow-700 mb-2">
                              <strong>No fees set:</strong> This student doesn't have any fees configured yet.
                            </p>
                            <button
                              onClick={() => {
                                setFeeEditData({
                                  totalFees: 0,
                                  remainingFees: 0,
                                  installments: 0
                                });
                                setEditMode(true);
                              }}
                              className="w-full px-3 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 text-sm font-medium"
                            >
                              Set Up Fees
                            </button>
                          </div>
                        )}
                        
                        {(selectedStudent.feeDetails.remainingFees || 0) > 0 && paymentInstallmentIndex === null && (
                          <div className="mt-4">
                            <div className="flex gap-2">
                              <input
                                type="number"
                                placeholder="Amount"
                                className="flex-1 p-2 border border-gray-300 rounded"
                                value={paymentAmount}
                                onChange={(e) => setPaymentAmount(e.target.value)}
                                min="1"
                                max={selectedStudent.feeDetails.remainingFees}
                              />
                              <button
                                onClick={() => handleFeePayment(selectedStudent._id, paymentAmount)}
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                                disabled={modalLoading || !paymentAmount || paymentAmount <= 0 || paymentAmount > selectedStudent.feeDetails.remainingFees}
                              >
                                {modalLoading ? 'Processing...' : 'Pay'}
                              </button>
                            </div>
                            <button
                              onClick={() => handleFeePayment(selectedStudent._id, selectedStudent.feeDetails.remainingFees)}
                              className="w-full mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                              disabled={modalLoading}
                            >
                              {modalLoading ? 'Processing...' : 'Pay Full Amount'}
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Course Status</h3>
                    
                    <div className="flex items-center">
                      <div className={`h-3 w-3 rounded-full mr-2 ${
                        selectedStudent.isCourseCompleted ? 'bg-purple-500' : 'bg-green-500'
                      }`}></div>
                      <span>{selectedStudent.isCourseCompleted ? 'Course Completed' : 'Course Active'}</span>
                    </div>
                    
                    {selectedStudent.farewellDate && (
                      <div className="mt-3">
                        <p className="text-gray-600">Farewell Date:</p>
                        <p className="font-medium">
                          {formatDate(selectedStudent.farewellDate)}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                
                {selectedStudent.feeDetails.installmentDetails && selectedStudent.feeDetails.installmentDetails.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Installments</h3>
                    
                    <div className="space-y-3">
                      {selectedStudent.feeDetails.installmentDetails.map((installment, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-3">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-medium">Installment {index + 1}</p>
                              <p className="text-sm text-gray-600">
                                Due: {formatDate(installment.submissionDate)}
                              </p>
                              <p className="text-sm text-gray-600">
                                Amount: ₹{installment.amount}
                                {installment.originalAmount && installment.originalAmount !== installment.amount && (
                                  <span className="text-xs text-blue-600 ml-1">
                                    (original: ₹{installment.originalAmount})
                                  </span>
                                )}
                              </p>
                              {installment.payments && installment.payments.length > 0 && (
                                <p className="text-sm text-green-600">
                                  Paid: ₹{installment.payments.reduce((sum, payment) => sum + payment.amount, 0)}
                                </p>
                              )}
                            </div>
                            
                            <div className="text-right">
                              <p className="font-medium">₹{installment.amount - (installment.payments ? installment.payments.reduce((sum, payment) => sum + payment.amount, 0) : 0)} due</p>
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                installment.paid 
                                  ? 'bg-green-100 text-green-800' 
                                  : new Date(installment.submissionDate) < new Date()
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {installment.paid ? 'Paid' : new Date(installment.submissionDate) < new Date() ? 'Overdue' : 'Pending'}
                              </span>
                            </div>
                          </div>
                          
                          {!installment.paid && (
                            <div className="mt-3 space-y-2">
                              <div className="flex gap-2">
                                <input
                                  type="number"
                                  placeholder="Custom amount"
                                  className="flex-1 p-2 border border-gray-300 rounded"
                                  value={installmentPaymentAmounts[index] ?? ''}
                                  onChange={(e) => {
                                    const value = e.target.value;
                                    setInstallmentPaymentAmounts(prev => ({ ...prev, [index]: value }));
                                  }}
                                  min="1"
                                  max={installment.amount - (installment.payments ? installment.payments.reduce((sum, payment) => sum + payment.amount, 0) : 0)}
                                />
                                <button
                                  onClick={() => handleFeePayment(
                                    selectedStudent._id,
                                    installmentPaymentAmounts[index],
                                    index
                                  )}
                                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                                  disabled={
                                    modalLoading ||
                                    !installmentPaymentAmounts[index] ||
                                    installmentPaymentAmounts[index] <= 0 ||
                                    installmentPaymentAmounts[index] > (installment.amount - (installment.payments ? installment.payments.reduce((sum, payment) => sum + payment.amount, 0) : 0))
                                  }
                                >
                                  {modalLoading ? 'Processing...' : 'Pay Custom'}
                                </button>
                              </div>
                              <button
                                onClick={() => {
                                  const due = installment.amount - (installment.payments ? installment.payments.reduce((sum, payment) => sum + payment.amount, 0) : 0);
                                  handleFeePayment(selectedStudent._id, due, index);
                                }}
                                className="w-full px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                                disabled={modalLoading}
                              >
                                {modalLoading ? 'Processing...' : 'Pay Full Installment'}
                              </button>
                            </div>
                          )}
                          
                          {installment.payments && installment.payments.length > 0 && (
                            <div className="mt-3 pt-3 border-t border-gray-200">
                              <p className="text-sm font-medium text-gray-700">Payment History:</p>
                              {installment.payments.map((payment, paymentIndex) => (
                                <div key={paymentIndex} className="flex justify-between text-xs text-gray-600 mt-1">
                                  <span>₹{payment.amount} on {formatDate(payment.date)}</span>
                                  <span>{payment.method}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirmation Dialog */}
      <AnimatePresence>
        {showConfirmDialog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-blur bg-opacity-40 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setShowConfirmDialog(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Confirm Action</h3>
              <p className="text-gray-600 mb-6">Are you sure you want to update the fee structure? This action cannot be undone.</p>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirmDialog(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (confirmAction) {
                      confirmAction();
                      setShowConfirmDialog(false);
                    }
                  }}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Confirm
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StudentManagementDashboard;
