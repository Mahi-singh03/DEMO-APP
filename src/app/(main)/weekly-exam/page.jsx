"use client";

import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { UserContext } from "../../components/UserContext.js";
import { time } from "framer-motion";

const exams = [
  { id: "WE_19", title: "Weekly Exam 19 (02-08-2025) - Word + Tally + Excel + Basic ",path:"/weekly-exam/WE_19"},
  { id: "WE_18", title: "Weekly Exam 18 (02-08-2025) - Word + Basic ",path:"/weekly-exam/WE_18"},
  { id: "WE_17", title: "Weekly Exam 17 (19-07-2025) - Word + Tally + Excel + Basic ",path:"/weekly-exam/WE_17"},
  { id: "WE_16", title: "Weekly Exam 16 (19-07-2025) - Word + Basic ",path:"/weekly-exam/WE_16"},
  { id: "WE_15", title: "Weekly Exam 15 (12-07-2025) - Word + Tally + Excel + Basic ",path:"/weekly-exam/WE_15"},
  { id: "WE_14", title: "Weekly Exam 14 (16-05-2025) - Tally + Excel", path: "/weekly-exam/WE_14" },
  { id: "WE_13", title: "Weekly Exam 13 (16-05-2025) - Word + Basic", path: "/weekly-exam/WE_13" },
  { id: "WE_12", title: "Weekly Exam 12 (16-05-2025) - Word + Excel + Basic", path: "/weekly-exam/WE_12" },
  { id: "WE_11", title: "Weekly Exam 11 (10-05-2025)", path: "/weekly-exam/WE_11" },
  { id: "WE_10", title: "Weekly Exam 10 (02-05-2025)", path: "/weekly-exam/WE_10" },
  { id: "WE_9", title: "Weekly Exam 09 (02-05-2025)", path: "/weekly-exam/WE_9" },
  { id: "WE_8", title: "Weekly Exam 08 (19-04-2025)", path: "/weekly-exam/WE_8" },
  { id: "WE_7", title: "Weekly Exam 07 (05-03-2025)", path: "/weekly-exam/WE_7" },
  { id: "WE_6", title: "Weekly Exam 06 (29-03-2025)", path: "/weekly-exam/WE_6" },
  { id: "WE_5", title: "Weekly Exam 05 (22-03-2025)", path: "/weekly-exam/WE_5" },
  { id: "WE_4", title: "Weekly Exam 04 (15-03-2025)", path: "/weekly-exam/WE_4" },
  { id: "WE_3", title: "Weekly Exam 03 (08-03-2025)", path: "/weekly-exam/WE_3" },
  { id: "WE_2", title: "Weekly Exam 02 (01-03-2025)", path: "/weekly-exam/WE_2" },
  { id: "WE_1", title: "Weekly Exam 01 (22-02-2025)", path: "/weekly-exam/WE_1" },
];

export default function ExamList() {
  const { isAuthenticated, loading } = useContext(UserContext);
  const router = useRouter();
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/student-login");
        return;
      }

      try {
        const res = await fetch("/api/auth/verify", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

        if (res.ok) {
          setVerified(true);
        } else {
          const data = await res.json();
          console.warn("Verification failed:", data?.message);
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          router.push("/student-login");
        }
      } catch (error) {
        console.error("Error verifying token:", error);
        router.push("/student-login");
      }
    };

    if (!loading && isAuthenticated) {
      checkToken();
    } else if (!loading && !isAuthenticated) {
      router.push("/student-login");
    }
  }, [loading, isAuthenticated, router]);

  if (loading || !verified) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#e3f1f1] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-blue-600 mb-2">
            Available Weekly Exams
          </h1>
        </div>

        <div className="space-y-4">
          {exams.map((exam) => (
            <Link
              key={exam.id}
              href={exam.path}
              className="block group transition-transform duration-200 hover:scale-[1.02]"
            >
              <div className="bg-white p-5 rounded-lg shadow-md border-l-4 border-blue-500 hover:border-blue-600 transition-colors duration-200 group-hover:shadow-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-1">
                  {exam.title}
                </h3>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Exam Number: {exam.id}</span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Start Exam
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>These tests help you to improve the knowledge of Computer</p>
        </div>
      </div>
    </div>
  );
}
