"use client"
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const JobApplicationsDashboard = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [statusCounts, setStatusCounts] = useState({
    pending: 0,
    reviewed: 0,
    shortlisted: 0,
    rejected: 0,
    hired: 0
  });

  // Fetch applications from API
  const fetchApplications = async (page = 1, status = 'all', search = '') => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page,
        limit: 12,
        ...(status !== 'all' && { status }),
        ...(search && { search })
      });
      
      const response = await fetch(`/api/applications?${params}`);
      const data = await response.json();
      
      setApplications(data.applications);
      setCurrentPage(data.pagination.page);
      setTotalPages(data.pagination.totalPages);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch status counts for dashboard
  const fetchStatusCounts = async () => {
    try {
      const response = await fetch('/api/applications/status');
      const data = await response.json();
      setStatusCounts(data);
    } catch (error) {
      console.error('Error fetching status counts:', error);
    }
  };

  useEffect(() => {
    fetchApplications(currentPage, statusFilter, searchTerm);
    fetchStatusCounts();
  }, []);

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      fetchApplications(newPage, statusFilter, searchTerm);
    }
  };

  // Handle status filter change
  const handleStatusFilterChange = (status) => {
    setStatusFilter(status);
    setCurrentPage(1);
    fetchApplications(1, status, searchTerm);
  };

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchApplications(1, statusFilter, searchTerm);
  };

  // Handle delete application
  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this application?')) {
      try {
        const response = await fetch(`/api/applications?id=${id}`, {
          method: 'DELETE'
        });
        
        if (response.ok) {
          // Refresh the applications list
          fetchApplications(currentPage, statusFilter, searchTerm);
          fetchStatusCounts();
        }
      } catch (error) {
        console.error('Error deleting application:', error);
      }
    }
  };

  // Handle view details
  const handleViewDetails = async (id) => {
    try {
      const response = await fetch(`/api/applications/${id}`);
      const data = await response.json();
      setSelectedApplication(data.application);
      setShowModal(true);
    } catch (error) {
      console.error('Error fetching application details:', error);
    }
  };

  // Handle status update
  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const response = await fetch(`/api/applications/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (response.ok) {
        // Refresh the applications list and status counts
        fetchApplications(currentPage, statusFilter, searchTerm);
        fetchStatusCounts();
        
        // If modal is open, update the selected application
        if (showModal && selectedApplication && selectedApplication._id === id) {
          const updatedApp = { ...selectedApplication, status: newStatus };
          setSelectedApplication(updatedApp);
        }
      }
    } catch (error) {
      console.error('Error updating application status:', error);
    }
  };

  // Get status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'reviewed': return 'bg-blue-100 text-blue-800';
      case 'shortlisted': return 'bg-purple-100 text-purple-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'hired': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Status filter buttons
  const statusFilters = [
    { key: 'all', label: 'All Applications', count: Object.values(statusCounts).reduce((sum, count) => sum + count, 0) },
    { key: 'pending', label: 'Pending', count: statusCounts.pending },
    { key: 'reviewed', label: 'Reviewed', count: statusCounts.reviewed },
    { key: 'shortlisted', label: 'Shortlisted', count: statusCounts.shortlisted },
    { key: 'rejected', label: 'Rejected', count: statusCounts.rejected },
    { key: 'hired', label: 'Hired', count: statusCounts.hired }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-blue-400">Job Applications</h1>
          <p className="text-gray-500 mt-2">
            Manage and track all job applications in one place
          </p>
        </div>
        
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
          {statusFilters.map((status) => (
            <motion.div 
              key={status.key} 
              whileHover={{ y: -5 }}
              className={`bg-white p-5 rounded-xl shadow-sm border-l-4 cursor-pointer transition-all ${
                statusFilter === status.key 
                  ? 'border-indigo-500 ring-2 ring-indigo-100' 
                  : 'border-gray-200 hover:shadow-md'
              } ${
                status.key === 'all' ? 'border-indigo-500' :
                status.key === 'pending' ? 'border-yellow-500' :
                status.key === 'reviewed' ? 'border-blue-500' :
                status.key === 'shortlisted' ? 'border-purple-500' :
                status.key === 'rejected' ? 'border-red-500' :
                'border-green-500'
              }`}
              onClick={() => handleStatusFilterChange(status.key)}
            >
              <div className="flex items-center">
                <div className={`p-3 rounded-xl ${
                  status.key === 'all' ? 'bg-indigo-100 text-indigo-600' :
                  status.key === 'pending' ? 'bg-yellow-100 text-yellow-600' :
                  status.key === 'reviewed' ? 'bg-blue-100 text-blue-600' :
                  status.key === 'shortlisted' ? 'bg-purple-100 text-purple-600' :
                  status.key === 'rejected' ? 'bg-red-100 text-red-600' :
                  'bg-green-100 text-green-600'
                }`}>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    {status.key === 'all' ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    ) : status.key === 'pending' ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    ) : status.key === 'reviewed' ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    ) : status.key === 'shortlisted' ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    ) : status.key === 'rejected' ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    )}
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{status.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{status.count}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search applications by name, email, position, or skills..."
                  className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch(e)}
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={handleSearch}
                className="inline-flex items-center px-5 py-3 border border-transparent text-sm font-medium rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-sm transition-colors"
              >
                Search
              </button>
              <button
                onClick={() => {
                  setStatusFilter('all');
                  setSearchTerm('');
                  fetchApplications(1, 'all', '');
                }}
                className="inline-flex items-center px-4 py-3 border border-gray-300 text-sm font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-sm transition-colors"
              >
                Clear
              </button>
            </div>
          </div>
        </div>

        {/* Applications List */}
        {loading ? (
          <div className="flex justify-center items-center h-64 bg-white rounded-xl shadow-sm">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
              <p className="mt-3 text-gray-500">Loading applications...</p>
            </div>
          </div>
        ) : applications.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">No applications found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search or filter to find what you're looking for.
            </p>
            <button
              onClick={() => {
                setStatusFilter('all');
                setSearchTerm('');
                fetchApplications(1, 'all', '');
              }}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-xl text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-6">
              <AnimatePresence>
                {applications.map((application) => (
                  <motion.div
                    key={application._id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    whileHover={{ y: -5 }}
                    className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-200"
                  >
                    <div className="p-5">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-12 w-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                            <span className="text-indigo-800 font-bold text-lg">
                              {application.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                            </span>
                          </div>
                          <div className="ml-4">
                            <h3 className="text-lg font-semibold text-gray-900">{application.name}</h3>
                            <p className="text-sm text-gray-500">{application.email}</p>
                          </div>
                        </div>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                          {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                        </span>
                      </div>
                      
                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-700">{application.preferredPosition}</p>
                        <p className="text-xs text-gray-500 mt-1">Applied {formatDate(application.appliedAt)}</p>
                      </div>
                      
                      <div className="mb-4 flex flex-wrap gap-1">
                        {application.skills.slice(0, 4).map((skill, index) => (
                          <span key={index} className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-indigo-100 text-indigo-800">
                            {skill}
                          </span>
                        ))}
                        {application.skills.length > 4 && (
                          <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
                            +{application.skills.length - 4} more
                          </span>
                        )}
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleViewDetails(application._id)}
                            className="inline-flex items-center px-3 py-2 border border-gray-200 shadow-sm text-xs font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                          >
                            <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            View
                          </button>
                          
                          <select
                            value={application.status}
                            onChange={(e) => handleStatusUpdate(application._id, e.target.value)}
                            className={`inline-flex items-center px-3 py-2 border border-gray-200 shadow-sm text-xs font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${getStatusColor(application.status)}`}
                          >
                            <option value="pending">Pending</option>
                            <option value="reviewed">Reviewed</option>
                            <option value="shortlisted">Shortlisted</option>
                            <option value="rejected">Rejected</option>
                            <option value="hired">Hired</option>
                          </select>
                        </div>
                        
                        <button
                          onClick={() => handleDelete(application._id)}
                          className="inline-flex items-center p-2 border border-transparent text-xs font-medium rounded-lg text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Pagination */}
            <div className="bg-white px-4 py-3 flex items-center justify-between rounded-xl shadow-sm">
              <div className="flex-1 flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">{(currentPage - 1) * 12 + 1}</span> to{' '}
                    <span className="font-medium">{Math.min(currentPage * 12, totalPages * 12)}</span> of{' '}
                    <span className="font-medium">{totalPages * 12}</span> results
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`relative inline-flex items-center px-4 py-2 rounded-l-md border border-gray-300 text-sm font-medium ${currentPage === 1 ? 'text-gray-300 bg-gray-50' : 'text-gray-500 bg-white hover:bg-gray-50'} transition-colors`}
                    >
                      <span className="sr-only">Previous</span>
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                    
                    {/* Page numbers */}
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
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium transition-colors ${
                            currentPage === pageNum
                              ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                              : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className={`relative inline-flex items-center px-4 py-2 rounded-r-md border border-gray-300 text-sm font-medium ${currentPage === totalPages ? 'text-gray-300 bg-gray-50' : 'text-gray-500 bg-white hover:bg-gray-50'} transition-colors`}
                    >
                      <span className="sr-only">Next</span>
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Application Detail Modal */}
        <AnimatePresence>
          {showModal && selectedApplication && (
            <div className="fixed inset-0 overflow-y-auto z-50">
              <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 transition-opacity z-40"
                  aria-hidden="true"
                >
                  <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                </motion.div>

                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full z-50 relative"
                >
                  <div className="bg-white px-6 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div className="sm:flex sm:items-start">
                      <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                        <div className="flex justify-between items-center mb-6">
                          <h3 className="text-2xl leading-6 font-bold text-gray-900">
                            Application Details
                          </h3>
                          <button
                            onClick={() => setShowModal(false)}
                            className="text-gray-400 hover:text-gray-500 rounded-full p-2 hover:bg-gray-100 transition-colors"
                          >
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                        
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="text-sm font-medium text-gray-500 mb-2">Full Name</h4>
                            <p className="text-sm text-gray-900">{selectedApplication.name}</p>
                          </div>
                          
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="text-sm font-medium text-gray-500 mb-2">Email Address</h4>
                            <p className="text-sm text-gray-900">{selectedApplication.email}</p>
                          </div>
                          
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="text-sm font-medium text-gray-500 mb-2">Phone Number</h4>
                            <p className="text-sm text-gray-900">{selectedApplication.phone}</p>
                          </div>
                          
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="text-sm font-medium text-gray-500 mb-2">Location</h4>
                            <p className="text-sm text-gray-900">{selectedApplication.location}</p>
                          </div>
                          
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="text-sm font-medium text-gray-500 mb-2">Preferred Position</h4>
                            <p className="text-sm text-gray-900">{selectedApplication.preferredPosition}</p>
                          </div>
                          
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="text-sm font-medium text-gray-500 mb-2">Application Status</h4>
                            <div className="mt-1">
                              <select
                                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                value={selectedApplication.status}
                                onChange={(e) => handleStatusUpdate(selectedApplication._id, e.target.value)}
                              >
                                <option value="pending">Pending</option>
                                <option value="reviewed">Reviewed</option>
                                <option value="shortlisted">Shortlisted</option>
                                <option value="rejected">Rejected</option>
                                <option value="hired">Hired</option>
                              </select>
                            </div>
                          </div>
                          
                          <div className="sm:col-span-2 bg-gray-50 p-4 rounded-lg">
                            <h4 className="text-sm font-medium text-gray-500 mb-2">Skills</h4>
                            <div className="flex flex-wrap gap-2">
                              {selectedApplication.skills.map((skill, index) => (
                                <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                          
                          <div className="sm:col-span-2 bg-gray-50 p-4 rounded-lg">
                            <h4 className="text-sm font-medium text-gray-500 mb-2">CV</h4>
                            <div className="mt-1">
                              <a 
                                href={selectedApplication.cvUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="inline-flex items-center text-indigo-600 hover:text-indigo-500 transition-colors"
                              >
                                <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                {selectedApplication.cvFileName}
                              </a>
                            </div>
                          </div>
                          
                          <div className="sm:col-span-2 bg-gray-50 p-4 rounded-lg">
                            <h4 className="text-sm font-medium text-gray-500 mb-2">Applied On</h4>
                            <p className="text-sm text-gray-900">{formatDate(selectedApplication.appliedAt)}</p>
                          </div>
                          
                          <div className="sm:col-span-2">
                            <h4 className="text-sm font-medium text-gray-500 mb-2">Notes</h4>
                            <textarea
                              className="mt-1 block w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                              rows="3"
                              placeholder="Add notes about this application..."
                              value={selectedApplication.notes || ''}
                              onChange={(e) => {
                                const updatedApp = { ...selectedApplication, notes: e.target.value };
                                setSelectedApplication(updatedApp);
                              }}
                            />
                            <button
                              onClick={async () => {
                                try {
                                  const response = await fetch(`/api/applications/${selectedApplication._id}`, {
                                    method: 'PUT',
                                    headers: {
                                      'Content-Type': 'application/json'
                                    },
                                    body: JSON.stringify({ notes: selectedApplication.notes })
                                  });
                                  
                                  if (response.ok) {
                                    // Refresh the applications list
                                    fetchApplications(currentPage, statusFilter, searchTerm);
                                  }
                                } catch (error) {
                                  console.error('Error updating notes:', error);
                                }
                              }}
                              className="mt-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                            >
                              Save Notes
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-6 py-4 sm:flex sm:flex-row-reverse">
                    <button
                      type="button"
                      className="w-full inline-flex justify-center rounded-xl border border-transparent shadow-sm px-4 py-3 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm transition-colors"
                      onClick={() => setShowModal(false)}
                    >
                      Close
                    </button>
                  </div>
                </motion.div>
              </div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default JobApplicationsDashboard;