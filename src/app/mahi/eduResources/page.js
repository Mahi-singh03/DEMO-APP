"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiSearch,
  FiPlus,
  FiEdit,
  FiTrash2,
  FiFileText,
  FiImage,
  FiCalendar,
  FiRefreshCw,
  FiChevronLeft,
  FiChevronRight,
  FiChevronsLeft,
  FiChevronsRight,
  FiX,
  FiSave,
  FiType,
  FiAlignLeft,
  FiFolder,
  FiArrowUp
} from "react-icons/fi";

import { useDebounce } from "use-debounce";

const categories = [
  "Basic Computer",
  "MS Word",
  "AutoCAD",
  "Programming",
  "Web Designing",
  "Graphic Designing",
  "Animation",
  "Computer Accountancy",
  "Other",
];

export default function ResourcesPage() {
  const [resources, setResources] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Other",
    publishedDate: "",
    pdfFile: null,
    coverPhoto: null,
  });
  const [editingResource, setEditingResource] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);
  const [searchCategory, setSearchCategory] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalResources: 0,
    limit: 12,
  });
  const [showScrollTop, setShowScrollTop] = useState(false);
  
  // Create a ref for the form section
  const formRef = useRef(null);

  // Fetch resources
  const fetchResources = async (name = "", category = "", page = 1) => {
    setIsLoading(true);
    try {
      let url = `/api/resources?page=${page}&limit=${pagination.limit}`;
      if (name) url += `&name=${encodeURIComponent(name)}`;
      if (category) url += `&category=${encodeURIComponent(category)}`;
      
      const res = await fetch(url);
      const data = await res.json();
      
      if (res.ok) {
        setResources(data.resources || data);
        setPagination(prev => ({
          ...prev,
          totalPages: data.totalPages || 1,
          totalResources: data.totalResources || (data.resources ? data.resources.length : data.length),
          currentPage: page,
        }));
      } else {
        setError(data.error || "Failed to fetch resources");
      }
    } catch (err) {
      setError("Error fetching resources");
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchResources();
  }, []);

  // Handle search and filter changes
  useEffect(() => {
    fetchResources(debouncedSearchTerm, searchCategory, 1);
  }, [debouncedSearchTerm, searchCategory]);

  // Handle scroll events for scroll-to-top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle file input
  const handleFileChange = (e) => {
    if (e.target.name === "pdfFile") {
      setFormData({ ...formData, pdfFile: e.target.files[0] });
    } else {
      setFormData({ ...formData, coverPhoto: e.target.files[0] });
    }
  };

  // Handle form submission (create or update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    
    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("category", formData.category);
    if (formData.publishedDate) data.append("publishedDate", formData.publishedDate);
    if (formData.pdfFile) data.append("pdfFile", formData.pdfFile);
    if (formData.coverPhoto) data.append("coverPhoto", formData.coverPhoto);

    try {
      const url = editingResource 
        ? `/api/resources/${editingResource.id}` 
        : "/api/resources";
      const method = editingResource ? "PUT" : "POST";
      
      const res = await fetch(url, { method, body: data });
      const result = await res.json();
      
      if (res.ok) {
        fetchResources(searchTerm, searchCategory, pagination.currentPage);
        resetForm();
      } else {
        setError(result.error || "Failed to save resource");
      }
    } catch (err) {
      setError("Error saving resource: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      category: "Other",
      publishedDate: "",
      pdfFile: null,
      coverPhoto: null,
    });
    setEditingResource(null);
  };

  // Handle edit button click
  const handleEdit = (resource) => {
    setEditingResource(resource);
    setFormData({
      title: resource.title,
      description: resource.description || "",
      category: resource.category,
      publishedDate: resource.publishedDate ? resource.publishedDate.split("T")[0] : "",
      pdfFile: null,
      coverPhoto: null,
    });
    
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

  // Handle delete button click
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this resource?")) return;
    setIsLoading(true);
    try {
      const res = await fetch(`/api/resources/${id}`, { method: "DELETE" });
      const result = await res.json();
      if (res.ok) {
        fetchResources(searchTerm, searchCategory, pagination.currentPage);
      } else {
        setError(result.error || "Failed to delete resource");
      }
    } catch (err) {
      setError("Error deleting resource");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchResources(searchTerm, searchCategory, newPage);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-50 py-8 px-4 sm:px-6 lg:px-8">
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
                <FiFolder className="text-white text-xl" />
              </motion.div>
              <h1 className="text-3xl font-bold text-blue-600">Resources Management</h1>
            </div>
            <p className="text-gray-600 ml-12">
              {pagination.totalResources} resources found
            </p>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={resetForm}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2 shadow-md"
          >
            <FiPlus /> Add New Resource
          </motion.button>
        </motion.div>

        {/* Form */}
        <div ref={formRef}>
          <motion.div
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="mb-8 bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500"
          >
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              {editingResource ? (
                <>
                  <FiEdit className="text-yellow-500" /> Edit Resource
                </>
              ) : (
                <>
                  <FiPlus className="text-green-500" /> Add New Resource
                </>
              )}
            </h2>
            
            
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg border border-red-200 flex items-center"
              >
                <FiX className="mr-2" /> {error}
              </motion.div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <FiType className="mr-2 text-blue-500" /> Title*
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <FiFolder className="mr-2 text-blue-500" /> Category
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <FiAlignLeft className="mr-2 text-blue-500" /> Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    rows="3"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <FiCalendar className="mr-2 text-blue-500" /> Published Date
                  </label>
                  <input
                    type="date"
                    name="publishedDate"
                    value={formData.publishedDate}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <FiFileText className="mr-2 text-blue-500" /> PDF File*
                    {editingResource && (
                      <span className="text-xs text-gray-500 ml-2">
                        (Leave empty to keep current file)
                      </span>
                    )}
                  </label>
                  <input
                    type="file"
                    name="pdfFile"
                    onChange={handleFileChange}
                    accept=".pdf"
                    className="w-full p-3 border border-gray-300 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-blue-500 file:text-white hover:file:bg-blue-600 transition"
                    required={!editingResource}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <FiImage className="mr-2 text-blue-500" /> Cover Photo
                    {editingResource && (
                      <span className="text-xs text-gray-500 ml-2">
                        (Leave empty to keep current photo)
                      </span>
                    )}
                  </label>
                  <input
                    type="file"
                    name="coverPhoto"
                    onChange={handleFileChange}
                    accept="image/*"
                    className="w-full p-3 border border-gray-300 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-blue-500 file:text-white hover:file:bg-blue-600 transition"
                  />
                </div>
              </div>
              
              <div className="flex gap-2 pt-4">
                <motion.button
                  type="submit"
                  disabled={isLoading}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2 shadow-md disabled:opacity-50"
                >
                  {isLoading ? (
                    <FiRefreshCw className="animate-spin" />
                  ) : editingResource ? (
                    <>
                      <FiSave /> Update Resource
                    </>
                  ) : (
                    <>
                      <FiPlus /> Add Resource
                    </>
                  )}
                </motion.button>
                
                {editingResource && (
                  <motion.button
                    type="button"
                    onClick={resetForm}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition flex items-center gap-2 shadow-md"
                  >
                    <FiX /> Cancel
                  </motion.button>
                )}
              </div>
            </form>
          </motion.div>
        </div>

        {/* Search and Filter */}
        <motion.div
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mb-8 bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500"
        >
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <FiSearch className="text-blue-500" /> Search Resources
          </h2>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 p-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
            </div>
            
            <select
              value={searchCategory}
              onChange={(e) => setSearchCategory(e.target.value)}
              className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            
            <motion.button
              onClick={() => {
                setSearchTerm("");
                setSearchCategory("");
                fetchResources();
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition flex items-center gap-2 shadow-sm"
            >
              <FiRefreshCw /> Reset
            </motion.button>
          </div>
        </motion.div>

        {/* Resources List */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                <div className="animate-pulse">
                  <div className="h-48 bg-gray-200 rounded-xl mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded w-full"></div>
                    <div className="h-3 bg-gray-200 rounded w-full"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : resources.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="col-span-full py-12 text-center bg-white rounded-xl shadow-sm p-8"
          >
            <div className="text-gray-500 text-lg mb-4">
              No resources found{searchTerm || searchCategory ? " matching your criteria" : ""}
            </div>
            <motion.button
              onClick={resetForm}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-md"
            >
              Add New Resource
            </motion.button>
          </motion.div>
        ) : (
          <>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
            >
              <AnimatePresence>
                {resources.map((resource, index) => (
                  <motion.div
                    key={resource.id}
                    variants={itemVariants}
                    whileHover={{ 
                      y: -5, 
                      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                      borderColor: "#3b82f6"
                    }}
                    className="bg-white rounded-xl overflow-hidden border border-gray-200 transition-all duration-200 hover:border-blue-300 shadow-sm"
                  >
                    {resource.coverPhotoUrl && (
                      <div className="h-48 overflow-hidden">
                        <img
                          src={resource.coverPhotoUrl}
                          alt={resource.title}
                          className="w-full h-full object-cover transform transition-all duration-300 hover:scale-105"
                        />
                      </div>
                    )}
                    
                    <div className="p-5">
                      <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2">
                        {resource.title}
                      </h3>
                      
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {resource.description}
                      </p>
                      
                      <div className="space-y-2 text-sm text-gray-500 mb-4">
                        <div className="flex items-center">
                          <FiFolder className="mr-2 text-blue-500" />
                          <span>{resource.category}</span>
                        </div>
                        
                        {resource.publishedDate && (
                          <div className="flex items-center">
                            <FiCalendar className="mr-2 text-blue-500" />
                            <span>
                              Published: {new Date(resource.publishedDate).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <a
                          href={resource.pdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 transition flex items-center gap-1"
                        >
                          <FiFileText /> View PDF
                        </a>
                        
                        <div className="flex gap-2">
                          <motion.button
                            onClick={() => handleEdit(resource)}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-2 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition"
                            title="Edit"
                          >
                            <FiEdit />
                          </motion.button>
                          
                          <motion.button
                            onClick={() => handleDelete(resource.id)}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition"
                            title="Delete"
                          >
                            <FiTrash2 />
                          </motion.button>
                        </div>
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
                  {Math.min(pagination.currentPage * pagination.limit, pagination.totalResources)} of{" "}
                  {pagination.totalResources} resources
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