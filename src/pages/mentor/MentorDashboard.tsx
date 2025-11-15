import { Switch, Route, useLocation } from "wouter";
import { Users, Clock, Star, BookOpen } from "lucide-react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import Mentees from "./Mentees";
import MentorCalendar from "./Calendar";
import Sessions from "./Sessions";
import Feedback from "./Feedback";
import Resources from "./Resources";
import Earnings from "./Earnings";
import MentorSettings from "./Settings";
import DebugMentor from "./DebugMentor";
import { useEffect, useState } from "react";
import { getMentorSessions, getAcceptedMentees, getMentorFeedback } from "@/lib/api";
import { startOfWeek, endOfWeek, isWithinInterval } from "date-fns";

// Interface for session data
interface Session {
  mentee: string;
  topic: string;
  time: string;
  date: string;
}

// Interface for mentee data (aligned with Mentees.tsx)
interface Mentee {
  id: string;
  name: string;
  status: 'active' | 'inactive' | 'graduated';
}

// Interface for feedback data (aligned with Feedback.tsx)
interface FeedbackItem {
  id: string;
  rating: number;
}

// Define menuItems at the top level
const menuItems = [
  { id: 'today', label: 'Today', icon: <Clock />, path: '/dashboard/mentor' },
  { id: 'mentees', label: 'Mentees', icon: <Users />, path: '/dashboard/mentor/mentees' },
  { id: 'calendar', label: 'Calendar', icon: <Clock />, path: '/dashboard/mentor/calendar' },
  { id: 'sessions', label: 'Sessions', icon: <Clock />, path: '/dashboard/mentor/sessions' },
  { id: 'feedback', label: 'Feedback', icon: <Star />, path: '/dashboard/mentor/feedback' },
  { id: 'resources', label: 'Resources', icon: <BookOpen />, path: '/dashboard/mentor/resources' },
  { id: 'earnings', label: 'Earnings', icon: <BookOpen />, path: '/dashboard/mentor/earnings' },
];

function MentorOverview() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [mentees, setMentees] = useState<Mentee[]>([]);
  const [feedbackItems, setFeedbackItems] = useState<FeedbackItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAllSessions, setShowAllSessions] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const mentorId = parseInt(localStorage.getItem('mentorId') || '5');

      // Fetch sessions
      const sessionsResponse = await getMentorSessions(mentorId);
      if (!sessionsResponse.data) {
        throw new Error('No session data returned from API');
      }
      const formattedSessions: Session[] = sessionsResponse.data
        .filter((booking: any) => ['scheduled', 'accepted'].includes(booking.status))
        .map((booking: any) => {
          const dateTime = booking.scheduled_date_time || booking.preferred_date_time;
          return {
            mentee: booking.student_name || 'Unknown Mentee',
            topic: booking.topic || 'Untitled Session',
            time: dateTime ? dateTime.split('T')[1]?.substring(0, 5) || 'N/A' : 'N/A',
            date: dateTime ? dateTime.split('T')[0] || 'N/A' : 'N/A',
          };
        })
        // Filter out past sessions (before today)
        .filter((session: Session) => new Date(session.date).getTime() >= new Date().setHours(0, 0, 0, 0))
        // Sort sessions by date in ascending order
        .sort((a: Session, b: Session) => new Date(a.date).getTime() - new Date(b.date).getTime());
      setSessions(formattedSessions);

      // Fetch accepted mentees
      const menteesResponse = await getAcceptedMentees(mentorId);
      const acceptedMentees: Mentee[] = menteesResponse.data.map((mentee: any) => ({
        id: mentee.id.toString(),
        name: mentee.name,
        status: mentee.status as 'active' | 'inactive' | 'graduated',
      }));
      setMentees(acceptedMentees);

      // Fetch feedback
      const feedbackResponse = await getMentorFeedback(mentorId);
      const mappedFeedback: FeedbackItem[] = feedbackResponse.data.map((item: any) => ({
        id: item.id,
        rating: item.rating,
      }));
      setFeedbackItems(mappedFeedback);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(`Failed to fetch data: ${errorMessage}`);
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Calculate stats
  const activeMentees = mentees.filter(m => m.status === 'active').length;
  const today = new Date();
  const startOfWeekDate = startOfWeek(today, { weekStartsOn: 1 }); // Monday
  const endOfWeekDate = endOfWeek(today, { weekStartsOn: 1 }); // Sunday
  const sessionsThisWeek = sessions.filter(session =>
    isWithinInterval(new Date(session.date), { start: startOfWeekDate, end: endOfWeekDate })
  ).length;
  const totalRatings = feedbackItems.reduce((sum, item) => sum + item.rating, 0);
  const avgRating = feedbackItems.length > 0 ? (totalRatings / feedbackItems.length).toFixed(1) : '0.0';

  // Limit to 4 sessions unless showAllSessions is true
  const displayedSessions = showAllSessions ? sessions : sessions.slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto">
      <p className="text-gray-600 mb-8 text-lg font-medium">Here's your mentoring overview for today.</p>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-500 transition-all hover:shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Active Mentees</p>
              <p className="text-2xl font-bold text-gray-900" data-testid="text-active-mentees">{activeMentees}</p>
              <p className="text-xs text-blue-600 mt-1">Current mentees</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-700" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-green-500 transition-all hover:shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Sessions This Week</p>
              <p className="text-2xl font-bold text-gray-900" data-testid="text-sessions-week">{sessionsThisWeek}</p>
              <p className="text-xs text-green-600 mt-1">Scheduled this week</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-green-700" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-yellow-500 transition-all hover:shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Average Rating</p>
              <p className="text-2xl font-bold text-gray-900" data-testid="text-average-rating">{avgRating}</p>
              <p className="text-xs text-yellow-600 mt-1">Based on {feedbackItems.length} reviews</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
              <Star className="w-6 h-6 text-yellow-700" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-purple-500 transition-all hover:shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Goals Achieved</p>
              <p className="text-2xl font-bold text-gray-900" data-testid="text-goals-achieved">23</p>
              <p className="text-xs text-purple-600 mt-1">This month</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-purple-700" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upcoming Sessions */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Upcoming Sessions</h3>
            <button
              className="text-blue-600 hover:text-blue-800 hover:underline text-sm font-semibold cursor-pointer focus:ring-2 focus:ring-blue-300 rounded-md px-2 py-1 transition-colors"
              onClick={() => setShowAllSessions(true)}
            >
              View All
            </button>
          </div>

          {loading ? (
            <p className="text-gray-600 font-medium">Loading sessions...</p>
          ) : error ? (
            <div className="text-red-500">
              <p className="font-medium">{error}</p>
              <button
                className="mt-2 text-blue-600 hover:text-blue-800 hover:underline text-sm font-semibold cursor-pointer"
                onClick={fetchData}
              >
                Retry
              </button>
            </div>
          ) : displayedSessions.length === 0 ? (
            <p className="text-gray-600 font-medium">No upcoming sessions.</p>
          ) : (
            <div className="space-y-4">
              {displayedSessions.map((session, index) => (
                <div
                  key={index}
                  className="flex items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all duration-200 border-l-4 border-blue-200"
                >
                  <div className="flex items-center space-x-4 w-full">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-semibold text-sm">{session.mentee.charAt(0)}</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 text-base" data-testid={`text-session-topic-${index}`}>
                        {session.topic}
                      </h4>
                      <p className="text-sm text-gray-600 font-medium" data-testid={`text-session-mentee-${index}`}>
                        with {session.mentee}
                      </p>
                      <p className="text-xs text-gray-500">
                        {session.date} at {session.time}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Recent Activity</h3>
            <button className="text-blue-600 hover:text-blue-800 hover:underline text-sm font-semibold cursor-pointer">
              View All
            </button>
          </div>

          <div className="space-y-4">
            {[
              { type: 'session', description: 'Completed React Performance session', mentee: 'Alex Thompson', time: '2 hours ago' },
              { type: 'feedback', description: 'Received 5-star rating', mentee: 'Sarah Chen', time: '4 hours ago' },
              { type: 'goal', description: 'Mentee achieved thesis goal', mentee: 'Emily Rodriguez', time: '1 day ago' }
            ].map((activity, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 border border-gray-100 rounded-xl hover:bg-gray-50 transition-all">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  {activity.type === 'session' && <Clock className="w-4 h-4 text-blue-600" />}
                  {activity.type === 'feedback' && <Star className="w-4 h-4 text-yellow-600" />}
                  {activity.type === 'goal' && <BookOpen className="w-4 h-4 text-purple-600" />}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                  <p className="text-xs text-gray-500">{activity.mentee} • {activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MentorDashboard() {
  const [location] = useLocation();

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
            title="Mentor Overview"
            subtitle="Mentor Dashboard"
            menuItems={menuItems}
            currentPage={getCurrentPage(location)}
          >
            <MentorOverview />
          </DashboardLayout>
        )}
      </Route>
      <Route path="/dashboard/mentor/mentees">
        {() => (
          <DashboardLayout
            title="My Mentees"
            subtitle="Mentor Dashboard"
            menuItems={menuItems}
            currentPage={getCurrentPage(location)}
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
            currentPage={getCurrentPage(location)}
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
            currentPage={getCurrentPage(location)}
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
            currentPage={getCurrentPage(location)}
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
            currentPage={getCurrentPage(location)}
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
            currentPage={getCurrentPage(location)}
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
            currentPage={getCurrentPage(location)}
          >
            <MentorSettings />
          </DashboardLayout>
        )}
      </Route>
      <Route path="/dashboard/mentor/debug">
        {() => (
          <DashboardLayout
            title="Debug"
            subtitle="Mentor Dashboard"
            menuItems={menuItems}
            currentPage={getCurrentPage(location)}
          >
            <DebugMentor />
          </DashboardLayout>
        )}
      </Route>
    </Switch>
  );
}