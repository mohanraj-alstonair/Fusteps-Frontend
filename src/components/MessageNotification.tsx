import React, { useState, useEffect } from 'react';
import { X, MessageCircle } from 'lucide-react';

interface MessageNotificationProps {
  message: {
    id: number;
    sender_name: string;
    content: string;
    timestamp: string;
    sender_type: 'student' | 'mentor';
  };
  onClose: () => void;
  onClick: () => void;
}

export default function MessageNotification({ message, onClose, onClick }: MessageNotificationProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Wait for animation to complete
    }, 5000); // Auto-hide after 5 seconds

    return () => clearTimeout(timer);
  }, [onClose]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  return (
    <div
      className={`relative bg-white rounded-lg shadow-lg border border-gray-200 p-4 max-w-sm cursor-pointer transform transition-all duration-300 ${
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}
      onClick={onClick}
    >
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
            <MessageCircle className="w-5 h-5 text-white" />
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-gray-900 truncate">
              {message.sender_name}
            </p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleClose();
              }}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          
          <p className="text-sm text-gray-600 truncate mt-1">
            {message.content}
          </p>
          
          <p className="text-xs text-gray-400 mt-1">
            {new Date(message.timestamp).toLocaleTimeString()}
          </p>
        </div>
      </div>
      
      {/* WhatsApp-style green accent */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-green-500 rounded-l-lg"></div>
    </div>
  );
}