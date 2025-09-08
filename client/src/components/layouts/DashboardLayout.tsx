import { ReactNode, useState } from 'react';
import { Menu, X, LogOut } from 'lucide-react';
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
        <div className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white shadow-card transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}>
          {/* Mobile close button */}
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="absolute top-4 right-4 lg:hidden text-ink-500 hover:text-ink-700"
            data-testid="button-close-sidebar"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="p-4">
            <h1 className="text-2xl font-display font-bold text-ink-900">FuSteps</h1>
            <p className="text-sm text-ink-500 mt-1">{subtitle}</p>
          </div>
          
          <nav className="px-3 pb-4">
            <div className="space-y-1">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleMenuClick(item.path)}
                  className={`sidebar-item w-full flex items-center px-4 py-3 rounded-lg transition-custom ${
                    currentPage === item.id
                      ? 'bg-sun-100 text-ink-900'
                      : 'text-ink-700 hover:bg-neutral-25'
                  }`}
                  data-testid={`nav-${item.id}`}
                >
                  <span className="w-5 h-5 mr-3">{item.icon}</span>
                  {item.label}
                  {item.id === 'notifications' && (
                    <span className="ml-auto bg-ember-500 text-white text-xs px-2 py-1 rounded-full">3</span>
                  )}
                </button>
              ))}
            </div>
            
            <div className="mt-8 pt-8 border-t border-neutral-100">
              <button 
                onClick={handleLogout}
                className="sidebar-item w-full flex items-center px-4 py-3 rounded-lg text-ember-600 hover:bg-ember-50 transition-custom"
                data-testid="button-logout"
              >
                <LogOut className="w-5 h-5 mr-3" />
                Logout
              </button>
            </div>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="p-4"></div>
            <div className="mb-6">
              <h1 className="text-3xl font-display font-bold text-ink-900 mb-2">{title}</h1>
            </div>
            {children}
          </div>
        </div>
      </div>

      {/* Mobile sidebar overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
}
