import React, { useState, useEffect } from 'react';
import { CheckCircle, X } from 'lucide-react';

interface DepositNotificationProps {
  amount: string;
  onClose: () => void;
}

export default function DepositNotification({ amount, onClose }: DepositNotificationProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Auto-close after 5 seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Wait for animation to complete
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  return (
    <div
      className={`fixed top-4 right-4 z-50 transition-all duration-300 transform ${
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}
    >
      <div className="bg-green-900/90 backdrop-blur-sm border border-green-800 rounded-lg p-4 shadow-xl max-w-sm">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <CheckCircle className="w-6 h-6 text-green-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-green-100">
              Deposit Received!
            </p>
            <p className="text-sm text-green-200 mt-1">
              You have received <span className="font-semibold text-green-100">{amount} TTF</span> in your wallet
            </p>
          </div>
          <button
            onClick={handleClose}
            className="flex-shrink-0 text-green-300 hover:text-green-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
