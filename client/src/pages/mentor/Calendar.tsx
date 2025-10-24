import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { getMentorSessions, scheduleSession } from '@/lib/api';
import {
  Calendar as CalendarIcon,
  Clock,
  Plus,
  ChevronLeft,
  ChevronRight,
  Video,
  MapPin,
  Edit,
  Trash2,
  Lock,
} from 'lucide-react';
import { format, parseISO, addHours, parse } from 'date-fns';

interface Session {
  id: string;
  menteeId: string;
  menteeName: string;
  menteeAvatar: string;
  topic: string;
  date: string; // yyyy-MM-dd format
  startTime: string; // HH:mm format
  endTime: string; // HH:mm format
  duration: number;
  status: 'scheduled' | 'completed' | 'cancelled' | 'accepted' | 'pending' | 'rejected';
  type: 'virtual' | 'in_person';
  location?: string;
  meetingLink?: string;
  meetingId?: string;
  passcode?: string;
  notes?: string;
}

export default function MentorCalendar() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [view, setView] = useState<'month' | 'week' | 'day'>('month');
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);
  const [acceptedBookings, setAcceptedBookings] = useState([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [scheduleForm, setScheduleForm] = useState({
    bookingId: 0,
    scheduledDate: '',
    scheduledTime: '',
    meetingLink: '',
    meetingId: '',
    passcode: '',
  });

  const fetchData = async () => {
    const mentorId = parseInt(localStorage.getItem('mentorId') || '5');
    try {
      const sessionsResponse = await getMentorSessions(mentorId);

      const mappedSessions = sessionsResponse.data.map((booking: any) => {
        const dateTime = booking.scheduled_date_time || booking.preferred_date_time;
        const date = dateTime ? dateTime.split('T')[0] : new Date().toISOString().split('T')[0];
        const startTime = dateTime ? dateTime.split('T')[1].substring(0, 5) : '00:00';
        // Parse startTime and add 1 hour to get endTime
        const startDateTime = parse(`${date} ${startTime}`, 'yyyy-MM-dd HH:mm', new Date());
        const endDateTime = addHours(startDateTime, 1);
        const endTime = format(endDateTime, 'HH:mm');

        return {
          id: booking.id.toString(),
          menteeId: booking.student_id.toString(),
          menteeName: booking.student_name || 'Unknown Student',
          menteeAvatar: '/api/placeholder/40/40',
          topic: booking.topic,
          date,
          startTime,
          endTime,
          duration: 60, // Fixed to 60 minutes
          status: booking.status as 'scheduled' | 'completed' | 'cancelled' | 'accepted' | 'pending' | 'rejected',
          type: 'virtual' as const,
          location: booking.location,
          meetingLink: booking.meeting_link,
          meetingId: booking.meeting_id,
          passcode: booking.passcode,
          notes: booking.message,
        };
      });
      setSessions(mappedSessions);
      setAcceptedBookings(sessionsResponse.data.filter((booking: any) => booking.status === 'accepted'));

      // Debugging: Log sessions with explicit type
      console.log(
        'Fetched sessions:',
        mappedSessions.map((s: Session) => ({
          id: s.id,
          date: s.date,
          startTime: s.startTime,
          endTime: s.endTime,
        }))
      );
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getSessionsForDate = (date: Date) => {
    const dateString = format(date, 'yyyy-MM-dd');
    // Debugging: Log selected date and session dates
    console.log('Selected date:', dateString, 'Raw Date:', date);
    console.log('Session dates:', sessions.map(s => s.date));
    return sessions.filter(session => session.date === dateString);
  };

  const getSessionsForSelectedDate = () => {
    if (!selectedDate) return [];
    return getSessionsForDate(selectedDate);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'accepted':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatTime = (time: string) => {
    return time; // Return HH:mm directly
  };

  const handleSchedule = async () => {
    if (!scheduleForm.bookingId || scheduleForm.bookingId === 0 || !scheduleForm.scheduledDate || !scheduleForm.scheduledTime) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const scheduledDateTime = `${scheduleForm.scheduledDate}T${scheduleForm.scheduledTime}:00Z`;
      await scheduleSession(scheduleForm.bookingId, {
        scheduled_date_time: scheduledDateTime,
        meeting_link: scheduleForm.meetingLink || null,
        meeting_id: scheduleForm.meetingId || null,
        passcode: scheduleForm.passcode || null,
      });

      await fetchData();
      setShowScheduleDialog(false);
      setScheduleForm({
        bookingId: 0,
        scheduledDate: '',
        scheduledTime: '',
        meetingLink: '',
        meetingId: '',
        passcode: '',
      });
      alert('Session scheduled successfully!');
    } catch (err: any) {
      console.error('Error scheduling session:', err);
      const errorMessage = err.response?.data?.error || err.message || 'Failed to schedule session. Please try again.';
      alert(errorMessage);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 bg-white text-gray-900">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Calendar</h1>
          <p className="text-gray-600 mt-1">Manage your mentoring schedule and appointments</p>
        </div>
        <div className="flex items-center space-x-3">
          <Select value={view} onValueChange={(value: 'month' | 'week' | 'day') => setView(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">Month</SelectItem>
              <SelectItem value="week">Week</SelectItem>
              <SelectItem value="day">Day</SelectItem>
            </SelectContent>
          </Select>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => setShowScheduleDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Schedule Session
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Calendar */}
        <div className="lg:col-span-2">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center">
                  <CalendarIcon className="w-5 h-5 mr-2 text-blue-600" />
                  {selectedDate ? format(selectedDate, 'MMMM yyyy') : 'Select a month'}
                </span>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (selectedDate) {
                        const prevMonth = new Date(selectedDate);
                        prevMonth.setMonth(selectedDate.getMonth() - 1);
                        setSelectedDate(prevMonth);
                      }
                    }}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedDate(new Date())}
                  >
                    Today
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (selectedDate) {
                        const nextMonth = new Date(selectedDate);
                        nextMonth.setMonth(selectedDate.getMonth() + 1);
                        setSelectedDate(nextMonth);
                      }
                    }}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => {
                  if (date) {
                    setSelectedDate(date);
                    console.log('Selected calendar date:', format(date, 'yyyy-MM-dd'), 'Raw:', date);
                  }
                }}
                className="w-full"
                modifiers={{
                  hasSession: sessions.map(session => parseISO(session.date)),
                }}
                modifiersClassNames={{
                  hasSession: 'bg-blue-50 text-blue-900 font-semibold',
                }}
              />
            </CardContent>
          </Card>
        </div>

        {/* Selected Date Sessions */}
        <div className="space-y-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="w-5 h-5 mr-2 text-green-600" />
                {selectedDate
                  ? format(selectedDate, 'EEEE, MMMM d')
                  : 'Select a date'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {getSessionsForSelectedDate().length > 0 ? (
                <div className="space-y-4">
                  {getSessionsForSelectedDate().map((session) => (
                    <div key={session.id} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={session.menteeAvatar} />
                            <AvatarFallback className="bg-gray-600 text-white text-xs">
                              {session.menteeName.split(' ').map((n: string) => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-medium text-gray-900 text-sm">{session.topic}</h4>
                            <p className="text-xs text-gray-600">with {session.menteeName}</p>
                          </div>
                        </div>
                        <Badge variant="outline" className={getStatusColor(session.status)}>
                          {session.status}
                        </Badge>
                      </div>

                      <div className="space-y-2 text-xs text-gray-600">
                        <div className="flex items-center">
                          <Clock className="w-3 h-3 mr-2" />
                          {formatTime(session.startTime)} - {formatTime(session.endTime)}
                        </div>
                        {session.location && (
                          <div className="flex items-center">
                            <MapPin className="w-3 h-3 mr-2" />
                            {session.location}
                          </div>
                        )}
                        {session.meetingId && (
                          <div className="flex items-center">
                            <Video className="w-3 h-3 mr-2" />
                            Meeting ID: {session.meetingId}
                          </div>
                        )}
                        {session.passcode && (
                          <div className="flex items-center">
                            <Lock className="w-3 h-3 mr-2" />
                            Passcode: {session.passcode}
                          </div>
                        )}
                      </div>

                      <div className="flex space-x-2 mt-3">
                        {session.status === 'scheduled' && session.meetingLink && (
                          <a
                            href={session.meetingLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                          >
                            <Video className="w-3 h-3 mr-1" />
                            Join Meeting
                          </a>
                        )}
                        <Button variant="ghost" size="sm">
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CalendarIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">No sessions scheduled</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-3"
                    onClick={() => setShowScheduleDialog(true)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Schedule Session
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg">This Month</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Sessions</span>
                <span className="font-semibold">{sessions.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Completed</span>
                <span className="font-semibold text-green-600">
                  {sessions.filter(s => s.status === 'completed').length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Scheduled</span>
                <span className="font-semibold text-blue-600">
                  {sessions.filter(s => s.status === 'scheduled').length}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Schedule Session Dialog */}
      <Dialog open={showScheduleDialog} onOpenChange={setShowScheduleDialog}>
        <DialogContent className="max-w-2xl bg-white text-gray-900">
          <DialogHeader>
            <DialogTitle>Schedule New Session</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Student</label>
              <Select
                value={scheduleForm.bookingId === 0 ? '' : scheduleForm.bookingId.toString()}
                onValueChange={(value) => setScheduleForm(prev => ({ ...prev, bookingId: parseInt(value) }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose a student to schedule session with" />
                </SelectTrigger>
                <SelectContent className="max-h-48 overflow-y-auto">
                  {acceptedBookings.map((req: any) => (
                    <SelectItem key={req.id} value={req.id.toString()}>
                      {req.student_name || 'Unknown Student'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Scheduled Date</label>
              <Input
                type="date"
                value={scheduleForm.scheduledDate}
                onChange={(e) => setScheduleForm(prev => ({ ...prev, scheduledDate: e.target.value }))}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Scheduled Time</label>
              <Input
                type="time"
                value={scheduleForm.scheduledTime}
                onChange={(e) => setScheduleForm(prev => ({ ...prev, scheduledTime: e.target.value }))}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Meeting Link (optional)</label>
              <Input
                type="url"
                placeholder="https://zoom.us/..."
                value={scheduleForm.meetingLink}
                onChange={(e) => setScheduleForm(prev => ({ ...prev, meetingLink: e.target.value }))}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Meeting ID (optional)</label>
              <Input
                placeholder="123 456 7890"
                value={scheduleForm.meetingId}
                onChange={(e) => setScheduleForm(prev => ({ ...prev, meetingId: e.target.value }))}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Passcode (optional)</label>
              <Input
                placeholder="Passcode"
                value={scheduleForm.passcode}
                onChange={(e) => setScheduleForm(prev => ({ ...prev, passcode: e.target.value }))}
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowScheduleDialog(false)}>
                Cancel
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={handleSchedule}>
                Schedule Session
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}