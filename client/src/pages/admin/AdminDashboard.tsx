import { Switch, Route } from "wouter";
import { Users as UsersIcon, CheckCircle, BarChart3, FileText, Megaphone, Shield, Settings } from "lucide-react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import AdminUsers from "./Users";
import Approvals from "./Approvals";
import AdminAnalytics from "./AdminAnalytics";
import Reports from "./Reports";
import Announcements from "./Announcements";
import AuditLogs from "./AuditLogs";
import AdminSettings from "./AdminSettings";

const menuItems = [
  { id: 'users', label: 'Users', icon: <UsersIcon />, path: '/dashboard/admin' },
  { id: 'approvals', label: 'Approvals', icon: <CheckCircle />, path: '/dashboard/admin/approvals' },
  { id: 'analytics', label: 'Analytics', icon: <BarChart3 />, path: '/dashboard/admin/analytics' },
  { id: 'reports', label: 'Reports', icon: <FileText />, path: '/dashboard/admin/reports' },
  { id: 'announcements', label: 'Announcements', icon: <Megaphone />, path: '/dashboard/admin/announcements' },
  { id: 'audit-logs', label: 'Audit Logs', icon: <Shield />, path: '/dashboard/admin/audit-logs' },
  { id: 'settings', label: 'Settings', icon: <Settings />, path: '/dashboard/admin/settings' },
];

export default function AdminDashboard() {
  const getCurrentPage = (path: string) => {
    if (path === '/dashboard/admin' || path === '/dashboard/admin/') return 'users';
    const segments = path.split('/');
    return segments[segments.length - 1] || 'users';
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
            <AdminUsers />
          </DashboardLayout>
        )}
      </Route>
      <Route path="/dashboard/admin/approvals">
        {() => (
          <DashboardLayout
            title="Approvals"
            subtitle="Admin Dashboard"
            menuItems={menuItems}
            currentPage={getCurrentPage(window.location.pathname)}
          >
            <Approvals />
          </DashboardLayout>
        )}
      </Route>
      <Route path="/dashboard/admin/analytics">
        {() => (
          <DashboardLayout
            title="Analytics"
            subtitle="Admin Dashboard"
            menuItems={menuItems}
            currentPage={getCurrentPage(window.location.pathname)}
          >
            <AdminAnalytics />
          </DashboardLayout>
        )}
      </Route>
      <Route path="/dashboard/admin/reports">
        {() => (
          <DashboardLayout
            title="Reports"
            subtitle="Admin Dashboard"
            menuItems={menuItems}
            currentPage={getCurrentPage(window.location.pathname)}
          >
            <Reports />
          </DashboardLayout>
        )}
      </Route>
      <Route path="/dashboard/admin/announcements">
        {() => (
          <DashboardLayout
            title="Announcements"
            subtitle="Admin Dashboard"
            menuItems={menuItems}
            currentPage={getCurrentPage(window.location.pathname)}
          >
            <Announcements />
          </DashboardLayout>
        )}
      </Route>
      <Route path="/dashboard/admin/audit-logs">
        {() => (
          <DashboardLayout
            title="Audit Logs"
            subtitle="Admin Dashboard"
            menuItems={menuItems}
            currentPage={getCurrentPage(window.location.pathname)}
          >
            <AuditLogs />
          </DashboardLayout>
        )}
      </Route>
      <Route path="/dashboard/admin/settings">
        {() => (
          <DashboardLayout
            title="Settings"
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
