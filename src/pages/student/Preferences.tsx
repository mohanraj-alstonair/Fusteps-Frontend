import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import {
  Code,
  Palette,
  Database,
  Globe,
  Smartphone,
  Cloud,
  Brain,
  TrendingUp,
  Briefcase,
  GraduationCap,
  MapPin,
  DollarSign,
  CheckCircle,
  ArrowRight,
  Target,
  Lightbulb
} from "lucide-react";

export default function StudentPreferences() {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [careerGoals, setCareerGoals] = useState({
    primaryGoal: '',
    experienceLevel: '',
    preferredLocation: '',
    salaryRange: '',
    workType: ''
  });
  const [learningPreferences, setLearningPreferences] = useState({
    learningStyle: '',
    timeCommitment: '',
    preferredFormat: '',
    budget: ''
  });

  const interests = [
    { id: 'web-development', label: 'Web Development', icon: <Code className="w-5 h-5" />, color: 'bg-blue-100 text-blue-800' },
    { id: 'mobile-development', label: 'Mobile Development', icon: <Smartphone className="w-5 h-5" />, color: 'bg-green-100 text-green-800' },
    { id: 'data-science', label: 'Data Science', icon: <Database className="w-5 h-5" />, color: 'bg-purple-100 text-purple-800' },
    { id: 'machine-learning', label: 'Machine Learning', icon: <Brain className="w-5 h-5" />, color: 'bg-orange-100 text-orange-800' },
    { id: 'ui-ux-design', label: 'UI/UX Design', icon: <Palette className="w-5 h-5" />, color: 'bg-pink-100 text-pink-800' },
    { id: 'cloud-computing', label: 'Cloud Computing', icon: <Cloud className="w-5 h-5" />, color: 'bg-cyan-100 text-cyan-800' },
    { id: 'cybersecurity', label: 'Cybersecurity', icon: <Globe className="w-5 h-5" />, color: 'bg-red-100 text-red-800' },
    { id: 'business-analysis', label: 'Business Analysis', icon: <TrendingUp className="w-5 h-5" />, color: 'bg-yellow-100 text-yellow-800' }
  ];

  const skills = [
    { id: 'javascript', label: 'JavaScript', category: 'Programming' },
    { id: 'python', label: 'Python', category: 'Programming' },
    { id: 'react', label: 'React', category: 'Frontend' },
    { id: 'node-js', label: 'Node.js', category: 'Backend' },
    { id: 'sql', label: 'SQL', category: 'Database' },
    { id: 'aws', label: 'AWS', category: 'Cloud' },
    { id: 'docker', label: 'Docker', category: 'DevOps' },
    { id: 'figma', label: 'Figma', category: 'Design' },
    { id: 'git', label: 'Git', category: 'Tools' },
    { id: 'agile', label: 'Agile/Scrum', category: 'Methodology' }
  ];

  const toggleInterest = (interestId: string) => {
    setSelectedInterests(prev =>
      prev.includes(interestId)
        ? prev.filter(id => id !== interestId)
        : [...prev, interestId]
    );
  };

  const toggleSkill = (skillId: string) => {
    setSelectedSkills(prev =>
      prev.includes(skillId)
        ? prev.filter(id => id !== skillId)
        : [...prev, skillId]
    );
  };

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const savePreferences = () => {
    toast({
      title: "Preferences Saved!",
      description: "Your preferences have been successfully saved. We'll personalize your experience based on your choices."
    });
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">What interests you most?</h2>
              <p className="text-gray-600">Select the areas that excite you the most</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {interests.map((interest) => (
                <Card
                  key={interest.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedInterests.includes(interest.id)
                      ? 'ring-2 ring-blue-500 bg-blue-50'
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => toggleInterest(interest.id)}
                >
                  <CardContent className="p-4 text-center">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3 ${
                      selectedInterests.includes(interest.id) ? interest.color : 'bg-gray-100'
                    }`}>
                      {interest.icon}
                    </div>
                    <p className="text-sm font-medium">{interest.label}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-500">
                Selected: {selectedInterests.length} of {interests.length}
              </p>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">What skills do you have?</h2>
              <p className="text-gray-600">Tell us about your current skill set</p>
            </div>

            <div className="space-y-4">
              {['Programming', 'Frontend', 'Backend', 'Database', 'Cloud', 'DevOps', 'Design', 'Tools', 'Methodology'].map((category) => (
                <div key={category}>
                  <h3 className="font-semibold text-gray-900 mb-3">{category}</h3>
                  <div className="flex flex-wrap gap-2">
                    {skills.filter(skill => skill.category === category).map((skill) => (
                      <Badge
                        key={skill.id}
                        variant={selectedSkills.includes(skill.id) ? "default" : "outline"}
                        className={`cursor-pointer ${
                          selectedSkills.includes(skill.id)
                            ? 'bg-blue-600 hover:bg-blue-700'
                            : 'hover:bg-gray-100'
                        }`}
                        onClick={() => toggleSkill(skill.id)}
                      >
                        {skill.label}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-500">
                Selected: {selectedSkills.length} skills
              </p>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Career Goals</h2>
              <p className="text-gray-600">Help us understand your career aspirations</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Primary Career Goal</label>
                <select
                  value={careerGoals.primaryGoal}
                  onChange={(e) => setCareerGoals(prev => ({ ...prev, primaryGoal: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select your primary goal</option>
                  <option value="frontend-developer">Frontend Developer</option>
                  <option value="backend-developer">Backend Developer</option>
                  <option value="fullstack-developer">Full Stack Developer</option>
                  <option value="data-scientist">Data Scientist</option>
                  <option value="ui-ux-designer">UI/UX Designer</option>
                  <option value="devops-engineer">DevOps Engineer</option>
                  <option value="product-manager">Product Manager</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Experience Level</label>
                <select
                  value={careerGoals.experienceLevel}
                  onChange={(e) => setCareerGoals(prev => ({ ...prev, experienceLevel: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select experience level</option>
                  <option value="beginner">Beginner (0-1 years)</option>
                  <option value="intermediate">Intermediate (1-3 years)</option>
                  <option value="advanced">Advanced (3-5 years)</option>
                  <option value="expert">Expert (5+ years)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Location</label>
                <select
                  value={careerGoals.preferredLocation}
                  onChange={(e) => setCareerGoals(prev => ({ ...prev, preferredLocation: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select preferred location</option>
                  <option value="remote">Remote</option>
                  <option value="onsite">On-site</option>
                  <option value="hybrid">Hybrid</option>
                  <option value="no-preference">No preference</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Salary Range</label>
                <select
                  value={careerGoals.salaryRange}
                  onChange={(e) => setCareerGoals(prev => ({ ...prev, salaryRange: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select salary range</option>
                  <option value="entry-level">$30k - $50k</option>
                  <option value="mid-level">$50k - $80k</option>
                  <option value="senior-level">$80k - $120k</option>
                  <option value="executive">$120k+</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Learning Preferences</h2>
              <p className="text-gray-600">How do you prefer to learn?</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Learning Style</label>
                <select
                  value={learningPreferences.learningStyle}
                  onChange={(e) => setLearningPreferences(prev => ({ ...prev, learningStyle: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select learning style</option>
                  <option value="visual">Visual (videos, diagrams)</option>
                  <option value="reading">Reading (articles, books)</option>
                  <option value="hands-on">Hands-on (projects, coding)</option>
                  <option value="mixed">Mixed approach</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Time Commitment</label>
                <select
                  value={learningPreferences.timeCommitment}
                  onChange={(e) => setLearningPreferences(prev => ({ ...prev, timeCommitment: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select time commitment</option>
                  <option value="5-hours">5 hours/week</option>
                  <option value="10-hours">10 hours/week</option>
                  <option value="15-hours">15 hours/week</option>
                  <option value="20-plus">20+ hours/week</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Format</label>
                <select
                  value={learningPreferences.preferredFormat}
                  onChange={(e) => setLearningPreferences(prev => ({ ...prev, preferredFormat: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select preferred format</option>
                  <option value="self-paced">Self-paced courses</option>
                  <option value="instructor-led">Instructor-led courses</option>
                  <option value="bootcamp">Bootcamp style</option>
                  <option value="mentorship">1-on-1 mentorship</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Budget</label>
                <select
                  value={learningPreferences.budget}
                  onChange={(e) => setLearningPreferences(prev => ({ ...prev, budget: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select budget</option>
                  <option value="free">Free resources only</option>
                  <option value="under-100">$0 - $100/month</option>
                  <option value="100-500">$100 - $500/month</option>
                  <option value="unlimited">No budget limit</option>
                </select>
              </div>
            </div>

            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <Lightbulb className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-blue-900 mb-1">Ready to get started!</h3>
                    <p className="text-sm text-blue-700">
                      Based on your preferences, we'll recommend personalized courses, projects, and mentorship opportunities.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Progress Bar */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900">Set Your Preferences</h1>
          <span className="text-sm text-gray-500">Step {currentStep} of 4</span>
        </div>
        <Progress value={(currentStep / 4) * 100} className="h-2" />
        <div className="flex justify-between mt-2 text-xs text-gray-500">
          <span>Interests</span>
          <span>Skills</span>
          <span>Career Goals</span>
          <span>Learning Style</span>
        </div>
      </div>

      {/* Step Content */}
      <Card>
        <CardContent className="p-8">
          {renderStepContent()}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={currentStep === 1}
        >
          Previous
        </Button>

        {currentStep < 4 ? (
          <Button
            onClick={nextStep}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Next
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        ) : (
          <Button
            onClick={savePreferences}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Complete Setup
          </Button>
        )}
      </div>
    </div>
  );
}
