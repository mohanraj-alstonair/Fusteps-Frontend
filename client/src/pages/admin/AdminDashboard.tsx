import { Switch, Route } from "wouter";
import { Calendar as CalendarIcon, Users, Clock, MessageSquare, Star, BookOpen, DollarSign, Settings, Shield, BarChart3, UserCheck, AlertTriangle } from "lucide-react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import UsersPage from "./Users";
import Reports from "./Reports";
import Approvals from "./Approvals";
import AuditLogs from "./AuditLogs";
import AdminSettings from "./AdminSettings";
import Announcements from "./Announcements";

const menuItems = [
  { id: 'overview', label: 'Overview', icon: <BarChart3 />, path: '/dashboard/admin' },
  { id: 'users', label: 'Users', icon: <Users />, path: '/dashboard/admin/users' },
  { id: 'mentors', label: 'Mentors', icon: <UserCheck />, path: '/dashboard/admin/mentors' },
  { id: 'sessions', label: 'Sessions', icon: <Clock />, path: '/dashboard/admin/sessions' },
  { id: 'reports', label: 'Reports', icon: <BarChart3 />, path: '/dashboard/admin/reports' },
  { id: 'moderation', label: 'Moderation', icon: <Shield />, path: '/dashboard/admin/moderation' },
  { id: 'settings', label: 'Settings', icon: <Settings />, path: '/dashboard/admin/settings' },
];

const cardThemes = {
  student: {
    background: 'bg-gradient-to-br from-yellow-50 to-yellow-100',
    textColor: 'text-yellow-600',
    iconColor: 'text-yellow-600',
  },
  mentor: {
    background: 'bg-gradient-to-br from-blue-50 to-blue-100',
    textColor: 'text-blue-600',
    iconColor: 'text-blue-600',
  },
  admin: {
    background: 'bg-gradient-to-br from-purple-50 to-purple-100',
    textColor: 'text-purple-600',
    iconColor: 'text-purple-600',
  },
};

function getCardTheme(role: 'student' | 'mentor' | 'admin') {
  return cardThemes[role] || cardThemes.student;
}

function AdminOverview() {
  const theme = getCardTheme('admin');

  return (
    <div className="max-w-7xl mx-auto">
      <p className="text-ink-500 mb-8">Here's your admin overview for today.</p>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className={`bg-white rounded-2xl shadow-card p-6 border-l-4 border-purple-500`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-ink-500 text-sm">Total Users</p>
              <p className="text-2xl font-bold text-ink-900" data-testid="text-total-users">1,247</p>
              <p className="text-xs text-purple-600 mt-1">+12% from last month</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-purple-700" />
            </div>
          </div>
        </div>

        <div className={`bg-white rounded-2xl shadow-card p-6 border-l-4 border-blue-500`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-ink-500 text-sm">Active Sessions</p>
              <p className="text-2xl font-bold text-ink-900" data-testid="text-active-sessions">89</p>
              <p className="text-xs text-blue-600 mt-1">Currently in progress</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-blue-700" />
            </div>
          </div>
        </div>

        <div className={`bg-white rounded-2xl shadow-card p-6 border-l-4 border-green-500`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-ink-500 text-sm">Platform Health</p>
              <p className="text-2xl font-bold text-ink-900" data-testid="text-platform-health">98.5%</p>
              <p className="text-xs text-green-600 mt-1">Uptime this month</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-green-700" />
            </div>
          </div>
        </div>

        <div className={`bg-white rounded-2xl shadow-card p-6 border-l-4 border-red-500`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-ink-500 text-sm">Pending Reports</p>
              <p className="text-2xl font-bold text-ink-900" data-testid="text-pending-reports">7</p>
              <p className="text-xs text-red-600 mt-1">Require attention</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-700" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <div className="bg-white rounded-2xl shadow-card p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-display font-semibold text-ink-900">Recent Activity</h3>
            <button className="text-purple-700 hover:text-purple-900 text-sm font-semibold">View All</button>
          </div>

          <div className="space-y-4">
            {[
              { type: 'user', description: 'New user registered', user: 'John Smith', time: '5 minutes ago' },
              { type: 'session', description: 'Session completed', user: 'Sarah Chen', time: '1 hour ago' },
              { type: 'report', description: 'New moderation report', user: 'Marcus Johnson', time: '2 hours ago' },
              { type: 'mentor', description: 'Mentor application approved', user: 'Dr. Emily Rodriguez', time: '4 hours ago' }
            ].map((activity, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 border border-neutral-100 rounded-xl">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  {activity.type === 'user' && <Users className="w-4 h-4 text-purple-600" />}
                  {activity.type === 'session' && <Clock className="w-4 h-4 text-blue-600" />}
                  {activity.type === 'report' && <AlertTriangle className="w-4 h-4 text-red-600" />}
                  {activity.type === 'mentor' && <UserCheck className="w-4 h-4 text-green-600" />}
                </div>
                <div>
                  <p className="text-sm font-medium text-ink-900">{activity.description}</p>
                  <p className="text-xs text-ink-500">{activity.user} • {activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Status */}
        <div className="bg-white rounded-2xl shadow-card p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-display font-semibold text-ink-900">System Status</h3>
            <button className="text-purple-700 hover:text-purple-900 text-sm font-semibold">View Details</button>
          </div>

          <div className="space-y-4">
            {[
              { service: 'API Server', status: 'healthy', uptime: '99.9%', color: 'green' },
              { service: 'Database', status: 'healthy', uptime: '99.8%', color: 'green' },
              { service: 'File Storage', status: 'warning', uptime: '97.2%', color: 'yellow' },
              { service: 'Email Service', status: 'healthy', uptime: '99.5%', color: 'green' }
            ].map((service, index) => (
              <div key={index} className="flex items-center justify-between p-3 border border-neutral-100 rounded-xl">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    service.color === 'green' ? 'bg-green-500' :
                    service.color === 'yellow' ? 'bg-yellow-500' : 'bg-red-500'
                  }`}></div>
                  <div>
                    <p className="text-sm font-medium text-ink-900">{service.service}</p>
                    <p className="text-xs text-ink-500">{service.status}</p>
                  </div>
                </div>
                <span className="text-sm font-semibold text-ink-700">{service.uptime}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const getCurrentPage = (path: string) => {
    if (path === '/dashboard/admin' || path === '/dashboard/admin/') return 'overview';
    const segments = path.split('/');
    return segments[segments.length - 1] || 'overview';
  };

  return (
    <Switch>
      <Route path="/dashboard/admin">
        {() => (
          <DashboardLayout
            title="Welcome, Admin!"
            subtitle="Admin Dashboard"
            menuItems={menuItems}
            currentPage={getCurrentPage(window.location.pathname)}
          >
            <AdminOverview />
          </DashboardLayout>
        )}
      </Route>
      <Route path="/dashboard/admin/users">
        {() => (
          <DashboardLayout
            title="User Management"
            subtitle="Admin Dashboard"
            menuItems={menuItems}
            currentPage={getCurrentPage(window.location.pathname)}
          >
            <UsersPage />
          </DashboardLayout>
        )}
      </Route>
      <Route path="/dashboard/admin/mentors">
        {() => (
          <DashboardLayout
            title="Mentor Management"
            subtitle="Admin Dashboard"
            menuItems={menuItems}
            currentPage={getCurrentPage(window.location.pathname)}
          >
            <Approvals />
          </DashboardLayout>
        )}
      </Route>
      <Route path="/dashboard/admin/sessions">
        {() => (
          <DashboardLayout
            title="Session Monitoring"
            subtitle="Admin Dashboard"
            menuItems={menuItems}
            currentPage={getCurrentPage(window.location.pathname)}
          >
            <AuditLogs />
          </DashboardLayout>
        )}
      </Route>
      <Route path="/dashboard/admin/reports">
        {() => (
          <DashboardLayout
            title="Reports & Analytics"
            subtitle="Admin Dashboard"
            menuItems={menuItems}
            currentPage={getCurrentPage(window.location.pathname)}
          >
            <Reports />
          </DashboardLayout>
        )}
      </Route>
      <Route path="/dashboard/admin/moderation">
        {() => (
          <DashboardLayout
            title="Content Moderation"
            subtitle="Admin Dashboard"
            menuItems={menuItems}
            currentPage={getCurrentPage(window.location.pathname)}
          >
            <Announcements />
          </DashboardLayout>
        )}
      </Route>
      <Route path="/dashboard/admin/settings">
        {() => (
          <DashboardLayout
            title="System Settings"
            subtitle="Admin Dashboard"
            menuItems={menuItems}
            currentPage={getCurrentPage(window.location.pathname)}
          >
            <AdminSettings />
          </DashboardLayout>
        )}
      </Route>
    </Switch>
  );
}
