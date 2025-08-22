const courses = [
  {
    courseID: 1,
    CourseImage: "https://res.cloudinary.com/dufxj1sau/image/upload/v1739439665/Course-logo/r7uelujsqv71xtalnyq8.jpg",
    courseName: "HTML, CSS, JS",
    CourseDescription : "Frontend course covering all the concepts of HTML, CSS, and JS",
    description: "Embark on your journey to become a frontend web developer with this comprehensive course on the foundational pillars of the web. This program is meticulously designed to take you from a complete beginner to a confident coder capable of building beautiful, responsive, and interactive websites from scratch. You'll start by understanding the structure of a web page with HTML5, then bring it to life with the styling power of CSS3, including advanced layout techniques like Flexbox and Grid. Finally, you'll learn to add dynamic behavior and complex user interactions with modern JavaScript (ES6+). Through hands-on projects, you'll build everything from simple static sites to complex client-side applications, all while learning best practices for code organization, accessibility, and cross-browser compatibility.",
    courseDuration: "3 Months",
    courseFee: "10000",
    courseLearnings: [
      "Create semantically structured, accessible web pages using HTML5.",
      "Design visually stunning and fully responsive layouts that work on any device using CSS3, media queries, and modern CSS frameworks.",
      "Implement complex interactivity, manipulate the DOM, and handle user events with vanilla JavaScript.",
      "Master modern layout systems including Flexbox and CSS Grid for sophisticated page designs.",
      "Write clean, efficient, and modern JavaScript using ES6+ features like arrow functions, destructuring, promises, and async/await.",
      "Utilize browser developer tools for debugging, performance analysis, and testing.",
      "Understand fundamental web concepts such as the box model, specificity, hoisting, and closures.",
      "Version control your projects with Git and GitHub for professional collaboration.",
    ],
    courseSyllabus: [
      {
        module: "HTML5 Fundamentals & Semantics",
        topics: [
          "Web Fundamentals: How the Internet & Websites Work",
          "Document Structure, Tags, Attributes, and Forms",
          "HTML5 Semantic Elements (header, nav, section, article, footer)",
          "Embedding Media: Images, Audio, Video, and Iframes",
          "Creating Accessible Forms with Input Types and Validations",
          "SEO Basics with HTML Meta Tags",
        ],
      },
      {
        module: "CSS3 Styling & Responsive Design",
        topics: [
          "CSS Syntax, Selectors, Specificity, and the Box Model",
          "Typography, Colors, Backgrounds, and Gradients",
          "Positioning Elements: Static, Relative, Absolute, Fixed, and Sticky",
          "Advanced Responsive Design with Fluid Layouts and Media Queries",
          "CSS Transforms, Transitions, and Keyframe Animations",
          "Mastering Layouts: Flexbox for 1D Layouts and CSS Grid for 2D Layouts",
          "CSS Variables (Custom Properties) for Maintainable Code",
          "Building a Mobile-First Responsive Portfolio Project",
        ],
      },
      {
        module: "Modern JavaScript (ES6+)",
        topics: [
          "JavaScript Basics: Variables, Data Types, and Operators",
          "Control Flow: Conditionals (if/else, switch) and Loops (for, while)",
          "Functions, Scope, Hoisting, and the 'this' Keyword",
          "Document Object Model (DOM) Manipulation and Traversal",
          "Handling Events: Click, Submit, Input, Keyboard, and Mouse Events",
          "ES6+ Essentials: Let/Const, Template Literals, and Arrow Functions",
          "Destructuring Assignment, Spread/Rest Operators, and Modules",
          "Working with Arrays and Objects: Modern Methods (map, filter, reduce)",
          "Asynchronous JavaScript: Callbacks, Promises, and Async/Await",
          "Fetch API for consuming data from external REST APIs",
          "Final Capstone Project: Building an Interactive Web Application",
        ],
      },
    ],
  },

  {
    courseID: 2,
    CourseImage: "https://res.cloudinary.com/dufxj1sau/image/upload/v1742026110/dddsvpwl1d7uycgdkasq-removebg-preview_lgnjdz.png",
    CourseDescription : "Frontend course covering all the concepts of React",
    courseName: "React",
    description: "Dive deep into the world of modern frontend development with React, the most popular JavaScript library for building dynamic and scalable user interfaces. This intensive course is designed for those who already understand HTML, CSS, and JavaScript and are ready to build powerful Single Page Applications (SPAs). You will learn React's core philosophy of components, state, and props, and how to use them to create reusable and maintainable UI code. The course covers everything from the fundamentals of JSX and functional components with Hooks to advanced topics like state management with Context API and Redux Toolkit, client-side routing with React Router, and performance optimization. By the end, you will be equipped to build, test, and deploy production-ready React applications that are fast, efficient, and provide an excellent user experience.",
    courseDuration: "6 Months",
    courseFee: "20000",
    courseLearnings: [
      "Understand the React ecosystem and its component-based architecture.",
      "Build reusable UI components using JSX and functional components.",
      "Manage component state and side effects using React Hooks (useState, useEffect, useContext, useReducer).",
      "Handle complex application state at scale using Redux Toolkit.",
      "Implement dynamic routing and navigation in SPAs with React Router v6.",
      "Create custom hooks to extract and reuse component logic.",
      "Perform testing of React components using Jest and React Testing Library.",
      "Optimize React application performance with techniques like memoization and code splitting.",
      "Deploy applications to modern hosting platforms like Vercel and Netlify.",
    ],
    courseSyllabus: [
      {
        module: "React Fundamentals",
        topics: [
          "Introduction to React: Virtual DOM and JSX Syntax",
          "Building Your First Components: Functional vs. Class Components",
          "Understanding and Using Props for Data Passing",
          "Managing Internal State with the useState Hook",
          "Handling User Events and Forms in React",
          "The Component Lifecycle and the useEffect Hook",
          "Lists and Keys: Rendering Dynamic Data",
          "Conditional Rendering Techniques",
        ],
      },
      {
        module: "Advanced React & State Management",
        topics: [
          "Managing Global State with the Context API and useContext Hook",
          "Complex State Logic with the useReducer Hook",
          "Introduction to State Management with Redux Toolkit (RTK)",
          "Async Actions with Redux Thunk and RTK Query",
          "Client-Side Routing with React Router v6 (Routes, Route, Link, useNavigate)",
          "Building Custom Hooks for Logic Reusability",
          "Controlled vs. Uncontrolled Components",
          "Introduction to Component Testing with Jest and React Testing Library",
        ],
      },
      {
        module: "Production & Deployment",
        topics: [
          "Performance Optimization: React.memo, useMemo, useCallback",
          "Code Splitting and Lazy Loading with React.lazy",
          "Building for Production: Optimized Bundles",
          "Continuous Deployment Pipelines with GitHub Actions",
          "Deploying to Vercel, Netlify, and GitHub Pages",
          "Final Capstone Project: A Full-Featured React SPA from Design to Deployment",
        ],
      },
    ],
  },

  {
    courseID: 3,
    CourseImage: "https://res.cloudinary.com/dufxj1sau/image/upload/v1742026643/ipyhmia3qx5e2ykcy9ep-removebg-preview_k1hkxr.png",
    courseName: "MERN Full Stack Development",
    CourseDescription : "Full Stack course covering all the concepts of MERN stack",
    description: "Become a versatile and highly sought-after full-stack developer by mastering the MERN stack: MongoDB, Express.js, React, and Node.js. This immersive, year-long program is your passport to building complete, end-to-end web applications. You'll start by solidifying your frontend skills with React before diving deep into the backend, learning to build robust RESTful APIs with Node.js and Express. You'll manage data with MongoDB, a leading NoSQL database, and use Mongoose for elegant data modeling. The course covers critical real-world skills like user authentication with JWT and OAuth, API security, payment integration, and deployment. Through a series of escalating projects, culminating in a significant capstone project, you will gain the confidence and portfolio to launch your career as a professional full-stack developer.",
    courseDuration: "1 Year",
    courseFee: "50000",
    courseLearnings: [
      "Architect and develop full-stack applications using the MERN stack.",
      "Build secure and scalable RESTful APIs with Node.js and Express.js.",
      "Design NoSQL database schemas and perform CRUD operations with MongoDB and Mongoose ODM.",
      "Implement full user authentication and authorization using JWT, bcrypt, and OAuth 2.0.",
      "Manage application state on the frontend efficiently using Redux Toolkit.",
      "Handle file uploads, send emails, and integrate third-party APIs (e.g., payment gateways).",
      "Write unit and integration tests for both frontend and backend code.",
      "Version control collaborative projects using Git and GitHub workflows.",
      "Deploy full-stack applications to cloud platforms like Heroku, Vercel, and AWS.",
      "Understand DevOps basics: Environment Variables, CI/CD, and Process Management (PM2).",
    ],
    courseSyllabus: [
      {
        module: "Frontend Mastery with React",
        topics: [
          "Advanced React Hooks and Patterns",
          "State Management with Redux Toolkit and RTK Query",
          "Advanced Routing with React Router",
          "UI Component Libraries (e.g., Material-UI, Chakra UI)",
          "Frontend Testing Strategies",
        ],
      },
      {
        module: "Backend Engineering with Node & Express",
        topics: [
          "Node.js Runtime Environment and Module System",
          "Building HTTP Servers with Express.js Framework",
          "RESTful API Design Principles and Best Practices",
          "Middleware: Custom, Built-in, and Error-Handling Middleware",
          "API Security: Helmet, CORS, Rate Limiting, and Sanitization",
          "User Authentication with JWT (JSON Web Tokens) and bcrypt",
          "OAuth 2.0 Integration (Google/Github Login)",
          "Data Validation with Joi or Express-validator",
        ],
      },
      {
        module: "Database Management with MongoDB",
        topics: [
          "Introduction to NoSQL and MongoDB Atlas (Cloud Database)",
          "CRUD Operations using the MongoDB Shell and Compass",
          "Data Modeling with Mongoose ODM: Schemas, Models, and Validation",
          "Relationships in NoSQL: Embedding vs. Referencing Documents",
          "Indexing for Performance Optimization",
          "Aggregation Pipeline for Complex Data Queries",
        ],
      },
      {
        module: "Integration, Testing & Deployment",
        topics: [
          "Connecting React Frontend to Express Backend",
          "Making API Calls using Axios and Handling Responses",
          "Environment Variables for Configuration Management",
          "Unit Testing Backend with Jest and Supertest",
          "Full-Stack Project: E-commerce Platform with User Auth, Cart, and Payments",
          "Deployment Strategies: Backend on Heroku/Railway, Frontend on Vercel/Netlify",
          "Connecting to a Custom Domain and Setting up SSL",
          "Final Capstone Project: Ideation, Development, and Public Deployment",
        ],
      },
    ],
  },

  {
    courseID: 4,
    CourseImage: "https://res.cloudinary.com/dufxj1sau/image/upload/v1742027118/wxqkfh8qi3pcdzuhqjga-removebg-preview_lgmw7j.png",
     CourseDescription : "Autocad course covering all the concepts of Autocad",
    courseName: "AutoCAD",
    description: "Master the industry-standard computer-aided design (CAD) software used by architects, engineers, and designers worldwide. This comprehensive course provides a thorough grounding in both 2D drafting and 3D modeling within AutoCAD. You will learn to navigate the interface with confidence, use precision drawing tools to create technical drawings, and manage complex projects with layers and blocks. The course progresses from fundamental concepts to advanced techniques, including basic 3D solid modeling, rendering, and the creation of professional layout sheets for printing. Whether you're aiming for a career in mechanical engineering, architecture, or interior design, this course will provide you with the practical skills to turn your ideas into detailed and accurate digital blueprints.",
    courseDuration: "3 Months",
    courseFee: "15000",
    courseLearnings: [
      "Navigate the AutoCAD interface and use drawing aids for precision.",
      "Create and edit complex 2D geometry using drawing and modification tools.",
      "Organize drawings efficiently using layers, linetypes, and properties.",
      "Create reusable content with blocks and dynamic blocks.",
      "Add dimensions, text, and annotations to drawings to professional standards.",
      "Prepare layout sheets for plotting and publishing at various scales.",
      "Understand the basics of 3D modeling workspace and viewports.",
      "Create simple 3D solid models and apply basic materials and rendering.",
      "Export and share drawings in various formats (PDF, DWF, etc.).",
    ],
    courseSyllabus: [
      {
        module: "AutoCAD Essentials & 2D Drafting",
        topics: [
          "User Interface: Workspaces, Ribbons, and Command Line",
          "Basic Drawing Tools: Line, Circle, Arc, Rectangle, and Polygon",
          "Precision Techniques: Coordinates, Ortho, Polar, and Object Snaps",
          "Modification Tools: Move, Copy, Rotate, Mirror, Offset, Trim, and Extend",
          "Object Properties: Layers, Colors, Linetypes, and Lineweights",
        ],
      },
      {
        module: "Advanced 2D & Annotation",
        topics: [
          "Creating and Inserting Blocks for Reusable Content",
          "Dynamic Blocks with Parameters and Actions",
          "Adding Text: Single-line and Multi-line Text, Text Styles",
          "Dimensioning: Linear, Aligned, Radial, Angular, and Leaders",
          "Hatching and Gradient Fills",
          "Managing Drawing Templates (DWT Files)",
        ],
      },
      {
        module: "Layouts, Plotting & 3D Introduction",
        topics: [
          "Working in Paper Space: Creating Viewports and Controlling Scales",
          "Page Setup and Plotting/Printing Layouts to Scale",
          "Introduction to the 3D Modeling Workspace",
          "Creating Basic 3D Solids: Box, Cylinder, Sphere, Wedge",
          "3D Navigation: ViewCube, Orbit, and Visual Styles",
          "Generating 2D Drawings from 3D Models (Flatshot)",
        ],
      },
    ],
  },

  {
    courseID: 5,
    CourseImage: "https://res.cloudinary.com/dufxj1sau/image/upload/v1739439665/Course-logo/attcox9ak3oyzwvi6ch5.jpg",
    CourseDescription : "Coral Draw course covering all the concepts of Coral Draw",
    courseName: "CorelDRAW",
    description: "Unlock your creative potential with CorelDRAW, a powerful vector graphics suite used by professionals for illustration, layout, photo editing, and typography. This hands-on course is designed for aspiring graphic designers, marketers, and small business owners. You will learn the core principles of vector-based design, which allows for infinite scalability without loss of quality—perfect for logos, business cards, brochures, and large-scale signage. From manipulating shapes and curves with precision tools to working with text and applying stunning color fills and effects, you will gain the skills to produce high-quality, print-ready marketing materials and digital graphics. The course emphasizes practical, project-based learning to build a professional portfolio.",
    courseDuration: "3 Months",
    courseFee: "13000",
    courseLearnings: [
      "Understand the difference between vector and raster graphics.",
      "Navigate the CorelDRAW interface and workspaces effectively.",
      "Create and manipulate objects using the Shape Tool, Pen Tool, and Bézier curves.",
      "Apply and edit fills, outlines, gradients, and transparencies.",
      "Work professionally with artistic and paragraph text, including typography controls.",
      "Use layers and object manager to organize complex designs.",
      "Apply special effects such as blends, contours, and distortions.",
      "Prepare files for both print (CMYK, bleeds, traps) and web (RGB, export options).",
      "Design complete projects like logos, stationery, flyers, and social media graphics.",
    ],
    courseSyllabus: [
      {
        module: "CorelDRAW Fundamentals",
        topics: [
          "Introduction to the Vector Workspace: Tools and Palettes",
          "Drawing Basic Shapes and Lines",
          "Selecting, Transforming, and Duplicating Objects",
          "Mastering the Shape Tool for Node Editing",
          "Using the Freehand, Pen, and Bézier Tools for Precise Drawing",
        ],
      },
      {
        module: "Color, Effects & Typography",
        topics: [
          "Working with Color Palettes: Uniform, Fountain, and Pattern Fills",
          "Managing Outlines and Strokes",
          "Adding and Formatting Artistic and Paragraph Text",
          "Creating Special Effects: Envelopes, Blends, Contours, and Drop Shadows",
          "PowerClip: Placing Objects Inside Other Objects",
        ],
      },
      {
        module: "Project-Based Learning & Export",
        topics: [
          "Logo Design: From Concept to Final Vector Art",
          "Designing a Brand Kit: Business Card, Letterhead, and Envelope",
          "Creating a Multi-page Brochure or Flyer",
          "Preparing Files for Print: Bleed, Crop Marks, and Color Separation",
          "Exporting for Web: PNG, JPG, SVG, and PDF Formats",
          "Final Portfolio Review",
        ],
      },
    ],
  },

  {
    courseID: 6,
    CourseImage: "https://res.cloudinary.com/dufxj1sau/image/upload/v1739439665/Course-logo/dbbtp9rwyom4vjjxn2x5.png",
   
   CourseDescription : " Covers all the concepts of Tally",
    courseName: "Tally",
    description: "Gain a powerful competitive edge in the fields of accounting and finance with this comprehensive course on TallyPrime, India's leading business management and GST compliance software. This program is ideal for aspiring accountants, business owners, and finance professionals. You will build a strong foundation in accounting principles and then learn how to implement them digitally using Tally. The course covers everything from basic company setup and ledger creation to advanced features like managing complex inventory, processing payroll, and most importantly, handling all aspects of GST—from configuration and filing to generating e-way bills. Upon completion, you will be proficient in using Tally for day-to-day business accounting and generating crucial financial reports for decision-making.",
    courseDuration: "3 Months",
    courseFee: "10000",
    courseLearnings: [
      "Understand fundamental accounting concepts and the double-entry system (Debit/Credit).",
      "Create and manage company data, groups, ledgers, and vouchers in Tally.",
      "Record all types of accounting transactions including receipts, payments, sales, and purchases.",
      "Manage inventory: create stock items, godowns, and track stock movements.",
      "Configure and apply GST rates to transactions accurately.",
      "Generate GST returns (GSTR-1, GSTR-3B) and e-way bills directly from Tally.",
      "Process payroll, calculate salaries, and generate pay slips.",
      "Produce essential financial statements: Balance Sheet, Profit & Loss Account, Cash Flow Statement.",
      "Generate and analyze various business reports for accounting, inventory, and taxation.",
    ],
    courseSyllabus: [
      {
        module: "Accounting Fundamentals in Tally",
        topics: [
          "Introduction to Accounting Principles and TallyPrime Interface",
          "Creating a Company and Configuring Features",
          "Creating Chart of Accounts: Groups and Ledgers",
          "Recording Transactions: Voucher Entry (Payment, Receipt, Contra, Journal, Sales, Purchase)",
          "Generating Key Reports: Trial Balance, Day Book, and Ledger Statements",
        ],
      },
      {
        module: "Inventory & Advanced Accounting",
        topics: [
          "Setting Up Inventory Masters: Stock Groups, Items, Units, and Godowns",
          "Recording Inventory Vouchers: Stock Journal, Delivery Note, Receipt Note",
          "Tracking Cost Centers and Categories for detailed reporting",
          "Bank Reconciliation Statements",
        ],
      },
      {
        module: "GST Compliance & Payroll",
        topics: [
          "Configuring GST Settings for a Company",
          "Recording GST-Compliant Sales and Purchase Invoices",
          "Generating GST Returns (GSTR-1, GSTR-3B) and Reconciliation Reports",
          "Creating and Managing E-Way Bills",
          "Setting Up Payroll and Processing Employee Salary",
          "Final Project: Managing Books of Accounts for a Sample Business for a Full Financial Year",
        ],
      },
    ],
  },

  {
    courseID: 7,
    CourseImage: "https://res.cloudinary.com/dufxj1sau/image/upload/v1741855471/65e09abf952724557f01e3b7_Premier_eip8zp.png",
     CourseDescription  : "Covers all the copncepts of Premier Pro",
    courseName: "Adobe Premiere Pro",
    description: "Step into the world of professional video editing with Adobe Premiere Pro, the industry-standard software used by filmmakers, YouTubers, and content creators. This course provides a complete guide to editing, from importing raw footage to exporting a polished final product. You will learn the complete non-linear editing (NLE) workflow, including how to organize assets, make precise cuts and transitions, correct color and audio, add motion graphics and titles, and apply visual effects. The course covers essential techniques for a variety of formats, from social media reels and documentaries to short films and corporate videos. Through hands-on projects, you will build a demo reel that showcases your ability to tell compelling stories through video.",
    courseDuration: "6 Months",
    courseFee: "20000",
    courseLearnings: [
      "Navigate the Premiere Pro interface and customize your workspace.",
      "Import, organize, and manage media assets efficiently using bins and metadata.",
      "Master the essential editing tools: Razor, Slip, Slide, and Ripple Edit.",
      "Create seamless transitions and dynamic sequences with professional pacing.",
      "Perform color correction and grading to achieve a specific mood or fix footage.",
      "Edit and mix audio, add music, sound effects, and apply audio effects.",
      "Create and animate titles, graphics, and lower thirds.",
      "Use keyframing to create motion and animation for clips and graphics.",
      "Work with green screen footage using the Ultra Key effect.",
      "Understand codecs and export settings for various platforms (YouTube, Instagram, Broadcast).",
    ],
    courseSyllabus: [
      {
        module: "The Foundation: Workspace & Editing",
        topics: [
          "Tour of the Interface: Project Panel, Source Monitor, Timeline, Program Monitor",
          "Setting Up a Project and Importing Media",
          "Essential Editing Workflow: Assembling a Rough Cut",
          "Advanced Trimming Techniques and Timeline Management",
          "Working with Multiple Video and Audio Tracks",
        ],
      },
      {
        module: "Audio, Graphics & Effects",
        topics: [
          "Audio Editing: Essential Sound Panel, Audio Mixer, and Keyframing",
          "Adding and Customizing Video Transitions",
          "Applying and Adjusting Video Effects (Lumetri Color, Warp Stabilizer)",
          "Creating Titles with the Essential Graphics Panel",
          "Basic Color Correction and Grading with Lumetri Color",
        ],
      },
      {
        module: "Advanced Techniques & Finishing",
        topics: [
          "Advanced Color Grading: Using Scopes and Creative Looks",
          "Chroma Keying: Removing Green Screen Backgrounds",
          "Nesting Sequences and Working with Multi-Camera Edits",
          "Motion Graphics Integration with Adobe After Effects (Dynamic Link)",
          "Exporting: Codecs, Formats, and Presets for Web, Social Media, and Broadcast",
          "Final Project: Editing a Short Film or Documentary from Raw Footage to Final Export",
        ],
      },
    ],
  },

  {
    courseID: 8,
    CourseImage: "https://res.cloudinary.com/dufxj1sau/image/upload/v1742026887/oflds6wit4dszjsspyfe-removebg-preview_gxqziq.png",
    CourseDescription : "Cover all the concepts of Wordpress",
    courseName: "WordPress",
    description: "Empower yourself to build powerful, dynamic websites without writing code by mastering WordPress, the world's most popular Content Management System (CMS). This course is designed for entrepreneurs, bloggers, marketers, and aspiring web developers. You will learn how to install WordPress, choose and customize themes to control your site's appearance, and extend functionality with plugins. The curriculum covers everything from creating pages and blog posts to managing users, comments, and media. You will also learn crucial skills for website management, including search engine optimization (SEO) to increase visibility, security best practices to protect your site, and performance optimization to ensure a fast user experience. By the end, you'll be able to build and manage professional websites for yourself or clients.",
    courseDuration: "3 Months",
    courseFee: "15000",

    courseLearnings: [
      "Install WordPress on a local server and live web hosting (cPanel).",
      "Navigate the WordPress Admin Dashboard with confidence.",
      "Install, customize, and configure themes to change a website's design.",
      "Extend website functionality by finding, installing, and configuring plugins.",
      "Create and manage content: pages, posts, custom post types, and media.",
      "Build navigation menus, sidebars, and widgets.",
      "Understand and implement basic Search Engine Optimization (SEO) techniques.",
      "Apply security measures to protect a WordPress website from common threats.",
      "Manage users, comments, and website settings.",
      "Perform basic troubleshooting and maintenance, including updates and backups.",
    ],
    courseSyllabus: [
      {
        module: "WordPress Basics & Setup",
        topics: [
          "Introduction to CMS and WordPress.org vs. WordPress.com",
          "Manual Installation on Web Hosting (cPanel) and Local Server (Local by Flywheel)",
          "Dashboard Overview: Posts, Pages, Media, Comments, and Appearance",
          "Creating and Formatting Content: The Gutenberg Block Editor",
          "Managing Media: Uploading and Optimizing Images",
        ],
      },
      {
        module: "Customization with Themes & Plugins",
        topics: [
          "Finding, Installing, and Activating Themes",
          "Customizing Appearance with the WordPress Customizer",
          "Introduction to Page Builders (Elementor) for Drag-and-Drop Design",
          "Extending Functionality: Essential Plugins for Contact Forms, SEO, Security, and Backup",
          "Creating Custom Menus and Widget Areas",
        ],
      },
      {
        module: "Management, SEO & Security",
        topics: [
          "User Management: Roles and Capabilities",
          "Introduction to SEO: Using a Plugin like Yoast or Rank Math",
          "Website Security: Strong Passwords, Security Plugins, and Best Practices",
          "Website Maintenance: Updating Core, Themes, and Plugins; Creating Backups",
          "Website Performance: Caching and Image Optimization",
          "Final Project: Building a Complete Business or Blog Website from Scratch",
        ],
      },
    ],
  },

  {
    courseID: 9,
    CourseImage: "https://res.cloudinary.com/dufxj1sau/image/upload/v1739439665/Course-logo/ubra8mifjr9kdlzs4rht.jpg",
    CourseDescription : "Computer Applications Deploma course covering all the concepts of Computer Applications Deploma",
    courseName: "Computer Applications Diploma",
    description: "This intensive one-year diploma is designed to provide a holistic foundation in computer science and office automation, making you proficient and job-ready for a variety of administrative and IT support roles. The program is structured into three key segments: Office Productivity, where you will achieve mastery in the entire Microsoft Office Suite (Word, Excel, PowerPoint, Access) and effective internet usage; Programming & Systems, introducing you to the logical building blocks of programming with Python and database management with SQL; and Hardware & Networking, giving you the practical skills to assemble, maintain, and troubleshoot computer systems and understand basic network configurations. This course is the perfect launchpad for anyone seeking a comprehensive understanding of how to use and manage computer technology in a modern office environment.",
    courseDuration: "1 Year",
    courseFee: "40000",
    courseLearnings: [
      "Achieve advanced proficiency in MS Office: Word, Excel, PowerPoint, and Access.",
      "Create professional documents, complex spreadsheets, dynamic presentations, and simple databases.",
      "Use the internet effectively for communication, research, and cybersecurity awareness.",
      "Develop foundational programming logic and skills using Python.",
      "Understand and write basic SQL queries to manage and manipulate data.",
      "Identify computer hardware components and perform PC assembly and disassembly.",
      "Diagnose common hardware and software issues and perform troubleshooting.",
      "Understand operating system installation, configuration, and maintenance.",
      "Grasp fundamental networking concepts, including IP addressing and network types.",
      "Develop touch typing skills for improved data entry speed and accuracy.",
    ],
    courseSyllabus: [
      {
        module: "Office Productivity Suite",
        topics: [
          "MS Word: Advanced Document Formatting, Mail Merge, and Collaboration",
          "MS Excel: Formulas, Functions, PivotTables, Charts, and Data Analysis",
          "MS PowerPoint: Advanced Animations, Transitions, and Presentation Design",
          "MS Access: Database Design, Tables, Queries, Forms, and Reports",
          "Internet & Email: Effective Browsing, Online Research, and Cybersecurity Basics",
          "Touch Typing Mastery",
        ],
      },
      {
        module: "Programming & Database Fundamentals",
        topics: [
          "Introduction to Programming with Python: Syntax, Variables, Data Types",
          "Control Structures: Conditional Statements and Loops",
          "Functions, Modules, and Working with Files",
          "Database Concepts: Introduction to RDBMS and SQL",
          "SQL Commands: SELECT, INSERT, UPDATE, DELETE, and WHERE clauses",
        ],
      },
      {
        module: "Computer Hardware & Networking",
        topics: [
          "PC Hardware: Identifying Components (CPU, RAM, HDD/SSD, Motherboard, PSU)",
          "Hands-on PC Assembly and Disassembly Lab",
          "Operating Systems: Windows Installation, Driver Management, and Disk Partitioning",
          "Software Installation and Troubleshooting Common OS Errors",
          "Networking Basics: Types of Networks, IP Addressing, and Network Devices",
          "Final Project: Integrated project combining office, programming, and hardware skills.",
        ],
      },
    ],
  },

  {
    courseID: 10,
    CourseImage: "https://res.cloudinary.com/dufxj1sau/image/upload/v1739439665/Course-logo/mr26tx7ljnz1tkob8iqa.png",
    CourseDescription : "Photoshop course covering all the concepts of Photoshop",
    courseName: "Photoshop",
    description: "Discover the limitless possibilities of digital image manipulation and graphic design with Adobe Photoshop, the ultimate software for photographers, designers, and artists. This course takes you on a journey from the absolute basics of the interface to advanced compositing and retouching techniques. You will learn to work with layers and masks—the core of non-destructive editing—to combine images seamlessly. The curriculum covers professional photo correction, color grading, and restoration, as well as the skills needed to design marketing materials like social media posts, web banners, and posters. Through project-based learning, you will develop a strong artistic eye and the technical prowess to bring your creative visions to life, building a standout portfolio in the process.",
    courseDuration: "3 Months",
    courseFee: "12000",
    courseLearnings: [
      "Navigate the Photoshop workspace and customize it for efficiency.",
      "Master selection tools to isolate and edit parts of an image with precision.",
      "Understand and use layers, layer masks, and blending modes for non-destructive editing.",
      "Perform professional photo retouching: blemish removal, skin smoothing, and object removal.",
      "Correct color and exposure issues and apply creative color grading.",
      "Combine multiple images into seamless composites.",
      "Work with text and layer styles to create typographic designs.",
      "Use filters and smart objects for creative effects and flexible editing.",
      "Design graphics for web and print, understanding resolution and color modes (RGB/CMYK).",
      "Automate tasks with actions and prepare files for different outputs.",
    ],
    courseSyllabus: [
      {
        module: "Photoshop Essentials",
        topics: [
          "Interface Overview: Tools, Panels, and Workspaces",
          "Document Setup: Resolution, Color Modes (RGB/CMYK), and Canvas Size",
          "Essential Tools: Move, Marquee, Lasso, Quick Selection, and Magic Wand",
          "Working with Layers: The Foundation of Photoshop",
          "Basic Image Adjustments: Levels, Curves, Hue/Saturation, and Cropping",
        ],
      },
      {
        module: "Retouching & Compositing",
        topics: [
          "Advanced Selection Techniques: Select and Mask, Color Range",
          "Non-Destructive Editing with Layer Masks and Adjustment Layers",
          "Photo Retouching: Clone Stamp, Healing Brush, Spot Healing Brush, and Patch Tool",
          "Color Correction and Grading for a Professional Look",
          "Introduction to Compositing: Blending Multiple Images Realistically",
        ],
      },
      {
        module: "Typography, Effects & Projects",
        topics: [
          "Working with Type: Text Tool, Character Panel, and Paragraph Panel",
          "Layer Styles: Drop Shadows, Strokes, Bevels, and Glows",
          "Smart Objects for Scalable, Non-Destructive Transformations",
          "Using Filters for Creative Effects",
          "Project: Photo Restoration, Social Media Kit Design, and Movie Poster Design",
          "Saving and Exporting for Web and Print",
        ],
      },
    ],
  },

  {
  courseID: 12,
  CourseImage: "https://res.cloudinary.com/dufxj1sau/image/upload/v1739439665/Course-logo/ubra8mifjr9kdlzs4rht.jpg",
  courseName: "Computer Fundamentals & Office Applications",
  CourseDescription : "Computer Fundamentals & Office Applications course covering all the concepts of Computer Fundamentals & Office Applications",
  description: "A comprehensive 3-month course designed to build a solid foundation in computer operations and essential software skills. This program is perfect for beginners, job seekers, and professionals looking to enhance their digital literacy. You'll start with the absolute basics of computer hardware and software, then progress to mastering the Microsoft Office Suite—the industry standard for productivity software. The course also covers practical internet skills, email etiquette, and crucial cybersecurity practices to keep you safe online. Through hands-on exercises and real-world projects, you'll gain the confidence and competence needed to thrive in today's digital workplace, whether you're creating professional documents, analyzing data, or communicating effectively online.",
  courseDuration: "3 Months",
  courseFee: "10000",
  courseLearnings: [
    "Understand computer architecture, hardware components, and software ecosystems",
    "Navigate operating systems (Windows/macOS) with proficiency and confidence",
    "Master file management techniques for organizing digital documents efficiently",
    "Create professional documents with advanced formatting in Microsoft Word",
    "Build complex spreadsheets with formulas, functions, and data analysis in Excel",
    "Design compelling presentations with animations and transitions in PowerPoint",
    "Utilize internet resources effectively for research and information gathering",
    "Practice professional email communication with proper etiquette and organization",
    "Implement cybersecurity best practices to protect personal and work data",
    "Develop touch typing skills with improved speed and accuracy",
    "Troubleshoot common computer problems and perform basic maintenance",
    "Use cloud storage services for backup and file sharing across devices"
  ],
  courseSyllabus: [
    {
      module: "Computer Fundamentals & Operating Systems",
      topics: [
        "Introduction to Computing: History and Evolution of Computers",
        "Hardware Components: CPU, RAM, Storage, Motherboard, and Peripherals",
        "Software Types: System Software vs. Application Software",
        "Operating System Navigation: Windows and macOS Interfaces",
        "File System Management: Creating, Organizing, and Searching for Files",
        "System Configuration: Display Settings, User Accounts, and Accessibility Options",
        "Installing and Uninstalling Software Applications",
        "Using Utility Programs: Disk Cleanup, Defragmentation, and Backup Tools"
      ]
    },
    {
      module: "Microsoft Word - Professional Document Creation",
      topics: [
        "Word Interface Overview: Ribbon, Quick Access Toolbar, and Views",
        "Text Formatting: Fonts, Paragraph Alignment, and Styles",
        "Page Layout: Margins, Orientation, Size, and Columns",
        "Working with Templates and Building Blocks",
        "Advanced Features: Tables, Images, Shapes, and SmartArt",
        "Document References: Table of Contents, Footnotes, and Citations",
        "Mail Merge: Creating Letters, Envelopes, and Labels for Mass Communication",
        "Collaboration Tools: Track Changes, Comments, and Document Comparison",
        "Final Project: Creating a Multi-page Business Report with Professional Formatting"
      ]
    },
    {
      module: "Microsoft Excel - Spreadsheets & Data Analysis",
      topics: [
        "Excel Interface: Workbooks, Worksheets, Cells, and Ranges",
        "Data Entry Techniques and AutoFill Features",
        "Formulas and Functions: SUM, AVERAGE, COUNT, IF, and VLOOKUP",
        "Cell Referencing: Relative, Absolute, and Mixed References",
        "Data Formatting: Number Formats, Conditional Formatting, and Table Styles",
        "Data Management: Sorting, Filtering, and Data Validation",
        "Chart Creation: Bar, Pie, Line, and Combo Charts for Data Visualization",
        "PivotTables and PivotCharts for Dynamic Data Analysis",
        "Final Project: Building a Budget Tracker with Formulas and Charts"
      ]
    },
    {
      module: "Microsoft PowerPoint - Effective Presentations",
      topics: [
        "PowerPoint Interface: Slides, Layouts, and Master Views",
        "Design Principles: Themes, Color Schemes, and Font Pairing",
        "Adding and Formatting Content: Text Boxes, Images, and Media",
        "Slide Transitions and Animation Effects",
        "Multimedia Integration: Audio, Video, and Screen Recording",
        "Presenter View: Notes, Timer, and Presentation Tools",
        "Creating Handouts and Exporting Presentations to Other Formats",
        "Final Project: Designing a Business Pitch Deck with Animations and Transitions"
      ]
    },
    {
      module: "Internet, Email & Cybersecurity",
      topics: [
        "Internet Fundamentals: How the Web Works, Browsers, and Search Engines",
        "Effective Online Research: Advanced Search Techniques and Source Evaluation",
        "Email Management: Creating Professional Accounts, Organizing Folders, and Filters",
        "Email Etiquette: Subject Lines, Salutations, Signatures, and Tone",
        "Cloud Storage: Using Google Drive, OneDrive, and Dropbox for File Management",
        "Cybersecurity Threats: Viruses, Malware, Phishing, and Social Engineering",
        "Password Management: Creating Strong Passwords and Using Password Managers",
        "Privacy Settings: Social Media, Browser, and Application Privacy",
        "Safe Online Practices: Secure Shopping, Banking, and Data Sharing"
      ]
    },
    {
      module: "Capstone Project & Skill Integration",
      topics: [
        "Integrating Office Applications: Embedding Excel Charts in Word and PowerPoint",
        "Creating a Comprehensive Business Portfolio Document",
        "Designing an Interactive Presentation with Linked Excel Data",
        "Developing a Personal Budget in Excel with Charts for Presentation",
        "Final Assessment: Practical Exam Covering All Course Modules",
        "Career Preparation: Building a Digital Skills Resume",
        "Course Review and Next Steps for Continued Learning"
      ]
    }
  ]
  },

  {
    courseID: 11,
    CourseImage: "https://res.cloudinary.com/dufxj1sau/image/upload/v1742027236/qlgtheupsgvqq0vg1ca9-removebg-preview_bvzlbh.png",
    courseName: "Advanced Computer Applications & IT Fundamentals",
    description: "This intensive 6-month program is designed for those who have basic computer skills and want to advance their expertise in specialized areas of computing. The course provides a comprehensive overview of advanced office productivity tools, programming fundamentals, database management, graphic design basics, and networking concepts. You'll dive deep into Excel's powerful data analysis capabilities, learn the logic of programming with Python, understand how to manipulate and query databases, explore graphic design principles, and grasp the fundamentals of computer networking. Through practical projects and hands-on labs, you'll develop a diverse skill set that prepares you for roles requiring technical proficiency across multiple domains, from data analysis to IT support.",
    courseDuration: "6 Months",
    CourseDescription : "Computer Applications Deploma course covering all the concepts of Computer Applications Deploma",
    courseFee: "25000",
    courseLearnings: [
      "Master advanced Excel features including pivot tables, complex formulas, and data visualization",
      "Automate repetitive tasks using Excel macros and VBA programming",
      "Understand programming concepts and write basic Python scripts",
      "Develop problem-solving skills through algorithmic thinking",
      "Create and manage databases using Microsoft Access",
      "Write SQL queries to extract, filter, and analyze data",
      "Apply design principles to create visually appealing graphics and layouts",
      "Understand computer networking fundamentals and protocols",
      "Diagnose and troubleshoot common hardware and software issues",
      "Implement data security practices and backup strategies",
      "Collaborate effectively using cloud-based tools and version control",
      "Prepare for industry-recognized certifications in various IT domains"
    ],
    courseSyllabus: [
      {
        module: "Advanced Microsoft Excel & Automation",
        topics: [
          "Advanced Functions: INDEX-MATCH, SUMIFS, COUNTIFS, and Array Formulas",
          "Data Analysis with PivotTables and PivotCharts: Slicers, Timelines, and Calculated Fields",
          "What-If Analysis: Data Tables, Goal Seek, and Scenario Manager",
          "Data Visualization: Advanced Chart Types, Sparklines, and Conditional Formatting",
          "Introduction to Excel VBA: Recording Macros, Understanding the VBA Editor",
          "Writing Basic VBA Code: Variables, Loops, and Conditional Statements",
          "Creating User Forms and Custom Functions with VBA",
          "Automating Complex Workflows and Data Processing Tasks",
          "Project: Building an Automated Dashboard with Interactive Elements"
        ]
      },
      {
        module: "Programming Fundamentals with Python",
        topics: [
          "Introduction to Programming: Algorithms, Flowcharts, and Pseudocode",
          "Python Environment Setup: Installing Python and an IDE (PyCharm/VSCode)",
          "Python Syntax: Variables, Data Types, and Basic Operations",
          "Control Structures: Conditional Statements (if, elif, else) and Logical Operators",
          "Loops: For loops, While loops, and Loop Control Statements",
          "Data Structures: Lists, Tuples, Dictionaries, and Sets",
          "Functions: Defining Functions, Parameters, Return Values, and Scope",
          "File Handling: Reading from and Writing to Text Files",
          "Error Handling: Try-Except Blocks and Exception Management",
          "Project: Building a Text-Based Application (Calculator/To-Do List)"
        ]
      },
      {
        module: "Database Management with Access & SQL",
        topics: [
          "Database Concepts: Tables, Records, Fields, and Relationships",
          "Designing a Database: Normalization and Entity-Relationship Diagrams",
          "Microsoft Access Interface: Tables, Queries, Forms, and Reports",
          "Creating and Managing Tables: Data Types, Primary Keys, and Indexes",
          "Querying Data: Select Queries, Criteria, and Sorting",
          "Advanced Queries: Parameter Queries, Action Queries, and CrossTab Queries",
          "Introduction to SQL: SELECT, FROM, WHERE, ORDER BY, and JOIN Statements",
          "Building User Interfaces: Forms with Controls and Subforms",
          "Generating Reports: Grouping, Sorting, and Calculating Data",
          "Project: Developing a Complete Database Application for Inventory Management"
        ]
      },
      {
        module: "Graphic Design Fundamentals",
        topics: [
          "Design Principles: Balance, Contrast, Hierarchy, and Alignment",
          "Color Theory: Color Wheels, Harmonies, and Psychology of Color",
          "Typography: Font Families, Pairing, and Hierarchy",
          "Introduction to Adobe Photoshop: Interface, Tools, and Layers",
          "Image Editing: Cropping, Resizing, Retouching, and Color Correction",
          "Introduction to Adobe Illustrator: Vector Graphics, Paths, and Shapes",
          "Logo Design and Brand Identity Basics",
          "Layout Design: Creating Flyers, Brochures, and Social Media Graphics",
          "Project: Designing a Cohesive Brand Identity Package"
        ]
      },
      {
        module: "Networking & IT Infrastructure",
        topics: [
          "Networking Fundamentals: LAN, WAN, MAN, and Network Topologies",
          "OSI and TCP/IP Models: Understanding Network Layers",
          "Network Devices: Routers, Switches, Hubs, and Modems",
          "IP Addressing: IPv4, Subnetting, and Introduction to IPv6",
          "Network Protocols: HTTP, HTTPS, FTP, DNS, and DHCP",
          "Wireless Networking: Wi-Fi Standards, Security, and Configuration",
          "Network Troubleshooting: Using Command Line Tools (ipconfig, ping, tracert)",
          "Introduction to Cloud Computing: IaaS, PaaS, SaaS Models",
          "Project: Designing a Small Office Network Infrastructure"
        ]
      },
      {
        module: "System Administration & Troubleshooting",
        topics: [
          "Operating System Installation: Windows and Linux Basics",
          "User Account Management: Permissions and Access Control",
          "System Maintenance: Disk Management, Updates, and Backup Strategies",
          "Troubleshooting Methodology: Identifying and Resolving Common Issues",
          "Hardware Basics: Component Identification, Installation, and Upgrades",
          "Software Troubleshooting: Compatibility, Installation, and Removal",
          "Security Practices: Antivirus, Firewalls, and Malware Removal",
          "Remote Access and Support Tools",
          "Project: Performing a Complete System Diagnostic and Optimization"
        ]
      },
      {
        module: "Capstone Project & Career Preparation",
        topics: [
          "Integrating Multiple Skills: Developing a Comprehensive Business Solution",
          "Project Management Basics: Planning, Execution, and Documentation",
          "Creating a Technical Portfolio Showcasing Course Projects",
          "Resume Preparation: Highlighting Technical Skills and Achievements",
          "Interview Preparation: Technical Questions and Problem-Solving Scenarios",
          "Industry Certifications Overview: Microsoft Office Specialist, CompTIA ITF+, etc.",
          "Continuing Education Paths: Specialized IT Careers and Further Learning",
          "Final Presentation: Demonstrating Capstone Project to Instructors and Peers"
        ]
      }
    ]
  }
];

export default courses;