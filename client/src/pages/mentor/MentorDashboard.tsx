import { Switch, Route } from "wouter";
import { Calendar as CalendarIcon, Users, Clock, MessageSquare, Star, BookOpen, DollarSign, Settings } from "lucide-react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import Today from "./Today";
import Mentees from "./Mentees";
import MentorCalendar from "./Calendar";
import Sessions from "./Sessions";
import Feedback from "./Feedback";
import Resources from "./Resources";
import Earnings from "./Earnings";
import MentorSettings from "./Settings";

const menuItems = [
  { id: 'today', label: 'Today', icon: <CalendarIcon />, path: '/dashboard/mentor' },
  { id: 'mentees', label: 'Mentees', icon: <Users />, path: '/dashboard/mentor/mentees' },
  { id: 'calendar', label: 'Calendar', icon: <CalendarIcon />, path: '/dashboard/mentor/calendar' },
  { id: 'sessions', label: 'Sessions', icon: <Clock />, path: '/dashboard/mentor/sessions' },
  { id: 'feedback', label: 'Feedback', icon: <Star />, path: '/dashboard/mentor/feedback' },
  { id: 'resources', label: 'Resources', icon: <BookOpen />, path: '/dashboard/mentor/resources' },
  { id: 'earnings', label: 'Earnings', icon: <DollarSign />, path: '/dashboard/mentor/earnings' },
  { id: 'settings', label: 'Settings', icon: <Settings />, path: '/dashboard/mentor/settings' },
];

export default function MentorDashboard() {
  const getCurrentPage = (path: string) => {
    if (path === '/dashboard/mentor' || path === '/dashboard/mentor/') return 'today';
    const segments = path.split('/');
    return segments[segments.length - 1] || 'today';
  };

  return (
    <Switch>
      <Route path="/dashboard/mentor">
        {() => (
          <DashboardLayout
            title="Welcome, Dr. Johnson!"
            subtitle="Mentor Dashboard"
            menuItems={menuItems}
            currentPage={getCurrentPage(window.location.pathname)}
          >
            <Today />
          </DashboardLayout>
        )}
      </Route>
      <Route path="/dashboard/mentor/mentees">
        {() => (
          <DashboardLayout
            title="My Mentees"
            subtitle="Mentor Dashboard"
            menuItems={menuItems}
            currentPage={getCurrentPage(window.location.pathname)}
          >
            <Mentees />
          </DashboardLayout>
        )}
      </Route>
      <Route path="/dashboard/mentor/calendar">
        {() => (
          <DashboardLayout
            title="Calendar"
            subtitle="Mentor Dashboard"
            menuItems={menuItems}
            currentPage={getCurrentPage(window.location.pathname)}
          >
            <MentorCalendar />
          </DashboardLayout>
        )}
      </Route>
      <Route path="/dashboard/mentor/sessions">
        {() => (
          <DashboardLayout
            title="Sessions"
            subtitle="Mentor Dashboard"
            menuItems={menuItems}
            currentPage={getCurrentPage(window.location.pathname)}
          >
            <Sessions />
          </DashboardLayout>
        )}
      </Route>
      <Route path="/dashboard/mentor/feedback">
        {() => (
          <DashboardLayout
            title="Feedback"
            subtitle="Mentor Dashboard"
            menuItems={menuItems}
            currentPage={getCurrentPage(window.location.pathname)}
          >
            <Feedback />
          </DashboardLayout>
        )}
      </Route>
      <Route path="/dashboard/mentor/resources">
        {() => (
          <DashboardLayout
            title="Resources"
            subtitle="Mentor Dashboard"
            menuItems={menuItems}
            currentPage={getCurrentPage(window.location.pathname)}
          >
            <Resources />
          </DashboardLayout>
        )}
      </Route>
      <Route path="/dashboard/mentor/earnings">
        {() => (
          <DashboardLayout
            title="Earnings"
            subtitle="Mentor Dashboard"
            menuItems={menuItems}
            currentPage={getCurrentPage(window.location.pathname)}
          >
            <Earnings />
          </DashboardLayout>
        )}
      </Route>
      <Route path="/dashboard/mentor/settings">
        {() => (
          <DashboardLayout
            title="Settings"
            subtitle="Mentor Dashboard"
            menuItems={menuItems}
            currentPage={getCurrentPage(window.location.pathname)}
          >
            <MentorSettings />
          </DashboardLayout>
        )}
      </Route>
    </Switch>
  );
}
