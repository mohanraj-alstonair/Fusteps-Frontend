import { useState, useEffect } from 'react';
import { getUserProfile } from '@/lib/api';

export default function ProfileDebug() {
  const [debugInfo, setDebugInfo] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const testProfile = async () => {
      try {
        // Get user ID from localStorage
        const userId = localStorage.getItem('userId') || 
                       localStorage.getItem('studentId') || 
                       localStorage.getItem('mentorId') ||
                       localStorage.getItem('user_id');

        console.log('Debug - userId:', userId);
        console.log('Debug - localStorage keys:', Object.keys(localStorage));
        
        if (!userId) {
          setDebugInfo({ error: 'No user ID found in localStorage' });
          setLoading(false);
          return;
        }

        // Test API call
        const response = await getUserProfile(parseInt(userId));
        console.log('Debug - API response:', response);
        
        setDebugInfo({
          userId,
          response: response.data,
          status: 'success'
        });
      } catch (error) {
        console.error('Debug - API error:', error);
        setDebugInfo({
          error: error.message,
          status: 'error'
        });
      } finally {
        setLoading(false);
      }
    };

    testProfile();
  }, []);

  if (loading) {
    return <div>Loading debug info...</div>;
  }

  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      <h3 className="font-bold mb-2">Profile Debug Info</h3>
      <pre className="text-xs overflow-auto">
        {JSON.stringify(debugInfo, null, 2)}
      </pre>
    </div>
  );
}