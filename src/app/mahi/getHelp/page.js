"use client"
import { useState } from 'react';
import { motion } from 'framer-motion';

// Constants
const WEB_NAME = "WebCosw";
const TECH_SUPPORT_NAME = "Alex Johnson";
const TECH_SUPPORT_MOBILE = "+1 (555) 123-4567";
const TECH_SUPPORT_EMAIL = "support@webcosw.com";

// Features list from the image
const features = [
  "Manage Students",
  "Edit Online Courses students",
  "Edit Staff",
  "Manage Fees",
  "Certificates",
  "Edit Achievements",
  "Edit Gallery",
  "Edit Resources",
  "Add Admin",
  "Edit Reviews",
  "Get Help"
];

// Troubleshooting tips
const troubleshootingTips = [
  "Clear your browser cache and cookies if pages aren't loading properly",
  "Ensure you have a stable internet connection",
  "Try using a different browser to see if the issue persists",
  "Check if your browser is up to date",
  "Restart your computer if the application is running slowly",
  "Verify that you have the necessary permissions for the feature you're trying to access"
];

export default function GetHelpPage() {
  const [selectedFeature, setSelectedFeature] = useState('');
  const [issueDescription, setIssueDescription] = useState('');

  const handleFeatureSelect = (feature) => {
    setSelectedFeature(feature === selectedFeature ? '' : feature);
  };

  const sendViaWhatsApp = () => {
    if (!selectedFeature || !issueDescription) {
      alert('Please select a feature and describe your issue');
      return;
    }

    const message = `Hello ${WEB_NAME} Support,\n\nI need help with: ${selectedFeature}\n\nIssue Description: ${issueDescription}`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/?text=${encodedMessage}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h1 className="text-4xl font-bold text-indigo-800 mb-2">Get Help</h1>
          <p className="text-lg text-gray-600">We're here to assist you with any issues you're experiencing</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Left Column - Issue Reporting */}
          <div>
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white rounded-xl shadow-lg p-6 mb-6"
            >
              <h2 className="text-2xl font-semibold text-indigo-700 mb-4">What do you need help with?</h2>
              <p className="text-gray-600 mb-4">Select the feature you're having issues with:</p>
              
              <div className="grid grid-cols-2 gap-3 mb-6">
                {features.map((feature, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleFeatureSelect(feature)}
                    className={`p-3 rounded-lg text-sm font-medium transition-colors ${
                      selectedFeature === feature
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-indigo-100 hover:text-indigo-700'
                    }`}
                  >
                    {feature}
                  </motion.button>
                ))}
              </div>

              <div className="mb-6">
                <label htmlFor="issue" className="block text-gray-700 font-medium mb-2">
                  Describe your issue in detail:
                </label>
                <textarea
                  id="issue"
                  rows="5"
                  value={issueDescription}
                  onChange={(e) => setIssueDescription(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  placeholder="Please provide as much detail as possible about the problem you're experiencing..."
                ></textarea>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={sendViaWhatsApp}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.864 3.488"/>
                </svg>
                Send via WhatsApp
              </motion.button>
            </motion.div>
          </div>

          {/* Right Column - Support Info */}
          <div>
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-white rounded-xl shadow-lg p-6 mb-6"
            >
              <h2 className="text-2xl font-semibold text-indigo-700 mb-4">Contact Tech Support</h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="bg-indigo-100 p-2 rounded-lg mr-4">
                    <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-700">Call us at</h3>
                    <p className="text-indigo-600">{TECH_SUPPORT_MOBILE}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-indigo-100 p-2 rounded-lg mr-4">
                    <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-700">Email us at</h3>
                    <p className="text-indigo-600">{TECH_SUPPORT_EMAIL}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-indigo-100 p-2 rounded-lg mr-4">
                    <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-700">Your support agent</h3>
                    <p className="text-indigo-600">{TECH_SUPPORT_NAME}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-indigo-100 p-2 rounded-lg mr-4">
                    <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-700">Website</h3>
                    <p className="text-indigo-600">{WEB_NAME}</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <h2 className="text-2xl font-semibold text-indigo-700 mb-4">Troubleshooting Tips</h2>
              <ul className="space-y-3">
                {troubleshootingTips.map((tip, index) => (
                  <motion.li 
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.1 + 0.8 }}
                    className="flex items-start"
                  >
                    <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <span className="text-gray-600">{tip}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}