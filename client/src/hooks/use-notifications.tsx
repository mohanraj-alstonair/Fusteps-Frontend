import { useState, useEffect } from 'react';
import { useAuth } from './use-auth';
import { listMessages, getStudentSessions, listMentorRequests, getMentorBookingRequests } from '../lib/api';

interface NotificationItem {
  id: string;
  type: 'message' | 'session' | 'booking' | 'connection';
  title: string;
  description: string;
  unread?: boolean;
  count?: number; // For message count display
}

export function useNotifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Get read notifications from localStorage
  const getReadNotifications = (): string[] => {
    const stored = localStorage.getItem('readNotifications');
    return stored ? JSON.parse(stored) : [];
  };

  // Save read notifications to localStorage
  const saveReadNotifications = (readIds: string[]) => {
    localStorage.setItem('readNotifications', JSON.stringify(readIds));
  };

  useEffect(() => {
    if (!user) return;

    const fetchNotifications = async () => {
      try {
        let items: NotificationItem[] = [];
        let count = 0;

        const userId = user.role === 'student'
          ? parseInt(localStorage.getItem('studentId') || '0')
          : parseInt(localStorage.getItem('mentorId') || '0');

        const readNotifications = getReadNotifications();

        if (user.role === 'student') {
          // Fetch unseen messages - assuming we have an endpoint or filter
          // For now, mock unseen messages
          const messages = await listMessages(userId, 0); // Adjust as needed
          const unseenMessages = messages.data.filter((msg: any) => !msg.is_read); // Assume is_read field

          if (unseenMessages.length > 0) {
            const msgId = `messages`;
            if (!readNotifications.includes(msgId)) {
              items.push({
                id: msgId,
                type: 'message',
                title: `${unseenMessages.length} New Message${unseenMessages.length > 1 ? 's' : ''}`,
                description: unseenMessages.length === 1
                  ? unseenMessages[0].content.substring(0, 50) + '...'
                  : `${unseenMessages.length} unread messages`,
                unread: true,
                count: unseenMessages.length
              });
              count += 1;
            }
          }

          // Fetch upcoming sessions
          const sessions = await getStudentSessions(userId);
          sessions.data.forEach((session: any) => {
            const sessionId = `session${session.id}`;
            if (!readNotifications.includes(sessionId)) {
              items.push({
                id: sessionId,
                type: 'session',
                title: 'Scheduled Session',
                description: `Session on ${session.date}`,
                unread: true
              });
              count += 1;
            }
          });

        } else if (user.role === 'mentor') {
          // Fetch unseen messages for mentors
          const messages = await listMessages(userId, 0); // Adjust as needed
          const unseenMessages = messages.data.filter((msg: any) => !msg.is_read); // Assume is_read field

          if (unseenMessages.length > 0) {
            const msgId = `messages`;
            if (!readNotifications.includes(msgId)) {
              items.push({
                id: msgId,
                type: 'message',
                title: `${unseenMessages.length} New Message${unseenMessages.length > 1 ? 's' : ''}`,
                description: unseenMessages.length === 1
                  ? unseenMessages[0].content.substring(0, 50) + '...'
                  : `${unseenMessages.length} unread messages`,
                unread: true,
                count: unseenMessages.length
              });
              count += 1;
            }
          }

          // Fetch booking requests
          const bookings = await getMentorBookingRequests(userId);
          bookings.data.forEach((booking: any) => {
            const bookingId = `booking${booking.id}`;
            if (!readNotifications.includes(bookingId)) {
              items.push({
                id: bookingId,
                type: 'booking',
                title: 'Booking Request',
                description: `From ${booking.student_name} for ${booking.topic}`,
                unread: true
              });
              count += 1;
            }
          });

          // Fetch connection requests
          const connections = await listMentorRequests(userId);
          connections.data.forEach((conn: any) => {
            const connId = `conn${conn.id}`;
            if (!readNotifications.includes(connId)) {
              items.push({
                id: connId,
                type: 'connection',
                title: 'Connection Request',
                description: `From ${conn.student_name}`,
                unread: true
              });
              count += 1;
            }
          });
        }

        setNotifications(items);
        setUnreadCount(count);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    // Initial fetch
    fetchNotifications();

    // Set up polling every 30 seconds to check for new notifications
    const interval = setInterval(fetchNotifications, 30000);

    return () => clearInterval(interval);
  }, [user]);

  const markAsRead = () => {
    const currentRead = getReadNotifications();
    const newReadIds = notifications.map(n => n.id);
    const allReadIds = [...new Set([...currentRead, ...newReadIds])];
    saveReadNotifications(allReadIds);

    setNotifications(prev => prev.map(notification => ({ ...notification, unread: false })));
    setUnreadCount(0);
  };

  return { notifications, unreadCount, markAsRead };
}
