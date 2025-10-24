import { Switch, Route, useLocation } from "wouter";
import { Calendar, BookOpen, Users, FolderOpen, Library as LibraryIcon, Globe, Settings as SettingsIcon, User } from "lucide-react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import Internships from "./Internships";
import Courses from "./Courses";
import Mentors from "./Mentors";
import Projects from "./Projects";
import Library from "./Library";
import StudyAbroad from "./StudyAbroad";
import JobTools from "./JobTools";
import Notifications from "./Notifications";
import Profile from "./Profile";
import StudentSettings from "./Settings";
import { CalendarModal } from "../../components/ui/CalendarModal";
import { useState } from "react";

const menuItems = [
  { id: 'overview', label: 'Overview', icon: <Calendar />, path: '/dashboard/student' },
  { id: 'internships', label: 'Internships', icon: <BookOpen />, path: '/dashboard/student/internships' },
  { id: 'courses', label: 'Courses', icon: <BookOpen />, path: '/dashboard/student/courses' },
  { id: 'mentors', label: 'Mentors', icon: <Users />, path: '/dashboard/student/mentors' },
  { id: 'projects', label: 'Projects', icon: <FolderOpen />, path: '/dashboard/student/projects' },
  { id: 'library', label: 'Library', icon: <LibraryIcon />, path: '/dashboard/student/library' },
  { id: 'study-abroad', label: 'Study Abroad', icon: <Globe />, path: '/dashboard/student/study-abroad' },
  { id: 'job-tools', label: 'Job Tools', icon: <SettingsIcon />, path: '/dashboard/student/job-tools' },
];

function StudentOverview() {
  const [, setLocation] = useLocation();
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const events = [
    { title: 'Career Fair 2024', from: new Date('2024-04-15T10:00:00'), to: new Date('2024-04-15T12:00:00') },
    { title: 'Mentoring Session', from: new Date('2024-04-18T14:00:00'), to: new Date('2024-04-18T15:00:00') },
    { title: 'React Workshop', from: new Date('2024-04-22T18:00:00'), to: new Date('2024-04-22T20:00:00') }
  ];

  const handleViewAll = (e: React.MouseEvent) => {
    e.preventDefault();
    setLocation('/dashboard/student/internships');
  };

  const handleViewCalendar = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsCalendarOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <p className="text-ink-500 mb-8">Here's what's happening with your career journey.</p>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-card p-6 border-l-4 border-sun-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-ink-500 text-sm">Applications</p>
              <p className="text-2xl font-bold text-ink-900" data-testid="text-applications">12</p>
            </div>
            <div className="w-12 h-12 bg-sun-100 rounded-xl flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-sun-700" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-card p-6 border-l-4 border-leaf-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-ink-500 text-sm">Interviews</p>
              <p className="text-2xl font-bold text-ink-900" data-testid="text-interviews">3</p>
            </div>
            <div className="w-12 h-12 bg-leaf-100 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-leaf-700" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-card p-6 border-l-4 border-slate-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-ink-500 text-sm">Courses</p>
              <p className="text-2xl font-bold text-ink-900" data-testid="text-courses">5</p>
            </div>
            <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-slate-700" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-card p-6 border-l-4 border-ember-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-ink-500 text-sm">Profile Score</p>
              <p className="text-2xl font-bold text-ink-900" data-testid="text-profile-score">85%</p>
            </div>
            <div className="w-12 h-12 bg-ember-100 rounded-xl flex items-center justify-center">
              <User className="w-6 h-6 text-ember-700" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Applications */}
        <div className="bg-white rounded-2xl shadow-card p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-display font-semibold text-ink-900">Recent Applications</h3>
            <button onClick={handleViewAll} className="text-sun-700 hover:text-sun-900 text-sm font-semibold">View All</button>
          </div>

          <div className="space-y-4">
            {[
              { title: 'Frontend Developer', company: 'TechCorp Inc.', status: 'In Review', statusColor: 'sun' },
              { title: 'UX Designer Intern', company: 'Design Studio', status: 'Interview', statusColor: 'leaf' },
              { title: 'Data Analyst', company: 'FinanceMax', status: 'Rejected', statusColor: 'ember' }
            ].map((app, index) => (
              <div key={index} className="flex items-center justify-between p-4 border border-neutral-100 rounded-xl hover:bg-neutral-25 transition-custom">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                    <span className="text-gray-600 font-semibold text-sm">{app.company.charAt(0)}</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-ink-900" data-testid={`text-job-title-${index}`}>{app.title}</h4>
                    <p className="text-sm text-ink-500" data-testid={`text-company-${index}`}>{app.company}</p>
                  </div>
                </div>
                <span className={`${app.statusColor === 'sun' ? 'bg-yellow-100 text-yellow-800' : app.statusColor === 'leaf' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'} text-xs px-2 py-1 rounded-full`} data-testid={`status-${index}`}>
                  {app.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="bg-white rounded-2xl shadow-card p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-display font-semibold text-ink-900">Upcoming Events</h3>
            <button onClick={handleViewCalendar} className="text-sun-700 hover:text-sun-900 text-sm font-semibold">View Calendar</button>
          </div>

          <div className="space-y-4">
            {events.map((event, index) => (
              <div key={index} className="flex items-start space-x-4 p-4 border border-neutral-100 rounded-xl hover:bg-neutral-25 transition-custom">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-blue-800">{new Date(event.from).getDate()}</span>
                </div>
                <div>
                  <h4 className="font-semibold text-ink-900" data-testid={`text-event-title-${index}`}>{event.title}</h4>
                  <p className="text-sm text-ink-500" data-testid={`text-event-time-${index}`}>{event.from.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <CalendarModal open={isCalendarOpen} onOpenChange={setIsCalendarOpen} events={events} />
    </div>
  );
}

export default function StudentDashboard() {
  const getCurrentPage = (path: string) => {
    if (path === '/dashboard/student' || path === '/dashboard/student/') return 'overview';
    const segments = path.split('/');
    return segments[segments.length - 1] || 'overview';
  };

  return (
    <Switch>
      <Route path="/dashboard/student">
        {() => (
          <DashboardLayout
            title="Welcome back, Sarah!"
            subtitle="Student Dashboard"
            menuItems={menuItems}
            currentPage={getCurrentPage(window.location.pathname)}
          >
            <StudentOverview />
          </DashboardLayout>
        )}
      </Route>
      <Route path="/dashboard/student/internships">
        {() => (
          <DashboardLayout
            title="Internship Opportunities"
            subtitle="Student Dashboard"
            menuItems={menuItems}
            currentPage={getCurrentPage(window.location.pathname)}
          >
            <Internships />
          </DashboardLayout>
        )}
      </Route>
      <Route path="/dashboard/student/courses">
        {() => (
          <DashboardLayout
            title="Course Catalog"
            subtitle="Student Dashboard"
            menuItems={menuItems}
            currentPage={getCurrentPage(window.location.pathname)}
          >
            <Courses />
          </DashboardLayout>
        )}
      </Route>
      <Route path="/dashboard/student/mentors">
        {() => (
          <DashboardLayout
            title="Find Mentors"
            subtitle="Student Dashboard"
            menuItems={menuItems}
            currentPage={getCurrentPage(window.location.pathname)}
          >
            <Mentors />
          </DashboardLayout>
        )}
      </Route>
      <Route path="/dashboard/student/projects">
        {() => (
          <DashboardLayout
            title="My Projects"
            subtitle="Student Dashboard"
            menuItems={menuItems}
            currentPage={getCurrentPage(window.location.pathname)}
          >
            <Projects />
          </DashboardLayout>
        )}
      </Route>
      <Route path="/dashboard/student/library">
        {() => (
          <DashboardLayout
            title="Resource Library"
            subtitle="Student Dashboard"
            menuItems={menuItems}
            currentPage={getCurrentPage(window.location.pathname)}
          >
            <Library />
          </DashboardLayout>
        )}
      </Route>
      <Route path="/dashboard/student/study-abroad">
        {() => (
          <DashboardLayout
            title="Study Abroad Programs"
            subtitle="Student Dashboard"
            menuItems={menuItems}
            currentPage={getCurrentPage(window.location.pathname)}
          >
            <StudyAbroad />
          </DashboardLayout>
        )}
      </Route>
      <Route path="/dashboard/student/job-tools">
        {() => (
          <DashboardLayout
            title="Career Tools"
            subtitle="Student Dashboard"
            menuItems={menuItems}
            currentPage={getCurrentPage(window.location.pathname)}
          >
            <JobTools />
          </DashboardLayout>
        )}
      </Route>
      <Route path="/dashboard/student/notifications">
        {() => (
          <DashboardLayout
            title="Notifications"
            subtitle="Student Dashboard"
            menuItems={menuItems}
            currentPage={getCurrentPage(window.location.pathname)}
          >
            <Notifications />
          </DashboardLayout>
        )}
      </Route>
      <Route path="/dashboard/student/profile">
        {() => (
          <DashboardLayout
            title="My Profile"
            subtitle="Student Dashboard"
            menuItems={menuItems}
            currentPage={getCurrentPage(window.location.pathname)}
          >
            <Profile />
          </DashboardLayout>
        )}
      </Route>
      <Route path="/dashboard/student/settings">
        {() => (
          <DashboardLayout
            title="Account Settings"
            subtitle="Student Dashboard"
            menuItems={menuItems}
            currentPage={getCurrentPage(window.location.pathname)}
          >
            <StudentSettings />
          </DashboardLayout>
        )}
      </Route>
    </Switch>
  );
}