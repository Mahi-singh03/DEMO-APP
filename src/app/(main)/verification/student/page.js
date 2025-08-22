"use client";
import { useState } from 'react';

export default function StudentVerification() {
  const [rollNo, setRollNo] = useState('');
  const [dob, setDob] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [studentData, setStudentData] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setStudentData(null);

    try {
      const response = await fetch('/api/varification/student', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rollNo, dob }),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessage = data.error || 'Verification failed';
        throw new Error(errorMessage);
      }

      setStudentData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Function to mask Aadhar number (show only last 4 digits)
  const maskAadhar = (aadhar) => {
    if (!aadhar) return 'N/A';
    const aadharString = String(aadhar);
    if (aadharString.length <= 4) return aadharString;
    return `XXXX-XXXX-${aadharString.slice(-4)}`;
  };

  // Function to handle certificate status display
  const getCertificateStatus = (status) => {
    if (status === null || status === undefined || status === '') {
      return 'Not Issued';
    }
    return status;
  };

  return (
    <div className=" flex  justify-center bg-[#e8efff] pb-80">
      <div className="w-full max-w-3xl bg-white/90 rounded-3xl shadow-2xl overflow-hidden transform transition-all duration-300 hover:shadow-3xl mt-8 mb-8 border border-blue-200 backdrop-blur-md">
        <div className="bg-[#51a4f4] p-8 text-white text-center rounded-b-3xl shadow-md">
          <h1 className="text-4xl font-extrabold mb-2 tracking-tight drop-shadow-lg">Student Verification</h1>
          <p className="opacity-95 text-lg font-medium">Verify your student details quickly and securely</p>
        </div>

        <div className="p-8 md:p-10">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label htmlFor="rollNo" className="block text-base font-semibold text-blue-700 mb-2 tracking-wide">
                  Roll Number
                </label>
                <input
                  id="rollNo"
                  type="text"
                  value={rollNo}
                  onChange={(e) => setRollNo(e.target.value)}
                  className="w-full px-5 py-3 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 bg-blue-50 text-blue-900 placeholder-blue-400 shadow-sm"
                  placeholder="Enter your Roll Number"
                  required
                />
              </div>
              <div>
                <label htmlFor="dob" className="block text-base font-semibold text-blue-700 mb-2 tracking-wide">
                  Date of Birth
                </label>
                <input
                  id="dob"
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full px-5 py-3 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 bg-blue-50 text-blue-900 placeholder-blue-400 shadow-sm"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-[#51a4f4] text-white py-3 rounded-xl font-bold flex items-center justify-center transition-all duration-300 transform hover:scale-[1.03] shadow-lg text-lg tracking-wide ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-2xl'}`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Verifying...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                  </svg>
                  Verify Student
                </>
              )}
            </button>
          </form>

          {error && (
            <div className="mt-8 bg-red-100/80 border-l-4 border-red-500 p-5 rounded-xl animate-fade-in shadow-md flex items-center gap-3">
              <svg className="h-6 w-6 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span className="text-base text-red-700 font-medium">{error}</span>
            </div>
          )}

          {studentData && (
            <div className="mt-10 bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 rounded-2xl p-8 relative overflow-hidden shadow-xl border border-blue-200">
              {/* Verification Stamp */}
              <div className="absolute top-8 -right-8 bg-green-500 text-white font-extrabold py-2 px-14 rotate-45 transform origin-center shadow-lg opacity-95 text-2xl tracking-widest drop-shadow-xl">
                VERIFIED
              </div>
              <div className="bg-white/90 rounded-2xl p-8 shadow-inner border border-blue-100">
                <div className="flex flex-col md:flex-row justify-between items-start mb-8 pb-4 border-b border-blue-100 gap-6">
                  <div>
                    <h2 className="text-3xl font-extrabold text-blue-800 mb-1 tracking-tight">{studentData.data.name}</h2>
                    <p className="text-blue-600 font-medium text-lg">Roll No: {rollNo}</p>
                  </div>
                  {studentData.data.photo && studentData.data.photo.url ? (
                    <div className="bg-blue-100 p-2 rounded-full shadow-md">
                      <img 
                        src={studentData.data.photo.url} 
                        alt="Student" 
                        className="w-16 h-16 rounded-full object-cover border-2 border-white"
                      />
                    </div>
                  ) : (
                    <div className="bg-blue-100 p-2 rounded-full shadow-md">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-300 to-indigo-300 flex items-center justify-center text-white font-bold text-xl">
                        {studentData.data.name.split(' ').map(n => n[0]).join('')}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xs font-semibold text-blue-500 uppercase mb-1 tracking-wider">Father's Name</h3>
                    <p className="text-lg font-bold text-blue-900">{studentData.data.parentsName.fatherName}</p>
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-blue-500 uppercase mb-1 tracking-wider">Mother's Name</h3>
                    <p className="text-lg font-bold text-blue-900">{studentData.data.parentsName.motherName}</p>
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-blue-500 uppercase mb-1 tracking-wider">Course Duration</h3>
                    <p className="text-lg font-bold text-blue-900">{studentData.data.courseDuration}</p>
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-blue-500 uppercase mb-1 tracking-wider">Start Date</h3>
                    <p className="text-lg font-bold text-blue-900">
                      {new Date(studentData.data.startDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-blue-500 uppercase mb-1 tracking-wider">End Date</h3>
                    <p className="text-lg font-bold text-blue-900">
                      {studentData.data.endDate ? new Date(studentData.data.endDate).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-blue-500 uppercase mb-1 tracking-wider">Aadhar Number</h3>
                    <p className="text-lg font-bold text-blue-900">{maskAadhar(studentData.data.aadharNumber)}</p>
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-blue-500 uppercase mb-1 tracking-wider">Percentage</h3>
                    <p className="text-lg font-bold text-blue-900">{studentData.data.percentage}%</p>
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-blue-500 uppercase mb-1 tracking-wider">Phone Number</h3>
                    <p className="text-lg font-bold text-blue-900">{studentData.data.phoneNumber}</p>
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-blue-500 uppercase mb-1 tracking-wider">Final Grade</h3>
                    <p className="text-lg font-bold text-blue-900">{studentData.data.finalGrade}</p>
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-blue-500 uppercase mb-1 tracking-wider">Certificate Status</h3>
                    <p className="text-lg font-bold text-blue-900">{getCertificateStatus(studentData.data.certificate)}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}