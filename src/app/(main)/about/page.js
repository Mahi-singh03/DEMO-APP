// app/about/page.jsx
'use client';
import Image from 'next/image';
import { motion } from 'framer-motion';

const About = () => {
  // Check if motion is available
  if (typeof motion === 'undefined') {
    console.error('motion component is undefined');
    return <div>Loading...</div>;
  }

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <div className="min-h-screen bg-[#eaf6fe] px-4 sm:px-6 lg:px-8 pt-15 pb-20">
      {/* Main About Section */}
      <motion.section 
        initial="hidden"
        animate="show"
        variants={container}
        className="text-center py-16 mb-12"
      >
        <motion.div variants={item}>
          <motion.h1 
            className="text-center text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-10"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            About Institute
          </motion.h1>
          <motion.p 
            variants={item}
            className="text-xl text-gray-700 font-medium mb-6"
          >
            Where Innovation Meets Excellence
          </motion.p>
          <motion.p 
            variants={item}
            className="max-w-3xl mx-auto text-gray-600 leading-8 text-base sm:text-lg"
          >
            At TechVision Institute, we combine cutting-edge technology with comprehensive education to create 
            the next generation of computer science professionals. Our commitment to academic excellence and 
            practical skills ensures every student receives personalized training in our state-of-the-art 
            learning environment.
          </motion.p>
        </motion.div>
      </motion.section>

      {/* Philosophy Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
        className="bg-gradient-to-r from-blue-50 to-white py-16 text-center mb-12 rounded-xl mx-4 sm:mx-8 lg:mx-16 shadow-lg border border-blue-100"
      >
        <motion.div 
          initial={{ scale: 0.95 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl sm:text-4xl text-blue-800 italic mb-4">
            &ldquo;Code the Future&rdquo;
          </h2>
          <p className="text-blue-600 text-base sm:text-lg uppercase tracking-wider">
            Quality Education • Industry-Relevant Curriculum • Career Success
          </p>
        </motion.div>
      </motion.section>

      {/* Visit Us Section */}
      <motion.section 
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        variants={container}
        className="mb-16 w-full"
      >
        <motion.h2 variants={item} className="text-center text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
          Our Campus
        </motion.h2>
        <motion.p variants={item} className="text-center text-gray-600 text-lg font-medium mb-8">
          Where Your Tech Career Begins
        </motion.p>
        
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <motion.div 
            variants={item}
            className="bg-white p-6 rounded-xl shadow-md text-center mb-8 max-w-3xl mx-auto border border-blue-100 hover:border-blue-300 transition-colors duration-300"
          >
            <p className="text-gray-700 text-base sm:text-lg font-medium flex items-center justify-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              Tech Park Road, Innovation District, Silicon Valley, California 94025
            </p>
          </motion.div>

          <motion.div
            variants={item}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full max-w-6xl mx-auto"
          >
            {/* Campus Image */}
            <div className="relative rounded-2xl shadow-md overflow-hidden w-full h-[800px] sm:h-[500px] lg:h-[950px] group">
              <Image
                src="https://res.cloudinary.com/dtg4pxws2/image/upload/v1755841551/20250822_1106_Enhanced_Salon_Facade_remix_01k384ape5eaavk3qn9dbsz6nr_ezqqq3.png"
                alt="Modern computer lab"
                fill
                className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
                priority
              />
              {/* Overlay effect */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-40 group-hover:opacity-20 transition-opacity"></div>
              <div className="absolute bottom-4 left-4 text-white z-10">
                <h2 className="text-xl font-semibold">TechVision Institute</h2>
                <p className="text-sm opacity-90">Computer Science & Technology</p>
              </div>
            </div>

            {/* Google Maps */}
            <div className="relative rounded-2xl shadow-md overflow-hidden w-full h-[400px] sm:h-[500px] lg:h-[950px] border border-gray-300">
              <iframe
                title="Campus Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d101504.41098877287!2d-122.15028494999999!3d37.41329995!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x808fb7495bec0189%3A0x7c17d44a466baf9b!2sMountain%20View%2C%20CA%2C%20USA!5e0!3m2!1sen!2sin!4v1755030438575!5m2!1sen!2sin"
                className="w-full h-full"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Our Faculty Section */}
      <motion.section 
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        variants={container}
        className="mt-20"
      >
        <motion.h2 variants={item} className="text-center text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
          Meet Our Faculty
        </motion.h2>
        <motion.p variants={item} className="text-center text-gray-600 text-lg mb-12">
          Industry Experts Passionate About Your Success
        </motion.p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 px-4 sm:px-8">
          {/* Professor Card 1 */}
          <motion.div 
            variants={item}
            whileHover={{ y: -10 }}
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 border border-blue-100 hover:border-blue-300"
          >
            <div className="relative rounded-2xl shadow-md overflow-hidden w-full h-[800px] sm:h-[500px] lg:h-[370px] group">
              <Image
                src="https://res.cloudinary.com/dtg4pxws2/image/upload/v1755845511/WhatsApp_Image_2025-08-22_at_12.19.52_PM_nn6vjo.jpg"
                alt="Dr. Sarah Johnson"
                fill
                className="h-[500px]"
              />
            </div>
            <div className="p-6 text-center">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Dr. Sarah Johnson</h3>
              <p className="text-blue-600 text-sm font-medium">Artificial Intelligence</p>
              <p className="text-gray-500 text-xs mt-2">PhD in Computer Science, Stanford</p>
            </div>
          </motion.div>
                    
          {/* Professor Card 2 */}
          <motion.div 
            variants={item}
            whileHover={{ y: -10 }}
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 border border-blue-100 hover:border-blue-300"
          >
            <div className="relative rounded-2xl shadow-md overflow-hidden w-full h-[800px] sm:h-[500px] lg:h-[370px] group">
              <Image
                src="https://res.cloudinary.com/dtg4pxws2/image/upload/v1755845511/WhatsApp_Image_2025-08-22_at_12.19.51_PM_1_btiufw.jpg"
                alt="Prof. Michael Chen"
                fill
                className="h-[500px]"
              />
            </div>
            <div className="p-6 text-center">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Prof. Michael Chen</h3>
              <p className="text-blue-600 text-sm font-medium">Software Engineering</p>
              <p className="text-gray-500 text-xs mt-2">Former Google Tech Lead</p>
            </div>
          </motion.div>

          {/* Professor Card 3 */}
          <motion.div 
            variants={item}
            whileHover={{ y: -10 }}
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 border border-blue-100 hover:border-blue-300"
          >
            <div className="relative rounded-2xl shadow-md overflow-hidden w-full h-[800px] sm:h-[500px] lg:h-[370px] group">
              <Image
                src="https://res.cloudinary.com/dtg4pxws2/image/upload/v1755845510/WhatsApp_Image_2025-08-22_at_12.19.53_PM_vyyawp.jpg"
                alt="Dr. Emily Rodriguez"
                fill
                className="h-[500px]"
              />
            </div>
            <div className="p-6 text-center">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Dr. Emily Rodriguez</h3>
              <p className="text-blue-600 text-sm font-medium">Data Science</p>
              <p className="text-gray-500 text-xs mt-2">15+ years research experience</p>
            </div>
          </motion.div>

          {/* Professor Card 4 */}
          <motion.div 
            variants={item}
            whileHover={{ y: -10 }}
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 border border-blue-100 hover:border-blue-300"
          >
            <div className="relative rounded-2xl shadow-md overflow-hidden w-full h-[800px] sm:h-[500px] lg:h-[370px] group">
              <Image
                src="https://res.cloudinary.com/dtg4pxws2/image/upload/v1755845510/WhatsApp_Image_2025-08-22_at_12.19.52_PM_2_uadcwv.jpg"
                alt="Prof. David Kim"
                fill
                className="h-[500px]"
              />
            </div>
            <div className="p-6 text-center">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Prof. David Kim</h3>
              <p className="text-blue-600 text-sm font-medium">Cybersecurity</p>
              <p className="text-gray-500 text-xs mt-2">Industry Certified Expert</p>
            </div>
          </motion.div>

          {/* Professor Card 5 */}
          <motion.div 
            variants={item}
            whileHover={{ y: -10 }}
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 border border-blue-100 hover:border-blue-300"
          >
            <div className="relative rounded-2xl shadow-md overflow-hidden w-full h-[800px] sm:h-[500px] lg:h-[370px] group">
              <Image
                src="https://res.cloudinary.com/dtg4pxws2/image/upload/v1755845511/WhatsApp_Image_2025-08-22_at_12.19.51_PM_npmbei.jpg"
                alt="Dr. Amanda Wilson"
                fill
                className="h-[500px]"
              />
            </div>
            <div className="p-6 text-center">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Dr. Amanda Wilson</h3>
              <p className="text-blue-600 text-sm font-medium">Machine Learning</p>
              <p className="text-gray-500 text-xs mt-2">Published Researcher</p>
            </div>
          </motion.div>

          {/* Professor Card 6 */}
          <motion.div 
            variants={item}
            whileHover={{ y: -10 }}
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 border border-blue-100 hover:border-blue-300"
          >
            <div className="relative rounded-2xl shadow-md overflow-hidden w-full h-[800px] sm:h-[500px] lg:h-[370px] group">
              <Image
                src="https://res.cloudinary.com/dtg4pxws2/image/upload/v1755845510/WhatsApp_Image_2025-08-22_at_12.19.52_PM_1_fukd5x.jpg"
                alt="Prof. James Anderson"
                fill
                className="h-[500px]"
              />
            </div>
            <div className="p-6 text-center">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Prof. James Anderson</h3>
              <p className="text-blue-600 text-sm font-medium">Web Development</p>
              <p className="text-gray-500 text-xs mt-2">Full-Stack Specialist</p>
            </div>
          </motion.div>

          {/* Professor Card 7 */}
          <motion.div 
            variants={item}
            whileHover={{ y: -10 }}
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 border border-blue-100 hover:border-blue-300"
          >
            <div className="relative rounded-2xl shadow-md overflow-hidden w-full h-[800px] sm:h-[500px] lg:h-[370px] group">
              <Image
                src="https://res.cloudinary.com/dtg4pxws2/image/upload/v1755852497/WhatsApp_Image_2025-08-22_at_2.11.45_PM_2_n4cowd.jpg"
                alt="Dr. Lisa Thompson"
                fill
                className="h-[500px]"
              />
            </div>
            <div className="p-6 text-center">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Dr. Lisa Thompson</h3>
              <p className="text-blue-600 text-sm font-medium">Cloud Computing</p>
              <p className="text-gray-500 text-xs mt-2">AWS Certified Architect</p>
            </div>
          </motion.div>

          {/* Professor Card 8 */}
          <motion.div 
            variants={item}
            whileHover={{ y: -10 }}
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 border border-blue-100 hover:border-blue-300"
          >
            <div className="relative rounded-2xl shadow-md overflow-hidden w-full h-[800px] sm:h-[500px] lg:h-[370px] group">
              <Image
                src="https://res.cloudinary.com/dtg4pxws2/image/upload/v1755852497/WhatsApp_Image_2025-08-22_at_2.11.45_PM_3_yiiabm.jpg"
                alt="Prof. Robert Martinez"
                fill
                className="h-[500px]"
              />
            </div>
            <div className="p-6 text-center">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Prof. Robert Martinez</h3>
              <p className="text-blue-600 text-sm font-medium">Networking</p>
              <p className="text-gray-500 text-xs mt-2">Cisco Certified Instructor</p>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Programs Section */}
      <motion.section 
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        variants={container}
        className="mt-20 bg-white py-16 rounded-xl shadow-lg"
      >
        <motion.h2 variants={item} className="text-center text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
          Our Programs
        </motion.h2>
        <motion.p variants={item} className="text-center text-gray-600 text-lg mb-12">
          Comprehensive Computer Science Education
        </motion.p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-8">
          <motion.div variants={item} className="text-center p-6 bg-blue-50 rounded-lg">
            <h3 className="text-xl font-semibold text-blue-800 mb-3">Bachelor's Degrees</h3>
            <p className="text-gray-600">4-year comprehensive programs in various CS specializations</p>
          </motion.div>
          
          <motion.div variants={item} className="text-center p-6 bg-blue-50 rounded-lg">
            <h3 className="text-xl font-semibold text-blue-800 mb-3">Master's Programs</h3>
            <p className="text-gray-600">Advanced studies for specialized career paths</p>
          </motion.div>
          
          <motion.div variants={item} className="text-center p-6 bg-blue-50 rounded-lg">
            <h3 className="text-xl font-semibold text-blue-800 mb-3">Certification Courses</h3>
            <p className="text-gray-600">Short-term industry-recognized certifications</p>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

export default About;