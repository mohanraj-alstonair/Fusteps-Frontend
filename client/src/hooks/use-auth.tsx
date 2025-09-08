import { createContext, useContext, useState, ReactNode } from 'react';

export type UserRole = 'student' | 'mentor' | 'alumni' | 'employer' | 'admin';

export interface User {
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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);

  const login = async (email: string, password: string) => {
    // Mock login - in real app, this would call an API
    // Determine role based on email for demo purposes
    let role: UserRole = 'student';
    
    if (email.includes('mentor')) {
      role = 'mentor';
    } else if (email.includes('alumni')) {
      role = 'alumni';
    } else if (email.includes('employer')) {
      role = 'employer';
    } else if (email.includes('admin')) {
      role = 'admin';
    }
    
    const mockUser: User = {
      email,
      firstName: 'Sarah',
      lastName: 'Johnson',
      role: role
    };
    setUser(mockUser);
  };

  const register = async (email: string, password: string, firstName: string, lastName: string, role: UserRole) => {
    // Mock registration - in real app, this would call an API
    const newUser: User = {
      email,
      firstName,
      lastName,
      role
    };
    setUser(newUser);
    
    // Only students need onboarding
    if (role === 'student') {
      setNeedsOnboarding(true);
    }
  };

  const logout = () => {
    setUser(null);
    setNeedsOnboarding(false);
  };

  const completeOnboarding = () => {
    setNeedsOnboarding(false);
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      register,
      logout,
      completeOnboarding,
      needsOnboarding
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
