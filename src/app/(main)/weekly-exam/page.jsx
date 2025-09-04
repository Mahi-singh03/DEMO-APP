"use client";

import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { UserContext } from "@/app/components/userContext";
import FeeStatusMonitor from "@/app/components/FeeStatusMonitor";


const exams = [
  { id: "WE_19", title: "Weekly Exam 19 ",path:"/weekly-exam/WE_19"},
  { id: "WE_18", title: "Weekly Exam 18 ",path:"/weekly-exam/WE_18"},
  { id: "WE_17", title: "Weekly Exam 17 ",path:"/weekly-exam/WE_17"},
  { id: "WE_16", title: "Weekly Exam 16 ",path:"/weekly-exam/WE_16"},
  { id: "WE_15", title: "Weekly Exam 15 ",path:"/weekly-exam/WE_15"},
  { id: "WE_14", title: "Weekly Exam 14 ",path: "/weekly-exam/WE_14" },
  { id: "WE_13", title: "Weekly Exam 13 ",path: "/weekly-exam/WE_13" },
  { id: "WE_12", title: "Weekly Exam 12 ",path: "/weekly-exam/WE_12" },
  { id: "WE_11", title: "Weekly Exam 11 ",path: "/weekly-exam/WE_11" },
  { id: "WE_10", title: "Weekly Exam 10 ",path: "/weekly-exam/WE_10" },
  { id: "WE_9", title: "Weekly Exam 09 ", path: "/weekly-exam/WE_9" },
  { id: "WE_8", title: "Weekly Exam 08 ", path: "/weekly-exam/WE_8" },
  { id: "WE_7", title: "Weekly Exam 07 ", path: "/weekly-exam/WE_7" },
  { id: "WE_6", title: "Weekly Exam 06 ", path: "/weekly-exam/WE_6" },
  { id: "WE_5", title: "Weekly Exam 05 ", path: "/weekly-exam/WE_5" },
  { id: "WE_4", title: "Weekly Exam 04 ", path: "/weekly-exam/WE_4" },
  { id: "WE_3", title: "Weekly Exam 03 ", path: "/weekly-exam/WE_3" },
  { id: "WE_2", title: "Weekly Exam 02 ", path: "/weekly-exam/WE_2" },
  { id: "WE_1", title: "Weekly Exam 01 ", path: "/weekly-exam/WE_1" },
];

export default function ExamList() {
  const { isAuthenticated, loading, isAdmin, user, checkFeeStatus } = useContext(UserContext);
  const router = useRouter();
  const [verified, setVerified] = useState(false);
  const [accessGranted, setAccessGranted] = useState(false);

  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/login");
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
          router.push("/login");
        }
      } catch (error) {
        console.error("Error verifying token:", error);
        router.push("/login");
      }
    };

    if (!loading && isAuthenticated) {
      checkToken();
    } else if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [loading, isAuthenticated, router]);

  const handleAccessGranted = (granted) => {
    setAccessGranted(granted);
  };

  // Additional safety check for completed courses
  useEffect(() => {
    if (user && !isAdmin && checkFeeStatus) {
      const feeStatus = checkFeeStatus();
      // If course is completed, always block access regardless of other conditions
      if (feeStatus && feeStatus.type === 'courseCompleted') {
        setAccessGranted(false);
      } else if (feeStatus && (feeStatus.type === 'overdueInstallment' || feeStatus.type === 'noFeeSetup')) {
        // Block access for overdue payments or missing fee setup
        setAccessGranted(false);
      } else {
        // Allow access for other cases (including upcoming installments)
        setAccessGranted(true);
      }
    } else if (isAdmin) {
      // Always allow admin access
      setAccessGranted(true);
    }
  }, [user, isAdmin, checkFeeStatus]);

  if (loading || !verified) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <>
      {/* Fee Status Monitor - shows popups for fee issues */}
      {!isAdmin && (
        <FeeStatusMonitor onAccessGranted={handleAccessGranted} />
      )}

      <div className="min-h-screen bg-[#ddedf1] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
           
            {!isAdmin && !accessGranted && (
              <p className="text-sm text-orange-600 mt-2">
                Please resolve any fee-related issues to access exams
              </p>
            )}
          </div>

          {/* Show exams only if admin or access is granted */}
          {(isAdmin || accessGranted) ? (
            <div className="space-y-4">
               <h1 className="text-3xl sm:text-4xl text-center pb-10 font-bold text-blue-600 mb-2">
              Available Weekly Exams
               </h1>
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
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔒</div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Access Restricted</h2>
              {user && checkFeeStatus && (() => {
                const feeStatus = checkFeeStatus();
                if (feeStatus && feeStatus.type === 'courseCompleted') {
                  return (
                    <>
                      <p className="text-gray-600 mb-4">
                        Your course has been completed. You can no longer access weekly exams.
                      </p>
                      <div className="space-y-2">
                        <p className="text-sm text-gray-500">• Course: {feeStatus.data.courseName}</p>
                        <p className="text-sm text-gray-500">• Completed on: {new Date(feeStatus.data.farewellDate).toLocaleDateString()}</p>
                        <p className="text-sm text-gray-500">• Contact support for certificate or records</p>
                      </div>
                    </>
                  );
                } else {
                  return (
                    <>
                      <p className="text-gray-600 mb-4">
                        Please resolve any fee-related issues to access the weekly exams.
                      </p>
                      <div className="space-y-2">
                        <p className="text-sm text-gray-500">• Check for overdue payments</p>
                        <p className="text-sm text-gray-500">• Ensure fee structure is set up</p>
                        <p className="text-sm text-gray-500">• Contact support if needed</p>
                      </div>
                    </>
                  );
                }
              })()}
            </div>
          )}

          <div className="mt-8 text-center text-sm text-gray-500">
            <p>These tests help you to improve the knowledge of Computer</p>
          </div>
        </div>
      </div>
    </>
  );
}
