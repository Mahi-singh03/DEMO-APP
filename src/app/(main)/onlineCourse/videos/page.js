'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode'; 

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const token = localStorage.getItem('onlineCourseUserToken');

    if (!token) {
      router.push('/onlineCourse/login');
      return;
    }

    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      if (decoded.exp < currentTime) {
        localStorage.removeItem('onlineCourseUserToken');
        router.push('/onlineCourse/login');
        localStorage.removeItem('onlineCourseUser');
        return;
      }
      setLoading(false);
    } catch (error) {
      console.error('Invalid onlineCourseUserToken:', error);
      localStorage.removeItem('onlineCourseUserToken');
      localStorage.removeItem('onlineCourseUser');
      router.push('/onlineCourse/login');
    }
  }, [router]);

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><h2>Loading...</h2></div>;
  }
  return <h1>videos</h1>;
}