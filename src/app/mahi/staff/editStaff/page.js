'use client'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { format, parseISO } from 'date-fns';
import Head from 'next/head';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiUserPlus, FiEdit, FiTrash2, FiEye, FiLoader, FiAlertCircle, FiChevronLeft, FiChevronRight, FiMoon, FiSun } from 'react-icons/fi';

const StaffManagement = () => {
  const [staffList, setStaffList] = useState([]);
  const [filteredStaff, setFilteredStaff] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [successMessage, setSuccessMessage] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, staffId: null, staffName: '' });
  const [darkMode, setDarkMode] = useState(false);
  const router = useRouter();

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  // Fetch all staff
  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const res = await fetch('/api/admin/staff/editStaff');
        if (!res.ok) throw new Error('Failed to fetch staff');
        const data = await res.json();
        setStaffList(data);
        setFilteredStaff(data);
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
      staff.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.StaffID.toString().includes(searchTerm)
    );
    setFilteredStaff(filtered);
    setCurrentPage(1); // Reset to first page when searching
  }, [searchTerm, staffList]);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredStaff.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredStaff.length / itemsPerPage);

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

  // Loading state
  if (isLoading) return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-[#030712]">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center"
      >
        <FiLoader className="w-12 h-12 text-blue-500 dark:text-blue-400 animate-spin mb-4" />
        <p className="text-lg text-gray-600 dark:text-gray-300">Loading staff data...</p>
      </motion.div>
    </div>
  );

  // Error state
  if (error) return (
    <div className="flex items-center justify-center min-h-screen px-4 bg-gray-50 dark:bg-[#030712]">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-red-100 dark:bg-red-900 border-l-4 border-red-500 dark:border-red-400 text-red-700 dark:text-red-100 p-4 max-w-md w-full"
      >
        <div className="flex items-center">
          <FiAlertCircle className="w-6 h-6 mr-2" />
          <p className="font-bold">Error</p>
        </div>
        <p className="mt-2">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-red-500 dark:bg-red-600 text-white rounded hover:bg-red-600 dark:hover:bg-red-700 transition"
        >
          Try Again
        </button>
      </motion.div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#030712] transition-colors duration-300 pt-10">
      <Head>
        <title>Staff Management</title>
        <meta name="description" content="Manage your organization's staff members" />
      </Head>

      <main className="container mx-auto px-4 py-8">
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4"
        >
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">Staff Management</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">Manage your organization's staff members</p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/mahi/staff/addstaff" passHref>
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center px-4 py-2 md:px-6 md:py-3 bg-blue-600 dark:bg-blue-700 text-white rounded-lg shadow hover:bg-blue-700 dark:hover:bg-blue-800 transition text-sm md:text-base"
              >
                <FiUserPlus className="mr-2" />
                Add New Staff
              </motion.a>
            </Link>
          </div>
        </motion.header>

        {/* Success Message */}
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-6 bg-green-100 dark:bg-green-900 border-l-4 border-green-500 dark:border-green-400 text-green-700 dark:text-green-100 p-4 rounded"
          >
            <div className="flex items-center">
              <div className="w-5 h-5 mr-2">✅</div>
              <p className="font-medium">{successMessage}</p>
            </div>
          </motion.div>
        )}

        {/* Search and Stats */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400 dark:text-gray-500" />
              </div>
              <input
                type="text"
                placeholder="Search by name or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 md:py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-gray-900 dark:text-white dark:placeholder-gray-400"
              />
            </div>
            <motion.div 
              className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
              whileHover={{ y: -2 }}
            >
              <p className="text-sm text-gray-600 dark:text-gray-300">Total Staff: <span className="font-bold text-blue-600 dark:text-blue-400">{staffList.length}</span></p>
              <p className="text-sm text-gray-600 dark:text-gray-300">Showing: <span className="font-bold text-blue-600 dark:text-blue-400">{filteredStaff.length}</span></p>
            </motion.div>
          </div>
        </motion.div>

        {/* Staff List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden border border-gray-200 dark:border-gray-700 transition-colors duration-300"
        >
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Staff ID
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Designation
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Join Date
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Leaving Date
                  </th>
                  <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                <AnimatePresence>
                  {currentItems.length > 0 ? (
                    currentItems.map((staff) => (
                      <motion.tr
                        key={staff.StaffID}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        layout
                      >
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          {staff.StaffID}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                          {staff.Name}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                          {staff.Designation || 'N/A'}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                          {formatDate(staff.JoinningData)}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                          {staff.LeavingDate ? formatDate(staff.LeavingDate) : 'Currently working'}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium space-x-1 md:space-x-2">
                          <Link href={`/mahi/staff/editStaff/${staff.StaffID}`} passHref>
                            <motion.a
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="inline-flex items-center px-2 py-1 md:px-3 md:py-1 border border-yellow-500 rounded-md text-yellow-700 dark:text-yellow-300 bg-yellow-50 dark:bg-yellow-900/30 hover:bg-yellow-100 dark:hover:bg-yellow-900/50 transition text-xs md:text-sm"
                            >
                              <FiEdit className="mr-1" size={14} />
                              <span className="hidden sm:inline">Edit</span>
                            </motion.a>
                          </Link>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => showDeleteConfirm(staff.StaffID, staff.Name)}
                            className="inline-flex items-center px-2 py-1 md:px-3 md:py-1 border border-red-500 rounded-md text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/50 transition text-xs md:text-sm"
                          >
                            <FiTrash2 className="mr-1" size={14} />
                            <span className="hidden sm:inline">Delete</span>
                          </motion.button>
                          <Link href={`/mahi/staff/editStaff/${staff.StaffID}`} passHref>
                            <motion.a
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="inline-flex items-center px-2 py-1 md:px-3 md:py-1 border border-blue-500 rounded-md text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition text-xs md:text-sm"
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
                          <FiSearch className="w-12 h-12 text-gray-400 dark:text-gray-500 mb-4" />
                          <h3 className="text-lg font-medium text-gray-900 dark:text-white">No staff members found</h3>
                          <p className="text-gray-500 dark:text-gray-400 mt-1">
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
          {totalPages > 1 && (
            <motion.div 
              className="flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600 sm:px-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{' '}
                    <span className="font-medium">{Math.min(indexOfLastItem, filteredStaff.length)}</span> of{' '}
                    <span className="font-medium">{filteredStaff.length}</span> results
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                    >
                      <span className="sr-only">Previous</span>
                      <FiChevronLeft className="h-5 w-5" aria-hidden="true" />
                    </motion.button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <motion.button
                        key={page}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setCurrentPage(page)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium transition ${
                          currentPage === page
                            ? 'z-10 bg-blue-50 dark:bg-blue-900 border-blue-500 dark:border-blue-400 text-blue-600 dark:text-blue-300'
                            : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                        }`}
                      >
                        {page}
                      </motion.button>
                    ))}
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                    >
                      <span className="sr-only">Next</span>
                      <FiChevronRight className="h-5 w-5" aria-hidden="true" />
                    </motion.button>
                  </nav>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </main>

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
              className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mr-3">
                  <FiTrash2 className="w-5 h-5 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Delete Staff Member</h3>
              </div>
              
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Are you sure you want to delete <span className="font-semibold">{deleteConfirm.staffName}</span>? 
                This action cannot be undone.
              </p>
              
              <div className="flex justify-end space-x-3">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={hideDeleteConfirm}
                  className="px-4 py-2 text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition"
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
    </div>
  );
};

export default StaffManagement;