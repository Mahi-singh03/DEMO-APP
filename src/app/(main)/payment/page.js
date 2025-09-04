"use client";

import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { UserContext } from "@/app/components/userContext";

export default function PaymentPage() {
  const { user, isAuthenticated, loading } = useContext(UserContext);
  const router = useRouter();
  const [installments, setInstallments] = useState([]);
  const [selectedInstallment, setSelectedInstallment] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
      return;
    }

    if (user && user.feeDetails && user.feeDetails.installmentDetails) {
      setInstallments(user.feeDetails.installmentDetails);
    }
  }, [user, isAuthenticated, loading, router]);

  const handleInstallmentSelect = (installment) => {
    setSelectedInstallment(installment);
    setPaymentAmount(installment.amount);
  };

  const handlePayment = async () => {
    if (!selectedInstallment || !paymentAmount) {
      setMessage("Please select an installment and enter payment amount");
      return;
    }

    setIsProcessing(true);
    setMessage("");

    try {
      const response = await fetch(`/api/students/${user._id}/fees/payments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          installmentId: selectedInstallment._id || selectedInstallment.id,
          amount: paymentAmount,
          method: paymentMethod,
          date: new Date().toISOString()
        })
      });

      if (response.ok) {
        setMessage("Payment recorded successfully!");
        // Refresh user data
        const updatedUser = await response.json();
        localStorage.setItem("user", JSON.stringify(updatedUser));
        // You might want to update the context here
        setTimeout(() => {
          router.push("/weekly-exam");
        }, 2000);
      } else {
        const error = await response.json();
        setMessage(error.message || "Payment failed. Please try again.");
      }
    } catch (error) {
      console.error("Payment error:", error);
      setMessage("Payment failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user || !user.feeDetails || !user.feeDetails.installmentDetails) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-6xl mb-4">📋</div>
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Fee Setup Required</h1>
            <p className="text-gray-600 mb-6">
              Your fee structure has not been set up yet. Please contact the fees manager to set up your payment plan.
            </p>
            <button
              onClick={() => router.push("/home")}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-200"
            >
              Go Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-400 mb-2">PENDING INSTALLMENST</h1>
          <p className="text-gray-600">Manage your course fee payments</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
          {/* Installments List */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Installments</h2>
            <div className="space-y-3">
              {installments.map((installment, index) => {
                const dueDate = new Date(installment.submissionDate);
                const isOverdue = new Date() > dueDate && !installment.paid;
                const isUpcoming = new Date() <= dueDate && !installment.paid;
                
                return (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                      selectedInstallment === installment
                        ? 'border-blue-500 bg-blue-50'
                        : isOverdue
                        ? 'border-red-200 bg-red-50 hover:border-red-300'
                        : isUpcoming
                        ? 'border-yellow-200 bg-yellow-50 hover:border-yellow-300'
                        : 'border-green-200 bg-green-50 hover:border-green-300'
                    }`}
                    onClick={() => handleInstallmentSelect(installment)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-gray-800">
                          Installment {index + 1}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Due: {dueDate.toLocaleDateString()}
                        </p>
                        <p className="text-lg font-bold text-gray-800">
                          ₹{installment.amount}
                        </p>
                      </div>
                      <div className="text-right">
                        {installment.paid ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            ✓ Paid
                          </span>
                        ) : isOverdue ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            Overdue
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            Pending
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        
        </div>

        {/* Fee Summary */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Fee Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600">Total Fees</p>
              <p className="text-2xl font-bold text-blue-600">₹{user.feeDetails.totalFees || 0}</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-gray-600">Paid Amount</p>
              <p className="text-2xl font-bold text-green-600">
                ₹{(user.feeDetails.totalFees || 0) - (user.feeDetails.remainingFees || 0)}
              </p>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <p className="text-sm text-gray-600">Remaining</p>
              <p className="text-2xl font-bold text-red-600">₹{user.feeDetails.remainingFees || 0}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
