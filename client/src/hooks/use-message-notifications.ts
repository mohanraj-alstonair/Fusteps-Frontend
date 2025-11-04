import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './use-auth';

interface MessageNotification {
  id: number;
  sender_id: string;
  sender_name: string;
  sender_type: 'student' | 'mentor';
  content: string;
  timestamp: string;
  receiver_id: string;
}

export function useMessageNotifications() {
  const [notifications, setNotifications] = useState<MessageNotification[]>([]);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const { user } = useAuth();

  const removeNotification = useCallback((id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const addNotification = useCallback((notification: MessageNotification) => {
    setNotifications(prev => [...prev, notification]);
    
    // Play notification sound
    try {
      const audio = new Audio('/notification-sound.mp3');
      audio.volume = 0.3;
      audio.play().catch(() => {
        // Fallback to system beep
        const beep = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT');
        beep.volume = 0.3;
        beep.play().catch(() => {});
      });
    } catch (error) {
      console.log('Could not play notification sound');
    }
  }, []);

  useEffect(() => {
    if (!user?.id) return;

    // Connect to global notification WebSocket
    const ws = new WebSocket('ws://localhost:8000/ws/notifications/global/');
    
    ws.onopen = () => {
      console.log('Global notification WebSocket connected for user:', user.id);
      setSocket(ws);
    };

    ws.onerror = (error) => {
      console.error('Notification WebSocket error:', error);
    };

    ws.onmessage = (event) => {
      console.log('Raw notification received:', event.data);
      try {
        const data = JSON.parse(event.data);
        console.log('Parsed notification data:', data);
        
        if (data.type === 'message_notification' && data.receiver_id === user.id.toString()) {
          const notification: MessageNotification = {
            id: Date.now() + Math.random(),
            sender_id: data.sender_id,
            sender_name: data.sender_name,
            sender_type: data.sender_type,
            content: `You have a new message from ${data.sender_name}`,
            timestamp: data.timestamp || new Date().toISOString(),
            receiver_id: data.receiver_id
          };

          console.log('Adding notification:', notification);
          addNotification(notification);
        }
      } catch (error) {
        console.error('Error parsing notification:', error);
      }
    };

    ws.onclose = () => {
      console.log('Notification WebSocket disconnected');
      setSocket(null);
    };

    // Listen for test notifications
    const handleTestNotification = (event: any) => {
      const notification = event.detail;
      console.log('Test notification received:', notification);
      addNotification(notification);
    };

    window.addEventListener('test-notification', handleTestNotification);

    return () => {
      ws.close();
      window.removeEventListener('test-notification', handleTestNotification);
    };
  }, [user?.id, addNotification]);

  return {
    notifications,
    removeNotification,
    clearAllNotifications,
    hasNotifications: notifications.length > 0
  };
}