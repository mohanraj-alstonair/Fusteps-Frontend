import { useState } from 'react';
import { X } from 'lucide-react';
import { useAuth, UserRole } from '../../hooks/use-auth';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
}

export default function RegisterModal({ isOpen, onClose, onSwitchToLogin }: RegisterModalProps) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole | ''>('');
  const { register } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password && firstName && lastName && role) {
      await register(email, password, firstName, lastName, role as UserRole);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-ink-900 bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-modal max-w-md w-full p-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-display font-bold text-ink-900">Join FuSteps</h2>
          <button 
            onClick={onClose}
            className="text-ink-300 hover:text-ink-700 transition-custom"
            data-testid="button-close-register"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-ink-700 mb-2">First Name</label>
              <input 
                type="text" 
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sun-500 focus:border-transparent transition-custom" 
                placeholder="John"
                data-testid="input-first-name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-ink-700 mb-2">Last Name</label>
              <input 
                type="text" 
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sun-500 focus:border-transparent transition-custom" 
                placeholder="Doe"
                data-testid="input-last-name"
                required
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-ink-700 mb-2">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sun-500 focus:border-transparent transition-custom" 
              placeholder="your.email@example.com"
              data-testid="input-email"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-ink-700 mb-2">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sun-500 focus:border-transparent transition-custom" 
              placeholder="••••••••"
              data-testid="input-password"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-ink-700 mb-2">Role</label>
            <select 
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sun-500 focus:border-transparent transition-custom"
              data-testid="select-role"
              required
            >
              <option value="">Select your role</option>
              <option value="student">Student</option>
              <option value="mentor">Mentor</option>
              <option value="alumni">Alumni</option>
              <option value="employer">Employer</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          
          <button 
            type="submit"
            className="w-full bg-ink-900 text-white py-3 rounded-lg hover:opacity-90 transition-custom font-semibold"
            data-testid="button-create-account"
          >
            Create Account
          </button>
        </form>
        
        <p className="text-center text-sm text-ink-500 mt-6">
          Already have an account? 
          <button 
            onClick={onSwitchToLogin}
            className="text-sun-700 hover:text-sun-900 font-semibold transition-custom ml-1"
            data-testid="button-switch-login"
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
}
