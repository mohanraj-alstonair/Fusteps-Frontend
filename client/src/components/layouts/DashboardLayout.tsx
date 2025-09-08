
import { ReactNode, useState } from 'react';
import { Menu, X, LogOut, Bell, Settings, User, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth } from '../../hooks/use-auth';
import { useLocation } from 'wouter';

interface MenuItem {
  id: string;
  label: string;
  icon: ReactNode;
  path: string;
}

interface DashboardLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
  menuItems: MenuItem[];
  currentPage: string;
}

export default function DashboardLayout({ children, title, subtitle, menuItems, currentPage }: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const { logout, user } = useAuth();
  const [location, setLocation] = useLocation();

  const handleMenuClick = (path: string) => {
    setLocation(path);
    setIsSidebarOpen(false);
  };

  const handleLogout = () => {
    logout();
    setLocation('/');
  };

  const handleNotifications = () => {
    // Navigate to notifications page based on user role
    if (user?.role === 'student') {
      setLocation('/dashboard/student/notifications');
    }
    // Add other role-specific navigation as needed
  };

  const handleSettings = () => {
    // Navigate to settings page based on user role
    if (user?.role === 'mentor') {
      setLocation('/dashboard/mentor/settings');
    } else if (user?.role === 'admin') {
      setLocation('/dashboard/admin/settings');
    }
    // Add other role-specific navigation as needed
  };

  const handleProfile = () => {
    // Navigate to profile page based on user role
    if (user?.role === 'student') {
      setLocation('/dashboard/student/profile');
    } else if (user?.role === 'alumni') {
      setLocation('/dashboard/alumni/profile');
    } else if (user?.role === 'employer') {
      setLocation('/dashboard/employer/company-profile');
    }
    // Add other role-specific navigation as needed
  };

  return (
    <div className="min-h-screen bg-neutral-25">
      <div className="flex">
        {/* Mobile Menu Button */}
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className="fixed top-4 left-4 z-50 lg:hidden bg-white p-2 rounded-lg shadow-card"
          data-testid="button-mobile-menu"
        >
          <Menu className="w-6 h-6 text-ink-900" />
        </button>

        {/* Sidebar */}
        <div className={`fixed lg:static inset-y-0 left-0 z-40 bg-white shadow-card transform transition-all duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } ${isSidebarCollapsed ? 'lg:w-16' : 'lg:w-64'} w-64`}>
          
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-4">
            <div className={`${isSidebarCollapsed ? 'flex justify-center w-full' : ''}`}>
              {isSidebarCollapsed ? (
                <div className="w-10 h-10 bg-sky-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">F</span>
                </div>
              ) : (
                <div>
                  <h1 className="text-2xl font-display font-bold text-ink-900">FuSteps</h1>
                  <p className="text-sm text-ink-500 mt-1">{subtitle}</p>
                </div>
              )}
            </div>
            
            {!isSidebarCollapsed && (
              <>
                {/* Desktop collapse button */}
                <button 
                  onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                  className="hidden lg:block text-ink-500 hover:text-ink-700 p-1"
                  data-testid="button-collapse-sidebar"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                {/* Mobile close button */}
                <button 
                  onClick={() => setIsSidebarOpen(false)}
                  className="lg:hidden text-ink-500 hover:text-ink-700"
                  data-testid="button-close-sidebar"
                >
                  <X className="w-6 h-6" />
                </button>
              </>
            )}

            {/* Collapse button when sidebar is collapsed */}
            {isSidebarCollapsed && (
              <button 
                onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                className="hidden lg:block absolute top-4 right-2 text-ink-500 hover:text-ink-700 p-1"
                data-testid="button-expand-sidebar"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            )}
          </div>
          
          <nav className="px-3 pb-4">
            <div className="space-y-1">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleMenuClick(item.path)}
                  className={`sidebar-item w-full flex items-center px-4 py-3 rounded-lg transition-custom ${
                    currentPage === item.id
                      ? 'bg-sky-100 text-ink-900'
                      : 'text-ink-700 hover:bg-neutral-25'
                  }`}
                  data-testid={`nav-${item.id}`}
                  title={isSidebarCollapsed ? item.label : ''}
                >
                  <span className="w-5 h-5 flex-shrink-0">{item.icon}</span>
                  {!isSidebarCollapsed && (
                    <>
                      <span className="ml-3">{item.label}</span>
                      {item.id === 'notifications' && (
                        <span className="ml-auto bg-ember-500 text-white text-xs px-2 py-1 rounded-full">3</span>
                      )}
                    </>
                  )}
                </button>
              ))}
            </div>
            
            
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="bg-white shadow-sm border-b border-neutral-100 px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="ml-12 lg:ml-0">
                <h1 className="text-2xl font-display font-bold text-ink-900">{title}</h1>
              </div>
              
              {/* Header Actions */}
              <div className="flex items-center space-x-2">
                {/* Notifications */}
                <button
                  onClick={handleNotifications}
                  className="relative p-2 text-ink-600 hover:text-ink-900 hover:bg-neutral-25 rounded-lg transition-colors"
                  data-testid="button-notifications"
                >
                  <Bell className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 bg-ember-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">3</span>
                </button>

                {/* Settings */}
                <button
                  onClick={handleSettings}
                  className="p-2 text-ink-600 hover:text-ink-900 hover:bg-neutral-25 rounded-lg transition-colors"
                  data-testid="button-settings"
                >
                  <Settings className="w-5 h-5" />
                </button>

                {/* Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                    className="flex items-center space-x-2 p-2 text-ink-600 hover:text-ink-900 hover:bg-neutral-25 rounded-lg transition-colors"
                    data-testid="button-profile"
                  >
                    <div className="w-8 h-8 bg-sky-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-medium text-sm">
                        {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                      </span>
                    </div>
                    <span className="hidden sm:block text-sm font-medium">{user?.name || 'User'}</span>
                  </button>

                  {/* Profile Dropdown Menu */}
                  {showProfileDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-neutral-100 py-1 z-50">
                      <button
                        onClick={() => {
                          handleProfile();
                          setShowProfileDropdown(false);
                        }}
                        className="w-full flex items-center px-4 py-2 text-sm text-ink-700 hover:bg-neutral-25"
                      >
                        <User className="w-4 h-4 mr-3" />
                        View Profile
                      </button>
                      <button
                        onClick={() => {
                          handleSettings();
                          setShowProfileDropdown(false);
                        }}
                        className="w-full flex items-center px-4 py-2 text-sm text-ink-700 hover:bg-neutral-25"
                      >
                        <Settings className="w-4 h-4 mr-3" />
                        Settings
                      </button>
                      <div className="border-t border-neutral-100 my-1"></div>
                      <button
                        onClick={() => {
                          handleLogout();
                          setShowProfileDropdown(false);
                        }}
                        className="w-full flex items-center px-4 py-2 text-sm text-ember-600 hover:bg-ember-50"
                      >
                        <LogOut className="w-4 h-4 mr-3" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 p-4">
            {children}
          </main>
        </div>
      </div>

      {/* Mobile sidebar overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Click outside to close profile dropdown */}
      {showProfileDropdown && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowProfileDropdown(false)}
        />
      )}
    </div>
  );
}
