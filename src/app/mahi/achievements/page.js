"use client";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { FiPlus, FiX, FiEdit2, FiTrash2, FiLoader, FiCheck, FiAlertCircle } from 'react-icons/fi';

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

  // Fetch achievements
  useEffect(() => {
    fetchAchievements();
  }, []);

  const fetchAchievements = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await fetch('/api/admin/Achievements');
      if (!res.ok) throw new Error('Failed to fetch achievements');
      const data = await res.json();
      setAchievements(data);
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

      const url = editingId ? `/api/admin/Achievements/${editingId}` : '/api/admin/Achievements';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        body: data,
      });

      if (!res.ok) throw new Error(editingId ? 'Failed to update' : 'Failed to create');

      await fetchAchievements();
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
      await fetchAchievements();
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Reset form
  const resetForm = () => {
    setFormData({ title: '', description: '', studentName: '', date: '', photo: null });
    setEditingId(null);
    setError(null);
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="min-h-screen bg-[#030712] text-gray-100 p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 pt-15 gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Student Achievements
            </h1>
            <p className="text-gray-400">Celebrating our students' successes</p>
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
                      <label className="block text-sm font-medium text-gray-300 mb-1">Title *</label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        required
                        placeholder="e.g., National Science Olympiad"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Student Name *</label>
                      <input
                        type="text"
                        value={formData.studentName}
                        onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        required
                        placeholder="e.g., Alex Johnson"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Description *</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all min-h-[120px]"
                      required
                      placeholder="Describe the achievement..."
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Date *</label>
                      <input
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Photo {!editingId && '*'}
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setFormData({ ...formData, photo: e.target.files[0] })}
                        className="w-full file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-gray-600 file:text-gray-100 hover:file:bg-gray-500 transition-all"
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
            className="bg-gray-800/50 border border-gray-700 rounded-xl p-8 text-center"
          >
            <div className="text-gray-400 mb-4">
              <FiAlertCircle className="inline-block text-4xl" />
            </div>
            <h3 className="text-xl font-medium text-gray-200 mb-2">No Achievements Found</h3>
            <p className="text-gray-400 mb-4">Add your first achievement to get started</p>
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
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence>
              {achievements.map((achievement) => (
                <motion.div
                  key={achievement._id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  whileHover={{ y: -5 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className="bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-700 hover:shadow-xl transition-all"
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
                      <h2 className="text-xl font-semibold text-white">{achievement.title}</h2>
                      <span className="bg-blue-900/50 text-blue-300 text-xs px-2 py-1 rounded-full whitespace-nowrap">
                        {formatDate(achievement.date)}
                      </span>
                    </div>
                    <p className="text-gray-300 mt-3 line-clamp-3">{achievement.description}</p>
                    <p className="text-gray-400 mt-3">
                      <span className="font-medium">By:</span> {achievement.studentName}
                    </p>
                    <div className="flex justify-end gap-2 mt-4">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleEdit(achievement)}
                        className="bg-gray-700 hover:bg-gray-600 text-gray-100 p-2 rounded-lg"
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
                            className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded-lg flex items-center gap-1"
                          >
                            <FiX size={16} /> Cancel
                          </motion.button>
                        </div>
                      ) : (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setDeleteConfirmId(achievement._id)}
                          className="bg-red-900/50 hover:bg-red-800/50 text-red-300 p-2 rounded-lg"
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
        )}
      </div>
    </div>
  );
}