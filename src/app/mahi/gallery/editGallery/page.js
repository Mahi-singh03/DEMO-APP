'use client';

import { useState, useEffect, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';

export default function CloudinaryUploader() {
  const [photos, setPhotos] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Fetch existing photos on component mount
  useEffect(() => {
    fetchPhotos();
  }, []);

  const fetchPhotos = async () => {
    try {
      const res = await fetch('/api/gallery/getAllPhoto');
      if (!res.ok) throw new Error('Failed to fetch photos');
      const data = await res.json();
      setPhotos(data.photos || []);
    } catch (error) {
      console.error('Error fetching photos:', error);
      setError('Failed to load photos. Please try refreshing the page.');
    }
  };

  const onDrop = useCallback(async (acceptedFiles) => {
    if (acceptedFiles.length === 0) return;
    
    setIsUploading(true);
    setProgress(0);
    setError(null);
    setSuccess(null);

    const uploadedPhotos = [];
    const errors = [];
    
    for (const [index, file] of acceptedFiles.entries()) {
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await fetch('/api/admin/gallery/editGallery', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) throw new Error('Upload failed');

        const data = await response.json();
        uploadedPhotos.push({
          public_id: data.public_id,
          url: data.url,
        });
        
        // Calculate progress with a slight delay for smoother animation
        setTimeout(() => {
          setProgress(Math.round((index + 1) / acceptedFiles.length * 100));
        }, 100);
      } catch (error) {
        console.error('Upload error:', error);
        errors.push(file.name);
      }
    }

    if (uploadedPhotos.length > 0) {
      setPhotos(prev => [...uploadedPhotos, ...prev]);
      setSuccess(`Successfully uploaded ${uploadedPhotos.length} file(s)`);
      if (errors.length > 0) {
        setError(`Failed to upload ${errors.length} file(s): ${errors.join(', ')}`);
      }
    } else if (errors.length > 0) {
      setError('Failed to upload all files. Please try again.');
    }

    setIsUploading(false);
    setProgress(0);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxFiles: 10,
    maxSize: 10 * 1024 * 1024, // 10MB
    onDrop
  });

  const handleDelete = async (publicId) => {
    if (!publicId) return;
    
    try {
      setIsDeleting(true);
      setError(null);
      const response = await fetch('/api/admin/uploadPhotoAndDeletePhoto', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ public_id: publicId }),
      });
      
      if (!response.ok) throw new Error('Delete failed');
      
      setPhotos(prev => prev.filter(photo => photo.public_id !== publicId));
      setSuccess('Photo deleted successfully');
    } catch (error) {
      console.error('Delete error:', error);
      setError('Failed to delete photo. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  // Clear messages after 5 seconds
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError(null);
        setSuccess(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  return (
    <div className="min-h-screen bg-[#030712] py-8 px-4  sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 sm:mb-12 pt-5">
          <motion.h1 
            className="text-3xl font-extrabold text-white sm:text-4xl"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Cloudinary Photo Gallery
          </motion.h1>
          <motion.p 
            className="mt-3 text-lg sm:text-xl text-gray-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Upload and manage your photos in the cloud
          </motion.p>
        </div>

        {/* Status Messages */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-6 p-4 bg-red-900/50 border-l-4 border-red-500 text-red-100 rounded"
            >
              <p>{error}</p>
            </motion.div>
          )}
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-6 p-4 bg-green-900/50 border-l-4 border-green-500 text-green-100 rounded"
            >
              <p>{success}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Upload Zone */}
        <motion.div 
          {...getRootProps()}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className={`border-2 border-dashed rounded-xl p-6 sm:p-8 mb-8 sm:mb-12 text-center transition-all duration-300 ${
            isDragActive 
              ? 'border-indigo-500 bg-indigo-900/20 shadow-lg' 
              : 'border-gray-700 hover:border-indigo-400 hover:bg-gray-800/50 hover:shadow-md'
          }`}
        >
          <input {...getInputProps()} />
          <div className="space-y-3 sm:space-y-4">
            <motion.div
              animate={isDragActive ? { scale: 1.05 } : { scale: 1 }}
              transition={{ type: 'spring', stiffness: 500 }}
            >
              <svg
                className={`mx-auto h-10 w-10 sm:h-12 sm:w-12 ${
                  isDragActive ? 'text-indigo-400' : 'text-gray-500'
                }`}
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
                aria-hidden="true"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </motion.div>
            <div className="flex flex-col sm:flex-row justify-center items-center text-sm text-gray-400 gap-1">
              <button className="relative cursor-pointer rounded-md font-medium text-indigo-400 hover:text-indigo-300 focus-within:outline-none">
                <span>Upload files</span>
                <input type="file" className="sr-only" />
              </button>
              <p className="text-gray-400">or drag and drop</p>
            </div>
            <p className="text-xs text-gray-500">
              PNG, JPG, WEBP up to 10MB (max 10 files)
            </p>
          </div>
        </motion.div>

        {/* Progress Bar */}
        {isUploading && (
          <motion.div 
            className="mb-6 sm:mb-8"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-indigo-400">
                Uploading...
              </span>
              <span className="text-sm font-medium text-gray-400">
                {progress}%
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2.5 overflow-hidden">
              <motion.div
                className="bg-indigo-500 h-2.5 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
          </motion.div>
        )}

        {/* Photo Gallery */}
        {photos.length > 0 ? (
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <AnimatePresence>
              {photos.map((photo, index) => (
                <motion.div 
                  key={photo.public_id || index}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="relative group overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 bg-gray-800"
                >
                  <img
                    src={photo.url}
                    alt={`Uploaded content ${index}`}
                    className="w-full h-48 sm:h-56 object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3 sm:p-4">
                    <button
                      onClick={() => handleDelete(photo.public_id)}
                      disabled={isDeleting}
                      className="ml-auto bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm font-medium transition-colors duration-300 flex items-center"
                    >
                      {isDeleting ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Deleting...
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                          </svg>
                          Delete
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div 
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <svg
              className="mx-auto h-12 w-12 text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                vectorEffect="non-scaling-stroke"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-white">
              No photos uploaded yet
            </h3>
            <p className="mt-1 text-sm text-gray-400">
              Get started by uploading some images
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}