import { useState } from 'react';
import { X } from 'lucide-react';
import { useAuth } from '../../hooks/use-auth';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToRegister: () => void;
}

export default function LoginModal({ isOpen, onClose, onSwitchToRegister }: LoginModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const { login } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      await login(email, password);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-ink-900 bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-modal max-w-md w-full p-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-display font-bold text-ink-900">Welcome Back</h2>
          <button 
            onClick={onClose}
            className="text-ink-300 hover:text-ink-700 transition-custom"
            data-testid="button-close-login"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
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
          
          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input 
                type="checkbox" 
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-slate-300 text-sun-500 focus:ring-sun-500"
                data-testid="checkbox-remember"
              />
              <span className="ml-2 text-sm text-ink-500">Remember me</span>
            </label>
            <a href="#" className="text-sm text-sun-700 hover:text-sun-900 transition-custom">Forgot password?</a>
          </div>
          
          <button 
            type="submit"
            className="w-full bg-ink-900 text-white py-3 rounded-lg hover:opacity-90 transition-custom font-semibold"
            data-testid="button-sign-in"
          >
            Sign In
          </button>
        </form>
        
        <p className="text-center text-sm text-ink-500 mt-6">
          Don't have an account? 
          <button 
            onClick={onSwitchToRegister}
            className="text-sun-700 hover:text-sun-900 font-semibold transition-custom ml-1"
            data-testid="button-switch-register"
          >
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
}
