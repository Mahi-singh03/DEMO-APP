"use client";
import { useState, useEffect } from 'react';
import Head from 'next/head';

export default function Gallery() {
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);

  // Fetch images from Cloudinary
  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/photos');
      const data = await response.json();
      
      if (response.ok) {
        setImages(data.images || []);
      } else {
        setError(data.error || 'Failed to fetch images');
      }
    } catch (err) {
      setError('Failed to fetch images');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/gallery/getAllPhoto', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        // Refresh the gallery
        await fetchImages();
      } else {
        setError('Failed to upload image');
      }
    } catch (err) {
      setError('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteImage = async (publicId) => {
    if (!confirm('Are you sure you want to delete this image?')) return;

    try {
      const response = await fetch('/api/photos', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ public_id: publicId }),
      });

      if (response.ok) {
        // Remove the image from state
        setImages(images.filter(img => img.publicId !== publicId));
        if (selectedImage && selectedImage.publicId === publicId) {
          setSelectedImage(null);
        }
      } else {
        setError('Failed to delete image');
      }
    } catch (err) {
      setError('Failed to delete image');
    }
  };

  const navigateImage = (direction) => {
    if (!selectedImage) return;
    
    const currentIndex = images.findIndex(img => img.publicId === selectedImage.publicId);
    let newIndex;
    
    if (direction === 'next') {
      newIndex = (currentIndex + 1) % images.length;
    } else {
      newIndex = (currentIndex - 1 + images.length) % images.length;
    }
    
    setSelectedImage(images[newIndex]);
    setZoomLevel(1); // Reset zoom when navigating
  };

  const handleKeyDown = (e) => {
    if (!selectedImage) return;
    
    if (e.key === 'ArrowRight') {
      navigateImage('next');
    } else if (e.key === 'ArrowLeft') {
      navigateImage('prev');
    } else if (e.key === 'Escape') {
      setSelectedImage(null);
    } else if (e.key === '+') {
      setZoomLevel(prev => Math.min(prev + 0.25, 3));
    } else if (e.key === '-') {
      setZoomLevel(prev => Math.max(prev - 0.25, 0.5));
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedImage]);

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <Head>
        <title>Photo Gallery</title>
        <meta name="description" content="Responsive photo gallery with Cloudinary integration" />
      </Head>

      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">Photo Gallery</h1>
        
        {/* Upload Section */}
        <div className="mb-8 text-center">
          <label className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg cursor-pointer transition-all duration-300 transform hover:scale-105 inline-block">
            {uploading ? 'Uploading...' : 'Upload Image'}
            <input 
              type="file" 
              className="hidden" 
              accept="image/*" 
              onChange={handleImageUpload} 
              disabled={uploading}
            />
          </label>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-center">
            {error}
            <button 
              className="ml-2 text-red-900 font-bold"
              onClick={() => setError(null)}
            >
              ×
            </button>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}

        {/* Gallery Grid */}
        {!isLoading && images.length === 0 && (
          <div className="text-center text-gray-500 py-12">
            <p className="text-xl">No images found. Upload some photos to get started!</p>
          </div>
        )}

        {!isLoading && images.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image, index) => (
              <div 
                key={image.publicId}
                className="relative group overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
                onClick={() => {
                  setSelectedImage(image);
                  setZoomLevel(1);
                }}
              >
                <img 
                  src={image.url} 
                  alt={`Gallery image ${index + 1}`}
                  className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
                  <button 
                    className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-red-500 hover:bg-red-600 p-1 rounded-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteImage(image.publicId);
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Lightbox Modal */}
        {selectedImage && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <div className="relative max-w-5xl max-h-full w-full h-full flex items-center justify-center">
              <button 
                className="absolute top-4 right-4 text-white text-3xl z-10 bg-red-500 hover:bg-red-600 rounded-full w-10 h-10 flex items-center justify-center transition-all duration-300"
                onClick={() => setSelectedImage(null)}
              >
                &times;
              </button>
              
              <button 
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white bg-black bg-opacity-50 hover:bg-opacity-75 rounded-full p-2 z-10 transition-all duration-300"
                onClick={(e) => {
                  e.stopPropagation();
                  navigateImage('prev');
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <button 
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white bg-black bg-opacity-50 hover:bg-opacity-75 rounded-full p-2 z-10 transition-all duration-300"
                onClick={(e) => {
                  e.stopPropagation();
                  navigateImage('next');
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              {/* Zoom Controls */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 bg-black bg-opacity-50 rounded-lg p-2 z-10">
                <button 
                  className="text-white p-1 rounded hover:bg-gray-700 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    setZoomLevel(prev => Math.max(prev - 0.25, 0.5));
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <span className="text-white px-2">{Math.round(zoomLevel * 100)}%</span>
                <button 
                  className="text-white p-1 rounded hover:bg-gray-700 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    setZoomLevel(prev => Math.min(prev + 0.25, 3));
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                </button>
              </div>

              <div 
                className="w-full h-full flex items-center justify-center overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <img 
                  src={selectedImage.url} 
                  alt="Selected"
                  className="max-w-full max-h-full object-contain transition-transform duration-300"
                  style={{ transform: `scale(${zoomLevel})` }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}