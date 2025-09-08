import { Switch, Route } from "wouter";
import { Calendar, BookOpen, Users, FolderOpen, Library as LibraryIcon, Globe, Settings, Bell, User } from "lucide-react";
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

const menuItems = [
  { id: 'overview', label: 'Overview', icon: <Calendar />, path: '/dashboard/student' },
  { id: 'internships', label: 'Internships', icon: <BookOpen />, path: '/dashboard/student/internships' },
  { id: 'courses', label: 'Courses', icon: <BookOpen />, path: '/dashboard/student/courses' },
  { id: 'mentors', label: 'Mentors', icon: <Users />, path: '/dashboard/student/mentors' },
  { id: 'projects', label: 'Projects', icon: <FolderOpen />, path: '/dashboard/student/projects' },
  { id: 'library', label: 'Library', icon: <LibraryIcon />, path: '/dashboard/student/library' },
  { id: 'study-abroad', label: 'Study Abroad', icon: <Globe />, path: '/dashboard/student/study-abroad' },
  { id: 'job-tools', label: 'Job Tools', icon: <Settings />, path: '/dashboard/student/job-tools' },
  { id: 'notifications', label: 'Notifications', icon: <Bell />, path: '/dashboard/student/notifications' },
  { id: 'profile', label: 'Profile', icon: <User />, path: '/dashboard/student/profile' },
];

function StudentOverview() {
  return (
    <div className="max-w-7xl mx-auto">
      <p className="text-ink-500 mb-8">Here's what's happening with your career journey.</p>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-card p-6">
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
        
        <div className="bg-white rounded-2xl shadow-card p-6">
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
        
        <div className="bg-white rounded-2xl shadow-card p-6">
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
        
        <div className="bg-white rounded-2xl shadow-card p-6">
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
            <a href="#" className="text-sun-700 hover:text-sun-900 text-sm font-semibold">View All</a>
          </div>
          
          <div className="space-y-4">
            {[
              { title: 'Frontend Developer', company: 'TechCorp Inc.', status: 'In Review', statusColor: 'sun' },
              { title: 'UX Designer Intern', company: 'Design Studio', status: 'Interview', statusColor: 'leaf' },
              { title: 'Data Analyst', company: 'FinanceMax', status: 'Rejected', statusColor: 'ember' }
            ].map((app, index) => (
              <div key={index} className="flex items-center justify-between p-4 border border-neutral-100 rounded-xl hover:bg-neutral-25 transition-custom">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-neutral-100 rounded-lg"></div>
                  <div>
                    <h4 className="font-semibold text-ink-900" data-testid={`text-job-title-${index}`}>{app.title}</h4>
                    <p className="text-sm text-ink-500" data-testid={`text-company-${index}`}>{app.company}</p>
                  </div>
                </div>
                <span className={`bg-${app.statusColor}-100 text-${app.statusColor}-800 text-xs px-2 py-1 rounded-full`} data-testid={`status-${index}`}>
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
            <a href="#" className="text-sun-700 hover:text-sun-900 text-sm font-semibold">View Calendar</a>
          </div>
          
          <div className="space-y-4">
            {[
              { date: '15', title: 'Career Fair 2024', time: 'Virtual Event • 10:00 AM', description: 'Meet top employers and explore opportunities' },
              { date: '18', title: 'Mentoring Session', time: 'With John Smith • 2:00 PM', description: 'Resume review and interview tips' },
              { date: '22', title: 'React Workshop', time: 'Online Course • 6:00 PM', description: 'Advanced React patterns and hooks' }
            ].map((event, index) => (
              <div key={index} className="flex items-start space-x-4 p-4 border border-neutral-100 rounded-xl hover:bg-neutral-25 transition-custom">
                <div className="w-12 h-12 bg-sun-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-sun-800">{event.date}</span>
                </div>
                <div>
                  <h4 className="font-semibold text-ink-900" data-testid={`text-event-title-${index}`}>{event.title}</h4>
                  <p className="text-sm text-ink-500" data-testid={`text-event-time-${index}`}>{event.time}</p>
                  <p className="text-xs text-ink-300 mt-1">{event.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
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
    </Switch>
  );
}
