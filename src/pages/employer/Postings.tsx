import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Briefcase, MapPin, DollarSign, Users, Clock, Save } from "lucide-react";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { createJob, updateJob, type JobPayload } from "@/lib/api";


export default function EmployerPostJobPage() {
  const [, setLocation] = useLocation();
  const [isEditing, setIsEditing] = useState(false);
  const [jobId, setJobId] = useState<string | null>(null);
  const jobs: any[] = []; // Mock jobs array
  
  // Form state
  const [jobTitle, setJobTitle] = useState("");
  const [department, setDepartment] = useState("");
  const [jobType, setJobType] = useState("full-time");
  const [jobLocation, setJobLocation] = useState("");
  const [salary, setSalary] = useState("");
  const [remote, setRemote] = useState("on-site");
  const [description, setDescription] = useState("");
  const [requirements, setRequirements] = useState("");
  const [requiredSkills, setRequiredSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState("");
  


  // Check if we're editing a job from URL parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const editJobId = urlParams.get('edit');
    
    if (editJobId) {
      setIsEditing(true);
      setJobId(editJobId);
      loadJobForEditing(editJobId);
    }
  }, []);

  const loadJobForEditing = (jobId: string) => {
    const jobData = jobs.find(job => job.id === jobId);
    if (jobData) {
      setJobTitle(jobData.title);
      setDepartment(jobData.department);
      setJobType(jobData.type);
      setJobLocation(jobData.location);
      setSalary(jobData.salary);
      setRemote(jobData.remote);
      setDescription(jobData.description);
      setRequirements(jobData.requirements);
      setRequiredSkills(jobData.skills);
    }
  };

  const jobTemplates = [
    {
      title: "Software Engineer - Frontend",
      type: "full-time",
      skills: ["React", "TypeScript", "CSS", "JavaScript"],
      description: "Join our team to build amazing user interfaces..."
    },
    {
      title: "Data Science Intern",
      type: "internship", 
      skills: ["Python", "Machine Learning", "SQL", "Pandas"],
      description: "Work with our data team to analyze customer behavior..."
    },
    {
      title: "Backend Developer",
      type: "full-time",
      skills: ["Node.js", "PostgreSQL", "AWS", "Docker"],
      description: "Build scalable backend systems and APIs..."
    }
  ];

  const skillSuggestions = [
    "JavaScript", "Python", "React", "Node.js", "TypeScript", "SQL", "AWS", "Docker",
    "Machine Learning", "Data Analysis", "UI/UX Design", "MongoDB", "PostgreSQL", "Git"
  ];

  const addSkill = () => {
    if (newSkill.trim() && !requiredSkills.includes(newSkill.trim())) {
      setRequiredSkills([...requiredSkills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setRequiredSkills(requiredSkills.filter(skill => skill !== skillToRemove));
  };

  const handleSubmit = async () => {
    // Validate required fields
    if (!jobTitle.trim()) {
      alert('Please enter a job title');
      return;
    }
    if (!jobLocation.trim()) {
      alert('Please enter a location');
      return;
    }
    if (!description.trim()) {
      alert('Please enter a job description');
      return;
    }
    if (!requirements.trim()) {
      alert('Please enter job requirements');
      return;
    }

    const jobData: JobPayload = {
      job_title: jobTitle,
      department,
      job_type: jobType as any,
      location: jobLocation,
      salary,
      remote: remote as any,
      role_overview: description,
      requirements,
      qualifications: requirements,
      status: "pending",
    };

    try {
      if (isEditing && jobId) {
        await updateJob(Number(jobId), jobData);
        alert('Job updated successfully!');
      } else {
        const response = await createJob(jobData);
        console.log('Job creation response:', response);
        alert('Job submitted successfully! Awaiting admin approval.');
      }
      setLocation('/dashboard/employer');
    } catch (error: any) {
      console.error('Error submitting job:', error);
      console.error('Error response:', error.response);
      console.error('Error request:', error.request);
      const errorMessage = error.response?.data?.error || error.message || 'Error submitting job. Please try again.';
      alert(`Error: ${errorMessage}`);
    }
  };

  const handleSaveDraft = async () => {
    const jobData: JobPayload = {
      job_title: jobTitle,
      department,
      job_type: jobType as any,
      location: jobLocation,
      salary,
      remote: remote as any,
      role_overview: description,
      requirements,
      qualifications: requirements,
      status: "draft",
    };

    try {
      if (isEditing && jobId) {
        await updateJob(Number(jobId), jobData);
      } else {
        await createJob(jobData);
      }
      setLocation('/dashboard/employer');
    } catch (error) {
      console.error('Error saving draft:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {isEditing ? 'Edit Job Posting' : 'Post New Job'}
          </h1>
          <p className="text-gray-600 mt-1">
            {isEditing ? 'Update your job posting details' : 'Create job postings to attract top talent'}
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline"
            onClick={handleSaveDraft}
          >
            <Save className="w-4 h-4 mr-2" />
            Save as Draft
          </Button>
          <Button 
            onClick={handleSubmit}
          >
            {isEditing ? 'Update Job' : 'Publish Job'}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="create" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="create">Create Job Posting</TabsTrigger>
          <TabsTrigger value="templates">Use Template</TabsTrigger>
        </TabsList>

        <TabsContent value="create" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="w-5 h-5" />
                    Job Details
                  </CardTitle>
                  <CardDescription>Provide comprehensive information about the position</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="jobTitle">Job Title *</Label>
                      <Input 
                        id="jobTitle" 
                        placeholder="e.g. Senior Frontend Developer"
                        value={jobTitle}
                        onChange={(e) => setJobTitle(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="department">Department</Label>
                      <Input 
                        id="department" 
                        placeholder="e.g. Engineering"
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="jobType">Job Type *</Label>
                      <Select value={jobType} onValueChange={setJobType}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select job type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="full-time">Full-time</SelectItem>
                          <SelectItem value="part-time">Part-time</SelectItem>
                          <SelectItem value="contract">Contract</SelectItem>
                          <SelectItem value="internship">Internship</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="location">Location *</Label>
                      <Input 
                        id="location" 
                        placeholder="e.g. San Francisco, CA"
                        value={jobLocation}
                        onChange={(e) => setJobLocation(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="salary">Salary Range</Label>
                      <Input 
                        id="salary" 
                        placeholder="e.g. $80k - $120k"
                        value={salary}
                        onChange={(e) => setSalary(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="remote">Remote Work</Label>
                      <Select value={remote} onValueChange={setRemote}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select remote option" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="on-site">On-site</SelectItem>
                          <SelectItem value="remote">Remote</SelectItem>
                          <SelectItem value="hybrid">Hybrid</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="experience">Experience Level</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select experience level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="entry">Entry Level (0-2 years)</SelectItem>
                          <SelectItem value="mid">Mid Level (3-5 years)</SelectItem>
                          <SelectItem value="senior">Senior Level (5+ years)</SelectItem>
                          <SelectItem value="lead">Lead/Management</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">Job Description *</Label>
                    <Textarea 
                      id="description" 
                      rows={6}
                      placeholder="Provide a detailed description of the role, responsibilities, and what makes this opportunity exciting..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="requirements">Requirements *</Label>
                    <Textarea 
                      id="requirements" 
                      rows={6}
                      placeholder="List the key requirements and qualifications for this position..."
                      value={requirements}
                      onChange={(e) => setRequirements(e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="benefits">Benefits & Perks</Label>
                    <Textarea 
                      id="benefits" 
                      rows={3}
                      placeholder="Health insurance, retirement plans, flexible PTO, remote work options..."
                    />
                  </div>

                  <div>
                    <Label>Required Skills</Label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {requiredSkills.map((skill) => (
                        <Badge key={skill} variant="secondary">
                          {skill}
                          <button 
                            className="ml-2 text-gray-600 hover:text-gray-800"
                            onClick={() => removeSkill(skill)}
                          >
                            ×
                          </button>
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2 mb-2">
                      <Input 
                        placeholder="Add custom skill..."
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                      />
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={addSkill}
                      >
                        Add
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {skillSuggestions.filter(skill => !requiredSkills.includes(skill)).slice(0, 10).map((skill) => (
                        <button
                          key={skill}
                          className="text-sm px-3 py-1 border border-gray-300 rounded-full hover:bg-gray-50"
                          onClick={() => setRequiredSkills([...requiredSkills, skill])}
                        >
                          + {skill}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base">Application Deadline</Label>
                        <p className="text-sm text-gray-500">Set a deadline for applications</p>
                      </div>
                      <Input type="date" className="w-auto" />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base">AI Screening</Label>
                        <p className="text-sm text-gray-500">Use AI to pre-screen applications</p>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base">Urgent Hiring</Label>
                        <p className="text-sm text-gray-500">Mark as urgent to get priority visibility</p>
                      </div>
                      <Switch />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      onClick={handleSubmit}
                    >
                      {isEditing ? 'Update Job' : 'Publish Job'}
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => {
                        // In a real app, this would show a preview
                        console.log("Preview job posting");
                      }}
                    >
                      Preview
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Posting Tips</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-sm space-y-3">
                    <div>
                      <h4 className="font-medium">Write Clear Titles</h4>
                      <p className="text-gray-600">Use specific job titles that candidates search for</p>
                    </div>
                    <div>
                      <h4 className="font-medium">Be Specific</h4>
                      <p className="text-gray-600">Include required skills, experience level, and key responsibilities</p>
                    </div>
                    <div>
                      <h4 className="font-medium">Highlight Benefits</h4>
                      <p className="text-gray-600">Mention perks, growth opportunities, and company culture</p>
                    </div>
                    <div>
                      <h4 className="font-medium">Set Realistic Requirements</h4>
                      <p className="text-gray-600">Avoid excessive requirements that might deter qualified candidates</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="mt-4">
                <CardHeader>
                  <CardTitle>Posting Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm space-y-2">
                    <h3 className="font-semibold">Your posting will appear like this:</h3>
                    <div className="border rounded p-3 bg-gray-50">
                      <h4 className="font-medium">Senior Frontend Developer</h4>
                      <p className="text-sm text-gray-600">TechCorp • San Francisco, CA • Full-time</p>
                      <p className="text-sm mt-1">$80,000 - $120,000</p>
                      <div className="flex gap-1 mt-2">
                        <Badge variant="secondary" className="text-xs">JavaScript</Badge>
                        <Badge variant="secondary" className="text-xs">React</Badge>
                        <Badge variant="secondary" className="text-xs">Node.js</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <div className="grid gap-6">
            {jobTemplates.map((template, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-2">{template.title}</h3>
                      <p className="text-gray-600 mb-3">{template.description}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                        <Badge variant="outline" className="capitalize">{template.type}</Badge>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {template.skills.map((skill) => (
                          <Badge key={skill} variant="secondary" className="bg-blue-50 text-blue-700 text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <Button 
                      onClick={() => {
                        // In a real app, this would populate the form with template data
                        console.log("Using template:", template.title);
                      }}
                    >
                      Use Template
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}