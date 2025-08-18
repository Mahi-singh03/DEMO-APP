'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';

const AdminRegister = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('/api/admin/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      // Show success message
      setSuccess('New admin created successfully! Redirecting to login...');
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
      });

      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.push('/adminLogin');
      }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Check if user is admin on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const adminToken = localStorage.getItem('adminToken');
      if (!adminToken) {
        router.push('/admin/login');
      } else {
        setIsAdmin(true);
      }
    }
  }, [router]);

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#030712] text-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p>Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030712] pt-15 text-gray-100 flex flex-col items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-gray-900 rounded-xl shadow-2xl overflow-hidden border border-gray-800">
          <div className="relative h-3 bg-gradient-to-r from-purple-600 to-blue-500">
            <motion.div 
              className="h-full bg-gradient-to-r from-blue-500 to-purple-600"
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
            />
          </div>

          <div className="p-8">
            <motion.h1 
              className="text-3xl font-bold text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Create New Admin
            </motion.h1>

            {error && (
              <motion.div 
                className="mb-4 p-3 bg-red-900/50 border border-red-700 rounded-lg text-red-200"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {error}
              </motion.div>
            )}

            {success && (
              <motion.div 
                className="mb-4 p-3 bg-green-900/50 border border-green-700 rounded-lg text-green-200"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {success}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200"
                  placeholder="John Doe"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200"
                  placeholder="admin@example.com"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <label htmlFor="password" className="block text-sm font-medium text-gray-400 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength="6"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200"
                  placeholder="••••••••"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
              >
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-400 mb-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  minLength="6"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200"
                  placeholder="••••••••"
                />
              </motion.div>

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-300 ${loading ? 'bg-purple-800 cursor-not-allowed' : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700'}`}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : 'Create Admin'}
              </motion.button>
            </form>

            <motion.div 
              className="mt-6 text-center text-gray-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <p>Return to <Link href="/admin/dashboard" className="text-purple-400 hover:text-purple-300 transition-colors">Dashboard</Link></p>
            </motion.div>
          </div>
        </div>
      </motion.div>

      <motion.div 
        className="mt-8 text-center text-gray-500 text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <p>© {new Date().getFullYear()} Admin Portal. All rights reserved.</p>
      </motion.div>
    </div>
  );
};

export default AdminRegister;