import { useState, useEffect } from 'react';
import { Settings, Save, RefreshCw, Shield, Mail, Bell, Database, Globe, Key, Users, FileText, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { api, withRole } from '@/lib/api';

interface SystemSettings {
  general: {
    site_name: string;
    site_description: string;
    contact_email: string;
    timezone: string;
    language: string;
  };
  security: {
    session_timeout: number;
    password_min_length: number;
    two_factor_required: boolean;
    login_attempts_max: number;
    account_lockout_duration: number;
  };
  notifications: {
    email_enabled: boolean;
    smtp_host: string;
    smtp_port: number;
    smtp_username: string;
    smtp_password: string;
    email_from: string;
  };
  features: {
    user_registration: boolean;
    job_posting: boolean;
    mentorship_program: boolean;
    events_enabled: boolean;
    analytics_enabled: boolean;
  };
  maintenance: {
    maintenance_mode: boolean;
    maintenance_message: string;
    backup_frequency: string;
    log_retention_days: number;
  };
}

export default function AdminSettings() {
  const [settings, setSettings] = useState<SystemSettings>({
    general: {
      site_name: '',
      site_description: '',
      contact_email: '',
      timezone: 'UTC',
      language: 'en'
    },
    security: {
      session_timeout: 30,
      password_min_length: 8,
      two_factor_required: false,
      login_attempts_max: 5,
      account_lockout_duration: 15
    },
    notifications: {
      email_enabled: false,
      smtp_host: '',
      smtp_port: 587,
      smtp_username: '',
      smtp_password: '',
      email_from: ''
    },
    features: {
      user_registration: true,
      job_posting: true,
      mentorship_program: true,
      events_enabled: true,
      analytics_enabled: true
    },
    maintenance: {
      maintenance_mode: false,
      maintenance_message: '',
      backup_frequency: 'daily',
      log_retention_days: 90
    }
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('general');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await api.get("/admin/settings", withRole("admin"));
      if (response.data) {
        setSettings(response.data);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      // Keep default values
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      await api.put("/admin/settings", settings, withRole("admin"));
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Error saving settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const updateSetting = (category: keyof SystemSettings, field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value
      }
    }));
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading settings...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">System Settings</h1>
          <p className="text-gray-600 mt-1">Configure platform settings, security, and features</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={fetchSettings}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={saveSettings} disabled={saving}>
            {saving ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Settings Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                General Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="site-name">Site Name</Label>
                  <Input
                    id="site-name"
                    value={settings.general.site_name}
                    onChange={(e) => updateSetting('general', 'site_name', e.target.value)}
                    placeholder="Enter site name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact-email">Contact Email</Label>
                  <Input
                    id="contact-email"
                    type="email"
                    value={settings.general.contact_email}
                    onChange={(e) => updateSetting('general', 'contact_email', e.target.value)}
                    placeholder="admin@example.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="site-description">Site Description</Label>
                <Textarea
                  id="site-description"
                  value={settings.general.site_description}
                  onChange={(e) => updateSetting('general', 'site_description', e.target.value)}
                  placeholder="Brief description of your platform"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select
                    value={settings.general.timezone}
                    onValueChange={(value) => updateSetting('general', 'timezone', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UTC">UTC</SelectItem>
                      <SelectItem value="America/New_York">Eastern Time</SelectItem>
                      <SelectItem value="America/Chicago">Central Time</SelectItem>
                      <SelectItem value="America/Denver">Mountain Time</SelectItem>
                      <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                      <SelectItem value="Europe/London">London</SelectItem>
                      <SelectItem value="Europe/Paris">Paris</SelectItem>
                      <SelectItem value="Asia/Tokyo">Tokyo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language">Default Language</Label>
                  <Select
                    value={settings.general.language}
                    onValueChange={(value) => updateSetting('general', 'language', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                      <SelectItem value="zh">Chinese</SelectItem>
                      <SelectItem value="ja">Japanese</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Security Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                  <Input
                    id="session-timeout"
                    type="number"
                    value={settings.security.session_timeout}
                    onChange={(e) => updateSetting('security', 'session_timeout', parseInt(e.target.value))}
                    min="5"
                    max="480"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password-min-length">Minimum Password Length</Label>
                  <Input
                    id="password-min-length"
                    type="number"
                    value={settings.security.password_min_length}
                    onChange={(e) => updateSetting('security', 'password_min_length', parseInt(e.target.value))}
                    min="6"
                    max="32"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="login-attempts-max">Max Login Attempts</Label>
                  <Input
                    id="login-attempts-max"
                    type="number"
                    value={settings.security.login_attempts_max}
                    onChange={(e) => updateSetting('security', 'login_attempts_max', parseInt(e.target.value))}
                    min="3"
                    max="10"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lockout-duration">Account Lockout Duration (minutes)</Label>
                  <Input
                    id="lockout-duration"
                    type="number"
                    value={settings.security.account_lockout_duration}
                    onChange={(e) => updateSetting('security', 'account_lockout_duration', parseInt(e.target.value))}
                    min="5"
                    max="1440"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="two-factor">Require Two-Factor Authentication</Label>
                  <p className="text-sm text-gray-500">Force all users to enable 2FA for additional security</p>
                </div>
                <Switch
                  id="two-factor"
                  checked={settings.security.two_factor_required}
                  onCheckedChange={(checked) => updateSetting('security', 'two_factor_required', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Settings */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5" />
                Email Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="email-enabled">Enable Email Notifications</Label>
                  <p className="text-sm text-gray-500">Send automated emails for user actions and system events</p>
                </div>
                <Switch
                  id="email-enabled"
                  checked={settings.notifications.email_enabled}
                  onCheckedChange={(checked) => updateSetting('notifications', 'email_enabled', checked)}
                />
              </div>

              {settings.notifications.email_enabled && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="smtp-host">SMTP Host</Label>
                      <Input
                        id="smtp-host"
                        value={settings.notifications.smtp_host}
                        onChange={(e) => updateSetting('notifications', 'smtp_host', e.target.value)}
                        placeholder="smtp.gmail.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="smtp-port">SMTP Port</Label>
                      <Input
                        id="smtp-port"
                        type="number"
                        value={settings.notifications.smtp_port}
                        onChange={(e) => updateSetting('notifications', 'smtp_port', parseInt(e.target.value))}
                        placeholder="587"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="smtp-username">SMTP Username</Label>
                      <Input
                        id="smtp-username"
                        value={settings.notifications.smtp_username}
                        onChange={(e) => updateSetting('notifications', 'smtp_username', e.target.value)}
                        placeholder="your-email@gmail.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="smtp-password">SMTP Password</Label>
                      <Input
                        id="smtp-password"
                        type="password"
                        value={settings.notifications.smtp_password}
                        onChange={(e) => updateSetting('notifications', 'smtp_password', e.target.value)}
                        placeholder="App password"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email-from">From Email Address</Label>
                    <Input
                      id="email-from"
                      type="email"
                      value={settings.notifications.email_from}
                      onChange={(e) => updateSetting('notifications', 'email_from', e.target.value)}
                      placeholder="noreply@example.com"
                    />
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Features Settings */}
        <TabsContent value="features" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Feature Toggles
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="user-registration">User Registration</Label>
                    <p className="text-sm text-gray-500">Allow new users to register</p>
                  </div>
                  <Switch
                    id="user-registration"
                    checked={settings.features.user_registration}
                    onCheckedChange={(checked) => updateSetting('features', 'user_registration', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="job-posting">Job Posting</Label>
                    <p className="text-sm text-gray-500">Enable job posting functionality</p>
                  </div>
                  <Switch
                    id="job-posting"
                    checked={settings.features.job_posting}
                    onCheckedChange={(checked) => updateSetting('features', 'job_posting', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="mentorship-program">Mentorship Program</Label>
                    <p className="text-sm text-gray-500">Enable mentorship matching</p>
                  </div>
                  <Switch
                    id="mentorship-program"
                    checked={settings.features.mentorship_program}
                    onCheckedChange={(checked) => updateSetting('features', 'mentorship_program', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="events-enabled">Events System</Label>
                    <p className="text-sm text-gray-500">Enable event creation and management</p>
                  </div>
                  <Switch
                    id="events-enabled"
                    checked={settings.features.events_enabled}
                    onCheckedChange={(checked) => updateSetting('features', 'events_enabled', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="analytics-enabled">Analytics</Label>
                    <p className="text-sm text-gray-500">Enable platform analytics tracking</p>
                  </div>
                  <Switch
                    id="analytics-enabled"
                    checked={settings.features.analytics_enabled}
                    onCheckedChange={(checked) => updateSetting('features', 'analytics_enabled', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Maintenance Settings */}
        <TabsContent value="maintenance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5" />
                Maintenance Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Maintenance mode will make the platform unavailable to regular users.
                  Only administrators will be able to access the system.
                </AlertDescription>
              </Alert>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="maintenance-mode">Maintenance Mode</Label>
                  <p className="text-sm text-gray-500">Put the platform in maintenance mode</p>
                </div>
                <Switch
                  id="maintenance-mode"
                  checked={settings.maintenance.maintenance_mode}
                  onCheckedChange={(checked) => updateSetting('maintenance', 'maintenance_mode', checked)}
                />
              </div>

              {settings.maintenance.maintenance_mode && (
                <div className="space-y-2">
                  <Label htmlFor="maintenance-message">Maintenance Message</Label>
                  <Textarea
                    id="maintenance-message"
                    value={settings.maintenance.maintenance_message}
                    onChange={(e) => updateSetting('maintenance', 'maintenance_message', e.target.value)}
                    placeholder="We're currently performing maintenance. Please check back soon."
                    rows={3}
                  />
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="backup-frequency">Backup Frequency</Label>
                  <Select
                    value={settings.maintenance.backup_frequency}
                    onValueChange={(value) => updateSetting('maintenance', 'backup_frequency', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hourly">Hourly</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="log-retention">Log Retention (days)</Label>
                  <Input
                    id="log-retention"
                    type="number"
                    value={settings.maintenance.log_retention_days}
                    onChange={(e) => updateSetting('maintenance', 'log_retention_days', parseInt(e.target.value))}
                    min="7"
                    max="365"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
