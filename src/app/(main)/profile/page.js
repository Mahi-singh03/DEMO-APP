'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaUser, FaVenusMars, FaMale, FaFemale, FaPhone, FaBirthdayCake, 
  FaEnvelope, FaIdCard, FaHome, FaGraduationCap, FaCalendarAlt, 
  FaSignOutAlt, FaBook, FaClock, FaCertificate, FaStar, FaCheckCircle,
  FaMoneyBillWave, FaFileInvoiceDollar, FaChartLine, FaFileAlt,
  FaBookOpen, FaCode, FaClipboardList, FaChartBar, FaRocket,
  FaUniversity, FaIdBadge, FaAward, FaChevronLeft, FaChevronRight,
  FaGraduationCap as FaGradCap
} from 'react-icons/fa';
import defaultProfilePic from '../../../../public/tom.gif';
import Image from 'next/image';

const Profile = () => {
    const [studentData, setStudentData] = useState({});
    const [profilePic, setProfilePic] = useState(defaultProfilePic);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('personal');
    const [isScrolled, setIsScrolled] = useState(false);
    const tabsRef = useRef(null);
    const router = useRouter();

    // Format date in Indian format
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-IN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } catch {
            return dateString;
        }
    };

    // Load student data from localStorage
    useEffect(() => {
        const loadData = async () => {
            try {
                const storedUser = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
                if (storedUser) {
                    const parsedUser = JSON.parse(storedUser);
                    const userData = parsedUser.student || parsedUser;
                    
                    // Format dates and process data
                    const formattedData = {
                        ...userData,
                        dateOfBirth: formatDate(userData.dateOfBirth),
                        joiningDate: formatDate(userData.joiningDate),
                        farewellDate: formatDate(userData.farewellDate),
                        createdAt: formatDate(userData.createdAt),
                        updatedAt: formatDate(userData.updatedAt),
                        feeDetails: userData.feeDetails ? {
                            ...userData.feeDetails,
                            installmentDetails: userData.feeDetails.installmentDetails?.map(installment => ({
                                ...installment,
                                submissionDate: formatDate(installment.submissionDate)
                            }))
                        } : null,
                        examResults: userData.examResults?.map(exam => ({
                            ...exam,
                            examDate: formatDate(exam.examDate)
                        }))
                    };
                    
                    setStudentData(formattedData);
                    
                    // Set profile picture - use Cloudinary URL if available
                    if (userData.photo?.url) {
                        setProfilePic(userData.photo.url);
                    }
                }
            } catch (error) {
                console.error('Error loading student data:', error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    // Handle scroll for header styling
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Handle image loading errors
    const handleImageError = (e) => {
        e.target.src = defaultProfilePic.src;
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

    // Tab navigation with scroll buttons
    const scrollTabs = (direction) => {
        if (tabsRef.current) {
            const scrollAmount = 200;
            tabsRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    // Render personal details section
    const renderPersonalDetails = () => (
        <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {[
                { key: 'fullName', label: 'Full Name', icon: <FaUser className="text-blue-500" /> },
                { key: 'gender', label: 'Gender', icon: <FaVenusMars className="text-pink-500" /> },
                { key: 'fatherName', label: "Father's Name", icon: <FaMale className="text-blue-600" /> },
                { key: 'motherName', label: "Mother's Name", icon: <FaFemale className="text-pink-600" /> },
                { key: 'parentsPhoneNumber', label: "Parents' Phone", icon: <FaPhone className="text-green-500" /> },
                { key: 'dateOfBirth', label: 'Date of Birth', icon: <FaBirthdayCake className="text-amber-500" /> },
                { key: 'emailAddress', label: 'Email Address', icon: <FaEnvelope className="text-red-400" /> },
                { key: 'phoneNumber', label: 'Phone Number', icon: <FaPhone className="text-blue-400" /> },
                { key: 'aadharNumber', label: 'Aadhar Number', icon: <FaIdCard className="text-purple-500" /> },
                { key: 'address', label: 'Address', icon: <FaHome className="text-teal-500" /> },
                { key: 'qualification', label: 'Qualification', icon: <FaGraduationCap className="text-gray-600" /> },
                { key: 'joiningDate', label: 'Joining Date', icon: <FaCalendarAlt className="text-green-600" /> },
                { key: 'farewellDate', label: 'Farewell Date', icon: <FaSignOutAlt className="text-red-500" /> },
            ].map((item, index) => (
                <motion.div 
                    key={item.key} 
                    className="bg-white p-4 md:p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300"
                    variants={itemVariants}
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                >
                    <div className="flex items-center mb-2">
                        <span className="text-xl md:text-2xl mr-3">{item.icon}</span>
                        <p className="text-sm font-medium text-gray-600">{item.label}</p>
                    </div>
                    <p className="mt-1 text-lg md:text-xl font-semibold text-gray-800">
                        {studentData[item.key] || 'N/A'}
                    </p>
                </motion.div>
            ))}
        </motion.div>
    );

    // Render course details section
    const renderCourseDetails = () => (
        <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {[
                { key: 'rollNo', label: 'Roll Number', icon: <FaIdBadge className="text-blue-500" /> },
                { key: 'selectedCourse', label: 'Course', icon: <FaBook className="text-purple-500" /> },
                { key: 'courseDuration', label: 'Duration', icon: <FaClock className="text-amber-500" /> },
                { key: 'certificationTitle', label: 'Certification', icon: <FaCertificate className="text-teal-500" /> },
                { key: 'createdAt', label: 'Enrollment Date', icon: <FaCalendarAlt className="text-green-500" /> },
                { key: 'finalGrade', label: 'Final Grade', icon: <FaStar className="text-amber-500" /> },
                { key: 'certificate', label: 'Certificate Issued', icon: <FaAward className="text-red-500" />, format: (val) => val ? 'Yes' : 'No' },
            ].map((item, index) => (
                <motion.div 
                    key={item.key} 
                    className="bg-white p-4 md:p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300"
                    variants={itemVariants}
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                >
                    <div className="flex items-center mb-2">
                        <span className="text-xl md:text-2xl mr-3">{item.icon}</span>
                        <p className="text-sm font-medium text-gray-600">{item.label}</p>
                    </div>
                    <p className="mt-1 text-lg md:text-xl font-semibold text-gray-800">
                        {item.format ? item.format(studentData[item.key]) : (studentData[item.key] || 'N/A')}
                    </p>
                </motion.div>
            ))}
        </motion.div>
    );

    // Render fee details section
    const renderFeeDetails = () => {
        if (!studentData.feeDetails) {
            return (
                <motion.div 
                    className="text-center py-8 md:py-12"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="bg-white p-6 md:p-8 rounded-xl border border-gray-100 shadow-sm">
                        <FaMoneyBillWave className="text-5xl md:text-6xl mx-auto mb-4 text-gray-300" />
                        <p className="text-gray-500 text-lg md:text-xl">No fee details available</p>
                    </div>
                </motion.div>
            );
        }

        return (
            <motion.div 
                className="space-y-6 md:space-y-8"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                    {[
                        { key: 'totalFees', label: 'Total Fees', icon: <FaMoneyBillWave className="text-green-500" />, prefix: '₹' },
                        { key: 'remainingFees', label: 'Remaining Fees', icon: <FaChartLine className="text-red-500" />, prefix: '₹' },
                        { key: 'installments', label: 'Installments', icon: <FaFileInvoiceDollar className="text-blue-500" /> },
                    ].map((item, index) => (
                        <motion.div 
                            key={item.key}
                            className="bg-white p-5 md:p-6 rounded-xl border border-gray-100 shadow-sm"
                            variants={itemVariants}
                            whileHover={{ y: -5, transition: { duration: 0.2 } }}
                        >
                            <div className="flex items-center mb-3">
                                <span className="text-2xl md:text-3xl mr-3">{item.icon}</span>
                                <p className="text-sm font-medium text-gray-600">{item.label}</p>
                            </div>
                            <p className="mt-1 text-xl md:text-2xl font-bold text-gray-800">
                                {item.prefix || ''}{studentData.feeDetails[item.key] || 'N/A'}
                            </p>
                        </motion.div>
                    ))}
                </div>

                {studentData.feeDetails.installmentDetails?.length > 0 && (
                    <motion.div variants={itemVariants}>
                        <h3 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6 text-gray-800 flex items-center">
                            <FaFileInvoiceDollar className="mr-3 text-blue-500" /> Installment Details
                        </h3>
                        <div className="overflow-x-auto rounded-xl border border-gray-100 shadow-sm">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 md:px-6 md:py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                        <th className="px-4 py-3 md:px-6 md:py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                        <th className="px-4 py-3 md:px-6 md:py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {studentData.feeDetails.installmentDetails.map((installment, index) => (
                                        <motion.tr 
                                            key={index} 
                                            className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            whileHover={{ backgroundColor: '#f8fafc' }}
                                        >
                                            <td className="px-4 py-3 md:px-6 md:py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {installment.amount ? `₹${installment.amount}` : 'N/A'}
                                            </td>
                                            <td className="px-4 py-3 md:px-6 md:py-4 whitespace-nowrap text-sm text-gray-500">
                                                {installment.submissionDate || 'N/A'}
                                            </td>
                                            <td className="px-4 py-3 md:px-6 md:py-4 whitespace-nowrap text-sm">
                                                <motion.span 
                                                    className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${installment.paid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                                                    whileHover={{ scale: 1.05 }}
                                                >
                                                    {installment.paid ? 'Paid' : 'Pending'}
                                                </motion.span>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                )}
            </motion.div>
        );
    };

    // Render exam results section
    const renderExamResults = () => {
        if (!studentData.examResults || studentData.examResults.length === 0) {
            return (
                <motion.div 
                    className="text-center py-8 md:py-12"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="bg-white p-6 md:p-8 rounded-xl border border-gray-100 shadow-sm">
                        <FaFileAlt className="text-5xl md:text-6xl mx-auto mb-4 text-gray-300" />
                        <p className="text-gray-500 text-lg md:text-xl mb-4">No exam results available yet</p>
                        <motion.button 
                            onClick={() => router.push('/weekly-exam')}
                            className="px-6 py-3 md:px-8 md:py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 flex items-center justify-center mx-auto shadow-md"
                            whileHover={{ scale: 1.03, boxShadow: '0 10px 25px -5px rgba(59, 130, 246, 0.4)' }}
                            whileTap={{ scale: 0.97 }}
                        >
                            <FaRocket className="mr-2" />
                            <span className="text-sm md:text-base">Take Exam</span>
                        </motion.button>
                    </div>
                </motion.div>
            );
        }

        return (
            <motion.div 
                className="overflow-x-auto rounded-xl border border-gray-100 shadow-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 md:px-6 md:py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                            <th className="px-4 py-3 md:px-6 md:py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                            <th className="px-4 py-3 md:px-6 md:py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="px-4 py-3 md:px-6 md:py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Theory</th>
                            <th className="px-4 py-3 md:px-6 md:py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Practical</th>
                            <th className="px-4 py-3 md:px-6 md:py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {studentData.examResults.map((exam, index) => (
                            <motion.tr 
                                key={index} 
                                className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ backgroundColor: '#f8fafc' }}
                            >
                                <td className="px-4 py-3 md:px-6 md:py-4 text-sm font-medium text-gray-900">
                                    <div className="flex items-center">
                                        <FaBookOpen className="mr-3 text-blue-500 flex-shrink-0" /> 
                                        <span>{exam.subjectName || 'N/A'}</span>
                                    </div>
                                </td>
                                <td className="px-4 py-3 md:px-6 md:py-4 text-sm text-gray-500">
                                    <div className="flex items-center">
                                        <FaCode className="mr-3 text-purple-500 flex-shrink-0" /> 
                                        <span>{exam.subjectCode || 'N/A'}</span>
                                    </div>
                                </td>
                                <td className="px-4 py-3 md:px-6 md:py-4 text-sm text-gray-500">
                                    <div className="flex items-center">
                                        <FaCalendarAlt className="mr-3 text-green-500 flex-shrink-0" /> 
                                        <span>{exam.examDate || 'N/A'}</span>
                                    </div>
                                </td>
                                <td className="px-4 py-3 md:px-6 md:py-4 text-sm text-gray-500">
                                    <div className="flex items-center">
                                        <FaClipboardList className="mr-3 text-amber-500 flex-shrink-0" /> 
                                        <span>{exam.theoryMarks ?? 'N/A'}</span>
                                    </div>
                                </td>
                                <td className="px-4 py-3 md:px-6 md:py-4 text-sm text-gray-500">
                                    <div className="flex items-center">
                                        <FaCode className="mr-3 text-teal-500 flex-shrink-0" /> 
                                        <span>{exam.practicalMarks ?? 'N/A'}</span>
                                    </div>
                                </td>
                                <td className="px-4 py-3 md:px-6 md:py-4 text-sm font-semibold text-gray-900">
                                    <div className="flex items-center">
                                        <FaChartBar className="mr-3 text-red-500 flex-shrink-0" /> 
                                        <span>{(exam.theoryMarks || 0) + (exam.practicalMarks || 0)}</span>
                                    </div>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </motion.div>
        );
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-teal-50">
                <motion.div 
                    className="flex flex-col items-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <motion.div 
                        className="rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mb-4"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                    <p className="text-gray-600">Loading your profile...</p>
                </motion.div>
            </div>
        );
    }

    const tabs = [
        { id: 'personal', label: 'Personal', icon: <FaUser /> },
        { id: 'course', label: 'Course', icon: <FaBook /> },
        { id: 'fees', label: 'Fees', icon: <FaMoneyBillWave /> },
        { id: 'exams', label: 'Exams', icon: <FaFileAlt /> },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 pb-12">
            {/* Profile Header with Large Photo */}
            <motion.div 
                className={`top-0 z-10 transition-all duration-300 ${isScrolled ? 'py-2 bg-white/80 backdrop-blur-md shadow-md' : 'py-6 bg-transparent'}`}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row items-center justify-center md:justify-start">
                        <motion.div 
                            className="relative mb-4 md:mb-0 md:mr-6"
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 100 }}
                        >
                            <div className="relative w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 rounded-full overflow-hidden border-4 border-white shadow-xl">
                                <Image 
                                    src={typeof profilePic === 'string' ? profilePic : profilePic.src}
                                    alt="Profile" 
                                    fill
                                    className="object-cover"
                                    onError={handleImageError}
                                />
                            </div>
                            <motion.div 
                                className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-white px-4 py-1 rounded-full shadow-md text-sm font-medium text-blue-600 flex items-center"
                                whileHover={{ scale: 1.05 }}
                            >
                                <FaIdBadge className="mr-2" />
                                {studentData.rollNo || 'N/A'}
                            </motion.div>
                        </motion.div>
                        
                        <div className="text-center md:text-left">
                            <motion.h1 
                                className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-1"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                            >
                                {studentData.fullName || 'Student Profile'}
                            </motion.h1>
                            <motion.p 
                                className="text-lg md:text-xl text-blue-600 font-medium mb-2"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                {studentData.selectedCourse || 'Course not specified'}
                            </motion.p>
                            <motion.div 
                                className="flex flex-wrap justify-center md:justify-start gap-2"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                            >
                                <span className="bg-blue-100 text-blue-700 text-xs font-medium px-3 py-1 rounded-full">
                                    Joined: {studentData.joiningDate || 'N/A'}
                                </span>
                                {studentData.farewellDate && (
                                    <span className="bg-amber-100 text-amber-700 text-xs font-medium px-3 py-1 rounded-full">
                                        Completed: {studentData.farewellDate}
                                    </span>
                                )}
                            </motion.div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Floating Weekly Exam Button - Mobile Only */}
            <motion.div 
                className="fixed bottom-6 right-6 z-50 md:hidden"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, type: "spring", stiffness: 100 }}
            >
                <motion.button
                    onClick={() => router.push('/weekly-exam')}
                    className="p-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-xl flex items-center justify-center"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.9 }}
                >
                    <FaRocket className="text-xl" />
                </motion.button>
            </motion.div>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
                <div className="flex flex-col">
                    {/* Tabs Navigation with Scroll Buttons */}
                    <motion.div 
                        className="relative mb-6"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        
                        
        
                        
                        <div 
                            ref={tabsRef}
                            className="flex space-x-2 overflow-x-auto scrollbar-hide py-2 px-1"
                        >
                            {tabs.map((tab) => (
                                <motion.button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`px-5 py-3 rounded-xl flex items-center transition-all duration-300 whitespace-nowrap ${activeTab === tab.id 
                                        ? 'bg-blue-500 text-white shadow-lg' 
                                        : 'bg-white text-gray-600 hover:bg-gray-100 shadow-md'}`}
                                    whileHover={{ y: -2 }}
                                    whileTap={{ scale: 0.97 }}
                                >
                                    <span className="mr-2">{tab.icon}</span>
                                    <span className="font-medium">{tab.label}</span>
                                </motion.button>
                            ))}
                            
                            {/* Enhanced Weekly Exam Button for Desktop */}
                            <motion.div
                                className="hidden md:flex items-center ml-2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5 }}
                            >
                                <motion.button
                                    onClick={() => router.push('/weekly-exam')}
                                    className="px-5 py-3 bg-green-600 text-white rounded-xl flex items-center shadow-md whitespace-nowrap"
                                    whileHover={{ 
                                        y: -2, 
                                        scale: 1.02,
                                        boxShadow: "0 10px 25px -5px rgba(79, 70, 229, 0.4)"
                                    }}
                                    whileTap={{ scale: 0.97 }}
                                >
                                    <motion.span
                                        animate={{ 
                                            scale: [1, 1.1, 1],
                                        }}
                                        transition={{ 
                                            repeat: Infinity, 
                                            duration: 2,
                                            ease: "easeInOut"
                                        }}
                                    >
                                        <FaRocket className="mr-2" />
                                    </motion.span>
                                    <span className="font-medium">Weekly Exam</span>
                                </motion.button>
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* Main content */}
                    <motion.div 
                        className="bg-white rounded-2xl shadow-lg p-6 md:p-8"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                    >
                        <div className="flex items-center justify-between mb-6 md:mb-8">
                            <motion.h2 
                                className="text-xl md:text-2xl font-semibold text-gray-800 flex items-center"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                            >
                                <span className="mr-3">
                                    {activeTab === 'personal' && <FaUser className="text-blue-500" />}
                                    {activeTab === 'course' && <FaBook className="text-purple-500" />}
                                    {activeTab === 'fees' && <FaMoneyBillWave className="text-green-500" />}
                                    {activeTab === 'exams' && <FaFileAlt className="text-red-500" />}
                                </span>
                                {activeTab === 'personal' && 'Personal Details'}
                                {activeTab === 'course' && 'Course Details'}
                                {activeTab === 'fees' && 'Fee Details'}
                                {activeTab === 'exams' && 'Exam Results'}
                            </motion.h2>
                            
                            {/* Weekly Exam Button for mobile */}
                            <motion.button 
                                onClick={() => router.push('/weekly-exam')}
                                className="md:hidden px-4 py-2 bg-green-600 text-white rounded-lg flex items-center shadow-md"
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                            >
                                <FaRocket className="mr-2 text-sm" />
                                <span className="text-sm font-medium">Weekly Exam</span>
                            </motion.button>
                        </div>

                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                transition={{ duration: 0.3 }}
                            >
                                {activeTab === 'personal' && renderPersonalDetails()}
                                {activeTab === 'course' && renderCourseDetails()}
                                {activeTab === 'fees' && renderFeeDetails()}
                                {activeTab === 'exams' && renderExamResults()}
                            </motion.div>
                        </AnimatePresence>
                    </motion.div>
                </div>

                {/* Last updated footer */}
                <motion.div 
                    className="mt-6 text-center text-sm text-gray-500 flex items-center justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                >
                    <FaCalendarAlt className="mr-2" /> 
                    <span>Last updated: {studentData.updatedAt || 'N/A'}</span>
                </motion.div>
            </div>
        </div>
    );
};

export default Profile;