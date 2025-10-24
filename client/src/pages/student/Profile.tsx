import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
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
  Target
} from "lucide-react";

export default function StudentProfilePage() {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    personal: {
      firstName: "Alexander",
      lastName: "Johnson",
      email: "alexander@student.edu",
      phone: "+1 (555) 123-4567",
      location: "San Francisco, CA",
      avatar: "/api/placeholder/40/40"
    },
    academic: {
      university: "Tech University",
      program: "Computer Science",
      year: "3rd Year",
      gpa: "3.8",
      expectedGraduation: "May 2025",
      major: "Computer Science",
      minor: "Mathematics"
    },
    social: {
      linkedin: "linkedin.com/in/alexanderjohnson",
      github: "github.com/alexanderjohnson",
      portfolio: "alexanderjohnson.dev",
      twitter: "@alexanderjohnson"
    },
    skills: [
      "React", "JavaScript", "Python", "Node.js", "MongoDB", "AWS", "Docker", "Git"
    ],
    interests: [
      "Job Prep", "Internships", "Skill Upgrade", "Startup Zone"
    ],
    achievements: [
      "Dean's List - 3 semesters",
      "Hackathon Winner - TechCrunch Disrupt 2024",
      "Google Developer Student Club Lead",
      "AWS Certified Cloud Practitioner"
    ]
  });

  const handleSave = () => {
    setIsEditing(false);
    toast({
      title: "Profile Updated",
      description: "Your profile has been successfully updated.",
    });
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600 mt-1">Manage your personal and academic information</p>
        </div>
        <div className="flex items-center space-x-4">
          <Button 
            variant="outline" 
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </>
            ) : (
              <>
                <Edit3 className="w-4 h-4 mr-2" />
                Edit Profile
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Profile Picture & Basic Info */}
        <div className="lg:col-span-1 space-y-6">
          {/* Profile Picture */}
          <Card className="bg-white rounded-2xl shadow-sm border-0">
            <CardHeader className="text-center pb-4">
              <CardTitle>Profile Picture</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="relative inline-block">
                <Avatar className="w-32 h-32 border-4 border-white shadow-lg">
                  <AvatarImage src={profile.personal.avatar} />
                  <AvatarFallback className="bg-gray-600 text-white text-2xl font-bold">
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
          <Card className="bg-white rounded-2xl shadow-sm border-0">
            <CardHeader className="pb-4">
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <BookOpen className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-sm font-medium">Projects</span>
                </div>
                <Badge variant="secondary">12</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Award className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-sm font-medium">Certifications</span>
                </div>
                <Badge variant="secondary">5</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Target className="w-4 h-4 text-purple-600" />
                  </div>
                  <span className="text-sm font-medium">Skills</span>
                </div>
                <Badge variant="secondary">{profile.skills.length}</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Detailed Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <Card className="bg-white rounded-2xl shadow-sm border-0">
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
                    disabled={!isEditing}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName" className="text-sm font-medium">Last Name</Label>
                  <Input
                    id="lastName"
                    value={profile.personal.lastName}
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
                    disabled={!isEditing}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="phone" className="text-sm font-medium">Phone</Label>
                  <Input
                    id="phone"
                    value={profile.personal.phone}
                    disabled={!isEditing}
                    className="mt-1"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="location" className="text-sm font-medium">Location</Label>
                  <Input
                    id="location"
                    value={profile.personal.location}
                    disabled={!isEditing}
                    className="mt-1"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Academic Information */}
          <Card className="bg-white rounded-2xl shadow-sm border-0">
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
                    disabled={!isEditing}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="program" className="text-sm font-medium">Program</Label>
                  <Input
                    id="program"
                    value={profile.academic.program}
                    disabled={!isEditing}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="year" className="text-sm font-medium">Year</Label>
                  <Input
                    id="year"
                    value={profile.academic.year}
                    disabled={!isEditing}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="gpa" className="text-sm font-medium">GPA</Label>
                  <Input
                    id="gpa"
                    value={profile.academic.gpa}
                    disabled={!isEditing}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="major" className="text-sm font-medium">Major</Label>
                  <Input
                    id="major"
                    value={profile.academic.major}
                    disabled={!isEditing}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="minor" className="text-sm font-medium">Minor</Label>
                  <Input
                    id="minor"
                    value={profile.academic.minor}
                    disabled={!isEditing}
                    className="mt-1"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="graduation" className="text-sm font-medium">Expected Graduation</Label>
                  <Input
                    id="graduation"
                    value={profile.academic.expectedGraduation}
                    disabled={!isEditing}
                    className="mt-1"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Social Links */}
          <Card className="bg-white rounded-2xl shadow-sm border-0">
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
                    disabled={!isEditing}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="portfolio" className="text-sm font-medium">Portfolio</Label>
                  <Input
                    id="portfolio"
                    value={profile.social.portfolio}
                    disabled={!isEditing}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="twitter" className="text-sm font-medium">Twitter</Label>
                  <Input
                    id="twitter"
                    value={profile.social.twitter}
                    disabled={!isEditing}
                    className="mt-1"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Skills */}
          <Card className="bg-white rounded-2xl shadow-sm border-0">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center space-x-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Target className="w-5 h-5 text-orange-600" />
                </div>
                <span>Skills</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill, index) => (
                  <Badge key={index} variant="outline">
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Achievements */}
          <Card className="bg-white rounded-2xl shadow-sm border-0">
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
                  <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-xl">
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

      {/* Action Buttons */}
      {isEditing && (
        <div className="flex justify-end space-x-4 pt-6">
          <Button 
            variant="outline" 
            onClick={() => setIsEditing(false)}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
          >
            Save Changes
          </Button>
        </div>
      )}
    </div>
  );
} 