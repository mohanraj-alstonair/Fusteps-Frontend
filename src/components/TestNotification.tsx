
import { useSimpleNotifications } from '../hooks/use-simple-notifications';

export default function TestNotification() {
  const { notifications } = useSimpleNotifications();

  const createTestNotification = () => {
    console.log('🔔 CREATING TEST NOTIFICATION');
    const testNotification = {
      id: Date.now() + Math.random(),
      sender_id: '999',
      sender_name: 'Prakruthi Sharma',
      sender_type: 'mentor' as const,
      content: 'You have a new message from Prakruthi Sharma',
      timestamp: new Date().toISOString(),
      receiver_id: '1'
    };

    console.log('📤 DISPATCHING:', testNotification);
    window.dispatchEvent(new CustomEvent('test-notification', { detail: testNotification }));
    
    // Also try direct notification
    if ((window as any).showNotification) {
      (window as any).showNotification(testNotification);
    }
  };

  return (
    <div className="fixed bottom-4 left-4 z-[9999] bg-blue-500 text-white rounded-lg shadow-lg p-3">
      <button 
        onClick={createTestNotification}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-bold text-lg"
      >
        🔔 TEST MESSAGE ({notifications.length})
      </button>
    </div>
  );
}