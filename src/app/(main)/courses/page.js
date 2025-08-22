"use client";

import { motion } from "framer-motion";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Button,
} from "@material-tailwind/react";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import coursesData from "@/app/utils/coursePageData";

const CardGrid = () => {
  const [cardData, setCardData] = useState([]);
  const router = useRouter();
  
  // MANUALLY EDIT THESE VALUES TO CHANGE IMAGE HEIGHTS
  const desktopImageHeight = 340; // Change this value for desktop height (in pixels)
  const mobileImageHeight = 340;  // Change this value for mobile height (in pixels)

  useEffect(() => {
    const normalizedData = coursesData.map((course) => ({
      id: course.courseID,
      title: course.courseName,
      description: course.CourseDescription,
      image: course.CourseImage,
    }));
    setCardData(normalizedData);
  }, []);

  // Function to handle navigation to course details
  const handleViewCourse = (courseId) => {
    router.push(`/courses/${courseId}`);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const cardVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
    hover: {
      y: -10,
      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
      },
    },
  };

  const imageVariants = {
    hover: {
      scale: 1.1,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100 flex flex-col items-center py-12 px-4">
      <motion.h1 
        className="text-center text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Courses Available
      </motion.h1>
      
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 w-full max-w-7xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {cardData.map((card) => (
          <motion.div
            key={card.id}
            className="w-full"
            variants={cardVariants}
            whileHover="hover"
          >
            <Card className="h-full flex flex-col justify-between overflow-hidden rounded-2xl bg-white/70 backdrop-blur-sm border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300">
              <div className="relative overflow-hidden">
                <motion.div variants={imageVariants}>
                  {/* Desktop image height */}
                  <div key={`desktop-${card.id}`} className="hidden md:block" style={{ height: `${desktopImageHeight}px` }}>
                    <CardHeader className="relative w-full h-full overflow-hidden p-0 border-b border-white/20">
                      <Image
                        src={card.image}
                        alt={card.title}
                        width={300}
                        height={desktopImageHeight}
                        className="w-full h-full object-cover"
                        placeholder="blur"
                        blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/+F9PQAI8wNPvd7POQAAAABJRU5ErkJggg=="
                        priority={card.id === 1}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end">
                        <div className="p-4 text-white">
                          <Typography variant="h6" className="text-white">
                            {card.title}
                          </Typography>
                        </div>
                      </div>
                    </CardHeader>
                  </div>
                  
                  {/* Mobile image height */}
                  <div key={`mobile-${card.id}`} className="md:hidden" style={{ height: `${mobileImageHeight}px` }}>
                    <CardHeader className="relative w-full h-full overflow-hidden p-0 border-b border-white/20">
                      <Image
                        src={card.image}
                        alt={card.title}
                        width={300}
                        height={mobileImageHeight}
                        className="w-full h-full object-cover"
                        placeholder="blur"
                        blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/+F9PQAI8wNPvd7POQAAAABJRU5ErkJggg=="
                        priority={card.id === 1}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end">
                        <div className="p-4 text-white">
                          <Typography variant="h6" className="text-white">
                            {card.title}
                          </Typography>
                        </div>
                      </div>
                    </CardHeader>
                  </div>
                </motion.div>
                
                {/* Floating tag */}
                <div className="absolute top-4 right-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
                  Popular
                </div>
              </div>
              
              <CardBody className="flex-grow p-5">
                <Typography
                  className="mb-3 text-xl font-bold text-gray-800 line-clamp-1"
                >
                  {card.title}
                </Typography>
                <Typography className="text-sm text-gray-600 line-clamp-3">
                  {card.description}
                </Typography>
              </CardBody>
              
              <CardFooter className="p-5 pt-0">

                
                <motion.div 
                  whileTap={{ scale: 0.95 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <Button
                    ripple={false}
                    fullWidth
                    className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md hover:shadow-lg transition-all duration-200 py-3 rounded-xl overflow-hidden relative"
                    onClick={() => handleViewCourse(card.id)}
                  >
                    <span className="relative z-10">View Course</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-blue-600 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                  </Button>
                </motion.div>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default CardGrid;