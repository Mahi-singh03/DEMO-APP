"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import coursesData from "@/app/utils/coursePageData";



// Adjustable image heights (in px)
const COURSE_IMAGE_HEIGHT_MOBILE = 450; 
const COURSE_IMAGE_HEIGHT_LG = 450;   

const CourseDetail = () => {
  const params = useParams();
  const router = useRouter();
  const [course, setCourse] = useState(null);
  const [activeModule, setActiveModule] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const courseId = parseInt(params.id);
    const foundCourse = coursesData.find(c => c.courseID === courseId);
    
    if (foundCourse) {
      setCourse(foundCourse);
    } else {
      router.push("/courses");
    }
    
    setIsLoading(false);
  }, [params.id, router]);

  // Animation variants
  const pageVariants = {
    initial: { opacity: 0 },
    in: { 
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    },
    out: { 
      opacity: 0,
      transition: {
        duration: 0.4,
        ease: "easeIn"
      }
    }
  };

  const staggerChildren = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const fadeInUp = {
    hidden: { y: 40, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const scaleIn = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const slideIn = {
    hidden: { x: -30, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-100">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full mb-4"
          ></motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-gray-600"
          >
            Loading course details...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-100">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center p-8 bg-white rounded-2xl shadow-xl"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Course not found</h2>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push("/courses")}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all"
          >
            Back to Courses
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100 py-8 px-4"
    >
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -20, 0],
              x: [0, 15, 0],
              rotate: [0, 5, 0],
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5
            }}
            className="absolute opacity-10"
            style={{
              top: `${20 + i * 15}%`,
              left: `${10 + i * 10}%`,
              width: "40px",
              height: "40px",
              borderRadius: "8px",
              background: "linear-gradient(135deg, #3b82f6, #06b6d4)",
            }}
          />
        ))}
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          whileHover={{ x: -5, backgroundColor: "rgba(255, 255, 255, 0.9)" }}
          whileTap={{ scale: 0.95 }}
          onClick={() => router.back()}
          className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-xl shadow-sm hover:shadow-md transition-all mb-6 text-blue-600 font-medium"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to Courses
        </motion.button>

        {/* Course Header */}
        <motion.div 
          variants={staggerChildren}
          initial="hidden"
          animate="visible"
          className="flex flex-col lg:flex-row gap-8 mb-12"
        >
          <motion.div 
            variants={scaleIn}
            className={`relative w-full lg:w-2/5 rounded-2xl overflow-hidden shadow-2xl`}
            style={{
              height: `${COURSE_IMAGE_HEIGHT_MOBILE}px`,
            }}
          >
            <style jsx>{`
              @media (min-width: 1024px) {
                .course-image-container {
                  height: ${COURSE_IMAGE_HEIGHT_LG}px !important;
                }
              }
            `}</style>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: imageLoaded ? 0 : 1 }}
              className="absolute inset-0 bg-gradient-to-r from-blue-100 to-cyan-100 flex items-center justify-center"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                className="w-12 h-12 border-t-2 border-blue-400 border-solid rounded-full"
              />
            </motion.div>
            <div className="course-image-container" style={{position: 'relative', width: '100%', height: '100%'}}>
              <Image
                src={course.CourseImage}
                alt={course.courseName}
                fill
                className="object-cover"
                priority
                onLoad={() => setImageLoaded(true)}
              />
            </div>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end"
            >
              <div className="p-4 text-white">
                <Typography variant="h6" className="text-white">
                  {course.courseName}
                </Typography>
              </div>
            </motion.div>
          </motion.div>
          
          <motion.div 
            variants={staggerChildren}
            className="flex-1"
          >
            <motion.div 
              variants={fadeInUp}
              className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl mb-6"
            >
              <motion.h1 
                variants={fadeInUp}
                className="text-3xl md:text-4xl font-bold text-blue-500 mb-4"
              >
                {course.courseName}
              </motion.h1>
              
              <motion.p 
                variants={fadeInUp}
                className="text-gray-600 mb-6 text-lg"
              >
                {course.description}
              </motion.p>
            </motion.div>
            
            <motion.div 
              variants={staggerChildren}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6"
            >
              <motion.div 
                variants={fadeInUp}
                whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                className="bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-white/50"
              >
                <div className="flex items-center">
                  <motion.div 
                    className="p-2 bg-blue-100 rounded-lg mr-4"
                    whileHover={{ rotate: 10 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </motion.div>
                  <div>
                    <h3 className="text-sm text-gray-500">Duration</h3>
                    <p className="text-lg font-semibold">{course.courseDuration}</p>
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                variants={fadeInUp}
                whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                className="bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-white/50"
              >
                <div className="flex items-center">
                  <motion.div 
                    className="p-2 bg-cyan-100 rounded-lg mr-4"
                    whileHover={{ rotate: -10 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-cyan-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </motion.div>
                  <div>
                    <h3 className="text-sm text-gray-500">Course Fee</h3>
                    <p className="text-lg font-semibold">₹{course.courseFee}</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
            
            <motion.button
              whileHover={{ 
                scale: 1.02,
                boxShadow: "0 10px 25px -5px rgba(37, 99, 235, 0.4)"
              }}
              whileTap={{ scale: 0.98 }}
              className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
            >
              <span>Enroll Now</span>
              <motion.svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5" 
                viewBox="0 0 20 20" 
                fill="currentColor"
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </motion.svg>
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Navigation Tabs */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex overflow-x-auto scrollbar-hide mb-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-md p-1"
        >
          {["Overview", "Curriculum", "Instructor", "Reviews"].map((tab, index) => (
            <button
              key={index}
              onClick={() => setActiveTab(tab.toLowerCase())}
              className={`px-6 py-3 font-medium whitespace-nowrap rounded-xl transition-all ${activeTab === tab.toLowerCase() ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md' : 'text-gray-500 hover:text-gray-700'}`}
            >
              {tab}
            </button>
          ))}
        </motion.div>

        <AnimatePresence mode="wait">
          {activeTab === "overview" && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* What You'll Learn Section */}
              <motion.section 
                variants={fadeInUp}
                className="mb-12"
              >
                <motion.h2 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-2xl font-bold text-gray-800 mb-6 flex items-center"
                >
                  <span className="w-2 h-6 bg-blue-600 rounded-full mr-3"></span>
                  What You'll Learn
                </motion.h2>
                
                <motion.div 
                  variants={staggerChildren}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  {course.courseLearnings.map((learning, index) => (
                    <motion.div
                      key={index}
                      variants={fadeInUp}
                      whileHover={{ y: -3, boxShadow: "0 8px 20px -5px rgba(0, 0, 0, 0.1)" }}
                      className="flex items-start bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-white/50"
                    >
                      <motion.div 
                        className="flex-shrink-0"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </motion.div>
                      <p className="text-gray-700">{learning}</p>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.section>

              {/* Course Syllabus */}
              <motion.section 
                variants={fadeInUp}
                className="mb-12"
              >
                <motion.h2 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-2xl font-bold text-gray-800 mb-6 flex items-center"
                >
                  <span className="w-2 h-6 bg-cyan-600 rounded-full mr-3"></span>
                  Course Syllabus
                </motion.h2>
                
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-md overflow-hidden">
                  {/* Module Tabs */}
                  <div className="flex overflow-x-auto scrollbar-hide border-b">
                    {course.courseSyllabus.map((module, index) => (
                      <motion.button
                        key={index}
                        onClick={() => setActiveModule(index)}
                        whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.5)" }}
                        whileTap={{ scale: 0.98 }}
                        className={`px-6 py-4 font-medium whitespace-nowrap transition-all ${activeModule === index ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                      >
                        {module.module}
                      </motion.button>
                    ))}
                  </div>
                  
                  {/* Module Content */}
                  <AnimatePresence mode="wait">
                    <motion.div 
                      key={activeModule}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      className="p-6"
                    >
                      <h3 className="text-xl font-semibold text-gray-800 mb-4">
                        {course.courseSyllabus[activeModule].module}
                      </h3>
                      
                      <ul className="space-y-3">
                        {course.courseSyllabus[activeModule].topics.map((topic, index) => (
                          <motion.li 
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="flex items-start p-3 rounded-lg hover:bg-blue-50/50 transition-colors"
                          >
                            <motion.div 
                              className="flex-shrink-0 mt-1"
                              whileHover={{ scale: 1.2 }}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-3" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                            </motion.div>
                            <span className="text-gray-700">{topic}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </motion.section>
            </motion.div>
          )}
        </AnimatePresence>

        {/* CTA Section */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-center py-12 px-4 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl shadow-2xl text-white mb-8 relative overflow-hidden"
        >
          {/* Animated circles in background */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.1, 0.05, 0.1],
                }}
                transition={{
                  duration: 8 + i * 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i
                }}
                className="absolute rounded-full border border-white/20"
                style={{
                  width: `${100 + i * 100}px`,
                  height: `${100 + i * 100}px`,
                  top: "50%",
                  left: "50%",
                  transform: `translate(-50%, -50%)`
                }}
              />
            ))}
          </div>
          
          <div className="relative z-10">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-2xl md:text-3xl font-bold mb-4"
            >
              Ready to Start Your Journey?
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-8 max-w-2xl mx-auto opacity-90"
            >
              Join thousands of students who have transformed their careers with our comprehensive courses.
            </motion.p>
            <motion.button
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 15px 30px -5px rgba(255, 255, 255, 0.3)"
              }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              Enroll Now - ₹{course.courseFee}
            </motion.button>
          </div>
        </motion.section>
      </div>
    </motion.div>
  );
};

// Simple Typography component since we don't have the exact one from the original
const Typography = ({ variant, className, children }) => {
  const Tag = variant === "h6" ? "h6" : "div";
  return <Tag className={className}>{children}</Tag>;
};

export default CourseDetail;