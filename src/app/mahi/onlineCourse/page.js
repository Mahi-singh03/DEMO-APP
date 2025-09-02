"use client";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CourseManagement = () => {
  // State management
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [editingCourse, setEditingCourse] = useState(null);
  const [editingVideo, setEditingVideo] = useState(null);
  const [isAddingCourse, setIsAddingCourse] = useState(false);
  const [isAddingVideo, setIsAddingVideo] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [videoUploading, setVideoUploading] = useState(false);
  const [activeTab, setActiveTab] = useState('courses');
  const [searchTerm, setSearchTerm] = useState('');
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [formData, setFormData] = useState({
    courseId: '',
    name: '',
    description: '',
    titlePhotoUrl: ''
  });
  const [videoFormData, setVideoFormData] = useState({
    title: '',
    description: '',
    cloudinaryPublicId: '',
    secureUrl: '',
    duration: 0,
    order: 0,
    watermarkTemplate: '',
    videoFile: null
  });
  const [videoPreview, setVideoPreview] = useState(null);
  const [selectedVideos, setSelectedVideos] = useState([]);
  const [isReordering, setIsReordering] = useState(false);
  const [dragIndex, setDragIndex] = useState(null);
  const [dropIndex, setDropIndex] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);

  // Show notification with better error handling
  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
  };

  // Improved error handler
  const handleError = (error, context) => {
    console.error(`Error in ${context}:`, error);
    
    let errorMessage = 'An unexpected error occurred';
    
    if (error.response) {
      // Server responded with error status
      errorMessage = error.response.data?.error || `Server error: ${error.response.status}`;
    } else if (error.request) {
      // Request was made but no response received
      errorMessage = 'Network error: No response from server';
    } else if (error.message) {
      // Other error
      errorMessage = error.message;
    } else if (typeof error === 'string') {
      errorMessage = error;
    }
    
    setError({ message: errorMessage, context });
    showNotification(`Error: ${errorMessage}`, 'error');
    
    return errorMessage;
  };

  // Clear error
  const clearError = () => {
    setError(null);
  };

  // Fetch courses on component mount with better error handling
  useEffect(() => {
    fetchCourses();
  }, []);

  // Filter courses based on search term
  const filteredCourses = courses.filter(course => 
    course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // API call functions with improved error handling
  const fetchCourses = async () => {
    try {
      setLoading(true);
      clearError();
      
      const response = await fetch('/api/admin/onlineCourse/course');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setCourses(data.data);
      } else {
        throw new Error(data.error || 'Failed to fetch courses');
      }
    } catch (error) {
      handleError(error, 'fetching courses');
    } finally {
      setLoading(false);
    }
  };

  const fetchCourse = async (courseId) => {
    try {
      setLoading(true);
      clearError();
      
      const response = await fetch(`/api/admin/onlineCourse/course/${courseId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setSelectedCourse(data.data);
        setActiveTab('details');
      } else {
        throw new Error(data.error || 'Failed to fetch course details');
      }
    } catch (error) {
      handleError(error, 'fetching course');
    } finally {
      setLoading(false);
    }
  };

  // Upload image to Cloudinary with better error handling
  const uploadImage = async (file) => {
    try {
      setUploading(true);
      setUploadProgress(0);
      clearError();

      // Validate file
      if (!file.type.match('image.*')) {
        throw new Error('Please select an image file (JPEG, PNG, GIF)');
      }

      if (file.size > 5 * 1024 * 1024) {
        throw new Error('Image must be less than 5MB');
      }

      // 1) Get signed params from server
      console.log('Calling image sign-upload API...');
      const signRes = await fetch('/api/cloudinary/sign-upload', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ resource_type: 'image' })
      });
      
      console.log('Image sign-upload response status:', signRes.status);
      
      if (!signRes.ok) {
        console.log('Image sign-upload failed with status:', signRes.status);
        const errorText = await signRes.text();
        console.log('Image error response:', errorText);
        throw new Error('Failed to get upload signature');
      }
      
      const signData = await signRes.json();
      console.log('Image sign-upload response data:', signData);
      if (!signData.success) throw new Error(signData.error || 'Failed to get signature');

      const { timestamp, signature, apiKey, cloudName, folder } = signData.data;

      // 2) Upload directly to Cloudinary
      const form = new FormData();
      form.append('file', file);
      form.append('api_key', apiKey);
      form.append('timestamp', timestamp);
      form.append('signature', signature);
      form.append('folder', folder);
      form.append('resource_type', 'image');

      const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: form,
      });

      if (!uploadRes.ok) {
        throw new Error(`Cloudinary upload failed: ${uploadRes.status}`);
      }

      const data = await uploadRes.json();
      if (data.error) throw new Error(data.error.message || 'Cloudinary upload failed');
      
      setUploadProgress(100);
      return data.secure_url;
    } catch (error) {
      handleError(error, 'uploading image');
      throw error;
    } finally {
      setUploading(false);
    }
  };

  // Upload video to Cloudinary with progress tracking and better error handling
  const uploadVideo = async (file) => {
    try {
      setVideoUploading(true);
      setUploadProgress(0);
      clearError();

      // Validate file
      if (!file.type.match('video.*')) {
        throw new Error('Please select a video file (MP4, MOV, etc.)');
      }

      if (file.size > 100 * 1024 * 1024) {
        throw new Error('Video must be less than 100MB');
      }

      // 1) Get signed params from server
      console.log('Calling sign-upload API...');
      const signRes = await fetch('/api/cloudinary/sign-upload', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ resource_type: 'video' })
      });
      
      console.log('Sign-upload response status:', signRes.status);
      console.log('Sign-upload response headers:', signRes.headers);
      
      if (!signRes.ok) {
        console.log('Video sign-upload failed with status:', signRes.status);
        const errorText = await signRes.text();
        console.log('Video error response:', errorText);
        throw new Error('Failed to get upload signature');
      }
      
      const signData = await signRes.json();
      console.log('Video sign-upload response data:', signData);
      if (!signData.success) throw new Error(signData.error || 'Failed to get signature');

      const { timestamp, signature, apiKey, cloudName, folder } = signData.data;

      // 2) Upload directly to Cloudinary with progress tracking
      const form = new FormData();
      form.append('file', file);
      form.append('api_key', apiKey);
      form.append('timestamp', timestamp);
      form.append('signature', signature);
      form.append('folder', folder);
      form.append('resource_type', 'video');

      const xhr = new XMLHttpRequest();
      
      return new Promise((resolve, reject) => {
        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable) {
            const percentComplete = (event.loaded / event.total) * 100;
            setUploadProgress(Math.round(percentComplete));
          }
        });

        xhr.addEventListener('load', () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            const data = JSON.parse(xhr.responseText);
            if (data.error) {
              reject(new Error(data.error.message || 'Cloudinary upload failed'));
            } else {
              resolve({
                publicId: data.public_id,
                duration: Math.round(data.duration),
                secureUrl: data.secure_url
              });
            }
          } else {
            reject(new Error(`Upload failed with status ${xhr.status}`));
          }
        });

        xhr.addEventListener('error', () => {
          reject(new Error('Network error during upload'));
        });

        xhr.addEventListener('abort', () => {
          reject(new Error('Upload was cancelled'));
        });

        xhr.open('POST', `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`);
        xhr.send(form);
      });
    } catch (error) {
      handleError(error, 'uploading video');
      throw error;
    } finally {
      setVideoUploading(false);
    }
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      clearError();
      
      const response = await fetch('/api/admin/onlineCourse/course', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      if (data.success) {
        setCourses([...courses, data.data]);
        setIsAddingCourse(false);
        setFormData({ courseId: '', name: '', description: '', titlePhotoUrl: '' });
        showNotification('Course created successfully!');
        fetchCourses(); // Refresh the list
      } else {
        throw new Error(data.error || 'Failed to create course');
      }
    } catch (error) {
      handleError(error, 'creating course');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCourse = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      clearError();
      
      const response = await fetch(`/api/admin/onlineCourse/course/${editingCourse.courseId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      if (data.success) {
        setCourses(courses.map(course => 
          course.courseId === editingCourse.courseId ? data.data : course
        ));
        setEditingCourse(null);
        setFormData({ courseId: '', name: '', description: '', titlePhotoUrl: '' });
        showNotification('Course updated successfully!');
        fetchCourses(); // Refresh the list
      } else {
        throw new Error(data.error || 'Failed to update course');
      }
    } catch (error) {
      handleError(error, 'updating course');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCourse = async (courseId) => {
    if (!confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
      return;
    }
    
    try {
      setLoading(true);
      clearError();
      
      const response = await fetch(`/api/admin/onlineCourse/course/${courseId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      if (data.success) {
        setCourses(courses.filter(course => course.courseId !== courseId));
        if (selectedCourse && selectedCourse.courseId === courseId) {
          setSelectedCourse(null);
        }
        showNotification('Course deleted successfully!');
      } else {
        throw new Error(data.error || 'Failed to delete course');
      }
    } catch (error) {
      handleError(error, 'deleting course');
    } finally {
      setLoading(false);
    }
  };

  const handleAddVideo = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      clearError();
      
      // Validate required fields
      if (!videoFormData.title.trim()) {
        throw new Error('Video title is required');
      }
      
      // If we have a video file to upload
      if (videoFormData.videoFile) {
        const uploadResult = await uploadVideo(videoFormData.videoFile);
        videoFormData.cloudinaryPublicId = uploadResult.publicId;
        videoFormData.duration = uploadResult.duration;
        videoFormData.secureUrl = uploadResult.secureUrl;
      } else if (!videoFormData.cloudinaryPublicId) {
        throw new Error('Please select a video file to upload');
      }
      
      // Get the current videos to determine the next order
      const courseResponse = await fetch(`/api/admin/onlineCourse/course/${selectedCourse.courseId}`);
      
      if (!courseResponse.ok) {
        throw new Error(`HTTP error! status: ${courseResponse.status}`);
      }
      
      const courseData = await courseResponse.json();
      
      if (!courseData.success) throw new Error('Failed to fetch course data');
      
      const currentVideos = courseData.data.videos || [];
      const nextOrder = currentVideos.length;
      
      // Add the video with the correct order
      const videoData = {
        ...videoFormData,
        order: nextOrder
      };
      
      // Remove the file object before sending to API
      delete videoData.videoFile;
      
      console.log('Sending video data to API:', videoData);
      console.log('API URL:', `/api/admin/onlineCourse/course/${selectedCourse.courseId}/video`);
      
      const response = await fetch(`/api/admin/onlineCourse/course/${selectedCourse.courseId}/video`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(videoData),
      });
      
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      if (data.success) {
        // Refresh the course data to get the updated videos
        await fetchCourse(selectedCourse.courseId);
        setIsAddingVideo(false);
        setVideoFormData({
          title: '',
          description: '',
          cloudinaryPublicId: '',
          secureUrl: '',
          duration: 0,
          order: 0,
          watermarkTemplate: '',
          videoFile: null
        });
        showNotification('Video added successfully!');
      } else {
        throw new Error(data.error || 'Failed to add video');
      }
    } catch (error) {
      handleError(error, 'adding video');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateVideo = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      clearError();
      
      // Validate required fields
      if (!videoFormData.title.trim()) {
        throw new Error('Video title is required');
      }
      
      // If we have a new video file to upload
      if (videoFormData.videoFile) {
        const uploadResult = await uploadVideo(videoFormData.videoFile);
        videoFormData.cloudinaryPublicId = uploadResult.publicId;
        videoFormData.duration = uploadResult.duration;
        videoFormData.secureUrl = uploadResult.secureUrl;
      }
      
      // Create a copy without the file object
      const videoData = {...videoFormData};
      delete videoData.videoFile;
      
      const response = await fetch(`/api/admin/onlineCourse/course/${selectedCourse.courseId}/video/${editingVideo.index}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(videoData),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      if (data.success) {
        // Refresh the course data to get the updated videos
        await fetchCourse(selectedCourse.courseId);
        setEditingVideo(null);
        setVideoFormData({
          title: '',
          description: '',
          cloudinaryPublicId: '',
          secureUrl: '',
          duration: 0,
          order: 0,
          watermarkTemplate: '',
          videoFile: null
        });
        showNotification('Video updated successfully!');
      } else {
        throw new Error(data.error || 'Failed to update video');
      }
    } catch (error) {
      handleError(error, 'updating video');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteVideo = async (index) => {
    if (!confirm('Are you sure you want to delete this video?')) {
      return;
    }
    
    try {
      setLoading(true);
      clearError();
      
      const response = await fetch(`/api/admin/onlineCourse/course/${selectedCourse.courseId}/video/${index}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      if (data.success) {
        // Refresh the course data to get the updated videos
        await fetchCourse(selectedCourse.courseId);
        showNotification('Video deleted successfully!');
      } else {
        throw new Error(data.error || 'Failed to delete video');
      }
    } catch (error) {
      handleError(error, 'deleting video');
    } finally {
      setLoading(false);
    }
  };

  // Handle image file upload with better error handling
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    try {
      const imageUrl = await uploadImage(file);
      setFormData({ ...formData, titlePhotoUrl: imageUrl });
      showNotification('Image uploaded successfully!');
    } catch (error) {
      // Error is already handled in uploadImage
    }
  };

  // Handle video file upload with better error handling
  const handleVideoFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    try {
      // Check if file is a video
      if (!file.type.match('video.*')) {
        throw new Error('Please select a video file');
      }
      
      // Check file size (max 100MB)
      if (file.size > 100 * 1024 * 1024) {
        throw new Error('Video must be less than 100MB');
      }
      
      setVideoFormData({ ...videoFormData, videoFile: file });
      
      // Generate a preview of the video
      const videoURL = URL.createObjectURL(file);
      const videoElement = document.createElement('video');
      videoElement.src = videoURL;
      videoElement.onloadedmetadata = () => {
        setVideoFormData(prev => ({
          ...prev,
          title: file.name.replace(/\.[^/.]+$/, ""), // Set title from filename
          duration: Math.round(videoElement.duration)
        }));
      };
    } catch (error) {
      handleError(error, 'selecting video file');
    }
  };

  // Helper functions (unchanged)
  const startEditCourse = (course) => {
    setEditingCourse(course);
    setFormData({
      courseId: course.courseId,
      name: course.name,
      description: course.description || '',
      titlePhotoUrl: course.titlePhotoUrl || ''
    });
    setActiveTab('edit');
  };

  const startEditVideo = (video, index) => {
    setEditingVideo({ video, index });
    setVideoFormData({
      title: video.title,
      description: video.description || '',
      cloudinaryPublicId: video.cloudinaryPublicId,
      secureUrl: video.secureUrl || '',
      duration: video.duration || 0,
      order: video.order || 0,
      watermarkTemplate: video.watermarkTemplate || '',
      videoFile: null
    });
  };

  const cancelEdit = () => {
    setEditingCourse(null);
    setEditingVideo(null);
    setIsAddingCourse(false);
    setIsAddingVideo(false);
    setFormData({ courseId: '', name: '', description: '', titlePhotoUrl: '' });
    setVideoFormData({
      title: '',
      description: '',
      cloudinaryPublicId: '',
      secureUrl: '',
      duration: 0,
      order: 0,
      watermarkTemplate: '',
      videoFile: null
    });
    setActiveTab(selectedCourse ? 'details' : 'courses');
    clearError();
  };

  // Video reordering functions with better error handling
  const handleVideoReorder = async (fromIndex, toIndex) => {
    if (fromIndex === toIndex) return;
    
    try {
      setLoading(true);
      clearError();
      
      // Create a copy of videos array
      const updatedVideos = [...selectedCourse.videos];
      
      // Remove video from original position
      const [movedVideo] = updatedVideos.splice(fromIndex, 1);
      
      // Insert at new position
      updatedVideos.splice(toIndex, 0, movedVideo);
      
      // Update order numbers
      updatedVideos.forEach((video, index) => {
        video.order = index;
      });
      
      // Update the course with new video order
      const response = await fetch(`/api/admin/onlineCourse/course/${selectedCourse.courseId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...selectedCourse,
          videos: updatedVideos
        }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      if (data.success) {
        setSelectedCourse(data.data);
        showNotification('Video order updated successfully!');
      } else {
        throw new Error(data.error || 'Failed to update video order');
      }
    } catch (error) {
      handleError(error, 'reordering videos');
    } finally {
      setLoading(false);
      setIsReordering(false);
      setDragIndex(null);
      setDropIndex(null);
    }
  };

  const handleDragStart = (e, index) => {
    setDragIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.target.outerHTML);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDropIndex(index);
  };

  const handleDrop = (e, index) => {
    e.preventDefault();
    if (dragIndex !== null && dragIndex !== index) {
      handleVideoReorder(dragIndex, index);
    }
  };

  const handleDragEnd = () => {
    setDragIndex(null);
    setDropIndex(null);
  };

  // Keyboard navigation for reordering
  const handleKeyDown = (e, index) => {
    if (!isReordering) return;
    
    if (e.key === 'ArrowUp' && index > 0) {
      e.preventDefault();
      handleVideoReorder(index, index - 1);
    } else if (e.key === 'ArrowDown' && index < selectedCourse.videos.length - 1) {
      e.preventDefault();
      handleVideoReorder(index, index + 1);
    }
  };

  // Bulk video operations with better error handling
  const handleBulkDelete = async () => {
    if (!confirm(`Are you sure you want to delete ${selectedVideos.length} selected videos?`)) {
      return;
    }
    
    try {
      setLoading(true);
      clearError();
      let successCount = 0;
      let errors = [];
      
      for (const videoIndex of selectedVideos) {
        try {
          const response = await fetch(`/api/admin/onlineCourse/course/${selectedCourse.courseId}/video/${videoIndex}`, {
            method: 'DELETE',
          });
          
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          
          const data = await response.json();
          if (data.success) {
            successCount++;
          } else {
            throw new Error(data.error || 'Failed to delete video');
          }
        } catch (error) {
          errors.push(`Video ${videoIndex + 1}: ${error.message}`);
        }
      }
      
      if (successCount > 0) {
        await fetchCourse(selectedCourse.courseId);
        setSelectedVideos([]);
        
        if (errors.length > 0) {
          showNotification(`${successCount} videos deleted, but ${errors.length} failed. Check console for details.`, 'warning');
          console.error('Bulk delete errors:', errors);
        } else {
          showNotification(`${successCount} videos deleted successfully!`);
        }
      } else if (errors.length > 0) {
        throw new Error(`All deletions failed: ${errors.join('; ')}`);
      }
    } catch (error) {
      handleError(error, 'bulk delete operation');
    } finally {
      setLoading(false);
    }
  };

  const toggleVideoSelection = (index) => {
    setSelectedVideos(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const selectAllVideos = () => {
    if (selectedCourse && selectedCourse.videos) {
      setSelectedVideos(selectedCourse.videos.map((_, index) => index));
    }
  };

  const clearVideoSelection = () => {
    setSelectedVideos([]);
  };

  // Format duration for display
  const formatDuration = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Render function with improved UI
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Notification */}
      <AnimatePresence>
        {notification.show && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg ${
              notification.type === 'error' ? 'bg-red-500' : 
              notification.type === 'warning' ? 'bg-yellow-500' : 'bg-green-500'
            } text-white max-w-md`}
          >
            <div className="flex items-center">
              {notification.type === 'error' ? (
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              ) : notification.type === 'warning' ? (
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                </svg>
              ) : (
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              )}
              <span>{notification.message}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Display */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r-lg"
          >
            <div className="flex justify-between items-start">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-red-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <div>
                  <h3 className="text-red-800 font-medium">Error in {error.context}</h3>
                  <p className="text-red-700 text-sm mt-1">{error.message}</p>
                </div>
              </div>
              <button
                onClick={clearError}
                className="text-red-500 hover:text-red-700"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Video Preview Modal */}
      <AnimatePresence>
        {videoPreview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-blur bg-opacity-40 backdrop-blur-sm"
            onClick={() => setVideoPreview(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center p-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800">{videoPreview.title}</h3>
                <button
                  onClick={() => setVideoPreview(null)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
              
                                <div className="p-4">
                    <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden mb-4">
                      {console.log('Rendering video preview with:', videoPreview)}
                      {console.log('Video src URL:', videoPreview.secureUrl || `https://res.cloudinary.com/dyigmfiar/video/upload/${videoPreview.cloudinaryPublicId}.mp4`)}
                      
                      {/* Debug info */}
                      <div className="mb-2 p-2 bg-gray-100 rounded text-xs">
                        <p><strong>Debug Info:</strong></p>
                        <p>secureUrl: {videoPreview.secureUrl || 'Not set'}</p>
                        <p>cloudinaryPublicId: {videoPreview.cloudinaryPublicId}</p>
                        <p>Final URL: {videoPreview.secureUrl || `https://res.cloudinary.com/dyigmfiar/video/upload/${videoPreview.cloudinaryPublicId}.mp4`}</p>
                      </div>
                      
                      <video
                        controls
                        className="w-full h-full"
                        src={videoPreview.secureUrl || `https://res.cloudinary.com/dyigmfiar/video/upload/${videoPreview.cloudinaryPublicId}.mp4`}
                        poster={`https://res.cloudinary.com/dyigmfiar/video/upload/f_jpg,q_auto/${videoPreview.cloudinaryPublicId}.jpg`}
                      >
                        Your browser does not support the video tag.
                      </video>
                    </div>
                
                <div className="space-y-3">
                  {videoPreview.description && (
                    <div>
                      <h4 className="font-medium text-gray-700 mb-1">Description</h4>
                      <p className="text-gray-600 text-sm">{videoPreview.description}</p>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-gray-700 mb-1">Duration</h4>
                      <p className="text-gray-600 text-sm">{formatDuration(videoPreview.duration)}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-700 mb-1">Order</h4>
                      <p className="text-gray-600 text-sm">{videoPreview.order}</p>
                    </div>
                    {videoPreview.watermarkTemplate && (
                      <div className="col-span-2">
                        <h4 className="font-medium text-gray-700 mb-1">Watermark Template</h4>
                        <p className="text-gray-600 text-sm font-mono bg-gray-100 p-2 rounded">{videoPreview.watermarkTemplate}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto">
        <motion.h1 
          className="text-2xl md:text-3xl font-bold text-blue-500 mb-6 flex items-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <svg className="w-6 h-6 md:w-8 md:h-8 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
          </svg>
          Course Management Dashboard
        </motion.h1>

        {/* Global Loading Overlay */}
        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-blur bg-opacity-50 z-50 flex items-center justify-center"
            >
              <div className="bg-white rounded-xl p-6 shadow-xl flex flex-col items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
                <p className="text-gray-700">Processing your request...</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Upload Progress Bar */}
        <AnimatePresence>
          {(uploading || videoUploading) && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="fixed top-0 left-0 right-0 bg-blue-100 z-50 shadow-md"
            >
              <div className="container mx-auto px-4 py-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="text-blue-800 font-medium">
                      {uploading ? 'Uploading Image...' : 'Uploading Video...'}
                    </span>
                  </div>
                  <span className="text-blue-800 font-bold">{uploadProgress}%</span>
                </div>
                <div className="w-full bg-blue-200 rounded-full h-2 mt-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main content */}
        {!loading && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Course list sidebar */}
            <motion.div 
              className="bg-white rounded-xl shadow-md p-4 lg:col-span-1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg md:text-xl font-semibold text-gray-700">Courses</h2>
                <button
                  onClick={() => {
                    setIsAddingCourse(true);
                    setActiveTab('add');
                  }}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg transition-colors flex items-center text-sm"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                  </svg>
                  Add Course
                </button>
              </div>

              {/* Search bar */}
              <div className="mb-4 relative">
                <input
                  type="text"
                  placeholder="Search courses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full p-2 pl-9 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
                <svg className="w-4 h-4 absolute left-2.5 top-2.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>

              <div className="space-y-3 max-h-[calc(100vh-250px)] overflow-y-auto">
                {filteredCourses.map((course) => (
                  <motion.div
                    key={course._id}
                    className={`p-3 rounded-lg cursor-pointer transition-all ${
                      selectedCourse && selectedCourse._id === course._id
                        ? 'bg-blue-100 border border-blue-300'
                        : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
                    }`}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => fetchCourse(course.courseId)}
                  >
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium text-gray-800 truncate text-sm">{course.name}</h3>
                      <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                        {course.videos ? course.videos.length : 0}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 truncate mt-1">{course.description}</p>
                    <div className="flex justify-end space-x-2 mt-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          startEditCourse(course);
                        }}
                        className="text-blue-500 hover:text-blue-700 text-sm p-1 rounded hover:bg-blue-50"
                        title="Edit course"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                        </svg>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteCourse(course.courseId);
                        }}
                        className="text-red-500 hover:text-red-700 text-sm p-1 rounded hover:bg-red-50"
                        title="Delete course"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                      </button>
                    </div>
                  </motion.div>
                ))}
                
                {filteredCourses.length === 0 && (
                  <div className="text-center py-6">
                    <svg className="w-12 h-12 mx-auto text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <p className="text-gray-500 text-sm">
                      {searchTerm ? 'No courses match your search' : 'No courses found. Add your first course!'}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Main content area */}
            <div className="lg:col-span-3 space-y-6">
              {/* Tabs for different views */}
              <div className="bg-white rounded-xl shadow-md p-4">
                <div className="border-b border-gray-200">
                  <nav className="flex -mb-px overflow-x-auto">
                    <button
                      onClick={() => setActiveTab('courses')}
                      className={`mr-4 md:mr-8 py-2 px-1 text-sm font-medium border-b-2 whitespace-nowrap ${
                        activeTab === 'courses'
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      All Courses
                    </button>
                    {selectedCourse && (
                      <>
                        <button
                          onClick={() => setActiveTab('details')}
                          className={`mr-4 md:mr-8 py-2 px-1 text-sm font-medium border-b-2 whitespace-nowrap ${
                            activeTab === 'details'
                              ? 'border-blue-500 text-blue-600'
                              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                          }`}
                        >
                          Course Details
                        </button>
                        <button
                          onClick={() => setActiveTab('videos')}
                          className={`mr-4 md:mr-8 py-2 px-1 text-sm font-medium border-b-2 whitespace-nowrap ${
                            activeTab === 'videos'
                              ? 'border-blue-500 text-blue-600'
                              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                          }`}
                        >
                          Videos
                        </button>
                      </>
                    )}
                    {(isAddingCourse || editingCourse) && (
                      <button
                        onClick={() => setActiveTab('edit')}
                        className={`mr-4 md:mr-8 py-2 px-1 text-sm font-medium border-b-2 whitespace-nowrap ${
                          activeTab === 'edit'
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        {editingCourse ? 'Edit Course' : 'Add Course'}
                      </button>
                    )}
                  </nav>
                </div>
              </div>

              {/* Course form (add/edit) */}
              <AnimatePresence>
                {(activeTab === 'add' || activeTab === 'edit') && (
                  <motion.div
                    className="bg-white rounded-xl shadow-md p-4 md:p-6"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-4 md:mb-6 flex items-center">
                      <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                      </svg>
                      {editingCourse ? 'Edit Course' : 'Add New Course'}
                    </h2>
                    <form onSubmit={editingCourse ? handleUpdateCourse : handleCreateCourse}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Course Name
                          </label>
                          <select
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full p-2 md:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                          >
                            <option value="">Select a course</option>
                            <option value="VN video editing">VN video editing</option>
                            <option value="AI and ChatGPT">AI and ChatGPT</option>
                            <option value="MS Excel Course">MS Excel Course</option>
                            <option value="Canva Course">Canva Course</option>
                            <option value="HTML Course">HTML Course</option>
                          </select>
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Description
                          </label>
                          <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full p-2 md:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                            rows="3"
                            placeholder="Describe what students will learn in this course..."
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Title Photo
                          </label>
                          <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
                            <div className="relative flex-1">
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                id="file-upload"
                              />
                              <label
                                htmlFor="file-upload"
                                className="block w-full p-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-white text-center hover:border-blue-500 transition-colors"
                              >
                                <svg className="w-6 h-6 mx-auto text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                </svg>
                                <span className="text-sm font-medium text-blue-600">
                                  {uploading ? 'Uploading...' : 'Click to upload'}
                                </span>
                                <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 5MB</p>
                              </label>
                            </div>
                            {formData.titlePhotoUrl && (
                              <div className="w-24 h-24 border rounded-lg overflow-hidden shadow-md">
                                <img 
                                  src={formData.titlePhotoUrl} 
                                  alt="Course preview" 
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-3 mt-6 pt-6 border-t border-gray-200">
                        <button
                          type="submit"
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg transition-colors flex items-center justify-center"
                          disabled={uploading}
                        >
                          {uploading ? (
                            <>
                              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Uploading...
                            </>
                          ) : (
                            <>
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                              </svg>
                              {editingCourse ? 'Update Course' : 'Create Course'}
                            </>
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={cancelEdit}
                          className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2.5 rounded-lg transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Selected course details */}
              {selectedCourse && activeTab === 'details' && (
                <motion.div 
                  className="bg-white rounded-xl shadow-md p-4 md:p-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-6">
                    <div className="flex-1">
                      <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">{selectedCourse.name}</h2>
                      <p className="text-gray-600 mb-4 text-sm md:text-base">{selectedCourse.description}</p>
                      <div className="flex flex-wrap gap-2">
                        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                          {selectedCourse.videos ? selectedCourse.videos.length : 0} videos
                        </span>
                        
                        <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                          Created: {new Date(selectedCourse.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-2 mt-4 md:mt-0">
                      <button
                        onClick={() => startEditCourse(selectedCourse)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg transition-colors flex items-center text-sm"
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                        </svg>
                        Edit Course
                      </button>
                      <button
                        onClick={() => {
                          setSelectedCourse(null);
                          setActiveTab('courses');
                        }}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-2 rounded-lg transition-colors text-sm"
                      >
                        Close
                      </button>
                    </div>
                  </div>

                  {selectedCourse.titlePhotoUrl && (
                    <div className="mb-6 rounded-xl overflow-hidden shadow-md">
                      <img 
                        src={selectedCourse.titlePhotoUrl} 
                        alt={selectedCourse.name}
                        className="w-full h-48 md:h-64 object-cover"
                      />
                    </div>
                  )}

                  <div className="border-t border-gray-200 pt-6">
                    {/* Video Statistics */}
                    {selectedCourse.videos && selectedCourse.videos.length > 0 && (
                      <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                          <div className="flex items-center">
                            <div className="p-2 bg-blue-100 rounded-lg">
                              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                              </svg>
                            </div>
                            <div className="ml-3">
                              <p className="text-sm font-medium text-blue-600">Total Videos</p>
                              <p className="text-2xl font-bold text-blue-900">{selectedCourse.videos.length}</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                          <div className="flex items-center">
                            <div className="p-2 bg-green-100 rounded-lg">
                              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                              </svg>
                            </div>
                            <div className="ml-3">
                              <p className="text-sm font-medium text-green-600">Total Duration</p>
                              <p className="text-2xl font-bold text-green-900">
                                {formatDuration(selectedCourse.videos.reduce((total, video) => total + (video.duration || 0), 0))}
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                          <div className="flex items-center">
                            <div className="p-2 bg-purple-100 rounded-lg">
                              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                              </svg>
                            </div>
                            <div className="ml-3">
                              <p className="text-sm font-medium text-purple-600">With Watermarks</p>
                              <p className="text-2xl font-bold text-purple-900">
                                {selectedCourse.videos.filter(video => video.watermarkTemplate).length}
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                          <div className="flex items-center">
                            <div className="p-2 bg-orange-100 rounded-lg">
                              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                              </svg>
                            </div>
                            <div className="ml-3">
                              <p className="text-sm font-medium text-orange-600">Avg Duration</p>
                              <p className="text-2xl font-bold text-orange-900">
                                {formatDuration(Math.round(selectedCourse.videos.reduce((total, video) => total + (video.duration || 0), 0) / selectedCourse.videos.length))}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
                      <h3 className="text-lg md:text-xl font-semibold text-gray-800 flex items-center mb-3 md:mb-0">
                        <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                        </svg>
                        Course Videos
                      </h3>
                      <div className="flex space-x-2">
                        {selectedCourse.videos && selectedCourse.videos.length > 1 && (
                          <button
                            onClick={() => setIsReordering(!isReordering)}
                            className={`px-3 py-2 rounded-lg transition-colors flex items-center text-sm ${
                              isReordering 
                                ? 'bg-orange-600 hover:bg-orange-700 text-white' 
                                : 'bg-gray-500 hover:bg-gray-600 text-white'
                            }`}
                          >
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8h16M4 16h16"></path>
                            </svg>
                            {isReordering ? 'Done Reordering' : 'Reorder Videos'}
                          </button>
                        )}
                        {selectedVideos.length > 0 && (
                          <>
                            <button
                              onClick={handleBulkDelete}
                              className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg transition-colors flex items-center text-sm"
                            >
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                              </svg>
                              Delete Selected ({selectedVideos.length})
                            </button>
                            <button
                              onClick={clearVideoSelection}
                              className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-2 rounded-lg transition-colors text-sm"
                            >
                              Clear Selection
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => {
                            setIsAddingVideo(true);
                            setActiveTab('videos');
                          }}
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg transition-colors flex items-center text-sm"
                        >
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                          </svg>
                          Add Video
                        </button>
                      </div>
                    </div>

                    {/* Reordering Mode Banner */}
                    {isReordering && (
                      <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            {loading ? (
                              <svg className="w-5 h-5 text-blue-600 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                              </svg>
                            ) : (
                              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8h16M4 16h16"></path>
                              </svg>
                            )}
                            <span className="text-sm font-medium text-blue-800">
                              {loading ? 'Updating Video Order...' : 'Reordering Mode Active'}
                            </span>
                            <span className="text-xs text-blue-600">
                              {loading ? 'Please wait...' : 'Drag and drop videos to reorder them. Use arrow keys for keyboard navigation.'}
                            </span>
                          </div>
                          <button
                            onClick={() => {
                              if (dragIndex !== null || dropIndex !== null) {
                                if (confirm('You have unsaved reordering changes. Are you sure you want to exit?')) {
                                  setIsReordering(false);
                                  setDragIndex(null);
                                  setDropIndex(null);
                                }
                              } else {
                                setIsReordering(false);
                              }
                            }}
                            disabled={loading}
                            className={`text-blue-600 hover:text-blue-800 text-sm font-medium ${
                              loading ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                          >
                            {loading ? 'Updating...' : 'Exit Reordering'}
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Bulk selection controls */}
                    {selectedCourse.videos && selectedCourse.videos.length > 0 && (
                      <div className="mb-4 flex items-center space-x-4 p-3 bg-gray-50 rounded-lg border">
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={selectedVideos.length === selectedCourse.videos.length}
                            onChange={(e) => e.target.checked ? selectAllVideos() : clearVideoSelection()}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700">
                            {selectedVideos.length === selectedCourse.videos.length ? 'Deselect All' : 'Select All'}
                          </span>
                        </div>
                        {selectedVideos.length > 0 && (
                          <span className="text-sm text-gray-600">
                            {selectedVideos.length} of {selectedCourse.videos.length} videos selected
                          </span>
                        )}
                      </div>
                    )}

                    {/* Videos list */}
                    <div className="grid grid-cols-1 gap-4">
                      {selectedCourse.videos && selectedCourse.videos.length > 0 ? (
                        [...selectedCourse.videos]
                          .sort((a, b) => (a.order || 0) - (b.order || 0))
                          .map((video, index) => (
                            <motion.div
                              key={index}
                              className={`bg-gray-50 p-4 rounded-lg border transition-colors ${
                                selectedVideos.includes(index) 
                                  ? 'border-blue-300 bg-blue-50' 
                                  : 'border-gray-200 hover:border-blue-300'
                              } ${isReordering ? 'cursor-move' : ''} ${
                                dragIndex === index ? 'opacity-50 scale-95' : ''
                              } ${
                                dropIndex === index && dragIndex !== null ? 'border-2 border-dashed border-blue-400 bg-blue-50' : ''
                              } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 0.3, delay: index * 0.1 }}
                              draggable={isReordering}
                              onDragStart={(e) => handleDragStart(e, index)}
                              onDragOver={(e) => handleDragOver(e, index)}
                              onDrop={(e) => handleDrop(e, index)}
                              onDragEnd={handleDragEnd}
                              onKeyDown={(e) => handleKeyDown(e, index)}
                              tabIndex={isReordering ? 0 : -1}
                            >
                              <div className="flex justify-between items-start">
                                <div className="flex-1">
                                  <div className="flex items-start">
                                    <div className="flex items-center space-x-2 mr-3">
                                      {isReordering && (
                                        <div className="text-gray-400 hover:text-gray-600 cursor-move">
                                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8h16M4 16h16"></path>
                                          </svg>
                                        </div>
                                      )}
                                      <input
                                        type="checkbox"
                                        checked={selectedVideos.includes(index)}
                                        onChange={() => toggleVideoSelection(index)}
                                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                      />
                                      <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded">
                                        {index + 1}
                                      </span>
                                    </div>
                                    <div className="flex-1">
                                      <h4 className="font-medium text-gray-800 text-sm md:text-base">{video.title}</h4>
                                      {video.description && (
                                        <p className="text-sm text-gray-600 mt-1">{video.description}</p>
                                      )}
                                      <div className="flex flex-wrap gap-2 mt-2">
                                        <span className="text-xs bg-gray-200 text-gray-800 px-2 py-1 rounded">
                                          Duration: {formatDuration(video.duration)}
                                        </span>
                                        <span className="text-xs bg-gray-200 text-gray-800 px-2 py-1 rounded">
                                          Order: {video.order}
                                        </span>
                                        {video.watermarkTemplate && (
                                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                            Watermark: {video.watermarkTemplate}
                                          </span>
                                        )}
                                      </div>
                                      <p className="text-xs text-gray-500 mt-2 truncate">
                                        Public ID: {video.cloudinaryPublicId}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex space-x-2 ml-4">
                                  <button
                                    onClick={() => {
                                      console.log('Preview button clicked for video:', video);
                                      console.log('Video secureUrl:', video.secureUrl);
                                      console.log('Video cloudinaryPublicId:', video.cloudinaryPublicId);
                                      
                                      // Ensure the video has the correct secureUrl
                                      const videoWithCorrectUrl = {
                                        ...video,
                                        secureUrl: video.secureUrl || `https://res.cloudinary.com/dyigmfiar/video/upload/${video.cloudinaryPublicId}.mp4`
                                      };
                                      
                                      setVideoPreview(videoWithCorrectUrl);
                                      setVideoFormData({
                                        title: video.title,
                                        description: video.description || '',
                                        cloudinaryPublicId: video.cloudinaryPublicId,
                                        duration: video.duration || 0,
                                        order: video.order || 0,
                                        watermarkTemplate: video.watermarkTemplate || '',
                                        videoFile: null
                                      });
                                    }}
                                    className="text-green-500 hover:text-green-700 p-1.5 rounded-md hover:bg-green-50 transition-colors"
                                    title="Preview video"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                                    </svg>
                                  </button>
                                  <button
                                    onClick={() => startEditVideo(video, index)}
                                    className="text-blue-500 hover:text-blue-700 p-1.5 rounded-md hover:bg-blue-50 transition-colors"
                                    title="Edit video"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                                    </svg>
                                  </button>
                                  <button
                                    onClick={() => handleDeleteVideo(index)}
                                    className="text-red-500 hover:text-red-700 p-1.5 rounded-md hover:bg-red-50 transition-colors"
                                    title="Delete video"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                    </svg>
                                  </button>
                                </div>
                              </div>
                            </motion.div>
                          ))
                      ) : (
                        <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                          <svg className="w-12 h-12 mx-auto text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                          </svg>
                          <h4 className="text-lg font-medium text-gray-600 mb-1">No videos yet</h4>
                          <p className="text-gray-500">Add your first video to get started</p>
                          <button
                            onClick={() => {
                              setIsAddingVideo(true);
                              setActiveTab('videos');
                            }}
                            className="mt-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors inline-flex items-center text-sm"
                          >
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                            </svg>
                            Add Video
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Video form (add/edit) */}
              {activeTab === 'videos' && (isAddingVideo || editingVideo) && (
                <motion.div
                  className="bg-white rounded-xl shadow-md p-4 md:p-6"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-4 md:mb-6 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                    </svg>
                    {editingVideo ? 'Edit Video' : 'Add New Video'}
                  </h3>
                  <form onSubmit={editingVideo ? handleUpdateVideo : handleAddVideo}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Upload Video
                        </label>
                        <div className="relative">
                          <input
                            type="file"
                            accept="video/*"
                            onChange={handleVideoFileSelect}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            id="video-upload"
                          />
                          <label
                            htmlFor="video-upload"
                            className="block w-full p-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-white hover:border-blue-500 transition-colors"
                          >
                            <div className="flex flex-col items-center justify-center text-center">
                              <svg className="w-8 h-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                              </svg>
                              <span className="text-sm font-medium text-blue-600">
                                {videoUploading ? 'Uploading...' : 'Click to select a video'}
                              </span>
                              <p className="text-xs text-gray-500 mt-1">MP4, MOV up to 100MB</p>
                            </div>
                          </label>
                        </div>
                        {videoFormData.videoFile && (
                          <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                            <p className="text-sm text-green-800 flex items-center">
                              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                              </svg>
                              Selected: {videoFormData.videoFile.name} ({Math.round(videoFormData.videoFile.size / 1024 / 1024)}MB)
                            </p>
                            <p className="text-xs text-green-600 mt-1">
                              Duration: {formatDuration(videoFormData.duration)}
                            </p>
                          </div>
                        )}
                        {videoUploading && (
                          <div className="mt-3">
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-sm text-blue-600">Upload Progress</span>
                              <span className="text-sm font-medium text-blue-600">{uploadProgress}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                                style={{ width: `${uploadProgress}%` }}
                              ></div>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Video Title
                        </label>
                        <input
                          type="text"
                          required
                          value={videoFormData.title}
                          onChange={(e) => setVideoFormData({ ...videoFormData, title: e.target.value })}
                          className="w-full p-2 md:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                          placeholder="e.g., Introduction to Video Editing"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Duration (seconds)
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={videoFormData.duration}
                          onChange={(e) => setVideoFormData({ ...videoFormData, duration: parseInt(e.target.value) || 0 })}
                          className="w-full p-2 md:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          {videoFormData.duration ? `Formatted: ${formatDuration(videoFormData.duration)}` : 'Enter duration in seconds'}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Watermark Template
                        </label>
                        <input
                          type="text"
                          value={videoFormData.watermarkTemplate}
                          onChange={(e) => setVideoFormData({ ...videoFormData, watermarkTemplate: e.target.value })}
                          placeholder="e.g., {{userEmail}}"
                          className="w-full p-2 md:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        />
                        <p className="text-xs text-gray-500 mt-1">Use variables like {"{{userEmail}}"} for dynamic watermarks</p>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Description
                        </label>
                        <textarea
                          value={videoFormData.description}
                          onChange={(e) => setVideoFormData({ ...videoFormData, description: e.target.value })}
                          className="w-full p-2 md:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                          rows="3"
                          placeholder="Describe what this video covers..."
                        />
                      </div>
                    </div>
                    <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-3 mt-6 pt-6 border-t border-gray-200">
                      <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg transition-colors flex items-center justify-center"
                        disabled={videoUploading}
                      >
                        {videoUploading ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Uploading Video...
                          </>
                        ) : (
                          <>
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                            {editingVideo ? 'Update Video' : 'Add Video'}
                          </>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={cancelEdit}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2.5 rounded-lg transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}

              {/* Empty state when no course is selected */}
              {!selectedCourse && activeTab === 'courses' && !isAddingCourse && !editingCourse && (
                <motion.div 
                  className="bg-white rounded-xl shadow-md p-6 md:p-8 text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                  </svg>
                  <h3 className="text-lg font-medium text-gray-700 mb-2">No Course Selected</h3>
                  <p className="text-gray-500 mb-4">Select a course from the list to view and manage its content.</p>
                  <button
                    onClick={() => {
                      setIsAddingCourse(true);
                      setActiveTab('add');
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors inline-flex items-center text-sm"
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                    </svg>
                    Create Your First Course
                  </button>
                </motion.div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseManagement;