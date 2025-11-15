import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
  IndianRupee,
  TrendingUp,
  TrendingDown,
  Calendar,
  Download,
  CreditCard,
  Banknote,
  PiggyBank,
  Receipt,
  Clock,
  CheckCircle,
  AlertCircle,
  BarChart3,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  Target,
  Award
} from 'lucide-react';

interface Payment {
  id: string;
  date: string;
  amount: number;
  status: 'completed' | 'pending' | 'failed';
  method: 'bank_transfer' | 'paypal' | 'stripe';
  description: string;
  sessionCount: number;
  period: string;
}

interface EarningsMetric {
  label: string;
  value: string;
  change: number;
  trend: 'up' | 'down' | 'stable';
  icon: React.ReactNode;
}

export default function Earnings() {
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('30d');

  const [payments, setPayments] = useState<Payment[]>([
    {
      id: '1',
      date: '2024-01-31',
      amount: 450.00,
      status: 'completed',
      method: 'bank_transfer',
      description: 'Mentoring sessions - January 2024',
      sessionCount: 12,
      period: 'Jan 1-31, 2024'
    },
    {
      id: '2',
      date: '2024-01-15',
      amount: 380.00,
      status: 'completed',
      method: 'bank_transfer',
      description: 'Mentoring sessions - January 1-15, 2024',
      sessionCount: 10,
      period: 'Jan 1-15, 2024'
    },
    {
      id: '3',
      date: '2024-02-15',
      amount: 520.00,
      status: 'pending',
      method: 'bank_transfer',
      description: 'Mentoring sessions - February 2024',
      sessionCount: 14,
      period: 'Feb 1-15, 2024'
    },
    {
      id: '4',
      date: '2023-12-31',
      amount: 420.00,
      status: 'completed',
      method: 'paypal',
      description: 'Mentoring sessions - December 2023',
      sessionCount: 11,
      period: 'Dec 1-31, 2023'
    },
    {
      id: '5',
      date: '2023-11-30',
      amount: 395.00,
      status: 'completed',
      method: 'bank_transfer',
      description: 'Mentoring sessions - November 2023',
      sessionCount: 9,
      period: 'Nov 1-30, 2023'
    }
  ]);

  const earningsMetrics: EarningsMetric[] = [
    {
      label: 'Total Earnings',
      value: '₹3,52,750.00',
      change: 12.5,
      trend: 'up',
      icon: <IndianRupee className="w-5 h-5" />
    },
    {
      label: 'This Month',
      value: '₹43,160.00',
      change: 8.2,
      trend: 'up',
      icon: <Calendar className="w-5 h-5" />
    },
    {
      label: 'Avg. per Session',
      value: '₹3,112.50',
      change: -2.1,
      trend: 'down',
      icon: <Target className="w-5 h-5" />
    },
    {
      label: 'Pending Payout',
      value: '₹43,160.00',
      change: 0,
      trend: 'stable',
      icon: <Clock className="w-5 h-5" />
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'failed': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'failed': return <AlertCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'bank_transfer': return <Banknote className="w-4 h-4" />;
      case 'paypal': return <Wallet className="w-4 h-4" />;
      case 'stripe': return <CreditCard className="w-4 h-4" />;
      default: return <IndianRupee className="w-4 h-4" />;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <ArrowUpRight className="w-4 h-4 text-green-500" />;
      case 'down': return <ArrowDownRight className="w-4 h-4 text-red-500" />;
      default: return null;
    }
  };

  const totalEarnings = payments
    .filter(p => p.status === 'completed')
    .reduce((acc, p) => acc + p.amount, 0);

  const pendingAmount = payments
    .filter(p => p.status === 'pending')
    .reduce((acc, p) => acc + p.amount, 0);

  const monthlyData = [
    { month: 'Nov', earnings: 395 },
    { month: 'Dec', earnings: 420 },
    { month: 'Jan', earnings: 830 },
    { month: 'Feb', earnings: 520 }
  ];

  const sessionTypes = [
    { type: 'Career Guidance', amount: 1250, percentage: 29.4 },
    { type: 'Technical Mentoring', amount: 1450, percentage: 34.1 },
    { type: 'Resume Review', amount: 850, percentage: 20.0 },
    { type: 'Interview Prep', amount: 700, percentage: 16.5 }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Earnings</h1>
          <p className="text-gray-600 mt-1">Track your mentoring earnings and payment history</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">₹{(totalEarnings * 83).toFixed(2)}</div>
            <div className="text-xs text-gray-400">Total Earned</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">₹{(pendingAmount * 83).toFixed(2)}</div>
            <div className="text-xs text-gray-400">Pending</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {payments.filter(p => p.status === 'completed').length}
            </div>
            <div className="text-sm text-gray-500">Payments</div>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="payments">Payment History</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Earnings Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {earningsMetrics.map((metric, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        {metric.icon}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">{metric.label}</p>
                        <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      {getTrendIcon(metric.trend)}
                      <span className={`text-sm font-medium ${
                        metric.trend === 'up' ? 'text-green-600' :
                        metric.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                      }`}>
                        {metric.change > 0 ? '+' : ''}{metric.change}%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Monthly Earnings Chart */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
                  Monthly Earnings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {monthlyData.map((data, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{data.month} 2024</span>
                      <div className="flex items-center space-x-3 flex-1 ml-4">
                        <Progress value={(data.earnings / 1000) * 100} className="flex-1 h-2" />
                        <span className="text-sm font-medium w-16">₹{(data.earnings * 83).toFixed(0)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Earnings by Category */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PieChart className="w-5 h-5 mr-2 text-green-600" />
                  Earnings by Category
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sessionTypes.map((type, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{type.type}</span>
                      <div className="flex items-center space-x-2">
                        <Progress value={type.percentage} className="w-20 h-2" />
                        <span className="text-sm text-gray-600 w-12">{type.percentage}%</span>
                        <span className="text-sm font-medium w-16">₹{(type.amount * 83).toFixed(0)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Payments */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Receipt className="w-5 h-5 mr-2 text-purple-600" />
                Recent Payments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {payments.slice(0, 3).map((payment) => (
                  <div key={payment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-white rounded-lg">
                        {getMethodIcon(payment.method)}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{payment.description}</h4>
                        <p className="text-sm text-gray-600">{payment.period}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">₹{(payment.amount * 83).toFixed(2)}</p>
                        <p className="text-sm text-gray-600">{payment.sessionCount} sessions</p>
                      </div>
                      <Badge variant="outline" className={getStatusColor(payment.status)}>
                        {getStatusIcon(payment.status)}
                        <span className="ml-1 capitalize">{payment.status}</span>
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payment History Tab */}
        <TabsContent value="payments" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold text-gray-900">Payment History</h2>
            <div className="flex items-center space-x-2">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 3 months</SelectItem>
                  <SelectItem value="1y">Last year</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            {payments.map((payment) => (
              <Card key={payment.id} className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-gray-100 rounded-lg">
                        {getMethodIcon(payment.method)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{payment.description}</h3>
                        <p className="text-sm text-gray-600">{payment.period}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900">${payment.amount.toFixed(2)}</p>
                        <p className="text-sm text-gray-600">{payment.sessionCount} sessions</p>
                      </div>
                      <Badge variant="outline" className={getStatusColor(payment.status)}>
                        {getStatusIcon(payment.status)}
                        <span className="ml-1 capitalize">{payment.status}</span>
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
                    <div>
                      <p className="text-sm text-gray-600">Payment Date</p>
                      <p className="font-medium">{new Date(payment.date).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Payment Method</p>
                      <p className="font-medium capitalize">{payment.method.replace('_', ' ')}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Reference ID</p>
                      <p className="font-medium font-mono text-sm">{payment.id}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Earnings Trends */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
                  Earnings Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">Earnings trend chart will be displayed here</p>
                  <p className="text-sm text-gray-500 mt-2">Showing earnings over time</p>
                </div>
              </CardContent>
            </Card>

            {/* Payout Schedule */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PiggyBank className="w-5 h-5 mr-2 text-green-600" />
                  Payout Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Next Payout</h4>
                  <p className="text-blue-700">February 15, 2024</p>
                  <p className="text-sm text-blue-600 mt-1">$520.00 pending</p>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Payout Method</span>
                    <span className="font-medium">Bank Transfer</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Processing Time</span>
                    <span className="font-medium">2-3 business days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Minimum Payout</span>
                    <span className="font-medium">$50.00</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Performance Goals */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Award className="w-5 h-5 mr-2 text-yellow-600" />
                Earnings Goals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900 mb-2">$5,000</div>
                  <div className="text-sm text-gray-600 mb-3">Monthly Goal</div>
                  <Progress value={83} className="h-2" />
                  <div className="text-xs text-gray-500 mt-1">83% complete</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900 mb-2">$50,000</div>
                  <div className="text-sm text-gray-600 mb-3">Yearly Goal</div>
                  <Progress value={68} className="h-2" />
                  <div className="text-xs text-gray-500 mt-1">68% complete</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900 mb-2">$100</div>
                  <div className="text-sm text-gray-600 mb-3">Avg. Session Rate</div>
                  <Progress value={75} className="h-2" />
                  <div className="text-xs text-gray-500 mt-1">75% complete</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
