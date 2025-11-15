import { useState } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { useAuth } from '../../hooks/use-auth';
import { GraduationCap, Users, Briefcase, Star } from 'lucide-react';

export default function SignUpPage() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const [, setLocation] = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      setError('All fields are required');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    try {
      setLoading(true);
      const signupData = {
        firstName,
        lastName,
        email,
        password,
        role: 'student' // Default to student
      };

      console.log('Sending signup data:', signupData);
      const response = await fetch('http://localhost:8000/api/register/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(signupData),
      });

      const result = await response.json();
      console.log('Backend response:', result);
      
      if (!response.ok) {
        throw new Error(result.error || 'Signup failed');
      }

      // Store user ID for onboarding
      localStorage.setItem('userId', result.candidate_id.toString());
      
      // Auto-login the user after successful registration
      await login(email, password);
      
    } catch (error) {
      console.error('Registration failed:', error);
      setError((error as Error).message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#5D89B4]/50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full grid md:grid-cols-2 gap-8">
        
        {/* Banner Card */}
        <Card className="bg-gradient-to-br from-[#5D89B4] to-[#4a6d91] text-white border-0">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold mb-4">Welcome to FuSteps</CardTitle>
            <p className="text-white/90 text-lg">Your journey to success starts here</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center space-x-3">
              <GraduationCap className="w-8 h-8 text-white/80" />
              <div>
                <h3 className="font-semibold">Learn & Grow</h3>
                <p className="text-white/90 text-sm">Access courses and resources</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Users className="w-8 h-8 text-white/80" />
              <div>
                <h3 className="font-semibold">Connect</h3>
                <p className="text-white/90 text-sm">Network with mentors and peers</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Briefcase className="w-8 h-8 text-white/80" />
              <div>
                <h3 className="font-semibold">Career Opportunities</h3>
                <p className="text-white/90 text-sm">Find internships and jobs</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Star className="w-8 h-8 text-white/80" />
              <div>
                <h3 className="font-semibold">Achieve Excellence</h3>
                <p className="text-white/90 text-sm">Reach your full potential</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sign Up Details Card */}
        <Card className="bg-white shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-900 text-center">Create Account</CardTitle>
            <p className="text-gray-600 text-center">Join thousands of students and professionals</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5D89B4] focus:border-transparent"
                    placeholder="John"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5D89B4] focus:border-transparent"
                    placeholder="Doe"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5D89B4] focus:border-transparent"
                  placeholder="your.email@example.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5D89B4] focus:border-transparent"
                  placeholder="••••••••"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5D89B4] focus:border-transparent"
                  placeholder="••••••••"
                  required
                />
              </div>

              {error && (
                <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:bg-blue-400 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-4">
              Already have an account?
              <button onClick={() => setLocation('/login')} className="text-blue-600 hover:text-blue-700 font-medium ml-1">
                Sign in
              </button>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}