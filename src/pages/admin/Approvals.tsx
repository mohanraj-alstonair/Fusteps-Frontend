import { useState, useEffect } from 'react';
import { CheckCircle, X, Eye, Building2, MapPin, Clock, DollarSign, Users, Briefcase, Calendar, X as CloseIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { api, withRole } from '@/lib/api';

interface PendingJob {
  id: number;
  title: string;
  department: string;
  type: string;
  location: string;
  salary: string;
  remote: string;
  description: string;
  requirements: string;
  skills: string[];
  created_at: string;
  company?: string;
  companyLogo?: string;
  applicants?: number;
  experience?: string;
  postedBy?: string;
}

// Dummy data for demonstration
const dummyJobs: PendingJob[] = [
  {
    id: 1,
    title: "Senior Frontend Developer",
    department: "Engineering",
    type: "Full-time",
    location: "San Francisco, CA",
    salary: "$120k - $150k",
    remote: "Hybrid",
    company: "TechCorp Inc.",
    companyLogo: "",
    description: "We are looking for a Senior Frontend Developer to join our dynamic team. You will be responsible for building responsive web applications using modern JavaScript frameworks and ensuring high performance and user experience.",
    requirements: "5+ years of experience with React, TypeScript, and modern web technologies. Strong understanding of UI/UX principles and responsive design.",
    skills: ["React", "TypeScript", "JavaScript", "CSS", "HTML", "Redux", "Next.js"],
    experience: "5+ years",
    applicants: 23,
    postedBy: "Sarah Johnson",
    created_at: "2024-01-15T10:30:00Z"
  },
  {
    id: 2,
    title: "Data Scientist",
    department: "Data & Analytics",
    type: "Full-time",
    location: "New York, NY",
    salary: "$100k - $130k",
    remote: "Remote",
    company: "DataFlow Solutions",
    companyLogo: "",
    description: "Join our data science team to work on cutting-edge machine learning projects. You'll analyze large datasets, build predictive models, and help drive data-driven decision making across the organization.",
    requirements: "PhD or Master's in Data Science, Statistics, or related field. Proficiency in Python, R, SQL, and machine learning frameworks. Experience with big data technologies is a plus.",
    skills: ["Python", "R", "SQL", "Machine Learning", "TensorFlow", "Pandas", "Scikit-learn"],
    experience: "3+ years",
    applicants: 18,
    postedBy: "Michael Chen",
    created_at: "2024-01-14T14:20:00Z"
  },
  {
    id: 3,
    title: "UX/UI Designer",
    department: "Design",
    type: "Contract",
    location: "Austin, TX",
    salary: "$80k - $100k",
    remote: "On-site",
    company: "Creative Studios",
    companyLogo: "",
    description: "We're seeking a talented UX/UI Designer to create intuitive and beautiful user experiences. You'll work closely with product managers and developers to design user-centered solutions for our web and mobile applications.",
    requirements: "3+ years of UX/UI design experience. Proficiency in Figma, Sketch, or Adobe Creative Suite. Strong portfolio demonstrating user-centered design process.",
    skills: ["Figma", "Sketch", "Adobe XD", "Prototyping", "User Research", "Wireframing"],
    experience: "3+ years",
    applicants: 31,
    postedBy: "Emily Rodriguez",
    created_at: "2024-01-13T09:15:00Z"
  },
  {
    id: 4,
    title: "DevOps Engineer",
    department: "Infrastructure",
    type: "Full-time",
    location: "Seattle, WA",
    salary: "$110k - $140k",
    remote: "Hybrid",
    company: "CloudTech Systems",
    companyLogo: "",
    description: "Looking for an experienced DevOps Engineer to help scale our cloud infrastructure and improve our CI/CD pipelines. You'll work with cutting-edge technologies to ensure reliable and efficient deployment processes.",
    requirements: "4+ years of DevOps experience. Strong knowledge of AWS/Azure/GCP, Docker, Kubernetes, and infrastructure as code. Experience with monitoring and logging tools.",
    skills: ["AWS", "Docker", "Kubernetes", "Terraform", "Jenkins", "Python", "Linux"],
    experience: "4+ years",
    applicants: 15,
    postedBy: "David Kim",
    created_at: "2024-01-12T16:45:00Z"
  },
  {
    id: 5,
    title: "Product Manager",
    department: "Product",
    type: "Full-time",
    location: "Boston, MA",
    salary: "$130k - $160k",
    remote: "Hybrid",
    company: "InnovateLabs",
    companyLogo: "",
    description: "We're looking for a strategic Product Manager to drive product vision and roadmap. You'll work cross-functionally with engineering, design, and marketing teams to deliver innovative solutions that delight our users.",
    requirements: "5+ years of product management experience in B2B SaaS. Strong analytical skills, excellent communication, and experience with agile methodologies. Technical background preferred.",
    skills: ["Product Strategy", "Agile", "Analytics", "SQL", "A/B Testing", "User Research"],
    experience: "5+ years",
    applicants: 27,
    postedBy: "Lisa Thompson",
    created_at: "2024-01-11T11:30:00Z"
  }
];

export default function Approvals() {
  const [jobs, setJobs] = useState<PendingJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [selectedJob, setSelectedJob] = useState<PendingJob | null>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);

  useEffect(() => {
    fetchPendingJobs();
  }, []);

  const fetchPendingJobs = async () => {
    try {
      const response = await api.get("/admin/jobs/pending", withRole("admin"));
      console.log('Pending jobs:', response.data);
      const apiJobs = Array.isArray(response.data) ? response.data : [];

      // If no jobs from API, use dummy data for demonstration
      setJobs(apiJobs.length > 0 ? apiJobs : dummyJobs);
    } catch (error) {
      console.error('Error fetching pending jobs:', error);
      // Use dummy data when API fails
      setJobs(dummyJobs);
    } finally {
      setLoading(false);
    }
  };

  const approve = async (id: number) => {
    setActionLoading(id);
    try {
      await api.patch(`/admin/jobs/${id}/status`, { status: 'approved' }, withRole("admin"));
      alert('Job approved successfully! It will now be visible to students.');
      setJobs(jobs.filter(job => job.id !== id));
    } catch (error) {
      console.error('Error approving job:', error);
      alert('Error approving job. Please try again.');
    } finally {
      setActionLoading(null);
    }
  };

  const reject = async (id: number) => {
    setActionLoading(id);
    try {
      await api.patch(`/admin/jobs/${id}/status`, { status: 'rejected', reason: 'Insufficient details' }, withRole("admin"));
      alert('Job rejected successfully.');
      setJobs(jobs.filter(job => job.id !== id));
    } catch (error) {
      console.error('Error rejecting job:', error);
      alert('Error rejecting job. Please try again.');
    } finally {
      setActionLoading(null);
    }
  };

  const viewDetails = (job: PendingJob) => {
    setSelectedJob(job);
    setDetailsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ink-900"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-ink-900">Job Approvals</h1>
          <p className="text-ink-600 mt-1">Review and approve pending job postings before they go live</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-ink-500">
            {jobs.length} pending {jobs.length === 1 ? 'approval' : 'approvals'}
          </div>
        </div>
      </div>

      {jobs.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="p-12 text-center">
            <CheckCircle className="w-16 h-16 text-leaf-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-ink-900 mb-2">All Caught Up!</h3>
            <p className="text-ink-600">No pending job approvals at the moment.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {jobs.map((job) => (
            <Card key={job.id} className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-start space-x-4">
                    <Avatar className="h-12 w-12 border-2 border-slate-200">
                      <AvatarImage src={job.companyLogo} alt={job.company} />
                      <AvatarFallback className="bg-slate-100 text-slate-600">
                        <Building2 className="h-6 w-6" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <CardTitle className="text-xl text-ink-900 mb-1">{job.title}</CardTitle>
                      <div className="flex items-center space-x-4 text-sm text-ink-600 mb-2">
                        <div className="flex items-center">
                          <Building2 className="h-4 w-4 mr-1" />
                          {job.company}
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {job.location}
                        </div>
                        <div className="flex items-center">
                          <Briefcase className="h-4 w-4 mr-1" />
                          {job.type}
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Badge variant="outline" className="bg-sun-50 text-sun-700 border-sun-200">
                          {job.remote}
                        </Badge>
                        <Badge variant="outline" className="bg-leaf-50 text-leaf-700 border-leaf-200">
                          {job.experience}
                        </Badge>
                        <div className="flex items-center text-sm text-ink-500">
                          <Users className="h-4 w-4 mr-1" />
                          {job.applicants} applicants
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold text-ink-900 mb-1">{job.salary}</div>
                    <div className="text-sm text-ink-500">per year</div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium text-ink-900 mb-2">Job Description</h4>
                  <p className="text-ink-700 leading-relaxed">{job.description}</p>
                </div>

                <div>
                  <h4 className="font-medium text-ink-900 mb-2">Requirements</h4>
                  <p className="text-ink-600 text-sm leading-relaxed">{job.requirements}</p>
                </div>

                {job.skills && job.skills.length > 0 && (
                  <div>
                    <h4 className="font-medium text-ink-900 mb-2">Required Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {job.skills.map((skill, index) => (
                        <Badge key={index} variant="secondary" className="bg-slate-100 text-slate-700 hover:bg-slate-200">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <Separator />

                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-4 text-sm text-ink-500">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      Submitted {new Date(job.created_at).toLocaleDateString()}
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      Posted by {job.postedBy}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => viewDetails(job)}
                      className="border-slate-300 hover:bg-slate-50"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => reject(job.id)}
                      disabled={actionLoading === job.id}
                      className="border-ember-300 text-ember-700 hover:bg-ember-50 hover:border-ember-400"
                    >
                      {actionLoading === job.id ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-ember-700 mr-2"></div>
                      ) : (
                        <X className="w-4 h-4 mr-2" />
                      )}
                      Reject
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => approve(job.id)}
                      disabled={actionLoading === job.id}
                      className="bg-green-600 hover:bg-green-700 text-white font-semibold shadow-sm"
                    >
                      {actionLoading === job.id ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      ) : (
                        <CheckCircle className="w-4 h-4 mr-2" />
                      )}
                      Accept
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Job Details Modal */}
      <Dialog open={detailsModalOpen} onOpenChange={setDetailsModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Job Details Review</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setDetailsModalOpen(false)}
                className="h-8 w-8 p-0"
              >
                <CloseIcon className="h-4 w-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>

          {selectedJob && (
            <div className="space-y-6">
              {/* Job Header */}
              <div className="flex items-start space-x-4">
                <Avatar className="h-16 w-16 border-2 border-slate-200">
                  <AvatarImage src={selectedJob.companyLogo} alt={selectedJob.company} />
                  <AvatarFallback className="bg-slate-100 text-slate-600">
                    <Building2 className="h-8 w-8" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-ink-900 mb-2">{selectedJob.title}</h2>
                  <div className="flex items-center space-x-4 text-sm text-ink-600 mb-3">
                    <div className="flex items-center">
                      <Building2 className="h-4 w-4 mr-1" />
                      {selectedJob.company}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {selectedJob.location}
                    </div>
                    <div className="flex items-center">
                      <Briefcase className="h-4 w-4 mr-1" />
                      {selectedJob.type}
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 mb-4">
                    <Badge variant="outline" className="bg-sun-50 text-sun-700 border-sun-200">
                      {selectedJob.remote}
                    </Badge>
                    <Badge variant="outline" className="bg-leaf-50 text-leaf-700 border-leaf-200">
                      {selectedJob.experience}
                    </Badge>
                    <div className="flex items-center text-sm text-ink-500">
                      <Users className="h-4 w-4 mr-1" />
                      {selectedJob.applicants} applicants
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-ink-900">{selectedJob.salary}</div>
                    <div className="text-sm text-ink-500">per year</div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Job Description */}
              <div>
                <h3 className="text-lg font-semibold text-ink-900 mb-3">Job Description</h3>
                <p className="text-ink-700 leading-relaxed">{selectedJob.description}</p>
              </div>

              {/* Requirements */}
              <div>
                <h3 className="text-lg font-semibold text-ink-900 mb-3">Requirements</h3>
                <p className="text-ink-600 leading-relaxed">{selectedJob.requirements}</p>
              </div>

              {/* Skills */}
              {selectedJob.skills && selectedJob.skills.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-ink-900 mb-3">Required Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedJob.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary" className="bg-slate-100 text-slate-700 hover:bg-slate-200 px-3 py-1">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <Separator />

              {/* Job Metadata */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-ink-900">Department:</span>
                  <span className="ml-2 text-ink-600">{selectedJob.department}</span>
                </div>
                <div>
                  <span className="font-medium text-ink-900">Posted By:</span>
                  <span className="ml-2 text-ink-600">{selectedJob.postedBy}</span>
                </div>
                <div>
                  <span className="font-medium text-ink-900">Submitted:</span>
                  <span className="ml-2 text-ink-600">{new Date(selectedJob.created_at).toLocaleDateString()}</span>
                </div>
                <div>
                  <span className="font-medium text-ink-900">Job ID:</span>
                  <span className="ml-2 text-ink-600">#{selectedJob.id}</span>
                </div>
              </div>

              <Separator />

              {/* Action Buttons */}
              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => setDetailsModalOpen(false)}
                  className="border-slate-300 hover:bg-slate-50"
                >
                  Close
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    reject(selectedJob.id);
                    setDetailsModalOpen(false);
                  }}
                  disabled={actionLoading === selectedJob.id}
                  className="border-ember-300 text-ember-700 hover:bg-ember-50 hover:border-ember-400"
                >
                  {actionLoading === selectedJob.id ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-ember-700 mr-2"></div>
                  ) : null}
                  Reject Job
                </Button>
                <Button
                  onClick={() => {
                    approve(selectedJob.id);
                    setDetailsModalOpen(false);
                  }}
                  disabled={actionLoading === selectedJob.id}
                  className="bg-leaf-600 hover:bg-leaf-700 text-white"
                >
                  {actionLoading === selectedJob.id ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  ) : (
                    <CheckCircle className="w-4 h-4 mr-2" />
                  )}
                  Accept Job
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
