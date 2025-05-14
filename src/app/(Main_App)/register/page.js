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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
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
        return value && dayjs(value).isBefore(dayjs())
          ? ''
          : 'Invalid date of birth';
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
    setErrors({});
    try {
      const formDataObj = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value) {
          formDataObj.append(key, value);
        }
      });

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        body: formDataObj,
      });

      if (!response.ok) {
        const errorData = await response.json();
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
          throw new Error(errorData.error);
        }
        return;
      }

      const data = await response.json();
      localStorage.setItem('user', JSON.stringify(data.student));
      localStorage.setItem('token', data.token);
      router.push('/profile');
    } catch (error) {
      console.error('Error:', error);
      setErrors({ general: error.message || 'An error occurred. Try again.' });
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (validateStep()) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const steps = [
    {
      title: 'Personal Info',
      fields: ['fullName', 'fatherName', 'motherName', 'gender'],
      content: (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name *</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border ${errors.fullName ? 'border-red-500' : ''}`}
              required
            />
            {errors.fullName && <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Father's Name *</label>
            <input
              type="text"
              name="fatherName"
              value={formData.fatherName}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border ${errors.fatherName ? 'border-red-500' : ''}`}
              required
            />
            {errors.fatherName && <p className="mt-1 text-sm text-red-600">{errors.fatherName}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Mother's Name *</label>
            <input
              type="text"
              name="motherName"
              value={formData.motherName}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border ${errors.motherName ? 'border-red-500' : ''}`}
              required
            />
            {errors.motherName && <p className="mt-1 text-sm text-red-600">{errors.motherName}</p>}
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
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email *</label>
            <input
              type="email"
              name="emailAddress"
              value={formData.emailAddress}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border ${errors.emailAddress ? 'border-red-500' : ''}`}
              required
            />
            {errors.emailAddress && <p className="mt-1 text-sm text-red-600">{errors.emailAddress}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone Number *</label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              pattern="[0-9]{10}"
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border ${errors.phoneNumber ? 'border-red-500' : ''}`}
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
              pattern="[0-9]{10}"
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border ${errors.parentsPhoneNumber ? 'border-red-500' : ''}`}
              required
            />
            {errors.parentsPhoneNumber && <p className="mt-1 text-sm text-red-600">{errors.parentsPhoneNumber}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Date of Birth *</label>
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              max={dayjs().format('YYYY-MM-DD')}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border ${errors.dateOfBirth ? 'border-red-500' : ''}`}
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
              max={dayjs().format('YYYY-MM-DD')}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border ${errors.joiningDate ? 'border-red-500' : ''}`}
              required
            />
            {errors.joiningDate && <p className="mt-1 text-sm text-red-600">{errors.joiningDate}</p>}
          </div>
          <p className="text-sm text-gray-600">Roll number and farewell date will be generated automatically.</p>
        </div>
      ),
    },
    {
      title: 'Academic Info',
      fields: ['aadharNumber', 'selectedCourse', 'courseDuration'],
      content: (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Aadhar Number *</label>
            <input
              type="text"
              name="aadharNumber"
              value={formData.aadharNumber}
              onChange={handleChange}
              pattern="[0-9]{12}"
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border ${errors.aadharNumber ? 'border-red-500' : ''}`}
              required
            />
            {errors.aadharNumber && <p className="mt-1 text-sm text-red-600">{errors.aadharNumber}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Course *</label>
            <select
              name="selectedCourse"
              value={formData.selectedCourse}
              onChange={(e) => handleSelectChange('selectedCourse', e.target.value)}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border ${errors.selectedCourse ? 'border-red-500' : ''}`}
              required
            >
              <option value="">Select a course</option>
              {['HTML, CSS, JS', 'React', 'MERN FullStack', 'Autocad', 'CorelDRAW', 'Tally', 'Premier Pro', 'WordPress', 'Computer Course', 'MS Office', 'PTE'].map((course) => (
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
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border ${errors.courseDuration ? 'border-red-500' : ''}`}
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
      ),
    },
    {
      title: 'Final Details',
      fields остальных: ['address', 'qualification', 'password'],
      content: (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Address *</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows={3}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border ${errors.address ? 'border-red-500' : ''}`}
              required
            />
            {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Qualification *</label>
            <select
              name="qualification"
              value={formData.qualification}
              onChange={(e) => handleSelectChange('qualification', e.target.value)}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border ${errors.qualification ? 'border-red-500' : ''}`}
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
              minLength={6}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border ${errors.password ? 'border-red-500' : ''}`}
              required
            />
            {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">Student Registration</h1>
          <p className="mt-2 text-sm text-gray-600">Please complete all required fields (*)</p>
        </div>

        {errors.general && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
            {errors.general}
          </div>
        )}

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <nav className="flex items-center justify-center">
              <ol className="flex items-center space-x-4">
                {steps.map((step, index) => (
                  <li key={step.title} className="flex items-center">
                    <span
                      className={`flex items-center justify-center w-8 h-8 rounded-full ${
                        currentStep >= index ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {index + 1}
                    </span>
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
                className="bg-blue-600 h-2.5 rounded-full"
                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="px-6 py-8">
            <form onSubmit={onFinish}>
              {steps[currentStep].content}

              <div className="mt-8 flex justify-between">
                {currentStep > 0 ? (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Previous
                  </button>
                ) : (
                  <div></div>
                )}

                {currentStep < steps.length - 1 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    disabled={!validateStep()}
                    className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                      validateStep() ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-400 cursor-not-allowed'
                    } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={loading || !validateStep()}
                    className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                      validateStep() ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-400 cursor-not-allowed'
                    } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                  >
                    {loading ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                      'Complete Registration'
                    )}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentRegistrationForm;