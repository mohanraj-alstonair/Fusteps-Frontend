import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Users,
  CheckCircle,
  TrendingUp,
  Target,
  Activity,
  Calendar,
  Video,
  MessageSquare,
  BarChart3,
  Zap,
  Award,
  Clock,
  UserCheck,
  Heart,
  BookOpen,
  Star,
  ChevronRight
} from 'lucide-react';
import { api, withRole } from '@/lib/api';

interface OverviewStats {
  totalUsers: number;
  activeUsers: number;
  totalSessions: number;
  completedSessions: number;
  totalGoals: number;
  completedGoals: number;
  avgProgress: number;
  recentActivities: Array<{
    id: string;
    userName: string;
    userAvatar: string;
    action: string;
    timestamp: string;
  }>;
  upcomingSessions: Array<{
    id: string;
    title: string;
    menteeName: string;
    date: string;
    time: string;
  }>;
}

export default function AdminOverview() {
  const [stats, setStats] = useState<OverviewStats>({
    totalUsers: 0,
    activeUsers: 0,
    totalSessions: 0,
    completedSessions: 0,
    totalGoals: 0,
    completedGoals: 0,
    avgProgress: 0,
    recentActivities: [],
    upcomingSessions: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOverviewData();
  }, []);

  const fetchOverviewData = async () => {
    try {
      const response = await api.get("/admin/overview", withRole("admin"));
      setStats({
        totalUsers: response.data?.totalUsers ?? 0,
        activeUsers: response.data?.activeUsers ?? 0,
        totalSessions: response.data?.totalSessions ?? 0,
        completedSessions: response.data?.completedSessions ?? 0,
        totalGoals: response.data?.totalGoals ?? 0,
        completedGoals: response.data?.completedGoals ?? 0,
        avgProgress: response.data?.avgProgress ?? 0,
        recentActivities: response.data?.recentActivities ?? [],
        upcomingSessions: response.data?.upcomingSessions ?? []
      });
    } catch (error) {
      console.error('Error fetching overview data:', error);
      // Set default values for demo
      setStats({
        totalUsers: 1250,
        activeUsers: 892,
        totalSessions: 3456,
        completedSessions: 2890,
        totalGoals: 2156,
        completedGoals: 1456,
        avgProgress: 73,
        recentActivities: [
          {
            id: '1',
            userName: 'Alex Thompson',
            userAvatar: '/api/placeholder/80/80',
            action: 'Completed React project review',
            timestamp: '2 hours ago'
          },
          {
            id: '2',
            userName: 'Sarah Chen',
            userAvatar: '/api/placeholder/80/80',
            action: 'Published research paper',
            timestamp: '4 hours ago'
          },
          {
            id: '3',
            userName: 'Marcus Johnson',
            userAvatar: '/api/placeholder/80/80',
            action: 'Joined business club',
            timestamp: '6 hours ago'
          }
        ],
        upcomingSessions: [
          {
            id: '1',
            title: 'React Performance Optimization',
            menteeName: 'Alex Thompson',
            date: '2024-02-05',
            time: '14:00'
          },
          {
            id: '2',
            title: 'Career Planning & Job Search',
            menteeName: 'Sarah Chen',
            date: '2024-02-08',
            time: '10:00'
          }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading overview...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Overview</h1>
          <p className="text-gray-600 mt-1">Platform-wide insights and key metrics at a glance</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.activeUsers}</div>
            <div className="text-sm text-gray-500">Active Users</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{stats.completedSessions}</div>
            <div className="text-sm text-gray-500">Sessions Completed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{stats.avgProgress}%</div>
            <div className="text-sm text-gray-500">Avg Progress</div>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-blue-500 rounded-lg">
                <Users className="h-5 w-5 text-white" />
              </div>
              <Badge variant="outline" className="bg-blue-100 text-blue-700">Total</Badge>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{stats.totalUsers.toLocaleString()}</p>
              <p className="text-sm text-blue-600 dark:text-blue-400">Total Users</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-green-500 rounded-lg">
                <CheckCircle className="h-5 w-5 text-white" />
              </div>
              <Badge variant="outline" className="bg-green-100 text-green-700">Completed</Badge>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-green-900 dark:text-green-100">{stats.completedSessions.toLocaleString()}</p>
              <p className="text-sm text-green-600 dark:text-green-400">Sessions Done</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-purple-500 rounded-lg">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <Badge variant="outline" className="bg-purple-100 text-purple-700">Progress</Badge>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">{stats.avgProgress}%</p>
              <p className="text-sm text-purple-600 dark:text-purple-400">Average Progress</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950 dark:to-amber-900">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-amber-500 rounded-lg">
                <Target className="h-5 w-5 text-white" />
              </div>
              <Badge variant="outline" className="bg-amber-100 text-amber-700">Goals</Badge>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-amber-900 dark:text-amber-100">{stats.completedGoals}/{stats.totalGoals}</p>
              <p className="text-sm text-amber-600 dark:text-amber-400">Goals Achieved</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity & Upcoming Sessions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="h-5 w-5 mr-2 text-blue-600" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={activity.userAvatar} />
                    <AvatarFallback className="bg-gray-600 text-white text-xs">
                      {activity.userName.split(' ').map((n: string) => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{activity.userName}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{activity.action}</p>
                    <p className="text-xs text-gray-500">{activity.timestamp}</p>
                  </div>
                </div>
              ))}
              {stats.recentActivities.length === 0 && (
                <div className="text-center py-8">
                  <Activity className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500">No recent activity</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-green-600" />
              Upcoming Sessions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.upcomingSessions.map((session) => (
                <div key={session.id} className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-green-500 rounded-lg">
                      <Video className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{session.title}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">with {session.menteeName}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {new Date(session.date).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-gray-500">
                      {session.time}
                    </p>
                  </div>
                </div>
              ))}
              {stats.upcomingSessions.length === 0 && (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500">No upcoming sessions</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Zap className="h-5 w-5 mr-2 text-indigo-600" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Button className="h-20 flex flex-col items-center justify-center space-y-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border-0">
              <Users className="h-6 w-6" />
              <span className="text-sm font-medium">Manage Users</span>
            </Button>
            <Button className="h-20 flex flex-col items-center justify-center space-y-2 bg-green-50 hover:bg-green-100 text-green-700 border-0">
              <CheckCircle className="h-6 w-6" />
              <span className="text-sm font-medium">Review Approvals</span>
            </Button>
            <Button className="h-20 flex flex-col items-center justify-center space-y-2 bg-purple-50 hover:bg-purple-100 text-purple-700 border-0">
              <BarChart3 className="h-6 w-6" />
              <span className="text-sm font-medium">View Analytics</span>
            </Button>
            <Button className="h-20 flex flex-col items-center justify-center space-y-2 bg-amber-50 hover:bg-amber-100 text-amber-700 border-0">
              <MessageSquare className="h-6 w-6" />
              <span className="text-sm font-medium">Send Announcement</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
