'use client'
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { format, parseISO } from 'date-fns';
import Head from 'next/head';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiSearch, 
  FiUserPlus, 
  FiEdit, 
  FiTrash2, 
  FiEye, 
  FiLoader, 
  FiAlertCircle, 
  FiChevronLeft, 
  FiChevronRight, 
  FiX, 
  FiCheck,
  FiRefreshCw,
  FiArrowUp,
  FiUser,
  FiAward,
  FiCalendar,
  FiChevronsLeft,
  FiChevronsRight
} from 'react-icons/fi';
import { useDebounce } from 'use-debounce';

const StaffManagement = () => {
  const [staffList, setStaffList] = useState([]);
  const [filteredStaff, setFilteredStaff] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [successMessage, setSuccessMessage] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, staffId: null, staffName: '' });
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalStaff: 0,
    limit: 10,
  });
  
  const router = useRouter();
  const formRef = useRef(null);

  // Handle scroll events for scroll-to-top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch all staff
  useEffect(() => {
    const fetchStaff = async () => {
      try {
        setIsLoading(true);
        const res = await fetch('/api/admin/staff/editStaff');
        if (!res.ok) throw new Error('Failed to fetch staff');
        const data = await res.json();
        setStaffList(data);
        setFilteredStaff(data);
        setPagination(prev => ({
          ...prev,
          totalPages: Math.ceil(data.length / itemsPerPage),
          totalStaff: data.length,
        }));
        setIsLoading(false);
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
      }
    };
    fetchStaff();
  }, []);

  // Filter staff by name or ID
  useEffect(() => {
    const filtered = staffList.filter(staff =>
      staff.Name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      staff.StaffID.toString().includes(debouncedSearchTerm)
    );
    setFilteredStaff(filtered);
    setPagination(prev => ({
      ...prev,
      totalPages: Math.ceil(filtered.length / itemsPerPage),
      totalStaff: filtered.length,
      currentPage: 1,
    }));
    setCurrentPage(1); // Reset to first page when searching
  }, [debouncedSearchTerm, staffList, itemsPerPage]);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredStaff.slice(indexOfFirstItem, indexOfLastItem);

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return format(parseISO(dateString), 'MMM dd, yyyy');
    } catch {
      return 'Invalid date';
    }
  };

  // Handle delete with confirmation and animation
  const handleDelete = async (staffId) => {
    try {
      const res = await fetch(`/api/admin/staff/editStaff/${staffId}`, { 
        method: 'DELETE' 
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to delete staff');
      }
      
      // Optimistic UI update with animation
      setStaffList(prev => prev.filter(staff => staff.StaffID !== staffId));
      setFilteredStaff(prev => prev.filter(staff => staff.StaffID !== staffId));
      
      // Update pagination
      setPagination(prev => ({
        ...prev,
        totalStaff: prev.totalStaff - 1,
        totalPages: Math.ceil((prev.totalStaff - 1) / itemsPerPage),
      }));
      
      // Show success feedback
      setError(null);
      setSuccessMessage('Staff member deleted successfully!');
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (err) {
      setError(err.message);
      console.error('Delete error:', err);
    }
  };

  // Show delete confirmation
  const showDeleteConfirm = (staffId, staffName) => {
    setDeleteConfirm({ show: true, staffId, staffName });
  };

  // Hide delete confirmation
  const hideDeleteConfirm = () => {
    setDeleteConfirm({ show: false, staffId: null, staffName: '' });
  };

  // Confirm delete
  const confirmDelete = () => {
    if (deleteConfirm.staffId) {
      handleDelete(deleteConfirm.staffId);
      hideDeleteConfirm();
    }
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

  // Loading state
  if (isLoading) return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-gray-50">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center"
      >
        <FiLoader className="w-12 h-12 text-blue-500 animate-spin mb-4" />
        <p className="text-lg text-gray-600">Loading staff data...</p>
      </motion.div>
    </div>
  );

  // Error state
  if (error) return (
    <div className="flex items-center justify-center min-h-screen px-4 bg-gradient-to-br from-blue-50 to-gray-50">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 max-w-md w-full rounded-lg"
      >
        <div className="flex items-center">
          <FiAlertCircle className="w-6 h-6 mr-2" />
          <p className="font-bold">Error</p>
        </div>
        <p className="mt-2">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
        >
          Try Again
        </button>
      </motion.div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <Head>
        <title>Staff Management</title>
        <meta name="description" content="Manage your organization's staff members" />
      </Head>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4"
        >
          <div>
            <div className="flex items-center mb-2">
              <motion.div 
                whileHover={{ rotate: 10 }}
                className="bg-blue-600 p-2 rounded-lg mr-3"
              >
                <FiUser className="text-white text-xl" />
              </motion.div>
              <h1 className="text-3xl font-bold text-blue-600">Staff Management</h1>
            </div>
            <p className="text-gray-600 ml-12">
              {pagination.totalStaff} staff members found
            </p>
          </div>
          <Link href="/mahi/staff/addstaff" passHref>
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all"
            >
              <FiUserPlus size={18} />
              Add New Staff
            </motion.a>
          </Link>
        </motion.header>

        {/* Success Message */}
        <AnimatePresence>
          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-lg flex items-start gap-3"
            >
              <div className="w-5 h-5 mr-2">✅</div>
              <p className="font-medium">{successMessage}</p>
              <button 
                onClick={() => setSuccessMessage('')} 
                className="ml-auto text-green-500 hover:text-green-700"
              >
                <FiX />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-start gap-3"
            >
              <FiAlertCircle className="mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Error:</p>
                <p>{error}</p>
              </div>
              <button 
                onClick={() => setError(null)} 
                className="ml-auto text-red-500 hover:text-red-700"
              >
                <FiX />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Search and Stats */}
        <motion.div
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mb-8 bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500"
        >
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <FiUser className="text-blue-500" /> Search Staff Members
          </h2>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by name or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 p-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
            </div>
            
            <motion.button
              onClick={() => {
                setSearchTerm("");
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition flex items-center gap-2 shadow-sm"
            >
              <FiRefreshCw /> Reset
            </motion.button>
          </div>
        </motion.div>

        {/* Staff List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow overflow-hidden border border-gray-200 transition-colors duration-300"
        >
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Staff ID
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Designation
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Join Date
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Leaving Date
                  </th>
                  <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <AnimatePresence>
                  {currentItems.length > 0 ? (
                    currentItems.map((staff) => (
                      <motion.tr
                        key={staff.StaffID}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                        className="hover:bg-gray-50 transition-colors"
                        layout
                      >
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {staff.StaffID}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                          {staff.Name}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                          {staff.Designation || 'N/A'}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(staff.JoinningData)}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                          {staff.LeavingDate ? formatDate(staff.LeavingDate) : 'Currently working'}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium space-x-1 md:space-x-2">
                          <Link href={`/mahi/staff/editStaff/${staff.StaffID}`} passHref>
                            <motion.a
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="inline-flex items-center px-2 py-1 md:px-3 md:py-1 border border-yellow-500 rounded-md text-yellow-700 bg-yellow-50 hover:bg-yellow-100 transition text-xs md:text-sm"
                            >
                              <FiEdit className="mr-1" size={14} />
                              <span className="hidden sm:inline">Edit</span>
                            </motion.a>
                          </Link>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => showDeleteConfirm(staff.StaffID, staff.Name)}
                            className="inline-flex items-center px-2 py-1 md:px-3 md:py-1 border border-red-500 rounded-md text-red-700 bg-red-50 hover:bg-red-100 transition text-xs md:text-sm"
                          >
                            <FiTrash2 className="mr-1" size={14} />
                            <span className="hidden sm:inline">Delete</span>
                          </motion.button>
                          <Link href={`/mahi/staff/editStaff/${staff.StaffID}`} passHref>
                            <motion.a
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="inline-flex items-center px-2 py-1 md:px-3 md:py-1 border border-blue-500 rounded-md text-blue-700 bg-blue-50 hover:bg-blue-100 transition text-xs md:text-sm"
                            >
                              <FiEye className="mr-1" size={14} />
                              <span className="hidden sm:inline">View</span>
                            </motion.a>
                          </Link>
                        </td>
                      </motion.tr>
                    ))
                  ) : (
                    <motion.tr
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <td colSpan="6" className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <FiSearch className="w-12 h-12 text-gray-400 mb-4" />
                          <h3 className="text-lg font-medium text-gray-900">No staff members found</h3>
                          <p className="text-gray-500 mt-1">
                            {searchTerm ? 'Try a different search term' : 'Add a new staff member to get started'}
                          </p>
                          {!searchTerm && (
                            <Link href="/mahi/staff/addstaff" passHref>
                              <motion.a
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 transition"
                              >
                                <FiUserPlus className="mr-2" />
                                Add Staff
                              </motion.a>
                            </Link>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <motion.div 
              className="flex items-center justify-between px-4 py-3 bg-gray-50 border-t border-gray-200 sm:px-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition"
                >
                  Previous
                </button>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === pagination.totalPages}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{' '}
                    <span className="font-medium">{Math.min(indexOfLastItem, filteredStaff.length)}</span> of{' '}
                    <span className="font-medium">{filteredStaff.length}</span> results
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handlePageChange(1)}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition"
                    >
                      <FiChevronsLeft className="h-5 w-5" aria-hidden="true" />
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition"
                    >
                      <FiChevronLeft className="h-5 w-5" aria-hidden="true" />
                    </motion.button>
                    <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                      Page {currentPage} of {pagination.totalPages}
                    </span>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === pagination.totalPages}
                      className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition"
                    >
                      <FiChevronRight className="h-5 w-5" aria-hidden="true" />
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handlePageChange(pagination.totalPages)}
                      disabled={currentPage === pagination.totalPages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition"
                    >
                      <FiChevronsRight className="h-5 w-5" aria-hidden="true" />
                    </motion.button>
                  </nav>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirm.show && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={hideDeleteConfirm}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
                  <FiTrash2 className="w-5 h-5 text-red-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">Delete Staff Member</h3>
              </div>
              
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete <span className="font-semibold">{deleteConfirm.staffName}</span>? 
                This action cannot be undone.
              </p>
              
              <div className="flex justify-end space-x-3">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={hideDeleteConfirm}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                >
                  Delete
                </motion.button>
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
  );
};

export default StaffManagement;