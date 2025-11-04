import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/lib/toast";
import { createConnectionRequest, listStudentConnections, sendMessage, getMentors, getConnectionStatus, createChatWebSocket, getConversation, bookSession, getStudentSessions, submitFeedback } from "@/lib/api";
import {
  MessageSquare,
  Calendar,
  Star,
  MapPin,
  Clock,
  Search,
  Plus,
  Send,
  Video,
  Heart,
  UserPlus,
  Grid3X3,
  List,
  Lock,
  BarChart3
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import MessageNotificationBadge from '../../components/MessageNotificationBadge';

interface Mentor {
  id: string;
  name: string;
  avatar: string;
  title: string;
  company: string;
  location: string;
  expertise: string[];
  rating: number;
  reviewCount: number;
  availability: 'available' | 'busy' | 'unavailable';
  bio: string;
  experience: number;
  education: string;
  languages: string[];
  hourlyRate?: number;
  isConnected: boolean;
  isFavorite: boolean;
  connection_id?: number;
  requestStatus?: 'none' | 'pending' | 'accepted' | 'rejected';
}

interface MentorshipSession {
  id: string;
  mentorId: string;
  mentorName: string;
  mentorAvatar: string;
  topic: string;
  date: string;
  duration: number;
  status: 'scheduled' | 'completed' | 'cancelled';
  type: 'one-on-one' | 'group' | 'workshop';
  notes?: string;
  meetingLink?: string;
  meetingId?: string;
  passcode?: string;
}

interface Feedback {
  mentorId: string;
  rating: number;
  review: string;
  mentorRating?: number;
  mentorReview?: string;
}

export default function StudentMentorsPage() {
  const [activeTab, setActiveTab] = useState('browse');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedExpertise, setSelectedExpertise] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [selectedMentorForMessage, setSelectedMentorForMessage] = useState<Mentor | null>(null);
  const [messageForm, setMessageForm] = useState({ message: '' });
  const [showCallModal, setShowCallModal] = useState(false);
  const [selectedSessionForCall, setSelectedSessionForCall] = useState<MentorshipSession | null>(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedMentorForSchedule, setSelectedMentorForSchedule] = useState<Mentor | null>(null);
  const [scheduleForm, setScheduleForm] = useState({
    topic: '',
    preferred_date_time: '',
    message: '',
    mentor_id: ''
  });
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [selectedMentorForFeedback, setSelectedMentorForFeedback] = useState<Mentor | null>(null);
  const [feedbackForm, setFeedbackForm] = useState<{ rating: number; review: string }>({ rating: 0, review: '' });
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [prevConnections, setPrevConnections] = useState<any[]>([]);
  const [sessions, setSessions] = useState<MentorshipSession[]>([]);
  const chatWsRef = useRef<WebSocket | null>(null);

  // Get current student ID from localStorage
  const getCurrentStudentId = () => {
    const storedStudentId = localStorage.getItem('studentId');
    const storedUser = localStorage.getItem('user');
    if (storedStudentId) {
      const studentId = parseInt(storedStudentId);
      if (isNaN(studentId)) {
        throw new Error('Invalid student ID in localStorage. Please log in again.');
      }
      return studentId;
    }
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        if (user.role === 'student' && user.id) {
          localStorage.setItem('studentId', user.id.toString());
          return parseInt(user.id);
        }
        throw new Error('User is not logged in as a student. Please log in as a student.');
      } catch (e) {
        console.error('Error parsing user from localStorage:', e);
        throw new Error('Invalid user data in localStorage. Please log in again.');
      }
    }
    throw new Error('No student ID or user data found. Please log in as a student.');
  };

  // Format date and time from ISO string
  const formatSessionDateTime = (isoString: string) => {
    try {
      if (!isoString) {
        console.error(`No ISO string provided`);
        return { date: 'Invalid Date', time: 'Invalid Time' };
      }
      const date = new Date(isoString);
      if (isNaN(date.getTime())) {
        console.error(`Invalid ISO string: ${isoString}`);
        return { date: 'Invalid Date', time: 'Invalid Time' };
      }
      const [datePart, timePart] = isoString.split('T');
      const time = timePart ? timePart.substring(0, 5) : '00:00';
      return { date: datePart, time };
    } catch (err) {
      console.error(`Error formatting date/time for ${isoString}:`, err);
      return { date: 'Invalid Date', time: 'Invalid Time' };
    }
  };

  // Fetch mentors, connections, and feedback on mount
  useEffect(() => {
    const fetchMentors = async () => {
      try {
        setLoading(true);
        console.log('Fetching mentors from http://localhost:8000/api/mentors/');
        const data = await getMentors().then(res => res.data);
        console.log('Mentors API Response:', data);
        const mappedMentors: Mentor[] = data.map((mentor: any) => ({
          id: mentor.id.toString(),
          name: mentor.name || 'Unknown Mentor',
          avatar: 'https://placehold.co/80x80',
          title: mentor.mentor_role || mentor.field_of_study || 'Mentor',
          company: mentor.company_name || 'Unknown Company',
          location: mentor.location || 'Unknown Location',
          expertise: mentor.expertise ? (Array.isArray(mentor.expertise) ? mentor.expertise : mentor.expertise.split(',')) : [],
          rating: Number(mentor.ratings) || 0,
          reviewCount: mentor.feedback ? 1 : 0,
          availability: 'unavailable',
          bio: 'No bio available',
          experience: Number(mentor.experience_years) || Number(mentor.experience) || 0,
          education: mentor.education_level || 'Not specified',
          languages: [],
          hourlyRate: undefined,
          isConnected: false,
          isFavorite: false,
          requestStatus: 'none'
        }));
        setMentors(mappedMentors);
        await fetchConnectionStatuses(mappedMentors);
        setLoading(false);
      } catch (err: any) {
        console.error('Fetch mentors error:', err.message, err);
        let errorMessage = err.message;
        if (err.name === 'TypeError' && err.message === 'Failed to fetch') {
          errorMessage = 'Unable to connect to the server. Ensure the Django server is running on http://localhost:8000 and CORS is configured.';
        }
        setError(`Error fetching mentors: ${errorMessage}. Please try again later.`);
        setLoading(false);
        toast({ title: 'Error', description: `Failed to load mentors: ${errorMessage}`, variant: 'destructive' });
      }
    };

    const fetchConnections = async () => {
      try {
        const studentId = parseInt(localStorage.getItem('studentId') || '6');
        const connections = await listStudentConnections(studentId).then(res => res.data);
        setPrevConnections(prev => {

          connections.forEach((conn: any) => {
            const prevConn = prev.find(p => p.id === conn.id);
            if (prevConn && prevConn.status === 'pending' && conn.status === 'accepted') {
              toast({ title: 'Connection Accepted!', description: `Your connection request to ${conn.mentor_name} has been accepted. You can now chat with them.`, variant: 'default' });
            }
          });
          return connections;
        });
        setMentors(prev => prev.map(m => {
          const conn = connections.find((c: any) => c.mentor === parseInt(m.id));
          if (conn) {
            return { 
              ...m, 
              requestStatus: conn.status, 
              connection_id: conn.id, 
              isConnected: conn.status === 'accepted',
              rating: Number(conn.ratings) || m.rating,
              reviewCount: conn.feedback ? 1 : m.reviewCount
            };
          }
          return { ...m, requestStatus: 'none' };
        }));
        // Set feedback data from connections (only mentor feedback to student)
        setFeedbacks(connections
          .filter((conn: any) => conn.status === 'accepted' && conn.mentor_ratings)
          .map((conn: any) => ({
            mentorId: conn.mentor.toString(),
            rating: Number(conn.mentor_ratings),
            review: conn.mentor_feedback || '',
            mentorRating: undefined,
            mentorReview: undefined
          }))
        );
      } catch (err) {
        console.error('Error fetching connections:', err);
      }
    };

    const fetchStudentSessions = async () => {
      try {
        const studentId = parseInt(localStorage.getItem('studentId') || '6');
        const response = await getStudentSessions(studentId);
        console.log('Sessions API Response:', response.data);
        const mappedSessions = response.data.map((session: any) => {
          const dateField = session.scheduled_date_time || session.preferred_date_time;
          console.log(`Session ID: ${session.id}, Raw scheduled_date_time: ${session.scheduled_date_time}, preferred_date_time: ${session.preferred_date_time}, Selected date: ${dateField}`);
          return {
            id: session.id.toString(),
            mentorId: (session.mentor_id || session.mentor?.id).toString(),
            mentorName: session.mentor_name || session.mentor?.name || 'Unknown Mentor',
            mentorAvatar: 'https://placehold.co/80x80',
            topic: session.topic || 'No Topic',
            date: dateField || new Date().toISOString(),
            duration: session.duration || 60,
            status: session.status as 'scheduled' | 'completed' | 'cancelled',
            type: session.type || 'one-on-one',
            notes: session.message,
            meetingLink: session.meeting_link,
            meetingId: session.meeting_id,
            passcode: session.passcode
          };
        });
        setSessions(mappedSessions);
      } catch (err) {
        console.error('Error fetching student sessions:', err);
        setSessions([]);
        toast({ title: 'Error', description: 'Failed to load sessions', variant: 'destructive' });
      }
    };

    fetchMentors();
    fetchConnections();
    fetchStudentSessions();

    const pollInterval = setInterval(() => {
      if (mentors.length > 0) {
        fetchConnectionStatuses(mentors);
      }
      fetchStudentSessions();
    }, 30000);
    return () => clearInterval(pollInterval);
  }, []);



  const fetchConnectionStatuses = async (mentorList: Mentor[]) => {
    const studentId = parseInt(localStorage.getItem('studentId') || '6');
    if (!studentId || isNaN(studentId)) {
      console.error('Invalid studentId in localStorage');
      return;
    }

    const updatedMentors = [...mentorList];
    const promises = updatedMentors.map(async (mentor, index) => {
      try {
        const statusData = await getConnectionStatus(studentId, parseInt(mentor.id)).then(res => res.data);
        return { index, statusData };
      } catch (err) {
        console.error(`Error fetching status for mentor ${mentor.id}:`, err);
        return { index, statusData: { status: 'none', request_id: null } };
      }
    });

    const results = await Promise.allSettled(promises);
    results.forEach((result) => {
      if (result.status === 'fulfilled') {
        const { index, statusData } = result.value;
        updatedMentors[index] = {
          ...updatedMentors[index],
          requestStatus: statusData.status,
          connection_id: statusData.request_id,
          isConnected: statusData.status === 'accepted'
        };
      } else {
        console.error('Promise rejected:', result.reason);
      }
    });

    setMentors(updatedMentors);
  };

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'available': return 'bg-green-100 text-green-800 border-green-200';
      case 'busy': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'unavailable': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRequestStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'accepted': return 'bg-green-100 text-green-800 border-green-200';
      case 'declined': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const toggleFavorite = async (id: string) => {
    setMentors(prev => prev.map(m => m.id === id ? { ...m, isFavorite: !m.isFavorite } : m));
    toast({ title: 'Updated favorites' });
  };

  const sendConnectionRequest = async (mentorId: string) => {
    try {
      const storedStudentId = localStorage.getItem('studentId');
      const storedUser = localStorage.getItem('user');
      let studentId: number;

      if (storedStudentId) {
        studentId = parseInt(storedStudentId);
        if (isNaN(studentId)) {
          throw new Error('Invalid student ID in localStorage. Please log in again.');
        }
      } else if (storedUser) {
        try {
          const user = JSON.parse(storedUser);
          if (user.role === 'student' && user.id) {
            studentId = parseInt(user.id);
            localStorage.setItem('studentId', user.id.toString());
          } else {
            throw new Error('User is not logged in as a student. Please log in as a student.');
          }
        } catch (parseError) {
          throw new Error('Invalid user data in localStorage. Please log in again.');
        }
      } else {
        throw new Error('No student ID or user data found. Please log in as a student.');
      }

      const mentorIdInt = parseInt(mentorId);
      if (isNaN(mentorIdInt)) {
        throw new Error('Invalid mentor ID.');
      }

      setMentors(prev => prev.map(m => m.id === mentorId ? { ...m, requestStatus: 'pending' } : m));

      const requestData = {
        student_id: studentId,
        mentor_id: mentorIdInt,
        message: 'I would like to connect with you.'
      };

      await createConnectionRequest(requestData);
      toast({ title: 'Connection request sent!', description: 'The mentor will be notified of your request.' });

      const statusData = await getConnectionStatus(studentId, mentorIdInt).then(res => res.data);
      setMentors(prev => prev.map(m =>
        m.id === mentorId
          ? { ...m, requestStatus: statusData.status, connection_id: statusData.request_id, isConnected: statusData.status === 'accepted' }
          : m
      ));
    } catch (err: any) {
      setMentors(prev => prev.map(m => m.id === mentorId ? { ...m, requestStatus: 'none' } : m));
      let errorMessage = 'Failed to send connection request';
      if (err.message.includes('student ID') || err.message.includes('log in')) {
        errorMessage = err.message;
      } else if (err.response?.status === 404) {
        errorMessage = 'Student or mentor not found. Please check your account and try again.';
      } else if (err.response?.status === 400) {
        errorMessage = err.response.data?.error || 'Invalid request data. Please check the mentor and try again.';
      } else if (err.response?.status === 409) {
        errorMessage = err.response.data?.error || 'Connection request already exists.';
        if (err.response.data?.status) {
          setMentors(prev => prev.map(m =>
            m.id === mentorId
              ? { ...m, requestStatus: err.response.data.status, connection_id: err.response.data.request_id, isConnected: err.response.data.status === 'accepted' }
              : m
          ));
        }
      } else if (err.response?.status === 500) {
        errorMessage = 'Server error. Please try again later.';
      } else if (err.name === 'TypeError' && err.message === 'Failed to fetch') {
        errorMessage = 'Cannot connect to server. Please ensure the Django server is running on http://localhost:8000';
      }
      toast({ title: 'Error', description: errorMessage, variant: 'destructive' });
    }
  };

  const openFeedbackModal = (mentor: Mentor) => {
    setSelectedMentorForFeedback(mentor);
    const existingFeedback = feedbacks.find(f => f.mentorId === mentor.id);
    setFeedbackForm({
      rating: existingFeedback ? existingFeedback.rating : 0,
      review: existingFeedback ? existingFeedback.review : ''
    });
    setShowFeedbackModal(true);
  };

  const handleFeedbackSubmit = async () => {
    if (!selectedMentorForFeedback || feedbackForm.rating === 0 || feedbackForm.review.trim() === '') {
      toast({ title: 'Error', description: 'Please provide a rating and review.', variant: 'destructive' });
      return;
    }

    try {
      const studentId = getCurrentStudentId();
      const feedbackData = {
        student_id: studentId,
        mentor_id: parseInt(selectedMentorForFeedback.id),
        ratings: feedbackForm.rating,
        feedback: feedbackForm.review
      };
      await submitFeedback(feedbackData);

      // Update mentor rating and reviewCount
      setMentors((prev) =>
        prev.map((mentor) => {
          if (mentor.id === selectedMentorForFeedback.id) {
            const newReviewCount = mentor.reviewCount + (feedbacks.find(f => f.mentorId === mentor.id) ? 0 : 1);
            const newRating = newReviewCount > 0 
              ? (mentor.rating * mentor.reviewCount + feedbackForm.rating - (feedbacks.find(f => f.mentorId === mentor.id)?.rating || 0)) / newReviewCount
              : feedbackForm.rating;
            return {
              ...mentor,
              rating: parseFloat(newRating.toFixed(2)),
              reviewCount: newReviewCount,
            };
          }
          return mentor;
        })
      );

      toast({ 
        title: 'Success', 
        description: feedbacks.find(f => f.mentorId === selectedMentorForFeedback.id) ? 'Feedback updated successfully!' : 'Feedback submitted successfully!', 
        variant: 'default' 
      });
      setShowFeedbackModal(false);
      setFeedbackForm({ rating: 0, review: '' });
      setSelectedMentorForFeedback(null);
    } catch (err: any) {
      console.error('Error submitting feedback:', err);
      let errorMessage = 'Failed to submit feedback';
      if (err.response?.status === 400) {
        errorMessage = err.response.data?.error || 'Invalid feedback data';
      } else if (err.response?.status === 404) {
        errorMessage = 'Mentor or student not found';
      } else if (err.response?.status === 409) {
        errorMessage = 'Feedback already submitted for this mentor';
      } else if (err.name === 'TypeError' && err.message === 'Failed to fetch') {
        errorMessage = 'Cannot connect to server. Please ensure the Django server is running on http://localhost:8000';
      }
      toast({ title: 'Error', description: errorMessage, variant: 'destructive' });
    }
  };

  const filteredMentors = mentors.filter(mentor => {
    const matchesSearch = mentor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         mentor.expertise.some(exp => exp.toLowerCase().includes(searchQuery.toLowerCase())) ||
                         mentor.company.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesExpertise = selectedExpertise === 'all' || mentor.expertise.includes(selectedExpertise);
    return matchesSearch && matchesExpertise;
  });

  const expertiseOptions = ['all', ...Array.from(new Set(mentors.flatMap(m => m.expertise)))];

  const openMessageModal = (mentor: Mentor) => {
    setSelectedMentorForMessage(mentor);
    setShowMessageModal(true);
  };

  useEffect(() => {
    if (showMessageModal && selectedMentorForMessage && selectedMentorForMessage.isConnected) {
      const studentId = parseInt(localStorage.getItem('studentId') || '6');
      
      const fetchMessages = async () => {
        try {
          const messages = await getConversation(studentId, parseInt(selectedMentorForMessage.id)).then(res => res.data.messages);
          const sortedMessages = messages.sort((a: any, b: any) => 
            new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
          );
          setMessages(sortedMessages);
        } catch (err) {
          console.error('Error fetching messages:', err);
          setMessages([]);
        }
      };
      
      fetchMessages();

      chatWsRef.current = createChatWebSocket(studentId, parseInt(selectedMentorForMessage.id), (message) => {
        setMessages(prev => {
          const exists = prev.some(m => m.id === message.id && m.timestamp === message.timestamp);
          if (!exists) {
            return [...prev, message].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
          }
          return prev;
        });
      });

      chatWsRef.current.onerror = (event) => {
        console.error('Chat WebSocket error:', event);
      };
      chatWsRef.current.onclose = (event) => {
        console.warn('Chat WebSocket closed:', event);
      };

      return () => {
        chatWsRef.current?.close();
      };
    }
  }, [showMessageModal, selectedMentorForMessage]);

  const openCallModal = (session: MentorshipSession) => {
    if (session.meetingLink) {
      window.open(session.meetingLink, '_blank', 'noopener,noreferrer');
    } else if (session.meetingId && session.passcode) {
      const zoomUrl = `https://zoom.us/j/${session.meetingId}?pwd=${encodeURIComponent(session.passcode)}`;
      window.open(zoomUrl, '_blank', 'noopener,noreferrer');
    } else {
      setSelectedSessionForCall(session);
      setShowCallModal(true);
      toast({ title: 'Error', description: 'No meeting link or valid Zoom details provided.', variant: 'destructive' });
    }
  };

  const openScheduleModal = (mentor?: Mentor) => {
    setSelectedMentorForSchedule(mentor || null);
    setScheduleForm({ topic: '', preferred_date_time: '', message: '', mentor_id: mentor?.id || '' });
    setShowScheduleModal(true);
  };

  // === FEEDBACK TAB DATA ===
  const feedbackWithDetails = feedbacks.map(feedback => {
    const mentor = mentors.find(m => m.id === feedback.mentorId);
    const session = sessions.find(s => s.mentorId === feedback.mentorId && s.status === 'completed');
    return {
      ...feedback,
      mentorName: mentor?.name || 'Unknown Mentor',
      mentorAvatar: mentor?.avatar || 'https://placehold.co/80x80',
      sessionTopic: session?.topic || mentor?.title || 'Mentor',
      sessionDate: session?.date || new Date().toISOString(),
    };
  });

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  const ratingData = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: feedbacks.filter(f => f.rating === rating).length
  }));

  if (loading) {
    return <div className="text-center p-6">Loading mentors...</div>;
  }

  if (error) {
    return <div className="text-center p-6 text-red-600">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mentors</h1>
          <p className="text-gray-600 mt-1">Connect with experienced professionals</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="browse">Browse</TabsTrigger>
          <TabsTrigger value="sessions">Sessions</TabsTrigger>
          <TabsTrigger value="requests">Requests</TabsTrigger>
          <TabsTrigger value="favorites">Favorites</TabsTrigger>
          <TabsTrigger value="feedback">Feedback</TabsTrigger>
        </TabsList>

        {/* BROWSE TAB */}
        <TabsContent value="browse" className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search mentors by name, expertise, or company..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="bg-white pl-10"
                    />
                  </div>
                </div>
                <div className="flex space-x-2">
                  {expertiseOptions.slice(0, 5).map((expertise) => (
                    <Button
                      key={expertise}
                      variant={selectedExpertise === expertise ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedExpertise(expertise)}
                      className="capitalize"
                    >
                      {expertise}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-between items-center mb-4">
            <div className="flex gap-2">
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="w-4 h-4 mr-2" />
                List
              </Button>
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <Grid3X3 className="w-4 h-4 mr-2" />
                Grid
              </Button>
            </div>
          </div>

          <div className={viewMode === "grid" ? "grid grid-cols-1 lg:grid-cols-2 gap-6" : "grid gap-4"}>
            {filteredMentors.map((mentor) => (
              <Card key={mentor.id} className="hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4 mb-4">
                    <Avatar className="h-16 w-16">
                      <AvatarFallback className="bg-gray-600 text-white text-lg">
                        {mentor.name.split(' ').map((n: string) => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-gray-900 text-lg">{mentor.name}</h3>
                          <p className="text-gray-600 text-sm">{mentor.title}</p>
                          <p className="text-gray-500 text-sm">{mentor.company}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleFavorite(mentor.id)}
                            className={mentor.isFavorite ? 'text-red-500' : 'text-gray-400'}
                          >
                            <Heart className={`w-4 h-4 ${mentor.isFavorite ? 'fill-current' : ''}`} />
                          </Button>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                        <span className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {mentor.location}
                        </span>
                        <span className="flex items-center">
                          <Star className="w-4 h-4 mr-1 fill-current text-yellow-500" />
                          {mentor.rating} ({mentor.reviewCount})
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {mentor.requestStatus !== 'accepted' && (
                          <Badge variant="outline" className={getAvailabilityColor(mentor.availability)}>
                            {mentor.availability}
                          </Badge>
                        )}
                        {mentor.requestStatus && mentor.requestStatus !== 'none' && (
                          <Badge variant="outline" className={getRequestStatusColor(mentor.requestStatus)}>
                            {mentor.requestStatus}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{mentor.bio}</p>

                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-900 mb-2">Expertise</h4>
                    <div className="flex flex-wrap gap-1">
                      {mentor.expertise.slice(0, 3).map((exp) => (
                        <Badge key={exp} variant="outline" className="text-xs">
                          {exp}
                        </Badge>
                      ))}
                      {mentor.expertise.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{mentor.expertise.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span>{mentor.experience > 0 ? `${mentor.experience} years experience` : 'Experience not specified'}</span>
                    <span>Languages: {mentor.languages.join(', ') || 'Not specified'}</span>
                  </div>

                  <div className="flex space-x-2">
                    {mentor.requestStatus === 'accepted' ? (
                      <>
                        <Button className="flex-1 bg-green-600 text-white hover:bg-green-700 relative" onClick={() => openMessageModal(mentor)}>
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Message
                          <MessageNotificationBadge senderId={mentor.id} />
                        </Button>
                        <Button variant="outline" onClick={() => openScheduleModal(mentor)}>
                          <Calendar className="w-4 h-4 mr-2" />
                          Request
                        </Button>
                        <Button variant="outline" onClick={() => openFeedbackModal(mentor)}>
                          <Star className="w-4 h-4 mr-2" />
                          Feedback
                        </Button>
                      </>
                    ) : mentor.requestStatus === 'pending' ? (
                      <Button className="flex-1 bg-yellow-500 text-white" disabled>
                        <Clock className="w-4 h-4 mr-2" />
                        Pending
                      </Button>
                    ) : mentor.requestStatus === 'rejected' ? (
                      <Button
                        className="flex-1 bg-fusteps-red text-white hover:bg-red-600"
                        onClick={() => sendConnectionRequest(mentor.id)}
                      >
                        <UserPlus className="w-4 h-4 mr-2" />
                        Retry Request
                      </Button>
                    ) : (
                      <Button
                        className="flex-1 bg-fusteps-red text-white hover:bg-red-600"
                        onClick={() => sendConnectionRequest(mentor.id)}
                      >
                        <UserPlus className="w-4 h-4 mr-2" />
                        Connect
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* SESSIONS TAB */}
        <TabsContent value="sessions" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-gray-900">My Sessions</h2>
            <Button
              className="bg-fusteps-red hover:bg-red-600 text-white"
              onClick={() => openScheduleModal()}
            >
              <Plus className="w-4 h-4 mr-2" />
              Schedule Session
            </Button>
          </div>
          <div className="space-y-4">
            {sessions.map((session) => {
              const { date, time } = formatSessionDateTime(session.date);
              return (
                <Card key={session.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <Avatar className="h-12 w-12">
                          <AvatarFallback className="bg-gray-600 text-white">
                            {session.mentorName.split(' ').map((n: string) => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold text-gray-900">{session.topic}</h3>
                          <p className="text-sm text-gray-600">with {session.mentorName}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className={getStatusColor(session.status)}>
                          {session.status}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {session.type}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <span className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {date} at {time}
                      </span>
                      <span className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {session.duration} minutes
                      </span>
                    </div>
                    {session.meetingLink && (
                      <div className="flex items-center text-sm text-gray-600 mb-2">
                        <Video className="w-4 h-4 mr-2" />
                        Meeting Link: <a href={session.meetingLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline ml-1">{session.meetingLink}</a>
                      </div>
                    )}
                    <div className="flex items-center text-sm text-gray-600 mb-2">
                      <Video className="w-4 h-4 mr-2" />
                      Meeting ID: {session.meetingId || 'Not provided'}
                    </div>
                    <div className="flex items-center text-sm text-gray-600 mb-2">
                      <Lock className="w-4 h-4 mr-2" />
                      Passcode: {session.passcode || 'Not provided'}
                    </div>
                    <div className="flex space-x-2">
                      {session.status === 'scheduled' && (
                        <>
                          <Button variant="outline" onClick={() => openCallModal(session)}>
                            <Video className="w-4 h-4 mr-2" />
                            Join Call
                          </Button>
                          <Button variant="ghost" className="text-gray-500 hover:text-red-600">
                            Cancel
                          </Button>
                        </>
                      )}
                      <Button
                        variant="ghost"
                        className="text-gray-500 hover:text-gray-900"
                        onClick={() => openMessageModal(mentors.find(m => m.id === session.mentorId)!)}
                      >
                        <MessageSquare className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          {sessions.length === 0 && (
            <Card className="border-0 shadow-lg">
              <CardContent className="p-12 text-center">
                <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No sessions scheduled</h3>
                <p className="text-gray-600">Schedule your first mentoring session to get started.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* REQUESTS TAB */}
        <TabsContent value="requests" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-gray-900">Mentorship Requests</h2>
            <Button
              className="bg-fusteps-red hover:bg-red-600 text-white"
              onClick={() => openScheduleModal()}
            >
              <Plus className="w-4 h-4 mr-2" />
              New Request
            </Button>
          </div>
          <div className="space-y-4">
            {prevConnections.map((request) => (
              <Card key={request.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg mb-1">Request to {request.mentor_name}</h3>
                      <Badge variant="outline" className={getRequestStatusColor(request.status)}>
                        {request.status}
                      </Badge>
                    </div>
                    <span className="text-sm text-gray-500">Sent {new Date(request.sent_date).toLocaleDateString()}</span>
                  </div>
                  <p className="text-gray-600 mb-4">{request.message}</p>
                  <div className="flex space-x-2">
                    {request.status === 'accepted' && (
                      <Button
                        className="bg-fusteps-red text-white hover:bg-red-600"
                        onClick={() => openScheduleModal({
                          id: request.mentor.toString(),
                          name: request.mentor_name,
                          avatar: 'https://placehold.co/80x80',
                          title: '',
                          company: '',
                          location: '',
                          expertise: [],
                          rating: 0,
                          reviewCount: 0,
                          availability: 'available',
                          bio: '',
                          experience: 0,
                          education: '',
                          languages: [],
                          isConnected: true,
                          isFavorite: false
                        } as Mentor)}
                      >
                        <Calendar className="w-4 h-4 mr-2" />
                        Schedule Session
                      </Button>
                    )}
                    {request.status === 'pending' && (
                      <Button variant="ghost" className="text-gray-500 hover:text-red-600">
                        Cancel Request
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      className="text-gray-500 hover:text-gray-900"
                      onClick={() => openMessageModal({
                        id: request.mentor.toString(),
                        name: request.mentor_name,
                        avatar: 'https://placehold.co/80x80',
                        title: '',
                        company: '',
                        location: '',
                        expertise: [],
                        rating: 0,
                        reviewCount: 0,
                        availability: 'available',
                        bio: '',
                        experience: 0,
                        education: '',
                        languages: [],
                        isConnected: request.status === 'accepted',
                        isFavorite: false
                      } as Mentor)}
                    >
                      <MessageSquare className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* FAVORITES TAB */}
        <TabsContent value="favorites" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {mentors.filter(m => m.isFavorite).map((mentor) => (
              <Card key={mentor.id} className="hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4 mb-4">
                    <Avatar className="h-16 w-16">
                      <AvatarFallback className="bg-gray-600 text-white text-lg">
                        {mentor.name.split(' ').map((n: string) => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-gray-900 text-lg">{mentor.name}</h3>
                          <p className="text-gray-600 text-sm">{mentor.title}</p>
                          <p className="text-gray-500 text-sm">{mentor.company}</p>
                        </div>
                        <Heart className="w-5 h-5 text-red-500 fill-current" />
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                        <span className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {mentor.location}
                        </span>
                        <span className="flex items-center">
                          <Star className="w-4 h-4 mr-1 fill-current text-yellow-500" />
                          {mentor.rating} ({mentor.reviewCount})
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {mentor.requestStatus !== 'accepted' && (
                          <Badge variant="outline" className={getAvailabilityColor(mentor.availability)}>
                            {mentor.availability}
                          </Badge>
                        )}
                        {mentor.requestStatus && mentor.requestStatus !== 'none' && (
                          <Badge variant="outline" className={getRequestStatusColor(mentor.requestStatus)}>
                            {mentor.requestStatus}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button className="flex-1 bg-fusteps-red text-white hover:bg-red-600" onClick={() => openMessageModal(mentor)}>
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Message
                    </Button>
                    <Button variant="outline" onClick={() => openScheduleModal(mentor)}>
                      <Calendar className="w-4 h-4 mr-2" />
                      Request
                    </Button>
                    {mentor.requestStatus === 'accepted' && (
                      <Button variant="outline" onClick={() => openFeedbackModal(mentor)}>
                        <Star className="w-4 h-4 mr-2" />
                        Feedback
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* FEEDBACK TAB */}
        <TabsContent value="feedback" className="space-y-6">
          <div className="max-w-7xl mx-auto space-y-8 px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">My Feedback</h1>
                <p className="text-gray-500 mt-1"></p>
              </div>
            </div>

            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-gray-100 rounded-xl p-1">
                <TabsTrigger value="overview" className="rounded-lg py-2 font-medium data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm">
                  Overview
                </TabsTrigger>
                <TabsTrigger value="analytics" className="rounded-lg py-2 font-medium data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm">
                  Analytics
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-6 space-y-6">
                {feedbackWithDetails.length === 0 ? (
                  <Card className="border-0 shadow-lg">
                    <CardContent className="p-12 text-center">
                      <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No feedback yet</h3>
                      <p className="text-gray-600">You haven't received any feedback from your mentors.</p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {feedbackWithDetails.map((fb) => (
                      <Card key={fb.mentorId} className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-5">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center space-x-3">
                              <Avatar className="h-10 w-10">
                                <AvatarFallback className="bg-gray-600 text-white">{fb.mentorName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                              </Avatar>
                              <div>
                                <h4 className="font-semibold text-gray-900">{fb.mentorName}</h4>
                                <p className="text-sm text-gray-500">{fb.sessionTopic}</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              {renderStars(fb.rating)}
                              <span className="text-sm font-medium text-gray-600">{fb.rating}/5</span>
                            </div>
                          </div>
                          <p className="text-gray-600 leading-relaxed">{fb.review}</p>
                          {fb.mentorRating && (
                            <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                              <h5 className="text-sm font-medium text-gray-700 mb-2">Mentor's Feedback</h5>
                              <div className="flex items-center space-x-2 mb-2">
                                {renderStars(fb.mentorRating)}
                                <span className="text-sm font-medium text-gray-600">{fb.mentorRating}/5</span>
                              </div>
                              {fb.mentorReview && <p className="text-gray-600 leading-relaxed">{fb.mentorReview}</p>}
                            </div>
                          )}
                          <div className="flex justify-end items-center mt-3 text-xs text-gray-400">
                            <span>{new Date(fb.sessionDate).toLocaleDateString()}</span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="analytics" className="mt-6">
                <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-gray-50">
                  <CardHeader>
                    <CardTitle className="flex items-center text-xl">
                      <BarChart3 className="w-6 h-6 mr-2 text-blue-600" />
                      Your Rating Distribution
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={ratingData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="rating" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </TabsContent>
      </Tabs>

      {/* MESSAGE MODAL */}
      <Dialog open={showMessageModal} onOpenChange={setShowMessageModal}>
        <DialogContent className="max-w-md w-full max-h-[90vh] h-[600px] p-0 flex flex-col">
          <div className="bg-green-600 text-white p-4 flex items-center space-x-3 flex-shrink-0">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-gray-600 text-white">
                {selectedMentorForMessage?.name.split(' ').map((n: string) => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold truncate">{selectedMentorForMessage?.name}</h3>
              <p className="text-sm text-green-100">Online</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-green-700 flex-shrink-0"
              onClick={() => setShowMessageModal(false)}
            >
              ✕
            </Button>
          </div>
          <div className="flex-1 bg-gray-50 p-4 space-y-3 overflow-y-auto min-h-0">
            {messages.map((message: any) => (
              <div key={message.id} className={`flex ${message.sender_type === 'student' ? 'justify-end' : 'justify-start'}`}>
                <div className={`rounded-lg ${message.sender_type === 'student' ? 'bg-green-600 text-white rounded-tr-none' : 'bg-white text-gray-800 rounded-tl-none'} px-4 py-2 max-w-xs shadow-sm`}>
                  <p className="text-sm">{message.content}</p>
                  <p className={`text-xs mt-1 ${message.sender_type === 'student' ? 'text-green-100' : 'text-gray-500'}`}>
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="border-t bg-white p-4 flex-shrink-0">
            <div className="flex items-end space-x-2">
              <div className="flex-1">
                <Textarea
                  rows={2}
                  value={messageForm.message}
                  onChange={(e) => setMessageForm(prev => ({ ...prev, message: e.target.value }))}
                  placeholder="Type a message..."
                  className="resize-none border-0 focus:ring-0 focus:border-0 min-h-[40px] max-h-[80px]"
                  onKeyDown={async (e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      if (messageForm.message.trim() && selectedMentorForMessage) {
                        try {
                          const studentId = parseInt(localStorage.getItem('studentId') || '6');
                          const messageData = {
                            content: messageForm.message,
                            sender_type: 'student' as const,
                            sender_id: studentId,
                            receiver_id: parseInt(selectedMentorForMessage.id)
                          };
                          const newMessage = await sendMessage(messageData).then(res => res.data);
                          setMessages(prev => {
                            const exists = prev.some(m => m.id === newMessage.id && m.timestamp === newMessage.timestamp);
                            if (!exists) {
                              return [...prev, newMessage].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
                            }
                            return prev;
                          });
                          
                          // Trigger notification for mentor
                          if ((window as any).showMessageNotification) {
                            const studentName = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!).name || 'Student' : 'Student';
                            (window as any).showMessageNotification(studentName, studentId.toString());
                          }
                          
                          setMessageForm({ message: '' });
                        } catch (err) {
                          toast({ title: 'Error', description: 'Failed to send message', variant: 'destructive' });
                        }
                      }
                    }
                  }}
                />
              </div>
              <Button
                className="bg-green-600 hover:bg-green-700 text-white rounded-full w-10 h-10 p-0 flex-shrink-0"
                onClick={async () => {
                  if (messageForm.message.trim() && selectedMentorForMessage) {
                    try {
                      const studentId = parseInt(localStorage.getItem('studentId') || '6');
                      const messageData = {
                        content: messageForm.message,
                        sender_type: 'student' as const,
                        sender_id: studentId,
                        receiver_id: parseInt(selectedMentorForMessage.id)
                      };
                      const newMessage = await sendMessage(messageData).then(res => res.data);
                      setMessages(prev => {
                        const exists = prev.some(m => m.id === newMessage.id && m.timestamp === newMessage.timestamp);
                        if (!exists) {
                          return [...prev, newMessage].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
                        }
                        return prev;
                      });
                      setMessageForm({ message: '' });
                    } catch (err) {
                      toast({ title: 'Error', description: 'Failed to send message', variant: 'destructive' });
                    }
                  }
                }}
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* SCHEDULE MODAL */}
      <Dialog open={showScheduleModal} onOpenChange={setShowScheduleModal}>
        <DialogContent className="max-w-md w-full">
          <DialogHeader>
            <DialogTitle>Book Session Request</DialogTitle>
            <DialogDescription>Schedule a mentoring session with a mentor</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              {selectedMentorForSchedule ? (
                <>
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-gray-600 text-white">
                      {selectedMentorForSchedule.name.split(' ').map((n: string) => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold text-gray-900">
                      Book with {selectedMentorForSchedule.name}
                    </div>
                    <p className="text-sm text-gray-600">{selectedMentorForSchedule.title}</p>
                  </div>
                </>
              ) : (
                <div className="w-full">
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Select Mentor</label>
                  <Select
                    value={scheduleForm.mentor_id}
                    onValueChange={(value) => {
                      const mentor = mentors.find(m => m.id === value && m.isConnected);
                      setSelectedMentorForSchedule(mentor || null);
                      setScheduleForm(prev => ({ ...prev, mentor_id: value }));
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a mentor" />
                    </SelectTrigger>
                    <SelectContent>
                      {mentors.filter(m => m.isConnected).map((mentor) => (
                        <SelectItem key={mentor.id} value={mentor.id}>
                          {mentor.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Topic</label>
              <Input
                placeholder="What would you like to discuss?"
                value={scheduleForm.topic}
                onChange={(e) => setScheduleForm(prev => ({ ...prev, topic: e.target.value }))}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Preferred Date & Time</label>
              <Input
                type="datetime-local"
                value={scheduleForm.preferred_date_time}
                onChange={(e) => setScheduleForm(prev => ({ ...prev, preferred_date_time: e.target.value }))}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Message (Optional)</label>
              <Textarea
                rows={3}
                placeholder="Any additional details or questions..."
                value={scheduleForm.message}
                onChange={(e) => setScheduleForm(prev => ({ ...prev, message: e.target.value }))}
              />
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setShowScheduleModal(false)}>
                Cancel
              </Button>
              <Button
                className="bg-fusteps-red text-white hover:bg-red-600"
                onClick={async () => {
                  if (scheduleForm.topic && scheduleForm.preferred_date_time && scheduleForm.mentor_id) {
                    try {
                      const studentId = parseInt(localStorage.getItem('studentId') || '6');
                      await bookSession({
                        student_id: studentId,
                        mentor_id: parseInt(scheduleForm.mentor_id),
                        topic: scheduleForm.topic,
                        preferred_date_time: scheduleForm.preferred_date_time,
                        message: scheduleForm.message
                      });
                      toast({ title: 'Request sent!', description: 'Your session request has been sent to the mentor.' });
                      setShowScheduleModal(false);
                      setScheduleForm({ topic: '', preferred_date_time: '', message: '', mentor_id: '' });
                      setSelectedMentorForSchedule(null);
                    } catch (err) {
                      toast({ title: 'Error', description: 'Failed to send request', variant: 'destructive' });
                    }
                  } else {
                    toast({ title: 'Error', description: 'Please fill in all required fields, including mentor selection', variant: 'destructive' });
                  }
                }}
              >
                Send Request
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* CALL MODAL */}
      <Dialog open={showCallModal} onOpenChange={setShowCallModal}>
        <DialogContent className="max-w-md w-full max-h-[90vh] h-[600px] p-0 flex flex-col">
          <div className="bg-blue-600 text-white p-4 flex items-center space-x-3 flex-shrink-0">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-gray-600 text-white">
                {selectedSessionForCall?.mentorName.split(' ').map((n: string) => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold truncate">{selectedSessionForCall?.topic}</h3>
              <p className="text-sm text-blue-100">with {selectedSessionForCall?.mentorName}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-blue-700 flex-shrink-0"
              onClick={() => setShowCallModal(false)}
            >
              ✕
            </Button>
          </div>
          <div className="flex-1 bg-gray-50 p-4 space-y-3 overflow-y-auto min-h-0">
            <p className="text-gray-600">
              {selectedSessionForCall?.meetingLink
                ? `Redirecting to meeting link...`
                : selectedSessionForCall?.meetingId && selectedSessionForCall?.passcode
                ? `Redirecting to Zoom meeting...`
                : `No meeting link or valid Zoom details provided for this session.`}
            </p>
          </div>
          <div className="border-t bg-white p-4 flex-shrink-0">
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowCallModal(false)}>
                Cancel
              </Button>
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white"
                disabled={!selectedSessionForCall?.meetingLink && !(selectedSessionForCall?.meetingId && selectedSessionForCall?.passcode)}
                onClick={() => {
                  if (selectedSessionForCall?.meetingLink) {
                    window.open(selectedSessionForCall.meetingLink, '_blank', 'noopener,noreferrer');
                  } else if (selectedSessionForCall?.meetingId && selectedSessionForCall?.passcode) {
                    const zoomUrl = `https://zoom.us/j/${selectedSessionForCall.meetingId}?pwd=${encodeURIComponent(selectedSessionForCall.passcode)}`;
                    window.open(zoomUrl, '_blank', 'noopener,noreferrer');
                  }
                }}
              >
                Join Call
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* FEEDBACK MODAL */}
      <Dialog open={showFeedbackModal} onOpenChange={setShowFeedbackModal}>
        <DialogContent className="max-w-md w-full">
          <DialogHeader>
            <DialogTitle>Feedback for {selectedMentorForFeedback?.name}</DialogTitle>
            <DialogDescription>Share your experience with this mentor</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <Avatar className="h-12 w-12">
                <AvatarFallback className="bg-gray-600 text-white">
                  {selectedMentorForFeedback?.name.split(' ').map((n: string) => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-gray-900">{selectedMentorForFeedback?.name}</h3>
                <p className="text-sm text-gray-600">{selectedMentorForFeedback?.title}</p>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
              <div className="flex items-center space-x-1">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star
                    key={i}
                    className={`w-6 h-6 cursor-pointer ${
                      i < feedbackForm.rating
                        ? 'text-yellow-500 fill-current'
                        : 'text-gray-400'
                    }`}
                    onClick={() => setFeedbackForm(prev => ({ ...prev, rating: i + 1 }))}
                  />
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Review</label>
              <Textarea
                placeholder="Share your experience with this mentor..."
                value={feedbackForm.review}
                onChange={(e) => setFeedbackForm(prev => ({ ...prev, review: e.target.value }))}
                rows={4}
              />
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setShowFeedbackModal(false);
                  setFeedbackForm({ rating: 0, review: '' });
                  setSelectedMentorForFeedback(null);
                }}
              >
                Cancel
              </Button>
              <Button
                className="bg-fusteps-red text-white hover:bg-red-600"
                onClick={handleFeedbackSubmit}
              >
                Submit Feedback
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}