import { FaHome } from 'react-icons/fa';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-[-1]"
      >
        <source src="https://res.cloudinary.com/dvn7gfqac/video/upload/v1747156594/straegy_ywp5vn.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Button with Icon */}
      <div className="fixed inset-0 flex items-center justify-center pt-70">
        <Link href="/home" passHref>
          <button
            className="flex items-center gap-2 px-6 py-3 bg-green-300 text-black rounded-full shadow-lg backdrop-blur-md hover:bg-green-200 hover:scale-105 transition-all duration-300 ease-in-out"
          >
            <FaHome className="text-purple-500 w-9 h-9" />
            <span className="font-semibold text-2xl">Go Home</span>
          </button>
        </Link>
      </div>
    </div>
  );
}