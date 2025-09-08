import { useState } from 'react';
import { ArrowLeft, ArrowRight, Upload } from 'lucide-react';
import { useAuth } from '../../hooks/use-auth';

export default function OnboardingFlow() {
  const [currentStep, setCurrentStep] = useState(1);
  const [careerGoal, setCareerGoal] = useState('');
  const [education, setEducation] = useState('');
  const [fieldOfStudy, setFieldOfStudy] = useState('');
  const [skills, setSkills] = useState<string[]>(['JavaScript', 'Project Management', 'Data Analysis']);
  const [careerGoals, setCareerGoals] = useState('');
  const [linkedIn, setLinkedIn] = useState('');
  const [portfolio, setPortfolio] = useState('');
  const { completeOnboarding } = useAuth();

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    completeOnboarding();
  };

  const progress = (currentStep / 3) * 100;

  return (
    <div className="min-h-screen bg-neutral-25">
      <div className="max-w-2xl mx-auto py-12 px-4">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-ink-500">Step {currentStep} of 3</span>
            <span className="text-sm text-ink-500">{Math.round(progress)}% Complete</span>
          </div>
          <div className="w-full bg-neutral-100 rounded-full h-2">
            <div 
              className="bg-sun-500 h-2 rounded-full transition-all duration-500" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Step 1: Career Preference */}
        {currentStep === 1 && (
          <div className="bg-white rounded-2xl shadow-card p-8">
            <h2 className="text-3xl font-display font-bold text-ink-900 mb-2">What's your primary goal?</h2>
            <p className="text-ink-500 mb-8">Tell us what you're looking for so we can personalize your experience.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { value: 'job', title: 'Full-time Job', description: 'Find permanent employment', color: 'sun' },
                { value: 'internship', title: 'Internship', description: 'Gain work experience', color: 'leaf' },
                { value: 'skills', title: 'Skill Upgrade', description: 'Learn new skills', color: 'slate' },
                { value: 'startup', title: 'Startup Idea', description: 'Launch your own venture', color: 'ember' }
              ].map(({ value, title, description, color }) => (
                <label key={value} className="block">
                  <input 
                    type="radio" 
                    name="career-goal" 
                    value={value}
                    checked={careerGoal === value}
                    onChange={(e) => setCareerGoal(e.target.value)}
                    className="sr-only peer"
                    data-testid={`radio-${value}`}
                  />
                  <div className="border-2 border-slate-200 rounded-xl p-6 cursor-pointer peer-checked:border-sun-500 peer-checked:bg-sun-50 hover:border-slate-300 transition-custom">
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 bg-${color}-100 rounded-xl flex items-center justify-center`}>
                        <div className={`w-6 h-6 bg-${color}-500 rounded`}></div>
                      </div>
                      <div>
                        <h3 className="font-semibold text-ink-900">{title}</h3>
                        <p className="text-sm text-ink-500">{description}</p>
                      </div>
                    </div>
                  </div>
                </label>
              ))}
            </div>
            
            <div className="flex justify-end mt-8">
              <button 
                onClick={nextStep}
                disabled={!careerGoal}
                className="bg-ink-900 text-white px-6 py-3 rounded-lg hover:opacity-90 transition-custom font-semibold disabled:opacity-50"
                data-testid="button-continue-step1"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Education & Skills */}
        {currentStep === 2 && (
          <div className="bg-white rounded-2xl shadow-card p-8">
            <h2 className="text-3xl font-display font-bold text-ink-900 mb-2">Tell us about yourself</h2>
            <p className="text-ink-500 mb-8">Help us understand your background and aspirations.</p>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-ink-700 mb-2">Education Level</label>
                <select 
                  value={education}
                  onChange={(e) => setEducation(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sun-500 focus:border-transparent transition-custom"
                  data-testid="select-education"
                >
                  <option value="">Select education level</option>
                  <option value="high-school">High School</option>
                  <option value="bachelors">Bachelor's Degree</option>
                  <option value="masters">Master's Degree</option>
                  <option value="phd">PhD</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-ink-700 mb-2">Field of Study</label>
                <input 
                  type="text" 
                  value={fieldOfStudy}
                  onChange={(e) => setFieldOfStudy(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sun-500 focus:border-transparent transition-custom" 
                  placeholder="e.g., Computer Science, Marketing, etc."
                  data-testid="input-field-study"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-ink-700 mb-2">Key Skills</label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {skills.map((skill, index) => (
                    <span key={index} className="bg-sun-100 text-ink-900 px-3 py-1 rounded-full text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
                <input 
                  type="text" 
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sun-500 focus:border-transparent transition-custom" 
                  placeholder="Add skills (press Enter to add)"
                  data-testid="input-skills"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const input = e.target as HTMLInputElement;
                      if (input.value.trim()) {
                        setSkills([...skills, input.value.trim()]);
                        input.value = '';
                      }
                    }
                  }}
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-ink-700 mb-2">Career Goals</label>
                <textarea 
                  rows={4} 
                  value={careerGoals}
                  onChange={(e) => setCareerGoals(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sun-500 focus:border-transparent transition-custom" 
                  placeholder="Tell us about your career aspirations..."
                  data-testid="textarea-career-goals"
                />
              </div>
            </div>
            
            <div className="flex justify-between mt-8">
              <button 
                onClick={prevStep}
                className="text-ink-500 hover:text-ink-700 px-6 py-3 transition-custom font-semibold flex items-center"
                data-testid="button-back-step2"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </button>
              <button 
                onClick={nextStep}
                className="bg-ink-900 text-white px-6 py-3 rounded-lg hover:opacity-90 transition-custom font-semibold flex items-center"
                data-testid="button-continue-step2"
              >
                Continue
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Profile Completion */}
        {currentStep === 3 && (
          <div className="bg-white rounded-2xl shadow-card p-8">
            <h2 className="text-3xl font-display font-bold text-ink-900 mb-2">Complete your profile</h2>
            <p className="text-ink-500 mb-8">Upload your resume and finish setting up your profile.</p>
            
            {/* Profile Completeness */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold text-ink-700">Profile Completeness</span>
                <span className="text-sm text-ink-500">75% Complete</span>
              </div>
              <div className="w-full bg-neutral-100 rounded-full h-2">
                <div className="bg-leaf-500 h-2 rounded-full" style={{ width: '75%' }}></div>
              </div>
            </div>
            
            {/* Resume Upload */}
            <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center mb-6 hover:border-sun-500 transition-custom">
              <div className="w-16 h-16 bg-sun-100 rounded-xl mx-auto mb-4 flex items-center justify-center">
                <Upload className="w-8 h-8 text-sun-700" />
              </div>
              <h3 className="font-semibold text-ink-900 mb-2">Upload your resume</h3>
              <p className="text-ink-500 mb-4">Drag and drop your file here, or click to browse</p>
              <button className="bg-sun-100 text-ink-900 px-4 py-2 rounded-lg hover:bg-sun-300 transition-custom font-semibold" data-testid="button-choose-file">
                Choose File
              </button>
              <p className="text-xs text-ink-300 mt-2">PDF, DOC, DOCX up to 10MB</p>
            </div>
            
            {/* Additional Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-sm font-semibold text-ink-700 mb-2">LinkedIn Profile</label>
                <input 
                  type="url" 
                  value={linkedIn}
                  onChange={(e) => setLinkedIn(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sun-500 focus:border-transparent transition-custom" 
                  placeholder="https://linkedin.com/in/yourname"
                  data-testid="input-linkedin"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-ink-700 mb-2">Portfolio/GitHub</label>
                <input 
                  type="url" 
                  value={portfolio}
                  onChange={(e) => setPortfolio(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sun-500 focus:border-transparent transition-custom" 
                  placeholder="https://github.com/yourname"
                  data-testid="input-portfolio"
                />
              </div>
            </div>
            
            <div className="flex justify-between">
              <button 
                onClick={prevStep}
                className="text-ink-500 hover:text-ink-700 px-6 py-3 transition-custom font-semibold flex items-center"
                data-testid="button-back-step3"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </button>
              <button 
                onClick={handleComplete}
                className="bg-ink-900 text-white px-6 py-3 rounded-lg hover:opacity-90 transition-custom font-semibold"
                data-testid="button-complete-setup"
              >
                Complete Setup
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
