import { FiPlus, FiTrash2, FiAward } from 'react-icons/fi';
import { COURSE_SUBJECTS, SUBJECT_DETAILS } from '@/app/utils/SubjectCodeAndName';

const ExamResultsManager = ({ examResults, selectedCourse, onExamResultsChange }) => {
  const addExamResult = () => {
    onExamResultsChange([
      ...examResults,
      {
        subjectCode: '',
        subjectName: '',
        theoryMarks: 0,
        practicalMarks: 0,
        totalMarks: 0,
        examDate: new Date().toISOString().split('T')[0]
      }
    ]);
  };

  const removeExamResult = (index) => {
    const newResults = [...examResults];
    newResults.splice(index, 1);
    onExamResultsChange(newResults);
  };

  const updateExamResult = (index, field, value) => {
    const newResults = [...examResults];
    newResults[index] = {
      ...newResults[index],
      [field]: value
    };

    // Auto-calculate total marks
    if (field === 'theoryMarks' || field === 'practicalMarks') {
      const theory = parseFloat(newResults[index].theoryMarks) || 0;
      const practical = parseFloat(newResults[index].practicalMarks) || 0;
      newResults[index].totalMarks = theory + practical;
    }

    // Auto-fill subject name when code changes
    if (field === 'subjectCode' && value) {
      const subjectDetails = SUBJECT_DETAILS[value] || {};
      newResults[index].subjectName = subjectDetails["Subject Name"] || '';
    }

    onExamResultsChange(newResults);
  };

  const calculateResults = () => {
    if (examResults.length === 0) return;

    let totalObtained = 0;
    let totalMax = 0;

    examResults.forEach(result => {
      const subjectDetails = SUBJECT_DETAILS[result.subjectCode] || {
        "Max Theory Marks": 100,
        "Max Practical Marks": 100
      };

      totalObtained += (parseFloat(result.theoryMarks) || 0) + (parseFloat(result.practicalMarks) || 0);
      totalMax += (parseFloat(subjectDetails["Max Theory Marks"]) || 100) + 
                 (parseFloat(subjectDetails["Max Practical Marks"]) || 100);
    });

    const percentage = totalMax > 0 ? Math.round((totalObtained / totalMax) * 100) : 0;
    
    // This would typically update the parent component's state
    console.log(`Calculated percentage: ${percentage}%`);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div>
          <p className="text-sm text-gray-500">Add exam results for the selected course</p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={addExamResult}
            className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <FiPlus className="mr-1" /> Add Result
          </button>
          <button
            type="button"
            onClick={calculateResults}
            className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            <FiAward className="mr-1" /> Calculate
          </button>
        </div>
      </div>

      {examResults.length === 0 ? (
        <p className="text-sm text-gray-500 text-center py-4">No exam results added yet</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Subject Code</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Subject Name</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Theory</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Practical</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {examResults.map((result, index) => (
                <tr key={index}>
                  <td className="px-3 py-2">
                    <select
                      value={result.subjectCode}
                      onChange={(e) => updateExamResult(index, 'subjectCode', e.target.value)}
                      className="block w-full border border-gray-300 rounded-md shadow-sm py-1 px-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    >
                      <option value="">Select Subject</option>
                      {Object.entries(COURSE_SUBJECTS).map(([code, name]) => (
                        <option key={code} value={code}>{code}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="text"
                      value={result.subjectName}
                      readOnly
                      className="block w-full border border-gray-300 rounded-md shadow-sm py-1 px-2 bg-gray-100 sm:text-sm"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="number"
                      value={result.theoryMarks}
                      onChange={(e) => updateExamResult(index, 'theoryMarks', e.target.value)}
                      className="block w-full border border-gray-300 rounded-md shadow-sm py-1 px-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="number"
                      value={result.practicalMarks}
                      onChange={(e) => updateExamResult(index, 'practicalMarks', e.target.value)}
                      className="block w-full border border-gray-300 rounded-md shadow-sm py-1 px-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="number"
                      value={result.totalMarks}
                      readOnly
                      className="block w-full border border-gray-300 rounded-md shadow-sm py-1 px-2 bg-gray-100 sm:text-sm"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="date"
                      value={result.examDate?.split('T')[0] || ''}
                      onChange={(e) => updateExamResult(index, 'examDate', e.target.value)}
                      className="block w-full border border-gray-300 rounded-md shadow-sm py-1 px-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <button
                      type="button"
                      onClick={() => removeExamResult(index)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ExamResultsManager;