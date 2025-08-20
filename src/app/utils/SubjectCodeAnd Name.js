// Computer Course Subjects
const CERTIFICATION_IN_COMPUTER_APPLICATION = {
  "CS-01": "Basic Computer",
  "CS-02": "Windows Application: MS Office",
  "CS-03": "Operating System",
  "CS-04": "Web Publisher: Internet Browsing"
};

const DIPLOMA_IN_COMPUTER_APPLICATION = {
  "CS-01": "Basic Computer",
  "CS-02": "Windows Application: MS Office",
  "CS-03": "Operating System",
  "CS-04": "Web Publisher: Internet Browsing",
  "CS-05": "Computer Accountancy: Tally"
};

const ADVANCE_DIPLOMA_IN_COMPUTER_APPLICATION = {
  "CS-01": "Basic Computer",
  "CS-02": "Windows Application: MS Office",
  "CS-03": "Operating System",
  "CS-05": "Computer Accountancy: Tally",
  "CS-06": "Desktop Publishing: Photoshop"
};

// Computer Accountancy Subjects
const CERTIFICATION_IN_COMPUTER_ACCOUNTANCY = {
  "CA-01": "Basic Computer",
  "CA-02": "Windows Application: MS Office",
  "CA-03": "Computerized Accounting With Tally",
  "CA-04": "Manual Accounting"
};

const DIPLOMA_IN_COMPUTER_ACCOUNTANCY = {
  "CA-01": "Basic Computer",
  "CA-02": "Windows Application: MS Office",
  "CA-03": "Computerized Accounting With Tally",
  "CA-04": "Manual Accounting",
  "CA-05": "Tally ERP 9 & Tally Prime"
};

// Web Development Subjects
const CERTIFICATION_IN_WEB_DEVELOPMENT_FUNDAMENTALS = {
  "WD-01": "HTML Fundamentals",
  "WD-02": "CSS Styling",
  "WD-03": "JavaScript Basics",
  "WD-04": "Responsive Web Design"
};

const DIPLOMA_IN_FRONT_END_DEVELOPMENT = {
  "WD-01": "HTML Fundamentals",
  "WD-02": "CSS Styling",
  "WD-03": "JavaScript Basics",
  "WD-04": "Responsive Web Design",
  "WD-05": "Frontend Project Development"
};

const ADVANCE_DIPLOMA_IN_FRONT_END_DEVELOPMENT = {
  "WD-01": "HTML Fundamentals",
  "WD-02": "CSS Styling",
  "WD-03": "JavaScript Basics",
  "WD-04": "Responsive Web Design",
  "WD-06": "Advanced JavaScript and Frameworks"
};

// AI Tools Subjects
const CERTIFICATION_IN_AI_TOOLS = {
  "AI-01": "Introduction to AI and ChatGPT",
  "AI-02": "Prompt Engineering Fundamentals",
  "AI-03": "AI Content Creation Tools",
  "AI-04": "AI for Productivity"
};

const DIPLOMA_IN_GENERATIVE_AI_APPLICATIONS = {
  "AI-01": "Introduction to AI and ChatGPT",
  "AI-02": "Prompt Engineering Fundamentals",
  "AI-03": "AI Content Creation Tools",
  "AI-04": "AI for Productivity",
  "AI-05": "Advanced AI Applications"
};

const ADVANCE_DIPLOMA_IN_GENERATIVE_AI_APPLICATIONS = {
  "AI-01": "Introduction to AI and ChatGPT",
  "AI-02": "Prompt Engineering Fundamentals",
  "AI-03": "AI Content Creation Tools",
  "AI-06": "AI Automation and Integration",
  "AI-07": "AI Project Implementation"
};

// Industrial Training Subjects
const INDUSTRIAL_TRAINING_CERTIFICATION = {
  "IT-01": "Industry Orientation",
  "IT-02": "Practical Project Work",
  "IT-03": "Professional Skills Development",
  "IT-04": "Industry Best Practices"
};

// React Subjects
const CERTIFICATION_IN_REACT_JS = {
  "RJ-01": "React Fundamentals",
  "RJ-02": "Components and Props",
  "RJ-03": "State Management",
  "RJ-04": "React Hooks"
};

const ADVANCED_CERTIFICATION_IN_REACT_JS = {
  "RJ-01": "React Fundamentals",
  "RJ-02": "Components and Props",
  "RJ-03": "State Management",
  "RJ-04": "React Hooks",
  "RJ-05": "Advanced React Patterns"
};

// MERN Stack Subjects
const CERTIFICATION_IN_MERN_STACK_DEVELOPMENT = {
  "MN-01": "MongoDB Fundamentals",
  "MN-02": "Express.js Basics",
  "MN-03": "React Core Concepts",
  "MN-04": "Node.js Essentials"
};

const DIPLOMA_IN_FULL_STACK_DEVELOPMENT = {
  "MN-01": "MongoDB Fundamentals",
  "MN-02": "Express.js Basics",
  "MN-03": "React Core Concepts",
  "MN-04": "Node.js Essentials",
  "MN-05": "Full Stack Project Development"
};

// Graphic Design Subjects
const CERTIFICATION_IN_GRAPHIC_DESIGN = {
  "GD-01": "CorelDRAW Fundamentals",
  "GD-02": "Vector Graphics Creation",
  "GD-03": "Layout Design Principles",
  "GD-04": "Basic Graphic Design Projects"
};

const DIPLOMA_IN_GRAPHIC_DESIGN = {
  "GD-01": "CorelDRAW Fundamentals",
  "GD-02": "Vector Graphics Creation",
  "GD-03": "Layout Design Principles",
  "GD-04": "Basic Graphic Design Projects",
  "GD-05": "Advanced Design Techniques"
};

// Tally Subjects
const CERTIFICATION_IN_TALLY = {
  "TA-01": "Tally Fundamentals",
  "TA-02": "Accounting Basics",
  "TA-03": "Inventory Management",
  "TA-04": "Basic Financial Reports"
};

const DIPLOMA_IN_ACCOUNTING_SOFTWARE = {
  "TA-01": "Tally Fundamentals",
  "TA-02": "Accounting Basics",
  "TA-03": "Inventory Management",
  "TA-04": "Basic Financial Reports",
  "TA-05": "Advanced Accounting Features"
};

// Video Editing Subjects
const CERTIFICATION_IN_VIDEO_EDITING = {
  "VE-01": "Premier Pro Interface",
  "VE-02": "Basic Editing Techniques",
  "VE-03": "Audio Editing Fundamentals",
  "VE-04": "Basic Effects and Transitions"
};

const DIPLOMA_IN_VIDEO_PRODUCTION = {
  "VE-01": "Premier Pro Interface",
  "VE-02": "Basic Editing Techniques",
  "VE-03": "Audio Editing Fundamentals",
  "VE-04": "Basic Effects and Transitions",
  "VE-05": "Advanced Video Production"
};

// WordPress Subjects
const CERTIFICATION_IN_WORDPRESS = {
  "WP-01": "WordPress Basics",
  "WP-02": "Theme Customization",
  "WP-03": "Plugin Management",
  "WP-04": "Content Management"
};

const DIPLOMA_IN_CMS_DEVELOPMENT = {
  "WP-01": "WordPress Basics",
  "WP-02": "Theme Customization",
  "WP-03": "Plugin Management",
  "WP-04": "Content Management",
  "WP-05": "Advanced WordPress Development"
};

// MS Office Subjects
const CERTIFICATION_IN_OFFICE_PRODUCTIVITY = {
  "OF-01": "Word Processing",
  "OF-02": "Spreadsheet Applications",
  "OF-03": "Presentation Software",
  "OF-04": "Basic Office Automation"
};

const DIPLOMA_IN_OFFICE_AUTOMATION = {
  "OF-01": "Word Processing",
  "OF-02": "Spreadsheet Applications",
  "OF-03": "Presentation Software",
  "OF-04": "Basic Office Automation",
  "OF-05": "Advanced Office Solutions"
};

// PTE Subjects
const PTE_TRAINING_CERTIFICATION = {
  "PT-01": "Speaking Module",
  "PT-02": "Writing Module",
  "PT-03": "Reading Module",
  "PT-04": "Listening Module"
};

// AutoCAD Subjects
const CERTIFICATION_IN_AUTOCAD = {
  "AC-01": "AutoCAD Interface",
  "AC-02": "2D Drafting Fundamentals",
  "AC-03": "Basic Modifying Techniques",
  "AC-04": "Dimensioning and Annotation"
};

const DIPLOMA_IN_COMPUTER_AIDED_DESIGN = {
  "AC-01": "AutoCAD Interface",
  "AC-02": "2D Drafting Fundamentals",
  "AC-03": "Basic Modifying Techniques",
  "AC-04": "Dimensioning and Annotation",
  "AC-05": "3D Modeling Basics"
};

// Computer Course Subjects
const CS_01 = {
    "Subject Name": "Basic Computer",
    "Max Theory Marks": 100,
    "Max Practical Marks": 0,
};

const CS_02 = {
    "Subject Name": "Windows Application: MS Office",
    "Max Theory Marks": 40,
    "Max Practical Marks": 60,
};

const CS_03 = {
    "Subject Name": "Operating System",
    "Max Theory Marks": 40,
    "Max Practical Marks": 60,
};

const CS_04 = {
    "Subject Name": "Web Publisher: Internet Browsing",
    "Max Theory Marks": 40,
    "Max Practical Marks": 60,
};

const CS_05 = {
    "Subject Name": "Computer Accountancy: Tally",
    "Max Theory Marks": 40,
    "Max Practical Marks": 60,
};

const CS_06 = {
    "Subject Name": "Desktop Publishing: Photoshop",
    "Max Theory Marks": 40,
    "Max Practical Marks": 60,
};

// Computer Accountancy Subjects
const CA_01 = {
    "Subject Name": "Basic Computer",
    "Max Theory Marks": 100,
    "Max Practical Marks": 0,
};

const CA_02 = {
    "Subject Name": "Windows Application: MS Office",
    "Max Theory Marks": 40,
    "Max Practical Marks": 60,
};

const CA_03 = {
    "Subject Name": "Computerized Accounting With Tally",
    "Max Theory Marks": 40,
    "Max Practical Marks": 60,
};

const CA_04 = {
    "Subject Name": "Manual Accounting",
    "Max Theory Marks": 40,
    "Max Practical Marks": 60,
};

const CA_05 = {
    "Subject Name": "Tally ERP 9 & Tally Prime",
    "Max Theory Marks": 40,
    "Max Practical Marks": 60,
};

// Web Development Subjects
const WD_01 = {
    "Subject Name": "HTML Fundamentals",
    "Max Theory Marks": 40,
    "Max Practical Marks": 60,
};

const WD_02 = {
    "Subject Name": "CSS Styling",
    "Max Theory Marks": 40,
    "Max Practical Marks": 60,
};

const WD_03 = {
    "Subject Name": "JavaScript Basics",
    "Max Theory Marks": 40,
    "Max Practical Marks": 60,
};

const WD_04 = {
    "Subject Name": "Responsive Web Design",
    "Max Theory Marks": 40,
    "Max Practical Marks": 60,
};

const WD_05 = {
    "Subject Name": "Frontend Project Development",
    "Max Theory Marks": 40,
    "Max Practical Marks": 60,
};

const WD_06 = {
    "Subject Name": "Advanced JavaScript and Frameworks",
    "Max Theory Marks": 40,
    "Max Practical Marks": 60,
};

// AI Tools Subjects
const AI_01 = {
    "Subject Name": "Introduction to AI and ChatGPT",
    "Max Theory Marks": 40,
    "Max Practical Marks": 60,
};

const AI_02 = {
    "Subject Name": "Prompt Engineering Fundamentals",
    "Max Theory Marks": 40,
    "Max Practical Marks": 60,
};

const AI_03 = {
    "Subject Name": "AI Content Creation Tools",
    "Max Theory Marks": 40,
    "Max Practical Marks": 60,
};

const AI_04 = {
    "Subject Name": "AI for Productivity",
    "Max Theory Marks": 40,
    "Max Practical Marks": 60,
};

const AI_05 = {
    "Subject Name": "Advanced AI Applications",
    "Max Theory Marks": 40,
    "Max Practical Marks": 60,
};

const AI_06 = {
    "Subject Name": "AI Automation and Integration",
    "Max Theory Marks": 40,
    "Max Practical Marks": 60,
};

const AI_07 = {
    "Subject Name": "AI Project Implementation",
    "Max Theory Marks": 40,
    "Max Practical Marks": 60,
};

// Industrial Training Subjects
const IT_01 = {
    "Subject Name": "Industry Orientation",
    "Max Theory Marks": 40,
    "Max Practical Marks": 60,
};

const IT_02 = {
    "Subject Name": "Practical Project Work",
    "Max Theory Marks": 20,
    "Max Practical Marks": 80,
};

const IT_03 = {
    "Subject Name": "Professional Skills Development",
    "Max Theory Marks": 40,
    "Max Practical Marks": 60,
};

const IT_04 = {
    "Subject Name": "Industry Best Practices",
    "Max Theory Marks": 40,
    "Max Practical Marks": 60,
};

// React Subjects
const RJ_01 = {
    "Subject Name": "React Fundamentals",
    "Max Theory Marks": 40,
    "Max Practical Marks": 60,
};

const RJ_02 = {
    "Subject Name": "Components and Props",
    "Max Theory Marks": 40,
    "Max Practical Marks": 60,
};

const RJ_03 = {
    "Subject Name": "State Management",
    "Max Theory Marks": 40,
    "Max Practical Marks": 60,
};

const RJ_04 = {
    "Subject Name": "React Hooks",
    "Max Theory Marks": 40,
    "Max Practical Marks": 60,
};

const RJ_05 = {
    "Subject Name": "Advanced React Patterns",
    "Max Theory Marks": 40,
    "Max Practical Marks": 60,
};

// MERN Stack Subjects
const MN_01 = {
    "Subject Name": "MongoDB Fundamentals",
    "Max Theory Marks": 40,
    "Max Practical Marks": 60,
};

const MN_02 = {
    "Subject Name": "Express.js Basics",
    "Max Theory Marks": 40,
    "Max Practical Marks": 60,
};

const MN_03 = {
    "Subject Name": "React Core Concepts",
    "Max Theory Marks": 40,
    "Max Practical Marks": 60,
};

const MN_04 = {
    "Subject Name": "Node.js Essentials",
    "Max Theory Marks": 40,
    "Max Practical Marks": 60,
};

const MN_05 = {
    "Subject Name": "Full Stack Project Development",
    "Max Theory Marks": 40,
    "Max Practical Marks": 60,
};

// Graphic Design Subjects
const GD_01 = {
    "Subject Name": "CorelDRAW Fundamentals",
    "Max Theory Marks": 40,
    "Max Practical Marks": 60,
};

const GD_02 = {
    "Subject Name": "Vector Graphics Creation",
    "Max Theory Marks": 40,
    "Max Practical Marks": 60,
};

const GD_03 = {
    "Subject Name": "Layout Design Principles",
    "Max Theory Marks": 40,
    "Max Practical Marks": 60,
};

const GD_04 = {
    "Subject Name": "Basic Graphic Design Projects",
    "Max Theory Marks": 40,
    "Max Practical Marks": 60,
};

const GD_05 = {
    "Subject Name": "Advanced Design Techniques",
    "Max Theory Marks": 40,
    "Max Practical Marks": 60,
};

// Tally Subjects
const TA_01 = {
    "Subject Name": "Tally Fundamentals",
    "Max Theory Marks": 40,
    "Max Practical Marks": 60,
};

const TA_02 = {
    "Subject Name": "Accounting Basics",
    "Max Theory Marks": 40,
    "Max Practical Marks": 60,
};

const TA_03 = {
    "Subject Name": "Inventory Management",
    "Max Theory Marks": 40,
    "Max Practical Marks": 60,
};

const TA_04 = {
    "Subject Name": "Basic Financial Reports",
    "Max Theory Marks": 40,
    "Max Practical Marks": 60,
};

const TA_05 = {
    "Subject Name": "Advanced Accounting Features",
    "Max Theory Marks": 40,
    "Max Practical Marks": 60,
};

// Video Editing Subjects
const VE_01 = {
    "Subject Name": "Premier Pro Interface",
    "Max Theory Marks": 40,
    "Max Practical Marks": 60,
};

const VE_02 = {
    "Subject Name": "Basic Editing Techniques",
    "Max Theory Marks": 40,
    "Max Practical Marks": 60,
};

const VE_03 = {
    "Subject Name": "Audio Editing Fundamentals",
    "Max Theory Marks": 40,
    "Max Practical Marks": 60,
};

const VE_04 = {
    "Subject Name": "Basic Effects and Transitions",
    "Max Theory Marks": 40,
    "Max Practical Marks": 60,
};

const VE_05 = {
    "Subject Name": "Advanced Video Production",
    "Max Theory Marks": 40,
    "Max Practical Marks": 60,
};

// WordPress Subjects
const WP_01 = {
    "Subject Name": "WordPress Basics",
    "Max Theory Marks": 40,
    "Max Practical Marks": 60,
};

const WP_02 = {
    "Subject Name": "Theme Customization",
    "Max Theory Marks": 40,
    "Max Practical Marks": 60,
};

const WP_03 = {
    "Subject Name": "Plugin Management",
    "Max Theory Marks": 40,
    "Max Practical Marks": 60,
};

const WP_04 = {
    "Subject Name": "Content Management",
    "Max Theory Marks": 40,
    "Max Practical Marks": 60,
};

const WP_05 = {
    "Subject Name": "Advanced WordPress Development",
    "Max Theory Marks": 40,
    "Max Practical Marks": 60,
};

// MS Office Subjects
const OF_01 = {
    "Subject Name": "Word Processing",
    "Max Theory Marks": 40,
    "Max Practical Marks": 60,
};

const OF_02 = {
    "Subject Name": "Spreadsheet Applications",
    "Max Theory Marks": 40,
    "Max Practical Marks": 60,
};

const OF_03 = {
    "Subject Name": "Presentation Software",
    "Max Theory Marks": 40,
    "Max Practical Marks": 60,
};

const OF_04 = {
    "Subject Name": "Basic Office Automation",
    "Max Theory Marks": 40,
    "Max Practical Marks": 60,
};

const OF_05 = {
    "Subject Name": "Advanced Office Solutions",
    "Max Theory Marks": 40,
    "Max Practical Marks": 60,
};

// PTE Subjects
const PT_01 = {
    "Subject Name": "Speaking Module",
    "Max Theory Marks": 40,
    "Max Practical Marks": 60,
};

const PT_02 = {
    "Subject Name": "Writing Module",
    "Max Theory Marks": 40,
    "Max Practical Marks": 60,
};

const PT_03 = {
    "Subject Name": "Reading Module",
    "Max Theory Marks": 40,
    "Max Practical Marks": 60,
};

const PT_04 = {
    "Subject Name": "Listening Module",
    "Max Theory Marks": 40,
    "Max Practical Marks": 60,
};

// AutoCAD Subjects
const AC_01 = {
    "Subject Name": "AutoCAD Interface",
    "Max Theory Marks": 40,
    "Max Practical Marks": 60,
};

const AC_02 = {
    "Subject Name": "2D Drafting Fundamentals",
    "Max Theory Marks": 40,
    "Max Practical Marks": 60,
};

const AC_03 = {
    "Subject Name": "Basic Modifying Techniques",
    "Max Theory Marks": 40,
    "Max Practical Marks": 60,
};

const AC_04 = {
    "Subject Name": "Dimensioning and Annotation",
    "Max Theory Marks": 40,
    "Max Practical Marks": 60,
};

const AC_05 = {
    "Subject Name": "3D Modeling Basics",
    "Max Theory Marks": 40,
    "Max Practical Marks": 60,
};