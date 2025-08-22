// 'use client'
// import { useState } from 'react';
// import StudentSearch from '@/app/components/editStudent/StudentSearch';
// import StudentForm from '@/app/components/editStudent/StudentForm';
// import ClipLoader from 'react-spinners/ClipLoader';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// export default function StudentManager() {
//   const [student, setStudent] = useState(null);
//   const [isEditing, setIsEditing] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [searchError, setSearchError] = useState(null);

//   const handleStudentLoad = (studentData) => {
//     setStudent(studentData);
//     setSearchError(null);
//   };

//   const handleSearchError = (error) => {
//     setSearchError(error);
//     setStudent(null);
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8 px-4 sm:px-6 lg:px-8">
//       <ToastContainer
//         position="top-right"
//         autoClose={5000}
//         hideProgressBar={false}
//         newestOnTop={false}
//         closeOnClick
//         rtl={false}
//         pauseOnFocusLoss
//         draggable
//         pauseOnHover
//         theme="light"
//       />
//       <div className="max-w-6xl mx-auto">
//         <div className="text-center mb-8 animate-fade-in">
//           <h1 className="text-3xl font-bold text-gray-900 mb-2">Student Management Portal</h1>
//           <p className="text-gray-600">Search, view, and edit student records with ease</p>
//         </div>
        
//         <StudentSearch 
//           onStudentLoad={handleStudentLoad}
//           onSearchError={handleSearchError}
//           isLoading={isLoading}
//           setIsLoading={setIsLoading}
//         />
        
//         {isLoading && (
//           <div className="flex flex-col items-center justify-center my-8 p-6 bg-white rounded-lg shadow-md">
//             <ClipLoader color="#4F46E5" size={50} />
//             <p className="mt-4 text-gray-600">Searching for student records...</p>
//           </div>
//         )}
        
//         {searchError && !isLoading && (
//           <div className="my-6 p-4 bg-red-50 border border-red-200 rounded-lg text-center animate-fade-in">
//             <div className="flex flex-col items-center justify-center">
//               <svg className="w-12 h-12 text-red-500 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//               </svg>
//               <h3 className="text-lg font-medium text-red-800 mb-1">Student Not Found</h3>
//               <p className="text-red-600">{searchError}</p>
//               <p className="text-sm text-red-500 mt-2">Please check the details and try again</p>
//             </div>
//           </div>
//         )}
        
//         {student && (
//           <StudentForm
//             student={student}
//             isEditing={isEditing}
//             setIsEditing={setIsEditing}
//             onStudentUpdate={setStudent}
//             isLoading={isLoading}
//             setIsLoading={setIsLoading}
//           />
//         )}
//       </div>
//     </div>
//   );
// }