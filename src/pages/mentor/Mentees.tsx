import { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  listMentorRequests,
  updateRequestStatus,
  sendMessage,
  createChatWebSocket,
  getAcceptedMentees,
  getConversation,
  getMentorBookingRequests,
  acceptBooking,
  rejectBooking,
  getAcceptedBookings,
  submitMentorFeedback,
  getMentorFeedback,
  getMentorProjectIdeas,
  updateProjectStatus,
  getMentorNotifications,
  getUploadedProjects,
  submitProjectFeedback
} from '@/lib/api';
import {
  MessageSquare,
  Calendar,
  MapPin,
  Clock,
  Search,
  Plus,
  Send,
  Video,
  Edit,
  Eye,
  UserPlus,
  CheckCircle2,
  XCircle,
  Lock,
  Trash2,
  Star,
  Lightbulb,
  User,
  ThumbsUp,
  ThumbsDown,
  FileText,
  FolderOpen,
  Github,
  ExternalLink
} from 'lucide-react';

interface Mentee {
  id: string;
  name: string;
  avatar: string;
  email: string;
  university: string;
  major: string;
  year: string;
  location: string;
  joinedDate: string;
  lastActive: string;
  status: 'active' | 'inactive' | 'graduated';
  goals: string[];
  skills: string[];
  progress: {
    overall: number;
    sessionsCompleted: number;
    totalSessions: number;
    goalsAchieved: number;
    totalGoals: number;
  };
  nextSession?: {
    date: string;
    topic: string;
  };
  recentActivity: string[];
}

interface MenteeRequest {
  id: number;
  student: number;
  mentor: number;
  status: string;
  message: string;
  created_at: string;
  updated_at: string;
  student_name: string;
  mentor_name: string;
  avatar?: string;
  email?: string;
  university?: string;
  major?: string;
  year?: string;
  location?: string;
  goals?: string[];
  skills?: string[];
}

export default function Mentees() {
  const [activeTab, setActiveTab] = useState('mentees');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedMentee, setSelectedMentee] = useState<Mentee | null>(null);
  const [showMenteeDetails, setShowMenteeDetails] = useState(false);
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [selectedMenteeForMessage, setSelectedMenteeForMessage] = useState<Mentee | null>(null);
  const [messageForm, setMessageForm] = useState({ message: '' });
  const [menteeRequests, setMenteeRequests] = useState<MenteeRequest[]>([]);
  const [bookingRequests, setBookingRequests] = useState<any[]>([]);
  const [acceptedBookings, setAcceptedBookings] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const chatWsRef = useRef<WebSocket | null>(null);
  const [mentees, setMentees] = useState<Mentee[]>([]);
  const [unreadMessages, setUnreadMessages] = useState<{ [key: string]: number }>({});

  // Feedback Modal State
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [selectedMenteeForFeedback, setSelectedMenteeForFeedback] = useState<Mentee | null>(null);
  const [feedbackForm, setFeedbackForm] = useState({
    rating: 0,
    review: '',
  });
  const [isViewMode, setIsViewMode] = useState(false);
  const [mentorFeedbacks, setMentorFeedbacks] = useState<Record<string, { rating: number; review: string }>>({});
  
  // Project Ideas State
  const [projectIdeas, setProjectIdeas] = useState<any[]>([]);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [projectAction, setProjectAction] = useState<'approve' | 'reject' | 'review'>('review');
  const [projectForm, setProjectForm] = useState({
    literature_review_date: '',
    prototype_demo_date: '',
    mentor_review_notes: ''
  });

  
  // Notifications State
  const [notifications, setNotifications] = useState({
    pending_requests: 0,
    pending_bookings: 0,
    new_projects: 0,
    unread_messages: 0,
    total_notifications: 0
  });

  // Student Projects State
  const [showProjectsModal, setShowProjectsModal] = useState(false);
  const [selectedMenteeForProjects, setSelectedMenteeForProjects] = useState<Mentee | null>(null);
  const [studentProjects, setStudentProjects] = useState<any[]>([]);
  const [showProjectFeedbackModal, setShowProjectFeedbackModal] = useState(false);
  const [selectedProjectForFeedback, setSelectedProjectForFeedback] = useState<any>(null);
  const [projectFeedbackForm, setProjectFeedbackForm] = useState({
    feedback: '',
    rating: 0
  });

  useEffect(() => {
    const getMentorId = () => {
      let mentorId = localStorage.getItem('mentorId') ||
                    localStorage.getItem('userId') ||
                    localStorage.getItem('user_id');

      if (!mentorId) {
        const userData = localStorage.getItem('user');
        if (userData) {
          try {
            const user = JSON.parse(userData);
            mentorId = user.id || user.user_id;
          } catch (e) {
            console.error('Error parsing user data:', e);
          }
        }
      }

      return mentorId || '5';
    };

    const fetchData = async () => {
      // Only fetch if page is visible
      if (document.hidden) return;
      
      try {
        const mentorId = getMentorId();

        const requestsResponse = await listMentorRequests(parseInt(mentorId));
        setMenteeRequests(requestsResponse.data);

        const menteesResponse = await getAcceptedMentees(parseInt(mentorId));
        const acceptedMentees = menteesResponse.data.map((mentee: any) => ({
          id: mentee.id ? mentee.id.toString() : '',
          name: mentee.name || 'Unknown',
          avatar: '/api/placeholder/80/80',
          email: mentee.email || '',
          university: mentee.university || 'Unknown University',
          major: mentee.major || 'Unknown Major',
          year: mentee.year || 'Unknown',
          location: mentee.location || 'Unknown',
          joinedDate: mentee.joinedDate || new Date().toISOString().split('T')[0],
          lastActive: mentee.lastActive || new Date().toISOString().split('T')[0],
          status: (mentee.status || 'active') as 'active' | 'inactive' | 'graduated',
          goals: [],
          skills: [],
          progress: {
            overall: 0,
            sessionsCompleted: 0,
            totalSessions: 0,
            goalsAchieved: 0,
            totalGoals: 0
          },
          recentActivity: ['Connected with mentor']
        }));
        setMentees(acceptedMentees);

        const bookingResponse = await getMentorBookingRequests(parseInt(mentorId));
        setBookingRequests(bookingResponse.data);

        const acceptedBookingsResponse = await getAcceptedBookings(parseInt(mentorId));
        const mappedBookings = acceptedBookingsResponse.data.map((booking: any) => {
          const dateTime = booking.scheduled_date_time || booking.preferred_date_time;
          return {
            ...booking,
            date: dateTime ? dateTime.split('T')[0] : new Date().toISOString().split('T')[0],
            startTime: dateTime ? dateTime.split('T')[1].substring(0,5) : '00:00',
            duration: 60,
          };
        });
        setAcceptedBookings(mappedBookings);

        const unreadCounts: { [key: string]: number } = {};
        for (const mentee of acceptedMentees) {
          if (mentee.id) {
            try {
              const conversation = await getConversation(parseInt(mentee.id), parseInt(mentorId));
              const unread = conversation.data.messages.filter((msg: any) =>
                msg.sender_type === 'mentee' && !msg.is_read
              ).length;
              unreadCounts[mentee.id] = unread;
            } catch (error) {
              console.error(`Error fetching conversation for mentee ${mentee.id}:`, error);
              unreadCounts[mentee.id] = 0;
            }
          }
        }
        setUnreadMessages(unreadCounts);

        const feedbackResponse = await getMentorFeedback(parseInt(mentorId));
        const feedbackMap: Record<string, { rating: number; review: string }> = {};
        feedbackResponse.data.forEach((feedback: any) => {
          if (feedback.student_id) {
            feedbackMap[feedback.student_id.toString()] = {
              rating: feedback.mentor_ratings || 0,
              review: feedback.mentor_feedback || ''
            };
          }
        });
        setMentorFeedbacks(feedbackMap);

        const notificationsResponse = await getMentorNotifications(parseInt(mentorId));
        setNotifications(notificationsResponse.data);
        
        // Also fetch project ideas for notification count if not already loaded
        try {
          const projectIdeasResponse = await getMentorProjectIdeas(parseInt(mentorId));
          const newProjectsCount = (projectIdeasResponse.data || []).filter((project: any) => !project.mentor_review_notes).length;
          setNotifications(prev => ({ ...prev, new_projects: newProjectsCount }));
        } catch (projectErr) {
          console.error('Error fetching project ideas for notifications:', projectErr);
        }

      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000);
    
    // Add visibility change listener to pause polling when tab is not active
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchData(); // Refresh when tab becomes active
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [activeTab]);

  // Separate useEffect for project ideas
  useEffect(() => {
    const getMentorId = () => {
      let mentorId = localStorage.getItem('mentorId') ||
                    localStorage.getItem('userId') ||
                    localStorage.getItem('user_id');

      if (!mentorId) {
        const userData = localStorage.getItem('user');
        if (userData) {
          try {
            const user = JSON.parse(userData);
            mentorId = user.id || user.user_id;
          } catch (e) {
            console.error('Error parsing user data:', e);
          }
        }
      }

      return mentorId || '5';
    };

    const fetchProjectIdeas = async () => {
      // Only fetch if page is visible
      if (document.hidden) return;
      
      try {
        const mentorId = getMentorId();
        const projectIdeasResponse = await getMentorProjectIdeas(parseInt(mentorId));
        setProjectIdeas(projectIdeasResponse.data || []);
        
        // Calculate new projects count
        const newProjectsCount = (projectIdeasResponse.data || []).filter((project: any) => !project.mentor_review_notes).length;
        setNotifications(prev => ({ ...prev, new_projects: newProjectsCount }));
      } catch (err) {
        console.error('Error fetching project ideas:', err);
      }
    };

    fetchProjectIdeas();
    const projectInterval = setInterval(fetchProjectIdeas, 60000);
    
    // Add visibility change listener for project ideas
    const handleProjectVisibilityChange = () => {
      if (!document.hidden) {
        fetchProjectIdeas();
      }
    };
    document.addEventListener('visibilitychange', handleProjectVisibilityChange);
    
    return () => {
      clearInterval(projectInterval);
      document.removeEventListener('visibilitychange', handleProjectVisibilityChange);
    };
  }, []);

  useEffect(() => {
    if (showMessageModal && selectedMenteeForMessage) {
      const mentorId = parseInt(localStorage.getItem('mentorId') || localStorage.getItem('userId') || '5');
      
      const fetchMessages = async () => {
        try {
          const response = await getConversation(parseInt(selectedMenteeForMessage.id), mentorId);
          const sortedMessages = response.data.messages.sort((a: any, b: any) => 
            new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
          );
          setMessages(sortedMessages);
          setUnreadMessages(prev => ({
            ...prev,
            [selectedMenteeForMessage.id]: 0
          }));
        } catch (err) {
          console.error('Error fetching messages:', err);
          setMessages([]);
        }
      };
      
      fetchMessages();

      chatWsRef.current = createChatWebSocket(mentorId, parseInt(selectedMenteeForMessage.id), (message) => {
        setMessages(prev => {
          const exists = prev.some(m => m.id === message.id && m.timestamp === message.timestamp);
          if (!exists) {
            const updatedMessages = [...prev, message].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
            if (!showMessageModal) {
              setUnreadMessages(prev => ({
                ...prev,
                [selectedMenteeForMessage.id]: (prev[selectedMenteeForMessage.id] || 0) + (message.sender_type === 'mentee' ? 1 : 0)
              }));
            }
            return updatedMessages;
          }
          return prev;
        });
      });

      return () => {
        chatWsRef.current?.close();
      };
    }
  }, [showMessageModal, selectedMenteeForMessage]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'graduated': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const filteredMentees = mentees.filter(mentee => {
    const matchesSearch = mentee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         mentee.university.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         mentee.major.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || mentee.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const viewMenteeDetails = (mentee: Mentee) => {
    setSelectedMentee(mentee);
    setShowMenteeDetails(true);
  };

  const openMessageModal = (mentee: Mentee) => {
    setSelectedMenteeForMessage(mentee);
    setShowMessageModal(true);
  };

  const openFeedbackModal = (mentee: Mentee) => {
    setSelectedMenteeForFeedback(mentee);
    const existingFeedback = mentorFeedbacks[mentee.id];
    if (existingFeedback) {
      setFeedbackForm({ rating: existingFeedback.rating, review: existingFeedback.review });
      setIsViewMode(true);
    } else {
      setFeedbackForm({ rating: 0, review: '' });
      setIsViewMode(false);
    }
    setShowFeedbackModal(true);
  };

  const openProjectsModal = async (mentee: Mentee) => {
    setSelectedMenteeForProjects(mentee);
    try {
      const response = await getUploadedProjects(parseInt(mentee.id));
      setStudentProjects(response.data || []);
      setShowProjectsModal(true);
    } catch (error) {
      console.error('Error fetching student projects:', error);
      setStudentProjects([]);
      setShowProjectsModal(true);
    }
  };

  const openProjectFeedbackModal = (project: any) => {
    setSelectedProjectForFeedback(project);
    setProjectFeedbackForm({
      feedback: project.mentor_feedback || '',
      rating: project.rating || 0
    });
    setShowProjectFeedbackModal(true);
  };

  const submitProjectFeedbackHandler = async () => {
    if (!selectedProjectForFeedback || !projectFeedbackForm.feedback.trim()) return;

    try {
      const mentorId = parseInt(localStorage.getItem('mentorId') || localStorage.getItem('userId') || '5');
      
      await submitProjectFeedback(selectedProjectForFeedback.id, {
        mentor_id: mentorId,
        feedback: projectFeedbackForm.feedback,
        rating: projectFeedbackForm.rating || undefined
      });

      // Update the project in the list
      setStudentProjects(prev => prev.map(p => 
        p.id === selectedProjectForFeedback.id 
          ? { ...p, mentor_feedback: projectFeedbackForm.feedback, rating: projectFeedbackForm.rating }
          : p
      ));

      setShowProjectFeedbackModal(false);
      setProjectFeedbackForm({ feedback: '', rating: 0 });
    } catch (error) {
      console.error('Error submitting project feedback:', error);
    }
  };

  const submitFeedback = async () => {
    if (!selectedMenteeForFeedback || feedbackForm.rating === 0) return;

    try {
      const mentorId = parseInt(localStorage.getItem('mentorId') || localStorage.getItem('userId') || '5');

      await submitMentorFeedback({
        mentor_id: mentorId,
        student_id: parseInt(selectedMenteeForFeedback.id),
        mentor_ratings: feedbackForm.rating,
        mentor_feedback: feedbackForm.review,
      });

      setMentorFeedbacks(prev => ({
        ...prev,
        [selectedMenteeForFeedback.id]: { rating: feedbackForm.rating, review: feedbackForm.review }
      }));

      setShowFeedbackModal(false);
      setFeedbackForm({ rating: 0, review: '' });
    } catch (err) {
      console.error('Error submitting mentor feedback:', err);
    }
  };

  const openProjectModal = (project: any, action: 'approve' | 'reject' | 'review') => {
    setSelectedProject(project);
    setProjectAction(action);
    setProjectForm({
      literature_review_date: project.literature_review_date || '',
      prototype_demo_date: project.prototype_demo_date || '',
      mentor_review_notes: project.mentor_review_notes || ''
    });
    setShowProjectModal(true);
  };

  const handleProjectAction = async () => {
    if (!selectedProject) return;

    try {
      const mentorId = parseInt(localStorage.getItem('mentorId') || localStorage.getItem('userId') || '5');
      
      await updateProjectStatus(selectedProject.id, {
        mentor_id: mentorId,
        action: projectAction,
        literature_review_date: projectForm.literature_review_date || undefined,
        prototype_demo_date: projectForm.prototype_demo_date || undefined,
        mentor_review_notes: projectForm.mentor_review_notes
      });

      // Immediately refresh project ideas and notifications
      console.log('Refreshing project ideas and notifications after action...');
      const projectIdeasResponse = await getMentorProjectIdeas(mentorId);
      console.log('Updated project ideas response:', projectIdeasResponse);
      console.log('Updated project ideas data:', projectIdeasResponse.data);
      setProjectIdeas(projectIdeasResponse.data || []);
      
      const notificationsResponse = await getMentorNotifications(mentorId);
      console.log('Updated notifications:', notificationsResponse.data);
      setNotifications(notificationsResponse.data);
      
      setShowProjectModal(false);
      setSelectedProject(null);
      setProjectForm({ literature_review_date: '', prototype_demo_date: '', mentor_review_notes: '' });
    } catch (err) {
      console.error('Error updating project status:', err);
    }
  };

  const handleDirectReject = async (project: any) => {
    try {
      const mentorId = parseInt(localStorage.getItem('mentorId') || localStorage.getItem('userId') || '5');
      
      await updateProjectStatus(project.id, {
        mentor_id: mentorId,
        action: 'reject',
        mentor_review_notes: 'Project rejected by mentor'
      });

      const projectIdeasResponse = await getMentorProjectIdeas(mentorId);
      setProjectIdeas(projectIdeasResponse.data || []);
      
      const notificationsResponse = await getMentorNotifications(mentorId);
      setNotifications(notificationsResponse.data);
    } catch (err) {
      console.error('Error rejecting project:', err);
    }
  };

  const sendMessageToMentee = async () => {
    if (!messageForm.message.trim() || !selectedMenteeForMessage) return;

    try {
      const mentorId = parseInt(localStorage.getItem('mentorId') || localStorage.getItem('userId') || '5');
      
      const messageData = {
        content: messageForm.message,
        sender_type: 'mentor' as const,
        sender_id: mentorId,
        receiver_id: parseInt(selectedMenteeForMessage.id)
      };

      const response = await sendMessage(messageData);
      
      setMessages(prev => {
        const newMessage = response.data;
        const exists = prev.some(m => m.id === newMessage.id && m.timestamp === newMessage.timestamp);
        if (!exists) {
          return [...prev, newMessage].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
        }
        return prev;
      });
      
      setMessageForm({ message: '' });
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  const acceptRequest = async (request: MenteeRequest) => {
    try {
      await updateRequestStatus(request.id, 'accepted');
      
      const newMentee: Mentee = {
        id: request.student ? request.student.toString() : '',
        name: request.student_name || 'Unknown',
        avatar: '/api/placeholder/80/80',
        email: request.email || '',
        university: request.university || 'Unknown University',
        major: request.major || 'Unknown Major',
        year: request.year || 'Unknown',
        location: request.location || 'Unknown',
        joinedDate: new Date().toISOString().split('T')[0],
        lastActive: new Date().toISOString().split('T')[0],
        status: 'active',
        goals: [],
        skills: [],
        progress: {
          overall: 0,
          sessionsCompleted: 0,
          totalSessions: 0,
          goalsAchieved: 0,
          totalGoals: 0
        },
        recentActivity: ['Connected with mentor']
      };
      
      setMentees(prev => [newMentee, ...prev]);
      
      let mentorId = localStorage.getItem('mentorId') || 
                    localStorage.getItem('userId') || 
                    localStorage.getItem('user_id');
      
      if (!mentorId) {
        const userData = localStorage.getItem('user');
        if (userData) {
          try {
            const user = JSON.parse(userData);
            mentorId = user.id || user.user_id;
          } catch (e) {
            console.error('Error parsing user data:', e);
          }
        }
      }
      
      mentorId = mentorId || '5';
      const response = await listMentorRequests(parseInt(mentorId));
      setMenteeRequests(response.data);
    } catch (err) {
      console.error('Error accepting request:', err);
    }
  };

  const rejectRequest = async (requestId: number) => {
    try {
      await updateRequestStatus(requestId, 'rejected');
      
      let mentorId = localStorage.getItem('mentorId') || 
                    localStorage.getItem('userId') || 
                    localStorage.getItem('user_id');
      
      if (!mentorId) {
        const userData = localStorage.getItem('user');
        if (userData) {
          try {
            const user = JSON.parse(userData);
            mentorId = user.id || user.user_id;
          } catch (e) {
            console.error('Error parsing user data:', e);
          }
        }
      }
      
      mentorId = mentorId || '5';
      const response = await listMentorRequests(parseInt(mentorId));
      setMenteeRequests(response.data);
    } catch (err) {
      console.error('Error rejecting request:', err);
    }
  };

  const activeMentees = mentees.filter(m => m.status === 'active').length;
  const totalSessions = acceptedBookings.filter((s: any) => s.status === 'completed').length;
  const avgProgress = mentees.length > 0 ? Math.round(mentees.reduce((acc, m) => acc + m.progress.overall, 0) / mentees.length) : 0;
  const pendingRequests = menteeRequests.filter(req => req.status === 'pending').length;
  const pendingBookingRequests = bookingRequests.filter((req: any) => req.status === 'pending').length;

  const StarRating = ({ rating, onChange }: { rating: number; onChange?: (v: number) => void }) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => onChange?.(value)}
            className="focus:outline-none transition-colors"
          >
            <Star
              className={`w-6 h-6 ${
                value <= rating
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300'
              } hover:text-yellow-400`}
            />
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Mentees</h1>
          <p className="text-gray-600 mt-1">Track progress and guide your mentees' development</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{activeMentees}</div>
            <div className="text-sm text-gray-500">Active Mentees</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{totalSessions}</div>
            <div className="text-sm text-gray-500">Sessions Completed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{avgProgress}%</div>
            <div className="text-sm text-gray-500">Avg Progress</div>
          </div>
          {notifications.new_projects > 0 && (
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-600">{notifications.new_projects}</div>
              <div className="text-sm text-gray-500">New Projects</div>
            </div>
          )}
          {pendingRequests > 0 && (
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{pendingRequests}</div>
              <div className="text-sm text-gray-500">Pending Requests</div>
            </div>
          )}
          {pendingBookingRequests > 0 && (
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{pendingBookingRequests}</div>
              <div className="text-sm text-gray-500">Booking Requests</div>
            </div>
          )}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="mentees">Mentees</TabsTrigger>
          <TabsTrigger value="sessions">Sessions</TabsTrigger>
          <TabsTrigger value="goals">Goals</TabsTrigger>
          <TabsTrigger value="projects" className="relative">
            Project Ideas 
            {projectIdeas.filter(p => !p.mentor_review_notes).length > 0 && (
              <span className="ml-2 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold animate-pulse">
                {projectIdeas.filter(p => !p.mentor_review_notes).length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="requests">Connection Requests {pendingRequests > 0 && <span className="text-red-600 font-bold">({pendingRequests})</span>}</TabsTrigger>
          <TabsTrigger value="booking">Booking Requests {pendingBookingRequests > 0 && <span className="text-red-600 font-bold">({pendingBookingRequests})</span>}</TabsTrigger>
        </TabsList>

        <TabsContent value="mentees" className="space-y-6">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search mentees by name, university, or major..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="graduated">Graduated</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredMentees.map((mentee) => (
              <Card key={mentee.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-4">
                      <Avatar className="h-16 w-16 border-2 border-gray-200">
                        <AvatarImage src={mentee.avatar} />
                        <AvatarFallback className="bg-gray-600 text-white text-lg">
                          {mentee.name && typeof mentee.name === 'string' && mentee.name.trim() ? 
                            mentee.name.split(' ').filter((n: string) => n).map((n: string) => n.charAt(0)).join('').substring(0, 2) : 
                            'NA'
                          }
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold text-gray-900 text-lg">{mentee.name}</h3>
                            <p className="text-gray-600 text-sm">{mentee.major} • {mentee.year}</p>
                            <p className="text-gray-500 text-sm">{mentee.university}</p>
                          </div>
                          <Badge variant="outline" className={getStatusColor(mentee.status)}>
                            {mentee.status}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                          <span className="flex items-center">
                            <MapPin className="w-4 h-4 mr-1" />
                            {mentee.location}
                          </span>
                          <span>Last active: {new Date(mentee.lastActive).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-900">Overall Progress</span>
                      <span className="text-sm text-gray-600">{mentee.progress.overall}%</span>
                    </div>
                    <Progress value={mentee.progress.overall} className="h-2" />
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-600">{mentee.progress.sessionsCompleted}</div>
                      <div className="text-xs text-gray-500">Sessions</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-600">{mentee.progress.goalsAchieved}</div>
                      <div className="text-xs text-gray-500">Goals</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-purple-600">{mentee.skills.length}</div>
                      <div className="text-xs text-gray-500">Skills</div>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => viewMenteeDetails(mentee)}
                      className="flex-1"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </Button>

                    <Button 
                      size="sm" 
                      className="bg-green-600 hover:bg-green-700 text-white relative"
                      onClick={() => openMessageModal(mentee)}
                    >
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Message
                      {unreadMessages[mentee.id] > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold animate-pulse shadow-lg">
                          {unreadMessages[mentee.id]}
                        </span>
                      )}
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      className="border-purple-600 text-purple-600 hover:bg-purple-50"
                      onClick={() => openFeedbackModal(mentee)}
                    >
                      <Star className="w-4 h-4 mr-2" />
                      Feedback
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      className="border-blue-600 text-blue-600 hover:bg-blue-50"
                      onClick={() => openProjectsModal(mentee)}
                    >
                      <FolderOpen className="w-4 h-4 mr-2" />
                      Projects
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="sessions" className="space-y-6">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">Session History</h2>
          </div>
          <div className="space-y-4">
            {acceptedBookings.filter((session: any) => {
              const sessionDateTime = new Date(session.scheduled_date_time || session.preferred_date_time);
              const now = new Date();
              return sessionDateTime >= now || session.status === 'completed';
            }).map((session: any) => (
              <Card key={session.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src="/api/placeholder/40/40" />
                        <AvatarFallback className="bg-gray-600 text-white">
                          {session.student_name.split(' ').map((n: string) => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-gray-900">{session.topic}</h3>
                        <p className="text-sm text-gray-600">with {session.student_name}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className={session.status === 'scheduled' ? 'bg-blue-100 text-blue-800 border-blue-200' : session.status === 'completed' ? 'bg-green-100 text-green-800 border-green-200' : 'bg-gray-100 text-gray-800 border-gray-200'}>
                        {session.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {new Date(session.date).toLocaleDateString()} at {session.startTime}
                    </span>
                    <span className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {session.duration} minutes
                    </span>
                  </div>
                  {session.meeting_link && (
                    <div className="flex items-center text-sm text-gray-600 mb-2">
                      <Video className="w-4 h-4 mr-2" />
                      Meeting Link: <a href={session.meeting_link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline ml-1">{session.meeting_link}</a>
                    </div>
                  )}
                  <div className="flex items-center text-sm text-gray-600 mb-2">
                    <Video className="w-4 h-4 mr-2" />
                    Meeting ID: {session.meeting_id || 'Not provided'}
                  </div>
                  <div className="flex items-center text-sm text-gray-600 mb-2">
                    <Lock className="w-4 h-4 mr-2" />
                    Passcode: {session.passcode || 'Not provided'}
                  </div>
                  {session.message && (
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 mb-4 rounded-lg">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">Session Notes</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{session.message}</p>
                    </div>
                  )}
                  <div className="flex space-x-2">
                    {session.status === 'scheduled' && session.meeting_link && (
                      <a href={session.meeting_link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
                        <Video className="w-4 h-4 mr-1" />
                        Join Meeting
                      </a>
                    )}
                    <Button variant="outline" size="sm">
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
          {acceptedBookings.length === 0 && (
            <Card className="border-0 shadow-lg">
              <CardContent className="p-12 text-center">
                <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No sessions scheduled</h3>
                <p className="text-gray-600">Schedule your first mentoring session to get started.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="goals" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold text-gray-900">Mentee Goals</h2>
            <Button className="bg-purple-600 hover:bg-purple-700 text-white" onClick={() => setShowAddGoal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Goal
            </Button>
          </div>
          <div className="text-center p-8 text-gray-500">No goals set yet</div>
        </TabsContent>

        <TabsContent value="projects" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold text-gray-900">Project Ideas</h2>
            <div className="text-sm text-gray-600">
              {projectIdeas.length} project{projectIdeas.length !== 1 ? 's' : ''} assigned
            </div>
          </div>

          <div className="space-y-4">
            {projectIdeas.map((project) => (
              <Card key={project.id} className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-gray-900 text-lg">{project.title}</h3>
                        <Badge variant="outline">{project.category}</Badge>
                        <Badge 
                          variant="secondary"
                          className={`${
                            project.difficulty_level === 'Beginner' ? 'bg-green-100 text-green-800' :
                            project.difficulty_level === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}
                        >
                          {project.difficulty_level}
                        </Badge>
                        {!project.mentor_review_notes && (
                          <Badge className="bg-orange-500 text-white animate-pulse">
                            NEW
                          </Badge>
                        )}
                      </div>
                      <p className="text-gray-600 mb-3">{project.description}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                        <span className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {project.estimated_time || 'Not specified'}
                        </span>
                        <span className="flex items-center">
                          <User className="w-4 h-4 mr-1" />
                          {project.student.name}
                        </span>
                        <span>Submitted: {new Date(project.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  {project.skills_involved && (
                    <div className="mb-4">
                      <p className="text-sm font-medium mb-2">Skills Involved:</p>
                      <div className="flex flex-wrap gap-2">
                        {project.skills_involved.split(',').map((skill: string, idx: number) => (
                          <Badge key={idx} variant="secondary" className="bg-blue-50 text-blue-700">
                            {skill.trim()}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {project.mentor_review_notes ? (
                    <div className="bg-gray-50 p-3 rounded-lg mb-4">
                      <p className="text-sm font-medium text-gray-900 mb-1">Review Status:</p>
                      <p className="text-sm text-gray-700">{project.mentor_review_notes}</p>
                    </div>
                  ) : (
                    <div className="bg-orange-50 border border-orange-200 p-3 rounded-lg mb-4">
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-orange-500 rounded-full mr-2 animate-pulse"></div>
                        <p className="text-sm font-medium text-orange-800">New Project Request - Awaiting Review</p>
                      </div>
                    </div>
                  )}

                  {(project.literature_review_date || project.prototype_demo_date) && (
                    <div className="bg-blue-50 p-3 rounded-lg mb-4">
                      <p className="text-sm font-medium text-blue-900 mb-2">Project Timeline:</p>
                      {project.literature_review_date && (
                        <div className="flex items-center gap-2 text-sm text-blue-700 mb-1">
                          <Calendar className="w-4 h-4" />
                          Literature Review: {new Date(project.literature_review_date).toLocaleDateString()}
                        </div>
                      )}
                      {project.prototype_demo_date && (
                        <div className="flex items-center gap-2 text-sm text-blue-700">
                          <Calendar className="w-4 h-4" />
                          Prototype Demo: {new Date(project.prototype_demo_date).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      className="bg-green-600 hover:bg-green-700 text-white"
                      onClick={() => openProjectModal(project, 'approve')}
                    >
                      <ThumbsUp className="w-4 h-4 mr-2" />
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-600 border-red-600 hover:bg-red-50"
                      onClick={() => handleDirectReject(project)}
                    >
                      <ThumbsDown className="w-4 h-4 mr-2" />
                      Reject
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-blue-600 border-blue-600 hover:bg-blue-50"
                      onClick={() => openProjectModal(project, 'review')}
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      Review
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {projectIdeas.length === 0 && (
            <Card className="border-0 shadow-lg">
              <CardContent className="p-12 text-center">
                <Lightbulb className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No project ideas assigned</h3>
                <p className="text-gray-600 mb-4">Students will send you project ideas for review and guidance.</p>
                <Button 
                  onClick={async () => {
                    try {
                      const response = await fetch('http://localhost:8000/api/debug/project-ideas/');
                      const data = await response.json();
                      console.log('Debug project ideas:', data);
                      alert(`Found ${data.total_projects} total projects in database`);
                    } catch (error) {
                      console.error('Debug error:', error);
                    }
                  }}
                  variant="outline"
                  size="sm"
                >
                  Debug: Check All Projects
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="requests" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold text-gray-900">Mentee Requests</h2>
            <div className="text-sm text-gray-600">
              {pendingRequests} pending request{pendingRequests !== 1 ? 's' : ''}
            </div>
          </div>

          <div className="space-y-4">
            {menteeRequests.map((request) => (
              <Card key={request.id} className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-4">
                      <Avatar className="h-16 w-16 border-2 border-gray-200">
                        <AvatarImage src={request.avatar || '/api/placeholder/80/80'} />
                        <AvatarFallback className="bg-gray-600 text-white text-lg">
                          {request.student_name && typeof request.student_name === 'string' && request.student_name.trim() ? 
                            request.student_name.split(' ').filter((n: string) => n).map((n: string) => n.charAt(0)).join('').substring(0, 2) : 
                            'NA'
                          }
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold text-gray-900 text-lg">{request.student_name || 'Unknown'}</h3>
                            <p className="text-gray-600 text-sm">{request.major || 'N/A'} • {request.year || 'N/A'}</p>
                            <p className="text-gray-500 text-sm">{request.university || 'N/A'}</p>
                          </div>
                          <Badge variant="outline" className={request.status === 'pending' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' : request.status === 'accepted' ? 'bg-green-100 text-green-800 border-green-200' : 'bg-red-100 text-red-800 border-red-200'}>
                            {(request.status || 'unknown').charAt(0).toUpperCase() + (request.status || 'unknown').slice(1)}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                          <span className="flex items-center">
                            <MapPin className="w-4 h-4 mr-1" />
                            {request.location || 'N/A'}
                          </span>
                          <span>Requested: {new Date(request.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-800 p-4 mb-4 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">Message</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{request.message}</p>
                  </div>

                  {request.status === 'pending' && (
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white"
                        onClick={() => acceptRequest(request)}
                      >
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Accept
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 border-red-600 hover:bg-red-50"
                        onClick={() => rejectRequest(request.id)}
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Reject
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {menteeRequests.length === 0 && (
            <Card className="border-0 shadow-lg">
              <CardContent className="p-12 text-center">
                <UserPlus className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No requests</h3>
                <p className="text-gray-600">New mentee requests will appear here for review.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="booking" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold text-gray-900">Booking Requests</h2>
            <div className="text-sm text-gray-600">
              {pendingBookingRequests} pending request{pendingBookingRequests !== 1 ? 's' : ''}
            </div>
          </div>

          <div className="space-y-4">
            {bookingRequests.map((request: any) => (
              <Card key={request.id} className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-4">
                      <Avatar className="h-16 w-16 border-2 border-gray-200">
                        <AvatarImage src={request.student_avatar || '/api/placeholder/80/80'} />
                        <AvatarFallback className="bg-gray-600 text-white text-lg">
                          {request.student_name && typeof request.student_name === 'string' && request.student_name.trim() ? 
                            request.student_name.split(' ').filter((n: string) => n).map((n: string) => n.charAt(0)).join('').substring(0, 2) : 
                            'NA'
                          }
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold text-gray-900 text-lg">{request.student_name || 'Unknown'}</h3>
                            <p className="text-gray-600 text-sm">{request.topic}</p>
                            <p className="text-gray-500 text-sm">Preferred: {new Date(request.preferred_date_time).toLocaleString()}</p>
                          </div>
                          <Badge variant="outline" className={request.status === 'pending' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' : request.status === 'accepted' ? 'bg-green-100 text-green-800 border-green-200' : 'bg-red-100 text-red-800 border-red-200'}>
                            {(request.status || 'unknown').charAt(0).toUpperCase() + (request.status || 'unknown').slice(1)}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                          <span>Requested: {new Date(request.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-800 p-4 mb-4 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">Message</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{request.message || 'No message'}</p>
                  </div>

                  {request.status === 'pending' && (
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white"
                        onClick={async () => {
                          try {
                            await acceptBooking(request.id);
                            setBookingRequests(prev => prev.map(req => req.id === request.id ? { ...req, status: 'accepted' } : req));
                          } catch (err) {
                            console.error('Error accepting booking:', err);
                          }
                        }}
                      >
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Accept
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 border-red-600 hover:bg-red-50"
                        onClick={async () => {
                          try {
                            await rejectBooking(request.id);
                            setBookingRequests(prev => prev.map(req => req.id === request.id ? { ...req, status: 'rejected' } : req));
                          } catch (err) {
                            console.error('Error rejecting booking:', err);
                          }
                        }}
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Reject
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {bookingRequests.length === 0 && (
            <Card className="border-0 shadow-lg">
              <CardContent className="p-12 text-center">
                <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No booking requests</h3>
                <p className="text-gray-600">New session booking requests will appear here for review.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={showMessageModal} onOpenChange={setShowMessageModal}>
        <DialogContent className="max-w-md w-full max-h-[90vh] h-[600px] p-0 flex flex-col">
          <div className="bg-green-600 text-white p-4 flex items-center space-x-3 flex-shrink-0">
            <Avatar className="h-10 w-10">
              <AvatarImage src={selectedMenteeForMessage?.avatar} />
              <AvatarFallback className="bg-gray-600 text-white">
                {selectedMenteeForMessage?.name.split(' ').map((n: string) => n.charAt(0)).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold truncate">{selectedMenteeForMessage?.name}</h3>
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
              <div key={message.id} className={`flex ${message.sender_type === 'mentor' ? 'justify-end' : 'justify-start'}`}>
                <div className={`rounded-lg ${message.sender_type === 'mentor' ? 'bg-green-600 text-white rounded-tr-none' : 'bg-white text-gray-800 rounded-tl-none'} px-4 py-2 max-w-xs shadow-sm`}>
                  <p className="text-sm">{message.content}</p>
                  <p className={`text-xs mt-1 ${message.sender_type === 'mentor' ? 'text-green-100' : 'text-gray-500'}`}>
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
                      if (messageForm.message.trim() && selectedMenteeForMessage) {
                        try {
                          const mentorId = parseInt(localStorage.getItem('mentorId') || '5');
                          const messageData = {
                            content: messageForm.message,
                            sender_type: 'mentor' as const,
                            sender_id: mentorId,
                            receiver_id: parseInt(selectedMenteeForMessage.id)
                          };
                          const response = await sendMessage(messageData);
                          setMessages(prev => {
                            const newMessage = response.data;
                            const exists = prev.some(m => m.id === newMessage.id && m.timestamp === newMessage.timestamp);
                            if (!exists) {
                              return [...prev, newMessage].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
                            }
                            return prev;
                          });
                          setMessageForm({ message: '' });
                        } catch (err) {
                          console.error('Error sending message:', err);
                        }
                      }
                    }
                  }}
                />
              </div>
              <Button
                className="bg-green-600 hover:bg-green-700 text-white rounded-full w-10 h-10 p-0 flex-shrink-0"
                onClick={sendMessageToMentee}
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showFeedbackModal} onOpenChange={setShowFeedbackModal}>
        <DialogContent className="max-w-md w-full">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-400" />
              {isViewMode ? 'View Feedback' : 'Give Feedback'} – {selectedMenteeForFeedback?.name}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="flex flex-col items-center">
              <label className="mb-2 text-sm font-medium text-gray-700">
                Rating <span className="text-red-500">*</span>
              </label>
              <StarRating
                rating={feedbackForm.rating}
                onChange={isViewMode ? undefined : (v) => setFeedbackForm(p => ({ ...p, rating: v }))}
              />
              <p className="mt-1 text-sm text-gray-500">
                {feedbackForm.rating} / 5 stars
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Review
              </label>
              <Textarea
                placeholder="Write your feedback..."
                rows={4}
                value={feedbackForm.review}
                onChange={isViewMode ? undefined : (e) => setFeedbackForm(p => ({ ...p, review: e.target.value }))}
                disabled={isViewMode}
              />
            </div>

            <div className="flex space-x-2">
              <Button
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
                onClick={isViewMode ? () => setIsViewMode(false) : submitFeedback}
                disabled={!isViewMode && feedbackForm.rating === 0}
              >
                {isViewMode ? 'Edit Feedback' : 'Submit Feedback'}
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowFeedbackModal(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showAddGoal} onOpenChange={setShowAddGoal}>
        <DialogContent className="max-w-md w-full">
          <DialogHeader>
            <DialogTitle>Add New Goal</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Goal Title</label>
              <Input placeholder="e.g., Complete project milestone" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <Textarea placeholder="Describe the goal..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
              <Input type="date" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Mentee</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select mentee" />
                </SelectTrigger>
                <SelectContent>
                  {mentees.map((mentee) => (
                    <SelectItem key={mentee.id} value={mentee.id}>
                      {mentee.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex space-x-2 pt-4">
              <Button className="flex-1 bg-purple-600 hover:bg-purple-700 text-white">
                Add Goal
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowAddGoal(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showMenteeDetails} onOpenChange={setShowMenteeDetails}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Mentee Details</DialogTitle>
          </DialogHeader>
          {selectedMentee && (
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <Avatar className="h-16 w-16 border-2 border-gray-200">
                  <AvatarImage src={selectedMentee.avatar} />
                  <AvatarFallback className="bg-gray-600 text-white text-lg">
                    {selectedMentee.name.split(' ').map((n: string) => n.charAt(0)).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedMentee.name}</h2>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span>{selectedMentee.major} • {selectedMentee.year}</span>
                    <Badge variant="outline" className={getStatusColor(selectedMentee.status)}>
                      {selectedMentee.status}
                    </Badge>
                  </div>
                  <p className="text-gray-500 text-sm">{selectedMentee.university}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Mentee Information</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Email:</span>
                        <span className="font-medium">{selectedMentee.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Location:</span>
                        <span className="font-medium">{selectedMentee.location}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Joined:</span>
                        <span className="font-medium">{new Date(selectedMentee.joinedDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Last Active:</span>
                        <span className="font-medium">{new Date(selectedMentee.lastActive).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Progress</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Overall Progress:</span>
                        <span className="font-medium">{selectedMentee.progress.overall}%</span>
                      </div>
                      <Progress value={selectedMentee.progress.overall} className="h-2" />
                      <div className="flex justify-between">
                        <span className="text-gray-600">Sessions Completed:</span>
                        <span className="font-medium">{selectedMentee.progress.sessionsCompleted}/{selectedMentee.progress.totalSessions}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Goals Achieved:</span>
                        <span className="font-medium">{selectedMentee.progress.goalsAchieved}/{selectedMentee.progress.totalGoals}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedMentee.skills.length > 0 ? (
                    selectedMentee.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary">{skill}</Badge>
                    ))
                  ) : (
                    <p className="text-gray-600">No skills listed</p>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Recent Activity</h3>
                <div className="space-y-2">
                  {selectedMentee.recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                      <span className="text-gray-900">{activity}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <Button
                  className="bg-green-600 hover:bg-green-700 text-white relative"
                  onClick={() => openMessageModal(selectedMentee)}
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Send Message
                  {unreadMessages[selectedMentee.id] > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold animate-pulse shadow-lg">
                      {unreadMessages[selectedMentee.id]}
                    </span>
                  )}
                </Button>
                <Button variant="outline">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={showProjectModal} onOpenChange={setShowProjectModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5" />
              {projectAction === 'approve' ? 'Approve' : projectAction === 'reject' ? 'Reject' : 'Review'} Project: {selectedProject?.title}
            </DialogTitle>
          </DialogHeader>
          
          {selectedProject && (
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Project Details</h4>
                <p className="text-sm text-gray-700 mb-2">{selectedProject.description}</p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>Category: {selectedProject.category}</span>
                  <span>Difficulty: {selectedProject.difficulty_level}</span>
                  <span>Student: {selectedProject.student.name}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Literature Review Date
                  </label>
                  <Input
                    type="date"
                    value={projectForm.literature_review_date}
                    onChange={(e) => setProjectForm(prev => ({ ...prev, literature_review_date: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prototype Demo Date
                  </label>
                  <Input
                    type="date"
                    value={projectForm.prototype_demo_date}
                    onChange={(e) => setProjectForm(prev => ({ ...prev, prototype_demo_date: e.target.value }))}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Review Notes
                </label>
                <Textarea
                  rows={4}
                  placeholder={`Add your ${projectAction} notes here...`}
                  value={projectForm.mentor_review_notes}
                  onChange={(e) => setProjectForm(prev => ({ ...prev, mentor_review_notes: e.target.value }))}
                />
              </div>

              <div className="flex space-x-2 pt-4">
                <Button
                  className={`flex-1 ${
                    projectAction === 'approve' ? 'bg-green-600 hover:bg-green-700' :
                    projectAction === 'reject' ? 'bg-red-600 hover:bg-red-700' :
                    'bg-blue-600 hover:bg-blue-700'
                  } text-white`}
                  onClick={handleProjectAction}
                >
                  {projectAction === 'approve' ? 'Approve Project' :
                   projectAction === 'reject' ? 'Reject Project' :
                   'Submit Review'}
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowProjectModal(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={showProjectsModal} onOpenChange={setShowProjectsModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FolderOpen className="w-5 h-5" />
              {selectedMenteeForProjects?.name}'s Projects
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {studentProjects.length === 0 ? (
              <div className="text-center py-8">
                <FolderOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No projects uploaded</h3>
                <p className="text-gray-600">This student hasn't uploaded any projects yet.</p>
              </div>
            ) : (
              studentProjects.map((project) => (
                <Card key={project.id} className="border-0 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-gray-900 text-lg">{project.title}</h3>
                          <Badge variant="outline">{project.category}</Badge>
                          <Badge 
                            variant="secondary" 
                            className={`${
                              project.status === 'Under Review' ? 'bg-yellow-100 text-yellow-800' :
                              project.status === 'Approved' ? 'bg-green-100 text-green-800' :
                              'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {project.status}
                          </Badge>
                          {project.rating && (
                            <Badge className="bg-purple-100 text-purple-800">
                              ★ {project.rating}/5
                            </Badge>
                          )}
                        </div>
                        <p className="text-gray-600 mb-3">{project.description}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                          <span>Uploaded: {new Date(project.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    {project.technologies.length > 0 && (
                      <div className="mb-4">
                        <p className="text-sm font-medium mb-2">Technologies:</p>
                        <div className="flex flex-wrap gap-2">
                          {project.technologies.map((tech: string, idx: number) => (
                            <Badge key={idx} variant="secondary" className="bg-blue-50 text-blue-700">
                              {tech.trim()}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {project.additional_notes && (
                      <div className="mb-4">
                        <p className="text-sm font-medium mb-2">Additional Notes:</p>
                        <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">{project.additional_notes}</p>
                      </div>
                    )}

                    {project.mentor_feedback && (
                      <div className="mb-4">
                        <p className="text-sm font-medium mb-2">Your Feedback:</p>
                        <p className="text-sm text-gray-700 bg-green-50 p-3 rounded-lg border border-green-200">{project.mentor_feedback}</p>
                      </div>
                    )}

                    <div className="flex gap-2 flex-wrap">
                      <Button variant="outline" onClick={() => window.open(project.github_url, '_blank')}>
                        <Github className="w-4 h-4 mr-2" />
                        View Code
                      </Button>
                      {project.live_url && (
                        <Button variant="outline" onClick={() => window.open(project.live_url, '_blank')}>
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Live Demo
                        </Button>
                      )}
                      <Button 
                        className="bg-purple-600 hover:bg-purple-700 text-white"
                        onClick={() => openProjectFeedbackModal(project)}
                      >
                        <Star className="w-4 h-4 mr-2" />
                        {project.mentor_feedback ? 'Update Feedback' : 'Give Feedback'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showProjectFeedbackModal} onOpenChange={setShowProjectFeedbackModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Star className="w-5 h-5 text-purple-600" />
              Project Feedback: {selectedProjectForFeedback?.title}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Project Details</h4>
              <p className="text-sm text-gray-700 mb-2">{selectedProjectForFeedback?.description}</p>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span>Category: {selectedProjectForFeedback?.category}</span>
                <span>Uploaded: {selectedProjectForFeedback?.created_at ? new Date(selectedProjectForFeedback.created_at).toLocaleDateString() : ''}</span>
              </div>
            </div>

            <div className="flex flex-col items-center">
              <label className="mb-2 text-sm font-medium text-gray-700">
                Rating (Optional)
              </label>
              <StarRating
                rating={projectFeedbackForm.rating}
                onChange={(v) => setProjectFeedbackForm(p => ({ ...p, rating: v }))}
              />
              <p className="mt-1 text-sm text-gray-500">
                {projectFeedbackForm.rating} / 5 stars
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Feedback *
              </label>
              <Textarea
                rows={4}
                placeholder="Provide detailed feedback on the project..."
                value={projectFeedbackForm.feedback}
                onChange={(e) => setProjectFeedbackForm(p => ({ ...p, feedback: e.target.value }))}
              />
            </div>

            <div className="flex space-x-2 pt-4">
              <Button
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
                onClick={submitProjectFeedbackHandler}
                disabled={!projectFeedbackForm.feedback.trim()}
              >
                Submit Feedback
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowProjectFeedbackModal(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}