import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getStudentSessions } from '@/lib/api';
import {
  Clock,
  Search,
  Filter,
  Video,
  Star,
  MessageSquare,
  Calendar,
  CheckCircle,
  XCircle,
  AlertCircle,
  Download,
  Edit,
  Trash2,
  Users,
  TrendingUp,
  Lock
} from 'lucide-react';

interface Session {
  id: string;
  mentorId: string;
  mentorName: string;
  mentorAvatar: string;
  topic: string;
  preferred_date_time: string;
  message: string;
  status: 'pending' | 'accepted' | 'rejected' | 'scheduled';
  scheduled_date_time?: string;
  meeting_link?: string;
  meeting_id?: string;
  passcode?: string;
  notes?: string;
}

export default function Sessions() {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [showSessionDetails, setShowSessionDetails] = useState(false);

  const [sessions, setSessions] = useState<Session[]>([]);

  const fetchData = async () => {
    const studentId = parseInt(localStorage.getItem('studentId') || '1');
    try {
      const response = await getStudentSessions(studentId);
      setSessions(response.data);
    } catch (err) {
      console.error('Error fetching sessions:', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'accepted': return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'scheduled': return <Clock className="w-4 h-4" />;
      case 'pending': return <AlertCircle className="w-4 h-4" />;
      case 'accepted': return <CheckCircle className="w-4 h-4" />;
      case 'rejected': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const filteredSessions = sessions.filter(session => {
    const matchesSearch = session.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         session.mentorName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || session.status === statusFilter;
    const matchesTab = activeTab === 'all' ||
                      (activeTab === 'upcoming' && session.status === 'scheduled') ||
                      (activeTab === 'pending' && session.status === 'pending') ||
                      (activeTab === 'completed' && session.status === 'accepted');
    return matchesSearch && matchesStatus && matchesTab;
  });

  const viewSessionDetails = (session: Session) => {
    setSelectedSession(session);
    setShowSessionDetails(true);
  };

  const totalSessions = sessions.length;
  const scheduledSessions = sessions.filter(s => s.status === 'scheduled').length;
  const pendingSessions = sessions.filter(s => s.status === 'pending').length;

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Sessions</h1>
          <p className="text-gray-600 mt-1">View and manage your mentoring sessions</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{totalSessions}</div>
            <div className="text-sm text-gray-500">Total Sessions</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{scheduledSessions}</div>
            <div className="text-sm text-gray-500">Scheduled</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">{pendingSessions}</div>
            <div className="text-sm text-gray-500">Pending</div>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All Sessions</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="completed">Accepted</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-6">
          {/* Search and Filters */}
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search sessions by topic or mentor name..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="accepted">Accepted</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Sessions List */}
          <div className="space-y-4">
            {filteredSessions.map((session) => (
              <Card key={session.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-12 w-12 border-2 border-gray-200">
                        <AvatarImage src={session.mentorAvatar} />
                        <AvatarFallback className="bg-gray-600 text-white">
                          {session.mentorName.split(' ').map((n: string) => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-gray-900 text-lg">{session.topic}</h3>
                        <p className="text-gray-600">with {session.mentorName}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge variant="outline" className={getStatusColor(session.status)}>
                        {getStatusIcon(session.status)}
                        <span className="ml-1 capitalize">{session.status}</span>
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      {session.status === 'scheduled' && session.scheduled_date_time ?
                        new Date(session.scheduled_date_time).toLocaleDateString() + ' at ' + new Date(session.scheduled_date_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) :
                        new Date(session.preferred_date_time).toLocaleDateString() + ' at ' + new Date(session.preferred_date_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
                      }
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="w-4 h-4 mr-2" />
                      60 minutes
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Video className="w-4 h-4 mr-2" />
                      Virtual
                    </div>
                  </div>

                  {session.message && (
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 mb-4 rounded-lg">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">Message</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{session.message}</p>
                    </div>
                  )}

                  {session.status === 'scheduled' && session.meeting_id && (
                    <div className="flex items-center text-sm text-gray-600 mb-2">
                      <Video className="w-4 h-4 mr-2" />
                      Meeting ID: {session.meeting_id}
                    </div>
                  )}
                  {session.status === 'scheduled' && session.passcode && (
                    <div className="flex items-center text-sm text-gray-600 mb-2">
                      <Lock className="w-4 h-4 mr-2" />
                      Passcode: {session.passcode}
                    </div>
                  )}

                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => viewSessionDetails(session)}
                    >
                      View Details
                    </Button>
                    {session.status === 'scheduled' && session.meeting_link && (
                      <a href={session.meeting_link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
                        <Video className="w-4 h-4 mr-1" />
                        Join Meeting
                      </a>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredSessions.length === 0 && (
            <Card className="border-0 shadow-lg">
              <CardContent className="p-12 text-center">
                <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No sessions found</h3>
                <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Session Details Modal */}
      <Dialog open={showSessionDetails} onOpenChange={setShowSessionDetails}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Session Details</DialogTitle>
          </DialogHeader>

          {selectedSession && (
            <div className="space-y-6">
              {/* Session Header */}
              <div className="flex items-start space-x-4">
                <Avatar className="h-16 w-16 border-2 border-gray-200">
                  <AvatarImage src={selectedSession.mentorAvatar} />
                  <AvatarFallback className="bg-gray-600 text-white text-lg">
                    {selectedSession.mentorName.split(' ').map((n: string) => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedSession.topic}</h2>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span>with {selectedSession.mentorName}</span>
                    <Badge variant="outline" className={getStatusColor(selectedSession.status)}>
                      {selectedSession.status}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Session Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Session Information</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Preferred Date & Time:</span>
                        <span className="font-medium">
                          {new Date(selectedSession.preferred_date_time).toLocaleDateString()} at {new Date(selectedSession.preferred_date_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </span>
                      </div>
                      {selectedSession.scheduled_date_time && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Scheduled Date & Time:</span>
                          <span className="font-medium">
                            {new Date(selectedSession.scheduled_date_time).toLocaleDateString()} at {new Date(selectedSession.scheduled_date_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-gray-600">Duration:</span>
                        <span className="font-medium">60 minutes</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Type:</span>
                        <span className="font-medium">Virtual</span>
                      </div>
                      {selectedSession.meeting_id && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Meeting ID:</span>
                          <span className="font-medium">{selectedSession.meeting_id}</span>
                        </div>
                      )}
                      {selectedSession.passcode && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Passcode:</span>
                          <span className="font-medium">{selectedSession.passcode}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Status</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        <Badge variant="outline" className={getStatusColor(selectedSession.status)}>
                          {selectedSession.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Message */}
              {selectedSession.message && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Message</h3>
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <p className="text-gray-700 dark:text-gray-300">{selectedSession.message}</p>
                  </div>
                </div>
              )}

              {/* Notes */}
              {selectedSession.notes && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Notes</h3>
                  <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
                    <p className="text-blue-700 dark:text-blue-300">{selectedSession.notes}</p>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-4">
                {selectedSession.status === 'scheduled' && selectedSession.meeting_link && (
                  <a href={selectedSession.meeting_link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
                    <Video className="w-4 h-4 mr-2" />
                    Join Meeting
                  </a>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
