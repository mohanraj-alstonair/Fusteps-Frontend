import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type UserRole = 'student' | 'mentor' | 'alumni' | 'employer' | 'admin';

export interface User {
  id?: number;
  email: string;
  firstName?: string;
  lastName?: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, firstName: string, lastName: string, role: UserRole) => Promise<void>;
  logout: () => void;
  completeOnboarding: () => void;
  needsOnboarding: boolean;
  loading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      console.log('Login attempt with email:', email);
      const response = await fetch('http://localhost:8000/api/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();
      console.log('Login response:', data);

      if (data.success) {
        const user: User = {
          email: data.user.email,
          firstName: data.user.name.split(' ')[0] || 'User',
          lastName: data.user.name.split(' ').slice(1).join(' ') || '',
          role: data.user.role as UserRole,
        };
        setUser(user);
        
        // Store user ID in localStorage for API calls
        localStorage.setItem('userId', data.user.id.toString());
        if (data.user.role === 'mentor') {
          localStorage.setItem('mentorId', data.user.id.toString());
        } else if (data.user.role === 'student') {
          localStorage.setItem('studentId', data.user.id.toString());
        }
        
        // Check if user needs onboarding based on backend data
        if (data.user.role === 'student') {
          setNeedsOnboarding(!data.user.onboarding_completed);
          console.log('Login - Student role. Onboarding completed:', data.user.onboarding_completed, 'Needs Onboarding:', !data.user.onboarding_completed);
        }
        console.log('User logged in successfully:', user);
        console.log('Login response data:', data);
        console.log('Setting needsOnboarding to:', !data.user.onboarding_completed);
        
        // Force redirect after successful login
        setTimeout(() => {
          const expectedPath = data.user.role === 'student' ? '/dashboard/student' : `/dashboard/${data.user.role}`;
          console.log('Force redirecting to:', expectedPath);
          window.location.href = expectedPath;
        }, 100);
      } else {
        const errorMessage = data.message || 'Login failed';
        setError(errorMessage);
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = (error as Error).message || 'Network error. Please try again.';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, firstName: string, lastName: string, role: UserRole) => {
    setLoading(true);
    setError(null);
    try {
      console.log('Register attempt with email:', email, 'role:', role);
      const response = await fetch('http://localhost:8000/api/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          name: `${firstName} ${lastName}`.trim(),
          role,
        }),
      });

      const data = await response.json();
      console.log('Register response:', data);

      if (data.success) {
        const user: User = {
          email: data.candidate_id ? email : email, // Use email since backend returns candidate_id
          firstName,
          lastName,
          role,
        };
        setUser(user);

        // Store user ID in localStorage for API calls
        localStorage.setItem('userId', data.candidate_id.toString());
        if (role === 'mentor') {
          localStorage.setItem('mentorId', data.candidate_id.toString());
        } else if (role === 'student') {
          localStorage.setItem('studentId', data.candidate_id.toString());
        }

        // Students need onboarding after registration
        if (role === 'student') {
          setNeedsOnboarding(data.needs_onboarding || true);
          console.log('Register - Student role. Needs onboarding:', data.needs_onboarding);
        }
        console.log('User registered:', user);
      } else {
        const errorMessage = data.error || 'Registration failed';
        setError(errorMessage);
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error('Register error:', error);
      const errorMessage = (error as Error).message || 'Network error. Please try again.';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setNeedsOnboarding(false);
    setError(null);
    setLoading(false);
    // Clear stored user IDs
    localStorage.removeItem('userId');
    localStorage.removeItem('mentorId');
    localStorage.removeItem('studentId');
  };

  const completeOnboarding = () => {
    setNeedsOnboarding(false);
    console.log('Onboarding completed for user');
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Simulate checking for a stored session (e.g., a token or user data in localStorage)
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const user: User = JSON.parse(storedUser);
          setUser(user);

          // Students might need onboarding - will be checked on login
          if (user.role === 'student') {
            setNeedsOnboarding(false); // Will be set properly on login
          }
          console.log('User session restored from localStorage:', user);
        } else {
          console.log('No user session found in localStorage.');
        }
      } catch (e) {
        console.error('Failed to restore user session from localStorage', e);
        localStorage.removeItem('user'); // Clear potentially corrupted data
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []); // Run only once on mount

  // Update localStorage when user changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{
      user,
      login,
      register,
      logout,
      completeOnboarding,
      needsOnboarding,
      loading,
      error
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
