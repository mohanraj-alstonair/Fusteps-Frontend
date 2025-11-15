import { useState } from 'react';
import { PlusCircle, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { api, withRole } from '@/lib/api';

type JobPayload = {
  title: string;
  department?: string;
  type: "full-time"|"part-time"|"contract"|"internship";
  location: string;
  salary?: string;
  remote: "on-site"|"remote"|"hybrid";
  description: string;
  requirements: string;
  skills?: string[];
  status?: "draft"|"pending";
};

export default function PostOpportunity() {
  const [showForm, setShowForm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<JobPayload>({
    title: '',
    department: '',
    type: 'internship',
    location: '',
    salary: '',
    remote: 'on-site',
    description: '',
    requirements: '',
    skills: [],
    status: 'pending'
  });
  const [skillInput, setSkillInput] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const base = (import.meta as any)?.env?.VITE_API_BASE_URL || `${window.location.origin}/fusteps-jobs`;
      console.log('Posting to:', `${base}/jobs`);
      console.log('Form data:', formData);
      
      const response = await fetch(`${base}/jobs`, {
        method: 'POST',
        headers: { "Content-Type": "application/json", "X-User-Role": "alumni" },
        body: JSON.stringify(formData)
      });
      
      console.log('Job post status:', response.status);
      const responseText = await response.text();
      console.log('Job post response:', responseText);
      
      if (response.ok) {
        setShowSuccess(true);
      } else {
        throw new Error(`HTTP ${response.status}: ${responseText}`);
      }
      setShowForm(false);
      setFormData({
        title: '',
        department: '',
        type: 'internship',
        location: '',
        salary: '',
        remote: 'on-site',
        description: '',
        requirements: '',
        skills: [],
        status: 'pending'
      });
    } catch (error) {
      console.error('Error posting job:', error);
      alert('Error posting job. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const addSkill = () => {
    if (skillInput.trim() && !formData.skills?.includes(skillInput.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...(prev.skills || []), skillInput.trim()]
      }));
      setSkillInput('');
    }
  };

  const removeSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills?.filter(s => s !== skill) || []
    }));
  };

  if (showSuccess) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-card p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-xl mx-auto mb-4 flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-700" />
          </div>
          <h3 className="text-xl font-semibold text-ink-900 mb-2">Job Posted Successfully!</h3>
          <p className="text-ink-500 mb-6">Your job posting has been submitted for admin approval.</p>
          <Button 
            onClick={() => setShowSuccess(false)}
            className="bg-ink-900 text-white hover:opacity-90"
          >
            Post Another Job
          </Button>
        </div>
      </div>
    );
  }

  if (!showForm) {
    return (
      <div className="max-w-7xl mx-auto">
        <p className="text-ink-500 mb-8">Share job opportunities and internships with students.</p>
        
        <div className="bg-white rounded-2xl shadow-card p-8 text-center">
          <div className="w-16 h-16 bg-sun-100 rounded-xl mx-auto mb-4 flex items-center justify-center">
            <PlusCircle className="w-8 h-8 text-sun-700" />
          </div>
          <h3 className="text-xl font-semibold text-ink-900 mb-2" data-testid="text-post-opportunity-title">Post Opportunity</h3>
          <p className="text-ink-500" data-testid="text-post-opportunity-description">Help students find great opportunities at your company.</p>
          
          <div className="mt-6">
            <Button 
              onClick={() => setShowForm(true)}
              className="bg-ink-900 text-white hover:opacity-90"
              data-testid="button-post-job"
            >
              Post Job
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Post New Job Opportunity</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Job Title *</Label>
                <Input
                  id="title"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g. Software Engineering Intern"
                />
              </div>
              <div>
                <Label htmlFor="department">Department</Label>
                <Input
                  id="department"
                  value={formData.department}
                  onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                  placeholder="e.g. Engineering"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="type">Job Type *</Label>
                <Select value={formData.type} onValueChange={(value: any) => setFormData(prev => ({ ...prev, type: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="internship">Internship</SelectItem>
                    <SelectItem value="full-time">Full-time</SelectItem>
                    <SelectItem value="part-time">Part-time</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="e.g. San Francisco, CA"
                />
              </div>
              <div>
                <Label htmlFor="remote">Work Mode *</Label>
                <Select value={formData.remote} onValueChange={(value: any) => setFormData(prev => ({ ...prev, remote: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="on-site">On-site</SelectItem>
                    <SelectItem value="remote">Remote</SelectItem>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="salary">Salary/Compensation</Label>
              <Input
                id="salary"
                value={formData.salary}
                onChange={(e) => setFormData(prev => ({ ...prev, salary: e.target.value }))}
                placeholder="e.g. $8,000/month or $80,000/year"
              />
            </div>

            <div>
              <Label htmlFor="description">Job Description *</Label>
              <Textarea
                id="description"
                required
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe the role, responsibilities, and what the candidate will work on..."
              />
            </div>

            <div>
              <Label htmlFor="requirements">Requirements *</Label>
              <Textarea
                id="requirements"
                required
                rows={3}
                value={formData.requirements}
                onChange={(e) => setFormData(prev => ({ ...prev, requirements: e.target.value }))}
                placeholder="List the required qualifications, experience, and education..."
              />
            </div>

            <div>
              <Label>Skills</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  placeholder="Add a skill"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                />
                <Button type="button" onClick={addSkill} variant="outline">
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.skills?.map((skill) => (
                  <Badge key={skill} variant="secondary" className="cursor-pointer" onClick={() => removeSkill(skill)}>
                    {skill} ×
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={loading} className="bg-ink-900 text-white hover:opacity-90">
                {loading ? 'Posting...' : 'Post Job'}
              </Button>
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
