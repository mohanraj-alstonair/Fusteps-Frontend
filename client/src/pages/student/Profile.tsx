import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { getUserProfile, updateUserProfile, api } from "@/lib/api";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  GraduationCap, 
  Calendar,
  Edit3,
  Save,
  Upload,
  Linkedin,
  Github,
  Globe,
  Award,
  BookOpen,
  Target,
  Loader2,
  X,
  Plus,
  FileText,
  Download,
  Eye
} from "lucide-react";
import ProfileDebug from "@/components/ProfileDebug";

// Resume Viewer Component
function ResumeViewer({ userId }: { userId: string | null }) {
  const [hasResume, setHasResume] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const checkResume = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`http://localhost:8000/api/profile/${userId}/resume/`, {
          method: 'HEAD'
        });
        setHasResume(response.ok);
      } catch (error) {
        setHasResume(false);
      } finally {
        setLoading(false);
      }
    };

    checkResume();
  }, [userId]);

  const handleViewResume = () => {
    if (userId) {
      window.open(`http://localhost:8000/api/profile/${userId}/resume/`, '_blank');
    }
  };

  const handleDownloadResume = () => {
    if (userId) {
      const link = document.createElement('a');
      link.href = `http://localhost:8000/api/profile/${userId}/resume/`;
      link.download = 'resume.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-6 h-6 animate-spin" />
        <span className="ml-2">Checking resume...</span>
      </div>
    );
  }

  if (!hasResume) {
    return (
      <div className="text-center p-8">
        <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground mb-4">No resume uploaded yet</p>
        <p className="text-sm text-muted-foreground">Upload your resume during onboarding to view it here</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <FileText className="w-5 h-5 text-indigo-600" />
          <span className="font-medium">Resume.pdf</span>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={handleViewResume}>
            <Eye className="w-4 h-4 mr-2" />
            View
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownloadResume}>
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
        </div>
      </div>
      
      {/* PDF Preview */}
      <div className="border rounded-lg overflow-hidden">
        <iframe
          src={`http://localhost:8000/api/profile/${userId}/resume/`}
          className="w-full h-96"
          title="Resume Preview"
        />
      </div>
    </div>
  );
}

export default function StudentProfilePage() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentSkill, setCurrentSkill] = useState("");
  const [currentProficiency, setCurrentProficiency] = useState("BEGINNER");
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [profile, setProfile] = useState({
    personal: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      location: "",
      avatar: "/api/placeholder/40/40"
    },
    academic: {
      university: "",
      program: "",
      year: "",
      gpa: "",
      expectedGraduation: "",
      major: "",
      minor: ""
    },
    social: {
      linkedin: "",
      github: "",
      portfolio: "",
      twitter: ""
    },
    skills: [] as string[],
    interests: [] as string[],
    achievements: [] as string[]
  });

  // Get user ID from localStorage
  const getUserId = () => {
    const userId = localStorage.getItem('userId') || 
                   localStorage.getItem('studentId') || 
                   localStorage.getItem('mentorId') ||
                   localStorage.getItem('user_id') ||
                   '12'; // Fallback to test student ID for testing
    console.log('Retrieved userId from localStorage:', userId);
    console.log('All localStorage keys:', Object.keys(localStorage));
    
    // For testing - set a test user ID if none exists
    if (!localStorage.getItem('userId') && !localStorage.getItem('studentId')) {
      console.log('Setting test userId for development');
      localStorage.setItem('userId', '12');
    }
    
    return userId;
  };

  // Load user profile data
  useEffect(() => {
    const loadProfile = async () => {
      const userId = getUserId();
      console.log('loadProfile - userId:', userId);
      
      if (!userId) {
        console.log('No userId found, setting loading to false');
        setLoading(false);
        return;
      }

      try {
        console.log('Fetching profile for userId:', userId);
        
        // Direct API call to test
        const response = await fetch(`http://localhost:8000/api/profile/${userId}/`);
        console.log('Direct fetch response status:', response.status);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const userData = await response.json();
        console.log('Profile API response data:', userData);
        
        // Parse name into first and last name
        const fullName = userData.full_name || userData.name || '';
        const nameParts = fullName.split(' ');
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';
        
        // Extract skills names from skills array
        const skillNames = userData.skills ? userData.skills.map((skill: any) => 
          typeof skill === 'string' ? skill : skill.name
        ) : [];
        
        setProfile({
          personal: {
            firstName,
            lastName,
            email: userData.email || '',
            phone: userData.mobile_number || userData.phone || '',
            location: userData.current_city || userData.location || '',
            avatar: "/api/placeholder/40/40"
          },
          academic: {
            university: userData.university_institute || userData.university || '',
            program: userData.course || userData.degree || userData.field_of_study || '',
            year: userData.passing_year || userData.year_of_passout ? `${userData.passing_year || userData.year_of_passout}` : '',
            gpa: userData.marks_percentage ? `${userData.marks_percentage}` : '',
            expectedGraduation: userData.passing_year || userData.year_of_passout ? `${userData.passing_year || userData.year_of_passout}` : '',
            major: userData.specialization || userData.field_of_study || '',
            minor: ''
          },
          social: {
            linkedin: userData.preferred_locations ? JSON.parse(userData.preferred_locations)[0] || '' : '',
            github: '',
            portfolio: '',
            twitter: ''
          },
          skills: skillNames,
          interests: [],
          achievements: []
        });
        console.log('Profile loaded successfully:', userData);
        console.log('Skills extracted:', skillNames);
        
        // Get skill recommendations
        try {
          const recResponse = await fetch(`http://localhost:8000/api/profile/${userId}/skill-recommendations/`);
          if (recResponse.ok) {
            const recData = await recResponse.json();
            setRecommendations(recData.recommendations || []);
          }
        } catch (error) {
          console.error('Failed to get recommendations:', error);
        }
      } catch (error) {
        console.error('Failed to load profile:', error);
        toast({
          title: "Error",
          description: `Failed to load profile data: ${error.message}`,
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [user, toast]);

  const addSkill = (skill: string) => {
    if (skill && !profile.skills.includes(skill)) {
      setProfile(prev => ({
        ...prev,
        skills: [...prev.skills, `${skill} (${currentProficiency})`]
      }));
      setCurrentSkill("");
      setCurrentProficiency("BEGINNER");
    }
  };

  const removeSkill = (skill: string) => {
    setProfile(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill)
    }));
  };

  const handleSave = async () => {
    const userId = getUserId();
    if (!userId) {
      toast({
        title: "Error",
        description: "User ID not found. Please log in again.",
        variant: "destructive"
      });
      return;
    }

    try {
      setLoading(true);
      const profileData = {
        full_name: `${profile.personal.firstName} ${profile.personal.lastName}`.trim(),
        name: `${profile.personal.firstName} ${profile.personal.lastName}`.trim(),
        email: profile.personal.email,
        mobile_number: profile.personal.phone,
        phone: profile.personal.phone,
        current_city: profile.personal.location,
        location: profile.personal.location,
        university_institute: profile.academic.university,
        university: profile.academic.university,
        course: profile.academic.program,
        specialization: profile.academic.major,
        field_of_study: profile.academic.major,
        degree: profile.academic.program,
        passing_year: profile.academic.year ? parseInt(profile.academic.year) : null,
        year_of_passout: profile.academic.year ? parseInt(profile.academic.year) : null,
        marks_percentage: profile.academic.gpa ? parseFloat(profile.academic.gpa) : null,
        skills: profile.skills.map(skill => {
          const skillName = skill.includes('(') ? skill.split(' (')[0] : skill;
          const proficiency = skill.includes('(') ? skill.split('(')[1].replace(')', '') : 'BEGINNER';
          return {
            name: skillName,
            category: 'PROGRAMMING',
            proficiency: proficiency,
            years_of_experience: 0,
            is_certified: false
          };
        })
      };

      console.log('Sending profile data:', profileData);
      await updateUserProfile(parseInt(userId), profileData);
      
      setIsEditing(false);
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (section: string, field: string, value: string) => {
    setProfile(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [field]: value
      }
    }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Handle file upload logic here
      toast({
        title: "File Uploaded",
        description: "Your file has been uploaded successfully.",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center space-x-2">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Loading profile...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Debug Info */}
      <ProfileDebug />
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Profile</h1>
          <p className="text-muted-foreground mt-1">Manage your personal and academic information</p>
        </div>
        <div className="flex items-center space-x-4">
          {isEditing ? (
            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </div>
          ) : (
            <Button onClick={() => setIsEditing(true)}>
              <Edit3 className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Profile Picture & Basic Info */}
        <div className="lg:col-span-1 space-y-6">
          {/* Profile Picture */}
          <Card className="bg-card rounded-2xl shadow-sm border">
            <CardHeader className="text-center pb-4">
              <CardTitle>Profile Picture</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="relative inline-block">
                <Avatar className="w-32 h-32 border-4 border-background shadow-lg">
                  <AvatarImage src={profile.personal.avatar} />
                  <AvatarFallback className="bg-muted text-muted-foreground text-2xl font-bold">
                    {profile.personal.firstName[0]}{profile.personal.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <div className="absolute bottom-0 right-0">
                    <Button size="sm" className="rounded-full w-10 h-10 p-0">
                      <Upload className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
              {isEditing && (
                <div className="mt-4">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="avatar-upload"
                  />
                  <Label htmlFor="avatar-upload" className="cursor-pointer">
                    <Button variant="outline" className="w-full">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload New Photo
                    </Button>
                  </Label>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="bg-card rounded-2xl shadow-sm border">
            <CardHeader className="pb-4">
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-muted rounded-xl">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <BookOpen className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-sm font-medium">Projects</span>
                </div>
                <Badge className="bg-blue-100 text-blue-600">12</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted rounded-xl">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Award className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-sm font-medium">Certifications</span>
                </div>
                <Badge className="bg-green-100 text-green-600">5</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted rounded-xl">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <Target className="w-4 h-4 text-red-600" />
                  </div>
                  <span className="text-sm font-medium">Skills</span>
                </div>
                <Badge className="bg-red-100 text-red-600">{profile.skills.length}</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Detailed Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <Card className="bg-card rounded-2xl shadow-sm border">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <span>Personal Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName" className="text-sm font-medium">First Name</Label>
                  <Input
                    id="firstName"
                    value={profile.personal.firstName}
                    onChange={(e) => handleInputChange('personal', 'firstName', e.target.value)}
                    disabled={!isEditing}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName" className="text-sm font-medium">Last Name</Label>
                  <Input
                    id="lastName"
                    value={profile.personal.lastName}
                    onChange={(e) => handleInputChange('personal', 'lastName', e.target.value)}
                    disabled={!isEditing}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.personal.email}
                    onChange={(e) => handleInputChange('personal', 'email', e.target.value)}
                    disabled={!isEditing}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="phone" className="text-sm font-medium">Phone</Label>
                  <Input
                    id="phone"
                    value={profile.personal.phone}
                    onChange={(e) => handleInputChange('personal', 'phone', e.target.value)}
                    disabled={!isEditing}
                    className="mt-1"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="location" className="text-sm font-medium">Location</Label>
                  <Input
                    id="location"
                    value={profile.personal.location}
                    onChange={(e) => handleInputChange('personal', 'location', e.target.value)}
                    disabled={!isEditing}
                    className="mt-1"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Academic Information */}
          <Card className="bg-card rounded-2xl shadow-sm border">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <GraduationCap className="w-5 h-5 text-green-600" />
                </div>
                <span>Academic Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="university" className="text-sm font-medium">University</Label>
                  <Input
                    id="university"
                    value={profile.academic.university}
                    onChange={(e) => handleInputChange('academic', 'university', e.target.value)}
                    disabled={!isEditing}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="program" className="text-sm font-medium">Program</Label>
                  <Input
                    id="program"
                    value={profile.academic.program}
                    onChange={(e) => handleInputChange('academic', 'program', e.target.value)}
                    disabled={!isEditing}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="year" className="text-sm font-medium">Year</Label>
                  <Input
                    id="year"
                    value={profile.academic.year}
                    onChange={(e) => handleInputChange('academic', 'year', e.target.value)}
                    disabled={!isEditing}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="gpa" className="text-sm font-medium">GPA</Label>
                  <Input
                    id="gpa"
                    value={profile.academic.gpa}
                    onChange={(e) => handleInputChange('academic', 'gpa', e.target.value)}
                    disabled={!isEditing}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="major" className="text-sm font-medium">Major</Label>
                  <Input
                    id="major"
                    value={profile.academic.major}
                    onChange={(e) => handleInputChange('academic', 'major', e.target.value)}
                    disabled={!isEditing}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="minor" className="text-sm font-medium">Minor</Label>
                  <Input
                    id="minor"
                    value={profile.academic.minor}
                    onChange={(e) => handleInputChange('academic', 'minor', e.target.value)}
                    disabled={!isEditing}
                    className="mt-1"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="graduation" className="text-sm font-medium">Expected Graduation</Label>
                  <Input
                    id="graduation"
                    value={profile.academic.expectedGraduation}
                    onChange={(e) => handleInputChange('academic', 'expectedGraduation', e.target.value)}
                    disabled={!isEditing}
                    className="mt-1"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Social Links */}
          <Card className="bg-card rounded-2xl shadow-sm border">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Globe className="w-5 h-5 text-purple-600" />
                </div>
                <span>Social Links</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="linkedin" className="text-sm font-medium flex items-center space-x-2">
                    <Linkedin className="w-4 h-4" />
                    <span>LinkedIn</span>
                  </Label>
                  <Input
                    id="linkedin"
                    value={profile.social.linkedin}
                    onChange={(e) => handleInputChange('social', 'linkedin', e.target.value)}
                    disabled={!isEditing}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="github" className="text-sm font-medium flex items-center space-x-2">
                    <Github className="w-4 h-4" />
                    <span>GitHub</span>
                  </Label>
                  <Input
                    id="github"
                    value={profile.social.github}
                    onChange={(e) => handleInputChange('social', 'github', e.target.value)}
                    disabled={!isEditing}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="portfolio" className="text-sm font-medium">Portfolio</Label>
                  <Input
                    id="portfolio"
                    value={profile.social.portfolio}
                    onChange={(e) => handleInputChange('social', 'portfolio', e.target.value)}
                    disabled={!isEditing}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="twitter" className="text-sm font-medium">Twitter</Label>
                  <Input
                    id="twitter"
                    value={profile.social.twitter}
                    onChange={(e) => handleInputChange('social', 'twitter', e.target.value)}
                    disabled={!isEditing}
                    className="mt-1"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Skills */}
          <Card className="bg-card rounded-2xl shadow-sm border">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center space-x-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Target className="w-5 h-5 text-orange-600" />
                </div>
                <span>Skills</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill, index) => (
                    <div key={index} className="flex items-center gap-1">
                      {isEditing ? (
                        <div className="flex items-center gap-1 p-2 border rounded-lg">
                          <Input
                            value={skill.split(' (')[0]}
                            onChange={(e) => {
                              const proficiency = skill.includes('(') ? skill.split('(')[1].replace(')', '') : 'BEGINNER';
                              const newSkills = [...profile.skills];
                              newSkills[index] = `${e.target.value} (${proficiency})`;
                              setProfile(prev => ({ ...prev, skills: newSkills }));
                            }}
                            className="w-24 h-6 text-xs"
                          />
                          <select
                            value={skill.includes('(') ? skill.split('(')[1].replace(')', '') : 'BEGINNER'}
                            onChange={(e) => {
                              const skillName = skill.split(' (')[0];
                              const newSkills = [...profile.skills];
                              newSkills[index] = `${skillName} (${e.target.value})`;
                              setProfile(prev => ({ ...prev, skills: newSkills }));
                            }}
                            className="text-xs p-1 border rounded"
                          >
                            <option value="BEGINNER">Beginner</option>
                            <option value="INTERMEDIATE">Intermediate</option>
                            <option value="ADVANCED">Advanced</option>
                            <option value="EXPERT">Expert</option>
                          </select>
                          <X className="w-3 h-3 cursor-pointer" onClick={() => removeSkill(skill)} />
                        </div>
                      ) : (
                        <Badge variant="outline">{skill}</Badge>
                      )}
                    </div>
                  ))}
                </div>
                
                {isEditing && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                      <Input
                        value={currentSkill}
                        onChange={(e) => setCurrentSkill(e.target.value)}
                        placeholder="Skill name"
                      />
                      <select 
                        value={currentProficiency}
                        onChange={(e) => setCurrentProficiency(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-md"
                      >
                        <option value="BEGINNER">Beginner</option>
                        <option value="INTERMEDIATE">Intermediate</option>
                        <option value="ADVANCED">Advanced</option>
                        <option value="EXPERT">Expert</option>
                      </select>
                      <Button type="button" onClick={() => addSkill(currentSkill)} size="sm">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    {recommendations.length > 0 && (
                      <div>
                        <Label className="text-sm text-muted-foreground">Recommended for you:</Label>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {recommendations.map((skill) => (
                            <Badge
                              key={skill}
                              variant="outline"
                              className="cursor-pointer hover:bg-blue-50"
                              onClick={() => addSkill(skill)}
                            >
                              + {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Resume */}
          <Card className="bg-card rounded-2xl shadow-sm border">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center space-x-3">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <FileText className="w-5 h-5 text-indigo-600" />
                </div>
                <span>Resume</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResumeViewer userId={getUserId()} />
            </CardContent>
          </Card>

          {/* Achievements */}
          <Card className="bg-card rounded-2xl shadow-sm border">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center space-x-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Award className="w-5 h-5 text-yellow-600" />
                </div>
                <span>Achievements</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {profile.achievements.map((achievement, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-muted rounded-xl">
                    <div className="p-1 bg-yellow-500 rounded-full mt-1">
                      <Award className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-sm">{achievement}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>


    </div>
  );
} 