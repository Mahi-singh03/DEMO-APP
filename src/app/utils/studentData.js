import { 
  COURSE_SUBJECTS, 
  SUBJECT_DETAILS 
} from '@/lib/constants';

// Calculate percentage and grade based on exam results
export const calculateResults = (examResults) => {
  if (!examResults || examResults.length === 0) {
    return { percentage: 0, finalGrade: 'Pending' };
  }

  let totalObtainedMarks = 0;
  let totalMaxMarks = 0;

  examResults.forEach(result => {
    const subjectDetails = SUBJECT_DETAILS[result.subjectCode] || {
      "Max Theory Marks": 100,
      "Max Practical Marks": 100
    };

    const theoryMarks = parseFloat(result.theoryMarks) || 0;
    const practicalMarks = parseFloat(result.practicalMarks) || 0;
    const maxTheory = parseFloat(subjectDetails["Max Theory Marks"]) || 100;
    const maxPractical = parseFloat(subjectDetails["Max Practical Marks"]) || 100;

    totalObtainedMarks += theoryMarks + practicalMarks;
    totalMaxMarks += maxTheory + maxPractical;
  });

  const percentage = totalMaxMarks > 0 ? Math.round((totalObtainedMarks / totalMaxMarks) * 100) : 0;
  
  let finalGrade = 'F';
  if (percentage >= 80) finalGrade = 'A';
  else if (percentage >= 70) finalGrade = 'B';
  else if (percentage >= 60) finalGrade = 'C';
  else if (percentage >= 50) finalGrade = 'D';

  return { percentage, finalGrade };
};

// Generate certification title based on course and duration
export const generateCertificationTitle = (selectedCourse, courseDuration) => {
  if (selectedCourse === 'Computer Course') {
    switch (courseDuration) {
      case '3 Months':
        return 'CERTIFICATION IN COMPUTER APPLICATION';
      case '6 Months':
        return 'DIPLOMA IN COMPUTER APPLICATION';
      case '1 Year':
        return 'ADVANCE DIPLOMA IN COMPUTER APPLICATION';
      default:
        return selectedCourse;
    }
  } else if (selectedCourse === 'HTML, CSS, JS') {
    switch (courseDuration) {
      case '3 Months':
        return 'CERTIFICATION IN WEB DEVELOPMENT FUNDAMENTALS';
      case '6 Months':
        return 'DIPLOMA IN FRONT-END DEVELOPMENT';
      case '1 Year':
        return 'ADVANCE DIPLOMA IN FRONT-END DEVELOPMENT';
      default:
        return selectedCourse;
    }
  } else if (selectedCourse === 'ChatGPT and AI tools') {
    switch (courseDuration) {
      case '3 Months':
        return 'CERTIFICATION IN AI TOOLS';
      case '6 Months':
        return 'DIPLOMA IN GENERATIVE AI APPLICATIONS';
      case '1 Year':
        return 'ADVANCE DIPLOMA IN GENERATIVE AI APPLICATIONS';
      default:
        return selectedCourse;
    }
  } else if (selectedCourse === 'Industrial Training') {
    return 'INDUSTRIAL TRAINING CERTIFICATION';
  } else if (selectedCourse === 'React') {
    switch (courseDuration) {
      case '3 Months':
        return 'CERTIFICATION IN REACT JS';
      case '6 Months':
        return 'ADVANCED CERTIFICATION IN REACT JS';
      default:
        return selectedCourse;
    }
  } else if (selectedCourse === 'MERN FullStack') {
    switch (courseDuration) {
      case '6 Months':
        return 'CERTIFICATION IN MERN STACK DEVELOPMENT';
      case '1 Year':
        return 'DIPLOMA IN FULL STACK DEVELOPMENT';
      default:
        return selectedCourse;
    }
  } else if (selectedCourse === 'CorelDRAW') {
    switch (courseDuration) {
      case '3 Months':
        return 'CERTIFICATION IN GRAPHIC DESIGN';
      case '6 Months':
        return 'DIPLOMA IN GRAPHIC DESIGN';
      default:
        return selectedCourse;
    }
  } else if (selectedCourse === 'Tally') {
    switch (courseDuration) {
      case '3 Months':
        return 'CERTIFICATION IN TALLY';
      case '6 Months':
        return 'DIPLOMA IN ACCOUNTING SOFTWARE';
      default:
        return selectedCourse;
    }
  } else if (selectedCourse === 'Premier Pro') {
    switch (courseDuration) {
      case '3 Months':
        return 'CERTIFICATION IN VIDEO EDITING';
      case '6 Months':
        return 'DIPLOMA IN VIDEO PRODUCTION';
      default:
        return selectedCourse;
    }
  } else if (selectedCourse === 'WordPress') {
    switch (courseDuration) {
      case '3 Months':
        return 'CERTIFICATION IN WORDPRESS';
      case '6 Months':
        return 'DIPLOMA IN CMS DEVELOPMENT';
      default:
        return selectedCourse;
    }
  } else if (selectedCourse === 'MS Office') {
    switch (courseDuration) {
      case '3 Months':
        return 'CERTIFICATION IN OFFICE PRODUCTIVITY';
      case '6 Months':
        return 'DIPLOMA IN OFFICE AUTOMATION';
      default:
        return selectedCourse;
    }
  } else if (selectedCourse === 'PTE') {
    return 'PTE TRAINING CERTIFICATION';
  } else if (selectedCourse === 'AutoCAD') {
    switch (courseDuration) {
      case '3 Months':
        return 'CERTIFICATION IN AUTOCAD';
      case '6 Months':
        return 'DIPLOMA IN COMPUTER-AIDED DESIGN';
      default:
        return selectedCourse;
    }
  } else {
    return selectedCourse;
  }
};

// Calculate farewell date based on joining date and course duration
export const calculateFarewellDate = (joiningDate, courseDuration) => {
  if (!joiningDate || !courseDuration) return null;
  
  const joining = new Date(joiningDate);
  let monthsToAdd = 0;
  
  switch (courseDuration) {
    case '3 Months':
      monthsToAdd = 3;
      break;
    case '6 Months':
      monthsToAdd = 6;
      break;
    case '1 Year':
      monthsToAdd = 12;
      break;
    default:
      return null;
  }
  
  return new Date(joining.setMonth(joining.getMonth() + monthsToAdd));
};

// Generate installment details based on total fees and number of installments
export const generateInstallmentDetails = (totalFees, installments, joiningDate) => {
  if (!totalFees || !installments || !joiningDate) return [];
  
  const amountPerInstallment = Math.floor(totalFees / installments);
  const remainingAmount = totalFees % installments;
  const joining = new Date(joiningDate);
  
  return Array.from({ length: installments }, (_, index) => {
    const submissionDate = new Date(joining);
    submissionDate.setMonth(joining.getMonth() + index);
    
    // Distribute remaining amount to first installment
    const installmentAmount = index === 0 ? amountPerInstallment + remainingAmount : amountPerInstallment;
    
    return {
      amount: installmentAmount,
      submissionDate: submissionDate.toISOString().split('T')[0],
      paid: false
    };
  });
};

// Get subjects for a specific course
export const getCourseSubjects = (courseName) => {
  if (!courseName) return {};
  
  // Find the course in our COURSE_SUBJECTS (case insensitive)
  const courseKey = Object.keys(COURSE_SUBJECTS).find(
    key => key.toLowerCase() === courseName.toLowerCase()
  );
  
  return courseKey ? COURSE_SUBJECTS[courseKey] : {};
};

// Format currency for display
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0
  }).format(amount);
};

// Validate student data
export const validateStudentData = (studentData) => {
  const errors = {};

  if (!studentData.fullName?.trim()) {
    errors.fullName = 'Full name is required';
  }

  if (!studentData.gender) {
    errors.gender = 'Gender is required';
  }

  if (!studentData.fatherName?.trim()) {
    errors.fatherName = "Father's name is required";
  }

  if (!studentData.motherName?.trim()) {
    errors.motherName = "Mother's name is required";
  }

  if (!studentData.parentsPhoneNumber?.match(/^[0-9]{10}$/)) {
    errors.parentsPhoneNumber = 'Enter a valid 10-digit parents phone number';
  }

  if (!studentData.emailAddress?.match(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/)) {
    errors.emailAddress = 'Please fill a valid email address';
  }

  if (!studentData.phoneNumber?.match(/^[0-9]{10}$/)) {
    errors.phoneNumber = 'Enter a valid 10-digit phone number';
  }

  if (!studentData.dateOfBirth) {
    errors.dateOfBirth = 'Date of Birth is required';
  }

  if (!studentData.joiningDate) {
    errors.joiningDate = 'Joining date is required';
  }

  if (!studentData.aadharNumber?.match(/^[0-9]{12}$/)) {
    errors.aadharNumber = 'Enter a valid 12-digit Aadhar number';
  }

  if (!studentData.selectedCourse) {
    errors.selectedCourse = 'Course selection is required';
  }

  if (!studentData.courseDuration) {
    errors.courseDuration = 'Course duration is required';
  }

  if (!studentData.address?.trim()) {
    errors.address = 'Address is required';
  }

  if (!studentData.qualification) {
    errors.qualification = 'Qualification is required';
  }

  if (!studentData.password || studentData.password.length < 6) {
    errors.password = 'Password must be at least 6 characters long';
  }

  return errors;
};