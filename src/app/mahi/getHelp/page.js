"use client"
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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

// FAQ items
const faqItems = [
  {
    question: "How quickly will I receive a response?",
    answer: "We typically respond to all support requests within 1 business day. For urgent issues, please call our support line directly."
  },
  {
    question: "What information should I include in my support request?",
    answer: "Please include your account email, the feature you need help with, a detailed description of the issue, and any error messages you're seeing."
  },
  {
    question: "Do you offer phone support outside business hours?",
    answer: "Our standard support hours are 9 AM to 6 PM EST, Monday through Friday. For emergency issues outside these hours, please leave a detailed message and we'll respond as soon as possible."
  }
];

export default function GetHelpPage() {
  const [selectedFeature, setSelectedFeature] = useState('');
  const [issueDescription, setIssueDescription] = useState('');
  const [activeFAQ, setActiveFAQ] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleFeatureSelect = (feature) => {
    setSelectedFeature(feature === selectedFeature ? '' : feature);
  };

  const toggleFAQ = (index) => {
    setActiveFAQ(activeFAQ === index ? null : index);
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
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-blue-400 mb-4">How can we help you?</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our support team is here to assist you with any issues or questions you might have about {WEB_NAME}.
          </p>
        </motion.div>

        {isSubmitted && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded-md"
          >
            <p>Thank you for your submission! We'll get back to you shortly.</p>
          </motion.div>
        )}

        <div className="grid md:grid-cols-3 gap-8">
          {/* Left Column - Issue Reporting */}
          <div className="md:col-span-2">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white rounded-2xl shadow-lg p-6 mb-6"
            >
              <h2 className="text-2xl font-semibold text-blue-400 mb-6 pb-2 border-b border-gray-100">
                Report an Issue
                <span className="block w-12 h-1 bg-blue-400 mt-2 rounded-full"></span>
              </h2>
              
              <div className="mb-6">
                <p className="text-gray-600 mb-4 font-medium">Select the feature you're having issues with:</p>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
                  {features.map((feature, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleFeatureSelect(feature)}
                      className={`p-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                        selectedFeature === feature
                          ? 'bg-indigo-600 text-white shadow-md'
                          : 'bg-gray-100 text-gray-700 hover:bg-indigo-50 hover:text-blue-400'
                      }`}
                    >
                      {feature}
                    </motion.button>
                  ))}
                </div>
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
                  placeholder="Please provide as much detail as possible about the problem you're experiencing, including any error messages and steps to reproduce the issue..."
                ></textarea>
                <p className="text-xs text-gray-500 mt-1">{issueDescription.length}/500 characters</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={sendViaWhatsApp}
                  disabled={!selectedFeature || !issueDescription}
                  className={`flex-1 bg-green-500 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center transition-colors ${
                    !selectedFeature || !issueDescription ? 'opacity-70' : 'hover:bg-green-600 shadow-md'
                  }`}
                >
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.864 3.488"/>
                  </svg>
                  WhatsApp
                </motion.button>
              </div>
            </motion.div>

            {/* FAQ Section */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <h2 className="text-2xl font-semibold text-blue-400 mb-6 pb-2 border-b border-gray-100">
                Frequently Asked Questions
                <span className="block w-12 h-1 bg-blue-400 mt-2 rounded-full"></span>
              </h2>
              
              <div className="space-y-4">
                {faqItems.map((item, index) => (
                  <div key={index} className="border-b border-gray-100 last:border-0 pb-4 last:pb-0">
                    <button
                      onClick={() => toggleFAQ(index)}
                      className="flex justify-between items-center w-full text-left font-medium text-gray-800 hover:text-indigo-600 focus:outline-none"
                    >
                      <span>{item.question}</span>
                      <svg 
                        className={`w-5 h-5 transition-transform duration-200 ${activeFAQ === index ? 'transform rotate-180' : ''}`}
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                      </svg>
                    </button>
                    
                    <AnimatePresence>
                      {activeFAQ === index && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="mt-2 text-gray-600 overflow-hidden"
                        >
                          {item.answer}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Column - Support Info */}
          <div>
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-white rounded-2xl shadow-lg p-6 mb-6 top-6"
            >
              <h2 className="text-2xl font-semibold text-blue-400 mb-6 pb-2 border-b border-gray-100">
                Contact Support
                <span className="block w-12 h-1 bg-blue-400 mt-2 rounded-full"></span>
              </h2>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-blue-100 p-3 rounded-xl mr-4 flex-shrink-0">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-700">Call us at</h3>
                    <a href={`tel:${TECH_SUPPORT_MOBILE}`} className="text-indigo-600 hover:text-indigo-800 transition-colors">
                      {TECH_SUPPORT_MOBILE}
                    </a>
                    <p className="text-sm text-gray-500 mt-1">Mon-Fri, 9AM-6PM EST</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-indigo-100 p-3 rounded-xl mr-4 flex-shrink-0">
                    <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-700">Email us at</h3>
                    <a href={`mailto:${TECH_SUPPORT_EMAIL}`} className="text-indigo-600 hover:text-indigo-800 transition-colors">
                      {TECH_SUPPORT_EMAIL}
                    </a>
                    <p className="text-sm text-gray-500 mt-1">We respond within 24 hours</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-indigo-100 p-3 rounded-xl mr-4 flex-shrink-0">
                    <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-700">Your support agent</h3>
                    <p className="text-indigo-600">{TECH_SUPPORT_NAME}</p>
                    <p className="text-sm text-gray-500 mt-1">Senior Support Specialist</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-indigo-100 p-3 rounded-xl mr-4 flex-shrink-0">
                    <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-700">Website</h3>
                    <p className="text-indigo-600">{WEB_NAME}</p>
                    <p className="text-sm text-gray-500 mt-1">Customer Support Portal</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <h2 className="text-2xl font-semibold text-blue-400 mb-6 pb-2 border-b border-gray-100">
                Quick Tips
                <span className="block w-12 h-1 bg-blue-400 mt-2 rounded-full"></span>
              </h2>
              
              <ul className="space-y-4">
                {troubleshootingTips.map((tip, index) => (
                  <motion.li 
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.1 + 0.8 }}
                    className="flex items-start p-3 bg-blue-50 rounded-lg"
                  >
                    <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <span className="text-gray-700">{tip}</span>
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