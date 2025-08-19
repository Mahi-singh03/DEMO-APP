"use client";
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { 
  FiPlus, 
  FiX, 
  FiEdit2, 
  FiTrash2, 
  FiLoader, 
  FiCheck, 
  FiAlertCircle, 
  FiArrowUp,
  FiUser,
  FiAward,
  FiCalendar,
  FiRefreshCw
} from 'react-icons/fi';
import { useDebounce } from 'use-debounce';

export default function Achievements() {
  const [achievements, setAchievements] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    studentName: '',
    date: '',
    photo: null,
  });
  const [editingId, setEditingId] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalAchievements: 0,
    limit: 12,
  });
  
  // Create a ref for the form section
  const formRef = useRef(null);

  // Fetch achievements
  useEffect(() => {
    fetchAchievements();
  }, []);

  // Handle scroll events for scroll-to-top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fetchAchievements = async (name = "", page = 1) => {
    try {
      setIsLoading(true);
      setError(null);
      let url = `/api/admin/Achievements?page=${page}&limit=${pagination.limit}`;
      if (name) url += `&name=${encodeURIComponent(name)}`;
      
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch achievements');
      const data = await res.json();
      setAchievements(data.achievements || data);
      setPagination(prev => ({
        ...prev,
        totalPages: data.totalPages || 1,
        totalAchievements: data.totalAchievements || (data.achievements ? data.achievements.length : data.length),
        currentPage: page,
      }));
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle search changes
  useEffect(() => {
    fetchAchievements(debouncedSearchTerm, 1);
  }, [debouncedSearchTerm]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const data = new FormData();
      for (const key in formData) {
        if (formData[key]) data.append(key, formData[key]);
      }

      const url = editingId ? `/api/admin/Achievements/${editingId}` : '/api/admin/Achievements';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        body: data,
      });

      if (!res.ok) throw new Error(editingId ? 'Failed to update' : 'Failed to create');

      await fetchAchievements(searchTerm, pagination.currentPage);
      resetForm();
      setIsFormOpen(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/admin/achievements/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      await fetchAchievements(searchTerm, pagination.currentPage);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
      setDeleteConfirmId(null);
    }
  };

  // Handle edit
  const handleEdit = (achievement) => {
    setFormData({
      title: achievement.title,
      description: achievement.description,
      studentName: achievement.studentName,
      date: achievement.date.split('T')[0],
      photo: null,
    });
    setEditingId(achievement._id);
    setIsFormOpen(true);
    
    // Scroll to the form section
    setTimeout(() => {
      if (formRef.current) {
        formRef.current.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
      }
    }, 100);
  };

  // Reset form
  const resetForm = () => {
    setFormData({ title: '', description: '', studentName: '', date: '', photo: null });
    setEditingId(null);
    setError(null);
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchAchievements(searchTerm, newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4"
        >
          <div>
            <div className="flex items-center mb-2">
              <motion.div 
                whileHover={{ rotate: 10 }}
                className="bg-blue-600 p-2 rounded-lg mr-3"
              >
                <FiAward className="text-white text-xl" />
              </motion.div>
              <h1 className="text-3xl font-bold text-blue-600">Student Achievements</h1>
            </div>
            <p className="text-gray-600 ml-12">
              {pagination.totalAchievements} achievements found
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              resetForm();
              setIsFormOpen(!isFormOpen);
            }}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all"
          >
            {isFormOpen ? (
              <>
                <FiX size={18} /> Close
              </>
            ) : (
              <>
                <FiPlus size={18} /> Add Achievement
              </>
            )}
          </motion.button>
        </motion.div>

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

        {/* Search */}
        <motion.div
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mb-8 bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500"
        >
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <FiAward className="text-blue-500" /> Search Achievements
          </h2>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiAward className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by title or student name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 p-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
            </div>
            
            <motion.button
              onClick={() => {
                setSearchTerm("");
                fetchAchievements();
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition flex items-center gap-2 shadow-sm"
            >
              <FiRefreshCw /> Reset
            </motion.button>
          </div>
        </motion.div>

        {/* Form */}
        <div ref={formRef}>
          <AnimatePresence>
            {isFormOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <motion.div 
                  className="bg-white p-6 rounded-xl shadow-xl mb-8 border border-gray-200"
                  initial={{ y: -20 }}
                  animate={{ y: 0 }}
                  exit={{ y: -20 }}
                >
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    {editingId ? (
                      <>
                        <FiEdit2 /> Edit Achievement
                      </>
                    ) : (
                      <>
                        <FiPlus /> Add New Achievement
                      </>
                    )}
                  </h2>
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                          <FiAward className="mr-2 text-blue-500" /> Title *
                        </label>
                        <input
                          type="text"
                          value={formData.title}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                          className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                          required
                          placeholder="e.g., National Science Olympiad"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                          <FiUser className="mr-2 text-blue-500" /> Student Name *
                        </label>
                        <input
                          type="text"
                          value={formData.studentName}
                          onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                          className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                          required
                          placeholder="e.g., Alex Johnson"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                        <FiAward className="mr-2 text-blue-500" /> Description *
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all min-h-[120px]"
                        required
                        placeholder="Describe the achievement..."
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                          <FiCalendar className="mr-2 text-blue-500" /> Date *
                        </label>
                        <input
                          type="date"
                          value={formData.date}
                          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                          className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Photo {!editingId && '*'}
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => setFormData({ ...formData, photo: e.target.files[0] })}
                          className="w-full file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-500 file:text-white hover:file:bg-blue-600 transition-all"
                          required={!editingId}
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-3 pt-2">
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        type="button"
                        onClick={() => { resetForm(); setIsFormOpen(false); }}
                        className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-700 px-5 py-2 rounded-lg shadow transition-all"
                      >
                        <FiX size={16} /> Cancel
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        type="submit"
                        disabled={isSubmitting}
                        className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white px-5 py-2 rounded-lg shadow transition-all disabled:opacity-70"
                      >
                        {isSubmitting ? (
                          <>
                            <FiLoader className="animate-spin" size={16} /> Processing...
                          </>
                        ) : editingId ? (
                          <>
                            <FiCheck size={16} /> Update
                          </>
                        ) : (
                          <>
                            <FiPlus size={16} /> Add Achievement
                          </>
                        )}
                      </motion.button>
                    </div>
                  </form>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Loading State */}
        {isLoading && !isFormOpen && (
          <div className="flex justify-center items-center h-64">
            <FiLoader className="animate-spin text-blue-400 text-4xl" />
          </div>
        )}

        {/* Empty State */}
        {!isLoading && achievements.length === 0 && !isFormOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white border border-gray-200 rounded-xl p-8 text-center"
          >
            <div className="text-gray-400 mb-4">
              <FiAlertCircle className="inline-block text-4xl" />
            </div>
            <h3 className="text-xl font-medium text-gray-700 mb-2">No Achievements Found</h3>
            <p className="text-gray-500 mb-4">Add your first achievement to get started</p>
            <button
              onClick={() => setIsFormOpen(true)}
              className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg inline-flex items-center gap-2"
            >
              <FiPlus /> Add Achievement
            </button>
          </motion.div>
        )}

        {/* Achievements Grid */}
        {!isLoading && achievements.length > 0 && (
          <>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
            >
              <AnimatePresence>
                {achievements.map((achievement) => (
                  <motion.div
                    key={achievement._id}
                    layout
                    variants={itemVariants}
                    whileHover={{ 
                      y: -5, 
                      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                      borderColor: "#3b82f6"
                    }}
                    className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 hover:border-blue-300 transition-all"
                  >
                    <div className="relative h-48">
                      <Image
                        src={achievement.photo.url}
                        alt={achievement.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    </div>
                    <div className="p-5">
                      <div className="flex justify-between items-start gap-3">
                        <h2 className="text-xl font-semibold text-gray-900">{achievement.title}</h2>
                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full whitespace-nowrap">
                          {formatDate(achievement.date)}
                        </span>
                      </div>
                      <p className="text-gray-600 mt-3 line-clamp-3">{achievement.description}</p>
                      <p className="text-gray-500 mt-3">
                        <span className="font-medium">By:</span> {achievement.studentName}
                      </p>
                      <div className="flex justify-end gap-2 mt-4">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleEdit(achievement)}
                          className="bg-yellow-100 text-yellow-700 p-2 rounded-lg hover:bg-yellow-200 transition"
                          title="Edit"
                        >
                          <FiEdit2 size={18} />
                        </motion.button>
                        
                        {deleteConfirmId === achievement._id ? (
                          <div className="flex gap-2">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleDelete(achievement._id)}
                              className="bg-red-600 hover:bg-red-500 text-white px-3 py-1 rounded-lg flex items-center gap-1"
                            >
                              <FiCheck size={16} /> Confirm
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => setDeleteConfirmId(null)}
                              className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded-lg flex items-center gap-1"
                            >
                              <FiX size={16} /> Cancel
                            </motion.button>
                          </div>
                        ) : (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setDeleteConfirmId(achievement._id)}
                            className="bg-red-100 text-red-700 p-2 rounded-lg hover:bg-red-200 transition"
                            title="Delete"
                          >
                            <FiTrash2 size={18} />
                          </motion.button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl shadow-sm"
              >
                <div className="text-sm text-gray-600">
                  Showing {(pagination.currentPage - 1) * pagination.limit + 1} to{" "}
                  {Math.min(pagination.currentPage * pagination.limit, pagination.totalAchievements)} of{" "}
                  {pagination.totalAchievements} achievements
                </div>
                
                <div className="flex items-center gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handlePageChange(1)}
                    disabled={pagination.currentPage === 1}
                    className={`p-2 rounded-lg ${pagination.currentPage === 1 ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300 shadow-sm"}`}
                  >
                    <FiChevronsLeft size={20} />
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={pagination.currentPage === 1}
                    className={`p-2 rounded-lg ${pagination.currentPage === 1 ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300 shadow-sm"}`}
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
                    disabled={pagination.currentPage === pagination.totalPages}
                    className={`p-2 rounded-lg ${pagination.currentPage === pagination.totalPages ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300 shadow-sm"}`}
                  >
                    <FiChevronRight size={20} />
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handlePageChange(pagination.totalPages)}
                    disabled={pagination.currentPage === pagination.totalPages}
                    className={`p-2 rounded-lg ${pagination.currentPage === pagination.totalPages ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300 shadow-sm"}`}
                  >
                    <FiChevronsRight size={20} />
                  </motion.button>
                </div>
              </motion.div>
            )}
          </>
        )}
      </div>

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
}
