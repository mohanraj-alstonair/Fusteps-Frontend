import React, { useState, useEffect } from 'react';

export default function WebSocketTest() {
  const [status, setStatus] = useState('Disconnected');
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    // Test notification WebSocket
    const ws = new WebSocket('ws://localhost:8000/ws/notifications/global/');
    
    ws.onopen = () => {
      setStatus('✅ Connected');
      setMessages(prev => [...prev, 'WebSocket connected']);
    };
    
    ws.onmessage = (event) => {
      setMessages(prev => [...prev, `Received: ${event.data}`]);
    };
    
    ws.onerror = (error) => {
      setStatus('❌ Error');
      setMessages(prev => [...prev, `Error: ${error}`]);
    };
    
    ws.onclose = () => {
      setStatus('🔴 Disconnected');
      setMessages(prev => [...prev, 'WebSocket disconnected']);
    };

    return () => ws.close();
  }, []);

  return (
    <div className="fixed top-20 right-4 z-[9999] bg-white border p-4 rounded shadow-lg w-80">
      <h3 className="font-bold">WebSocket Test</h3>
      <p>Status: {status}</p>
      <div className="mt-2 max-h-40 overflow-y-auto text-xs">
        {messages.map((msg, i) => (
          <div key={i}>{msg}</div>
        ))}
      </div>
    </div>
  );
}