'use client'
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronLeft, FiChevronRight, FiFilter, FiSearch, FiCalendar, FiUser, FiAward, FiClock } from 'react-icons/fi';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const AchievementsPage = () => {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(6);
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState(-1);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  // Image sizing state
  const [imageWidth, setImageWidth] = useState(800);
  const [imageHeight, setImageHeight] = useState(600);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `/api/achievements?page=${page}&limit=${limit}&sortBy=${sortBy}&sortOrder=${sortOrder}${
            searchQuery ? `&search=${searchQuery}` : ''
          }`
        );
        const data = await res.json();
        setAchievements(data.data);
        setTotalPages(data.pagination.totalPages);
      } catch (error) {
        console.error('Error fetching achievements:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAchievements();
  }, [page, limit, sortBy, sortOrder, searchQuery]);

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 1 ? -1 : 1);
    } else {
      setSortBy(field);
      setSortOrder(-1);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#eff5ff] text-gray-800 py-12 px-4 sm:px-6 pt-15 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, type: "spring" }}
          className="text-center mb-12"
        >
           <motion.h1 
        className="text-center text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Achievements
      </motion.h1>

        </motion.div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            <form onSubmit={handleSearch} className="w-full md:w-1/2">
              <motion.div 
                className="relative"
                whileFocus={{ scale: 1.01 }}
              >
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="text-indigo-500" />
                </div>
                <input
                  type="text"
                  placeholder="Search achievements..."
                  className="w-full pl-10 pr-4 py-2 bg-white border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-800 placeholder-indigo-300 shadow-sm transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </motion.div>
            </form>

            <div className="flex gap-3 w-full md:w-auto">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSort('date')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all shadow-sm ${
                  sortBy === 'date' 
                    ? 'bg-indigo-600 text-white shadow-md' 
                    : 'bg-white text-indigo-700 hover:bg-indigo-50 border border-indigo-200'
                }`}
              >
                <FiCalendar />
                <span>Date</span>
                {sortBy === 'date' && (
                  <span>{sortOrder === -1 ? '↓' : '↑'}</span>
                )}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSort('studentName')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all shadow-sm ${
                  sortBy === 'studentName' 
                    ? 'bg-indigo-600 text-white shadow-md' 
                    : 'bg-white text-indigo-700 hover:bg-indigo-50 border border-indigo-200'
                }`}
              >
                <FiUser />
                <span>Name</span>
                {sortBy === 'studentName' && (
                  <span>{sortOrder === -1 ? '↓' : '↑'}</span>
                )}
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Achievements Grid */}
        {loading ? (
          <motion.div 
            className="grid grid-cols-1 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {[...Array(limit)].map((_, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all"
              >
                <div className="flex flex-col md:flex-row">
                  <div 
                    className="flex-shrink-0 w-full md:w-auto" 
                    style={{ 
                      width: isMobile ? '100%' : `${imageWidth}px`, 
                      height: isMobile ? '300px' : `${imageHeight}px` 
                    }}
                  >
                    <Skeleton 
                      height={isMobile ? 300 : imageHeight} 
                      width={isMobile ? '100%' : imageWidth} 
                      baseColor="#e6edff"
                      highlightColor="#f8faff"
                    />
                  </div>
                  <div className="flex-1 p-6">
                    <Skeleton 
                      count={4} 
                      baseColor="#e6edff"
                      highlightColor="#f8faff"
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : achievements.length > 0 ? (
          <motion.div 
            className="grid grid-cols-1 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <AnimatePresence>
              {achievements.map((achievement) => (
                <motion.div
                  key={achievement._id}
                  variants={itemVariants}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all border border-indigo-100 hover:border-indigo-300"
                >
                  <div className="flex flex-col md:flex-row">
                    {/* Photo Section - Customizable Size */}
                    <motion.div 
                      className="relative group overflow-hidden flex-shrink-0 w-full md:w-auto" 
                      style={{ 
                        width: isMobile ? '100%' : `${imageWidth}px`, 
                        height: isMobile ? '300px' : `${imageHeight}px` 
                      }}
                      whileHover={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      <img
                        src={achievement.photo.url}
                        alt={achievement.title}
                        style={{ 
                          width: isMobile ? '100%' : `${imageWidth}px`, 
                          height: isMobile ? '300px' : `${imageHeight}px` 
                        }}
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/10 to-transparent" />
                    </motion.div>

                    {/* Details Section */}
                    <div className="flex-1 p-6">
                      <div className="flex flex-col h-full">
                        <div className="mb-4">
                          <motion.div 
                            className="flex items-center gap-2 text-indigo-600 mb-2"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                          >
                            <FiAward className="text-lg" />
                            <span className="text-sm font-medium">ACHIEVEMENT</span>
                          </motion.div>
                          <motion.h2 
                            className="text-2xl font-bold text-indigo-800 mb-2"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                          >
                            {achievement.title}
                          </motion.h2>
                          <motion.p 
                            className="text-gray-700 mb-4"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                          >
                            {achievement.description}
                          </motion.p>
                        </div>

                        <div className="mt-auto pt-4 border-t border-indigo-100">
                          <div className="flex flex-wrap gap-4">
                            <motion.div 
                              className="flex items-center gap-2 text-indigo-700"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.5 }}
                            >
                              <FiUser className="text-indigo-600" />
                              <span>{achievement.studentName}</span>
                            </motion.div>
                            <motion.div 
                              className="flex items-center gap-2 text-indigo-700"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.6 }}
                            >
                              <FiCalendar className="text-indigo-600" />
                              <span>{formatDate(achievement.date)}</span>
                            </motion.div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16"
          >
            <motion.div 
              className="text-indigo-500 text-5xl mb-4"
              animate={{ 
                rotate: [0, 5, -5, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              🏆
            </motion.div>
            <h3 className="text-xl font-medium text-indigo-800 mb-2">No achievements found</h3>
            <p className="text-indigo-600">
              {searchQuery
                ? 'Try adjusting your search query'
                : 'Check back later for new achievements'}
            </p>
          </motion.div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex justify-center mt-12"
          >
            <nav className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={page === 1}
                className="p-2 rounded-md bg-white text-indigo-700 border border-indigo-200 hover:bg-indigo-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
              >
                <FiChevronLeft />
              </motion.button>

              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (page <= 3) {
                  pageNum = i + 1;
                } else if (page >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = page - 2 + i;
                }

                return (
                  <motion.button
                    key={pageNum}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setPage(pageNum)}
                    className={`w-10 h-10 rounded-md flex items-center justify-center transition-all shadow-sm ${
                      page === pageNum
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'bg-white text-indigo-700 border border-indigo-200 hover:bg-indigo-50'
                    }`}
                  >
                    {pageNum}
                  </motion.button>
                );
              })}

              {totalPages > 5 && page < totalPages - 2 && (
                <span className="text-indigo-500 px-2">...</span>
              )}

              {totalPages > 5 && page < totalPages - 2 && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setPage(totalPages)}
                  className={`w-10 h-10 rounded-md flex items-center justify-center transition-all shadow-sm ${
                    page === totalPages
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'bg-white text-indigo-700 border border-indigo-200 hover:bg-indigo-50'
                  }`}
                >
                  {totalPages}
                </motion.button>
              )}

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={page === totalPages}
                className="p-2 rounded-md bg-white text-indigo-700 border border-indigo-200 hover:bg-indigo-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
              >
                <FiChevronRight />
              </motion.button>
            </nav>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AchievementsPage;