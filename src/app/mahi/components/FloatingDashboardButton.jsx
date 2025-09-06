"use client";

import { useRouter, usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { BiSolidHomeHeart } from "react-icons/bi";

const FloatingDashboardButton = () => {
  const router = useRouter();
  const pathname = usePathname();
  
  // Don't show the button on the main mahi page
  if (pathname === '/mahi') {
    return null;
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed bottom-6 right-6 z-100"
    >
      <motion.button
        whileHover={{ 
          scale: 1.05,
          boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.4)"
        }}
        whileTap={{ scale: 0.95 }}
        onClick={() => router.push('/mahi')}
        className="flex items-center space-x-2 bg-green-600 text-white px-4 py-3 rounded-lg mb-26 shadow-md font-medium"
      >
        <BiSolidHomeHeart className="text-lg" />
        <span>Go to Home</span>
      </motion.button>
    </motion.div>
  );
};

export default FloatingDashboardButton;