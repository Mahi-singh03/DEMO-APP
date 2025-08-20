// components/editStudent/StudentForm.js
'use client'
import { useState } from 'react';
import { FiEdit, FiSave, FiX, FiAward, FiPlus, FiTrash2, FiChevronDown, FiChevronUp, FiDollarSign, FiBarChart2, FiUser } from 'react-icons/fi';
import { toast } from 'react-toastify';
import axios from 'axios';
import PhotoUpload from './PhotoUpload';
import InstallmentManager from './InstallmentManager';
import ExamResultsManager from './ExamResultsManager';
import ClipLoader from 'react-spinners/ClipLoader'; 
import { FiLock } from "react-icons/fi";

const StudentForm = ({ student, isEditing, setIsEditing, onStudentUpdate, isLoading, setIsLoading }) => {
  const [formData, setFormData] = useState(student);
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(student.photo?.url || '');
  const [expandedSections, setExpandedSections] = useState({
    personal: true,
    academic: true,
    financial: true,
    exams: true
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const formDataToSend = new FormData();
      
      // Append all form data
      for (const key in formData) {
        if (formData[key] !== null && formData[key] !== undefined) {
          if (key === 'photo') continue;
          
          if (typeof formData[key] === 'object') {
            formDataToSend.append(key, JSON.stringify(formData[key]));
          } else {
            formDataToSend.append(key, formData[key]);
          }
        }
      }
      
      // Handle date fields
      const dateFields = ['dateOfBirth', 'joiningDate', 'farewellDate'];
      dateFields.forEach(field => {
        if (formData[field]) {
          formDataToSend.append(field, new Date(formData[field]).toISOString());
        }
      });
      
      // Append file if exists
      if (file) {
        formDataToSend.append('photo', file);
      }
  
      const response = await axios.put(`/api/admin/student/editStudent/${student._id}`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      onStudentUpdate(response.data.student);
      setIsEditing(false);
      toast.success('Student updated successfully!');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update student');
    } finally {
      setIsLoading(false);
    }
  };

  const cancelEdit = () => {
    setFormData(student);
    setFile(null);
    setPreviewUrl(student.photo?.url || '');
    setIsEditing(false);
  };

  if (!student) return null;

  return (
    <div className="bg-white shadow-lg overflow-hidden rounded-2xl mb-8 animate-fade-in-up">
      <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center">
            <div className="relative h-14 w-14 rounded-full bg-white border-2 border-white shadow-md overflow-hidden mr-4">
              {student.photo?.url ? (
                <img src={student.photo.url} alt={student.fullName} className="h-full w-full object-cover" />
              ) : (
                <div className="h-full w-full flex items-center justify-center bg-blue-100 text-blue-600">
                  <FiUser className="h-6 w-6" />
                </div>
              )}
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                {student.fullName} - {student.rollNo}
              </h3>
              <p className="text-sm text-gray-600">
                {student.selectedCourse} {student.courseDuration && `(${student.courseDuration})`}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-xl shadow-sm text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-md"
              >
                <FiEdit className="mr-2" /> Edit Student
              </button>
            ) : (
              <>
                <button
                  onClick={cancelEdit}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-xl shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300"
                >
                  <FiX className="mr-2" /> Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-xl shadow-sm text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-md"
                >
                  {isLoading ? (
                    <>
                      <div className="flex justify-center my-8">
                       <ClipLoader color="#4F46E5" size={50} /> {/* Indigo spinner */}
                       </div>
                    </>
                  ) : (
                    <>
                      <FiSave className="mr-2" /> Save Changes
                    </>
                  )}
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {isEditing ? (
       <form onSubmit={handleSubmit} className="divide-y divide-gray-200">
      {/* Personal Information Section */}
      <div className="px-6 py-5">
        <div 
          className="flex items-center justify-between cursor-pointer group" 
          onClick={() => toggleSection('personal')}
        >
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">Personal Information</h3>
          <span className="text-gray-500 group-hover:text-blue-600 transition-colors duration-200">
            {expandedSections.personal ? <FiChevronUp /> : <FiChevronDown />}
          </span>
        </div>
        
        {expandedSections.personal && (
          <div className="mt-4 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6 animate-fade-in">
            <PhotoUpload 
              previewUrl={previewUrl}
              onFileChange={setFile}
              currentPhoto={student.photo}
            />
            
            <div className="sm:col-span-5 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName || ''}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors duration-200"
                  required
                />
              </div>
              
              <div className="sm:col-span-3">
                <label className="block text-sm font-medium text-gray-700">Email Address</label>
                <input
                  type="email"
                  name="emailAddress"
                  value={formData.emailAddress || ''}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors duration-200"
                  required
                />
              </div>
              
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber || ''}
                  onChange={handleChange}
                  pattern="[0-9]{10}"
                  className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors duration-200"
                  required
                />
              </div>
              
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth ? new Date(formData.dateOfBirth).toISOString().split('T')[0] : ''}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors duration-200"
                  required
                />
              </div>
              
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Gender</label>
                <select
                  name="gender"
                  value={formData.gender || ''}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors duration-200"
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div className="sm:col-span-3">
                <label className="block text-sm font-medium text-gray-700">Father's Name</label>
                <input
                  type="text"
                  name="fatherName"
                  value={formData.fatherName || ''}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors duration-200"
                  required
                />
              </div>
              
              <div className="sm:col-span-3">
                <label className="block text-sm font-medium text-gray-700">Mother's Name</label>
                <input
                  type="text"
                  name="motherName"
                  value={formData.motherName || ''}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors duration-200"
                  required
                />
              </div>
              
              <div className="sm:col-span-3">
                <label className="block text-sm font-medium text-gray-700">Parents Phone Number</label>
                <input
                  type="tel"
                  name="parentsPhoneNumber"
                  value={formData.parentsPhoneNumber || ''}
                  onChange={handleChange}
                  pattern="[0-9]{10}"
                  className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors duration-200"
                  required
                />
              </div>
              
              <div className="sm:col-span-3">
                <label className="block text-sm font-medium text-gray-700">Aadhar Number</label>
                <input
                  type="text"
                  name="aadharNumber"
                  value={formData.aadharNumber || ''}
                  onChange={handleChange}
                  pattern="[0-9]{12}"
                  className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors duration-200"
                  required
                />
              </div>
              
              <div className="sm:col-span-3">
                <label className="block text-sm font-medium text-gray-700">Qualification</label>
                <select
                  name="qualification"
                  value={formData.qualification || ''}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors duration-200"
                  required
                >
                  <option value="">Select Qualification</option>
                  <option value="10th">10th</option>
                  <option value="12th">12th</option>
                  <option value="Graduated">Graduated</option>
                </select>
              </div>
              
              <div className="sm:col-span-3">
                <label className="block text-sm font-medium text-gray-700">Certificate Issued</label>
                <div className="mt-2 flex items-center">
                  <input
                    type="checkbox"
                    name="certificate"
                    checked={formData.certificate || false}
                    onChange={(e) => setFormData({...formData, certificate: e.target.checked})}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-900">Certificate has been issued</label>
                </div>
              </div>
              
              <div className="sm:col-span-6">
                <label className="block text-sm font-medium text-gray-700">Address</label>
                <textarea
                  name="address"
                  value={formData.address || ''}
                  onChange={handleChange}
                  rows={3}
                  className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors duration-200"
                  required
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Academic Information Section */}
      <div className="px-6 py-5">
        <div 
          className="flex items-center justify-between cursor-pointer group" 
          onClick={() => toggleSection('academic')}
        >
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">Academic Information</h3>
          <span className="text-gray-500 group-hover:text-blue-600 transition-colors duration-200">
            {expandedSections.academic ? <FiChevronUp /> : <FiChevronDown />}
          </span>
        </div>
        
        {expandedSections.academic && (
          <div className="mt-4 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6 animate-fade-in">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Roll Number</label>
              <input
                type="text"
                name="rollNo"
                value={formData.rollNo || ''}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors duration-200"
                required
              />
            </div>
            
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Selected Course</label>
              <select
                name="selectedCourse"
                value={formData.selectedCourse || ''}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors duration-200"
                required
              >
                <option value="">Select Course</option>
                <option value="HTML, CSS, JS">HTML, CSS, JS</option>
                <option value="ChatGPT and AI tools">ChatGPT and AI tools</option>
                <option value="Industrial Training">Industrial Training</option>
                <option value="React">React</option>
                <option value="MERN FullStack">MERN FullStack</option>
                <option value="CorelDRAW">CorelDRAW</option>
                <option value="Tally">Tally</option>
                <option value="Premier Pro">Premier Pro</option>
                <option value="WordPress">WordPress</option>
                <option value="Computer Course">Computer Course</option>
                <option value="MS Office">MS Office</option>
                <option value="PTE">PTE</option>
                <option value="AutoCAD">AutoCAD</option>
              </select>
            </div>
            
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Course Duration</label>
              <select
                name="courseDuration"
                value={formData.courseDuration || ''}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors duration-200"
                required
              >
                <option value="">Select Duration</option>
                <option value="3 Months">3 Months</option>
                <option value="6 Months">6 Months</option>
                <option value="1 Year">1 Year</option>
              </select>
            </div>
            
            <div className="sm:col-span-3">
              <label className="block text-sm font-medium text-gray-700">Certification Title</label>
              <input
                type="text"
                name="certificationTitle"
                value={formData.certificationTitle || ''}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors duration-200"
              />
            </div>
            
            <div className="sm:col-span-3">
              <label className="block text-sm font-medium text-gray-700">Current Semester</label>
              <input
                type="number"
                name="currentSemester"
                value={formData.currentSemester || ''}
                onChange={handleChange}
                min="1"
                max="8"
                className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors duration-200"
              />
            </div>
            
            <div className="sm:col-span-3">
              <label className="block text-sm font-medium text-gray-700">Joining Date</label>
              <input
                type="date"
                name="joiningDate"
                value={formData.joiningDate ? new Date(formData.joiningDate).toISOString().split('T')[0] : ''}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors duration-200"
                required
              />
            </div>
            
            <div className="sm:col-span-3">
              <label className="block text-sm font-medium text-gray-700">Farewell Date</label>
              <input
                type="date"
                name="farewellDate"
                value={formData.farewellDate ? new Date(formData.farewellDate).toISOString().split('T')[0] : ''}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors duration-200"
              />
            </div>
          </div>
        )}
      </div>

      {/* Password Update Section */}
      <div className="px-6 py-5">
        <div 
          className="flex items-center justify-between cursor-pointer group" 
          onClick={() => toggleSection('password')}
        >
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200 flex items-center">
            <FiLock className="mr-2" /> Password Update
          </h3>
          <span className="text-gray-500 group-hover:text-blue-600 transition-colors duration-200">
            {expandedSections.password ? <FiChevronUp /> : <FiChevronDown />}
          </span>
        </div>
        
        {expandedSections.password && (
          <div className="mt-4 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6 animate-fade-in">
            <div className="sm:col-span-3">
              <label className="block text-sm font-medium text-gray-700">New Password</label>
              <input
                type="password"
                name="password"
                value={formData.password || ''}
                onChange={handleChange}
                minLength="6"
                className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors duration-200"
                placeholder="Enter new password"
              />
            </div>
            
            <div className="sm:col-span-3">
              <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword || ''}
                onChange={handleChange}
                minLength="6"
                className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors duration-200"
                placeholder="Confirm new password"
              />
            </div>
            
            <div className="sm:col-span-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-700">
                  <strong>Note:</strong> Password must be at least 6 characters long. Leave these fields blank if you don't want to change the password.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Financial Information Section */}
      <div className="px-6 py-5">
        <div 
          className="flex items-center justify-between cursor-pointer group" 
          onClick={() => toggleSection('financial')}
        >
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200 flex items-center">
            <FiDollarSign className="mr-2" /> Financial Information
          </h3>
          <span className="text-gray-500 group-hover:text-blue-600 transition-colors duration-200">
            {expandedSections.financial ? <FiChevronUp /> : <FiChevronDown />}
          </span>
        </div>
        
        {expandedSections.financial && (
          <div className="mt-4 animate-fade-in">
            <InstallmentManager 
              feeDetails={formData.feeDetails}
              onFeeDetailsChange={(newFeeDetails) => {
                setFormData(prev => ({ ...prev, feeDetails: newFeeDetails }));
              }}
            />
          </div>
        )}
      </div>

      {/* Exam Results Section */}
      <div className="px-6 py-5">
        <div 
          className="flex items-center justify-between cursor-pointer group" 
          onClick={() => toggleSection('exams')}
        >
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200 flex items-center">
            <FiBarChart2 className="mr-2" /> Exam Results
          </h3>
          <span className="text-gray-500 group-hover:text-blue-600 transition-colors duration-200">
            {expandedSections.exams ? <FiChevronUp /> : <FiChevronDown />}
          </span>
        </div>
        
        {expandedSections.exams && (
          <div className="mt-4 animate-fade-in">
            <ExamResultsManager 
              examResults={formData.examResults}
              selectedCourse={formData.selectedCourse}
              onExamResultsChange={(newExamResults) => {
                setFormData(prev => ({ ...prev, examResults: newExamResults }));
              }}
            />
          </div>
        )}
      </div>
      
      {/* Submit Button */}
      <div className="px-6 py-4 bg-gray-50 text-right">
        <button
          type="submit"
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
        >
          Save Changes
        </button>
      </div>
    </form>
      ) : (
        // View mode (non-editing)
        <div className="px-6 py-5">
          <div className="flex flex-col sm:flex-row gap-6">
            {/* Student photo and basic info */}
            <div className="flex-shrink-0">
              <div className="relative h-40 w-40 rounded-full bg-gray-200 overflow-hidden border-4 border-white shadow-lg mx-auto">
                {student.photo?.url ? (
                  <img src={student.photo.url} alt={student.fullName} className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-gray-400">
                    <FiUser className="h-16 w-16" />
                  </div>
                )}
              </div>
              <div className="mt-4 text-center">
                <h3 className="text-xl font-bold text-gray-900">{student.fullName}</h3>
                <p className="text-sm text-gray-600">{student.rollNo}</p>
                <p className="text-sm text-blue-600 font-medium mt-1">{student.selectedCourse}</p>
              </div>
            </div>
            
            {/* Student details */}
            <div className="flex-1 space-y-6">
              {/* Personal Information */}
              <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Personal Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Email</p>
                    <p className="text-sm text-gray-900">{student.emailAddress || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Phone</p>
                    <p className="text-sm text-gray-900">{student.phoneNumber || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Date of Birth</p>
                    <p className="text-sm text-gray-900">
                      {student.dateOfBirth ? new Date(student.dateOfBirth).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Address</p>
                    <p className="text-sm text-gray-900">{student.address || 'N/A'}</p>
                  </div>
                </div>
              </div>
              
              {/* Academic Information */}
              <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Academic Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Certificate Title</p>
                    <p className="text-sm text-gray-900">{student.certificationTitle || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Course Duration</p>
                    <p className="text-sm text-gray-900">{student.courseDuration || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Joining Date</p>
                    <p className="text-sm text-gray-900">
                      {student.joiningDate ? new Date(student.joiningDate).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Farewell Date</p>
                    {student.joiningDate ? new Date(student.farewellDate).toLocaleDateString() : 'N/A'}
                  </div>
                </div>
              </div>
  
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentForm;