import { useState } from 'react';
import { BookOpen, Users, Building, Briefcase } from 'lucide-react';
import LoginModal from '../auth/LoginModal';
import RegisterModal from '../auth/RegisterModal';

export default function LandingPage() {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  return (
    <div className="min-h-screen bg-neutral-25 font-body">
      {/* Top Navigation */}
      <nav className="bg-white shadow-card border-b border-neutral-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-display font-bold text-ink-900">FuSteps</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setShowLogin(true)}
                className="text-ink-700 hover:text-ink-900 px-3 py-2 rounded-lg transition-custom"
                data-testid="button-login"
              >
                Login
              </button>
              <button 
                onClick={() => setShowRegister(true)}
                className="bg-ink-900 text-white px-4 py-2 rounded-lg hover:opacity-90 transition-custom"
                data-testid="button-register"
              >
                Register
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-sun-100 to-leaf-100 min-h-[calc(100vh-4rem)]">
        <div className="absolute inset-0 bg-white bg-opacity-40"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-display font-bold text-ink-900 mb-6">
              Your Career Journey Starts Here
            </h1>
            <p className="text-xl text-ink-500 mb-8 max-w-3xl mx-auto">
              Connect with mentors, find internships, build skills, and accelerate your professional growth with FuSteps.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => setShowRegister(true)}
                className="bg-ink-900 text-white px-8 py-4 rounded-2xl text-lg font-semibold hover:opacity-90 transition-custom"
                data-testid="button-get-started"
              >
                Get Started
              </button>
              <button className="bg-white text-ink-900 px-8 py-4 rounded-2xl text-lg font-semibold border-2 border-ink-200 hover:bg-neutral-25 transition-custom">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold text-ink-900 mb-4">Built for Every Career Stage</h2>
            <p className="text-xl text-ink-500">Whether you're a student, mentor, alumni, or employer - we've got you covered.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Student Card */}
            <div className="bg-gradient-to-br from-sun-100 to-sun-300 rounded-2xl p-8 card-hover">
              <div className="w-12 h-12 bg-sun-500 rounded-xl mb-6 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-ink-900" />
              </div>
              <h3 className="text-xl font-display font-semibold text-ink-900 mb-3">Students</h3>
              <p className="text-ink-700">Find internships, courses, mentors, and build your professional network.</p>
            </div>

            {/* Mentor Card */}
            <div className="bg-gradient-to-br from-leaf-100 to-leaf-300 rounded-2xl p-8 card-hover">
              <div className="w-12 h-12 bg-leaf-500 rounded-xl mb-6 flex items-center justify-center">
                <Users className="w-6 h-6 text-ink-900" />
              </div>
              <h3 className="text-xl font-display font-semibold text-ink-900 mb-3">Mentors</h3>
              <p className="text-ink-700">Share your expertise, guide students, and make a lasting impact.</p>
            </div>

            {/* Alumni Card */}
            <div className="bg-gradient-to-br from-slate-100 to-slate-300 rounded-2xl p-8 card-hover">
              <div className="w-12 h-12 bg-slate-500 rounded-xl mb-6 flex items-center justify-center">
                <Building className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-display font-semibold text-ink-900 mb-3">Alumni</h3>
              <p className="text-ink-700">Give back to your community and expand your professional network.</p>
            </div>

            {/* Employer Card */}
            <div className="bg-gradient-to-br from-ember-100 to-ember-300 rounded-2xl p-8 card-hover">
              <div className="w-12 h-12 bg-ember-500 rounded-xl mb-6 flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-display font-semibold text-ink-900 mb-3">Employers</h3>
              <p className="text-ink-700">Find top talent, post opportunities, and build your employer brand.</p>
            </div>
          </div>
        </div>
      </div>

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
