import { Switch, Route } from "wouter";
import { FileText, Users, Calendar, MessageSquare, BarChart3, Building, CreditCard } from "lucide-react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import Postings from "./Postings";
import Applicants from "./Applicants";
import Interviews from "./Interviews";
import Messages from "./Messages";
import Analytics from "./Analytics";
import CompanyProfile from "./CompanyProfile";
import Billing from "./Billing";
import EmployerSettings from "./Settings";

const menuItems = [
  { id: 'postings', label: 'Postings', icon: <FileText />, path: '/dashboard/employer' },
  { id: 'applicants', label: 'Applicants', icon: <Users />, path: '/dashboard/employer/applicants' },
  { id: 'interviews', label: 'Interviews', icon: <Calendar />, path: '/dashboard/employer/interviews' },
  { id: 'messages', label: 'Messages', icon: <MessageSquare />, path: '/dashboard/employer/messages' },
  { id: 'analytics', label: 'Analytics', icon: <BarChart3 />, path: '/dashboard/employer/analytics' },
  { id: 'company-profile', label: 'Company Profile', icon: <Building />, path: '/dashboard/employer/company-profile' },
  { id: 'billing', label: 'Billing', icon: <CreditCard />, path: '/dashboard/employer/billing' },
];

export default function EmployerDashboard() {
  const getCurrentPage = (path: string) => {
    if (path === '/dashboard/employer' || path === '/dashboard/employer/') return 'postings';
    const segments = path.split('/');
    return segments[segments.length - 1] || 'postings';
  };

  return (
    <Switch>
      <Route path="/dashboard/employer">
        {() => (
          <DashboardLayout
            title="Welcome, TechCorp HR!"
            subtitle="Employer Dashboard"
            menuItems={menuItems}
            currentPage={getCurrentPage(window.location.pathname)}
          >
            <Postings />
          </DashboardLayout>
        )}
      </Route>
      <Route path="/dashboard/employer/applicants">
        {() => (
          <DashboardLayout
            title="Applicants"
            subtitle="Employer Dashboard"
            menuItems={menuItems}
            currentPage={getCurrentPage(window.location.pathname)}
          >
            <Applicants />
          </DashboardLayout>
        )}
      </Route>
      <Route path="/dashboard/employer/interviews">
        {() => (
          <DashboardLayout
            title="Interviews"
            subtitle="Employer Dashboard"
            menuItems={menuItems}
            currentPage={getCurrentPage(window.location.pathname)}
          >
            <Interviews />
          </DashboardLayout>
        )}
      </Route>
      <Route path="/dashboard/employer/messages">
        {() => (
          <DashboardLayout
            title="Messages"
            subtitle="Employer Dashboard"
            menuItems={menuItems}
            currentPage={getCurrentPage(window.location.pathname)}
          >
            <Messages />
          </DashboardLayout>
        )}
      </Route>
      <Route path="/dashboard/employer/analytics">
        {() => (
          <DashboardLayout
            title="Analytics"
            subtitle="Employer Dashboard"
            menuItems={menuItems}
            currentPage={getCurrentPage(window.location.pathname)}
          >
            <Analytics />
          </DashboardLayout>
        )}
      </Route>
      <Route path="/dashboard/employer/company-profile">
        {() => (
          <DashboardLayout
            title="Company Profile"
            subtitle="Employer Dashboard"
            menuItems={menuItems}
            currentPage={getCurrentPage(window.location.pathname)}
          >
            <CompanyProfile />
          </DashboardLayout>
        )}
      </Route>
      <Route path="/dashboard/employer/billing">
        {() => (
          <DashboardLayout
            title="Billing"
            subtitle="Employer Dashboard"
            menuItems={menuItems}
            currentPage={getCurrentPage(window.location.pathname)}
          >
            <Billing />
          </DashboardLayout>
        )}
      </Route>
      <Route path="/dashboard/employer/settings">
        {() => (
          <DashboardLayout
            title="Settings"
            subtitle="Employer Dashboard"
            menuItems={menuItems}
            currentPage={getCurrentPage(window.location.pathname)}
          >
            <EmployerSettings />
          </DashboardLayout>
        )}
      </Route>
    </Switch>
  );
}
