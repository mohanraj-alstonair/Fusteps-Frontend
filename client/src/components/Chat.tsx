import React, { useState, useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface Message {
  id: number;
  sender_type: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  timestamp: string;
  status: string;
}

interface ChatProps {
  currentUserId: string;
  currentUserType: 'student' | 'mentor';
  otherUserId: string;
  otherUserName: string;
}

export default function Chat({ currentUserId, currentUserType, otherUserId, otherUserName }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Load conversation history
    loadConversation();

    // Connect to WebSocket
    const ws = new WebSocket(`ws://localhost:8000/ws/chat/${currentUserId}/${otherUserId}/`);
    
    ws.onopen = () => {
      console.log('WebSocket connected');
      setSocket(ws);
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'message') {
        setMessages(prev => {
          const newMessages = [...prev, data.message];
          return newMessages.sort((a: Message, b: Message) =>
            new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
          );
        });
      }
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
      setSocket(null);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return () => {
      ws.close();
    };
  }, [currentUserId, otherUserId]);

  const loadConversation = async () => {
    try {
      const studentId = currentUserType === 'student' ? currentUserId : otherUserId;
      const mentorId = currentUserType === 'mentor' ? currentUserId : otherUserId;

      const response = await fetch(
        `http://localhost:8000/api/conversations/?student_id=${studentId}&mentor_id=${mentorId}`
      );
      const data = await response.json();
      if (data.messages) {
        const sortedMessages = data.messages.sort((a: Message, b: Message) =>
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );
        setMessages(sortedMessages);
      }
    } catch (error) {
      console.error('Error loading conversation:', error);
    }
  };

  const sendMessage = () => {
    if (!newMessage.trim() || !socket) return;

    const messageData = {
      content: newMessage,
      sender_type: currentUserType,
      sender_id: currentUserId,
      receiver_id: otherUserId
    };

    socket.send(JSON.stringify(messageData));
    setNewMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-96 border rounded-lg">
      <div className="bg-gray-100 p-3 border-b">
        <h3 className="font-semibold">Chat with {otherUserName}</h3>
      </div>
      
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender_id === currentUserId ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs px-3 py-2 rounded-lg ${
                message.sender_id === currentUserId
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-800'
              }`}
            >
              <p className="text-sm">{message.content}</p>
              <p className="text-xs opacity-70 mt-1">
                {new Date(message.timestamp).toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="border-t p-3 flex gap-2">
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type a message..."
          className="flex-1"
        />
        <Button onClick={sendMessage} disabled={!newMessage.trim()}>
          Send
        </Button>
      </div>
    </div>
  );
}