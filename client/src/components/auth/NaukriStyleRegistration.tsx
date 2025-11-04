import { useState } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { CheckCircle, Upload, User, GraduationCap, Target } from 'lucide-react';



interface RegistrationData {
  // Step 1: Basic Details
  fullName: string;
  email: string;
  password: string;
  mobileNumber: string;
  workStatus: string;
  currentCity: string;
  
  // Step 2: Education
  highestQualification: string;
  course: string;
  courseType: string;
  specialization: string;
  universityInstitute: string;
  startingYear: string;
  passingYear: string;
  gradingSystem: string;
  marksPercentage: string;
  keySkills: string[];
  
  // Step 3: Profile Completion
  resumeHeadline: string;
  careerObjective: string;
  preferredLocations: string[];
  expectedSalary: string;
}

const SPECIALIZATIONS = {
  'btech': [
    'Computer Science Engineering',
    'Electrical & Electronics Engineering',
    'Mechanical Engineering',
    'Civil Engineering',
    'Electronics & Communication',
    'Information Technology',
    'Chemical Engineering',
    'Aerospace Engineering'
  ],
  'bsc': [
    'Computer Science',
    'Physics',
    'Chemistry',
    'Mathematics',
    'Biology',
    'Statistics'
  ],
  'bcom': [
    'Accounting',
    'Finance',
    'Marketing',
    'Business Administration'
  ]
};

const CITIES = [
  'Bengaluru', 'Mumbai', 'Delhi', 'Chennai', 'Hyderabad', 'Pune', 
  'Kolkata', 'Ahmedabad', 'Surat', 'Jaipur', 'Lucknow', 'Kanpur'
];

export default function NaukriStyleRegistration() {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [userId, setUserId] = useState<number | null>(null);
  const [, setLocation] = useLocation();
  
  const [formData, setFormData] = useState<RegistrationData>({
    fullName: '',
    email: '',
    password: '',
    mobileNumber: '',
    workStatus: '',
    currentCity: '',
    highestQualification: '',
    course: '',
    courseType: 'Full Time',
    specialization: '',
    universityInstitute: '',
    startingYear: '',
    passingYear: '',
    gradingSystem: '',
    marksPercentage: '',
    keySkills: [],
    resumeHeadline: '',
    careerObjective: '',
    preferredLocations: [],
    expectedSalary: ''
  });

  const [currentSkill, setCurrentSkill] = useState('');

  const handleInputChange = (field: keyof RegistrationData, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addSkill = () => {
    if (currentSkill.trim() && !formData.keySkills.includes(currentSkill.trim())) {
      handleInputChange('keySkills', [...formData.keySkills, currentSkill.trim()]);
      setCurrentSkill('');
    }
  };

  const removeSkill = (skill: string) => {
    handleInputChange('keySkills', formData.keySkills.filter(s => s !== skill));
  };

  const handleStep1Submit = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('http://localhost:8000/api/register/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password,
          mobileNumber: formData.mobileNumber,
          workStatus: formData.workStatus,
          currentCity: formData.currentCity
        })
      });

      const result = await response.json();
      
      if (result.success) {
        setUserId(result.candidate_id);
        setCurrentStep(2);
      } else {
        setError(result.error || 'Registration failed');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleStep2Submit = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('http://localhost:8000/api/register/education/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          highestQualification: formData.highestQualification,
          course: formData.course,
          courseType: formData.courseType,
          specialization: formData.specialization,
          universityInstitute: formData.universityInstitute,
          startingYear: parseInt(formData.startingYear),
          passingYear: parseInt(formData.passingYear),
          gradingSystem: formData.gradingSystem,
          marksPercentage: parseFloat(formData.marksPercentage),
          keySkills: formData.keySkills
        })
      });

      const result = await response.json();
      
      if (result.success) {
        setCurrentStep(3);
      } else {
        setError(result.error || 'Education details save failed');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleStep3Submit = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('http://localhost:8000/api/register/complete/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          resumeHeadline: formData.resumeHeadline,
          careerObjective: formData.careerObjective,
          preferredLocations: formData.preferredLocations,
          expectedSalary: formData.expectedSalary
        })
      });

      const result = await response.json();
      
      if (result.success) {
        // Registration complete, redirect to login
        setLocation('/login');
      } else {
        setError(result.error || 'Profile completion failed');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderProgressIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      <div className="flex items-center space-x-4">
        <div className={`flex items-center space-x-2 ${currentStep >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
          {currentStep > 1 ? <CheckCircle className="w-5 h-5" /> : <User className="w-5 h-5" />}
          <span className="text-sm font-medium">Basic Details</span>
        </div>
        <div className="w-8 h-px bg-gray-300"></div>
        <div className={`flex items-center space-x-2 ${currentStep >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
          {currentStep > 2 ? <CheckCircle className="w-5 h-5" /> : <GraduationCap className="w-5 h-5" />}
          <span className="text-sm font-medium">Education</span>
        </div>
        <div className="w-8 h-px bg-gray-300"></div>
        <div className={`flex items-center space-x-2 ${currentStep >= 3 ? 'text-blue-600' : 'text-gray-400'}`}>
          <Target className="w-5 h-5" />
          <span className="text-sm font-medium">Complete Profile</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex justify-center mb-6">
          <img src="/fu steps logo.png" alt="FuSteps Logo" className="h-16 w-auto" />
        </div>
        {renderProgressIndicator()}
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Left Panel - Benefits */}
          <div className="bg-blue-600 text-white p-8 rounded-2xl">
            <h2 className="text-2xl font-bold mb-6">Join FuSteps Today</h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5" />
                <span>Build your professional profile</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5" />
                <span>Get personalized job recommendations</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5" />
                <span>Connect with industry mentors</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5" />
                <span>Access exclusive opportunities</span>
              </div>
            </div>
          </div>

          {/* Right Panel - Form */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>
                {currentStep === 1 && 'Create Your Account'}
                {currentStep === 2 && 'Education Details'}
                {currentStep === 3 && 'Complete Your Profile'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {/* Step 1: Basic Details */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                      id="fullName"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email ID *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="password">Password *</Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      placeholder="Create a password"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="mobile">Mobile Number *</Label>
                    <Input
                      id="mobile"
                      value={formData.mobileNumber}
                      onChange={(e) => handleInputChange('mobileNumber', e.target.value)}
                      placeholder="Enter mobile number"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label>Work Status *</Label>
                    <Select value={formData.workStatus} onValueChange={(value) => handleInputChange('workStatus', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select work status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fresher">I'm a fresher</SelectItem>
                        <SelectItem value="experienced">I'm experienced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label>Current City *</Label>
                    <Select value={formData.currentCity} onValueChange={(value) => handleInputChange('currentCity', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select city" />
                      </SelectTrigger>
                      <SelectContent>
                        {CITIES.map(city => (
                          <SelectItem key={city} value={city}>{city}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Button 
                    onClick={handleStep1Submit} 
                    disabled={loading || !formData.fullName || !formData.email || !formData.password}
                    className="w-full"
                  >
                    {loading ? 'Creating Account...' : 'Register Now'}
                  </Button>
                </div>
              )}

              {/* Step 2: Education Details */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  <div>
                    <Label>Highest Qualification *</Label>
                    <Select value={formData.highestQualification} onValueChange={(value) => handleInputChange('highestQualification', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select qualification" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="graduation">Graduation / Diploma</SelectItem>
                        <SelectItem value="postgraduation">Post Graduation</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label>Course *</Label>
                    <Select value={formData.course} onValueChange={(value) => handleInputChange('course', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select course" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="btech">B.Tech / B.E.</SelectItem>
                        <SelectItem value="bsc">B.Sc</SelectItem>
                        <SelectItem value="bcom">B.Com</SelectItem>
                        <SelectItem value="ba">B.A</SelectItem>
                        <SelectItem value="bba">BBA</SelectItem>
                        <SelectItem value="bca">BCA</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {formData.course && (
                    <div>
                      <Label>Specialization *</Label>
                      <Select value={formData.specialization} onValueChange={(value) => handleInputChange('specialization', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select specialization" />
                        </SelectTrigger>
                        <SelectContent>
                          {SPECIALIZATIONS[formData.course as keyof typeof SPECIALIZATIONS]?.map(spec => (
                            <SelectItem key={spec} value={spec}>{spec}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  
                  <div>
                    <Label>University / Institute *</Label>
                    <Input
                      value={formData.universityInstitute}
                      onChange={(e) => handleInputChange('universityInstitute', e.target.value)}
                      placeholder="Start typing university name"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Starting Year *</Label>
                      <Select value={formData.startingYear} onValueChange={(value) => handleInputChange('startingYear', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Year" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({length: 10}, (_, i) => new Date().getFullYear() - i).map(year => (
                            <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label>Passing Year *</Label>
                      <Select value={formData.passingYear} onValueChange={(value) => handleInputChange('passingYear', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Year" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({length: 10}, (_, i) => new Date().getFullYear() + i).map(year => (
                            <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div>
                    <Label>Key Skills *</Label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {formData.keySkills.map(skill => (
                        <span key={skill} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm flex items-center">
                          {skill}
                          <button onClick={() => removeSkill(skill)} className="ml-1 text-blue-600">×</button>
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        value={currentSkill}
                        onChange={(e) => setCurrentSkill(e.target.value)}
                        placeholder="Add a skill"
                        onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                      />
                      <Button type="button" onClick={addSkill}>Add</Button>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={handleStep2Submit} 
                    disabled={loading || !formData.course || !formData.specialization}
                    className="w-full"
                  >
                    {loading ? 'Saving...' : 'Save and Continue'}
                  </Button>
                </div>
              )}

              {/* Step 3: Profile Completion */}
              {currentStep === 3 && (
                <div className="space-y-4">
                  <div>
                    <Label>Resume Headline *</Label>
                    <Input
                      value={formData.resumeHeadline}
                      onChange={(e) => handleInputChange('resumeHeadline', e.target.value)}
                      placeholder="e.g., B.Tech Electrical Engineer seeking entry-level opportunities"
                      maxLength={250}
                    />
                  </div>
                  
                  <div>
                    <Label>Career Objective</Label>
                    <Textarea
                      value={formData.careerObjective}
                      onChange={(e) => handleInputChange('careerObjective', e.target.value)}
                      placeholder="Describe your career goals and aspirations"
                      rows={4}
                    />
                  </div>
                  
                  <div>
                    <Label>Preferred Job Locations</Label>
                    <Input
                      value={formData.preferredLocations.join(', ')}
                      onChange={(e) => handleInputChange('preferredLocations', e.target.value.split(', '))}
                      placeholder="e.g., Bengaluru, Chennai, Hyderabad"
                    />
                  </div>
                  
                  <div>
                    <Label>Expected Salary</Label>
                    <Input
                      value={formData.expectedSalary}
                      onChange={(e) => handleInputChange('expectedSalary', e.target.value)}
                      placeholder="e.g., As per company standards"
                    />
                  </div>
                  
                  <Button 
                    onClick={handleStep3Submit} 
                    disabled={loading || !formData.resumeHeadline}
                    className="w-full"
                  >
                    {loading ? 'Completing...' : 'Complete Registration'}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}