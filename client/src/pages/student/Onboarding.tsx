import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { api } from "@/lib/api";
import { X, Plus, User, GraduationCap } from "lucide-react";

export default function OnboardingPage() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [currentSkill, setCurrentSkill] = useState("");
  const [recommendations, setRecommendations] = useState<string[]>([]);
  
  const [profile, setProfile] = useState({
    personal: {
      firstName: "",
      lastName: "",
      email: user?.email || "",
      phone: "",
      location: ""
    },
    academic: {
      university: "",
      program: "",
      year: "",
      major: "",
      degree: ""
    },
    skills: [] as string[]
  });

  const handleInputChange = (section: string, field: string, value: string) => {
    setProfile(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [field]: value
      }
    }));
    
    // Get recommendations when major changes
    if (field === 'major' && value && user?.id) {
      getSkillRecommendations();
    }
  };

  const getSkillRecommendations = async () => {
    if (!user?.id) return;
    try {
      const response = await api.get(`/api/profile/${user.id}/skill-recommendations/`);
      setRecommendations(response.data.recommendations || []);
    } catch (error) {
      console.error('Failed to get recommendations:', error);
    }
  };

  const addSkill = (skill: string) => {
    if (skill && !profile.skills.includes(skill)) {
      setProfile(prev => ({
        ...prev,
        skills: [...prev.skills, skill]
      }));
      setCurrentSkill("");
    }
  };

  const removeSkill = (skill: string) => {
    setProfile(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullName = `${profile.personal.firstName} ${profile.personal.lastName}`.trim();
    if (!fullName || !profile.personal.email || !profile.personal.phone) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const formData = {
        name: fullName,
        email: profile.personal.email,
        phone: profile.personal.phone,
        location: profile.personal.location,
        university: profile.academic.university,
        field_of_study: profile.academic.major,
        degree: profile.academic.degree,
        year_of_passout: profile.academic.year ? parseInt(profile.academic.year) : null,
        skills: profile.skills
      };
      
      await api.post('/api/onboarding/', formData);
      toast({
        title: "Success",
        description: "Onboarding completed successfully!",
      });
      window.location.href = '/dashboard/student';
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to complete onboarding",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground">Complete Your Profile</h1>
          <p className="text-muted-foreground mt-2">Tell us about yourself to get personalized recommendations</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <Card className="bg-card border">
            <CardHeader>
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
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    value={profile.personal.firstName}
                    onChange={(e) => handleInputChange('personal', 'firstName', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={profile.personal.lastName}
                    onChange={(e) => handleInputChange('personal', 'lastName', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.personal.email}
                    onChange={(e) => handleInputChange('personal', 'email', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone *</Label>
                  <Input
                    id="phone"
                    value={profile.personal.phone}
                    onChange={(e) => handleInputChange('personal', 'phone', e.target.value)}
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={profile.personal.location}
                    onChange={(e) => handleInputChange('personal', 'location', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Academic Information */}
          <Card className="bg-card border">
            <CardHeader>
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
                  <Label htmlFor="university">University</Label>
                  <Input
                    id="university"
                    value={profile.academic.university}
                    onChange={(e) => handleInputChange('academic', 'university', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="degree">Degree</Label>
                  <Input
                    id="degree"
                    value={profile.academic.degree}
                    onChange={(e) => handleInputChange('academic', 'degree', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="major">Major/Field of Study</Label>
                  <Input
                    id="major"
                    value={profile.academic.major}
                    onChange={(e) => handleInputChange('academic', 'major', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="year">Graduation Year</Label>
                  <Input
                    id="year"
                    type="number"
                    value={profile.academic.year}
                    onChange={(e) => handleInputChange('academic', 'year', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Skills */}
          <Card className="bg-card border">
            <CardHeader>
              <CardTitle>Skills & Expertise</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={currentSkill}
                  onChange={(e) => setCurrentSkill(e.target.value)}
                  placeholder="Add a skill"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill(currentSkill))}
                />
                <Button type="button" onClick={() => addSkill(currentSkill)}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill) => (
                  <Badge key={skill} variant="secondary" className="flex items-center gap-1">
                    {skill}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => removeSkill(skill)} />
                  </Badge>
                ))}
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
            </CardContent>
          </Card>

          <div className="flex justify-center">
            <Button type="submit" size="lg" disabled={loading} className="px-12">
              {loading ? "Saving..." : "Complete Onboarding"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}