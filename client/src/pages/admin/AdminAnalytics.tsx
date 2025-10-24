import { useState, useEffect } from 'react';
import { BarChart3, Users, Activity, TrendingUp, Calendar, Eye, MessageSquare, Award, Download, ArrowUpIcon, ArrowDownIcon, Target, Zap, Globe, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { api, withRole } from '@/lib/api';

interface AnalyticsData {
  totalUsers: number;
  activeUsers: number;
  newSignups: number;
  revenue: number;
  totalSessions: number;
  pageViews: number;
  avgSessionDuration: number;
  bounceRate: number;
  topPages: Array<{ page: string; views: number }>;
  userGrowth: Array<{ date: string; users: number }>;
  revenueGrowth: Array<{ date: string; amount: number }>;
}

export default function AdminAnalytics() {
  const [data, setData] = useState<AnalyticsData>({
    totalUsers: 0,
    activeUsers: 0,
    newSignups: 0,
    revenue: 0,
    totalSessions: 0,
    pageViews: 0,
    avgSessionDuration: 0,
    bounceRate: 0,
    topPages: [],
    userGrowth: [],
    revenueGrowth: []
  });
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      const response = await api.get(`/admin/analytics?range=${timeRange}`, withRole("admin"));
      setData({
        totalUsers: response.data?.totalUsers ?? 0,
        activeUsers: response.data?.activeUsers ?? 0,
        newSignups: response.data?.newSignups ?? 0,
        revenue: response.data?.revenue ?? 0,
        totalSessions: response.data?.totalSessions ?? 0,
        pageViews: response.data?.pageViews ?? 0,
        avgSessionDuration: response.data?.avgSessionDuration ?? 0,
        bounceRate: response.data?.bounceRate ?? 0,
        topPages: response.data?.topPages ?? [],
        userGrowth: response.data?.userGrowth ?? [],
        revenueGrowth: response.data?.revenueGrowth ?? []
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
      // Keep default values
    } finally {
      setLoading(false);
    }
  };

  const exportAnalytics = () => {
    // Implementation for exporting analytics data
    console.log('Exporting analytics data...');
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading analytics...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Platform Analytics</h1>
          <p className="text-gray-600">Comprehensive insights into user behavior and platform performance</p>
        </div>
        <div className="flex space-x-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={exportAnalytics}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-8">
          {/* Key Performance Indicators */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-semibold text-blue-700 dark:text-blue-300">Total Users</CardTitle>
                <div className="p-2 bg-blue-500 rounded-lg">
                  <Users className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-900 dark:text-blue-100 mb-2">{data.totalUsers.toLocaleString()}</div>
                <div className="flex items-center text-xs text-blue-600 dark:text-blue-400">
                  <ArrowUpIcon className="h-3 w-3 mr-1" />
                  +12.5% from last month
                </div>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-semibold text-green-700 dark:text-green-300">Active Users</CardTitle>
                <div className="p-2 bg-green-500 rounded-lg">
                  <Activity className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-900 dark:text-green-100 mb-2">{data.activeUsers.toLocaleString()}</div>
                <div className="flex items-center text-xs text-green-600 dark:text-green-400">
                  <ArrowUpIcon className="h-3 w-3 mr-1" />
                  +8.2% from last month
                </div>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-semibold text-purple-700 dark:text-purple-300">Page Views</CardTitle>
                <div className="p-2 bg-purple-500 rounded-lg">
                  <Eye className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-900 dark:text-purple-100 mb-2">{data.pageViews.toLocaleString()}</div>
                <div className="flex items-center text-xs text-purple-600 dark:text-purple-400">
                  <ArrowUpIcon className="h-3 w-3 mr-1" />
                  +15.3% from last month
                </div>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950 dark:to-amber-900">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-semibold text-amber-700 dark:text-amber-300">Revenue</CardTitle>
                <div className="p-2 bg-amber-500 rounded-lg">
                  <DollarSign className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-amber-900 dark:text-amber-100 mb-2">${data.revenue.toLocaleString()}</div>
                <div className="flex items-center text-xs text-amber-600 dark:text-amber-400">
                  <ArrowUpIcon className="h-3 w-3 mr-1" />
                  +6.1% from last month
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Performance Metrics Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold">Session Analytics</CardTitle>
                  <div className="p-2 bg-slate-100 rounded-lg">
                    <Zap className="h-5 w-5 text-slate-600" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Total Sessions</span>
                  <span className="font-semibold text-lg">{data.totalSessions.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Avg. Duration</span>
                  <span className="font-semibold text-lg">{Math.round(data.avgSessionDuration)}m</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Session Quality</span>
                    <span>85%</span>
                  </div>
                  <Progress value={85} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold">Engagement Rate</CardTitle>
                  <div className="p-2 bg-emerald-100 rounded-lg">
                    <Target className="h-5 w-5 text-emerald-600" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-emerald-600 mb-1">73.2%</div>
                  <p className="text-sm text-slate-600">User engagement rate</p>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Job Applications</span>
                    <Badge variant="secondary">1,234</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Profile Views</span>
                    <Badge variant="secondary">856</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Mentorship Sessions</span>
                    <Badge variant="secondary">432</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold">Bounce Rate</CardTitle>
                  <div className="p-2 bg-red-100 rounded-lg">
                    <Globe className="h-5 w-5 text-red-600" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-600 mb-1">{data.bounceRate.toFixed(1)}%</div>
                  <p className="text-sm text-slate-600">Single page visits</p>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Improvement</span>
                    <span className="text-green-600">-2.1%</span>
                  </div>
                  <Progress value={68} className="h-2" />
                </div>
                <div className="text-xs text-slate-500 mt-2">
                  Target: Below 70%
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Insights */}
          <Card className="border-0 shadow-lg bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-slate-600" />
                Quick Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-1">+24%</div>
                  <p className="text-sm text-slate-600">User growth this quarter</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-1">4.8/5</div>
                  <p className="text-sm text-slate-600">Average user satisfaction</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-1">98.5%</div>
                  <p className="text-sm text-slate-600">Platform uptime</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-8">
          {/* User Analytics Header */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold text-gray-900">User Analytics</h3>
              <p className="text-gray-600 mt-1">Detailed insights into user behavior and demographics</p>
            </div>
            <Badge variant="outline" className="px-3 py-1">
              {data.totalUsers.toLocaleString()} Total Users
            </Badge>
          </div>

          {/* User Growth & Demographics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
                  User Growth Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 rounded-lg flex items-center justify-center border-2 border-dashed border-blue-200 dark:border-blue-800">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 text-blue-400 mx-auto mb-3" />
                    <p className="text-blue-600 dark:text-blue-400 font-medium">Growth Chart</p>
                    <p className="text-sm text-blue-500 dark:text-blue-500 mt-1">Interactive chart will be displayed here</p>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-lg font-bold text-blue-600">+24%</div>
                    <div className="text-xs text-gray-600">This Quarter</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-green-600">+12%</div>
                    <div className="text-xs text-gray-600">This Month</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-purple-600">+8%</div>
                    <div className="text-xs text-gray-600">This Week</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2 text-green-600" />
                  User Demographics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="text-sm font-medium">Students</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-bold">65%</span>
                      <Badge variant="secondary" className="text-xs">4,225</Badge>
                    </div>
                  </div>
                  <Progress value={65} className="h-2" />

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                      <span className="text-sm font-medium">Employers</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-bold">20%</span>
                      <Badge variant="secondary" className="text-xs">1,300</Badge>
                    </div>
                  </div>
                  <Progress value={20} className="h-2" />

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm font-medium">Mentors</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-bold">10%</span>
                      <Badge variant="secondary" className="text-xs">650</Badge>
                    </div>
                  </div>
                  <Progress value={10} className="h-2" />

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                      <span className="text-sm font-medium">Alumni</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-bold">5%</span>
                      <Badge variant="secondary" className="text-xs">325</Badge>
                    </div>
                  </div>
                  <Progress value={5} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* User Activity Insights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-950 dark:to-indigo-900">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-indigo-500 rounded-lg">
                    <Activity className="h-5 w-5 text-white" />
                  </div>
                  <Badge variant="outline" className="bg-indigo-100 text-indigo-700">Daily</Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-2xl font-bold text-indigo-900 dark:text-indigo-100">1,247</p>
                  <p className="text-sm text-indigo-600 dark:text-indigo-400">Active Today</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950 dark:to-emerald-900">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-emerald-500 rounded-lg">
                    <MessageSquare className="h-5 w-5 text-white" />
                  </div>
                  <Badge variant="outline" className="bg-emerald-100 text-emerald-700">Weekly</Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">8,432</p>
                  <p className="text-sm text-emerald-600 dark:text-emerald-400">Messages Sent</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-rose-50 to-rose-100 dark:from-rose-950 dark:to-rose-900">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-rose-500 rounded-lg">
                    <Award className="h-5 w-5 text-white" />
                  </div>
                  <Badge variant="outline" className="bg-rose-100 text-rose-700">Monthly</Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-2xl font-bold text-rose-900 dark:text-rose-100">156</p>
                  <p className="text-sm text-rose-600 dark:text-rose-400">Achievements</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="engagement" className="space-y-8">
          {/* Engagement Header */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold text-gray-900">Engagement Analytics</h3>
              <p className="text-gray-600 mt-1">Track user interaction and platform engagement metrics</p>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="px-3 py-1 bg-green-50 text-green-700 border-green-200">
                73.2% Engagement Rate
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center">
                  <Eye className="h-5 w-5 mr-2 text-cyan-600" />
                  Top Pages Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.topPages.slice(0, 5).map((page, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                          index === 0 ? 'bg-yellow-100 text-yellow-800' :
                          index === 1 ? 'bg-gray-100 text-gray-800' :
                          index === 2 ? 'bg-orange-100 text-orange-800' :
                          'bg-slate-100 text-slate-600'
                        }`}>
                          {index + 1}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{page.page}</p>
                          <p className="text-xs text-gray-500">Page views</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{page.views.toLocaleString()}</p>
                        <p className="text-xs text-gray-500">views</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center">
                  <Target className="h-5 w-5 mr-2 text-emerald-600" />
                  Engagement Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">1,234</div>
                    <div className="text-xs text-blue-600 dark:text-blue-400">Job Applications</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 dark:bg-purple-950 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-1">856</div>
                    <div className="text-xs text-purple-600 dark:text-purple-400">Mentorship Sessions</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1">432</div>
                    <div className="text-xs text-green-600 dark:text-green-400">Event Registrations</div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 dark:bg-orange-950 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600 dark:text-orange-400 mb-1">78%</div>
                    <div className="text-xs text-orange-600 dark:text-orange-400">Profile Completions</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Overall Engagement</span>
                    <span className="text-sm font-bold text-emerald-600">73.2%</span>
                  </div>
                  <Progress value={73.2} className="h-2" />
                  <p className="text-xs text-gray-500">Target: 75%</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Activity Timeline */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="h-5 w-5 mr-2 text-indigo-600" />
                Recent Activity Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-indigo-50 dark:bg-indigo-950 rounded-lg">
                  <div className="text-xl font-bold text-indigo-600 dark:text-indigo-400 mb-1">2,847</div>
                  <div className="text-xs text-indigo-600 dark:text-indigo-400">Page Views Today</div>
                </div>
                <div className="text-center p-4 bg-cyan-50 dark:bg-cyan-950 rounded-lg">
                  <div className="text-xl font-bold text-cyan-600 dark:text-cyan-400 mb-1">156</div>
                  <div className="text-xs text-cyan-600 dark:text-cyan-400">New Signups Today</div>
                </div>
                <div className="text-center p-4 bg-pink-50 dark:bg-pink-950 rounded-lg">
                  <div className="text-xl font-bold text-pink-600 dark:text-pink-400 mb-1">89</div>
                  <div className="text-xs text-pink-600 dark:text-pink-400">Job Applications Today</div>
                </div>
                <div className="text-center p-4 bg-violet-50 dark:bg-violet-950 rounded-lg">
                  <div className="text-xl font-bold text-violet-600 dark:text-violet-400 mb-1">34</div>
                  <div className="text-xs text-violet-600 dark:text-violet-400">Mentorship Requests Today</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-8">
          {/* Revenue Header */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold text-gray-900">Revenue Analytics</h3>
              <p className="text-gray-600 mt-1">Monitor financial performance and revenue streams</p>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="px-3 py-1 bg-amber-50 text-amber-700 border-amber-200">
                ${data.revenue.toLocaleString()} Total Revenue
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2 text-amber-600" />
                  Revenue Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                      <div>
                        <p className="text-sm font-semibold text-blue-900 dark:text-blue-100">Premium Subscriptions</p>
                        <p className="text-xs text-blue-600 dark:text-blue-400">Monthly recurring revenue</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-blue-900 dark:text-blue-100">$12,450</p>
                      <p className="text-xs text-blue-600 dark:text-blue-400">48.2%</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                      <div>
                        <p className="text-sm font-semibold text-green-900 dark:text-green-100">Job Postings</p>
                        <p className="text-xs text-green-600 dark:text-green-400">One-time payments</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-green-900 dark:text-green-100">$8,320</p>
                      <p className="text-xs text-green-600 dark:text-green-400">32.1%</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
                      <div>
                        <p className="text-sm font-semibold text-purple-900 dark:text-purple-100">Event Sponsorships</p>
                        <p className="text-xs text-purple-600 dark:text-purple-400">Event-based revenue</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-purple-900 dark:text-purple-100">$3,210</p>
                      <p className="text-xs text-purple-600 dark:text-purple-400">12.4%</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 bg-gray-500 rounded-full"></div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">Other Revenue</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Miscellaneous sources</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900 dark:text-gray-100">$1,020</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">7.3%</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-emerald-600" />
                  Revenue Growth Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950 dark:to-emerald-900 rounded-lg flex items-center justify-center border-2 border-dashed border-emerald-200 dark:border-emerald-800">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 text-emerald-400 mx-auto mb-3" />
                    <p className="text-emerald-600 dark:text-emerald-400 font-medium">Revenue Growth Chart</p>
                    <p className="text-sm text-emerald-500 dark:text-emerald-500 mt-1">Interactive chart will be displayed here</p>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-lg font-bold text-emerald-600">+18%</div>
                    <div className="text-xs text-gray-600">Monthly Growth</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-blue-600">+32%</div>
                    <div className="text-xs text-gray-600">Quarterly Growth</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-purple-600">+45%</div>
                    <div className="text-xs text-gray-600">Annual Growth</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Financial KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950 dark:to-emerald-900">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-emerald-500 rounded-lg">
                    <DollarSign className="h-5 w-5 text-white" />
                  </div>
                  <Badge variant="outline" className="bg-emerald-100 text-emerald-700">MRR</Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">$15,670</p>
                  <p className="text-sm text-emerald-600 dark:text-emerald-400">Monthly Recurring Revenue</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-blue-500 rounded-lg">
                    <Users className="h-5 w-5 text-white" />
                  </div>
                  <Badge variant="outline" className="bg-blue-100 text-blue-700">ARPU</Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">$24.50</p>
                  <p className="text-sm text-blue-600 dark:text-blue-400">Average Revenue Per User</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950 dark:to-amber-900">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-amber-500 rounded-lg">
                    <Target className="h-5 w-5 text-white" />
                  </div>
                  <Badge variant="outline" className="bg-amber-100 text-amber-700">Churn</Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-2xl font-bold text-amber-900 dark:text-amber-100">3.2%</p>
                  <p className="text-sm text-amber-600 dark:text-amber-400">Monthly Churn Rate</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-rose-50 to-rose-100 dark:from-rose-950 dark:to-rose-900">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-rose-500 rounded-lg">
                    <Award className="h-5 w-5 text-white" />
                  </div>
                  <Badge variant="outline" className="bg-rose-100 text-rose-700">LTV</Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-2xl font-bold text-rose-900 dark:text-rose-100">$147.80</p>
                  <p className="text-sm text-rose-600 dark:text-rose-400">Customer Lifetime Value</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
