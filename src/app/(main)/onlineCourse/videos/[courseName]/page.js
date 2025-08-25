"use client"
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Head from 'next/head';

export default function CoursePlayer() {
  const params = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [progress, setProgress] = useState(0); // For loading animation

  useEffect(() => {
    const courseName = params.courseName;
    if (!courseName) {
      setError('No course specified');
      setLoading(false);
      return;
    }
    fetchCourse(courseName);
  }, [params]);

  const fetchCourse = async (courseName) => {
    try {
      setLoading(true);
      // Simulate progress for loading animation
      const interval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 200);
      
      const response = await fetch(`/api/onlineCourse/${encodeURIComponent(courseName)}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch course');
      }
      
      const courseData = await response.json();
      setCourse(courseData);
      
      // Select first video by default
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
    // On mobile, close sidebar after selection
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-64 h-2 bg-gray-700 rounded-full overflow-hidden mb-4">
            <div 
              className="absolute top-0 left-0 h-full bg-blue-500 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-white text-lg">Loading course content...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="bg-gray-800 p-8 rounded-xl shadow-2xl transform hover:scale-105 transition-transform duration-300">
          <div className="text-red-500 text-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-white text-2xl font-bold mb-2">Error Loading Course</h2>
          <p className="text-gray-400">{error}</p>
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
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="text-center p-8 bg-gray-800 rounded-xl shadow-2xl">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-white text-2xl font-bold">Course not found</h2>
          <p className="text-gray-400 mt-2">The requested course could not be loaded.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{course.name} | Course Player</title>
      </Head>
      
      <div className="flex flex-col h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white overflow-hidden">
        {/* Header */}
        <header className="bg-gray-800 p-4 flex items-center justify-between shadow-lg z-10">
          <h1 className="text-xl font-bold truncate animate-fade-in">{course.name}</h1>
          <button 
            onClick={toggleSidebar}
            className="p-2 rounded-md bg-gray-700 hover:bg-gray-600 transition-all duration-300 transform hover:scale-110"
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

        {/* Main Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Video Player Section */}
          <div className={`${isSidebarOpen ? 'lg:w-3/4' : 'w-full'} transition-all duration-500 ease-in-out`}>
            <div className="h-full flex flex-col">
              {selectedVideo ? (
                <>
                  <div className="relative pt-[56.25%] bg-black animate-fade-in"> {/* 16:9 aspect ratio */}
                    <video
                      key={selectedVideo._id}
                      className="absolute inset-0 w-full h-full"
                      controls
                      autoPlay
                      poster={`https://res.cloudinary.com/demo/image/upload/${selectedVideo.publicId}.jpg`}
                    >
                      <source src={selectedVideo.videoUrl} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                  
                  <div className="p-6 bg-gray-800 flex-1 overflow-y-auto animate-slide-up">
                    <h2 className="text-2xl font-bold mb-2">{selectedVideo.title}</h2>
                    <p className="text-gray-300 mb-4">{selectedVideo.description}</p>
                    <div className="flex items-center text-sm text-gray-400">
                      <span className="flex items-center mr-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {selectedVideo.duration}
                      </span>
                      <span>Lesson {course.videos.findIndex(v => v._id === selectedVideo._id) + 1} of {course.videos.length}</span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="h-full flex items-center justify-center animate-pulse">
                  <div className="text-center p-8">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <p className="text-xl text-gray-400">Select a lesson to begin</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          {isSidebarOpen && (
            <div className="w-full lg:w-1/4 bg-gray-800 border-l border-gray-700 overflow-y-auto animate-slide-in-right">
              <div className="p-4">
                <h2 className="text-lg font-semibold mb-4 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Course Content
                </h2>
                <ul className="space-y-2">
                  {course.videos.map((video, index) => (
                    <li key={video._id} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                      <button
                        onClick={() => selectVideo(video)}
                        className={`w-full text-left p-3 rounded-lg transition-all duration-300 transform hover:translate-x-1 ${
                          selectedVideo && selectedVideo._id === video._id
                            ? 'bg-blue-600 text-white shadow-lg scale-105'
                            : 'bg-gray-700 hover:bg-gray-600'
                        }`}
                      >
                        <div className="flex items-center">
                          <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-gray-600 mr-3">
                            {index + 1}
                          </span>
                          <span className="truncate">{video.title}</span>
                        </div>
                        <div className="text-xs text-gray-400 mt-1 ml-11 flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {video.duration}
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        {selectedVideo && course.videos.length > 1 && (
          <div className="bg-gray-800 p-4 border-t border-gray-700 flex justify-between animate-fade-in-up">
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
                  ? 'bg-gray-700 cursor-not-allowed opacity-50'
                  : 'bg-blue-600 hover:bg-blue-700 transform hover:-translate-x-1'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
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
                  ? 'bg-gray-700 cursor-not-allowed opacity-50'
                  : 'bg-blue-600 hover:bg-blue-700 transform hover:translate-x-1'
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
      `}</style>
    </>
  );
}