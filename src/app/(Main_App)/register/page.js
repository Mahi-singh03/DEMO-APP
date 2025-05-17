'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dayjs from 'dayjs';

const StudentRegistrationForm = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    fullName: '',
    fatherName: '',
    motherName: '',
    gender: '',
    emailAddress: '',
    phoneNumber: '',
    parentsPhoneNumber: '',
    dateOfBirth: '',
    aadharNumber: '',
    selectedCourse: '',
    courseDuration: '',
    address: '',
    qualification: '',
    password: '',
    joiningDate: dayjs().format('YYYY-MM-DD'),
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetch('/api/auth/verify', {
        headers: { Authorization: `Bearer ${token}` },
      }).then((res) => {
        if (res.ok) {
          router.replace('/profile');
        } else {
          localStorage.removeItem('user');
          localStorage.removeItem('token');
        }
      });
    }
  }, [router]);

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (touched[name]) {
      setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
    }
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (touched[name]) {
      setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
    }
  };

  const validateField = (name, value) => {
    switch (name) {
      case 'emailAddress':
        return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value)
          ? ''
          : 'Invalid email format';
      case 'phoneNumber':
      case 'parentsPhoneNumber':
        return /^\d{10}$/.test(value)
          ? ''
          : 'Must be a 10-digit phone number';
      case 'aadharNumber':
        return /^\d{12}$/.test(value)
          ? ''
          : 'Must be a 12-digit Aadhar number';
      case 'password':
        return value.length >= 6
          ? ''
          : 'Password must be at least 6 characters';
      case 'dateOfBirth':
        if (!value) return 'Date of birth is required';
        const dob = dayjs(value);
        const minAgeDate = dayjs().subtract(100, 'year');
        return dob.isBefore(dayjs()) && dob.isAfter(minAgeDate)
          ? ''
          : 'Invalid date of birth (must be between 1 and 100 years ago)';
      case 'joiningDate':
        return value && !dayjs(value).isAfter(dayjs())
          ? ''
          : 'Joining date cannot be in the future';
      default:
        return value ? '' : 'This field is required';
    }
  };

  const validateStep = () => {
    const currentStepFields = steps[currentStep].fields;
    const newErrors = {};
    let isValid = true;

    currentStepFields.forEach((field) => {
      const error = validateField(field, formData[field]);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const onFinish = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validate all fields before submission
    const allFields = steps.flatMap((step) => step.fields);
    const newErrors = {};
    allFields.forEach((field) => {
      const error = validateField(field, formData[field]);
      if (error) newErrors[field] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      const firstErrorField = Object.keys(newErrors)[0];
      document
        .querySelector(`[name="${firstErrorField}"]`)
        ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      let errorData;
      try {
        errorData = await response.json();
      } catch (jsonError) {
        throw new Error('Invalid server response. Please try again.');
      }

      if (!response.ok) {
        if (errorData.error.includes('already registered')) {
          const field = errorData.error
            .match(/Email|Aadhar number|Phone number/)?.[0]
            ?.toLowerCase()
            .replace(' ', '');
          setErrors({ [field]: errorData.error });
        } else if (errorData.error.includes('. ')) {
          const fieldErrors = errorData.error.split('. ').reduce((acc, msg) => {
            const fieldMatch = msg.match(/^(.*?)\s/);
            if (fieldMatch) {
              const field = fieldMatch[1].toLowerCase();
              acc[field] = msg;
            }
            return acc;
          }, {});
          setErrors(fieldErrors);
        } else {
          throw new Error(errorData.error || 'Registration failed');
        }
        return;
      }

      const data = errorData;
      localStorage.setItem('user', JSON.stringify(data.student));
      localStorage.setItem('token', data.token);
      router.push('/profile');
    } catch (error) {
      console.error('Registration error:', error);
      setErrors({
        general: error.message || 'An error occurred. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (validateStep()) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const firstErrorField = steps[currentStep].fields.find((field) => errors[field]);
      if (firstErrorField) {
        document
          .querySelector(`[name="${firstErrorField}"]`)
          ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const steps = [
    {
      title: 'Personal Info',
      fields: ['fullName', 'fatherName', 'motherName', 'gender'],
      content: (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-800">Personal Information</h2>
          <p className="text-sm text-gray-600 mb-4">Please provide your basic personal details.</p>
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name *</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border ${
                errors.fullName ? 'border-red-500' : ''
              }`}
              required
              autoFocus
            />
            {errors.fullName && <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Father&apos;s Name *</label>
              <input
                type="text"
                name="fatherName"
                value={formData.fatherName}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border ${
                  errors.fatherName ? 'border-red-500' : ''
                }`}
                required
              />
              {errors.fatherName && <p className="mt-1 text-sm text-red-600">{errors.fatherName}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Mother&apos;s Name *</label>
              <input
                type="text"
                name="motherName"
                value={formData.motherName}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border ${
                  errors.motherName ? 'border-red-500' : ''
                }`}
                required
              />
              {errors.motherName && <p className="mt-1 text-sm text-red-600">{errors.motherName}</p>}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Gender *</label>
            <div className="mt-2 space-x-4">
              {['male', 'female', 'other'].map((gender) => (
                <label key={gender} className="inline-flex items-center">
                  <input
                    type="radio"
                    name="gender"
                    value={gender}
                    checked={formData.gender === gender}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    required
                  />
                  <span className="ml-2 capitalize">{gender}</span>
                </label>
              ))}
            </div>
            {errors.gender && <p className="mt-1 text-sm text-red-600">{errors.gender}</p>}
          </div>
        </div>
      ),
    },
    {
      title: 'Contact Info',
      fields: ['emailAddress', 'phoneNumber', 'parentsPhoneNumber', 'dateOfBirth', 'joiningDate'],
      content: (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-800">Contact Information</h2>
          <p className="text-sm text-gray-600 mb-4">Please provide your contact details.</p>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email *</label>
            <input
              type="email"
              name="emailAddress"
              value={formData.emailAddress}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border ${
                errors.emailAddress ? 'border-red-500' : ''
              }`}
              required
              autoFocus
            />
            {errors.emailAddress && <p className="mt-1 text-sm text-red-600">{errors.emailAddress}</p>}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Your Phone Number *</label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                onBlur={handleBlur}
                pattern="[0-9]{10}"
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border ${
                  errors.phoneNumber ? 'border-red-500' : ''
                }`}
                required
              />
              {errors.phoneNumber && <p className="mt-1 text-sm text-red-600">{errors.phoneNumber}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Parents Phone Number *</label>
              <input
                type="tel"
                name="parentsPhoneNumber"
                value={formData.parentsPhoneNumber}
                onChange={handleChange}
                onBlur={handleBlur}
                pattern="[0-9]{10}"
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border ${
                  errors.parentsPhoneNumber ? 'border-red-500' : ''
                }`}
                required
              />
              {errors.parentsPhoneNumber && <p className="mt-1 text-sm text-red-600">{errors.parentsPhoneNumber}</p>}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Date of Birth *</label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                onBlur={handleBlur}
                max={dayjs().format('YYYY-MM-DD')}
                min={dayjs().subtract(100, 'year').format('YYYY-MM-DD')}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border ${
                  errors.dateOfBirth ? 'border-red-500' : ''
                }`}
                required
              />
              {errors.dateOfBirth && <p className="mt-1 text-sm text-red-600">{errors.dateOfBirth}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Joining Date *</label>
              <input
                type="date"
                name="joiningDate"
                value={formData.joiningDate}
                onChange={handleChange}
                onBlur={handleBlur}
                max={dayjs().format('YYYY-MM-DD')}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border ${
                  errors.joiningDate ? 'border-red-500' : ''
                }`}
                required
              />
              {errors.joiningDate && <p className="mt-1 text-sm text-red-600">{errors.joiningDate}</p>}
            </div>
          </div>
          <div className="bg-blue-50 p-4 rounded-md">
            <p className="text-sm text-blue-700">
              Roll number and farewell date will be generated automatically after registration.
            </p>
          </div>
        </div>
      ),
    },
    {
      title: 'Academic Info',
      fields: ['aadharNumber', 'selectedCourse', 'courseDuration'],
      content: (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-800">Academic Information</h2>
          <p className="text-sm text-gray-600 mb-4">Please provide your academic details.</p>
          <div>
            <label className="block text-sm font-medium text-gray-700">Aadhar Number *</label>
            <input
              type="text"
              name="aadharNumber"
              value={formData.aadharNumber}
              onChange={handleChange}
              onBlur={handleBlur}
              pattern="[0-9]{12}"
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border ${
                errors.aadharNumber ? 'border-red-500' : ''
              }`}
              required
              autoFocus
            />
            {errors.aadharNumber && <p className="mt-1 text-sm text-red-600">{errors.aadharNumber}</p>}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Course *</label>
              <select
                name="selectedCourse"
                value={formData.selectedCourse}
                onChange={(e) => handleSelectChange('selectedCourse', e.target.value)}
                onBlur={handleBlur}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border ${
                  errors.selectedCourse ? 'border-red-500' : ''
                }`}
                required
              >
                <option value="">Select a course</option>
                {[
                  'HTML, CSS, JS',
                  'React',
                  'MERN FullStack',
                  'Autocad',
                  'CorelDRAW',
                  'Tally',
                  'Premier Pro',
                  'WordPress',
                  'Computer Course',
                  'MS Office',
                  'PTE',
                ].map((course) => (
                  <option key={course} value={course}>{course}</option>
                ))}
              </select>
              {errors.selectedCourse && <p className="mt-1 text-sm text-red-600">{errors.selectedCourse}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Course Duration *</label>
              <select
                name="courseDuration"
                value={formData.courseDuration}
                onChange={(e) => handleSelectChange('courseDuration', e.target.value)}
                onBlur={handleBlur}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border ${
                  errors.courseDuration ? 'border-red-500' : ''
                }`}
                required
              >
                <option value="">Select duration</option>
                {['3 months', '6 months', '1 year'].map((duration) => (
                  <option key={duration} value={duration}>{duration}</option>
                ))}
              </select>
              {errors.courseDuration && <p className="mt-1 text-sm text-red-600">{errors.courseDuration}</p>}
            </div>
          </div>
          <div className="bg-blue-50 p-4 rounded-md">
            <p className="text-sm text-blue-700">
              Course fees will be calculated based on your selected course and duration.
            </p>
          </div>
        </div>
      ),
    },
    {
      title: 'Final Details',
      fields: ['address', 'qualification', 'password'],
      content: (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-800">Final Details</h2>
          <p className="text-sm text-gray-600 mb-4">Please complete your registration details.</p>
          <div>
            <label className="block text-sm font-medium text-gray-700">Address *</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              onBlur={handleBlur}
              rows自    rows={3}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border ${
                errors.address ? 'border-red-500' : ''
              }`}
              required
              autoFocus
            />
            {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Qualification *</label>
            <select
              name="qualification"
              value={formData.qualification}
              onChange={(e) => handleSelectChange('qualification', e.target.value)}
              onBlur={handleBlur}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border ${
                errors.qualification ? 'border-red-500' : ''
              }`}
              required
            >
              <option value="">Select qualification</option>
              {['10th', '12th', 'Graduated'].map((qual) => (
                <option key={qual} value={qual}>{qual}</option>
              ))}
            </select>
            {errors.qualification && <p className="mt-1 text-sm text-red-600">{errors.qualification}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password *</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
              minLength={6}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border ${
                errors.password ? 'border-red-500' : ''
              }`}
              required
            />
            {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
            <p className="mt-1 text-xs text-gray-500">
              Password must be at least 6 characters long
            </p>
          </div>
          <div className="bg-blue-50 p-4 rounded-md">
            <p className="text-sm text-blue-700">
              By completing this form, you agree to our terms and conditions.
            </p>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">Student Registration</h1>
        </div>

        {errors.general && (
          <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded-md">
            <div className="flex items-center">
              <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <h3 className="font-medium">Registration Error</h3>
            </div>
            <p className="mt-2">{errors.general}</p>
          </div>
        )}

        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <nav className="flex items-center justify-center">
              <ol className="flex items-center space-x-4">
                {steps.map((step, index) => (
                  <li key={step.title} className="flex items-center">
                    <button
                      type="button"
                      onClick={() => {
                        const allStepsValid = steps.slice(0, index).every((_, i) =>
                          steps[i].fields.every((field) => !validateField(field, formData[field]))
                        );
                        if (allStepsValid) setCurrentStep(index);
                      }}
                      className={`flex items-center justify-center w-8 h-8 rounded-full ${
                        currentStep >= index
                          ? 'bg-blue-600 text-white hover:bg-blue-700'
                          : 'bg-gray-200 text-gray-600 cursor-default'
                      }`}
                    >
                      {index + 1}
                    </button>
                    {index < steps.length - 1 && <span className="ml-4 h-px w-8 bg-gray-300"></span>}
                  </li>
                ))}
              </ol>
            </nav>
            <div className="mt-4 text-center">
              <p className="text-sm font-medium text-blue-600">
                Step {currentStep + 1} of {steps.length}: {steps[currentStep].title}
              </p>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-4">
              <div
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="px-6 py-8">
            <form onSubmit={onFinish}>
              {steps[currentStep].content}
              <div className="mt-10 flex justify-between">
                {currentStep > 0 ? (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="inline-flex items-center px-5 py-2.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-150"
                  >
                    <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                    </svg>
                    Previous
                  </button>
                ) : (
                  <div></div>
                )}
                {currentStep < steps.length - 1 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="inline-flex items-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-150"
                  >
                    Next
                    <svg className="h-5 w-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={loading}
                    className={`inline-flex items-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                      loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
                    } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-150`}
                  >
                    {loading ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Processing...
                      </>
                    ) : (
                      <>
                        Complete Registration
                        <svg className="h-5 w-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                      </>
                    )}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            Already have an account?{' '}
            <a href="/login" className="text-blue-600 hover:text-blue-800">
              Log in here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default StudentRegistrationForm;