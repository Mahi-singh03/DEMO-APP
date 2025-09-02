"use client"
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Head from 'next/head';
import Link from 'next/link';

export default function StudentDetail() {
  const params = useParams();
  const { id } = params;
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('personal');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({ newPassword: '', confirmPassword: '' });

  useEffect(() => {
    if (id) {
      fetchStudent();
    }
  }, [id]);

  const fetchStudent = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/student/manageStudents/${id}`);
      const data = await response.json();

      if (data.success) {
        setStudent(data.data);
        setEditData(data.data);
      } else {
        setMessage({ type: 'error', text: 'Student not found' });
      }
    } catch (error) {
      console.error('Error fetching student:', error);
      setMessage({ type: 'error', text: 'Error loading student data' });
    } finally {
      setLoading(false);
    }
  };

  const calculateFarewellDate = (joiningDate, duration) => {
    const date = new Date(joiningDate);
    let monthsToAdd = 0;
    
    switch(duration) {
      case '3 Months': monthsToAdd = 3; break;
      case '6 Months': monthsToAdd = 6; break;
      case '1 Year': monthsToAdd = 12; break;
      default: monthsToAdd = 0;
    }
    
    return new Date(date.setMonth(date.getMonth() + monthsToAdd));
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);
    return `${day}-${month}-${year}`;
  };

  const generateCertificationTitle = (course, duration) => {
    if (course === 'Computer Course') {
      switch (duration) {
        case '3 Months': return 'CERTIFICATION IN COMPUTER APPLICATION';
        case '6 Months': return 'DIPLOMA IN COMPUTER APPLICATION';
        case '1 Year': return 'ADVANCE DIPLOMA IN COMPUTER APPLICATION';
        default: return course;
      }
    } 
    else if (course === 'HTML, CSS, JS') {
      switch (duration) {
        case '3 Months': return 'CERTIFICATION IN WEB DEVELOPMENT FUNDAMENTALS';
        case '6 Months': return 'DIPLOMA IN FRONT-END DEVELOPMENT';
        case '1 Year': return 'ADVANCE DIPLOMA IN FRONT-END DEVELOPMENT';
        default: return course;
      }
    }
    else if (course === 'ChatGPT and AI tools') {
      switch (duration) {
        case '3 Months': return 'CERTIFICATION IN AI TOOLS';
        case '6 Months': return 'DIPLOMA IN GENERATIVE AI APPLICATIONS';
        case '1 Year': return 'ADVANCE DIPLOMA IN GENERATIVE AI APPLICATIONS';
        default: return course;
      }
    }
    else if (course === 'Industrial Training') return 'INDUSTRIAL TRAINING CERTIFICATION';
    else if (course === 'React') {
      switch (duration) {
        case '3 Months': return 'CERTIFICATION IN REACT JS';
        case '6 Months': return 'ADVANCED CERTIFICATION IN REACT JS';
        default: return course;
      }
    }
    else if (course === 'MERN FullStack') {
      switch (duration) {
        case '6 Months': return 'CERTIFICATION IN MERN STACK DEVELOPMENT';
        case '1 Year': return 'DIPLOMA IN FULL STACK DEVELOPMENT';
        default: return course;
      }
    }
    else if (course === 'CorelDRAW') {
      switch (duration) {
        case '3 Months': return 'CERTIFICATION IN GRAPHIC DESIGN';
        case '6 Months': return 'DIPLOMA IN GRAPHIC DESIGN';
        default: return course;
      }
    }
    else if (course === 'Tally') {
      switch (duration) {
        case '3 Months': return 'CERTIFICATION IN TALLY';
        case '6 Months': return 'DIPLOMA IN ACCOUNTING SOFTWARE';
        default: return course;
      }
    }
    else if (course === 'Premier Pro') {
      switch (duration) {
        case '3 Months': return 'CERTIFICATION IN VIDEO EDITING';
        case '6 Months': return 'DIPLOMA IN VIDEO PRODUCTION';
        default: return course;
      }
    }
    else if (course === 'WordPress') {
      switch (duration) {
        case '3 Months': return 'CERTIFICATION IN WORDPRESS';
        case '6 Months': return 'DIPLOMA IN CMS DEVELOPMENT';
        default: return course;
      }
    }
    else if (course === 'MS Office') {
      switch (duration) {
        case '3 Months': return 'CERTIFICATION IN OFFICE PRODUCTIVITY';
        case '6 Months': return 'DIPLOMA IN OFFICE AUTOMATION';
        default: return course;
      }
    }
    else if (course === 'PTE') return 'PTE TRAINING CERTIFICATION';
    else if (course === 'AutoCAD') {
      switch (duration) {
        case '3 Months': return 'CERTIFICATION IN AUTOCAD';
        case '6 Months': return 'DIPLOMA IN COMPUTER-AIDED DESIGN';
        default: return course;
      }
    }
    else return course;
  };

  const handleSave = async () => {
    try {
      // Generate certification title based on course and duration
      const certificationTitle = generateCertificationTitle(
        editData.selectedCourse, 
        editData.courseDuration
      );
      
      // Calculate farewell date if course or duration changed
      if (editData.joiningDate && editData.courseDuration) {
        editData.farewellDate = calculateFarewellDate(
          editData.joiningDate, 
          editData.courseDuration
        );
      }

      const response = await fetch(`/api/admin/student/manageStudents/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...editData,
          certificationTitle
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: 'success', text: 'Student updated successfully' });
        setStudent(data.data);
        setIsEditing(false);
        fetchStudent(); // Refresh data
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to update student' });
      }
    } catch (error) {
      console.error('Error updating student:', error);
      setMessage({ type: 'error', text: 'Error updating student' });
    }
  };

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters' });
      return;
    }

    try {
      const response = await fetch(`/api/admin/student/manageStudents/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password: passwordData.newPassword }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: 'success', text: 'Password updated successfully' });
        setShowPasswordModal(false);
        setPasswordData({ newPassword: '', confirmPassword: '' });
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to update password' });
      }
    } catch (error) {
      console.error('Error updating password:', error);
      setMessage({ type: 'error', text: 'Error updating password' });
    }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const formData = new FormData();
    formData.append('photo', file);
    
    try {
      const response = await fetch(`/api/admin/student/manageStudents/${id}/photo`, {
        method: 'PUT',
        body: formData,
      });
      
      const data = await response.json();
      
      if (data.success) {
        setMessage({ type: 'success', text: 'Photo updated successfully' });
        fetchStudent(); // Refresh student data
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to upload photo' });
      }
    } catch (error) {
      console.error('Error uploading photo:', error);
      setMessage({ type: 'error', text: 'Error uploading photo' });
    }
  };

  const handleCertificateToggle = async () => {
    try {
      const response = await fetch(`/api/admin/student/manageStudents/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ certificate: !student.certificate }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: 'success', text: `Certificate ${!student.certificate ? 'issued' : 'revoked'} successfully` });
        fetchStudent(); // Refresh student data
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to update certificate status' });
      }
    } catch (error) {
      console.error('Error updating certificate status:', error);
      setMessage({ type: 'error', text: 'Error updating certificate status' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-600">Loading student data...</p>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Student not found</h2>
          <Link 
            href="/mahi/admin/students/manageStudents" 
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Students
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>{student.fullName} - Student Management System</title>
      </Head>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-blur bg-opacity-40 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 animate-scaleIn">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Change Password</h3>
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                  placeholder="Enter new password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                  placeholder="Confirm new password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3">
              <button 
                onClick={() => setShowPasswordModal(false)} 
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handlePasswordChange} 
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Change Password
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <Link 
            href="/mahi/students/manageStudents" 
            className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors font-medium"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Students
          </Link>
          
          <h1 className="text-3xl font-bold text-gray-900">Student Details</h1>
          
          <div className="flex flex-wrap gap-2">
            <button 
              onClick={() => setShowPasswordModal(true)} 
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
            >
              Change Password
            </button>
            {isEditing ? (
              <>
                <button 
                  onClick={() => setIsEditing(false)} 
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSave} 
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Save Changes
                </button>
              </>
            ) : (
              <button 
                onClick={() => setIsEditing(true)} 
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Edit Student
              </button>
            )}
          </div>
        </div>

        {message.text && (
          <div className={`mb-6 p-4 rounded-lg flex justify-between items-center animate-slideDown ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {message.text}
            <button 
              onClick={() => setMessage({ type: '', text: '' })} 
              className="text-xl font-bold"
            >
              ×
            </button>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8 animate-fadeIn">
          <div className="p-6 flex flex-col md:flex-row gap-6">
            <div className="flex flex-col items-center">
              <div className="relative">
                {student.photo?.url ? (
                  <img 
                    src={student.photo.url} 
                    alt={student.fullName} 
                    className="w-32 h-32 rounded-xl object-cover shadow-md" 
                  />
                ) : (
                  <div className="w-32 h-32 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-2xl font-bold shadow-md">
                    {student.fullName.split(' ').map(n => n[0]).join('')}
                  </div>
                )}
                {isEditing && (
                  <label className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-md cursor-pointer hover:bg-gray-100 transition-colors">
                    <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                    <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </label>
                )}
              </div>
              
              <div className="mt-4 flex flex-col items-center">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${new Date() > new Date(student.farewellDate) ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                  {new Date() > new Date(student.farewellDate) ? 'Completed' : 'Ongoing'}
                </span>
                
                <div className="mt-2 flex items-center">
                  <span className="text-sm text-gray-600 mr-2">Certificate:</span>
                  <button 
                    className={`text-xs font-medium px-2 py-1 rounded ${student.certificate ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'} hover:opacity-90 transition-opacity`}
                    onClick={handleCertificateToggle}
                  >
                    {student.certificate ? 'Issued' : 'Not Issued'}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{student.fullName}</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Roll No:</p>
                  <p className="font-medium">{student.rollNo}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Course:</p>
                  <p className="font-medium">{student.selectedCourse} ({student.courseDuration})</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Certification:</p>
                  <p className="font-medium">{student.certificationTitle}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Joining Date:</p>
                  <p className="font-medium">{formatDate(student.joiningDate)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Completion Date:</p>
                  <p className="font-medium">{formatDate(student.farewellDate)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8 animate-fadeIn">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                className={`py-4 px-6 text-center font-medium text-sm border-b-2 transition-colors ${activeTab === 'personal' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                onClick={() => setActiveTab('personal')}
              >
                Personal Info
              </button>
              <button
                className={`py-4 px-6 text-center font-medium text-sm border-b-2 transition-colors ${activeTab === 'academic' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                onClick={() => setActiveTab('academic')}
              >
                Academic Info
              </button>
            </nav>
          </div>
          
          <div className="p-6">
            {activeTab === 'personal' && (
              <div className="animate-fadeIn">
                <h3 className="text-lg font-medium text-gray-900 mb-6">Personal Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name:</label>
                    {isEditing ? (
                      <input 
                        type="text" 
                        value={editData.fullName || ''} 
                        onChange={(e) => setEditData({...editData, fullName: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      />
                    ) : (
                      <p className="px-4 py-2 bg-gray-50 rounded-lg">{student.fullName}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Gender:</label>
                    {isEditing ? (
                      <select 
                        value={editData.gender || ''} 
                        onChange={(e) => setEditData({...editData, gender: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    ) : (
                      <p className="px-4 py-2 bg-gray-50 rounded-lg">{student.gender}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Father's Name:</label>
                    {isEditing ? (
                      <input 
                        type="text" 
                        value={editData.fatherName || ''} 
                        onChange={(e) => setEditData({...editData, fatherName: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      />
                    ) : (
                      <p className="px-4 py-2 bg-gray-50 rounded-lg">{student.fatherName}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Mother's Name:</label>
                    {isEditing ? (
                      <input 
                        type="text" 
                        value={editData.motherName || ''} 
                        onChange={(e) => setEditData({...editData, motherName: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      />
                    ) : (
                      <p className="px-4 py-2 bg-gray-50 rounded-lg">{student.motherName}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth:</label>
                    {isEditing ? (
                      <input 
                        type="date" 
                        value={editData.dateOfBirth ? new Date(editData.dateOfBirth).toISOString().split('T')[0] : ''} 
                        onChange={(e) => setEditData({...editData, dateOfBirth: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      />
                    ) : (
                      <p className="px-4 py-2 bg-gray-50 rounded-lg">{formatDate(student.dateOfBirth)}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Aadhar Number:</label>
                    {isEditing ? (
                      <input 
                        type="text" 
                        value={editData.aadharNumber || ''} 
                        onChange={(e) => setEditData({...editData, aadharNumber: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      />
                    ) : (
                      <p className="px-4 py-2 bg-gray-50 rounded-lg">{student.aadharNumber}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email:</label>
                    {isEditing ? (
                      <input 
                        type="email" 
                        value={editData.emailAddress || ''} 
                        onChange={(e) => setEditData({...editData, emailAddress: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      />
                    ) : (
                      <p className="px-4 py-2 bg-gray-50 rounded-lg">{student.emailAddress}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone:</label>
                    {isEditing ? (
                      <input 
                        type="text" 
                        value={editData.phoneNumber || ''} 
                        onChange={(e) => setEditData({...editData, phoneNumber: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      />
                    ) : (
                      <p className="px-4 py-2 bg-gray-50 rounded-lg">{student.phoneNumber}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Parent's Phone:</label>
                    {isEditing ? (
                      <input 
                        type="text" 
                        value={editData.parentsPhoneNumber || ''} 
                        onChange={(e) => setEditData({...editData, parentsPhoneNumber: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      />
                    ) : (
                      <p className="px-4 py-2 bg-gray-50 rounded-lg">{student.parentsPhoneNumber}</p>
                    )}
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Address:</label>
                    {isEditing ? (
                      <textarea 
                        value={editData.address || ''} 
                        onChange={(e) => setEditData({...editData, address: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        rows="3"
                      />
                    ) : (
                      <p className="px-4 py-2 bg-gray-50 rounded-lg">{student.address}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Qualification:</label>
                    {isEditing ? (
                      <select 
                        value={editData.qualification || ''} 
                        onChange={(e) => setEditData({...editData, qualification: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      >
                        <option value="10th">10th</option>
                        <option value="12th">12th</option>
                        <option value="Graduated">Graduated</option>
                      </select>
                    ) : (
                      <p className="px-4 py-2 bg-gray-50 rounded-lg">{student.qualification}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'academic' && (
              <div className="animate-fadeIn">
                <h3 className="text-lg font-medium text-gray-900 mb-6">Academic Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Selected Course:</label>
                    {isEditing ? (
                      <select 
                        value={editData.selectedCourse || ''} 
                        onChange={(e) => {
                          const newCourse = e.target.value;
                          const newCertificationTitle = generateCertificationTitle(newCourse, editData.courseDuration);
                          const newFarewellDate = calculateFarewellDate(editData.joiningDate, editData.courseDuration);
                          
                          setEditData({
                            ...editData, 
                            selectedCourse: newCourse,
                            certificationTitle: newCertificationTitle,
                            farewellDate: newFarewellDate
                          });
                        }}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      >
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
                    ) : (
                      <p className="px-4 py-2 bg-gray-50 rounded-lg">{student.selectedCourse}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Course Duration:</label>
                    {isEditing ? (
                      <select 
                        value={editData.courseDuration || ''} 
                        onChange={(e) => {
                          const newDuration = e.target.value;
                          const newCertificationTitle = generateCertificationTitle(editData.selectedCourse, newDuration);
                          const newFarewellDate = calculateFarewellDate(editData.joiningDate, newDuration);
                          
                          setEditData({
                            ...editData, 
                            courseDuration: newDuration,
                            certificationTitle: newCertificationTitle,
                            farewellDate: newFarewellDate
                          });
                        }}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      >
                        <option value="3 Months">3 Months</option>
                        <option value="6 Months">6 Months</option>
                        <option value="1 Year">1 Year</option>
                      </select>
                    ) : (
                      <p className="px-4 py-2 bg-gray-50 rounded-lg">{student.courseDuration}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Certification Title:</label>
                    {isEditing ? (
                      <input 
                        type="text" 
                        value={editData.certificationTitle || ''} 
                        readOnly
                        className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg"
                      />
                    ) : (
                      <p className="px-4 py-2 bg-gray-50 rounded-lg">{student.certificationTitle}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Joining Date:</label>
                    {isEditing ? (
                      <input 
                        type="date" 
                        value={editData.joiningDate ? new Date(editData.joiningDate).toISOString().split('T')[0] : ''} 
                        onChange={(e) => {
                          const newDate = e.target.value;
                          const newFarewellDate = calculateFarewellDate(newDate, editData.courseDuration);
                          
                          setEditData({
                            ...editData, 
                            joiningDate: newDate,
                            farewellDate: newFarewellDate
                          });
                        }}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      />
                    ) : (
                      <p className="px-4 py-2 bg-gray-50 rounded-lg">{formatDate(student.joiningDate)}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Completion Date:</label>
                    {isEditing ? (
                      <input 
                        type="date" 
                        value={editData.farewellDate ? new Date(editData.farewellDate).toISOString().split('T')[0] : ''} 
                        readOnly
                        className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg"
                      />
                    ) : (
                      <p className="px-4 py-2 bg-gray-50 rounded-lg">{formatDate(student.farewellDate)}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Certificate Issued:</label>
                    <div className="flex items-center">
                      <span className="mr-3 px-4 py-2 bg-gray-50 rounded-lg">{student.certificate ? 'Yes' : 'No'}</span>
                      {isEditing && (
                        <button 
                          className={`px-3 py-1 rounded text-sm font-medium ${student.certificate ? 'bg-red-100 text-red-800 hover:bg-red-200' : 'bg-green-100 text-green-800 hover:bg-green-200'} transition-colors`}
                          onClick={handleCertificateToggle}
                        >
                          {student.certificate ? 'Revoke' : 'Issue'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes scaleIn {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        
        @keyframes slideDown {
          from { transform: translateY(-10px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        
        .animate-scaleIn {
          animation: scaleIn 0.2s ease-out;
        }
        
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}