'use client'
import { useState } from 'react';
import StudentSearch from '@/app/components/editStudent/StudentSearch';
import StudentForm from '@/app/components/editStudent/StudentForm';
import ClipLoader from 'react-spinners/ClipLoader'; 

export default function StudentManager() {
  const [student, setStudent] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Student Management Portal</h1>
          <p className="text-gray-600">Search, view, and edit student records with ease</p>
        </div>
        
        <StudentSearch 
          onStudentLoad={setStudent}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        />
        
        {isLoading && (
          <div className="flex justify-center my-8">
            <ClipLoader color="#4F46E5" size={50} /> {/* Indigo spinner */}
          </div>
        )}
        
        {student && (
          <StudentForm
            student={student}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            onStudentUpdate={setStudent}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
          />
        )}
      </div>
    </div>
  );
}
