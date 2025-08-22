'use client';
import { useEffect, useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { 
  FiX, FiChevronLeft, FiChevronRight, FiSun, FiMoon, 
  FiZoomIn, FiZoomOut, FiDownload, FiInfo, FiRotateCw 
} from 'react-icons/fi';

const Gallery = () => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [showInfo, setShowInfo] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [rotation, setRotation] = useState(0);
  const imageContainerRef = useRef(null);
  const imageRef = useRef(null);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const response = await fetch('/api/gallery/getAllPhoto');
        const data = await response.json();
        if (data.success) {
          setPhotos(data.photos);
        } else {
          setError('Failed to load photos');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPhotos();
  }, []);

  const openImage = useCallback((photo, index) => {
    setSelectedImage(photo);
    setSelectedIndex(index);
    setZoomLevel(1);
    setPosition({ x: 0, y: 0 });
    setRotation(0);
    setShowInfo(false);
  }, []);

  const navigateImage = useCallback((direction) => {
    let newIndex;
    if (direction === 'prev') {
      newIndex = selectedIndex === 0 ? photos.length - 1 : selectedIndex - 1;
    } else {
      newIndex = selectedIndex === photos.length - 1 ? 0 : selectedIndex + 1;
    }
    setSelectedImage(photos[newIndex]);
    setSelectedIndex(newIndex);
    setZoomLevel(1);
    setPosition({ x: 0, y: 0 });
    setRotation(0);
  }, [selectedIndex, photos]);

  const handleZoomIn = useCallback(() => {
    setZoomLevel(prev => Math.min(prev + 0.5, 5));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoomLevel(prev => {
      const newZoom = Math.max(prev - 0.5, 1);
      if (newZoom === 1) {
        setPosition({ x: 0, y: 0 });
      }
      return newZoom;
    });
  }, []);

  const resetZoom = useCallback(() => {
    setZoomLevel(1);
    setPosition({ x: 0, y: 0 });
  }, []);

  const rotateImage = useCallback(() => {
    setRotation(prev => (prev + 90) % 360);
  }, []);

  const handleWheel = useCallback((e) => {
    if (selectedImage) {
      e.preventDefault();
      if (e.deltaY < 0) {
        handleZoomIn();
      } else {
        handleZoomOut();
      }
    }
  }, [selectedImage, handleZoomIn, handleZoomOut]);

  const handleMouseDown = useCallback((e) => {
    if (zoomLevel > 1) {
      setIsDragging(true);
    }
  }, [zoomLevel]);

  const handleMouseMove = useCallback((e) => {
    if (isDragging && zoomLevel > 1) {
      setPosition(prev => ({
        x: prev.x + e.movementX,
        y: prev.y + e.movementY
      }));
    }
  }, [isDragging, zoomLevel]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleTouchStart = useCallback((e) => {
    if (e.touches.length === 1) {
      setTouchStart({
        x: e.touches[0].clientX,
        y: e.touches[0].clientY
      });
    } else if (e.touches.length === 2) {
      // Handle pinch-to-zoom
      e.preventDefault();
    }
  }, []);

  const handleTouchMove = useCallback((e) => {
    if (e.touches.length === 1 && touchStart && zoomLevel === 1) {
      const touchX = e.touches[0].clientX;
      const deltaX = touchX - touchStart.x;
      
      if (Math.abs(deltaX) > 50) {
        if (deltaX > 0) {
          navigateImage('prev');
        } else {
          navigateImage('next');
        }
        setTouchStart(null);
      }
    }
  }, [touchStart, zoomLevel, navigateImage]);

  const handleTouchEnd = useCallback(() => {
    setTouchStart(null);
  }, []);

  const downloadImage = useCallback(async () => {
    if (!selectedImage) return;
    
    try {
      const response = await fetch(selectedImage.url);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = selectedImage.public_id || `photo-${selectedIndex}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to download image:', err);
    }
  }, [selectedImage, selectedIndex]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (selectedImage) {
        if (e.key === 'Escape') {
          setSelectedImage(null);
        } else if (e.key === 'ArrowLeft') {
          navigateImage('prev');
        } else if (e.key === 'ArrowRight') {
          navigateImage('next');
        } else if (e.key === '+' || e.key === '=') {
          handleZoomIn();
        } else if (e.key === '-' || e.key === '_') {
          handleZoomOut();
        } else if (e.key === 'i') {
          setShowInfo(prev => !prev);
        } else if (e.key === '0') {
          resetZoom();
        } else if (e.key === 'r') {
          rotateImage();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImage, navigateImage, handleZoomIn, handleZoomOut, resetZoom, rotateImage]);

  useEffect(() => {
    if (selectedImage && zoomLevel > 1) {
      window.addEventListener('wheel', handleWheel, { passive: false });
      return () => window.removeEventListener('wheel', handleWheel);
    }
  }, [selectedImage, zoomLevel, handleWheel]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white transition-colors duration-300">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mb-4"
          />
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-gray-600"
          >
            Loading your memories...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white transition-colors duration-300">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 bg-red-100 text-red-700 rounded-lg shadow-lg max-w-md text-center"
        >
          <h2 className="text-xl font-bold mb-2">Oops! Something went wrong</h2>
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
          >
            Try Again
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#eaf6fe] px-4  sm:px-6 py-10 lg:px-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center w-full mb-8"
        >
      
                 <motion.h1 
        className="text-center text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Gallery
      </motion.h1>
      
        </motion.div>

        {photos.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 text-gray-500"
          >
            <FiInfo size={48} className="mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-medium mb-2">No photos yet</h3>
            <p>Upload some images to get started</p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5"
          >
            {photos.map((photo, index) => (
              <motion.div
                key={photo.public_id || index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.05 * index }}
                whileHover={{ scale: 1.03, z: 10 }}
                whileTap={{ scale: 0.95 }}
                className="relative aspect-square overflow-hidden rounded-xl shadow-md bg-gray-100 cursor-pointer group"
                onClick={() => openImage(photo, index)}
              >
                <Image
                  src={photo.url}
                  alt={photo.public_id || `Photo ${index}`}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  placeholder="blur"
                  blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(700, 475))}`}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-end">
                  <div className="p-3 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 w-full bg-gradient-to-t from-black/80 to-transparent">
                    <p className="text-sm truncate">{photo.public_id}</p>
                    <p className="text-xs opacity-80">
                      {new Date(photo.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      <AnimatePresence mode="wait">
        {selectedImage && (
          <motion.div
            key="modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-white/95 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 20 }}
              className="relative max-w-6xl w-full max-h-[90vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center p-4 bg-white/90 backdrop-blur-sm rounded-t-lg z-20 border-b">
                <div className="text-gray-700 text-sm">
                  {selectedIndex + 1} of {photos.length} • {new Date(selectedImage.created_at).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowInfo(prev => !prev)}
                    className={`p-2 rounded-full ${showInfo ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                    aria-label="Toggle info"
                  >
                    <FiInfo size={18} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={rotateImage}
                    className="p-2 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300"
                    aria-label="Rotate image"
                  >
                    <FiRotateCw size={18} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={downloadImage}
                    className="p-2 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300"
                    aria-label="Download image"
                  >
                    <FiDownload size={18} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={resetZoom}
                    disabled={zoomLevel === 1}
                    className={`p-2 rounded-full ${zoomLevel === 1 ? 'bg-gray-100 text-gray-400' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                    aria-label="Reset zoom"
                  >
                    1:1
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleZoomOut}
                    disabled={zoomLevel <= 1}
                    className={`p-2 rounded-full ${zoomLevel <= 1 ? 'bg-gray-100 text-gray-400' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                    aria-label="Zoom out"
                  >
                    <FiZoomOut size={18} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleZoomIn}
                    disabled={zoomLevel >= 5}
                    className={`p-2 rounded-full ${zoomLevel >= 5 ? 'bg-gray-100 text-gray-400' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                    aria-label="Zoom in"
                  >
                    <FiZoomIn size={18} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
                    onClick={() => setSelectedImage(null)}
                    aria-label="Close"
                  >
                    <FiX size={20} />
                  </motion.button>
                </div>
              </div>
              
              <AnimatePresence>
                {showInfo && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-16 left-4 bg-white/90 backdrop-blur-sm text-gray-700 p-4 rounded-lg z-20 max-w-xs text-sm shadow-lg border"
                  >
                    <h4 className="font-medium mb-2">Image Information</h4>
                    <p>Filename: {selectedImage.public_id}</p>
                    <p>Uploaded: {new Date(selectedImage.created_at).toLocaleDateString()}</p>
                    <p>Dimensions: {selectedImage.width} × {selectedImage.height}</p>
                  </motion.div>
                )}
              </AnimatePresence>
              
              <div className="relative flex-1 flex items-center justify-center overflow-hidden mt-0">
                <motion.button
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    navigateImage('prev');
                  }}
                  className="absolute left-4 bg-white/80 hover:bg-white text-gray-800 p-3 rounded-full z-10 transition-colors shadow-lg border"
                  aria-label="Previous image"
                >
                  <FiChevronLeft size={28} />
                </motion.button>
                
                <div 
                  ref={imageContainerRef}
                  className="flex items-center justify-center w-full h-full overflow-hidden"
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                  style={{ cursor: zoomLevel > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default' }}
                >
                  <div 
                    ref={imageRef}
                    className="relative flex items-center justify-center"
                    style={{ 
                      transform: `translate(${position.x}px, ${position.y}px)`,
                      transition: isDragging ? 'none' : 'transform 0.2s ease-out'
                    }}
                  >
                    <Image
                      src={selectedImage.url}
                      alt={selectedImage.public_id || `Selected photo ${selectedIndex}`}
                      width={selectedImage.width}
                      height={selectedImage.height}
                      className="object-contain transition-transform duration-200"
                      style={{ 
                        transform: `scale(${zoomLevel}) rotate(${rotation}deg)`,
                        maxWidth: '80vw',
                        maxHeight: '70vh'
                      }}
                      priority
                    />
                  </div>
                </div>
                
                <motion.button
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    navigateImage('next');
                  }}
                  className="absolute right-4 bg-white/80 hover:bg-white text-gray-800 p-3 rounded-full z-10 transition-colors shadow-lg border"
                  aria-label="Next image"
                >
                  <FiChevronRight size={28} />
                </motion.button>
              </div>

              <div className="p-4 text-center text-gray-500 text-sm border-t bg-white/80">
                Use mouse wheel to zoom • Click and drag when zoomed in • Swipe to navigate
                <br />
                Keyboard shortcuts: ← → arrows, +/- zoom, 0 reset, R rotate, I info, Esc close
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Shimmer effect for image placeholders
const shimmer = (w, h) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/1999/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#f3f3f3" offset="20%" />
      <stop stop-color="#ecebeb" offset="50%" />
      <stop stop-color="#f3f3f3" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#f3f3f3" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
</svg>`;

const toBase64 = (str) =>
  typeof window === 'undefined'
    ? Buffer.from(str).toString('base64')
    : window.btoa(str);

export default Gallery;