import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";


// Icons
import {
  Briefcase,
  MapPin,
  DollarSign,
  Clock,
  Search,
  Bookmark,
  BookmarkCheck,
  ExternalLink,
  Eye,
  Star,
  Calendar,
  CheckCircle,
  AlertCircle,
  Send,
  FileText,
  Upload,
  User,
  X
} from "lucide-react";

interface Job {
  id: string;
  title: string;
  company: string;
  companyLogo: string;
  location: string;
  type: 'full-time' | 'part-time' | 'internship' | 'contract';
  experience: 'entry' | 'mid' | 'senior';
  salary: {
    min: number;
    max: number;
    currency: string;
  };
  description: string;
  requirements: string[];
  benefits: string[];
  postedDate: string;
  applicationDeadline?: string;
  isRemote: boolean;
  isBookmarked: boolean;
  matchScore?: number;
  status: 'open' | 'closed' | 'applied' | 'interviewing' | 'offered' | 'rejected';
  tags: string[];
}

interface Application {
  id: string;
  jobId: string;
  jobTitle: string;
  company: string;
  appliedDate: string;
  status: 'pending' | 'reviewing' | 'interview' | 'offer' | 'rejected';
  lastUpdate: string;
  notes?: string;
}

export default function JobTools() {
  const [activeTab, setActiveTab] = useState('browse');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedExperience, setSelectedExperience] = useState('all');
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showJobDetailsModal, setShowJobDetailsModal] = useState(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [fullName, setFullName] = useState('Sarah Johnson');
  const [email, setEmail] = useState('sarah.johnson@email.com');
  const [phone, setPhone] = useState('+1 (555) 123-4567');
  const [university, setUniversity] = useState('');
  const [major, setMajor] = useState('');
  const [cgpa, setCgpa] = useState('');

  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const applications: Application[] = [
    {
      id: '1',
      jobId: '3',
      jobTitle: 'Full Stack Developer',
      company: 'DataTech Solutions',
      appliedDate: '2024-01-18',
      status: 'reviewing',
      lastUpdate: '2024-01-22',
      notes: 'Submitted strong portfolio and relevant project experience'
    },
    {
      id: '2',
      jobId: '1',
      jobTitle: 'Frontend Developer',
      company: 'TechCorp Inc.',
      appliedDate: '2024-01-16',
      status: 'interview',
      lastUpdate: '2024-01-25',
      notes: 'Phone interview scheduled for next week'
    },
    {
      id: '3',
      jobId: '2',
      jobTitle: 'Software Engineering Intern',
      company: 'InnovateLabs',
      appliedDate: '2024-01-21',
      status: 'pending',
      lastUpdate: '2024-01-21'
    }
  ];

  useEffect(() => {
    const mockJobs: Job[] = [
      {
        id: '1',
        title: 'Frontend Developer',
        company: 'TechCorp Inc.',
        companyLogo: '/api/placeholder/40/40',
        location: 'San Francisco, CA',
        type: 'full-time',
        experience: 'entry',
        salary: { min: 70000, max: 90000, currency: 'USD' },
        description: 'Join our dynamic team to build amazing user experiences. You\'ll work with React, TypeScript, and modern web technologies.',
        requirements: ['1-2 years of React experience', 'Proficiency in JavaScript/TypeScript', 'Understanding of modern web development practices', 'Bachelor\'s degree in Computer Science or related field'],
        benefits: ['Health, dental, and vision insurance', 'Flexible working hours', 'Professional development budget', 'Stock options'],
        postedDate: '2024-01-15',
        applicationDeadline: '2024-02-15',
        isRemote: true,
        isBookmarked: true,
        matchScore: 95,
        status: 'open',
        tags: ['React', 'TypeScript', 'Frontend', 'Web Development']
      },
      {
        id: '2',
        title: 'Software Engineering Intern',
        company: 'InnovateLabs',
        companyLogo: '/api/placeholder/40/40',
        location: 'New York, NY',
        type: 'internship',
        experience: 'entry',
        salary: { min: 25, max: 35, currency: 'USD' },
        description: 'Summer internship opportunity for computer science students. Work on real projects with experienced mentors.',
        requirements: ['Currently pursuing CS degree', 'Basic programming knowledge', 'Strong problem-solving skills', 'Good communication skills'],
        benefits: ['Mentorship program', 'Learning opportunities', 'Networking events', 'Potential for full-time offer'],
        postedDate: '2024-01-20',
        applicationDeadline: '2024-03-01',
        isRemote: false,
        isBookmarked: false,
        matchScore: 88,
        status: 'open',
        tags: ['Internship', 'Software Engineering', 'Mentorship']
      },
      {
        id: '3',
        title: 'Full Stack Developer',
        company: 'DataTech Solutions',
        companyLogo: '/api/placeholder/40/40',
        location: 'Austin, TX',
        type: 'full-time',
        experience: 'mid',
        salary: { min: 85000, max: 110000, currency: 'USD' },
        description: 'Looking for a versatile full-stack developer to join our growing team. Experience with both frontend and backend technologies required.',
        requirements: ['3+ years of full-stack development experience', 'Strong knowledge of React and Node.js', 'Experience with databases (SQL/NoSQL)', 'Understanding of cloud platforms (AWS/Azure)'],
        benefits: ['Competitive salary', 'Remote work options', '401(k) with company match', 'Unlimited PTO'],
        postedDate: '2024-01-10',
        applicationDeadline: '2024-02-10',
        isRemote: true,
        isBookmarked: true,
        matchScore: 82,
        status: 'applied',
        tags: ['Full Stack', 'React', 'Node.js', 'AWS']
      },
      {
        id: '4',
        title: 'Data Analyst',
        company: 'Analytics Pro',
        companyLogo: '/api/placeholder/40/40',
        location: 'Chicago, IL',
        type: 'full-time',
        experience: 'entry',
        salary: { min: 60000, max: 75000, currency: 'USD' },
        description: 'Entry-level data analyst position focusing on business intelligence and data visualization.',
        requirements: ['Bachelor\'s degree in relevant field', 'Knowledge of SQL and Excel', 'Basic understanding of statistics', 'Experience with data visualization tools'],
        benefits: ['Health insurance', 'Professional development', 'Flexible schedule', 'Team building events'],
        postedDate: '2024-01-25',
        isRemote: false,
        isBookmarked: false,
        matchScore: 75,
        status: 'open',
        tags: ['Data Analysis', 'SQL', 'Excel', 'Business Intelligence']
      }
    ];
    setJobs(mockJobs);
    setLoading(false);
  }, []);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'full-time': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'part-time': return 'bg-green-100 text-green-800 border-green-200';
      case 'internship': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'contract': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getExperienceColor = (experience: string) => {
    switch (experience) {
      case 'entry': return 'bg-green-100 text-green-800 border-green-200';
      case 'mid': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'senior': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-green-100 text-green-800 border-green-200';
      case 'applied': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'interviewing': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'offered': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      case 'closed': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getApplicationStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'reviewing': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'interview': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'offer': return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatSalary = (salary: { min: number; max: number; currency: string }) => {
    return `${salary.currency} ${salary.min.toLocaleString()} - ${salary.max.toLocaleString()}`;
  };

  const toggleBookmark = (id: string) => {
    setJobs(prev => prev.map(job => job.id === id ? { ...job, isBookmarked: !job.isBookmarked } : job));
    // Bookmark updated silently
  };

  const openApplicationModal = (job: Job) => {
    setSelectedJob(job);
    setShowApplicationModal(true);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setResumeFile(file);

    const formDataUpload = new FormData();
    formDataUpload.append("file", file);

    fetch("http://127.0.0.1:8000/api/resumes/upload/", {
      method: "POST",
      body: formDataUpload,
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        setFullName(data.name || fullName);
        setEmail(data.email || email);
        setPhone(data.phone || phone);
        setUniversity(data.university || '');
        setMajor(data.field_of_study || '');
        setCgpa(''); // CGPA not parsed by backend
        alert('Resume uploaded and parsed successfully!');
      })
      .catch(error => {
        console.error("Error uploading resume:", error);
        alert('Failed to parse resume. Please try again.');
      });
  };

  const submitApplication = () => {
    if (!selectedJob) return;
    
    setJobs(prev => prev.map(job => job.id === selectedJob.id ? { ...job, status: 'applied' } : job));
    setShowApplicationModal(false);
    setResumeFile(null);
    setCoverLetter('');
    alert('Application submitted successfully!');
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         job.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesLocation = selectedLocation === 'all' || job.location.includes(selectedLocation);
    const matchesType = selectedType === 'all' || job.type === selectedType;
    const matchesExperience = selectedExperience === 'all' || job.experience === selectedExperience;
    return matchesSearch && matchesLocation && matchesType && matchesExperience;
  });

  const locations = ['all', ...Array.from(new Set(jobs.map(job => job.location.split(',')[0].trim())))];
  const types = ['all', 'full-time', 'part-time', 'internship', 'contract'];
  const experiences = ['all', 'entry', 'mid', 'senior'];

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading jobs...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Job Tools</h1>
        <p className="text-gray-600 mt-1">Discover and apply to amazing job opportunities</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="browse">Browse Jobs</TabsTrigger>
          <TabsTrigger value="applications">My Applications</TabsTrigger>
          <TabsTrigger value="saved">Saved Jobs</TabsTrigger>
          <TabsTrigger value="recommended">Recommended</TabsTrigger>
        </TabsList>

        <TabsContent value="browse" className="space-y-6">
          <Card className="bg-white rounded-2xl shadow-sm border-0">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search jobs, companies, or skills..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500 rounded-lg"
                    />
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="px-3 py-2 bg-gray-50 border border-gray-200 text-gray-900 rounded-lg text-sm"
                  >
                    {locations.map((location: string) => (
                      <option key={location} value={location}>
                        {location === 'all' ? 'All Locations' : location}
                      </option>
                    ))}
                  </select>
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="px-3 py-2 bg-gray-50 border border-gray-200 text-gray-900 rounded-lg text-sm"
                  >
                    {types.map((type: string) => (
                      <option key={type} value={type}>
                        {type === 'all' ? 'All Types' : type.replace('-', ' ')}
                      </option>
                    ))}
                  </select>
                  <select
                    value={selectedExperience}
                    onChange={(e) => setSelectedExperience(e.target.value)}
                    className="px-3 py-2 bg-gray-50 border border-gray-200 text-gray-900 rounded-lg text-sm"
                  >
                    {experiences.map((exp: string) => (
                      <option key={exp} value={exp}>
                        {exp === 'all' ? 'All Levels' : exp + ' level'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            {filteredJobs.map((job: Job) => (
              <Card key={job.id} className="bg-white rounded-2xl shadow-sm border-0 hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-4 flex-1">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={job.companyLogo} />
                        <AvatarFallback className="bg-gray-600 text-white">
                          {job.company.split(' ').map((n: string) => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold text-gray-900 text-xl mb-1">{job.title}</h3>
                            <p className="text-gray-600 text-lg">{job.company}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            {job.matchScore && (
                              <Badge className="bg-gray-900 text-white">
                                {job.matchScore}% match
                              </Badge>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleBookmark(job.id)}
                              className={job.isBookmarked ? 'text-yellow-500' : 'text-gray-400'}
                            >
                              {job.isBookmarked ? (
                                <BookmarkCheck className="w-5 h-5 fill-current" />
                              ) : (
                                <Bookmark className="w-5 h-5" />
                              )}
                            </Button>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                          <span className="flex items-center">
                            <MapPin className="w-4 h-4 mr-1" />
                            {job.location} {job.isRemote && '(Remote)'}
                          </span>
                          <span className="flex items-center">
                            <DollarSign className="w-4 h-4 mr-1" />
                            {formatSalary(job.salary)}
                          </span>
                          <span className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {job.postedDate}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 mb-3">
                          <Badge variant="outline" className={getTypeColor(job.type)}>
                            {job.type.replace('-', ' ')}
                          </Badge>
                          <Badge variant="outline" className={getExperienceColor(job.experience)}>
                            {job.experience} level
                          </Badge>
                          <Badge variant="outline" className={getStatusColor(job.status)}>
                            {job.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-600 mb-4 line-clamp-2">{job.description}</p>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {job.tags.map((tag: string) => (
                      <Badge key={tag} variant="outline" className="bg-gray-50 text-gray-900 border-gray-200 text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex space-x-2">
                      {job.status === 'open' ? (
                        <Button
                          className="bg-fusteps-red text-white hover:bg-red-600 rounded-lg"
                          onClick={() => openApplicationModal(job)}
                        >
                          <Send className="w-4 h-4 mr-2" />
                          Apply Now
                        </Button>
                      ) : job.status === 'applied' ? (
                        <Button variant="outline" className="bg-white border-gray-300 text-gray-900 hover:bg-gray-50 rounded-lg">
                          <Eye className="w-4 h-4 mr-2" />
                          View Application
                        </Button>
                      ) : null}
                      <Button variant="outline" className="bg-white border-gray-300 text-gray-900 hover:bg-gray-50 rounded-lg" onClick={() => { setSelectedJob(job); setShowJobDetailsModal(true); }}>
                        <ExternalLink className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                    </div>
                    {job.applicationDeadline && (
                      <p className="text-sm text-gray-500">
                        Deadline: {job.applicationDeadline}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="applications" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-gray-900">My Applications</h2>
            <Button className="bg-fusteps-red hover:bg-red-600 text-white" onClick={() => window.open('/dashboard/student/settings?tab=resume', '_self')}>
              <FileText className="w-4 h-4 mr-2" />
              Update Resume
            </Button>
          </div>

          <div className="space-y-4">
            {applications.map((application: Application) => (
              <Card key={application.id} className="bg-white rounded-2xl shadow-sm border-0">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg mb-1">{application.jobTitle}</h3>
                      <p className="text-gray-600 text-base">{application.company}</p>
                    </div>
                    <Badge variant="outline" className={getApplicationStatusColor(application.status)}>
                      {application.status}
                    </Badge>
                  </div>

                  <div className="flex items-center space-x-6 text-sm text-gray-500 mb-4">
                    <span className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      Applied: {application.appliedDate}
                    </span>
                    <span className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      Last update: {application.lastUpdate}
                    </span>
                  </div>

                  {application.notes && (
                    <p className="text-gray-600 mb-4">{application.notes}</p>
                  )}

                  <div className="flex space-x-2">
                    <Button variant="outline" className="bg-white border-gray-300 text-gray-900 hover:bg-gray-50 rounded-lg" onClick={() => window.open('/applications/' + application.id, '_blank')}>
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                    {application.status === 'interview' && (
                      <Button className="bg-fusteps-red text-white hover:bg-red-600 rounded-lg" onClick={() => window.open('/interviews/schedule/' + application.id, '_blank')}>
                        <Calendar className="w-4 h-4 mr-2" />
                        Schedule Interview
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="saved" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {jobs.filter(job => job.isBookmarked).map((job: Job) => (
              <Card key={job.id} className="bg-white rounded-2xl shadow-sm border-0 hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-4 flex-1">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={job.companyLogo} />
                        <AvatarFallback className="bg-gray-600 text-white">
                          {job.company.split(' ').map((n: string) => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold text-gray-900 text-lg mb-1">{job.title}</h3>
                            <p className="text-gray-600">{job.company}</p>
                          </div>
                          <BookmarkCheck className="w-5 h-5 text-yellow-500 fill-current" />
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                          <span className="flex items-center">
                            <MapPin className="w-4 h-4 mr-1" />
                            {job.location}
                          </span>
                          <span className="flex items-center">
                            <DollarSign className="w-4 h-4 mr-1" />
                            {formatSalary(job.salary)}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className={getTypeColor(job.type)}>
                            {job.type.replace('-', ' ')}
                          </Badge>
                          <Badge variant="outline" className={getStatusColor(job.status)}>
                            {job.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    {job.status === 'open' ? (
                      <Button
                        className="flex-1 bg-fusteps-red text-white hover:bg-red-600 rounded-lg"
                        onClick={() => openApplicationModal(job)}
                      >
                        <Send className="w-4 h-4 mr-2" />
                        Apply Now
                      </Button>
                    ) : (
                      <Button variant="outline" className="flex-1 bg-white border-gray-300 text-gray-900 hover:bg-gray-50 rounded-lg" onClick={() => window.open('/applications/' + job.id, '_blank')}>
                        <Eye className="w-4 h-4 mr-2" />
                        View Application
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      onClick={() => toggleBookmark(job.id)}
                      className="text-yellow-500"
                    >
                      <BookmarkCheck className="w-4 h-4 fill-current" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="recommended" className="space-y-6">
          <div className="space-y-4">
            {jobs
              .filter(job => job.matchScore && job.matchScore > 80)
              .sort((a: Job, b: Job) => (b.matchScore || 0) - (a.matchScore || 0))
              .map((job: Job) => (
                <Card key={job.id} className="bg-white rounded-2xl shadow-sm border-0 hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start space-x-4 flex-1">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={job.companyLogo} />
                          <AvatarFallback className="bg-gray-600 text-white">
                            {job.company.split(' ').map((n: string) => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="font-semibold text-gray-900 text-xl mb-1">{job.title}</h3>
                              <p className="text-gray-600 text-lg">{job.company}</p>
                            </div>
                            <div className="text-right">
                              <Badge className="bg-gray-900 text-white mb-2">
                                {job.matchScore}% match
                              </Badge>
                              <p className="text-sm text-gray-500">High match</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                            <span className="flex items-center">
                              <MapPin className="w-4 h-4 mr-1" />
                              {job.location}
                            </span>
                            <span className="flex items-center">
                              <DollarSign className="w-4 h-4 mr-1" />
                              {formatSalary(job.salary)}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline" className={getTypeColor(job.type)}>
                              {job.type.replace('-', ' ')}
                            </Badge>
                            <Badge variant="outline" className={getExperienceColor(job.experience)}>
                              {job.experience} level
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button
                        className="flex-1 bg-fusteps-red text-white hover:bg-red-600 rounded-lg"
                        onClick={() => openApplicationModal(job)}
                      >
                        <Send className="w-4 h-4 mr-2" />
                        Apply Now
                      </Button>
                      <Button
                        variant="outline"
                        className="bg-white border-gray-300 text-gray-900 hover:bg-gray-50 rounded-lg"
                        onClick={() => { setSelectedJob(job); setShowJobDetailsModal(true); }}
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Learn More
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={showApplicationModal} onOpenChange={setShowApplicationModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Send className="w-5 h-5 text-blue-600" />
              <span>Apply for {selectedJob?.title}</span>
            </DialogTitle>
          </DialogHeader>
          
          {selectedJob && (
            <div className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center space-x-3 mb-2">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={selectedJob.companyLogo} />
                    <AvatarFallback className="bg-gray-600 text-white">
                      {selectedJob.company.split(' ').map((n: string) => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-gray-900">{selectedJob.title}</h3>
                    <p className="text-sm text-gray-600">{selectedJob.company}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span className="flex items-center">
                    <MapPin className="w-3 h-3 mr-1" />
                    {selectedJob.location}
                  </span>
                  <span className="flex items-center">
                    <DollarSign className="w-3 h-3 mr-1" />
                    {formatSalary(selectedJob.salary)}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900 flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  Your Profile
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Full Name</Label>
                      <Input value={fullName} onChange={(e) => setFullName(e.target.value)} className="bg-gray-50" />
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Email</Label>
                      <Input value={email} onChange={(e) => setEmail(e.target.value)} className="bg-gray-50" />
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Phone</Label>
                      <Input value={phone} onChange={(e) => setPhone(e.target.value)} className="bg-gray-50" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm font-medium text-gray-700">University (Optional)</Label>
                      <Input value={university} onChange={(e) => setUniversity(e.target.value)} className="bg-gray-50" />
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Major (Optional)</Label>
                      <Input value={major} onChange={(e) => setMajor(e.target.value)} className="bg-gray-50" />
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700">CGPA (Optional)</Label>
                      <Input value={cgpa} onChange={(e) => setCgpa(e.target.value)} className="bg-gray-50" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900 flex items-center">
                  <FileText className="w-4 h-4 mr-2" />
                  Resume
                </h4>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                  {resumeFile ? (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <FileText className="w-8 h-8 text-blue-600" />
                        <div>
                          <p className="font-medium text-gray-900">{resumeFile.name}</p>
                          <p className="text-sm text-gray-500">{(resumeFile.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setResumeFile(null)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <div className="space-y-2">
                        <p className="text-gray-600">Upload your resume</p>
                        <p className="text-sm text-gray-500">PDF, DOC, or DOCX up to 10MB</p>
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={handleFileUpload}
                          className="hidden"
                          id="resume-upload"
                        />
                        <Button
                          variant="outline"
                          onClick={() => document.getElementById('resume-upload')?.click()}
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          Choose File
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">Cover Letter (Optional)</h4>
                <Textarea
                  placeholder="Write a brief cover letter explaining why you're interested in this position..."
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  rows={4}
                  className="resize-none"
                />
              </div>

              <div className="flex space-x-3 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => setShowApplicationModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={submitApplication}
                  disabled={!resumeFile}
                  className="flex-1 bg-fusteps-red hover:bg-red-600 text-white"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Submit Application
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={showJobDetailsModal} onOpenChange={setShowJobDetailsModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Briefcase className="w-5 h-5 text-blue-600" />
              <span>Job Details</span>
            </DialogTitle>
          </DialogHeader>
          
          {selectedJob && (
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={selectedJob.companyLogo} />
                  <AvatarFallback className="bg-gray-600 text-white text-lg">
                    {selectedJob.company.split(' ').map((n: string) => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedJob.title}</h2>
                  <p className="text-xl text-gray-600 mb-3">{selectedJob.company}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                    <span className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {selectedJob.location} {selectedJob.isRemote && '(Remote)'}
                    </span>
                    <span className="flex items-center">
                      <DollarSign className="w-4 h-4 mr-1" />
                      {formatSalary(selectedJob.salary)}
                    </span>
                    <span className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      Posted: {selectedJob.postedDate}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className={getTypeColor(selectedJob.type)}>
                      {selectedJob.type.replace('-', ' ')}
                    </Badge>
                    <Badge variant="outline" className={getExperienceColor(selectedJob.experience)}>
                      {selectedJob.experience} level
                    </Badge>
                    <Badge variant="outline" className={getStatusColor(selectedJob.status)}>
                      {selectedJob.status}
                    </Badge>
                    {selectedJob.matchScore && (
                      <Badge className="bg-gray-900 text-white">
                        {selectedJob.matchScore}% match
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Job Description</h3>
                <p className="text-gray-600 leading-relaxed">{selectedJob.description}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Requirements</h3>
                <ul className="space-y-2">
                  {selectedJob.requirements.map((req: string, index: number) => (
                    <li key={index} className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600">{req}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Benefits</h3>
                <ul className="space-y-2">
                  {selectedJob.benefits.map((benefit: string, index: number) => (
                    <li key={index} className="flex items-start space-x-2">
                      <Star className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Skills & Technologies</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedJob.tags.map((tag: string) => (
                    <Badge key={tag} variant="outline" className="bg-gray-50 text-gray-900 border-gray-200">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              {selectedJob.applicationDeadline && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="w-5 h-5 text-yellow-600" />
                    <span className="font-medium text-yellow-800">
                      Application Deadline: {selectedJob.applicationDeadline}
                    </span>
                  </div>
                </div>
              )}

              <div className="flex space-x-3 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => setShowJobDetailsModal(false)}
                  className="flex-1"
                >
                  Close
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => toggleBookmark(selectedJob.id)}
                  className={selectedJob.isBookmarked ? 'text-yellow-500' : 'text-gray-400'}
                >
                  {selectedJob.isBookmarked ? (
                    <BookmarkCheck className="w-4 h-4 fill-current" />
                  ) : (
                    <Bookmark className="w-4 h-4" />
                  )}
                </Button>
                {selectedJob.status === 'open' && (
                  <Button
                    onClick={() => {
                      setShowJobDetailsModal(false);
                      openApplicationModal(selectedJob);
                    }}
                    className="flex-1 bg-fusteps-red hover:bg-red-600 text-white"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Apply Now
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}