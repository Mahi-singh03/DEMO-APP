'use client';

import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { UserContext }  from '../../../components/userContext';

const StudentLoginForm = () => {
  const router = useRouter();
  const { login, isAuthenticated } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    emailAddress: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    // If already authenticated, redirect to profile
    if (isAuthenticated) {
      router.replace('/profile');
      return;
    }

    const token = localStorage.getItem('token');
    if (token) {
      fetch('/api/auth/verify', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => {
          if (res.ok) {
            router.replace('/profile');
          } else {
            localStorage.removeItem('user');
            localStorage.removeItem('token');
          }
        })
        .catch(() => {
          localStorage.removeItem('user');
          localStorage.removeItem('token');
        });
    }
  }, [router, isAuthenticated]);

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({ ...prev, [name]: validateField(name, formData[name]) }));
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

  const validateField = (name, value) => {
    switch (name) {
      case 'emailAddress':
        if (!value) return 'Email is required';
        return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value)
          ? ''
          : 'Please enter a valid email address';
      case 'password':
        if (!value) return 'Password is required';
        return value.length >= 6
          ? ''
          : 'Password must be at least 6 characters';
      default:
        return '';
    }
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    ['emailAddress', 'password'].forEach((field) => {
      const error = validateField(field, formData[field]);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const getFriendlyErrorMessage = (error) => {
    // Handle API error messages
    if (error.includes('Invalid email') || error.includes('Invalid password')) {
      return 'The email or password you entered is incorrect. Please try again.';
    }
    if (error.includes('Email and password are required')) {
      return 'Please enter both your email and password.';
    }
    if (error.includes('rate limit')) {
      return 'Too many login attempts. Please wait a moment and try again.';
    }
    if (error.includes('Server configuration error')) {
      return 'We\'re experiencing technical difficulties. Please try again later.';
    }
    
    // Default message for unexpected errors
    return 'Something went wrong. Please try again.';
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    if (!validateForm()) {
      setLoading(false);
      const firstErrorField = Object.keys(errors)[0];
      document
        .querySelector(`[name="${firstErrorField}"]`)
        ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          emailAddress: formData.emailAddress.toLowerCase(),
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        let errorMessage = 'Login failed';
        if (data.error) {
          errorMessage = getFriendlyErrorMessage(data.error);
        } else if (response.status === 401) {
          errorMessage = 'The email or password you entered is incorrect.';
        } else if (response.status === 400) {
          errorMessage = 'Please enter both your email and password.';
        } else if (response.status === 429) {
          errorMessage = 'Too many login attempts. Please wait a moment.';
        }
        
        setErrors({ general: errorMessage });
        return;
      }

      // Use the context login function to update authentication state
      login(data.student, false, data.token);
      router.push('/profile');
    } catch (error) {
      console.error('Login error:', error);
      setErrors({
        general: 'We\'re having trouble connecting to our servers. Please check your internet connection and try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#e3f1f1] flex justify-center p-7">
      <div className="w-full max-w-md">
        <motion.h1 
        className="text-center text-4xl pb-1.5 sm:text-5xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Student Login
      </motion.h1>

        {errors.general && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
            <svg
              className="h-5 w-5 text-red-500 mt-0.5 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <h3 className="font-medium text-red-800">Unable to Sign In</h3>
              <p className="text-sm text-red-600 mt-1">{errors.general}</p>
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-8">
            <form onSubmit={onSubmit} className="space-y-6">
              <div>
                <label htmlFor="emailAddress" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      className="h-5 w-5 text-gray-400"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </div>
                  <input
                    id="emailAddress"
                    type="email"
                    name="emailAddress"
                    value={formData.emailAddress}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`block w-full pl-10 pr-3 py-3 rounded-lg border ${errors.emailAddress ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'} placeholder-gray-400 focus:outline-none transition duration-150 ease-in-out`}
                    placeholder="you@example.com"
                  />
                </div>
                {errors.emailAddress && touched.emailAddress && (
                  <p className="mt-1 text-sm text-red-600">{errors.emailAddress}</p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      className="h-5 w-5 text-gray-400"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    minLength={6}
                    className={`block w-full pl-10 pr-10 py-3 rounded-lg border ${errors.password ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'} placeholder-gray-400 focus:outline-none transition duration-150 ease-in-out`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <svg
                      className="h-5 w-5 text-gray-400 hover:text-gray-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      {showPassword ? (
                        <>
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                          />
                        </>
                      ) : (
                        <>
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </>
                      )}
                    </svg>
                  </button>
                </div>
                {errors.password && touched.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-white font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-150 ${loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'}`}
                >
                  {loading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Signing in...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-gray-600">
          <p>
            Don&apos;t have an account?{' '}
            <a
              href="/register"
              className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-150"
            >
              Create one
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default StudentLoginForm;