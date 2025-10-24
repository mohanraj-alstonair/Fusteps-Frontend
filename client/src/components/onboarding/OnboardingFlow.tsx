import { useState } from 'react';
import { ArrowLeft, Briefcase, GraduationCap, BookOpen, Lightbulb, User, Mail, Phone, FileText } from 'lucide-react';
import { useAuth } from '../../hooks/use-auth';
import { api } from '../../lib/api';

const backendUrl = 'http://localhost:8000/api';

// Define interface for backend response
interface ResumeData {
  name: string;
  email: string;
  phone: string;
  skills?: string[];
  degree?: string;
  major?: string; // Maps to field_of_study
  university?: string;
  gpa?: string; // Maps to cgpa
  careerGoals?: string;
  linkedIn?: string;
  portfolio?: string;
  error?: string; // For backend error responses
}

const degreeOptions = [
  { value: 'be', label: 'BE' },
  { value: 'btech', label: 'BTech' },
  { value: 'bcom', label: 'BCom' },
  { value: 'bsc', label: 'BSc' },
  { value: 'ba', label: 'BA' },
  { value: 'bba', label: 'BBA' },
  { value: 'bca', label: 'BCA' },
  { value: 'mtech', label: 'MTech' },
  { value: 'msc', label: 'MSc' },
  { value: 'ma', label: 'MA' },
  { value: 'mcom', label: 'MCom' },
  { value: 'mba', label: 'MBA' },
  { value: 'mca', label: 'MCA' },
  { value: 'phd', label: 'PhD' },
  { value: 'other', label: 'Other' },
];

const fieldOfStudyOptions: Record<string, { value: string; label: string }[]> = {
  be: [
    { value: 'computer-science', label: 'Computer Science' },
    { value: 'electronics', label: 'Electronics' },
    { value: 'mechanical', label: 'Mechanical' },
    { value: 'civil', label: 'Civil' },
    { value: 'electrical', label: 'Electrical' },
    { value: 'chemical', label: 'Chemical' },
    { value: 'aerospace', label: 'Aerospace' },
    { value: 'biotechnology', label: 'Biotechnology' },
  ],
  btech: [
    { value: 'computer-science', label: 'Computer Science' },
    { value: 'electronics', label: 'Electronics' },
    { value: 'mechanical', label: 'Mechanical' },
    { value: 'civil', label: 'Civil' },
    { value: 'electrical', label: 'Electrical' },
    { value: 'chemical', label: 'Chemical' },
    { value: 'information-technology', label: 'Information Technology' },
    { value: 'biotechnology', label: 'Biotechnology' },
  ],
  bcom: [
    { value: 'accounting', label: 'Accounting' },
    { value: 'finance', label: 'Finance' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'business-administration', label: 'Business Administration' },
    { value: 'economics', label: 'Economics' },
    { value: 'banking', label: 'Banking' },
  ],
  bsc: [
    { value: 'physics', label: 'Physics' },
    { value: 'chemistry', label: 'Chemistry' },
    { value: 'mathematics', label: 'Mathematics' },
    { value: 'biology', label: 'Biology' },
    { value: 'computer-science', label: 'Computer Science' },
    { value: 'statistics', label: 'Statistics' },
    { value: 'zoology', label: 'Zoology' },
    { value: 'botany', label: 'Botany' },
  ],
  ba: [
    { value: 'history', label: 'History' },
    { value: 'english', label: 'English' },
    { value: 'psychology', label: 'Psychology' },
    { value: 'sociology', label: 'Sociology' },
    { value: 'political-science', label: 'Political Science' },
    { value: 'economics', label: 'Economics' },
    { value: 'philosophy', label: 'Philosophy' },
    { value: 'geography', label: 'Geography' },
  ],
  bba: [
    { value: 'business-administration', label: 'Business Administration' },
    { value: 'finance', label: 'Finance' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'human-resources', label: 'Human Resources' },
    { value: 'international-business', label: 'International Business' },
  ],
  bca: [
    { value: 'computer-applications', label: 'Computer Applications' },
    { value: 'software-development', label: 'Software Development' },
    { value: 'database-management', label: 'Database Management' },
    { value: 'web-development', label: 'Web Development' },
  ],
  mtech: [
    { value: 'computer-science', label: 'Computer Science' },
    { value: 'electronics', label: 'Electronics' },
    { value: 'mechanical', label: 'Mechanical' },
    { value: 'civil', label: 'Civil' },
    { value: 'electrical', label: 'Electrical' },
    { value: 'chemical', label: 'Chemical' },
  ],
  msc: [
    { value: 'physics', label: 'Physics' },
    { value: 'chemistry', label: 'Chemistry' },
    { value: 'mathematics', label: 'Mathematics' },
    { value: 'biology', label: 'Biology' },
    { value: 'computer-science', label: 'Computer Science' },
    { value: 'statistics', label: 'Statistics' },
  ],
  ma: [
    { value: 'history', label: 'History' },
    { value: 'english', label: 'English' },
    { value: 'psychology', label: 'Psychology' },
    { value: 'sociology', label: 'Sociology' },
    { value: 'political-science', label: 'Political Science' },
    { value: 'economics', label: 'Economics' },
  ],
  mcom: [
    { value: 'accounting', label: 'Accounting' },
    { value: 'finance', label: 'Finance' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'business-administration', label: 'Business Administration' },
  ],
  mba: [
    { value: 'business-administration', label: 'Business Administration' },
    { value: 'finance', label: 'Finance' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'human-resources', label: 'Human Resources' },
    { value: 'operations', label: 'Operations' },
  ],
  mca: [
    { value: 'computer-applications', label: 'Computer Applications' },
    { value: 'software-engineering', label: 'Software Engineering' },
    { value: 'database-systems', label: 'Database Systems' },
  ],
  phd: [
    { value: 'computer-science', label: 'Computer Science' },
    { value: 'physics', label: 'Physics' },
    { value: 'chemistry', label: 'Chemistry' },
    { value: 'mathematics', label: 'Mathematics' },
    { value: 'biology', label: 'Biology' },
    { value: 'engineering', label: 'Engineering' },
    { value: 'social-sciences', label: 'Social Sciences' },
  ],
  other: [
    { value: 'other', label: 'Other' },
  ],
};

const countryCodes = [
  { code: '+1', country: 'US', flag: '🇺🇸' },
  { code: '+91', country: 'IN', flag: '🇮🇳' },
  { code: '+44', country: 'UK', flag: '🇬🇧' },
  { code: '+61', country: 'AU', flag: '🇦🇺' },
  { code: '+81', country: 'JP', flag: '🇯🇵' },
  { code: '+86', country: 'CN', flag: '🇨🇳' },
  { code: '+49', country: 'DE', flag: '🇩🇪' },
  { code: '+33', country: 'FR', flag: '🇫🇷' },
  { code: '+39', country: 'IT', flag: '🇮🇹' },
  { code: '+7', country: 'RU', flag: '🇷🇺' },
  { code: '+55', country: 'BR', flag: '🇧🇷' },
  { code: '+27', country: 'ZA', flag: '🇿🇦' },
  { code: '+82', country: 'KR', flag: '🇰🇷' },
  { code: '+65', country: 'SG', flag: '🇸🇬' },
  { code: '+60', country: 'MY', flag: '🇲🇾' },
  { code: '+66', country: 'TH', flag: '🇹🇭' },
  { code: '+84', country: 'VN', flag: '🇻🇳' },
  { code: '+63', country: 'PH', flag: '🇵🇭' },
  { code: '+62', country: 'ID', flag: '🇮🇩' },
  { code: '+20', country: 'EG', flag: '🇪🇬' },
];

interface OnboardingFormProps {
  simpleMode?: boolean; // Optional prop to toggle between simple and detailed modes
}

export default function OnboardingForm({ simpleMode = false }: OnboardingFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [careerGoal, setCareerGoal] = useState('');
  const [formData, setFormData] = useState({
    name: 'Bhagavathy karthick M', // Pre-filled from resume file name
    email: '',
    phone: '',
    degree: '',
    field_of_study: '',
    university: '',
    graduationYear: '',
    cgpa: '',
    careerGoals: '',
    linkedIn: '',
    portfolio: '',
    skills: [] as string[],
    coverLetter: 'Tell us why you\'re the perfect fit for this role...', // Pre-filled from screenshot
  });
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [contactError, setContactError] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const { completeOnboarding } = useAuth();



  const nextStep = () => {
    if (currentStep < (simpleMode ? 1 : 5)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const validatePhoneNumber = (phone: string) => {
    const digitsOnly = phone.replace(/\D/g, '');
    return digitsOnly.length === 10 ? '' : 'Phone number must be exactly 10 digits';
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === 'phone') {
      setContactError('');
    }
  };

  const handleContactBlur = () => {
    const error = validatePhoneNumber(formData.phone);
    setContactError(error);
  };

  const handleDegreeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedDegree = e.target.value;
    setFormData((prev) => ({ ...prev, degree: selectedDegree, field_of_study: '' }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setResumeFile(file);
      setError('');

      if (!file.name.toLowerCase().endsWith('.pdf')) {
        setError('Only PDF files are allowed!');
        return;
      }

      try {
        setLoading(true);
        const uploadData = new FormData();
        uploadData.append('file', file);

        const endpoint = simpleMode ? '/api/resumes/parse/' : '/api/resumes/upload/';
        const response = await api.post(endpoint, uploadData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        const data: ResumeData = response.data;
        console.log('Extracted resume data:', data);

        if (data.error) {
          setError(`Failed to parse resume: ${data.error}`);
          return;
        }

        setFormData((prev) => ({
          ...prev,
          name: data.name && data.name !== 'No name found' ? data.name : 'Bhagavathy karthick M', // Fallback to pre-filled name
          email: data.email && data.email !== 'No email found' ? data.email : prev.email,
          phone:
            data.phone && data.phone !== 'No phone found'
              ? (() => {
                  const phone = data.phone.trim().replace(/[^+\d]/g, '');
                  let contactNumber = phone;
                  let selectedCountryCode = '+91';
                  if (phone.startsWith('+91')) {
                    selectedCountryCode = '+91';
                    contactNumber = phone.replace('+91', '');
                  } else if (phone.startsWith('+1')) {
                    selectedCountryCode = '+1';
                    contactNumber = phone.replace('+1', '');
                  } else if (phone.length >= 10) {
                    selectedCountryCode = '+91';
                    contactNumber = phone.slice(-10);
                  } else {
                    setError('Invalid phone number format in resume');
                    return prev.phone;
                  }
                  const validationError = validatePhoneNumber(contactNumber);
                  if (validationError) {
                    setError(`Invalid phone number: ${validationError}`);
                    return prev.phone;
                  }
                  setCountryCode(selectedCountryCode);
                  return contactNumber;
                })()
              : prev.phone,
          skills: data.skills
            ? Array.isArray(data.skills)
              ? [...new Set([...prev.skills, ...data.skills.filter((skill) => typeof skill === 'string' && skill.trim())])]
              : prev.skills
            : prev.skills,
          degree: data.degree && data.degree !== 'No degree found' ? data.degree : prev.degree,
          field_of_study: data.major && data.major !== 'No major found' ? data.major : prev.field_of_study,
          university: data.university && data.university !== 'No university found' ? data.university : prev.university,
          cgpa: data.gpa && data.gpa !== '0.0' ? data.gpa : prev.cgpa,
          careerGoals: data.careerGoals || prev.careerGoals,
          linkedIn: data.linkedIn || prev.linkedIn,
          portfolio: data.portfolio || prev.portfolio,
        }));

        if (
          data.name ||
          data.email ||
          data.phone ||
          data.skills?.length ||
          data.degree ||
          data.major ||
          data.university ||
          data.gpa ||
          data.careerGoals ||
          data.linkedIn ||
          data.portfolio
        ) {
          setError('Success: Fields auto-filled from resume!');
        } else {
          setError('No data extracted from resume');
        }
      } catch (err: unknown) {
        const error = err as Error;
        console.error('Fetch error:', {
          message: error.message,
          stack: error.stack,
          url: `${backendUrl}${simpleMode ? '/resumes/parse/' : '/resumes/upload/'}`,
          timestamp: new Date().toISOString(),
        });
        setError(`Failed to extract data: ${error.message}. Please check if Django backend is running.`);
      } finally {
        setLoading(false);
      }
    }
  };

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      setError('');

      // Prepare data with correct field names expected by backend
      const data = new URLSearchParams();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'skills') {
          data.append(key, JSON.stringify(value));
        } else if (key === 'phone') {
          // Remove any non-digit characters from phone before appending
          const val = Array.isArray(value) ? value[0] : value;
          const digitsOnly = val.replace(/\D/g, '');
          data.append(key, `${countryCode}${digitsOnly}`);
        } else if (key === 'graduationYear') {
          // Backend expects 'year_of_passout' instead of 'graduationYear'
          data.append('year_of_passout', value as string);
        } else {
          data.append(key, value as string);
        }
      });

      try {
        const response = await api.post('/api/onboarding/', data, {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        });

        alert(response.data.message);
        if (!simpleMode) {
          completeOnboarding();
        }
      } catch (error) {
        console.error('Submission error:', error);
        setError(`Failed to submit form: ${(error as Error).message}. Please check if Django backend is running.`);
      } finally {
        setLoading(false);
      }
    };

  // Simple mode: Single-step form
  if (simpleMode) {
    return (
      <form className="p-4 space-y-4" onSubmit={handleSubmit}>
        <h2 className="text-2xl font-bold">Onboarding Form</h2>
        <div className="relative">
          <input
            type="text"
            placeholder="Full Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg"
            required
          />
          <User className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
        </div>
        <div className="relative">
          <input
            type="email"
            placeholder="Email Address"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg"
            required
          />
          <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
        </div>
        <div className="flex gap-2">
          <select
            value={countryCode}
            onChange={(e) => setCountryCode(e.target.value)}
            className="px-3 py-3 border border-gray-300 rounded-lg"
          >
            {countryCodes.map((country) => (
              <option key={country.code} value={country.code}>
                {country.flag} {country.code}
              </option>
            ))}
          </select>
          <div className="relative flex-1">
            <input
              type="tel"
              placeholder="Phone Number"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              onBlur={handleContactBlur}
              className={`w-full px-4 py-3 pl-10 border rounded-lg ${contactError ? 'border-red-500' : 'border-gray-300'}`}
              maxLength={10}
              required
            />
            <Phone className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          </div>
        </div>
        {contactError && <p className="text-red-500 text-sm">{contactError}</p>}
        <div className="relative">
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="w-full border border-gray-300 p-3 pl-10 rounded-lg"
          />
          <FileText className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
        </div>
        <select
          name="graduationYear"
          value={formData.graduationYear}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg"
          required
        >
          <option value="">Select Graduation Year</option>
          {Array.from({ length: 75 }, (_, i) => new Date().getFullYear() - 5 + i).map((year) => (
            <option key={year} value={year.toString()}>
              {year}
            </option>
          ))}
        </select>
        <textarea
          placeholder="Cover Letter"
          name="coverLetter"
          value={formData.coverLetter}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg"
        />
        {error && (
          <p className={`text-sm ${error.startsWith('Success') ? 'text-green-500' : 'text-red-500'}`}>
            {error}
          </p>
        )}
        {loading && <p className="text-sm text-gray-500">Processing...</p>}
        <button
          type="submit"
          disabled={loading || !formData.name || !formData.email || !formData.phone || !formData.graduationYear || !!contactError}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg disabled:bg-gray-400"
        >
          Submit Application
        </button>
      </form>
    );
  }

  // Detailed mode: Multi-step form
  const progress = (currentStep / 5) * 100;

  return (
    <div className="min-h-screen bg-neutral-25">
      <div className="max-w-2xl mx-auto py-12 px-4">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-ink-500">Step {currentStep} of 5</span>
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
                { value: 'job', title: 'Full-time Job', description: 'Find permanent employment', color: 'sun', icon: Briefcase },
                { value: 'internship', title: 'Internship', description: 'Gain work experience', color: 'leaf', icon: GraduationCap },
                { value: 'skills', title: 'Skill Upgrade', description: 'Learn new skills', color: 'slate', icon: BookOpen },
                { value: 'startup', title: 'Startup Idea', description: 'Launch your own venture', color: 'ember', icon: Lightbulb },
              ].map(({ value, title, description, color, icon: Icon }) => (
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
                        <Icon className={`w-6 h-6 text-${color}-600`} />
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
                className="bg-sun-600 text-white px-8 py-3 rounded-xl hover:bg-sun-700 focus:ring-4 focus:ring-sun-300 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl disabled:bg-gray-400 disabled:cursor-not-allowed disabled:shadow-none"
                data-testid="button-continue-step1"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Resume and Personal Details */}
        {currentStep === 2 && (
          <div className="bg-white rounded-2xl shadow-card p-8">
            <h2 className="text-3xl font-display font-bold text-ink-900 mb-2">Resume and Personal Details</h2>
            <p className="text-ink-500 mb-8">Upload your resume to auto-fill your details or enter them manually.</p>

            <div className="space-y-6">
              <div className="relative">
                <label className="block text-sm font-semibold text-ink-700 mb-2">Upload Resume (Optional)</label>
                <div className="flex items-center">
                  <FileText className="w-5 h-5 text-gray-400 absolute left-3" />
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="w-full border border-slate-300 p-3 pl-10 rounded-lg cursor-pointer"
                    data-testid="input-resume"
                  />
                </div>
                {error && (
                  <p className={`text-sm mt-1 ${error.startsWith('Success') ? 'text-green-500' : 'text-red-500'}`}>
                    {error}
                  </p>
                )}
                {loading && <p className="text-sm mt-1 text-ink-500">Extracting data...</p>}
              </div>
              <div className="relative">
                <label className="block text-sm font-semibold text-ink-700 mb-2">Full Name</label>
                <div className="flex items-center">
                  <User className="w-5 h-5 text-gray-400 absolute left-3" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 pl-10 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sun-500 focus:border-transparent transition-custom"
                    placeholder="Your full name"
                    data-testid="input-name"
                    required
                  />
                </div>
              </div>
              <div className="relative">
                <label className="block text-sm font-semibold text-ink-700 mb-2">Email Address</label>
                <div className="flex items-center">
                  <Mail className="w-5 h-5 text-gray-400 absolute left-3" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 pl-10 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sun-500 focus:border-transparent transition-custom"
                    placeholder="you@example.com"
                    data-testid="input-email"
                    required
                  />
                </div>
              </div>
              <div className="relative">
                <label className="block text-sm font-semibold text-ink-700 mb-2">Contact Number</label>
                <div className="flex gap-2">
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="px-3 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sun-500 focus:border-transparent transition-custom bg-white"
                    data-testid="select-country-code"
                  >
                    {countryCodes.map((country) => (
                      <option key={country.code} value={country.code}>
                        {country.flag} {country.code}
                      </option>
                    ))}
                  </select>
                  <div className="relative flex-1">
                    <Phone className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      onBlur={handleContactBlur}
                      className={`w-full px-4 py-3 pl-10 border rounded-lg focus:ring-2 focus:ring-sun-500 focus:border-transparent transition-custom ${
                        contactError ? 'border-red-500' : 'border-slate-300'
                      }`}
                      placeholder="1234567890"
                      maxLength={10}
                      data-testid="input-contact"
                      required
                    />
                  </div>
                </div>
                {contactError && <p className="text-red-500 text-sm mt-1">{contactError}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-ink-700 mb-2">Cover Letter (Optional)</label>
                <textarea
                  name="coverLetter"
                  value={formData.coverLetter}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sun-500 focus:border-transparent transition-custom"
                  placeholder="Your cover letter..."
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
                disabled={!formData.name || !formData.email || !formData.phone || !!contactError || loading}
                className="bg-ink-900 text-white px-6 py-3 rounded-lg hover:opacity-90 transition-custom font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
                data-testid="button-continue-step2"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Education Details */}
        {currentStep === 3 && (
          <div className="bg-white rounded-2xl shadow-card p-8">
            <h2 className="text-3xl font-display font-bold text-ink-900 mb-2">Education Details</h2>
            <p className="text-ink-500 mb-8">Tell us about your degree and field of study.</p>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-ink-700 mb-2">Degree</label>
                <select
                  name="degree"
                  value={formData.degree}
                  onChange={handleDegreeChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sun-500 focus:border-transparent transition-custom"
                  data-testid="select-degree"
                  required
                >
                  <option value="">Select degree</option>
                  {degreeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {formData.degree && (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-ink-700 mb-2">Field of Study</label>
                    <select
                      name="field_of_study"
                      value={formData.field_of_study}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sun-500 focus:border-transparent transition-custom"
                      data-testid="select-field-study"
                      required
                    >
                      <option value="">Select field of study</option>
                      {fieldOfStudyOptions[formData.degree]?.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-ink-700 mb-2">College/University Name</label>
                    <input
                      type="text"
                      name="university"
                      value={formData.university}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sun-500 focus:border-transparent transition-custom"
                      placeholder="e.g., ABC University"
                      data-testid="input-college-name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-ink-700 mb-2">Year of Graduation</label>
                    <select
                      name="graduationYear"
                      value={formData.graduationYear}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sun-500 focus:border-transparent transition-custom"
                      data-testid="select-graduation-year"
                      required
                    >
                      <option value="">Select graduation year</option>
                      {Array.from({ length: 75 }, (_, i) => new Date().getFullYear() - 5 + i).map((year) => (
                        <option key={year} value={year.toString()}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-ink-700 mb-2">CGPA (Optional)</label>
                    <input
                      type="number"
                      name="cgpa"
                      value={formData.cgpa}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sun-500 focus:border-transparent transition-custom"
                      placeholder="e.g., 8.5"
                      min="0"
                      max="10"
                      step="0.1"
                      data-testid="input-cgpa"
                    />
                  </div>
                </>
              )}
            </div>

            <div className="flex justify-between mt-8">
              <button
                onClick={prevStep}
                className="text-ink-500 hover:text-ink-700 px-6 py-3 transition-custom font-semibold flex items-center"
                data-testid="button-back-step3"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </button>
              <button
                onClick={nextStep}
                disabled={
                  !formData.degree ||
                  !formData.field_of_study ||
                  !formData.university ||
                  !formData.graduationYear
                }
                className="bg-ink-900 text-white px-6 py-3 rounded-lg hover:opacity-90 transition-custom font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
                data-testid="button-continue-step3"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Skills and Career Goals */}
        {currentStep === 4 && (
          <div className="bg-white rounded-2xl shadow-card p-8">
            <h2 className="text-3xl font-display font-bold text-ink-900 mb-2">Skills and Career Goals</h2>
            <p className="text-ink-500 mb-8">Tell us about your skills and aspirations.</p>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-ink-700 mb-2">Key Skills</label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {formData.skills.map((skill, index) => (
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
                        setFormData((prev) => ({
                          ...prev,
                          skills: [...prev.skills, input.value.trim()],
                        }));
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
                  name="careerGoals"
                  value={formData.careerGoals}
                  onChange={handleChange}
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
                data-testid="button-back-step4"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </button>
              <button
                onClick={nextStep}
                className="bg-ink-900 text-white px-6 py-3 rounded-lg hover:opacity-90 transition-custom font-semibold"
                data-testid="button-continue-step4"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Step 5: Profile Completion */}
        {currentStep === 5 && (
          <div className="bg-white rounded-2xl shadow-card p-8">
            <h2 className="text-3xl font-display font-bold text-ink-900 mb-2">Complete Your Profile</h2>
            <p className="text-ink-500 mb-8">Finish setting up your profile.</p>

            <div className="mb-8">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold text-ink-700">Profile Completeness</span>
                <span className="text-sm text-ink-500">75% Complete</span>
              </div>
              <div className="w-full bg-neutral-100 rounded-full h-2">
                <div className="bg-leaf-500 h-2 rounded-full" style={{ width: '75%' }}></div>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <label className="block text-sm font-semibold text-ink-700 mb-2">LinkedIn Profile</label>
                  <input
                    type="url"
                    name="linkedIn"
                    value={formData.linkedIn}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sun-500 focus:border-transparent transition-custom"
                    placeholder="https://linkedin.com/in/yourname"
                    data-testid="input-linkedin"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-ink-700 mb-2">Portfolio/GitHub</label>
                  <input
                    type="url"
                    name="portfolio"
                    value={formData.portfolio}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sun-500 focus:border-transparent transition-custom"
                    placeholder="https://github.com/yourname"
                    data-testid="input-portfolio"
                  />
                </div>
              </div>

              {error && (
                <p className={`text-sm mb-4 ${error.startsWith('Success') ? 'text-green-500' : 'text-red-500'}`}>
                  {error}
                </p>
              )}
              {loading && <p className="text-sm mb-4 text-ink-500">Submitting...</p>}

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={prevStep}
                  className="text-ink-500 hover:text-ink-700 px-6 py-3 transition-custom font-semibold flex items-center"
                  data-testid="button-back-step5"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </button>
                <button
                  type="submit"
                  disabled={
                    loading ||
                    !formData.name ||
                    !formData.email ||
                    !formData.phone ||
                    !!contactError ||
                    !formData.degree ||
                    !formData.field_of_study ||
                    !formData.university ||
                    !formData.graduationYear
                  }
                  className="bg-ink-900 text-white px-6 py-3 rounded-lg hover:opacity-90 transition-custom font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
                  data-testid="button-complete-setup"
                >
                  Complete Setup
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}