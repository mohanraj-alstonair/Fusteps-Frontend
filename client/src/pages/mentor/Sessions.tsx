import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getMentorSessions, getAcceptedMentees } from '@/lib/api';
import {
  Clock,
  Search,
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
  Lock
} from 'lucide-react';

interface Session {
  id: string;
  menteeId: string;
  menteeName: string;
  menteeAvatar: string;
  topic: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: number;
  status: 'scheduled' | 'completed' | 'cancelled' | 'no_show' | 'accepted' | 'pending' | 'rejected';
  type: 'virtual' | 'in_person';
  location?: string;
  meetingLink?: string;
  meetingId?: string;
  passcode?: string;
  notes?: string;
  rating?: number;
  feedback?: string;
  goals?: string[];
}

export default function Sessions() {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [showSessionDetails, setShowSessionDetails] = useState(false);
  const [mentees, setMentees] = useState([]);
  const [sessions, setSessions] = useState<Session[]>([]);

  const fetchData = async () => {
    const mentorId = parseInt(localStorage.getItem('mentorId') || '5');
    try {
      // Fetch mentor sessions (scheduled and completed)
      const sessionsResponse = await getMentorSessions(mentorId);
      
      const mappedSessions = sessionsResponse.data.map((booking: any) => {
        const dateTime = booking.scheduled_date_time || booking.preferred_date_time;
        return {
          id: booking.id.toString(),
          menteeId: booking.student_id.toString(),
          menteeName: booking.student_name,
          menteeAvatar: '/api/placeholder/40/40',
          topic: booking.topic,
          date: dateTime ? dateTime.split('T')[0] : new Date().toISOString().split('T')[0],
          startTime: dateTime ? dateTime.split('T')[1].substring(0,5) : '00:00',
          endTime: dateTime ? new Date(new Date(dateTime).getTime() + 60 * 60 * 1000).toTimeString().substring(0,5) : '01:00',
          duration: 60,
          status: booking.status as 'scheduled' | 'completed' | 'cancelled' | 'accepted' | 'pending' | 'rejected',
          type: 'virtual' as const,
          meetingLink: booking.meeting_link,
          meetingId: booking.meeting_id,
          passcode: booking.passcode,
          notes: booking.message,
        };
      });
      setSessions(mappedSessions);

      const menteesResponse = await getAcceptedMentees(mentorId);
      setMentees(menteesResponse.data);
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'scheduled': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'accepted': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      case 'no_show': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'scheduled': return <Clock className="w-4 h-4" />;
      case 'accepted': return <CheckCircle className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'cancelled': return <XCircle className="w-4 h-4" />;
      case 'rejected': return <XCircle className="w-4 h-4" />;
      case 'no_show': return <AlertCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const filteredSessions = sessions.filter(session => {
    const matchesSearch = session.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         session.menteeName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || session.status === statusFilter;
    const matchesType = typeFilter === 'all' || session.type === typeFilter;
    
    const sessionDateTime = new Date(`${session.date}T${session.startTime}`);
    const now = new Date();
    const isUpcoming = sessionDateTime > now;
    
    const matchesTab = activeTab === 'all' ||
                      (activeTab === 'upcoming' && ['scheduled', 'accepted'].includes(session.status) && isUpcoming) ||
                      (activeTab === 'completed' && session.status === 'completed') ||
                      (activeTab === 'cancelled' && ['cancelled', 'rejected'].includes(session.status));
    return matchesSearch && matchesStatus && matchesType && matchesTab;
  });

  const viewSessionDetails = (session: Session) => {
    setSelectedSession(session);
    setShowSessionDetails(true);
  };

  const totalSessions = sessions.length;
  const completedSessions = sessions.filter(s => s.status === 'completed').length;
  const upcomingSessions = sessions.filter(s => s.status === 'scheduled').length;
  const avgRating = sessions.filter(s => s.rating).reduce((acc, s) => acc + (s.rating || 0), 0) /
                   sessions.filter(s => s.rating).length || 0;

  return (
    <div className="max-w-7xl mx-auto space-y-8 bg-white text-gray-900">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Sessions</h1>
          <p className="text-gray-600 mt-1">Manage and track your mentoring sessions</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{totalSessions}</div>
            <div className="text-sm text-gray-500">Total Sessions</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{completedSessions}</div>
            <div className="text-sm text-gray-500">Completed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{upcomingSessions}</div>
            <div className="text-sm text-gray-500">Upcoming</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">{avgRating.toFixed(1)}</div>
            <div className="text-sm text-gray-500">Avg Rating</div>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All Sessions</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
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
                      placeholder="Search sessions by topic or mentee name..."
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
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="virtual">Virtual</SelectItem>
                    <SelectItem value="in_person">In Person</SelectItem>
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
                        <AvatarImage src={session.menteeAvatar} />
                        <AvatarFallback className="bg-gray-600 text-white">
                          {session.menteeName.split(' ').map((n: string) => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-gray-900 text-lg">{session.topic}</h3>
                        <p className="text-gray-600">with {session.menteeName}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge variant="outline" className={getStatusColor(session.status)}>
                        {getStatusIcon(session.status)}
                        <span className="ml-1 capitalize">{session.status}</span>
                      </Badge>
                      {session.rating && (
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-500 fill-current mr-1" />
                          <span className="text-sm font-medium">{session.rating}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      {new Date(session.date).toLocaleDateString()} at {session.startTime}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="w-4 h-4 mr-2" />
                      {session.duration} minutes
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      {session.type === 'virtual' ? (
                        <Video className="w-4 h-4 mr-2" />
                      ) : (
                        <Users className="w-4 h-4 mr-2" />
                      )}
                      {session.type === 'virtual' ? 'Virtual' : 'In Person'}
                      {session.location && ` • ${session.location}`}
                    </div>
                  </div>

                  <div className="flex items-center text-sm text-gray-600 mb-2">
                    <Video className="w-4 h-4 mr-2" />
                    Meeting ID: {session.meetingId || 'Not provided'}
                  </div>
                  <div className="flex items-center text-sm text-gray-600 mb-2">
                    <Lock className="w-4 h-4 mr-2" />
                    Passcode: {session.passcode || 'Not provided'}
                  </div>

                  {session.notes && (
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 mb-4 rounded-lg">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">Session Notes</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{session.notes}</p>
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
                    {session.status === 'scheduled' && session.meetingLink && (
                      <a href={session.meetingLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
                        <Video className="w-4 h-4 mr-1" />
                        Join Meeting
                      </a>
                    )}
                    {session.status === 'completed' && !session.rating && (
                      <Button variant="outline" size="sm">
                        <Star className="w-4 h-4 mr-2" />
                        Rate Session
                      </Button>
                    )}
                    <Button variant="ghost" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                      <Trash2 className="w-4 h-4" />
                    </Button>
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
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white text-gray-900">
          <DialogHeader>
            <DialogTitle>Session Details</DialogTitle>
          </DialogHeader>

          {selectedSession && (
            <div className="space-y-6">
              {/* Session Header */}
              <div className="flex items-start space-x-4">
                <Avatar className="h-16 w-16 border-2 border-gray-200">
                  <AvatarImage src={selectedSession.menteeAvatar} />
                  <AvatarFallback className="bg-gray-600 text-white text-lg">
                    {selectedSession.menteeName.split(' ').map((n: string) => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedSession.topic}</h2>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span>with {selectedSession.menteeName}</span>
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
                        <span className="text-gray-600">Date & Time:</span>
                        <span className="font-medium">
                          {new Date(selectedSession.date).toLocaleDateString()} at {selectedSession.startTime}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Duration:</span>
                        <span className="font-medium">{selectedSession.duration} minutes</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Type:</span>
                        <span className="font-medium capitalize">{selectedSession.type.replace('_', ' ')}</span>
                      </div>
                      {selectedSession.location && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Location:</span>
                          <span className="font-medium">{selectedSession.location}</span>
                        </div>
                      )}
                      {selectedSession.meetingId && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Meeting ID:</span>
                          <span className="font-medium">{selectedSession.meetingId}</span>
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
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Performance</h3>
                    <div className="space-y-3">
                      {selectedSession.rating && (
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Rating:</span>
                          <div className="flex items-center">
                            <Star className="w-5 h-5 text-yellow-500 fill-current mr-1" />
                            <span className="font-medium">{selectedSession.rating}/5</span>
                          </div>
                        </div>
                      )}
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

              {/* Notes and Feedback */}
              {selectedSession.notes && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Session Notes</h3>
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <p className="text-gray-700 dark:text-gray-300">{selectedSession.notes}</p>
                  </div>
                </div>
              )}

              {selectedSession.feedback && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Feedback</h3>
                  <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
                    <p className="text-blue-700 dark:text-blue-300">{selectedSession.feedback}</p>
                  </div>
                </div>
              )}

              {selectedSession.goals && selectedSession.goals.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Goals Discussed</h3>
                  <div className="space-y-2">
                    {selectedSession.goals.map((goal, index) => (
                      <div key={index} className="flex items-center space-x-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span className="text-gray-900 dark:text-gray-100">{goal}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-4">
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Export Notes
                </Button>
                <Button variant="outline">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Send Follow-up
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Session
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}