'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState([]);
  const [userData, setUserData] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [lockedCourse, setLockedCourse] = useState(null);
  const [mounted, setMounted] = useState(false);

  // Configuration for course image dimensions (in pixels)
  const enrolledCourseImageConfig = {
    width: 100,
    height: 500
  };
  
  const otherCoursesImageConfig = {
    width: 300,
    height: 240
  };

  // Sample course data
  const sampleCourses = [
    {

      id: "course 1",
      coursePhoto: "https://res.cloudinary.com/dyigmfiar/image/upload/v1756112814/VN-Video-Editor-1-1-e1621523447781-Picsart-AiImageEnhancer_ogwpnu.png",
      courseName: "VN video editing",
      duration: "14 weeks",
      description: "Learn how to edit videos professionally using VN, from trimming clips to adding effects.Perfect for beginners who want to create engaging content with ease..",
      totalChapters: 12
    },
    {
      id: "course 2",
      coursePhoto: "https://res.cloudinary.com/dyigmfiar/image/upload/v1756114031/Screenshot_2025-08-25_143245_uoofbp.png",
      courseName: "AI and ChatGPT",
      duration: "14 weeks",
      description: "Discover how AI and ChatGPT work and how to use them effectively.Boost productivity, creativity, and problem-solving with smart tools.",
      totalChapters: 15
    },
    {
      id: "course 3",
      coursePhoto: "https://res.cloudinary.com/dyigmfiar/image/upload/v1756111970/ExcelImg_sutzbk.jpg",
      courseName: "MS Excel Course",
      duration: "14 weeks",
      description: "Master Excel basics to advanced functions for data management and analysis.Gain skills that are essential for work, study, and business.",
      totalChapters: 8
    },
    {
      id: "course 4",
      coursePhoto: "https://res.cloudinary.com/dyigmfiar/image/upload/v1756111971/Canva-Business-Model_u0zbt8.png",
      courseName: "Canva Course",
      duration: "14 weeks",
      description: "Create stunning graphics, presentations, and social media posts with Canva.Learn design principles without needing advanced graphic design skills.",
      totalChapters: 10
    },
    {
      id: "course 5",
      coursePhoto: "https://res.cloudinary.com/dyigmfiar/image/upload/v1756112019/apps.29405.13510798885101997.34f5ec74-0607-4c99-bca6-0b5dbce6deb4_pkej0k.jpg",
      courseName: "HTML Course",
      duration: "14 weeks",
      description: "Build the foundation of web development with HTML.Learn to structure websites and create clean, functional pages.",
      totalChapters: 14
    }
  ];

  useEffect(() => {
    setMounted(true);
    
    const token = localStorage.getItem('onlineCourseUserToken');
    const user = localStorage.getItem('onlineCourseUser');

    if (!token) {
      router.push('/onlineCourse/login');
      return;
    }

    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      if (decoded.exp < currentTime) {
        localStorage.removeItem('onlineCourseUserToken');
        localStorage.removeItem('onlineCourseUser');
        router.push('/onlineCourse/login');
        return;
      }
      
      if (user) {
        setUserData(JSON.parse(user));
      }
      
      // Simulate API call to fetch courses
      setTimeout(() => {
        setCourses(sampleCourses);
        setLoading(false);
      }, 1500);
    } catch (error) {
      console.error('Invalid onlineCourseUserToken:', error);
      localStorage.removeItem('onlineCourseUserToken');
      localStorage.removeItem('onlineCourseUser');
      router.push('/onlineCourse/login');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('onlineCourseUserToken');
    localStorage.removeItem('onlineCourseUser');
    router.push('/onlineCourse/login');
  };

  const handleCourseClick = (course) => {
    // Check if user is enrolled in this course by courseName
    if (userData && userData.courseName === course.courseName) {
      router.push(`/onlineCourse/videos/${encodeURIComponent(course.courseName)}`);
    } else {
      setLockedCourse(course);
      setShowPopup(true);
    }
  };

  const closePopup = () => {
    setShowPopup(false);
    setTimeout(() => setLockedCourse(null), 300);
  };

  const handleWhatsAppClick = () => {
    if (!userData || !lockedCourse) return;
    
    const message = `Hello, I would like to enroll in the ${lockedCourse} course. 
    
My Details:
Name: ${userData.fullName}
Email: ${userData.email}
Current Course: ${userData.courseName || 'None'}

Please provide me with enrollment details.`;
    
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/?text=${encodedMessage}`, '_blank');
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: '#f5f7fa',
        transition: 'all 0.3s ease'
      }}>
        <div style={{ 
          textAlign: 'center', 
          color: 'white',
          animation: 'fadeIn 0.5s ease'
        }}>
          <div style={{ 
            width: '50px', 
            height: '50px', 
            border: '5px solid #48bb78', 
            borderTop: '5px solid white', 
            borderRadius: '50%', 
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }}></div>
          <h2 style={{ margin: 0 }}>Loading Courses...</h2>
        </div>
      </div>
    );
  }

  // Separate enrolled course from other courses
  const enrolledCourse = userData
    ? courses.find(course => course.courseName === userData.courseName)
    : null;
  const otherCourses = userData
    ? courses.filter(course => course.courseName !== userData.courseName)
    : courses;

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f5f7fa', 
      position: 'relative',
      opacity: mounted ? 1 : 0,
      transition: 'opacity 0.5s ease'
    }}>
      <header style={{
        backgroundColor: 'white',
        padding: '1rem 2rem',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
      
      }}>
        <h1 style={{ 
          color: '#4a5568', 
          margin: 0,
          background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontSize: 'clamp(1.5rem, 4vw, 2rem)',
          transition: 'all 0.3s ease'
        }}>
          Online Learning Platform
        </h1>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '1rem',
          flexWrap: 'wrap' 
        }}>
          {userData && (
            <div style={{ textAlign: 'right' }}>
              <div style={{ 
                fontWeight: '600', 
                color: '#4a5568',
                fontSize: 'clamp(0.9rem, 2.5vw, 1rem)'
              }}>
                {userData.fullName}
              </div>
              <div style={{ 
                fontSize: '0.8rem', 
                color: '#718096',
                fontSize: 'clamp(0.7rem, 2vw, 0.8rem)'
              }}>
                Enrolled in: {userData.courseName}
              </div>
            </div>
          )}
          <button 
            onClick={handleLogout}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#667eea',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: '600',
              transition: 'all 0.2s ease',
              ':hover': {
                backgroundColor: '#5a67d8',
                transform: 'translateY(-2px)'
              }
            }}
          >
            Logout
          </button>
        </div>
      </header>

      <main style={{ 
        padding: 'clamp(1rem, 3vw, 2rem)',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {/* Enrolled Course Section */}
        {enrolledCourse && (
          <div style={{ 
            marginBottom: '3rem',
            animation: 'slideUp 0.5s ease'
          }}>
            <h2 style={{ 
              color: '#2d3748', 
              marginBottom: '1.5rem',
              fontSize: 'clamp(1.5rem, 4vw, 1.8rem)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              flexWrap: 'wrap'
            }}>
              Your Enrolled Course
              <span style={{
                fontSize: '0.8rem',
                backgroundColor: '#48bb78',
                color: 'white',
                padding: '0.2rem 0.8rem',
                borderRadius: '20px',
                fontWeight: '600'
              }}>
                Active
              </span>
            </h2>
            
            <div 
              onClick={() => handleCourseClick(enrolledCourse)}
              style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                '@media (min-width: 768px)': {
                  flexDirection: 'row'
                },
                maxWidth: '900px',
                margin: '0 auto',
                animation: 'scaleIn 0.5s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 10px 15px rgba(0, 0, 0, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
              }}
            >
              <div style={{
                width: '100%',
                height: `${enrolledCourseImageConfig.height}px`,
                '@media (min-width: 768px)': {
                  width: `${enrolledCourseImageConfig.width}px`,
                  flexShrink: 0
                },
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#f3f3f3'
              }}>
                <img
                  src={enrolledCourse.coursePhoto || '/courses/placeholder.jpg'}
                  alt={enrolledCourse.courseName}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block'
                  }}
                  onError={e => { e.target.src = '/courses/placeholder.jpg'; }}
                />
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(45deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)',
                  animation: 'shimmer 3s infinite linear'
                }}></div>
              </div>
              
              <div style={{ 
                padding: 'clamp(1rem, 3vw, 1.5rem)', 
                flexGrow: 1 
              }}>
                <h3 style={{ 
                  margin: '0 0 0.5rem 0', 
                  color: '#2d3748',
                  fontSize: 'clamp(1.2rem, 3vw, 1.5rem)'
                }}>
                  {enrolledCourse.courseName}
                </h3>
                
                <div style={{ 
                  display: 'flex', 
                  gap: '0.75rem',
                  marginBottom: '1rem',
                  flexWrap: 'wrap'
                }}>
                  <span style={{ 
                    backgroundColor: '#ebf4ff', 
                    color: '#667eea',
                    padding: '0.4rem 0.8rem',
                    borderRadius: '6px',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    transition: 'all 0.2s ease'
                  }}>
                    {enrolledCourse.duration}
                  </span>
                  <span style={{ 
                    backgroundColor: '#e9f5f2', 
                    color: '#38a169',
                    padding: '0.4rem 0.8rem',
                    borderRadius: '6px',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    transition: 'all 0.2s ease'
                  }}>
                    {enrolledCourse.totalChapters} chapters
                  </span>
                </div>
                
                <p style={{ 
                  color: '#718096', 
                  margin: '0 0 1rem 0',
                  lineHeight: '1.5',
                  fontSize: 'clamp(0.9rem, 2.5vw, 1rem)'
                }}>
                  {enrolledCourse.description}
                </p>
                
                <button
                  onClick={() => router.push(`/onlineCourse/videos/${encodeURIComponent(enrolledCourse.courseName)}`)}
                  style={{
                    padding: '0.6rem 1.2rem',
                    backgroundColor: '#667eea',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: '0.9rem',
                    transition: 'all 0.2s ease',
                    ':hover': {
                      backgroundColor: '#5a67d8',
                      transform: 'translateY(-2px)'
                    }
                  }}
                >
                  Continue Learning
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Other Courses Section */}
        <div style={{ 
          marginBottom: '2rem',
          animation: 'fadeIn 0.5s ease 0.2s both'
        }}>
          <h2 style={{ 
            color: '#2d3748', 
            marginBottom: '0.5rem',
            fontSize: 'clamp(1.5rem, 4vw, 1.8rem)'
          }}>
            Available Courses
          </h2>
          <p style={{ 
            color: '#718096', 
            margin: 0,
            fontSize: 'clamp(0.9rem, 2.5vw, 1rem)'
          }}>
            {userData ? 'Explore more courses to expand your knowledge' : 'Expand your knowledge with our curated selection of courses'}
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 300px), 1fr))',
          gap: '1.5rem',
          animation: 'fadeIn 0.5s ease 0.4s both'
        }}>
          {otherCourses.map((course, index) => {
            const isEnrolled = userData && userData.courseName === course.id;
            
            return (
              <div 
                key={course.id}
                onClick={() => handleCourseClick(course)}
                style={{
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.3s ease',
                  cursor: isEnrolled ? 'pointer' : 'not-allowed',
                  position: 'relative',
                  opacity: isEnrolled ? 1 : 0.8,
                  animation: `slideUp 0.5s ease ${0.1 * index}s both`
                }}
                onMouseEnter={(e) => {
                  if (isEnrolled) {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.style.boxShadow = '0 10px 15px rgba(0, 0, 0, 0.1)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (isEnrolled) {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
                  }
                }}
              >
                {!isEnrolled && (
                  <div style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    backgroundColor: 'rgba(0,0,0,0.7)',
                    borderRadius: '50%',
                    width: '40px',
                    height: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 2,
                    animation: 'pulse 2s infinite'
                  }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                    </svg>
                  </div>
                )}
                
                <div style={{
                  width: '100%',
                  height: `${otherCoursesImageConfig.height}px`,
                  position: 'relative',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: '#f3f3f3'
                }}>
                  <img
                    src={course.coursePhoto || '/courses/placeholder.jpg'}
                    alt={course.courseName}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block',
                      filter: !isEnrolled ? 'grayscale(60%) blur(1px)' : 'none'
                    }}
                    onError={e => { e.target.src = '/courses/placeholder.jpg'; }}
                  />
                  {!isEnrolled && (
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      backgroundColor: 'rgba(0,0,0,0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                      </svg>
                    </div>
                  )}
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(45deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)',
                    animation: 'shimmer 3s infinite linear'
                  }}></div>
                </div>
                
                <div style={{ 
                  padding: 'clamp(1rem, 3vw, 1.5rem)' 
                }}>
                  <h3 style={{ 
                    margin: '0 0 0.5rem 0', 
                    color: isEnrolled ? '#2d3748' : '#718096',
                    fontSize: 'clamp(1.1rem, 3vw, 1.3rem)'
                  }}>
                    {course.courseName}
                    {isEnrolled && (
                      <span style={{
                        fontSize: '0.8rem',
                        backgroundColor: '#48bb78',
                        color: 'white',
                        padding: '0.2rem 0.5rem',
                        borderRadius: '4px',
                        marginLeft: '0.5rem'
                      }}>
                        Enrolled
                      </span>
                    )}
                  </h3>
                  
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    marginBottom: '0.75rem',
                    flexWrap: 'wrap',
                    gap: '0.5rem'
                  }}>
                    <span style={{ 
                      backgroundColor: isEnrolled ? '#ebf4ff' : '#e2e8f0', 
                      color: isEnrolled ? '#667eea' : '#718096',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '4px',
                      fontSize: '0.8rem',
                      fontWeight: '600'
                    }}>
                      {course.duration}
                    </span>
                    <span style={{ 
                      backgroundColor: isEnrolled ? '#e9f5f2' : '#e2e8f0', 
                      color: isEnrolled ? '#38a169' : '#718096',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '4px',
                      fontSize: '0.8rem',
                      fontWeight: '600'
                    }}>
                      {course.totalChapters} chapters
                    </span>
                  </div>
                  
                  <p style={{ 
                    color: isEnrolled ? '#718096' : '#a0aec0', 
                    margin: '0 0 1rem 0',
                    lineHeight: '1.5',
                    fontSize: 'clamp(0.85rem, 2.5vw, 0.95rem)'
                  }}>
                    {course.description}
                  </p>
                  
                  {!isEnrolled && (
                    <div style={{
                      textAlign: 'center',
                      padding: '0.5rem',
                      backgroundColor: '#fed7d7',
                      color: '#c53030',
                      borderRadius: '4px',
                      fontSize: '0.9rem',
                      fontWeight: '500',
                      animation: 'pulse 2s infinite'
                    }}>
                      Not enrolled - Click to learn more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Enrollment Popup */}
      {showPopup && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          animation: 'fadeIn 0.3s ease',
          padding: '1rem'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: 'clamp(1.5rem, 3vw, 2rem)',
            maxWidth: '500px',
            width: '100%',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
            animation: 'scaleIn 0.3s ease',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <h2 style={{ 
              marginTop: 0, 
              color: '#2d3748',
              fontSize: 'clamp(1.3rem, 3vw, 1.5rem)'
            }}>
              Course Not Enrolled
            </h2>
            
            <p style={{ 
              color: '#718096', 
              lineHeight: '1.6',
              fontSize: 'clamp(0.9rem, 2.5vw, 1rem)'
            }}>
              You are not currently enrolled in <strong>{lockedCourse?.courseName}</strong>. 
              Please contact us via WhatsApp to enroll in this course.
            </p>
            
            {userData && (
              <div style={{ 
                backgroundColor: '#f7fafc', 
                padding: '1rem', 
                borderRadius: '8px',
                margin: '1.5rem 0'
              }}>
                <h4 style={{ 
                  margin: '0 0 0.5rem 0', 
                  color: '#4a5568',
                  fontSize: 'clamp(1rem, 2.5vw, 1.1rem)'
                }}>Your Details:</h4>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'auto 1fr', 
                  gap: '0.5rem',
                  fontSize: 'clamp(0.85rem, 2.5vw, 0.9rem)'
                }}>
                  <span style={{ fontWeight: '600', color: '#4a5568' }}>Name:</span>
                  <span>{userData.fullName}</span>
                  
                  <span style={{ fontWeight: '600', color: '#4a5568' }}>Email:</span>
                  <span>{userData.email}</span>
                  
                  <span style={{ fontWeight: '600', color: '#4a5568' }}>Current Course:</span>
                  <span>{userData.courseName || 'None'}</span>
                  
                  <span style={{ fontWeight: '600', color: '#4a5568' }}>Requested Course:</span>
                  <span>{lockedCourse?.courseName}</span>
                </div>
              </div>
            )}
            
            <p style={{ 
              color: '#718096', 
              lineHeight: '1.6',
              fontSize: 'clamp(0.9rem, 2.5vw, 1rem)'
            }}>
              Click the button below to contact us on WhatsApp with your details pre-filled.
            </p>
            
            <div style={{ 
              display: 'flex', 
              justifyContent: 'flex-end', 
              gap: '1rem',
              marginTop: '1.5rem',
              flexWrap: 'wrap'
            }}>
              <button
                onClick={closePopup}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#e2e8f0',
                  color: '#4a5568',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  transition: 'all 0.2s ease',
                  ':hover': {
                    backgroundColor: '#cbd5e0',
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleWhatsAppClick}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#25D366',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.2s ease',
                  ':hover': {
                    backgroundColor: '#128C7E',
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                </svg>
                Contact via WhatsApp
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes fadeIn {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        
        @keyframes slideUp {
          0% { 
            opacity: 0;
            transform: translateY(20px);
          }
          100% { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes scaleIn {
          0% { 
            opacity: 0;
            transform: scale(0.9);
          }
          100% { 
            opacity: 1;
            transform: scale(1);
          }
        }
        
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
        
        @keyframes shimmer {
          0% { background-position: -100% 0; }
          100% { background-position: 200% 0; }
        }
        
        body {
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        }
        
        * {
          box-sizing: border-box;
        }
        
        /* Responsive media queries */
        @media (max-width: 768px) {
          .header {
            padding: 1rem;
          }
          
          .main {
            padding: 1rem;
          }
        }
        
        @media (max-width: 480px) {
          .header h1 {
            font-size: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
}