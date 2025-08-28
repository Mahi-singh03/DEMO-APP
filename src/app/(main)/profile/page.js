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
  FaUniversity, FaIdBadge, FaAward
} from 'react-icons/fa';
import defaultProfilePic from '../../../../public/tom.gif';
import Image from 'next/image';

const Profile = () => {
    const [studentData, setStudentData] = useState({});
    const [profilePic, setProfilePic] = useState(defaultProfilePic);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('personal');
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

    // Render personal details section
    const renderPersonalDetails = () => (
        <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {[
                { key: 'fullName', label: 'Full Name', icon: <FaUser className="text-blue-400" /> },
                { key: 'gender', label: 'Gender', icon: <FaVenusMars className="text-pink-400" /> },
                { key: 'fatherName', label: "Father's Name", icon: <FaMale className="text-blue-500" /> },
                { key: 'motherName', label: "Mother's Name", icon: <FaFemale className="text-pink-500" /> },
                { key: 'parentsPhoneNumber', label: "Parents' Phone", icon: <FaPhone className="text-green-400" /> },
                { key: 'dateOfBirth', label: 'Date of Birth', icon: <FaBirthdayCake className="text-amber-400" /> },
                { key: 'emailAddress', label: 'Email Address', icon: <FaEnvelope className="text-red-300" /> },
                { key: 'phoneNumber', label: 'Phone Number', icon: <FaPhone className="text-blue-300" /> },
                { key: 'aadharNumber', label: 'Aadhar Number', icon: <FaIdCard className="text-purple-400" /> },
                { key: 'address', label: 'Address', icon: <FaHome className="text-teal-400" /> },
                { key: 'qualification', label: 'Qualification', icon: <FaGraduationCap className="text-gray-500" /> },
                { key: 'joiningDate', label: 'Joining Date', icon: <FaCalendarAlt className="text-green-500" /> },
                { key: 'farewellDate', label: 'Farewell Date', icon: <FaSignOutAlt className="text-red-400" /> },
            ].map((item, index) => (
                <motion.div 
                    key={item.key} 
                    className="bg-white p-3 md:p-4 rounded-lg md:rounded-xl border border-gray-100 hover:shadow-sm transition-all duration-300"
                    variants={itemVariants}
                    whileHover={{ scale: 1.01 }}
                >
                    <div className="flex items-center mb-1 md:mb-2">
                        <span className="text-lg md:text-xl mr-2">{item.icon}</span>
                        <p className="text-xs md:text-sm font-medium text-gray-600">{item.label}</p>
                    </div>
                    <p className="mt-1 text-sm md:text-lg font-semibold text-gray-800">
                        {studentData[item.key] || 'N/A'}
                    </p>
                </motion.div>
            ))}
        </motion.div>
    );

    // Render course details section
    const renderCourseDetails = () => (
        <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {[
                { key: 'rollNo', label: 'Roll Number', icon: <FaIdBadge className="text-blue-400" /> },
                { key: 'selectedCourse', label: 'Course', icon: <FaBook className="text-purple-400" /> },
                { key: 'courseDuration', label: 'Duration', icon: <FaClock className="text-amber-400" /> },
                { key: 'certificationTitle', label: 'Certification', icon: <FaCertificate className="text-teal-400" /> },
                { key: 'createdAt', label: 'Enrollment Date', icon: <FaCalendarAlt className="text-green-400" /> },
                { key: 'finalGrade', label: 'Final Grade', icon: <FaStar className="text-amber-400" /> },
                { key: 'certificate', label: 'Certificate Issued', icon: <FaAward className="text-red-400" />, format: (val) => val ? 'Yes' : 'No' },
            ].map((item, index) => (
                <motion.div 
                    key={item.key} 
                    className="bg-white p-3 md:p-4 rounded-lg md:rounded-xl border border-gray-100 hover:shadow-sm transition-all duration-300"
                    variants={itemVariants}
                    whileHover={{ scale: 1.01 }}
                >
                    <div className="flex items-center mb-1 md:mb-2">
                        <span className="text-lg md:text-xl mr-2">{item.icon}</span>
                        <p className="text-xs md:text-sm font-medium text-gray-600">{item.label}</p>
                    </div>
                    <p className="mt-1 text-sm md:text-lg font-semibold text-gray-800">
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
                    className="text-center py-6 md:py-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="bg-white p-4 md:p-6 rounded-lg md:rounded-xl border border-gray-100">
                        <FaMoneyBillWave className="text-4xl md:text-5xl mx-auto mb-3 md:mb-4 text-gray-300" />
                        <p className="text-gray-500 text-sm md:text-lg">No fee details available</p>
                    </div>
                </motion.div>
            );
        }

        return (
            <motion.div 
                className="space-y-4 md:space-y-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
                    {[
                        { key: 'totalFees', label: 'Total Fees', icon: <FaMoneyBillWave className="text-green-400" />, prefix: '₹' },
                        { key: 'remainingFees', label: 'Remaining Fees', icon: <FaChartLine className="text-red-400" />, prefix: '₹' },
                        { key: 'installments', label: 'Installments', icon: <FaFileInvoiceDollar className="text-blue-400" /> },
                    ].map((item, index) => (
                        <motion.div 
                            key={item.key}
                            className="bg-white p-3 md:p-4 rounded-lg md:rounded-xl border border-gray-100"
                            variants={itemVariants}
                            whileHover={{ scale: 1.01 }}
                        >
                            <div className="flex items-center mb-1 md:mb-2">
                                <span className="text-lg md:text-xl mr-2">{item.icon}</span>
                                <p className="text-xs md:text-sm font-medium text-gray-600">{item.label}</p>
                            </div>
                            <p className="mt-1 text-lg md:text-xl font-bold text-gray-800">
                                {item.prefix || ''}{studentData.feeDetails[item.key] || 'N/A'}
                            </p>
                        </motion.div>
                    ))}
                </div>

                {studentData.feeDetails.installmentDetails?.length > 0 && (
                    <motion.div variants={itemVariants}>
                        <h3 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 text-gray-800 flex items-center">
                            <FaFileInvoiceDollar className="mr-2 text-blue-400" /> Installment Details
                        </h3>
                        <div className="overflow-x-auto rounded-lg md:rounded-xl border border-gray-100">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-3 py-2 md:px-4 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                        <th className="px-3 py-2 md:px-4 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                        <th className="px-3 py-2 md:px-4 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
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
                                        >
                                            <td className="px-3 py-2 md:px-4 md:py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {installment.amount ? `₹${installment.amount}` : 'N/A'}
                                            </td>
                                            <td className="px-3 py-2 md:px-4 md:py-3 whitespace-nowrap text-sm text-gray-500">
                                                {installment.submissionDate || 'N/A'}
                                            </td>
                                            <td className="px-3 py-2 md:px-4 md:py-3 whitespace-nowrap text-sm">
                                                <motion.span 
                                                    className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${installment.paid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
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
                    className="text-center py-6 md:py-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="bg-white p-4 md:p-6 rounded-lg md:rounded-xl border border-gray-100">
                        <FaFileAlt className="text-4xl md:text-5xl mx-auto mb-3 md:mb-4 text-gray-300" />
                        <p className="text-gray-500 text-sm md:text-lg mb-3 md:mb-4">No exam results available yet</p>
                        <motion.button 
                            onClick={() => router.push('/Exams/Weekly-Exam')}
                            className="px-4 py-2 md:px-6 md:py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg md:rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 flex items-center justify-center mx-auto shadow-sm"
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                        >
                            <FaRocket className="mr-2 text-sm" />
                            <span className="text-sm md:text-base">Take Exam</span>
                        </motion.button>
                    </div>
                </motion.div>
            );
        }

        return (
            <motion.div 
                className="overflow-x-auto rounded-lg md:rounded-xl border border-gray-100"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-3 py-2 md:px-4 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                            <th className="px-3 py-2 md:px-4 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                            <th className="px-3 py-2 md:px-4 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="px-3 py-2 md:px-4 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Theory</th>
                            <th className="px-3 py-2 md:px-4 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Practical</th>
                            <th className="px-3 py-2 md:px-4 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
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
                                whileHover={{ backgroundColor: '#f9fafb' }}
                            >
                                <td className="px-3 py-2 md:px-4 md:py-3 text-sm font-medium text-gray-900">
                                    <div className="flex items-center">
                                        <FaBookOpen className="mr-2 text-blue-400 flex-shrink-0" /> 
                                        <span>{exam.subjectName || 'N/A'}</span>
                                    </div>
                                </td>
                                <td className="px-3 py-2 md:px-4 md:py-3 text-sm text-gray-500">
                                    <div className="flex items-center">
                                        <FaCode className="mr-2 text-purple-400 flex-shrink-0" /> 
                                        <span>{exam.subjectCode || 'N/A'}</span>
                                    </div>
                                </td>
                                <td className="px-3 py-2 md:px-4 md:py-3 text-sm text-gray-500">
                                    <div className="flex items-center">
                                        <FaCalendarAlt className="mr-2 text-green-400 flex-shrink-0" /> 
                                        <span>{exam.examDate || 'N/A'}</span>
                                    </div>
                                </td>
                                <td className="px-3 py-2 md:px-4 md:py-3 text-sm text-gray-500">
                                    <div className="flex items-center">
                                        <FaClipboardList className="mr-2 text-amber-400 flex-shrink-0" /> 
                                        <span>{exam.theoryMarks ?? 'N/A'}</span>
                                    </div>
                                </td>
                                <td className="px-3 py-2 md:px-4 md:py-3 text-sm text-gray-500">
                                    <div className="flex items-center">
                                        <FaCode className="mr-2 text-teal-400 flex-shrink-0" /> 
                                        <span>{exam.practicalMarks ?? 'N/A'}</span>
                                    </div>
                                </td>
                                <td className="px-3 py-2 md:px-4 md:py-3 text-sm font-semibold text-gray-900">
                                    <div className="flex items-center">
                                        <FaChartBar className="mr-2 text-red-400 flex-shrink-0" /> 
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
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <motion.div 
                    className="flex flex-col items-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <motion.div 
                        className="rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-400 mb-3"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                    <p className="text-gray-500 text-sm">Loading your profile...</p>
                </motion.div>
            </div>
        );
    }

    const tabs = [
        { id: 'personal', label: 'Personal', icon: <FaUser className="text-sm md:text-base" /> },
        { id: 'course', label: 'Course', icon: <FaBook className="text-sm md:text-base" /> },
        { id: 'fees', label: 'Fees', icon: <FaMoneyBillWave className="text-sm md:text-base" /> },
        { id: 'exams', label: 'Exams', icon: <FaFileAlt className="text-sm md:text-base" /> },
    ];

    return (
        <div className="min-h-screen bg-[#e3f1f1] py-4 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                {/* Profile Header - Always Visible */}
                <motion.div 
                    className="bg-white rounded-xl shadow-sm p-4 mb-4 flex items-center"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="relative mr-4">
                        <Image 
                            src={typeof profilePic === 'string' ? profilePic : profilePic.src}
                            alt="Profile" 
                            width={70}
                            height={70}
                            className="w-40 h-40 md:w-20 md:h-20  border-2 border-white shadow-sm object-cover"
                            onError={handleImageError}
                        />
                    </div>
                    <div className="flex-1">
                        <h1 className="text-lg md:text-xl font-semibold text-gray-800">{studentData.fullName || 'Student Profile'}</h1>
                        <p className="text-sm text-blue-500">{studentData.selectedCourse || 'Course not specified'}</p>
                        <div className="mt-1">
                            <span className="bg-blue-50 text-blue-700 text-xs font-medium px-2 py-1 rounded-full">
                                <FaIdBadge className="inline mr-1" /> Roll No: {studentData.rollNo || 'N/A'}
                            </span>
                        </div>
                    </div>
                </motion.div>

                <div className="flex flex-col">
                    {/* Tabs Navigation - Single row with scrolling on mobile */}
                    <div className="bg-white rounded-xl shadow-sm p-2 mb-4 overflow-x-auto">
                        <div className="flex space-x-1 min-w-max">
                            {tabs.map((tab) => (
                                <motion.button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`px-4 py-2 rounded-lg flex items-center transition-all duration-300 ${activeTab === tab.id ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <span className="mr-2">{tab.icon}</span>
                                    <span className="text-sm font-medium">{tab.label}</span>
                                </motion.button>
                            ))}
                        </div>
                    </div>

                    {/* Main content */}
                    <motion.div 
                        className="bg-white rounded-xl shadow-sm p-4 md:p-6"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="flex items-center justify-between mb-4 md:mb-6">
                            <h2 className="text-lg md:text-xl font-semibold text-gray-800 flex items-center">
                                <span className="mr-2">
                                    {activeTab === 'personal' && <FaUser className="text-blue-400" />}
                                    {activeTab === 'course' && <FaBook className="text-purple-400" />}
                                    {activeTab === 'fees' && <FaMoneyBillWave className="text-green-400" />}
                                    {activeTab === 'exams' && <FaFileAlt className="text-red-400" />}
                                </span>
                                {activeTab === 'personal' && 'Personal Details'}
                                {activeTab === 'course' && 'Course Details'}
                                {activeTab === 'fees' && 'Fee Details'}
                                {activeTab === 'exams' && 'Exam Results'}
                            </h2>
                            
                            {/* Weekly Exam Button - Always visible on mobile */}
                            <motion.button 
                                onClick={() => router.push('/weekly-exam')}
                                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg flex items-center shadow-sm"
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
                                transition={{ duration: 0.2 }}
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
                <div className="mt-4 text-center text-xs text-gray-400">
                    <FaCalendarAlt className="inline mr-1" /> Last updated: {studentData.updatedAt || 'N/A'}
                </div>
            </div>
        </div>
    );
};

export default Profile;