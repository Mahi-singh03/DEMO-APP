// FeeStatusMonitor.jsx
import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { UserContext } from './userContext';

const FeeStatusMonitor = ({ onAccessGranted }) => {
  const { user, isAuthenticated, isAdmin, checkFeeStatus } = useContext(UserContext);
  const router = useRouter();
  const [showPopup, setShowPopup] = useState(false);
  const [popupType, setPopupType] = useState(null);
  const [popupData, setPopupData] = useState({});
  const [isChecking, setIsChecking] = useState(true);

  // Check fee status and course completion
  useEffect(() => {
    if (!isAuthenticated || isAdmin) {
      setIsChecking(false);
      if (onAccessGranted) onAccessGranted(true);
      return;
    }

    if (!user) {
      setIsChecking(false);
      return;
    }

    const feeStatus = checkFeeStatus();
    
    if (feeStatus) {
      setPopupType(feeStatus.type);
      setPopupData(feeStatus.data);
      setShowPopup(true);
      
      // Only block access for specific critical issues
      if (feeStatus.type === 'courseCompleted' || feeStatus.type === 'overdueInstallment' || feeStatus.type === 'noFeeSetup') {
        if (onAccessGranted) onAccessGranted(false);
      } else {
        // Allow access for other issues like upcoming installments
        if (onAccessGranted) onAccessGranted(true);
      }
    } else {
      // All good, grant access
      if (onAccessGranted) onAccessGranted(true);
    }
    
    setIsChecking(false);
  }, [user, isAuthenticated, isAdmin, checkFeeStatus, onAccessGranted]);

  const handlePopupAction = () => {
    switch (popupType) {
      case 'overdueInstallment':
        // Redirect to payment page
        router.push('/payment');
        break;
      case 'upcomingInstallment':
        // Redirect to payment page
        router.push('/payment');
        break;
      case 'noFeeSetup':
        // Redirect to contact page or show message
        router.push('/home');
        break;
      case 'courseCompleted':
        // For course completed, just close the popup but NEVER grant access
        setShowPopup(false);
        // DO NOT call onAccessGranted(true) for completed courses
        break;
      default:
        setShowPopup(false);
    }
  };

  const handleRemindLater = () => {
    setShowPopup(false);
    // Only grant access for non-blocking issues (like upcoming installments)
    if (popupType !== 'courseCompleted' && popupType !== 'noFeeSetup' && popupType !== 'overdueInstallment') {
      if (onAccessGranted) onAccessGranted(true);
    }
  };

  const getPopupContent = () => {
    switch (popupType) {
      case 'overdueInstallment':
        const dueDate = new Date(popupData.installment.submissionDate).toLocaleDateString();
        const daysOverdue = Math.ceil((new Date() - new Date(popupData.installment.submissionDate)) / (1000 * 60 * 60 * 24));
        return {
          title: 'Payment Overdue',
          message: `Your installment of ₹${popupData.installment.amount} was due on ${dueDate} (${daysOverdue} days ago). Please pay it now to avoid any issues.`,
          buttonText: 'Pay Now',
          icon: '⚠️',
          color: 'red'
        };
      case 'upcomingInstallment':
        const upcomingDueDate = new Date(popupData.installment.submissionDate).toLocaleDateString();
        return {
          title: 'Upcoming Payment',
          message: `Your next installment of ₹${popupData.installment.amount} is due on ${upcomingDueDate} (in ${popupData.daysUntilDue} days). You can pay it now to stay ahead.`,
          buttonText: 'Pay Now',
          icon: '📅',
          color: 'blue'
        };
      case 'noFeeSetup':
        return {
          title: 'Fee Setup Required',
          message: 'Your fee structure has not been set up yet. Please contact the fees manager to set up your payment plan before accessing exams.',
          buttonText: 'Go Home',
          icon: '📋',
          color: 'orange'
        };
      case 'courseCompleted':
        return {
          title: 'Course Completed',
          message: `Congratulations! You have successfully completed your ${popupData.courseName} course on ${new Date(popupData.farewellDate).toLocaleDateString()}. You can still access your exam history.`,
          buttonText: 'OK',
          icon: '🎓',
          color: 'green'
        };
      default:
        return {
          title: 'Notification',
          message: 'You have a notification.',
          buttonText: 'OK',
          icon: 'ℹ️',
          color: 'blue'
        };
    }
  };

  if (isChecking) {
    return (
      <div className="fixed inset-0 bg-blur bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <span className="ml-3 text-gray-600">Checking fee status...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!showPopup) return null;

  const content = getPopupContent();
  const getColorClasses = (color) => {
    switch (color) {
      case 'red':
        return 'border-red-200 bg-red-50';
      case 'blue':
        return 'border-blue-200 bg-blue-50';
      case 'orange':
        return 'border-orange-200 bg-orange-50';
      case 'green':
        return 'border-green-200 bg-green-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  const getButtonClasses = (color) => {
    switch (color) {
      case 'red':
        return 'bg-red-600 hover:bg-red-700 text-white';
      case 'blue':
        return 'bg-blue-600 hover:bg-blue-700 text-white';
      case 'orange':
        return 'bg-orange-600 hover:bg-orange-700 text-white';
      case 'green':
        return 'bg-green-600 hover:bg-green-700 text-white';
      default:
        return 'bg-gray-600 hover:bg-gray-700 text-white';
    }
  };

  return (
    <div className="fixed inset-0 bg-blur bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className={`bg-white rounded-xl shadow-2xl max-w-md w-full border-2 ${getColorClasses(content.color)}`}>
        <div className="p-6">
          <div className="flex items-center mb-4">
            <span className="text-3xl mr-3">{content.icon}</span>
            <h2 className="text-xl font-bold text-gray-800">{content.title}</h2>
          </div>
          
          <p className="text-gray-600 mb-6 leading-relaxed">
            {content.message}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handlePopupAction}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors duration-200 ${getButtonClasses(content.color)}`}
            >
              {content.buttonText}
            </button>
            
            {popupType !== 'courseCompleted' && popupType !== 'noFeeSetup' && popupType !== 'overdueInstallment' && (
              <button
                onClick={handleRemindLater}
                className="px-6 py-3 rounded-lg font-semibold bg-gray-200 hover:bg-gray-300 text-gray-700 transition-colors duration-200"
              >
                Remind Me Later
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeeStatusMonitor;