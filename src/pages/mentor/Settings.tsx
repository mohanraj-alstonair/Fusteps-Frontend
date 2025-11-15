import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import {
  Settings as SettingsIcon,
  User,
  Bell,
  Shield,
  CreditCard,
  Globe,
  Moon,
  Sun,
  Camera,
  Save,
  Eye,
  EyeOff,
  Trash2,
  Download,
  Upload,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  Award,
  Calendar,
  Clock,
  DollarSign,
  MessageSquare,
  Volume2,
  VolumeX,
  Lock,
  Key,
  AlertTriangle
} from 'lucide-react';

interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  bio: string;
  location: string;
  timezone: string;
  languages: string[];
  avatar: string;
  title: string;
  company: string;
  experience: string;
  education: string;
  specialties: string[];
  hourlyRate: number;
  availability: string;
}

interface NotificationSettings {
  emailNotifications: boolean;
  sessionReminders: boolean;
  newMenteeRequests: boolean;
  feedbackReceived: boolean;
  paymentNotifications: boolean;
  marketingEmails: boolean;
  weeklyDigest: boolean;
  pushNotifications: boolean;
}

export default function Settings() {
  const [activeTab, setActiveTab] = useState('profile');
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [profileData, setProfileData] = useState<ProfileData>({
    firstName: 'Dr. Sarah',
    lastName: 'Johnson',
    email: 'sarah.johnson@fusteps.edu',
    phone: '+1 (555) 123-4567',
    bio: 'Experienced software engineer with 10+ years in tech leadership. Passionate about mentoring the next generation of developers.',
    location: 'San Francisco, CA',
    timezone: 'PST',
    languages: ['English', 'Spanish'],
    avatar: '/api/placeholder/120/120',
    title: 'Senior Software Engineer',
    company: 'TechCorp Inc.',
    experience: '10+ years',
    education: 'PhD in Computer Science',
    specialties: ['React', 'Node.js', 'System Design', 'Career Coaching'],
    hourlyRate: 75,
    availability: 'Weekdays 9AM-5PM'
  });

  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    emailNotifications: true,
    sessionReminders: true,
    newMenteeRequests: true,
    feedbackReceived: true,
    paymentNotifications: true,
    marketingEmails: false,
    weeklyDigest: true,
    pushNotifications: true
  });

  const handleProfileUpdate = (field: keyof ProfileData, value: any) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const handleNotificationUpdate = (field: keyof NotificationSettings, value: boolean) => {
    setNotificationSettings(prev => ({ ...prev, [field]: value }));
  };

  const handlePasswordChange = () => {
    if (newPassword !== confirmPassword) {
      alert('New passwords do not match');
      return;
    }
    // Handle password change logic here
    setShowPasswordDialog(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const timezones = [
    'PST', 'MST', 'CST', 'EST', 'GMT', 'CET', 'JST', 'IST'
  ];

  const languages = [
    'English', 'Spanish', 'French', 'German', 'Chinese', 'Japanese', 'Korean', 'Hindi'
  ];

  const specialties = [
    'React', 'Node.js', 'Python', 'Java', 'System Design', 'Career Coaching',
    'Interview Prep', 'Resume Review', 'Leadership', 'Project Management'
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-1">Manage your mentor profile and account preferences</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Photo */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="w-5 h-5 mr-2 text-blue-600" />
                  Profile Photo
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <Avatar className="w-24 h-24 mx-auto mb-4 border-4 border-gray-200">
                  <AvatarImage src={profileData.avatar} />
                  <AvatarFallback className="bg-gray-600 text-white text-xl">
                    {profileData.firstName[0]}{profileData.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <Button variant="outline" size="sm">
                    <Camera className="w-4 h-4 mr-2" />
                    Change Photo
                  </Button>
                  <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Remove
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Basic Information */}
            <Card className="border-0 shadow-lg lg:col-span-2">
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={profileData.firstName}
                      onChange={(e) => handleProfileUpdate('firstName', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={profileData.lastName}
                      onChange={(e) => handleProfileUpdate('lastName', e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => handleProfileUpdate('email', e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={profileData.phone}
                    onChange={(e) => handleProfileUpdate('phone', e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={profileData.bio}
                    onChange={(e) => handleProfileUpdate('bio', e.target.value)}
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Professional Information */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Briefcase className="w-5 h-5 mr-2 text-green-600" />
                Professional Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Job Title</Label>
                  <Input
                    id="title"
                    value={profileData.title}
                    onChange={(e) => handleProfileUpdate('title', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    value={profileData.company}
                    onChange={(e) => handleProfileUpdate('company', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="experience">Years of Experience</Label>
                  <Input
                    id="experience"
                    value={profileData.experience}
                    onChange={(e) => handleProfileUpdate('experience', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="hourlyRate">Hourly Rate ($)</Label>
                  <Input
                    id="hourlyRate"
                    type="number"
                    value={profileData.hourlyRate}
                    onChange={(e) => handleProfileUpdate('hourlyRate', parseInt(e.target.value))}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="education">Education</Label>
                <Input
                  id="education"
                  value={profileData.education}
                  onChange={(e) => handleProfileUpdate('education', e.target.value)}
                />
              </div>

              <div>
                <Label>Specialties</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {specialties.map((specialty) => (
                    <Badge
                      key={specialty}
                      variant={profileData.specialties.includes(specialty) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => {
                        const newSpecialties = profileData.specialties.includes(specialty)
                          ? profileData.specialties.filter(s => s !== specialty)
                          : [...profileData.specialties, specialty];
                        handleProfileUpdate('specialties', newSpecialties);
                      }}
                    >
                      {specialty}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Location & Availability */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-purple-600" />
                Location & Availability
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={profileData.location}
                    onChange={(e) => handleProfileUpdate('location', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select value={profileData.timezone} onValueChange={(value) => handleProfileUpdate('timezone', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {timezones.map((tz) => (
                        <SelectItem key={tz} value={tz}>{tz}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="availability">Availability</Label>
                <Input
                  id="availability"
                  value={profileData.availability}
                  onChange={(e) => handleProfileUpdate('availability', e.target.value)}
                />
              </div>

              <div>
                <Label>Languages</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {languages.map((language) => (
                    <Badge
                      key={language}
                      variant={profileData.languages.includes(language) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => {
                        const newLanguages = profileData.languages.includes(language)
                          ? profileData.languages.filter(l => l !== language)
                          : [...profileData.languages, language];
                        handleProfileUpdate('languages', newLanguages);
                      }}
                    >
                      {language}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="w-5 h-5 mr-2 text-orange-600" />
                Notification Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">Email Notifications</h4>
                    <p className="text-sm text-gray-600">Receive notifications via email</p>
                  </div>
                  <Switch
                    checked={notificationSettings.emailNotifications}
                    onCheckedChange={(checked) => handleNotificationUpdate('emailNotifications', checked)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">Session Reminders</h4>
                    <p className="text-sm text-gray-600">Get reminded about upcoming sessions</p>
                  </div>
                  <Switch
                    checked={notificationSettings.sessionReminders}
                    onCheckedChange={(checked) => handleNotificationUpdate('sessionReminders', checked)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">New Mentee Requests</h4>
                    <p className="text-sm text-gray-600">Notifications for new mentoring requests</p>
                  </div>
                  <Switch
                    checked={notificationSettings.newMenteeRequests}
                    onCheckedChange={(checked) => handleNotificationUpdate('newMenteeRequests', checked)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">Feedback Received</h4>
                    <p className="text-sm text-gray-600">Notifications when you receive feedback</p>
                  </div>
                  <Switch
                    checked={notificationSettings.feedbackReceived}
                    onCheckedChange={(checked) => handleNotificationUpdate('feedbackReceived', checked)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">Payment Notifications</h4>
                    <p className="text-sm text-gray-600">Updates about payments and payouts</p>
                  </div>
                  <Switch
                    checked={notificationSettings.paymentNotifications}
                    onCheckedChange={(checked) => handleNotificationUpdate('paymentNotifications', checked)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">Weekly Digest</h4>
                    <p className="text-sm text-gray-600">Weekly summary of your mentoring activity</p>
                  </div>
                  <Switch
                    checked={notificationSettings.weeklyDigest}
                    onCheckedChange={(checked) => handleNotificationUpdate('weeklyDigest', checked)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">Marketing Emails</h4>
                    <p className="text-sm text-gray-600">Receive updates about new features and promotions</p>
                  </div>
                  <Switch
                    checked={notificationSettings.marketingEmails}
                    onCheckedChange={(checked) => handleNotificationUpdate('marketingEmails', checked)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">Push Notifications</h4>
                    <p className="text-sm text-gray-600">Browser push notifications</p>
                  </div>
                  <Switch
                    checked={notificationSettings.pushNotifications}
                    onCheckedChange={(checked) => handleNotificationUpdate('pushNotifications', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Account Tab */}
        <TabsContent value="account" className="space-y-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="w-5 h-5 mr-2 text-green-600" />
                Payment Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Bank Account</h4>
                <p className="text-sm text-gray-600">**** **** **** 1234</p>
                <p className="text-sm text-gray-600">Bank of America</p>
              </div>
              <Button variant="outline">
                <CreditCard className="w-4 h-4 mr-2" />
                Update Payment Method
              </Button>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Download className="w-5 h-5 mr-2 text-blue-600" />
                Data & Privacy
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Download className="w-4 h-4 mr-2" />
                  Download My Data
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Upload className="w-4 h-4 mr-2" />
                  Import Data
                </Button>
                <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="w-5 h-5 mr-2 text-red-600" />
                Password & Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 mr-2" />
                  <div>
                    <h4 className="font-medium text-yellow-900">Security Recommendation</h4>
                    <p className="text-sm text-yellow-700">Consider updating your password regularly for better security.</p>
                  </div>
                </div>
              </div>

              <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Key className="w-4 h-4 mr-2" />
                    Change Password
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Change Password</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <Input
                        id="currentPassword"
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setShowPasswordDialog(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handlePasswordChange}>
                        Change Password
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">Two-Factor Authentication</h4>
                    <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                  </div>
                  <Button variant="outline">
                    <Shield className="w-4 h-4 mr-2" />
                    Enable 2FA
                  </Button>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">Login Sessions</h4>
                    <p className="text-sm text-gray-600">Manage your active login sessions</p>
                  </div>
                  <Button variant="outline">
                    View Sessions
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preferences Tab */}
        <TabsContent value="preferences" className="space-y-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Globe className="w-5 h-5 mr-2 text-indigo-600" />
                General Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="theme">Theme</Label>
                  <Select defaultValue="light">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">
                        <div className="flex items-center">
                          <Sun className="w-4 h-4 mr-2" />
                          Light
                        </div>
                      </SelectItem>
                      <SelectItem value="dark">
                        <div className="flex items-center">
                          <Moon className="w-4 h-4 mr-2" />
                          Dark
                        </div>
                      </SelectItem>
                      <SelectItem value="system">
                        <div className="flex items-center">
                          <Globe className="w-4 h-4 mr-2" />
                          System
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="language">Language</Label>
                  <Select defaultValue="en">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">Email Digest Frequency</h4>
                    <p className="text-sm text-gray-600">How often you receive email summaries</p>
                  </div>
                  <Select defaultValue="weekly">
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="never">Never</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">Session Reminders</h4>
                    <p className="text-sm text-gray-600">When to send session reminders</p>
                  </div>
                  <Select defaultValue="24h">
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1h">1 hour before</SelectItem>
                      <SelectItem value="24h">24 hours before</SelectItem>
                      <SelectItem value="1w">1 week before</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">Default Session Duration</h4>
                    <p className="text-sm text-gray-600">Default length for new sessions</p>
                  </div>
                  <Select defaultValue="60">
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                      <SelectItem value="90">1.5 hours</SelectItem>
                      <SelectItem value="120">2 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
