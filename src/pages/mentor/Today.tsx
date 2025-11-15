import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Calendar,
  Users,
  Clock,
  Star,
  MessageSquare,
  Plus,
  ChevronRight,
  Activity,
  Target,
  Award,
  Zap,
  BarChart3,
  Video,
  Mail,
  BookOpen
} from 'lucide-react';

interface UpcomingSession {
  id: string;
  menteeName: string;
  menteeAvatar: string;
  topic: string;
  date: string;
  time: string;
  duration: number;
}

interface RecentActivity {
  id: string;
  type: 'session_completed' | 'feedback_received' | 'goal_achieved' | 'message_sent';
  menteeName: string;
  description: string;
  timestamp: string;
}

export default function Today() {
  const [upcomingSessions] = useState<UpcomingSession[]>([]);

  const [recentActivities] = useState<RecentActivity[]>([]);

  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [sessionForm, setSessionForm] = useState({
    menteeId: '',
    topic: '',
    date: '',
    time: '',
    duration: '60',
    type: 'virtual',
    location: '',
    notes: ''
  });

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'session_completed': return <Video className="w-4 h-4 text-green-500" />;
      case 'feedback_received': return <Star className="w-4 h-4 text-yellow-500" />;
      case 'goal_achieved': return <Award className="w-4 h-4 text-purple-500" />;
      case 'message_sent': return <Mail className="w-4 h-4 text-blue-500" />;
      default: return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Good morning, Dr. Johnson!</h1>
          <p className="text-gray-600 mt-1">Here's your mentoring overview for today</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => setShowScheduleModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Schedule Session
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600 mb-1">Active Mentees</p>
                <p className="text-3xl font-bold text-blue-900">12</p>
                <p className="text-xs text-blue-600 mt-1">+2 from last month</p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

      {/* Schedule Session Modal */}
      <Dialog open={showScheduleModal} onOpenChange={setShowScheduleModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Schedule New Session</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mentee</label>
              <Select
                value={sessionForm.menteeId}
                onValueChange={(value) => setSessionForm(prev => ({ ...prev, menteeId: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select mentee" />
                </SelectTrigger>
                <SelectContent>
                  {/* No items unless real mentee data is added */}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Topic</label>
              <Input
                type="text"
                value={sessionForm.topic}
                onChange={(e) => setSessionForm(prev => ({ ...prev, topic: e.target.value }))}
                placeholder="Enter session topic"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <Input
                  type="date"
                  value={sessionForm.date}
                  onChange={(e) => setSessionForm(prev => ({ ...prev, date: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                <Input
                  type="time"
                  value={sessionForm.time}
                  onChange={(e) => setSessionForm(prev => ({ ...prev, time: e.target.value }))}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
              <Input
                type="number"
                min={15}
                max={180}
                value={sessionForm.duration}
                onChange={(e) => setSessionForm(prev => ({ ...prev, duration: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <Select
                value={sessionForm.type}
                onValueChange={(value) => setSessionForm(prev => ({ ...prev, type: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="virtual">Virtual</SelectItem>
                  <SelectItem value="in_person">In Person</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {sessionForm.type === 'in_person' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <Input
                  type="text"
                  value={sessionForm.location}
                  onChange={(e) => setSessionForm(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="Enter location"
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <Textarea
                rows={3}
                value={sessionForm.notes}
                onChange={(e) => setSessionForm(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Additional notes (optional)"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowScheduleModal(false)}>
                Cancel
              </Button>
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => {
                  alert(`Scheduled session with mentee ID ${sessionForm.menteeId} on ${sessionForm.date} at ${sessionForm.time}`);
                  setShowScheduleModal(false);
                }}
              >
                Schedule
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600 mb-1">Sessions This Week</p>
                <p className="text-3xl font-bold text-green-900">8</p>
                <p className="text-xs text-green-600 mt-1">5 completed, 3 scheduled</p>
              </div>
              <Clock className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-yellow-50 to-yellow-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-600 mb-1">Average Rating</p>
                <p className="text-3xl font-bold text-yellow-900">4.8</p>
                <p className="text-xs text-yellow-600 mt-1">Based on 45 reviews</p>
              </div>
              <Star className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600 mb-1">Goals Achieved</p>
                <p className="text-3xl font-bold text-purple-900">23</p>
                <p className="text-xs text-purple-600 mt-1">This month</p>
              </div>
              <Target className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upcoming Sessions */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-blue-600" />
                Upcoming Sessions
              </span>
              <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                View All
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingSessions.length === 0 ? (
              <div className="text-center text-gray-500 py-6">
                No upcoming sessions.
              </div>
            ) : (
              upcomingSessions.map((session) => (
                <div key={session.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={session.menteeAvatar} />
                    <AvatarFallback className="bg-gray-600 text-white text-sm">
                      {session.menteeName.split(' ').map((n: string) => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{session.topic}</h4>
                    <p className="text-sm text-gray-600">with {session.menteeName}</p>
                    <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                      <span className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {new Date(session.date).toLocaleDateString()}
                      </span>
                      <span className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {session.time} ({session.duration}min)
                      </span>
                    </div>
                  </div>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Video className="w-4 h-4 mr-2" />
                    Join
                  </Button>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center">
                <Activity className="w-5 h-5 mr-2 text-green-600" />
                Recent Activity
              </span>
              <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-700">
                View All
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivities.length === 0 ? (
              <div className="text-center text-gray-500 py-6">
                No recent activities.
              </div>
            ) : (
              recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="mt-0.5">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                    <p className="text-xs text-gray-600">{activity.menteeName} • {activity.timestamp}</p>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Zap className="w-5 h-5 mr-2 text-orange-600" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2 hover:bg-blue-50 hover:border-blue-200">
              <Calendar className="w-6 h-6 text-blue-600" />
              <span className="text-sm font-medium">Schedule Session</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2 hover:bg-green-50 hover:border-green-200">
              <MessageSquare className="w-6 h-6 text-green-600" />
              <span className="text-sm font-medium">Message Mentees</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2 hover:bg-purple-50 hover:border-purple-200">
              <BarChart3 className="w-6 h-6 text-purple-600" />
              <span className="text-sm font-medium">View Analytics</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2 hover:bg-orange-50 hover:border-orange-200">
              <BookOpen className="w-6 h-6 text-orange-600" />
              <span className="text-sm font-medium">Access Resources</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
