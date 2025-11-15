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
  const [role, setRole] = useState<'student' | 'mentor' | 'admin' | 'alumni'>('student');
  const [mentorName, setMentorName] = useState('');
  const [mentorExpertise, setMentorExpertise] = useState('');
  const [mentorExperienceYears, setMentorExperienceYears] = useState(0);
  const [mentorDegree, setMentorDegree] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isMentorSelected, setIsMentorSelected] = useState(false);
  const { login } = useAuth();

  if (!isOpen) return null;

  const handleRoleChange = (selectedRole: 'student' | 'mentor' | 'admin' | 'alumni') => {
    setRole(selectedRole);
    setIsMentorSelected(selectedRole === 'mentor');
    if (selectedRole !== 'mentor') {
      setMentorName('');
      setMentorExpertise('');
      setMentorExperienceYears(0);
      setMentorDegree('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    if (role === 'mentor') {
      if (!mentorName || !mentorExpertise || !mentorExperienceYears || !mentorDegree) {
        alert('Please provide all mentor details: name, expertise, years of experience, and degree.');
        return;
      }
      try {
        const response = await fetch('http://127.0.0.1:8000/api/mentors/login/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            email, 
            name: mentorName, 
            expertise: mentorExpertise,
            experience_years: mentorExperienceYears,
            degree: mentorDegree
          }),
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.message || 'Login failed');
        console.log('Mentor login successful:', result);
        await login(email, password); // Mock general login
        onClose();
      } catch (err) {
        console.error('Mentor login error:', err);
        alert(`Failed to login as mentor: ${(err as Error).message}`);
      }
    } else if (role === 'student') {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/students/login/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.message || 'Login failed');
        console.log('Student login successful:', result);
        await login(email, password); // Mock general login
        onClose();
      } catch (err) {
        console.error('Student login error:', err);
        alert(`Failed to login as student: ${(err as Error).message}`);
      }
    } else {
      // For other roles, use mock login
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
            <label className="block text-sm font-semibold text-ink-700 mb-2">Role</label>
            <select 
              value={role}
              onChange={(e) => handleRoleChange(e.target.value as 'student' | 'mentor' | 'admin' | 'alumni')}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sun-500 focus:border-transparent transition-custom"
              required
            >
              <option value="student">Student</option>
              <option value="mentor">Mentor</option>
              <option value="admin">Admin</option>
              <option value="alumni">Alumni</option>
            </select>
          </div>

          {isMentorSelected && (
            <>
              <div>
                <label className="block text-sm font-semibold text-ink-700 mb-2">Full Name (Mentor)</label>
                <input 
                  type="text"
                  value={mentorName}
                  onChange={(e) => setMentorName(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sun-500 focus:border-transparent transition-custom" 
                  placeholder="Your full name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-ink-700 mb-2">Expertise/Skill</label>
                <input 
                  type="text"
                  value={mentorExpertise}
                  onChange={(e) => setMentorExpertise(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sun-500 focus:border-transparent transition-custom" 
                  placeholder="e.g., AI Development, Software Engineering"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-ink-700 mb-2">Years of Experience</label>
                <input 
                  type="number"
                  value={mentorExperienceYears}
                  onChange={(e) => setMentorExperienceYears(parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sun-500 focus:border-transparent transition-custom" 
                  placeholder="e.g., 5"
                  min="0"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-ink-700 mb-2">Degree</label>
                <input 
                  type="text"
                  value={mentorDegree}
                  onChange={(e) => setMentorDegree(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sun-500 focus:border-transparent transition-custom" 
                  placeholder="e.g., M.Tech, PhD"
                  required
                />
              </div>
            </>
          )}
          
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
