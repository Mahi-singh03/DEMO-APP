"use client"
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CourseManager() {
  // State management
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('list'); // 'list', 'create', 'edit'
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    titlePhotoBase64: '',
    videos: []
  });
  const [errors, setErrors] = useState({});
  const [videoForm, setVideoForm] = useState({
    title: '',
    description: '',
    videoUrl: '',
    duration: ''
  });

  // Predefined course names (schema-defined)
  const courseOptions = [
    "VN video editing",
    "AI and ChatGPT",
    "MS Excel Course",
    "Canva Course",
    "HTML Course"
  ];

  // Fetch courses on component mount
  useEffect(() => {
    fetchCourses();
  }, []);

  // API call to fetch courses
  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/onlineCourse/course');
      const data = await response.json();
      setCourses(data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle course deletion
  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this course?')) {
      try {
        const response = await fetch(`/api/admin/onlineCourse/course/${id}`, {
          method: 'DELETE',
        });
        
        if (response.ok) {
          setCourses(courses.filter(course => course._id !== id));
        } else {
          console.error('Failed to delete course');
        }
      } catch (error) {
        console.error('Error deleting course:', error);
      }
    }
  };

  // Handle video input changes
  const handleVideoInputChange = (e) => {
    const { name, value } = e.target;
    setVideoForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          titlePhotoBase64: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Add video to course
  const addVideo = () => {
    if (!videoForm.title || !videoForm.videoUrl) {
      setErrors({ video: 'Title and URL are required for videos' });
      return;
    }

    const newVideo = {
      title: videoForm.title,
      description: videoForm.description,
      videoUrl: videoForm.videoUrl,
      duration: parseInt(videoForm.duration) || 0,
      order: formData.videos.length
    };

    setFormData(prev => ({
      ...prev,
      videos: [...prev.videos, newVideo]
    }));

    // Reset video form
    setVideoForm({
      title: '',
      description: '',
      videoUrl: '',
      duration: ''
    });

    setErrors(prev => ({ ...prev, video: '' }));
  };

  // Remove video from course
  const removeVideo = (index) => {
    setFormData(prev => ({
      ...prev,
      videos: prev.videos.filter((_, i) => i !== index)
    }));
  };

  // Submit course form
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Course name is required';
    if (!formData.description) newErrors.description = 'Description is required';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const url = view === 'create' 
        ? '/api/admin/onlineCourse/course' 
        : `/api/admin/onlineCourse/course/${selectedCourse.courseId || selectedCourse._id}`;
      
      const method = view === 'create' ? 'POST' : 'PUT';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // Reset form and return to list view
        setFormData({
          name: '',
          description: '',
          titlePhotoBase64: '',
          videos: []
        });
        setView('list');
        fetchCourses(); // Refresh the course list
      } else {
        console.error('Failed to save course');
      }
    } catch (error) {
      console.error('Error saving course:', error);
    }
  };

  // Set up form for editing
  const setupEditForm = (course) => {
    setSelectedCourse(course);
    setFormData({
      name: course.name,
      description: course.description,
      titlePhotoBase64: '',
      videos: course.videos || []
    });
    setView('edit');
  };

  // Render loading state
  if (loading && view === 'list') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4"
        >
          <h1 className="text-3xl font-bold text-gray-800">
            {view === 'list' ? 'Course Management' : 
             view === 'create' ? 'Create New Course' : 'Edit Course'}
          </h1>
          
          {view === 'list' ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setView('create')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-colors"
            >
              Create New Course
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setView('list')}
              className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-colors"
            >
              Back to Courses
            </motion.button>
          )}
        </motion.div>

        <AnimatePresence mode="wait">
          {/* Course List View */}
          {view === 'list' && (
            <motion.div
              key="list-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {courses.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-center py-12 bg-white rounded-xl shadow-sm"
                >
                  <h2 className="text-xl text-gray-600">No courses found</h2>
                  <p className="text-gray-500 mt-2">Create your first course to get started</p>
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {courses.map((course, index) => (
                    <motion.div
                      key={course._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      whileHover={{ y: -5 }}
                      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                    >
                      {course.titlePhotoUrl && (
                        <div className="h-48 overflow-hidden">
                          <img 
                            src={course.titlePhotoUrl} 
                            alt={course.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="p-6">
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">{course.name}</h3>
                        <p className="text-gray-600 mb-4 line-clamp-2">{course.description}</p>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500">{course.videoCount || 0} videos</span>
                          <div className="flex space-x-2">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => setupEditForm(course)}
                              className="bg-blue-100 text-blue-600 hover:bg-blue-200 px-3 py-1 rounded-md text-sm font-medium"
                            >
                              Edit
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleDelete(course._id)}
                              className="bg-red-100 text-red-600 hover:bg-red-200 px-3 py-1 rounded-md text-sm font-medium"
                            >
                              Delete
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Course Form View (Create/Edit) */}
          {(view === 'create' || view === 'edit') && (
            <motion.form
              key="form-view"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              onSubmit={handleSubmit}
              className="bg-white rounded-xl shadow-sm p-6"
            >
              {/* Course Name Dropdown */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Course Name *
                </label>
                <select
                  name="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">-- Select a course --</option>
                  {courseOptions.map((option, idx) => (
                    <option key={idx} value={option}>{option}</option>
                  ))}
                </select>
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>

              {/* Description */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
                    errors.description ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Describe what students will learn in this course..."
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                )}
              </div>

              {/* Thumbnail Upload */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Course Thumbnail
                </label>
                <div className="flex items-center space-x-4">
                  {formData.titlePhotoBase64 ? (
                    <div className="relative">
                      <img 
                        src={formData.titlePhotoBase64} 
                        alt="Course thumbnail" 
                        className="h-20 w-20 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, titlePhotoBase64: '' }))}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageUpload}
                      />
                    </label>
                  )}
                  <span className="text-sm text-gray-500">Upload a thumbnail image for your course</span>
                </div>
              </div>

              {/* Video Management Section */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Course Videos</h3>
                
                {/* Add Video Form */}
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <h4 className="text-md font-medium text-gray-700 mb-3">Add New Video</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Video Title *
                      </label>
                      <input
                        type="text"
                        name="title"
                        value={videoForm.title}
                        onChange={handleVideoInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                        placeholder="Introduction to HTML"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Video URL *
                      </label>
                      <input
                        type="text"
                        name="videoUrl"
                        value={videoForm.videoUrl}
                        onChange={handleVideoInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                        placeholder="https://example.com/video.mp4"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <input
                        type="text"
                        name="description"
                        value={videoForm.description}
                        onChange={handleVideoInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                        placeholder="Brief video description"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Duration (Minutes)
                      </label>
                      <input
                        type="number"
                        name="duration"
                        value={videoForm.duration}
                        onChange={handleVideoInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                        placeholder="300"
                      />
                    </div>
                  </div>
                  {errors.video && (
                    <p className="mt-1 text-sm text-red-600 mb-2">{errors.video}</p>
                  )}
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={addVideo}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
                  >
                    Add Video
                  </motion.button>
                </div>
                
                {/* Video List */}
                {formData.videos.length > 0 && (
                  <div className="space-y-3">
                    {formData.videos.map((video, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white border border-gray-200 rounded-lg p-4 flex justify-between items-center"
                      >
                        <div>
                          <h4 className="font-medium text-gray-800">{video.title}</h4>
                          <p className="text-sm text-gray-600">{video.description}</p>
                          <span className="text-xs text-gray-500">{video.duration} min</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeVideo(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Remove
                        </button>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Form Actions */}
              <div className="flex justify-end space-x-3">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setView('list')}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium"
                >
                  Cancel
                </motion.button>
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium"
                >
                  {view === 'create' ? 'Create Course' : 'Update Course'}
                </motion.button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
