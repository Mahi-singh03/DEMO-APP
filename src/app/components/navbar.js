"use client";

import { useState, useContext, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown, User, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { UserContext } from "./userContext";
import Image from 'next/image';

const dropdowns = [
  {
    name: "Online Courses",
    options: [
      { name: "Register", path: "/onlineCourse/register" },
      { name: "Login", path: "/onlineCourse/login" },
      { name: "Course Videos", path: "/onlineCourse/videos" },
    ],
  },
  {
    name: "Exams",
    options: [
      { name: "Weekly Exam", path: "/weekly-exam" },
    ],
  },
  {
    name: "Verification",
    options: [
      { name: "Verify Student", path: "/verification/student" },
      { name: "Verify Staff", path: "/verification/staff" },
    ],
  },
  {
    name: "Resources",
    options: [
      { name: "Study Material", path: "/resources" },
    ],
  },
  {
    name: "Job",
    options: [
      
      { name: "Job Apply", path: "/job/jobApply" },
    ],
  },
];

const secondaryMenuItems = (isAuthenticated) => [
  { name: "Home", path: "/home" },
  { name: "Courses", path: "/courses" },
  ...(isAuthenticated
    ? []
    : [
        { name: "Register", path: "/register" },
        { name: "Login", path: "/login" },
      ]),
  { name: "About", path: "/about" },
  { name: "Gallery", path: "/gallery" },
  { name: "Achievements", path: "/achievements" },
  ...(isAuthenticated ? [{ name: "Logout", path: "#" }] : []),
];

const isActivePath = (currentPath, targetPath, exact = true) => {
  if (!currentPath || typeof currentPath !== "string") return false;
  const normalizedCurrent = currentPath.toLowerCase().split("?")[0];
  const normalizedTarget = targetPath.toLowerCase();
  return exact
    ? normalizedCurrent === normalizedTarget
    : normalizedCurrent.startsWith(normalizedTarget);
};

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [hoveredDropdown, setHoveredDropdown] = useState(null);
  const { isAuthenticated, logout, loading, initializeAuth } = useContext(UserContext);
  const pathname = usePathname();

  useEffect(() => {
    initializeAuth();
    setIsOpen(false);
    setActiveDropdown(null);
  }, [pathname, initializeAuth]);

  if (loading) {
    return <div className="fixed top-0 left-0 w-full h-16 bg-white shadow-md z-50"></div>;
  }

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  const handleDropdownClick = (name) => {
    setActiveDropdown(activeDropdown === name ? null : name);
  };

  const isDropdownActive = (dropdown) => {
    return dropdown.options.some(option => isActivePath(pathname, option.path, false));
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
      <div className="container mx-auto flex justify-between items-center p-4">
        <Link href="/" className="flex items-center">
          <Image
            src="/logoLG.svg"
            alt="Large Logo"
            width={48}
            height={48}
            className="hidden lg:block object-contain w-auto h-14 "
            priority
          />
          <Image
            src="/logo.svg"
            alt="Small Logo"
            width={48}
            height={48}
            className="block lg:hidden object-contain w-auto h-12"
            priority
            onError={(e) => {
              console.error('Small logo failed to load');
              e.target.style.display = 'none';
            }}
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex space-x-6 items-center">
          {dropdowns.map((dropdown) => (
            <div
              key={dropdown.name}
              className="relative"
              onMouseEnter={() => {
                setHoveredDropdown(dropdown.name);
                setActiveDropdown(dropdown.name);
              }}
              onMouseLeave={() => {
                setHoveredDropdown(null);
                if (activeDropdown === dropdown.name && !isDropdownActive(dropdown)) {
                  setActiveDropdown(null);
                }
              }}
            >
              <button
                className={`flex items-center px-2 py-1 rounded-md transition-all duration-300 ${
                  isDropdownActive(dropdown)
                    ? "text-blue-600 bg-blue-50 font-semibold"
                    : "text-gray-700 hover:text-blue-500 hover:bg-blue-50"
                }`}
              >
                {dropdown.name}
                <ChevronDown
                  size={16}
                  className={`ml-1 transition-transform ${
                    (activeDropdown === dropdown.name || isDropdownActive(dropdown))
                      ? "rotate-180 text-blue-500"
                      : "text-gray-500"
                  }`}
                />
              </button>
              
              <AnimatePresence>
                {(activeDropdown === dropdown.name) && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute left-0 mt-2 w-43 bg-white shadow-lg rounded-lg overflow-hidden border border-gray-100"
                  >
                    {dropdown.options.map((option) => (
                      <Link
                        key={option.name}
                        href={option.path}
                        className={`block px-4 py-3 transition-all duration-200 ${
                          isActivePath(pathname, option.path)
                            ? "text-blue-600 bg-blue-50 font-medium"
                            : "text-gray-700 hover:bg-blue-50 hover:text-blue-500"
                        }`}
                        onClick={() => setActiveDropdown(null)}
                      >
                        <motion.div
                          whileHover={{ x: 5 }}
                          className="flex items-center"
                        >
                          <ChevronRight size={14} className="mr-2" />
                          {option.name}
                        </motion.div>
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
          
          <Link
            href="/profile"
            className={`p-2 rounded-full transition-colors duration-300 ${
              isActivePath(pathname, "/profile")
                ? "bg-blue-100 text-blue-600"
                : "text-gray-700 hover:bg-blue-50 hover:text-blue-500"
            }`}
          >
            <User size={24} />
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="lg:hidden flex items-center space-x-4">
          <Link
            href="/profile"
            className={`p-2 rounded-full ${
              isActivePath(pathname, "/profile") ? "text-blue-600" : "text-gray-700"
            }`}
          >
            <User size={24} />
          </Link>
          <button
            className="text-gray-700 focus:outline-none"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Secondary Navbar */}
      <div className="hidden lg:flex bg-gray-50 p-2 justify-center border-t border-gray-200">
        {secondaryMenuItems(isAuthenticated).map((item) =>
          item.name === "Logout" ? (
            <button
              key={item.name}
              onClick={handleLogout}
              className={`mx-3 px-3 py-1 rounded-md transition-all duration-300 ${
                isActivePath(pathname, item.path)
                  ? "text-blue-600 bg-blue-50 font-medium"
                  : "text-gray-700 hover:text-blue-500 hover:bg-blue-50"
              }`}
            >
              {item.name}
            </button>
          ) : (
            <Link
              key={item.name}
              href={item.path}
              className={`mx-3 px-3 py-1 rounded-md transition-all duration-300 ${
                isActivePath(pathname, item.path)
                  ? "text-blue-600 bg-blue-50 font-medium"
                  : "text-gray-700 hover:text-blue-500 hover:bg-blue-50"
              }`}
            >
              {item.name}
            </Link>
          )
        )}
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: "0%" }}
            exit={{ x: "-100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="lg:hidden fixed top-0 left-0 w-4/5 h-full bg-white shadow-xl flex flex-col items-start pt-20 overflow-y-auto z-50"
          >
            <button
              className="absolute top-5 right-5 text-gray-700 p-2 rounded-full hover:bg-gray-100"
              onClick={() => setIsOpen(false)}
            >
              <X size={24} />
            </button>

            {secondaryMenuItems(isAuthenticated).map((item) =>
              item.name === "Logout" ? (
                <button
                  key={item.name}
                  onClick={handleLogout}
                  className={`w-full px-6 py-4 text-left border-b border-gray-100 flex items-center ${
                    isActivePath(pathname, item.path)
                      ? "text-blue-600 bg-blue-50 font-medium"
                      : "text-gray-700 hover:bg-blue-50"
                  }`}
                >
                  {item.name}
                </button>
              ) : (
                <Link
                  key={item.name}
                  href={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`w-full px-6 py-4 text-left border-b border-gray-100 flex items-center ${
                    isActivePath(pathname, item.path)
                      ? "text-blue-600 bg-blue-50 font-medium"
                      : "text-gray-700 hover:bg-blue-50"
                  }`}
                >
                  {item.name}
                </Link>
              )
            )}

            {dropdowns.map((dropdown) => (
              <div key={dropdown.name} className="w-full border-b border-gray-100">
                <button
                  onClick={() => handleDropdownClick(dropdown.name)}
                  className={`w-full px-6 py-4 text-left flex justify-between items-center ${
                    isDropdownActive(dropdown)
                      ? "text-blue-600 bg-blue-50 font-medium"
                      : "text-gray-700 hover:bg-blue-50"
                  }`}
                >
                  <span>{dropdown.name}</span>
                  <ChevronRight
                    size={20}
                    className={`transform transition-transform ${
                      activeDropdown === dropdown.name ? "rotate-90" : ""
                    }`}
                  />
                </button>
                <AnimatePresence>
                  {activeDropdown === dropdown.name && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      {dropdown.options.map((option) => (
                        <Link
                          key={option.name}
                          href={option.path}
                          onClick={() => {
                            setIsOpen(false);
                            setActiveDropdown(null);
                          }}
                          className={` px-8 py-3 text-gray-600 hover:bg-blue-50 border-t border-gray-100 flex items-center ${
                            isActivePath(pathname, option.path)
                              ? "text-blue-600 bg-blue-100 font-medium"
                              : ""
                          }`}
                        >
                          <ChevronRight size={14} className="mr-2" />
                          {option.name}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;