import React from 'react';
import { useSimpleNotifications } from '../hooks/use-simple-notifications';

interface MessageNotificationBadgeProps {
  senderId?: string;
  unreadCount?: number;
}

export default function MessageNotificationBadge({ senderId, unreadCount }: MessageNotificationBadgeProps) {
  const { notifications } = useSimpleNotifications();
  
  // If specific sender ID is provided, filter notifications for that sender
  const relevantNotifications = senderId 
    ? notifications.filter(n => n.sender_id === senderId)
    : notifications;
  
  // Use provided unread count or notification count
  const count = unreadCount !== undefined ? unreadCount : relevantNotifications.length;
  
  if (count === 0) return null;

  return (
    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
      {count > 9 ? '9+' : count}
    </span>
  );
}