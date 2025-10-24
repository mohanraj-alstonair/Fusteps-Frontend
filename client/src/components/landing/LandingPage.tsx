import { useState } from 'react';
import { useLocation } from 'wouter';
import { BookOpen, Users, Building, Briefcase, CheckCircle, Star, ArrowRight, Play, Globe, Award, Target, Zap } from 'lucide-react';
import LoginModal from '../auth/LoginModal';
import RegisterModal from '../auth/RegisterModal';
import fustepsLogo from '../../assets/fusteps-logo.png';

export default function LandingPage() {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-neutral-25 font-body">
      {/* Top Navigation */}
      <nav className="bg-white shadow-sm border-b border-neutral-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <img src={fustepsLogo} alt="FuSteps Logo" className="h-10 w-auto" />
              </div>
              <div className="hidden md:ml-10 md:flex space-x-8">
                <a href="#features" className="menu-item text-ink-700 px-3 py-2 text-sm font-medium">Features</a>
                <a href="#how-it-works" className="menu-item text-ink-700 px-3 py-2 text-sm font-medium">How It Works</a>
                <a href="#testimonials" className="menu-item text-ink-700 px-3 py-2 text-sm font-medium">Success Stories</a>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setLocation('/login')}
                className="menu-item text-ink-700 px-3 py-2 rounded-lg"
                data-testid="button-login"
              >
                Login
              </button>
              <button 
                onClick={() => setLocation('/signup')}
                className="bg-ink-900 text-white px-4 py-2 rounded-2xl hover:opacity-90 transition-all duration-300 font-semibold"
                data-testid="button-register"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-sky-100 via-white to-leaf-100 min-h-[calc(100vh-4rem)]">
        <div className="absolute inset-0 bg-white bg-opacity-50"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-center">
            <div className="lg:col-span-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-ink-900 mb-6 leading-tight">
                Your Career Companion, 
                <span className="text-transparent bg-gradient-to-r from-sky-500 to-leaf-500 bg-clip-text"> All in One Place</span>
              </h1>
              <p className="text-lg md:text-xl text-ink-700 mb-8 max-w-2xl leading-relaxed">
                Explore internships, upgrade skills, connect with mentors, and launch your dream career—all from your FuSteps dashboard.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => setLocation('/signup')}
                  className="bg-sky-500 text-white px-8 py-4 rounded-2xl text-lg font-semibold hover:opacity-90 transition-all duration-300 transform hover:scale-105 shadow-lg"
                  data-testid="button-get-started"
                >
                  Get Started Free
                  <ArrowRight className="inline-block ml-2 w-5 h-5" />
                </button>
                <button className="bg-white text-sky-600 px-8 py-4 rounded-2xl text-lg font-semibold border-2 border-sky-200 hover:bg-neutral-25 transition-all duration-300 transform hover:scale-105">
                  <Play className="inline-block mr-2 w-5 h-5" />
                  Watch Demo
                </button>
              </div>
              <div className="mt-8 flex items-center space-x-6 text-sm text-ink-500">
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-leaf-500 mr-2" />
                  Free to get started
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-leaf-500 mr-2" />
                  No credit card required
                </div>
              </div>
            </div>
            <div className="lg:col-span-6 mt-10 lg:mt-0">
              <div className="relative">
                <div className="bg-gradient-to-br from-sky-500 to-leaf-500 rounded-3xl p-1">
                  <div className="bg-white rounded-3xl p-8 shadow-2xl">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-sky-500 rounded-xl flex items-center justify-center">
                          <BookOpen className="w-5 h-5 text-ink-900" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-ink-900">Dashboard Overview</h3>
                          <p className="text-sm text-ink-500">Track your career progress</p>
                        </div>
                      </div>
                      <div className="bg-gradient-to-r from-sky-100 to-leaf-100 rounded-xl p-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-ink-700">Career Progress</span>
                          <span className="text-sm font-bold text-ink-900">75%</span>
                        </div>
                        <div className="w-full bg-neutral-100 rounded-full h-2">
                          <div className="bg-gradient-to-r from-sky-500 to-leaf-500 h-2 rounded-full w-3/4"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold text-ink-900 mb-4">How FuSteps Works</h2>
            <p className="text-xl text-ink-500 max-w-3xl mx-auto">Get started on your career journey in just a few simple steps</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Sign Up & Choose Role', description: 'Create your account and select your role: Student, Mentor, Alumni, or Employer', icon: Users, color: 'sky' },
              { step: '02', title: 'Complete Onboarding', description: 'Tell us about your goals, skills, and preferences to personalize your experience', icon: Target, color: 'leaf' },
              { step: '03', title: 'Explore Opportunities', description: 'Browse internships, courses, mentors, and start building your professional network', icon: Globe, color: 'slate' },
              { step: '04', title: 'Track Your Progress', description: 'Monitor your growth with our comprehensive dashboard and achieve your career goals', icon: Award, color: 'ember' }
            ].map(({ step, title, description, icon: Icon, color }, index) => (
              <div key={index} className="relative">
                <div className={`bg-gradient-to-br from-${color}-100 to-${color}-300 rounded-2xl p-8 text-center transition-all duration-300 hover:scale-105 hover:shadow-lg`}>
                  <div className="relative mb-6">
                    <div className={`w-16 h-16 bg-${color}-500 rounded-xl mx-auto mb-4 flex items-center justify-center`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-ink-900 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {step}
                    </div>
                  </div>
                  <h3 className="text-xl font-display font-semibold text-ink-900 mb-3">{title}</h3>
                  <p className="text-ink-700 leading-relaxed">{description}</p>
                </div>
                {index < 3 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                    <ArrowRight className="w-6 h-6 text-slate-300" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-gradient-to-br from-neutral-25 to-sky-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold text-ink-900 mb-4">Everything You Need to Succeed</h2>
            <p className="text-xl text-ink-500 max-w-3xl mx-auto">Comprehensive tools and resources for every stage of your career journey</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: 'Internship Hub', description: 'Discover and apply to top internships from leading companies worldwide', icon: Briefcase, color: 'sky' },
              { title: 'Learning Platform', description: 'Access courses, tutorials, and skill assessments to boost your expertise', icon: BookOpen, color: 'leaf' },
              { title: 'Mentor Network', description: 'Connect with industry professionals for personalized guidance and advice', icon: Users, color: 'slate' },
              { title: 'Resume Builder', description: 'Create professional resumes with AI-powered suggestions and templates', icon: Building, color: 'ember' },
              { title: 'Study Abroad', description: 'Explore international education opportunities and application guidance', icon: Globe, color: 'sky' },
              { title: 'Progress Tracking', description: 'Monitor your career development with detailed analytics and insights', icon: Award, color: 'leaf' }
            ].map(({ title, description, icon: Icon, color }, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl group">
                <div className={`w-14 h-14 bg-gradient-to-br from-${color}-400 to-${color}-600 rounded-xl mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-display font-semibold text-ink-900 mb-3">{title}</h3>
                <p className="text-ink-700 leading-relaxed">{description}</p>
                <div className="mt-4">
                  <span className="text-sm font-semibold text-slate-500 group-hover:text-ink-900 transition-colors duration-300">
                    Learn more →
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose FuSteps Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
            <div>
              <h2 className="text-4xl font-display font-bold text-ink-900 mb-6">Why Students Choose FuSteps</h2>
              <p className="text-xl text-ink-500 mb-8">Join thousands of students who have accelerated their career growth with our comprehensive platform.</p>

              <div className="space-y-6">
                {[
                  { title: 'Personalized Recommendations', description: 'AI-powered matching for internships, courses, and mentors based on your goals' },
                  { title: 'In-App Mentor Support', description: 'Direct access to industry professionals for real-time guidance and feedback' },
                  { title: 'Gamified Learning Experience', description: 'Earn badges, track streaks, and compete with peers to stay motivated' },
                  { title: 'Industry-Relevant Content', description: 'Curated resources and opportunities from top companies and universities' }
                ].map(({ title, description }, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="w-6 h-6 bg-leaf-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-ink-900 mb-1">{title}</h3>
                      <p className="text-ink-700">{description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-10 lg:mt-0">
              <div className="relative">
                <div className="bg-gradient-to-br from-leaf-100 to-sky-100 rounded-3xl p-8">
                  <div className="bg-white rounded-2xl p-6 shadow-lg">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-ink-900">Success Metrics</h3>
                      <Zap className="w-5 h-5 text-sky-500" />
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-ink-700">Internship Success Rate</span>
                        <span className="font-bold text-leaf-500">94%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-ink-700">Average Skill Improvement</span>
                        <span className="font-bold text-sky-500">65%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-ink-700">Student Satisfaction</span>
                        <span className="font-bold text-ember-500">4.8/5</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-24 bg-gradient-to-br from-slate-100 to-neutral-25">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold text-ink-900 mb-4">Success Stories</h2>
            <p className="text-xl text-ink-500">Hear from students who transformed their careers with FuSteps</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { name: 'Sarah Chen', role: 'Software Engineer', company: 'Microsoft', quote: 'FuSteps helped me land my dream internship at Microsoft. The mentor support was incredible!', avatar: '👩‍💻', rating: 5 },
              { name: 'Alex Kumar', role: 'Data Scientist', company: 'Google', quote: 'The learning platform and project tracking features made all the difference in my career journey.', avatar: '👨‍💻', rating: 5 },
              { name: 'Maria Rodriguez', role: 'Product Manager', company: 'Apple', quote: 'From courses to networking, FuSteps provided everything I needed to break into product management.', avatar: '👩‍💼', rating: 5 }
            ].map(({ name, role, company, quote, avatar, rating }, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg transition-all duration-300 hover:scale-105">
                <div className="flex items-center mb-4">
                  {[...Array(rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-sky-500 fill-current" />
                  ))}
                </div>
                <p className="text-ink-700 mb-6 italic leading-relaxed">"{quote}"</p>
                <div className="flex items-center">
                  <div className="text-4xl mr-4">{avatar}</div>
                  <div>
                    <h4 className="font-semibold text-ink-900">{name}</h4>
                    <p className="text-sm text-ink-500">{role} at {company}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 bg-gradient-to-br from-sky-100 to-leaf-100">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-ink-900 mb-6">
            Ready to Level Up Your Career?
          </h2>
          <p className="text-xl text-ink-700 mb-8 max-w-2xl mx-auto">
            Join thousands of students who are already building their dream careers with FuSteps.
          </p>
          <button 
            onClick={() => setLocation('/signup')}
            className="bg-ink-900 text-white px-10 py-5 rounded-2xl text-xl font-semibold hover:opacity-90 transition-all duration-300 transform hover:scale-105 shadow-xl"
          >
            Join FuSteps Today
            <ArrowRight className="inline-block ml-3 w-6 h-6" />
          </button>
          <p className="text-sm text-ink-500 mt-4">Free to get started • No credit card required</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-ink-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-display font-bold mb-4">FuSteps</h3>
              <p className="text-neutral-300 mb-4">Your career companion for landing internships, building skills, and connecting with mentors.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Students</h4>
              <ul className="space-y-2 text-neutral-300">
                <li><a href="#" className="hover:text-white transition-colors">Find Internships</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Take Courses</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Connect with Mentors</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Study Abroad</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Organizations</h4>
              <ul className="space-y-2 text-neutral-300">
                <li><a href="#" className="hover:text-white transition-colors">Post Internships</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Find Talent</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Become a Mentor</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Partner with Us</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-neutral-300">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-neutral-700 mt-12 pt-8 text-center text-neutral-300">
            <p>&copy; 2024 FuSteps. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <LoginModal 
        isOpen={showLogin} 
        onClose={() => setShowLogin(false)}
        onSwitchToRegister={() => {
          setShowLogin(false);
          setShowRegister(true);
        }}
      />
      <RegisterModal 
        isOpen={showRegister} 
        onClose={() => setShowRegister(false)}
        onSwitchToLogin={() => {
          setShowRegister(false);
          setShowLogin(true);
        }}
      />
    </div>
  );
}