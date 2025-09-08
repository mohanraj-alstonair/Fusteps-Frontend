import { Switch, Route } from "wouter";
import { BarChart3, Users, PlusCircle, Calendar, MessageSquare, TrendingUp, User } from "lucide-react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import Overview from "./Overview";
import Mentor from "./Mentor";
import PostOpportunity from "./PostOpportunity";
import Events from "./Events";
import Community from "./Community";
import Impact from "./Impact";
import AlumniProfile from "./AlumniProfile";

const menuItems = [
  { id: 'overview', label: 'Overview', icon: <BarChart3 />, path: '/dashboard/alumni' },
  { id: 'mentor', label: 'Mentor', icon: <Users />, path: '/dashboard/alumni/mentor' },
  { id: 'post-opportunity', label: 'Post Opportunity', icon: <PlusCircle />, path: '/dashboard/alumni/post-opportunity' },
  { id: 'events', label: 'Events', icon: <Calendar />, path: '/dashboard/alumni/events' },
  { id: 'community', label: 'Community', icon: <MessageSquare />, path: '/dashboard/alumni/community' },
  { id: 'impact', label: 'Impact', icon: <TrendingUp />, path: '/dashboard/alumni/impact' },
  { id: 'profile', label: 'Profile', icon: <User />, path: '/dashboard/alumni/profile' },
];

export default function AlumniDashboard() {
  const getCurrentPage = (path: string) => {
    if (path === '/dashboard/alumni' || path === '/dashboard/alumni/') return 'overview';
    const segments = path.split('/');
    return segments[segments.length - 1] || 'overview';
  };

  return (
    <Switch>
      <Route path="/dashboard/alumni">
        {() => (
          <DashboardLayout
            title="Welcome back, Alex!"
            subtitle="Alumni Dashboard"
            menuItems={menuItems}
            currentPage={getCurrentPage(window.location.pathname)}
          >
            <Overview />
          </DashboardLayout>
        )}
      </Route>
      <Route path="/dashboard/alumni/mentor">
        {() => (
          <DashboardLayout
            title="Mentoring"
            subtitle="Alumni Dashboard"
            menuItems={menuItems}
            currentPage={getCurrentPage(window.location.pathname)}
          >
            <Mentor />
          </DashboardLayout>
        )}
      </Route>
      <Route path="/dashboard/alumni/post-opportunity">
        {() => (
          <DashboardLayout
            title="Post Opportunity"
            subtitle="Alumni Dashboard"
            menuItems={menuItems}
            currentPage={getCurrentPage(window.location.pathname)}
          >
            <PostOpportunity />
          </DashboardLayout>
        )}
      </Route>
      <Route path="/dashboard/alumni/events">
        {() => (
          <DashboardLayout
            title="Events"
            subtitle="Alumni Dashboard"
            menuItems={menuItems}
            currentPage={getCurrentPage(window.location.pathname)}
          >
            <Events />
          </DashboardLayout>
        )}
      </Route>
      <Route path="/dashboard/alumni/community">
        {() => (
          <DashboardLayout
            title="Community"
            subtitle="Alumni Dashboard"
            menuItems={menuItems}
            currentPage={getCurrentPage(window.location.pathname)}
          >
            <Community />
          </DashboardLayout>
        )}
      </Route>
      <Route path="/dashboard/alumni/impact">
        {() => (
          <DashboardLayout
            title="Impact"
            subtitle="Alumni Dashboard"
            menuItems={menuItems}
            currentPage={getCurrentPage(window.location.pathname)}
          >
            <Impact />
          </DashboardLayout>
        )}
      </Route>
      <Route path="/dashboard/alumni/profile">
        {() => (
          <DashboardLayout
            title="Profile"
            subtitle="Alumni Dashboard"
            menuItems={menuItems}
            currentPage={getCurrentPage(window.location.pathname)}
          >
            <AlumniProfile />
          </DashboardLayout>
        )}
      </Route>
    </Switch>
  );
}
