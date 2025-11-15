import { Switch, Route, useLocation } from "wouter";
import { Calendar, BookOpen, Users, FolderOpen, Library as LibraryIcon, Globe, User, Award, Briefcase, Brain } from "lucide-react";
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
import { useState, useEffect } from "react";

const menuItems = [
  { id: 'overview', label: 'Overview', icon: <Calendar />, path: '/dashboard/student' },
  { id: 'internships', label: 'Internships', icon: <BookOpen />, path: '/dashboard/student/internships' },
  { id: 'job-tools', label: 'Jobs & Career', icon: <Briefcase />, path: '/dashboard/student/job-tools' },
  { id: 'courses', label: '🚀 Courses & AI Skills', icon: <Brain />, path: '/dashboard/student/courses' },

  { id: 'mentors', label: 'Mentors', icon: <Users />, path: '/dashboard/student/mentors' },
  { id: 'projects', label: 'Projects', icon: <FolderOpen />, path: '/dashboard/student/projects' },
  { id: 'library', label: 'Library', icon: <LibraryIcon />, path: '/dashboard/student/library' },
  { id: 'study-abroad', label: 'Study Abroad', icon: <Globe />, path: '/dashboard/student/study-abroad' },
];

function StudentOverview({ userData }: { userData: any }) {
  const [, setLocation] = useLocation();
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [recentApplications] = useState([
    { title: 'Frontend Developer', company: 'TechCorp Inc.', status: 'In Review', statusColor: 'sun' },
    { title: 'UX Designer Intern', company: 'Design Studio', status: 'Interview', statusColor: 'leaf' },
    { title: 'Data Analyst', company: 'FinanceMax', status: 'Rejected', statusColor: 'ember' }
  ]);
  const [upcomingEvents] = useState([
    { title: 'Career Fair 2024', from: new Date('2024-04-15T10:00:00'), to: new Date('2024-04-15T12:00:00') },
    { title: 'Mentoring Session', from: new Date('2024-04-18T14:00:00'), to: new Date('2024-04-18T15:00:00') },
    { title: 'React Workshop', from: new Date('2024-04-22T18:00:00'), to: new Date('2024-04-22T20:00:00') }
  ]);

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
              <p className="text-2xl font-bold text-ink-900" data-testid="text-applications">{userData.applications}</p>
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
              <p className="text-2xl font-bold text-ink-900" data-testid="text-interviews">{userData.interviews}</p>
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
              <p className="text-2xl font-bold text-ink-900" data-testid="text-courses">{userData.courses}</p>
            </div>
            <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-slate-700" />
            </div>
          </div>
        </div>

        <div className={`bg-white rounded-2xl shadow-card p-6 border-l-4 ${
          userData.profileScore >= 80 ? 'border-green-500' :
          userData.profileScore >= 60 ? 'border-yellow-500' :
          userData.profileScore >= 40 ? 'border-orange-500' : 'border-red-500'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-ink-500 text-sm">Profile Score</p>
              <div className="flex items-center gap-2">
                <p className="text-2xl font-bold text-ink-900" data-testid="text-profile-score">{userData.profileScore}%</p>
                <span className="text-lg">
                  {userData.profileScore >= 80 ? '🟢' :
                   userData.profileScore >= 60 ? '🟡' :
                   userData.profileScore >= 40 ? '🟠' : '🔴'}
                </span>
              </div>
              <p className={`text-xs font-medium ${
                userData.profileScore >= 80 ? 'text-green-700' :
                userData.profileScore >= 60 ? 'text-yellow-700' :
                userData.profileScore >= 40 ? 'text-orange-700' : 'text-red-700'
              }`}>
                {userData.profileScore >= 80 ? 'Highly Employable' :
                 userData.profileScore >= 60 ? 'Job Ready' :
                 userData.profileScore >= 40 ? 'Needs Skill Improvement' : 'Incomplete Profile'}
              </p>
            </div>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              userData.profileScore >= 80 ? 'bg-green-100' :
              userData.profileScore >= 60 ? 'bg-yellow-100' :
              userData.profileScore >= 40 ? 'bg-orange-100' : 'bg-red-100'
            }`}>
              <User className={`w-6 h-6 ${
                userData.profileScore >= 80 ? 'text-green-700' :
                userData.profileScore >= 60 ? 'text-yellow-700' :
                userData.profileScore >= 40 ? 'text-orange-700' : 'text-red-700'
              }`} />
            </div>
          </div>
        </div>
      </div>

      {/* AI Skills Promotion Banner */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-card p-6 mb-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold mb-2 flex items-center">
              <Brain className="w-8 h-8 mr-3" />
              🚀 NEW: AI-Powered Skills Management
            </h3>
            <p className="text-blue-100 mb-4">
              Generate digital skill tokens, get AI-powered gap analysis, and receive personalized course recommendations!
            </p>
            <button 
              onClick={() => setLocation('/dashboard/student/courses')}
              className="bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              Explore AI Skills & Courses →
            </button>
          </div>
          <div className="hidden md:block">
            <div className="text-6xl opacity-20">🤖</div>
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
            {recentApplications.map((app, index) => (
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
            {upcomingEvents.map((event, index) => (
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
      <CalendarModal open={isCalendarOpen} onOpenChange={setIsCalendarOpen} events={upcomingEvents} />
    </div>
  );
}

export default function StudentDashboard() {
  const [userData, setUserData] = useState({
    applications: 0,
    interviews: 0,
    courses: 0,
    profileScore: 0,
    name: 'Student'
  });
  const [location] = useLocation();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const studentId = localStorage.getItem('studentId') || user.id;
        
        if (studentId) {
          const profileResponse = await fetch(`http://localhost:8000/api/profile/${studentId}/`);
          if (profileResponse.ok) {
            const profile = await profileResponse.json();
            console.log('Profile data:', profile);
            
            const fields = ['name', 'email', 'phone', 'university', 'field_of_study', 'degree'];
            const completedFields = fields.filter(field => profile[field] && profile[field].toString().trim() !== '');
            const profileScore = Math.round((completedFields.length / fields.length) * 100);
            
            console.log('Profile completion calculation:', {
              fields,
              completedFields,
              profileScore
            });
            
            setUserData({
              applications: 3,
              interviews: 1,
              courses: 2,
              profileScore,
              name: profile.name || 'Student'
            });
          } else {
            console.error('Failed to fetch profile:', profileResponse.status);
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    
    fetchUserData();
  }, []);


  
  console.log('StudentDashboard - Current location:', location);

  return (
    <Switch>
      <Route path="/dashboard/student/internships">
        <DashboardLayout
          title="Internship Opportunities"
          subtitle="Student Dashboard"
          menuItems={menuItems}
          currentPage="internships"
        >
          <Internships />
        </DashboardLayout>
      </Route>
      <Route path="/dashboard/student/courses">
        <DashboardLayout
          title="Course Catalog"
          subtitle="Student Dashboard"
          menuItems={menuItems}
          currentPage="courses"
        >
          <Courses />
        </DashboardLayout>
      </Route>
      <Route path="/dashboard/student/mentors">
        <DashboardLayout
          title="Find Mentors"
          subtitle="Student Dashboard"
          menuItems={menuItems}
          currentPage="mentors"
        >
          <Mentors />
        </DashboardLayout>
      </Route>
      <Route path="/dashboard/student/projects">
        <DashboardLayout
          title="My Projects"
          subtitle="Student Dashboard"
          menuItems={menuItems}
          currentPage="projects"
        >
          <Projects />
        </DashboardLayout>
      </Route>
      <Route path="/dashboard/student/library">
        <DashboardLayout
          title="Resource Library"
          subtitle="Student Dashboard"
          menuItems={menuItems}
          currentPage="library"
        >
          <Library />
        </DashboardLayout>
      </Route>
      <Route path="/dashboard/student/study-abroad">
        <DashboardLayout
          title="Study Abroad Programs"
          subtitle="Student Dashboard"
          menuItems={menuItems}
          currentPage="study-abroad"
        >
          <StudyAbroad />
        </DashboardLayout>
      </Route>
      <Route path="/dashboard/student/job-tools">
        <DashboardLayout
          title="Jobs & Career Tools"
          subtitle="Student Dashboard"
          menuItems={menuItems}
          currentPage="job-tools"
        >
          <JobTools />
        </DashboardLayout>
      </Route>
      <Route path="/dashboard/student/notifications">
        <DashboardLayout
          title="Notifications"
          subtitle="Student Dashboard"
          menuItems={menuItems}
          currentPage="notifications"
        >
          <Notifications />
        </DashboardLayout>
      </Route>
      <Route path="/dashboard/student/profile">
        <DashboardLayout
          title="My Profile"
          subtitle="Student Dashboard"
          menuItems={menuItems}
          currentPage="profile"
        >
          <Profile />
        </DashboardLayout>
      </Route>

      <Route path="/dashboard/student/settings">
        <DashboardLayout
          title="Account Settings"
          subtitle="Student Dashboard"
          menuItems={menuItems}
          currentPage="settings"
        >
          <StudentSettings />
        </DashboardLayout>
      </Route>
      <Route path="/dashboard/student">
        <DashboardLayout
          title={`Welcome back, ${userData.name}!`}
          subtitle="Student Dashboard"
          menuItems={menuItems}
          currentPage="overview"
        >
          <StudentOverview userData={userData} />
        </DashboardLayout>
      </Route>
    </Switch>
  );
}