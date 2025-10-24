import { useState } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { useAuth, UserRole } from '../../hooks/use-auth';
import { GraduationCap, Users, Briefcase, Star } from 'lucide-react';

export default function SignUpPage() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole | ''>('');
  const [mentorRole, setMentorRole] = useState('');
  const [skills, setSkills] = useState('');
  const [experienceYears, setExperienceYears] = useState('');
  const [educationLevel, setEducationLevel] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [mentorLocation, setMentorLocation] = useState('');
  const [fieldOfStudy, setFieldOfStudy] = useState('');
  const [yearOfPassout, setYearOfPassout] = useState('');
  const [degree, setDegree] = useState('');
  const [employerRole, setEmployerRole] = useState('');
  const { login } = useAuth(); // Removed 'register' since it's unused
  const [, setLocation] = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password && firstName && lastName && role) {
      try {
        const signupData: any = {
          email,
          password,
          name: `${firstName} ${lastName}`,
          role,
        };

        // Add role-specific data
        if (role === 'student') {
          signupData.year_of_passout = parseInt(yearOfPassout) || null;
          signupData.degree = degree;
          signupData.field_of_study = fieldOfStudy;
        } else if (role === 'mentor') {
          signupData.expertise = skills;
          signupData.experience_years = parseInt(experienceYears) || 0;
          signupData.education_level = educationLevel;
          signupData.company_name = companyName;
          signupData.location = mentorLocation;
          signupData.field_of_study = fieldOfStudy;
          signupData.mentor_role = mentorRole;
        } else if (role === 'alumni') {
          signupData.year_of_passout = parseInt(yearOfPassout) || null;
          signupData.degree = degree;
          signupData.company_name = companyName;
          signupData.location = mentorLocation;
          signupData.field_of_study = fieldOfStudy;
        } else if (role === 'employer') {
          signupData.company_name = companyName;
          signupData.location = mentorLocation;
          signupData.employer_role = employerRole;
        }
        // Admin has no extra fields

        const response = await fetch('http://localhost:8000/api/signup/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(signupData),
        });

        const result = await response.json();
        if (!response.ok) {
          throw new Error(result.message || 'Signup failed');
        }

        console.log('Signup successful:', result);
        // Auto-login the user after successful registration
        try {
          await login(email, password); // Removed 'role' argument
          // No need to set location, the auth hook will handle routing
        } catch (loginError) {
          console.error('Auto-login failed:', loginError);
          // Fallback to login page if auto-login fails
          setLocation('/login');
        }
      } catch (error) {
        console.error('Registration failed:', error);
        // TODO: Show error message to user
      }
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5D89B4] focus:border-transparent"
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

              {role === 'student' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Year of Passout</label>
                    <input
                      type="number"
                      value={yearOfPassout}
                      onChange={(e) => setYearOfPassout(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5D89B4] focus:border-transparent"
                      placeholder="e.g., 2023"
                      min="1900"
                      max="2030"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Degree</label>
                    <input
                      type="text"
                      value={degree}
                      onChange={(e) => setDegree(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5D89B4] focus:border-transparent"
                      placeholder="e.g., B.Tech in Computer Science"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Field of Study</label>
                    <input
                      type="text"
                      value={fieldOfStudy}
                      onChange={(e) => setFieldOfStudy(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5D89B4] focus:border-transparent"
                      placeholder="e.g., Computer Science"
                      required
                    />
                  </div>
                </div>
              )}

              {role === 'mentor' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mentor Role</label>
                    <input
                      type="text"
                      value={mentorRole}
                      onChange={(e) => setMentorRole(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5D89B4] focus:border-transparent"
                      placeholder="e.g., Software Engineer, Data Scientist"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5D89B4] focus:border-transparent"
                      placeholder="e.g., Tech Corp"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <input
                      type="text"
                      value={mentorLocation}
                      onChange={(e) => setMentorLocation(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5D89B4] focus:border-transparent"
                      placeholder="e.g., New York, NY"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Field of Study</label>
                    <input
                      type="text"
                      value={fieldOfStudy}
                      onChange={(e) => setFieldOfStudy(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5D89B4] focus:border-transparent"
                      placeholder="e.g., Computer Science"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Skills Known</label>
                    <input
                      type="text"
                      value={skills}
                      onChange={(e) => setSkills(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5D89B4] focus:border-transparent"
                      placeholder="e.g., JavaScript, Python, Leadership"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Years of Experience</label>
                    <input
                      type="number"
                      value={experienceYears}
                      onChange={(e) => setExperienceYears(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5D89B4] focus:border-transparent"
                      placeholder="e.g., 5"
                      min="0"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Education Level</label>
                    <select
                      value={educationLevel}
                      onChange={(e) => setEducationLevel(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5D89B4] focus:border-transparent"
                      required
                    >
                      <option value="">Select education level</option>
                      <option value="highschool">High School</option>
                      <option value="bachelors">Bachelor's Degree</option>
                      <option value="masters">Master's Degree</option>
                      <option value="phd">PhD</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
              )}

              {role === 'alumni' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Year of Passout</label>
                    <input
                      type="number"
                      value={yearOfPassout}
                      onChange={(e) => setYearOfPassout(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5D89B4] focus:border-transparent"
                      placeholder="e.g., 2020"
                      min="1900"
                      max="2030"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Degree</label>
                    <input
                      type="text"
                      value={degree}
                      onChange={(e) => setDegree(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5D89B4] focus:border-transparent"
                      placeholder="e.g., B.Tech in Computer Science"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5D89B4] focus:border-transparent"
                      placeholder="e.g., Tech Corp"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <input
                      type="text"
                      value={mentorLocation}
                      onChange={(e) => setMentorLocation(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5D89B4] focus:border-transparent"
                      placeholder="e.g., New York, NY"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Field of Study</label>
                    <input
                      type="text"
                      value={fieldOfStudy}
                      onChange={(e) => setFieldOfStudy(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5D89B4] focus:border-transparent"
                      placeholder="e.g., Computer Science"
                      required
                    />
                  </div>
                </div>
              )}

              {role === 'employer' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5D89B4] focus:border-transparent"
                      placeholder="e.g., Tech Corp"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <input
                      type="text"
                      value={mentorLocation}
                      onChange={(e) => setMentorLocation(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5D89B4] focus:border-transparent"
                      placeholder="e.g., New York, NY"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Employer Role</label>
                    <input
                      type="text"
                      value={employerRole}
                      onChange={(e) => setEmployerRole(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5D89B4] focus:border-transparent"
                      placeholder="e.g., HR Manager, CEO"
                      required
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Create Account
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