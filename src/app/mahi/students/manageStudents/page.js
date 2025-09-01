'use client'
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiSearch, 
  FiChevronLeft, 
  FiChevronRight, 
  FiUser, 
  FiPhone, 
  FiBook, 
  FiCalendar, 
  FiLoader,
  FiPlus,
  FiRefreshCw,
  FiChevronsLeft,
  FiChevronsRight,
  FiClock,
  FiHome,
  FiBarChart2,
  FiSettings,
  FiEdit,
  FiTrash2,
  FiEye,
  FiX,
  FiCheck,
  FiAward,
  FiCheckCircle,
  FiUsers
} from 'react-icons/fi';
import { useDebounce } from 'use-debounce';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const StudentManagement = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [courseFilter, setCourseFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [certifiedOnly, setCertifiedOnly] = useState(false);
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalStudents: 0,
    limit: 20,
  });
  const [sortConfig, setSortConfig] = useState({
    field: 'rollNo',
    direction: 'asc'
  });
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    student: null,
    loading: false
  });
  const [stats, setStats] = useState(null);
  const [showStats, setShowStats] = useState(false);
  const [notification, setNotification] = useState({
    isOpen: false,
    type: '',
    message: ''
  });
  const router = useRouter();

  // Fetch students with pagination, search, and sorting
  const fetchStudents = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.currentPage,
        limit: pagination.limit,
        ...(debouncedSearchTerm && { search: debouncedSearchTerm }),
        ...(courseFilter && { course: courseFilter }),
        ...(statusFilter && { status: statusFilter }),
        ...(certifiedOnly && { certifiedOnly: 'true' }),
        sort: sortConfig.field,
        order: sortConfig.direction
      });

      const response = await fetch(`/api/admin/student/manageStudents?${params}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch students');
      }
      
      const data = await response.json();
      
      if (data.success) {
        setStudents(data.data);
        setPagination(prev => ({
          ...prev,
          totalPages: data.pagination.totalPages,
          totalStudents: data.pagination.totalStudents,
        }));
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch statistics
  const fetchStats = async () => {
    try {
      setStatsLoading(true);
      const response = await fetch('/api/admin/student/manageStudents/stats');
      
      if (!response.ok) {
        throw new Error('Failed to fetch statistics');
      }
      
      const data = await response.json();
      
      if (data.success) {
        setStats(data.data);
      }
    } catch (err) {
      console.error('Error fetching stats:', err);
    } finally {
      setStatsLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [pagination.currentPage, debouncedSearchTerm, courseFilter, statusFilter, certifiedOnly, sortConfig]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  }, [debouncedSearchTerm, courseFilter, statusFilter, certifiedOnly, sortConfig]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination(prev => ({ ...prev, currentPage: newPage }));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSort = (field) => {
    let direction = 'asc';
    if (sortConfig.field === field && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ field, direction });
  };

  const refreshData = () => {
    fetchStudents();
  };

  const handleSearch = (e) => {
    e.preventDefault();
    refreshData();
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setCourseFilter('');
    setStatusFilter('');
    setCertifiedOnly(false);
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const toggleStats = () => {
    if (!showStats) {
      fetchStats();
    }
    setShowStats(!showStats);
  };

  const openDeleteModal = (student) => {
    setDeleteModal({
      isOpen: true,
      student,
      loading: false
    });
  };

  const closeDeleteModal = () => {
    setDeleteModal({
      isOpen: false,
      student: null,
      loading: false
    });
  };

  const handleDelete = async () => {
    if (!deleteModal.student) return;
    
    try {
      setDeleteModal(prev => ({ ...prev, loading: true }));
      
      const response = await fetch(`/api/admin/student/manageStudents?id=${deleteModal.student._id}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (data.success) {
        setDeleteModal(prev => ({ ...prev, loading: false }));
        closeDeleteModal();
        refreshData();
        
        setNotification({
          isOpen: true,
          type: 'success',
          message: 'Student deleted successfully'
        });
        
        setTimeout(() => {
          setNotification(prev => ({ ...prev, isOpen: false }));
        }, 3000);
      } else {
        setDeleteModal(prev => ({ ...prev, loading: false }));
        setNotification({
          isOpen: true,
          type: 'error',
          message: 'Failed to delete student: ' + data.message
        });
      }
    } catch (error) {
      console.error('Error deleting student:', error);
      setDeleteModal(prev => ({ ...prev, loading: false }));
      setNotification({
        isOpen: true,
        type: 'error',
        message: 'Error deleting student'
      });
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.3,
      },
    },
  };

  const sortIcon = (field) => {
    if (sortConfig.field !== field) return null;
    return sortConfig.direction === 'asc' ? '↑' : '↓';
  };

  // Handle photo display
  const renderStudentPhoto = (student) => {
    if (student.photo?.url) {
      return (
        <Image
          src={student.photo.url}
          alt={student.fullName}
          width={64}
          height={64}
          className="w-full h-full object-cover"
          unoptimized={true}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/default-user.png';
          }}
        />
      );
    }
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-200 rounded-full">
        <FiUser className="text-gray-500 text-2xl" />
      </div>
    );
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-gray-50">
        <div className="text-center p-6 bg-red-50 rounded-lg max-w-md mx-auto border-l-4 border-red-500">
          <h2 className="text-xl font-semibold text-red-600 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition shadow-md"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-50 py-8 px-4 sm:px-6 lg:px-8 relative">
      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteModal.isOpen && (
          <div className="fixed inset-0 bg-blur bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-xl p-6 w-full max-w-md"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-900">Confirm Deletion</h3>
                <button
                  onClick={closeDeleteModal}
                  className="text-gray-500 hover:text-gray-700"
                  disabled={deleteModal.loading}
                >
                  <FiX size={24} />
                </button>
              </div>
              
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete <span className="font-semibold">{deleteModal.student?.fullName}</span> (Roll No: {deleteModal.student?.rollNo})? This action cannot be undone.
              </p>
              
              <div className="flex justify-end gap-3">
                <button
                  onClick={closeDeleteModal}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                  disabled={deleteModal.loading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center gap-2"
                  disabled={deleteModal.loading}
                >
                  {deleteModal.loading ? (
                    <>
                      <FiLoader className="animate-spin" /> Deleting...
                    </>
                  ) : (
                    <>
                      <FiTrash2 /> Delete
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Notification */}
      <AnimatePresence>
        {notification.isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
              notification.type === 'success' 
                ? 'bg-green-100 text-green-800 border-l-4 border-green-500' 
                : 'bg-red-100 text-red-800 border-l-4 border-red-500'
            }`}
          >
            <div className="flex items-center">
              {notification.type === 'success' ? (
                <FiCheck className="mr-2" />
              ) : (
                <FiX className="mr-2" />
              )}
              <span>{notification.message}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
        >
          <div>
            <div className="flex items-center mb-2">
              <motion.div 
                whileHover={{ rotate: 10 }}
                className="bg-blue-600 p-2 rounded-lg mr-3"
              >
                <FiUser className="text-white text-xl" />
              </motion.div>
              <h1 className="text-3xl font-bold text-blue-600">Student Management</h1>
            </div>
            <p className="text-gray-600 ml-12">
              {pagination.totalStudents} students found
            </p>
          </div>
          
          <div className="flex gap-3">
      
            <Link 
              href="/mahi" 
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition flex items-center gap-2 shadow-md"
            >
              <FiHome /> Dashboard
            </Link>
          </div>
        </motion.div>


        {/* Search and Filters */}
        <motion.div
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mb-8 bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500"
        >
          <form onSubmit={handleSearch} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search by name, roll no, email, or phone..."
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  autoFocus
                />
              </div>
              
              <select
                value={courseFilter}
                onChange={(e) => setCourseFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              >
                <option value="">All Courses</option>
                <option value="HTML, CSS, JS">HTML, CSS, JS</option>
                <option value="ChatGPT and AI tools">ChatGPT and AI tools</option>
                <option value="Industrial Training">Industrial Training</option>
                <option value="React">React</option>
                <option value="MERN FullStack">MERN FullStack</option>
                <option value="CorelDRAW">CorelDRAW</option>
                <option value="Tally">Tally</option>
                <option value="Premier Pro">Premier Pro</option>
                <option value="WordPress">WordPress</option>
                <option value="Computer Course">Computer Course</option>
                <option value="MS Office">MS Office</option>
                <option value="PTE">PTE</option>
                <option value="AutoCAD">AutoCAD</option>
              </select>
              
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              >
                <option value="">All Statuses</option>
                <option value="active">Active Students</option>
                <option value="completed">Completed Courses</option>
                <option value="certified">Certified Students</option>
              </select>
              
             
            </div>
            
            <div className="flex flex-wrap gap-2">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-md"
              >
                Search
              </button>
              
              <button
                type="button"
                onClick={handleClearFilters}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition shadow-sm"
              >
                Clear Filters
              </button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={refreshData}
                disabled={loading}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 ${loading ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300 shadow-sm'}`}
              >
                <FiRefreshCw className={loading ? "animate-spin" : ""} /> Refresh
              </motion.button>
            </div>
          </form>
        </motion.div>

        {/* Pagination Controls */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-4 flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl shadow-sm"
        >
          <div className="text-sm text-gray-600">
            Showing {(pagination.currentPage - 1) * pagination.limit + 1} to{' '}
            {Math.min(pagination.currentPage * pagination.limit, pagination.totalStudents)} of{' '}
            {pagination.totalStudents} students
          </div>
          
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handlePageChange(1)}
              disabled={pagination.currentPage === 1 || loading}
              className={`p-2 rounded-lg ${pagination.currentPage === 1 || loading ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300 shadow-sm'}`}
            >
              <FiChevronsLeft size={20} />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handlePageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage === 1 || loading}
              className={`p-2 rounded-lg ${pagination.currentPage === 1 || loading ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300 shadow-sm'}`}
            >
              <FiChevronLeft size={20} />
            </motion.button>
            
            <span className="text-gray-700 px-2 font-medium">
              Page {pagination.currentPage} of {pagination.totalPages}
            </span>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handlePageChange(pagination.currentPage + 1)}
              disabled={pagination.currentPage === pagination.totalPages || loading}
              className={`p-2 rounded-lg ${pagination.currentPage === pagination.totalPages || loading ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300 shadow-sm'}`}
            >
              <FiChevronRight size={20} />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handlePageChange(pagination.totalPages)}
              disabled={pagination.currentPage === pagination.totalPages || loading}
              className={`p-2 rounded-lg ${pagination.currentPage === pagination.totalPages || loading ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300 shadow-sm'}`}
            >
              <FiChevronsRight size={20} />
            </motion.button>
          </div>
        </motion.div>

        {/* Sort Controls */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-4 flex flex-wrap gap-2 bg-white p-4 rounded-xl shadow-sm"
        >
          <span className="text-gray-700 font-medium mr-2">Sort by:</span>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleSort('fullName')}
            className="px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-1 shadow-sm"
          >
            Name {sortIcon('fullName')}
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleSort('rollNo')}
            className="px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-1 shadow-sm"
          >
            Roll No {sortIcon('rollNo')}
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleSort('joiningDate')}
            className="px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-1 shadow-sm"
          >
            Joining Date {sortIcon('joiningDate')}
          </motion.button>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                <div className="animate-pulse">
                  <div className="flex items-center mb-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-full mr-4"></div>
                    <div>
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="h-3 bg-gray-200 rounded w-full"></div>
                    <div className="h-3 bg-gray-200 rounded w-full"></div>
                    <div className="h-3 bg-gray-200 rounded w-full"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Student List */}
        {!loading && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            <AnimatePresence>
              {students.length > 0 ? (
                students.map((student) => {
                  const currentDate = new Date();
                  const farewellDate = new Date(student.farewellDate);
                  const isActive = farewellDate > currentDate;
                  const isCompleted = farewellDate <= currentDate;
                  const isCertified = isCompleted && student.certificate;
                  
                  return (
                    <motion.div
                      key={student._id}
                      variants={itemVariants}
                      whileHover={{ 
                        y: -5, 
                        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                        borderColor: '#3b82f6'
                      }}
                      className="bg-white rounded-xl overflow-hidden border border-gray-200 transition-all duration-200 shadow-sm"
                    >
                      <div className="p-5">
                        <div className="flex items-center mb-4">
                          <div className="w-25 h-25 rounded-3xl overflow-hidden mr-4 border-2 border-gray-200">
                            {renderStudentPhoto(student)}
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg text-gray-900 line-clamp-1">
                              {student.fullName}
                            </h3>
                            <p className="text-gray-500 text-sm">Roll: {student.rollNo}</p>
                          </div>
                        </div>
                        
                        {/* Status and Certificate Badges - Placed below image and name */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          {isActive ? (
                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full flex items-center">
                              <FiCheckCircle className="mr-1" /> Active
                            </span>
                          ) : isCompleted ? (
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full flex items-center">
                              <FiCalendar className="mr-1" /> Completed
                            </span>
                          ) : null}
                          
                          {isCompleted && (
                            isCertified ? (
                              <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full flex items-center">
                                <FiAward className="mr-1" /> Certified
                              </span>
                            ) : (
                              <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full flex items-center">
                                <FiX className="mr-1" /> Certificate not issued
                              </span>
                            )
                          )}
                        </div>
                        
                        <div className="space-y-3">
                          <div className="flex items-center text-gray-600">
                            <FiPhone className="mr-2 text-blue-500 flex-shrink-0" />
                            <span className="text-sm truncate">{student.phoneNumber}</span>
                          </div>
                          
                          {student.parentsPhoneNumber && (
                            <div className="flex items-center text-gray-600">
                              <FiPhone className="mr-2 text-blue-500 flex-shrink-0" />
                              <span className="text-sm truncate">Parent: {student.parentsPhoneNumber}</span>
                            </div>
                          )}
                          
                          <div className="flex items-center text-gray-600">
                            <FiBook className="mr-2 text-blue-500 flex-shrink-0" />
                            <span className="text-sm truncate">{student.selectedCourse}</span>
                          </div>

                          {student.courseDuration && (
                            <div className="flex items-center text-gray-600">
                              <FiClock className="mr-2 text-green-500 flex-shrink-0" />
                              <span className="text-sm truncate">{student.courseDuration}</span>
                            </div>
                          )}
                          
                          <div className="flex items-center text-gray-600">
                            <FiCalendar className="mr-2 text-blue-500 flex-shrink-0" />
                            <span className="text-sm">
                              {formatDate(student.joiningDate)} -{' '}
                              {student.farewellDate ? formatDate(student.farewellDate) : 'Present'}
                            </span>
                          </div>
                        </div>  
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="border-t border-gray-200 p-4 flex justify-between">
                        <Link 
                          href={`/mahi/students/manageStudents/${student._id}`}
                          className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2 text-sm"
                        >
                          <FiEye size={16} /> View
                        </Link>
                        
                        <Link 
                          href={`/mahi/students/manageStudents/${student._id}`}
                          className="px-3 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition flex items-center gap-2 text-sm"
                        >
                          <FiEdit size={16} /> Edit
                        </Link>
                        
                        <button 
                          onClick={() => openDeleteModal(student)}
                          className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center gap-2 text-sm"
                        >
                          <FiTrash2 size={16} /> Delete
                        </button>
                      </div>
                    </motion.div>
                  );
                })
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="col-span-full py-12 text-center bg-white rounded-xl shadow-sm p-8"
                >
                  <div className="text-gray-500 text-lg">
                    No students found{debouncedSearchTerm || courseFilter || statusFilter ? ' matching your search criteria' : ''}
                  </div>
                  <button 
                    onClick={handleClearFilters}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-md"
                  >
                    Clear Filters
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Pagination */}
        {!loading && students.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl shadow-sm"
          >
            <div className="text-sm text-gray-600">
              Showing {(pagination.currentPage - 1) * pagination.limit + 1} to{' '}
              {Math.min(pagination.currentPage * pagination.limit, pagination.totalStudents)} of{' '}
              {pagination.totalStudents} students
            </div>
            
            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handlePageChange(1)}
                disabled={pagination.currentPage === 1}
                className={`px-3 py-2 rounded-lg ${pagination.currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300 shadow-sm'}`}
              >
                First
              </motion.button>
              
              {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                let pageNum;
                if (pagination.totalPages <= 5) {
                  pageNum = i + 1;
                } else if (pagination.currentPage <= 3) {
                  pageNum = i + 1;
                } else if (pagination.currentPage >= pagination.totalPages - 2) {
                  pageNum = pagination.totalPages - 4 + i;
                } else {
                  pageNum = pagination.currentPage - 2 + i;
                }
                
                return (
                  <motion.button
                    key={pageNum}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handlePageChange(pageNum)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${pagination.currentPage === pageNum ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300 shadow-sm'}`}
                  >
                    {pageNum}
                  </motion.button>
                );
              })}
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handlePageChange(pagination.totalPages)}
                disabled={pagination.currentPage === pagination.totalPages}
                className={`px-3 py-2 rounded-lg ${pagination.currentPage === pagination.totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300 shadow-sm'}`}
              >
                Last
              </motion.button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default StudentManagement;