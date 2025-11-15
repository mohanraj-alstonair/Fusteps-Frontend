import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { User, FileText, Shield, Bell, Eye, Upload, Download, Trash2 } from "lucide-react";

export default function StudentSettingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>
          <p className="text-gray-600 mt-1">Manage your profile, resume, and privacy settings</p>
        </div>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="resume">Resume</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Personal Information
              </CardTitle>
              <CardDescription>Update your personal details and contact information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <Avatar className="w-20 h-20">
                  <AvatarImage src="/api/placeholder/80/80" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div className="flex gap-2">
                  <Button variant="outline">
                    <Upload className="w-4 h-4 mr-2" />
                    Change Photo
                  </Button>
                  <Button variant="outline">Remove Photo</Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" defaultValue="John" />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" defaultValue="Doe" />
                </div>
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" defaultValue="john.doe@university.edu" />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" defaultValue="+1 (555) 123-4567" />
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input id="location" defaultValue="San Francisco, CA" />
                </div>
                <div>
                  <Label htmlFor="university">University</Label>
                  <Input id="university" defaultValue="Stanford University" />
                </div>
                <div>
                  <Label htmlFor="major">Major</Label>
                  <Input id="major" defaultValue="Computer Science" />
                </div>
                <div>
                  <Label htmlFor="graduationYear">Graduation Year</Label>
                  <Input id="graduationYear" defaultValue="2024" />
                </div>
              </div>

              <div>
                <Label htmlFor="bio">Professional Bio</Label>
                <Textarea 
                  id="bio" 
                  rows={4}
                  defaultValue="Passionate computer science student with experience in full-stack development and machine learning. Currently seeking internship opportunities in software engineering."
                />
              </div>

              <div>
                <Label htmlFor="skills">Skills & Technologies</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {["JavaScript", "React", "Python", "Node.js", "SQL"].map((skill) => (
                    <Badge key={skill} variant="secondary">{skill}</Badge>
                  ))}
                </div>
                <Input id="skills" placeholder="Add new skills (comma separated)" />
              </div>

              <div className="flex gap-2">
                <Button>Save Changes</Button>
                <Button variant="outline">Cancel</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resume" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Resume Management
              </CardTitle>
              <CardDescription>Upload and manage your resume for job applications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Upload Your Resume</h3>
                <p className="text-gray-600 mb-4">Drag and drop your resume file or click to browse</p>
                <Button>
                  <Upload className="w-4 h-4 mr-2" />
                  Choose File
                </Button>
                <p className="text-xs text-gray-500 mt-2">Supported formats: PDF, DOC, DOCX (Max 5MB)</p>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Current Resume</h3>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FileText className="w-8 h-8 text-gray-500" />
                        <div>
                          <p className="font-medium">John_Doe_Resume_2024.pdf</p>
                          <p className="text-sm text-gray-500">Uploaded on Feb 10, 2024 • 2.1 MB</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-2" />
                          Preview
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">AI Resume Optimization</h3>
                <Card>
                  <CardContent className="p-4">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Resume Score</span>
                        <span className="text-sm text-gray-500">78/100</span>
                      </div>
                      <Progress value={78} className="w-full" />
                      
                      <div className="space-y-2">
                        <h4 className="font-medium text-sm">Suggestions for Improvement:</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          <li>• Add more quantifiable achievements</li>
                          <li>• Include relevant technical projects</li>
                          <li>• Optimize keywords for ATS systems</li>
                        </ul>
                      </div>
                      
                      <Button variant="outline" className="w-full">
                        Get Detailed Analysis
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacy" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Privacy & Visibility
              </CardTitle>
              <CardDescription>Control who can see your profile and information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Profile Visibility</Label>
                    <p className="text-sm text-gray-500">Make your profile visible to employers and mentors</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Show Contact Information</Label>
                    <p className="text-sm text-gray-500">Display your email and phone number on your profile</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Resume Download</Label>
                    <p className="text-sm text-gray-500">Allow employers to download your resume</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Project Showcase</Label>
                    <p className="text-sm text-gray-500">Show your projects in public portfolio</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">AI Data Usage</Label>
                    <p className="text-sm text-gray-500">Allow AI to analyze your data for better recommendations</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>

              <div className="pt-4 border-t">
                <h3 className="font-semibold mb-4">Data Export & Deletion</h3>
                <div className="flex gap-2">
                  <Button variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Export My Data
                  </Button>
                  <Button variant="destructive">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Account
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notification Preferences
              </CardTitle>
              <CardDescription>Choose how you want to be notified about activities</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-semibold">Email Notifications</h3>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Job Recommendations</Label>
                    <p className="text-sm text-gray-500">Get notified about new job opportunities matching your profile</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Application Updates</Label>
                    <p className="text-sm text-gray-500">Receive updates on your job and internship applications</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Mentor Messages</Label>
                    <p className="text-sm text-gray-500">Get notified when mentors send you messages</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Course Updates</Label>
                    <p className="text-sm text-gray-500">Notifications about new courses and learning materials</p>
                  </div>
                  <Switch />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold">Push Notifications</h3>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Interview Reminders</Label>
                    <p className="text-sm text-gray-500">Get reminded about upcoming interviews</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Deadlines</Label>
                    <p className="text-sm text-gray-500">Reminders for application and project deadlines</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="account" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Account Security</CardTitle>
              <CardDescription>Manage your account security and login preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input id="currentPassword" type="password" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input id="newPassword" type="password" />
                </div>
                <div>
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input id="confirmPassword" type="password" />
                </div>
              </div>

              <Button>Update Password</Button>

              <div className="pt-6 border-t">
                <h3 className="font-semibold mb-4">Connected Accounts</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-900 rounded flex items-center justify-center">
                        <span className="text-white text-xs font-bold">G</span>
                      </div>
                      <span>GitHub</span>
                    </div>
                    <Button variant="outline" size="sm">Connect</Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                        <span className="text-white text-xs font-bold">Li</span>
                      </div>
                      <span>LinkedIn</span>
                    </div>
                    <Button variant="outline" size="sm">Connect</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}