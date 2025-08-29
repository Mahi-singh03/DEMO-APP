"use client"
import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import Head from 'next/head';

export default function CoursePlayer() {
  const params = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [orientation, setOrientation] = useState('portrait');
  const [isIOS, setIsIOS] = useState(false);
  
  const videoRef = useRef(null);
  const controlsTimeoutRef = useRef(null);
  const playerContainerRef = useRef(null);

  useEffect(() => {
    // Check if mobile on initial render and resize
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      
      // Set initial sidebar state based on device
      if (mobile) {
        setIsSidebarOpen(false);
      }
      
      // Check orientation
      setOrientation(window.innerWidth > window.innerHeight ? 'landscape' : 'portrait');
    };
    
    checkMobile();
    // Detect iOS devices (iPhone/iPad)
    const ua = navigator.userAgent || navigator.vendor || window.opera;
    const iOSDetected = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    setIsIOS(!!iOSDetected);
    window.addEventListener('resize', checkMobile);
    
    // Listen for orientation changes
    const handleOrientationChange = () => {
      setOrientation(window.screen.orientation?.type.includes('landscape') ? 'landscape' : 'portrait');
    };
    
    window.addEventListener('orientationchange', handleOrientationChange);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, []);

  useEffect(() => {
    const courseName = params.courseName;
    if (!courseName) {
      setError('No course specified');
      setLoading(false);
      return;
    }
    fetchCourse(courseName);
  }, [params]);

  useEffect(() => {
    // Disable right-click on the entire page to prevent download
    const disableRightClick = (e) => {
      e.preventDefault();
    };
    
    document.addEventListener('contextmenu', disableRightClick);
    
    return () => {
      document.removeEventListener('contextmenu', disableRightClick);
    };
  }, []);

  useEffect(() => {
    // Hide controls after 3 seconds of inactivity
    const hideControls = () => {
      if (isPlaying) {
        controlsTimeoutRef.current = setTimeout(() => {
          setShowControls(false);
        }, 3000);
      }
    };

    if (showControls) {
      hideControls();
    }

    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [showControls, isPlaying]);

  // Handle fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
      
      // Auto-rotate to landscape when entering fullscreen on mobile
      if (document.fullscreenElement && isMobile && orientation === 'portrait') {
        try {
          window.screen.orientation.lock('landscape').catch(err => {
            console.log('Orientation lock not supported:', err);
          });
        } catch (err) {
          console.log('Orientation API not supported');
        }
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [isMobile, orientation]);

  const fetchCourse = async (courseName) => {
    try {
      setLoading(true);
      const interval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 200);
      
      const response = await fetch(`/api/onlineCourse/${encodeURIComponent(courseName)}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch course');
      }
      
      const courseData = await response.json();
      setCourse(courseData);
      
      if (courseData.videos && courseData.videos.length > 0) {
        setSelectedVideo(courseData.videos[0]);
      }
      
      clearInterval(interval);
      setProgress(100);
      setTimeout(() => setLoading(false), 300);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const selectVideo = (video) => {
    setSelectedVideo(video);
    setIsPlaying(!isIOS);
    
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play().catch(err => {
          console.error("Error playing video:", err);
          // Handle iOS playback restrictions
          if (isMobile) {
            // Try to play with user interaction
            document.addEventListener('touchstart', function playOnTouch() {
              videoRef.current.play();
              document.removeEventListener('touchstart', playOnTouch);
            }, { once: true });
          }
        });
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      setDuration(videoRef.current.duration || 0);
    }
  };

  const handleSeek = (e) => {
    if (!videoRef.current) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    videoRef.current.currentTime = percent * videoRef.current.duration;
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      if (playerContainerRef.current.requestFullscreen) {
        playerContainerRef.current.requestFullscreen().catch(err => {
          console.error(`Error attempting to enable fullscreen: ${err.message}`);
        });
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  const formatTime = (seconds) => {
    if (isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const skip = (seconds) => {
    if (videoRef.current) {
      videoRef.current.currentTime += seconds;
    }
  };

  // Handle touch events for mobile controls
  const handleVideoTouch = (e) => {
    e.preventDefault();
    setShowControls(true);
    
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-64 h-2 bg-gray-200 rounded-full overflow-hidden mb-4">
            <div 
              className="absolute top-0 left-0 h-full bg-blue-500 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-gray-700 text-lg">Loading course content...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-300">
          <div className="text-red-500 text-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-gray-800 text-2xl font-bold mb-2">Error Loading Course</h2>
          <p className="text-gray-600">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-300"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-gray-800 text-2xl font-bold">Course not found</h2>
          <p className="text-gray-600 mt-2">The requested course could not be loaded.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{course.name} | Course Player</title>
        <meta name="description" content={`Watch ${course.name} course videos`} />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
      </Head>
      
      <div className="flex flex-col h-screen bg-gray-50 text-gray-800 overflow-hidden" ref={playerContainerRef}>
        {/* Header - Hidden in fullscreen mode */}
        {!isFullscreen && (
          <header className="bg-white p-4 flex items-center justify-between shadow-sm z-10 border-b">
            <div className="flex items-center">
              {course.titlePhotoUrl && (
                <img 
                  src={course.titlePhotoUrl} 
                  alt={course.name}
                  className="w-10 h-10 rounded-md object-cover mr-3"
                />
              )}
              <h1 className="text-xl font-bold truncate animate-fade-in">{course.name}</h1>
            </div>
            <button 
              onClick={toggleSidebar}
              className="p-2 rounded-md bg-gray-100 hover:bg-gray-200 transition-all duration-300 transform hover:scale-110 lg:hidden"
              aria-label={isSidebarOpen ? 'Hide lessons' : 'Show lessons'}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isSidebarOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </header>
        )}

        {/* Main Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Video Player Section */}
          <div className={`${isSidebarOpen && !isFullscreen ? 'lg:w-3/4' : 'w-full'} transition-all duration-500 ease-in-out`}>
            <div className="h-full flex flex-col">
              {selectedVideo ? (
                <>
                  <div 
                    className={`relative ${isFullscreen ? 'h-full' : 'pt-[56.25%]'} bg-black animate-fade-in`}
                    onMouseMove={() => {
                      setShowControls(true);
                      if (controlsTimeoutRef.current) {
                        clearTimeout(controlsTimeoutRef.current);
                      }
                    }}
                    onMouseLeave={() => {
                      if (isPlaying) {
                        controlsTimeoutRef.current = setTimeout(() => {
                          setShowControls(false);
                        }, 2000);
                      }
                    }}
                    onClick={!isIOS ? togglePlay : undefined}
                    onTouchStart={!isIOS ? handleVideoTouch : undefined}
                  >
                    <video
                      ref={videoRef}
                      key={selectedVideo._id}
                      className={`${isFullscreen ? 'h-full w-full object-contain' : 'absolute inset-0 w-full h-full'} ${!isIOS ? 'custom-video' : ''}`}
                      controls={isIOS}
                      autoPlay={!isIOS}
                      onTimeUpdate={handleTimeUpdate}
                      onPlay={() => setIsPlaying(true)}
                      onPause={() => setIsPlaying(false)}
                      onEnded={() => setIsPlaying(false)}
                      playsInline
                      preload="metadata"
                      muted={isIOS ? false : isMobile}
                      onTouchStart={(e) => {
                        if (isIOS && videoRef.current?.paused) {
                          videoRef.current.play().catch(() => {});
                        }
                        handleVideoTouch(e);
                      }}
                    >
                      <source src={selectedVideo.secureUrl} type={`video/${selectedVideo.format || 'mp4'}`} />
                      Your browser does not support the video tag.
                    </video>
                    
                    {/* Play/Pause overlay button */}
                    {!isIOS && !isPlaying && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30 transition-opacity duration-300">
                        <button 
                          className="p-4 rounded-full bg-white/90 hover:bg-white transition-all duration-300 transform hover:scale-110"
                          onClick={togglePlay}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                          </svg>
                        </button>
                      </div>
                    )}
                    
                    {/* Custom Video Controls */}
                    {!isIOS && (
                    <div 
                      className={`absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end transition-opacity duration-300 ${
                        showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
                      }`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="p-4 space-y-2">
                        {/* Progress Bar */}
                        <div 
                          className="w-full h-2 bg-gray-400/50 rounded-full overflow-hidden cursor-pointer group"
                          onClick={handleSeek}
                        >
                          <div 
                            className="h-full bg-red-600 rounded-full transition-all duration-200 relative"
                            style={{ width: `${(currentTime / duration) * 100}%` }}
                          >
                            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2 md:space-x-4">
                            <button 
                              className="p-2 rounded-full hover:bg-white/20 transition-colors text-white"
                              onClick={togglePlay}
                            >
                              {isPlaying ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                              ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                </svg>
                              )}
                            </button>
                            
                            <button 
                              className="p-2 rounded-full hover:bg-white/20 transition-colors text-white hidden sm:block"
                              onClick={() => skip(-10)}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0019 16V8a1 1 0 00-1.6-.8l-5.333 4zM4.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0011 16V8a1 1 0 00-1.6-.8l-5.334 4z" />
                              </svg>
                            </button>
                            
                            <button 
                              className="p-2 rounded-full hover:bg-white/20 transition-colors text-white hidden sm:block"
                              onClick={() => skip(10)}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.933 12.8a1 1 0 000-1.6L6.6 7.2A1 1 0 005 8v8a1 1 0 001.6.8l5.333-4zM19.933 12.8a1 1 0 000-1.6l-5.333-4A1 1 0 0013 8v8a1 1 0 001.6.8l5.333-4z" />
                              </svg>
                            </button>
                            
                            <div className="flex items-center text-sm text-white">
                              <span>{formatTime(currentTime)}</span>
                              <span className="mx-1">/</span>
                              <span>{formatTime(duration)}</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2 md:space-x-4">
                            <div className="flex items-center hidden sm:flex">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072M12 6a9 9 0 110 12m0 0v-6m0 0l3 3m-3-3l-3 3" />
                              </svg>
                              <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.01"
                                value={volume}
                                onChange={handleVolumeChange}
                                className="w-16 md:w-20 accent-red-600"
                              />
                            </div>
                            
                            <button 
                              className="p-2 rounded-full hover:bg-white/20 transition-colors text-white"
                              onClick={toggleFullscreen}
                            >
                              {isFullscreen ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25" />
                                </svg>
                              ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8V4m0 0h4M3 4l4 4m8 0V4m0 0h-4m4 0l-4 4m-8 4v4m0 0h4m-4 0l4-4m8 4l-4-4m4 4v-4m0 4h-4" />
                                </svg>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    )}
                  </div>
                  
                  {!isFullscreen && (
                    <div className="p-4 md:p-6 bg-white flex-1 overflow-y-auto animate-slide-up shadow-sm">
                      <h2 className="text-xl md:text-2xl font-bold mb-2">{selectedVideo.title}</h2>
                      <p className="text-gray-600 mb-4">{selectedVideo.description}</p>
                      <div className="flex items-center text-sm text-gray-500">
                        <span className="flex items-center mr-4">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {Math.floor(selectedVideo.duration / 60)}:{(selectedVideo.duration % 60).toString().padStart(2, '0')}
                        </span>
                        <span>Lesson {course.videos.findIndex(v => v._id === selectedVideo._id) + 1} of {course.videos.length}</span>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="h-full flex items-center justify-center animate-pulse bg-gray-100">
                  <div className="text-center p-8">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <p className="text-xl text-gray-500">Select a lesson to begin</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar - Hidden in fullscreen mode */}
          {!isFullscreen && (
            <div className={`w-full lg:w-1/4 bg-white border-l border-gray-200 overflow-y-auto transition-all duration-500 ease-in-out ${isSidebarOpen ? 'block' : 'hidden lg:block'}`}>
              <div className="p-4">
                {/* Course Info Section */}
                <div className="mb-6">
                  {course.titlePhotoUrl && (
                    <img 
                      src={course.titlePhotoUrl} 
                      alt={course.name}
                      className="w-full h-40 object-cover rounded-lg mb-3"
                    />
                  )}
                  <h2 className="text-lg font-semibold mb-2">{course.name}</h2>
                  {course.description && (
                    <p className="text-sm text-gray-600 mb-3">{course.description}</p>
                  )}
                  <div className="flex items-center text-sm text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <span>{course.videos.length} lessons</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-md font-medium flex items-center">
                    Course Content
                  </h3>
                </div>
                <ul className="space-y-2">
                  {course.videos.map((video, index) => (
                    <li key={video._id} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                      <button
                        onClick={() => selectVideo(video)}
                        className={`w-full text-left p-3 rounded-lg transition-all duration-300 transform hover:-translate-y-0.5 ${
                          selectedVideo && selectedVideo._id === video._id
                            ? 'bg-red-50 text-red-600 border border-red-200 shadow-sm'
                            : 'bg-gray-50 hover:bg-gray-100 border border-transparent'
                        }`}
                      >
                        <div className="flex items-center">
                          <span className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full mr-3 ${
                            selectedVideo && selectedVideo._id === video._id
                              ? 'bg-red-100 text-red-600'
                              : 'bg-gray-200 text-gray-600'
                          }`}>
                            {index + 1}
                          </span>
                          <span className="truncate text-sm font-medium">{video.title}</span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1 ml-11 flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {Math.floor(video.duration / 60)}:{(video.duration % 60).toString().padStart(2, '0')}
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Navigation - Hidden in fullscreen mode */}
        {!isFullscreen && selectedVideo && course.videos.length > 1 && (
          <div className="bg-white p-4 border-t border-gray-200 flex justify-between animate-fade-in-up shadow-sm">
            <button
              onClick={() => {
                const currentIndex = course.videos.findIndex(v => v._id === selectedVideo._id);
                if (currentIndex > 0) {
                  selectVideo(course.videos[currentIndex - 1]);
                }
              }}
              disabled={course.videos.findIndex(v => v._id === selectedVideo._id) === 0}
              className={`px-4 py-2 rounded-lg transition-all duration-300 flex items-center ${
                course.videos.findIndex(v => v._id === selectedVideo._id) === 0
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-red-600 hover:bg-red-700 text-white transform hover:-translate-x-1'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin='round' strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Previous
            </button>
            <button
              onClick={() => {
                const currentIndex = course.videos.findIndex(v => v._id === selectedVideo._id);
                if (currentIndex < course.videos.length - 1) {
                  selectVideo(course.videos[currentIndex + 1]);
                }
              }}
              disabled={course.videos.findIndex(v => v._id === selectedVideo._id) === course.videos.length - 1}
              className={`px-4 py-2 rounded-lg transition-all duration-300 flex items-center ${
                course.videos.findIndex(v => v._id === selectedVideo._id) === course.videos.length - 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-red-600 hover:bg-red-700 text-white transform hover:translate-x-1'
              }`}
            >
              Next
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slide-up {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes slide-in-right {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        @keyframes fade-in-up {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
        .animate-slide-up {
          animation: slide-up 0.5s ease-out;
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out;
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.5s ease-out;
        }
        
        /* Disable right-click context menu */
        video {
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
        }
        
        /* Hide native controls only for our custom player (non-iOS) */
        .custom-video::-webkit-media-controls {
          display: none !important;
        }
        
        /* Custom scrollbar for sidebar */
        .overflow-y-auto::-webkit-scrollbar {
          width: 6px;
        }
        
        .overflow-y-auto::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        
        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: #c5c5c5;
          border-radius: 10px;
        }
        
        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: #a8a8a8;
        }
        
        /* Fullscreen styles */
        :fullscreen .video-container {
          width: 100%;
          height: 100%;
        }
        
        /* Mobile-specific optimizations */
        @media (max-width: 768px) {
          .video-controls {
            padding: 0.5rem;
          }
          
          .video-controls button {
            padding: 0.375rem;
          }
          
          .sidebar-item {
            padding: 0.75rem;
          }
        }
        
        /* iOS specific fixes */
        video {
          -webkit-tap-highlight-color: transparent;
        }
      `}</style>
    </>
  );
}