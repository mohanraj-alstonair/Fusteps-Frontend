import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useSimpleNotifications } from '../hooks/use-simple-notifications';
import MessageNotification from './MessageNotification';
import { useAuth } from '../hooks/use-auth';

interface NotificationData {
  id: number;
  sender_id: string;
  sender_name: string;
  sender_type: 'student' | 'mentor';
  content: string;
  timestamp: string;
  receiver_id: string;
}

export default function MessageNotificationContainer() {
  const { notifications, removeNotification } = useSimpleNotifications();
  const [localNotifications, setLocalNotifications] = useState<NotificationData[]>([]);
  const [, setLocation] = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    const handleTestNotification = (event: any) => {
      const notification = event.detail;
      console.log('Container received test notification:', notification);
      setLocalNotifications(prev => {
        const updated = [...prev, notification];
        console.log('Updated local notifications:', updated);
        return updated;
      });
    };

    window.addEventListener('test-notification', handleTestNotification);
    return () => window.removeEventListener('test-notification', handleTestNotification);
  }, []);

  const handleNotificationClick = (notification: any) => {
    if (user?.role === 'student') {
      setLocation(`/dashboard/student/mentors/${notification.sender_id}/chat`);
    } else if (user?.role === 'mentor') {
      setLocation(`/dashboard/mentor/students/${notification.sender_id}/chat`);
    }
    
    removeNotification(notification.id);
    setLocalNotifications(prev => prev.filter(n => n.id !== notification.id));
  };

  const removeLocalNotification = (id: number) => {
    setLocalNotifications(prev => prev.filter(n => n.id !== id));
    removeNotification(id);
  };

  const allNotifications = [...notifications, ...localNotifications];
  
  console.log('Rendering notifications:', {
    websocketNotifications: notifications.length,
    localNotifications: localNotifications.length,
    total: allNotifications.length,
    notifications: allNotifications
  });

  return (
    <div className="fixed top-4 right-4 z-[9999] space-y-2 w-80">
      {allNotifications.map((notification) => (
        <MessageNotification
          key={notification.id}
          message={notification}
          onClose={() => removeLocalNotification(notification.id)}
          onClick={() => handleNotificationClick(notification)}
        />
      ))}
    </div>
  );
}