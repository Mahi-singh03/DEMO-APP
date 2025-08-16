"use client";

import { useState, useEffect, useContext } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { UserContext } from "../../../components/UserContext.js";
import { WE_1 } from "../question-paper/WE_1.jsx";
import { WE_2 } from "../question-paper/WE_2.jsx";
import { WE_3 } from "../question-paper/WE_3.jsx";
import { WE_4 } from "../question-paper/WE_4.jsx";
import { WE_5 } from "../question-paper/WE_5.jsx";
import { WE_6 } from "../question-paper/WE_6.jsx";
import { WE_7 } from "../question-paper/WE_7.jsx";
import { WE_8 } from "../question-paper/WE_8.jsx";
import { WE_9 } from "../question-paper/WE_9.jsx";
import { WE_10 } from "../question-paper/WE_10.jsx";
import { WE_11 } from "../question-paper/WE_11.jsx";
import { WE_12 } from "../question-paper/WE_12.jsx";
import { WE_13 } from "../question-paper/WE_13.jsx";
import { WE_14 } from "../question-paper/WE_14.jsx";
import { WE_15 } from "../question-paper/WE_15.jsx";
import { WE_16 } from "../question-paper/WE_16.jsx";
import { WE_17 } from "../question-paper/WE_17.jsx";
import { WE_18 } from "../question-paper/WE_18.jsx";
import { WE_19 } from "../question-paper/WE_19.jsx";

export default function WeeklyExam() {
  const { examId } = useParams();
  const { isAuthenticated, loading } =useContext(UserContext);
  const router = useRouter();

  const [state, setState] = useState({
    answers: {},
    score: null,
    timeLeft: 45 * 60,
    isSubmitted: false,
    error: "",
  });

  const questionsMap = {
    WE_1, WE_2, WE_3, WE_4, WE_5, WE_6, WE_7, WE_8,
    WE_9, WE_10, WE_11, WE_12, WE_13, WE_14,WE_15,WE_16,WE_17,WE_18,WE_19
  };

  // Ensure exactly 30 questions
  const questions = questionsMap[examId]?.slice(0, 30) || [];

  const handleSubmit = () => {
    if (Object.keys(state.answers).length < questions.length) {
      setState((prev) => ({ 
        ...prev, 
        error: "Please answer all questions before submitting." 
      }));
      return;
    }

    const totalScore = questions.reduce(
      (acc, q, index) => (state.answers[index] === q.answer ? acc + 2 : acc),
      0
    );

    setState((prev) => ({
      ...prev,
      score: totalScore,
      isSubmitted: true,
    }));
  };

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, loading, router]);

  // Scroll to top after submission
  useEffect(() => {
    if (state.isSubmitted) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [state.isSubmitted]);

  // Timer effect
  useEffect(() => {
    if (!questions.length) return;
    
    if (state.timeLeft > 0 && !state.isSubmitted) {
      const timer = setInterval(() => {
        setState((prev) => ({
          ...prev,
          timeLeft: prev.timeLeft - 1,
        }));
      }, 1000);

      return () => clearInterval(timer);
    } else if (state.timeLeft === 0 && !state.isSubmitted) {
      handleSubmit();
    }
  }, [state.timeLeft, state.isSubmitted, questions.length, handleSubmit]);

  const handleChange = (qIndex, option) => {
    setState((prev) => ({
      ...prev,
      answers: { ...prev.answers, [qIndex]: option },
      error: "",
    }));
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };

  const progress = Math.round((Object.keys(state.answers).length / questions.length) * 100);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!questions.length) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Invalid Exam ID</h1>
          <p className="text-gray-700 mb-6">The exam you&apos;re trying to access doesn&apos;t exist.</p>
          <Link href="/exams" className="inline-block px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200">
            Back to Exam List
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gray-50 font-sans">
      {/* Fixed Header with Timer */}
      <div className="sticky top-0 z-10 bg-white shadow-md py-4 px-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-600">Weekly Exam: {examId}</h1>
        <div className="flex items-center space-x-4">
          <div className="text-xl font-bold bg-yellow-200 px-4 py-2 rounded-lg shadow-sm">
            ⏳ {formatTime(state.timeLeft)}
          </div>
          <div className="hidden md:block bg-blue-100 px-4 py-2 rounded-lg">
            Progress: {Object.keys(state.answers).length}/{questions.length}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Result Box */}
        {state.score !== null && (
          <div className="mb-8 p-6 bg-green-50 border border-green-200 rounded-lg text-center">
            <h2 className="text-6xl font-bold text-green-800 mb-2">Exam Results</h2>
            <div className="flex justify-center space-x-8">
              <div className="text-4xl">
                <span className="font-semibold text-blue-600">Score:</span> {state.score}/{questions.length * 2}
              </div>
              <div className="text-4xl">
                <span className="font-semibold text-blue-600">Percentage:</span> {Math.round((state.score / (questions.length * 2)) * 100)}%
              </div>
            </div>
          </div>
        )}

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">
              {progress}% Complete ({Object.keys(state.answers).length}/{questions.length} questions)
            </span>
            <span className="text-sm font-medium text-blue-600">
              {state.isSubmitted ? "Submitted" : "In Progress"}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Error Message */}
        {state.error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{state.error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Questions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {questions.map((q, index) => {
            const isCorrect = state.isSubmitted && state.answers[index] === q.answer;
            const isWrong = state.isSubmitted && state.answers[index] && state.answers[index] !== q.answer;

            return (
              <div 
                key={index}
                className={`bg-white border rounded-lg p-6 shadow-sm transition-all duration-200 hover:shadow-md ${
                  isCorrect ? 'border-green-300 bg-green-50' : 
                  isWrong ? 'border-red-300 bg-red-50' : 'border-gray-200'
                }`}
              >
                <p className="text-lg font-semibold mb-4 text-gray-800">
                  <span className="text-blue-600">Q{index + 1}:</span> {q.question}
                </p>
                <div className="space-y-3">
                  {q.options.map((option, i) => {
                    const isSelected = state.answers[index] === option;
                    const showCorrect = state.isSubmitted && option === q.answer;
                    const showWrong = state.isSubmitted && isSelected && !showCorrect;

                    return (
                      <label 
                        key={i}
                        className={`flex items-start p-3 border rounded-md cursor-pointer transition-colors duration-200 ${
                          showCorrect ? 'border-green-400 bg-green-100' :
                          showWrong ? 'border-red-400 bg-red-100' :
                          isSelected ? 'border-blue-400 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <input
                          type="radio"
                          name={`question-${index}`}
                          value={option}
                          onChange={() => handleChange(index, option)}
                          checked={isSelected}
                          disabled={state.isSubmitted}
                          className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-3 text-gray-700">{option}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Submit Button */}
        <div className="flex justify-center mb-8">
          <button
            onClick={handleSubmit}
            disabled={state.isSubmitted}
            className={`px-8 py-3 rounded-lg font-semibold text-white shadow-md transition-colors duration-200 ${
              state.isSubmitted 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {state.isSubmitted ? "Exam Submitted" : "Submit Answers"}
          </button>
        </div>

        {/* Back Link */}
        <div className="text-center">
          <Link 
            href="/weekly-exam" 
            className="inline-flex items-center px-5 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
          >
            <svg className="-ml-1 mr-2 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Exam List
          </Link>
        </div>
      </div>
    </div>
  );
}