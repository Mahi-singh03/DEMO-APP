"use client";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { FiPlus, FiX, FiEdit2, FiTrash2, FiLoader, FiCheck, FiAlertCircle, FiBook, FiSearch } from 'react-icons/fi';

export default function BookManager() {
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    publishedDate: '',
    coverPhoto: null,
    pdf: null,
  });
  const [editingId, setEditingId] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Fetch books
  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await fetch('/api/books');
      if (!res.ok) throw new Error('Failed to fetch books');
      const data = await res.json();
      setBooks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const data = new FormData();
      for (const key in formData) {
        if (formData[key]) data.append(key, formData[key]);
      }

      const url = editingId ? `/api/books/${editingId}` : '/api/books';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        body: data,
      });

      if (!res.ok) throw new Error(editingId ? 'Failed to update book' : 'Failed to add book');

      await fetchBooks();
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
      const res = await fetch(`/api/books/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete book');
      await fetchBooks();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
      setDeleteConfirmId(null);
    }
  };

  // Handle edit
  const handleEdit = (book) => {
    setFormData({
      title: book.title,
      description: book.description,
      category: book.category || '',
      publishedDate: book.publishedDate ? book.publishedDate.split('T')[0] : '',
      coverPhoto: null,
      pdf: null,
    });
    setEditingId(book._id);
    setIsFormOpen(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Reset form
  const resetForm = () => {
    setFormData({ 
      title: '', 
      description: '', 
      category: '', 
      publishedDate: '', 
      coverPhoto: null, 
      pdf: null 
    });
    setEditingId(null);
    setError(null);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'No date';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Filter books based on search and category
  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         book.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || book.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Get unique categories
  const categories = ['all', ...new Set(books.map(book => book.category).filter(Boolean))];

  return (
    <div className="min-h-screen bg-[#030712] text-gray-100 p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Book Management
            </h1>
            <p className="text-gray-400">Manage your digital library collection</p>
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
                <FiPlus size={18} /> Add Book
              </>
            )}
          </motion.button>
        </motion.div>

        {/* Search and Filter */}
        <motion.div 
          className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search books..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
          </div>
          <div className="flex gap-2 items-center">
            <label className="text-sm text-gray-300 whitespace-nowrap">Filter by:</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </motion.div>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-red-900/50 border border-red-700 text-red-100 px-4 py-3 rounded-lg mb-6 flex items-start gap-3"
            >
              <FiAlertCircle className="mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Error:</p>
                <p>{error}</p>
              </div>
              <button 
                onClick={() => setError(null)} 
                className="ml-auto text-red-300 hover:text-white"
              >
                <FiX />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form */}
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
                className="bg-gray-800 p-6 rounded-xl shadow-xl mb-8 border border-gray-700"
                initial={{ y: -20 }}
                animate={{ y: 0 }}
                exit={{ y: -20 }}
              >
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  {editingId ? (
                    <>
                      <FiEdit2 /> Edit Book
                    </>
                  ) : (
                    <>
                      <FiPlus /> Add New Book
                    </>
                  )}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Title *</label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        required
                        placeholder="e.g., The Great Gatsby"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all min-h-[120px]"
                        placeholder="Book description..."
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Category</label>
                      <input
                        type="text"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        placeholder="e.g., Fiction, Science"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Published Date</label>
                      <input
                        type="date"
                        value={formData.publishedDate}
                        onChange={(e) => setFormData({ ...formData, publishedDate: e.target.value })}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div>
                              <label className="block text-sm font-medium text-gray-300 mb-1">
                                Cover Photo
                              </label>
                              {editingId && (
                                <div className="mb-2">
                                  <p className="text-sm text-gray-400 mb-1">Current Cover:</p>
                                  <Image
                                    src={books.find(b => b._id === editingId)?.coverPhotoUrl}
                                    alt="Current cover"
                                    width={100}
                                    height={150}
                                    className="rounded-lg border border-gray-600"
                                  />
                                </div>
                              )}
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setFormData({ ...formData, coverPhoto: e.target.files[0] })}
                                className="w-full file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-gray-600 file:text-gray-100 hover:file:bg-gray-500 transition-all"
                              />
                              <p className="text-xs text-gray-400 mt-1">
                                {editingId ? 'Leave empty to keep current' : 'Required'}
                              </p>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-300 mb-1">
                                PDF File
                              </label>
                              {editingId && (
                                <div className="mb-2">
                                  <p className="text-sm text-gray-400 mb-1">Current PDF:</p>
                                  <a 
                                    href={books.find(b => b._id === editingId)?.pdfUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-400 hover:text-blue-300 text-sm"
                                  >
                                    View Current PDF
                                  </a>
                                </div>
                              )}
                              <input
                                type="file"
                                accept=".pdf"
                                onChange={(e) => setFormData({ ...formData, pdf: e.target.files[0] })}
                                className="w-full file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-gray-600 file:text-gray-100 hover:file:bg-gray-500 transition-all"
                              />
                              <p className="text-xs text-gray-400 mt-1">
                                {editingId ? 'Leave empty to keep current' : 'Required'}
                              </p>
                            </div>
                          </div>
                  <div className="flex justify-end gap-3 pt-2">
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      type="button"
                      onClick={() => { resetForm(); setIsFormOpen(false); }}
                      className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-5 py-2 rounded-lg shadow transition-all"
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
                          <FiPlus size={16} /> Add Book
                        </>
                      )}
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading State */}
        {isLoading && !isFormOpen && (
          <div className="flex justify-center items-center h-64">
            <FiLoader className="animate-spin text-blue-400 text-4xl" />
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredBooks.length === 0 && !isFormOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-gray-800/50 border border-gray-700 rounded-xl p-8 text-center"
          >
            <div className="text-gray-400 mb-4">
              <FiBook className="inline-block text-4xl" />
            </div>
            <h3 className="text-xl font-medium text-gray-200 mb-2">No Books Found</h3>
            <p className="text-gray-400 mb-4">
              {searchTerm || selectedCategory !== 'all' 
                ? 'Try adjusting your search or filter' 
                : 'Add your first book to get started'}
            </p>
            <button
              onClick={() => setIsFormOpen(true)}
              className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg inline-flex items-center gap-2"
            >
              <FiPlus /> Add Book
            </button>
          </motion.div>
        )}

        {/* Books Grid */}
        {!isLoading && filteredBooks.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence>
              {filteredBooks.map((book) => (
                <motion.div
                  key={book._id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  whileHover={{ y: -5 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className="bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-700 hover:shadow-xl transition-all"
                >
                  <div className="relative h-64">
                    <Image
                      src={book.coverPhotoUrl || '/placeholder-book.jpg'}
                      alt={book.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>
                  <div className="p-5">
                    <div className="flex justify-between items-start gap-3">
                      <h2 className="text-xl font-semibold text-white line-clamp-2">{book.title}</h2>
                      {book.publishedDate && (
                        <span className="bg-blue-900/50 text-blue-300 text-xs px-2 py-1 rounded-full whitespace-nowrap">
                          {formatDate(book.publishedDate)}
                        </span>
                      )}
                    </div>
                    {book.category && (
                      <span className="inline-block bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded-full mt-2">
                        {book.category}
                      </span>
                    )}
                    <p className="text-gray-300 mt-3 line-clamp-3">{book.description}</p>
                    <div className="flex justify-between items-center mt-4">
                      <motion.a
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        href={book.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 text-sm font-medium"
                      >
                        View PDF
                      </motion.a>
                      <div className="flex gap-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleEdit(book)}
                          className="bg-gray-700 hover:bg-gray-600 text-gray-100 p-2 rounded-lg"
                          title="Edit"
                        >
                          <FiEdit2 size={18} />
                        </motion.button>
                        
                        {deleteConfirmId === book._id ? (
                          <div className="flex gap-2">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleDelete(book._id)}
                              className="bg-red-600 hover:bg-red-500 text-white px-3 py-1 rounded-lg flex items-center gap-1"
                            >
                              <FiCheck size={16} /> Confirm
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => setDeleteConfirmId(null)}
                              className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded-lg flex items-center gap-1"
                            >
                              <FiX size={16} /> Cancel
                            </motion.button>
                          </div>
                        ) : (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setDeleteConfirmId(book._id)}
                            className="bg-red-900/50 hover:bg-red-800/50 text-red-300 p-2 rounded-lg"
                            title="Delete"
                          >
                            <FiTrash2 size={18} />
                          </motion.button>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}