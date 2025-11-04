import { useState } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { useAuth } from '../../hooks/use-auth';
import { GraduationCap, Users, Briefcase, Star } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';



export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [forgotPassword, setForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, error } = useAuth();
  const [, setLocation] = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      setIsLoading(true);
      setMessage('');
      try {
        await login(email, password);
        console.log('Login successful, should redirect now');
      } catch (error) {
        console.error('Login error:', error);
        setMessage((error as Error).message || 'Login failed. Please check your credentials.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (forgotEmail) {
      try {
        const response = await fetch('http://localhost:8000/api/forgot-password/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: forgotEmail,
          }),
        });
        const data = await response.json();
        if (data.status === 'success') {
          setMessage(data.message || 'Password reset successful.');
        } else {
          setMessage(data.message || 'Failed to reset password.');
        }
      } catch (error) {
        setMessage('An error occurred. Please try again.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#5D89B4]/50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full grid md:grid-cols-2 gap-8">
        
        {/* Banner Card */}
        <Card className="bg-gradient-to-br from-[#5D89B4] to-[#4a6d91] text-white border-0">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold mb-4">Welcome Back to FuSteps</CardTitle>
            <p className="text-white/90 text-lg">Continue your journey to success</p>
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

        {/* Login Details Card */}
        <Card className="bg-white shadow-xl">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <img src="/fu steps logo.png" alt="FuSteps Logo" className="h-16 w-auto" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900 text-center">Sign In</CardTitle>
            <p className="text-gray-600 text-center">Welcome back! Please sign in to your account</p>
          </CardHeader>
          <CardContent>
            {forgotPassword ? (
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5D89B4] focus:border-transparent"
                    placeholder="your.email@example.com"
                    required
                  />
                </div>

                {message && (
                  <div className="text-sm text-green-600 bg-green-50 p-2 rounded">
                    {message}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-[#5D89B4] text-white py-2 rounded-lg hover:bg-[#4a6d91] transition-colors font-medium"
                >
                  Reset Password
                </button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setForgotPassword(false)}
                    className="text-sm text-[#5D89B4] hover:text-[#4a6d91] font-medium"
                  >
                    Back to Login
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
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

                <div className="text-right">
                  <button
                    type="button"
                    onClick={() => setForgotPassword(true)}
                    className="text-sm text-[#5D89B4] hover:text-[#4a6d91] font-medium"
                  >
                    Forgot Password?
                  </button>
                </div>

                {(message || error) && (
                  <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
                    {message || error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#5D89B4] text-white py-2 rounded-lg hover:bg-[#4a6d91] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Signing In...' : 'Sign In'}
                </button>
              </form>
            )}
            
            <p className="text-center text-sm text-gray-500 mt-4">
              Don't have an account? 
              <button onClick={() => setLocation('/signup')} className="text-[#5D89B4] hover:text-[#4a6d91] font-medium ml-1">
                Sign up
              </button>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}