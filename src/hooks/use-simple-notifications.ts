import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './use-auth';

interface SimpleNotification {
  id: number;
  sender_id: string;
  sender_name: string;
  sender_type: 'student' | 'mentor';
  content: string;
  timestamp: string;
}

export function useSimpleNotifications() {
  const [notifications, setNotifications] = useState<SimpleNotification[]>([]);
  const { user } = useAuth();

  const addNotification = useCallback((notification: SimpleNotification) => {
    setNotifications(prev => [...prev, notification]);
    
    // Play sound
    try {
      const beep = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT');
      beep.volume = 0.3;
      beep.play().catch(() => {});
    } catch (error) {}
  }, []);

  const removeNotification = useCallback((id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  // Listen for test notifications
  useEffect(() => {
    const handleTestNotification = (event: any) => {
      const notification = event.detail;
      addNotification(notification);
    };

    window.addEventListener('test-notification', handleTestNotification);
    return () => window.removeEventListener('test-notification', handleTestNotification);
  }, [addNotification]);

  // Expose global function for message notifications
  useEffect(() => {
    (window as any).showMessageNotification = (senderName: string, senderId: string, senderType: 'student' | 'mentor' = 'student') => {
      if (user && user.id && senderId !== user.id.toString()) {
        const notification: SimpleNotification = {
          id: Date.now() + Math.random(),
          sender_id: senderId,
          sender_name: senderName,
          sender_type: senderType,
          content: `You have a new message from ${senderName}`,
          timestamp: new Date().toISOString()
        };
        addNotification(notification);
      }
    };

    return () => {
      delete (window as any).showMessageNotification;
    };
  }, [user, addNotification]);

  return {
    notifications,
    removeNotification,
    hasNotifications: notifications.length > 0
  };
}