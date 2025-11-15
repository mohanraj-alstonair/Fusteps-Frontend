import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { listMentorRequests } from '@/lib/api';

export default function DebugMentor() {
  const [mentorId, setMentorId] = useState('');
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check what's in localStorage
    const storedMentorId = localStorage.getItem('mentorId');
    const storedUserId = localStorage.getItem('userId');
    const storedUser = localStorage.getItem('user');
    
    console.log('localStorage mentorId:', storedMentorId);
    console.log('localStorage userId:', storedUserId);
    console.log('localStorage user:', storedUser);
    
    if (storedMentorId) {
      setMentorId(storedMentorId);
    } else if (storedUserId) {
      setMentorId(storedUserId);
    } else if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setMentorId(user.id || '5');
      } catch (e) {
        setMentorId('5');
      }
    } else {
      setMentorId('5');
    }
  }, []);

  const fetchRequests = async () => {
    if (!mentorId) return;
    
    setLoading(true);
    setError('');
    
    try {
      console.log('Fetching requests for mentor ID:', mentorId);
      const response = await listMentorRequests(parseInt(mentorId));
      console.log('Response:', response.data);
      setRequests(response.data);
    } catch (err: any) {
      console.error('Error:', err);
      setError(err.message || 'Failed to fetch requests');
    } finally {
      setLoading(false);
    }
  };

  const setMentorIdInStorage = () => {
    localStorage.setItem('mentorId', mentorId);
    localStorage.setItem('userId', mentorId);
    alert(`Set mentor ID ${mentorId} in localStorage`);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Debug Mentor Requests</h1>
      
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Mentor ID</label>
              <div className="flex space-x-2">
                <Input
                  value={mentorId}
                  onChange={(e) => setMentorId(e.target.value)}
                  placeholder="Enter mentor ID"
                />
                <Button onClick={setMentorIdInStorage}>
                  Set in Storage
                </Button>
                <Button onClick={fetchRequests} disabled={loading}>
                  {loading ? 'Loading...' : 'Fetch Requests'}
                </Button>
              </div>
            </div>
            
            {error && (
              <div className="text-red-600 text-sm">{error}</div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold mb-4">
            Requests ({requests.length})
          </h2>
          
          {requests.length === 0 ? (
            <p className="text-gray-500">No requests found</p>
          ) : (
            <div className="space-y-4">
              {requests.map((request) => (
                <div key={request.id} className="border p-4 rounded">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div><strong>ID:</strong> {request.id}</div>
                    <div><strong>Student:</strong> {request.student_name}</div>
                    <div><strong>Status:</strong> {request.status}</div>
                    <div><strong>Created:</strong> {new Date(request.created_at).toLocaleString()}</div>
                    <div className="col-span-2"><strong>Message:</strong> {request.message}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold mb-4">localStorage Debug</h2>
          <div className="space-y-2 text-sm">
            <div><strong>mentorId:</strong> {localStorage.getItem('mentorId') || 'Not set'}</div>
            <div><strong>userId:</strong> {localStorage.getItem('userId') || 'Not set'}</div>
            <div><strong>user:</strong> {localStorage.getItem('user') || 'Not set'}</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}