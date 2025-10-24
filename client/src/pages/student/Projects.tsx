import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Upload, Github, ExternalLink, Code, Star, MessageCircle, Clock, CheckCircle, Grid3X3, List, Bell, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

export default function StudentProjectsPage() {
  const { toast } = useToast();
  const [viewMode, setViewMode] = useState("list");
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [feedbackText, setFeedbackText] = useState("");
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    technologies: "",
    githubUrl: "",
    liveUrl: ""
  });
  const [notificationSettings, setNotificationSettings] = useState({
    feedbackReceived: true,
    projectApproved: true,
    deadlineReminders: true,
    mentorMessages: true
  });

  const openFeedbackModal = (project: any) => {
    setSelectedProject(project);
    setShowFeedbackModal(true);
  };

  const openEditModal = (project: any) => {
    setSelectedProject(project);
    setEditForm({
      title: project.title,
      description: project.description,
      technologies: project.technologies.join(', '),
      githubUrl: project.githubUrl,
      liveUrl: project.liveUrl || ''
    });
    setShowEditModal(true);
  };

  const openNotificationsModal = (project: any) => {
    setSelectedProject(project);
    setShowNotificationsModal(true);
  };

  const submitFeedback = () => {
    if (feedbackText.trim()) {
      toast({
        title: "Feedback Submitted",
        description: "Your feedback has been sent to the mentor!"
      });
      setShowFeedbackModal(false);
      setFeedbackText("");
    }
  };

  const saveProjectChanges = () => {
    toast({
      title: "Project Updated",
      description: "Your project has been successfully updated!"
    });
    setShowEditModal(false);
  };

  const saveNotificationSettings = () => {
    toast({
      title: "Settings Saved",
      description: "Your notification preferences have been updated!"
    });
    setShowNotificationsModal(false);
  };

  const myProjects = [
    {
      id: 1,
      title: "E-commerce Website",
      description: "Full-stack web application with React frontend and Node.js backend",
      status: "Under Review",
      statusColor: "yellow",
      uploadDate: "Feb 10, 2024",
      technologies: ["React", "Node.js", "MongoDB"],
      githubUrl: "https://github.com/student/ecommerce-app",
      liveUrl: "https://myecommerce-demo.netlify.app",
      mentorFeedback: "Great project structure! Consider adding more test cases.",
      rating: 4.2,
      category: "Web Development"
    },
    {
      id: 2,
      title: "Mobile Weather App",
      description: "React Native app with real-time weather data and location services",
      status: "Approved",
      statusColor: "green",
      uploadDate: "Jan 25, 2024",
      technologies: ["React Native", "API Integration", "Firebase"],
      githubUrl: "https://github.com/student/weather-app",
      liveUrl: null,
      mentorFeedback: "Excellent UI/UX design and clean code implementation!",
      rating: 4.8,
      category: "Mobile Development"
    }
  ];

  const projectIdeas = [
    {
      title: "Personal Finance Tracker",
      description: "Build a web app to track expenses and manage budgets",
      difficulty: "Intermediate",
      estimatedTime: "3-4 weeks",
      skills: ["React", "Chart.js", "Local Storage"],
      category: "Web Development"
    },
    {
      title: "Task Management API",
      description: "RESTful API for task management with user authentication",
      difficulty: "Advanced",
      estimatedTime: "4-5 weeks",
      skills: ["Node.js", "Express", "JWT", "Database"],
      category: "Backend Development"
    },
    {
      title: "Machine Learning Classifier",
      description: "Build and deploy a classification model for image recognition",
      difficulty: "Advanced",
      estimatedTime: "5-6 weeks",
      skills: ["Python", "TensorFlow", "Data Processing"],
      category: "AI/ML"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Projects</h1>
          <p className="text-gray-600 mt-1">Showcase your skills and get feedback from mentors</p>
        </div>
        <Button className="bg-fusteps-red hover:bg-red-600" onClick={() => toast({ title: 'Upload Project', description: 'Redirecting to upload form...' })}>
          <Upload className="w-4 h-4 mr-2" />
          Upload New Project
        </Button>
      </div>

      <Tabs defaultValue="my-projects" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="my-projects">My Projects ({myProjects.length})</TabsTrigger>
          <TabsTrigger value="upload">Upload Project</TabsTrigger>
          <TabsTrigger value="ideas">Project Ideas</TabsTrigger>
        </TabsList>

        <TabsContent value="my-projects" className="space-y-6">
          <div className="grid gap-6">
            {myProjects.map((project) => (
              <Card key={project.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <CardTitle className="text-xl">{project.title}</CardTitle>
                        <Badge 
                          variant="secondary" 
                          className={`${
                            project.statusColor === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
                            project.statusColor === 'green' ? 'bg-green-100 text-green-800' :
                            'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {project.status}
                        </Badge>
                        <Badge variant="outline">{project.category}</Badge>
                      </div>
                      <CardDescription className="mb-4">
                        {project.description}
                      </CardDescription>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          Uploaded {project.uploadDate}
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500" />
                          {project.rating}/5.0
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech: string) => (
                      <Badge key={tech} variant="secondary" className="bg-blue-50 text-blue-700">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                  
                  {project.mentorFeedback && (
                    <div className="bg-green-50 p-4 rounded-lg">
                      <p className="text-sm font-medium text-green-800 mb-1">Mentor Feedback:</p>
                      <p className="text-sm text-green-700">{project.mentorFeedback}</p>
                    </div>
                  )}

          <div className="flex gap-2 flex-wrap">
            <Button variant="outline" onClick={() => window.open(project.githubUrl, '_blank')}>
              <Github className="w-4 h-4 mr-2" />
              View Code
            </Button>
            {project.liveUrl && (
              <Button variant="outline" onClick={() => window.open(project.liveUrl, '_blank')}>
                <ExternalLink className="w-4 h-4 mr-2" />
                Live Demo
              </Button>
            )}
            <Button variant="outline" onClick={() => openFeedbackModal(project)}>
              <MessageCircle className="w-4 h-4 mr-2" />
              Feedback
            </Button>
            <Button variant="outline" onClick={() => openEditModal(project)}>Edit Project</Button>
            <Button variant="outline" onClick={() => openNotificationsModal(project)}>
              <Bell className="w-4 h-4 mr-2" />
              Manage Notifications
            </Button>
          </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="upload" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Upload New Project
              </CardTitle>
              <CardDescription>
                Share your project with mentors and get valuable feedback
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Project Title *</label>
                  <Input placeholder="Enter your project title" />
                </div>
                
                <div>
                  <label className="text-sm font-medium">Description *</label>
                  <Textarea 
                    placeholder="Describe what your project does and what problems it solves"
                    rows={4}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Category *</label>
                    <select className="w-full p-2 border border-gray-300 rounded-md">
                      <option>Web Development</option>
                      <option>Mobile Development</option>
                      <option>Backend Development</option>
                      <option>AI/ML</option>
                      <option>Data Science</option>
                      <option>Game Development</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Technologies Used</label>
                    <Input placeholder="React, Node.js, MongoDB..." />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">GitHub Repository *</label>
                    <Input placeholder="https://github.com/username/repo" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Live Demo URL</label>
                    <Input placeholder="https://your-project.netlify.app" />
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Additional Notes</label>
                  <Textarea 
                    placeholder="Any additional information about your project, challenges faced, or areas where you'd like specific feedback"
                    rows={3}
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button className="bg-fusteps-red hover:bg-red-600" onClick={() => toast({ title: 'Project Uploaded', description: 'Your project has been submitted for review!' })}>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Project
                </Button>
                <Button variant="outline" onClick={() => toast({ title: 'Draft Saved', description: 'Your project has been saved as draft' })}>Save as Draft</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ideas" className="space-y-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Project Ideas</h2>
            <div className="flex gap-2">
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="w-4 h-4 mr-2" />
                List
              </Button>
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <Grid3X3 className="w-4 h-4 mr-2" />
                Grid
              </Button>
            </div>
          </div>
          
          <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" : "grid gap-6"}>
            {projectIdeas.map((idea, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <CardTitle className="text-xl">{idea.title}</CardTitle>
                        <Badge variant="outline">{idea.category}</Badge>
                        <Badge 
                          variant="secondary"
                          className={`${
                            idea.difficulty === 'Beginner' ? 'bg-green-100 text-green-800' :
                            idea.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}
                        >
                          {idea.difficulty}
                        </Badge>
                      </div>
                      <CardDescription className="mb-4">
                        {idea.description}
                      </CardDescription>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {idea.estimatedTime}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-medium mb-2">Skills you'll learn:</p>
                    <div className="flex flex-wrap gap-2">
                      {idea.skills.map((skill) => (
                        <Badge key={skill} variant="secondary" className="bg-blue-50 text-blue-700">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button className="bg-fusteps-red hover:bg-red-600" onClick={() => toast({ title: 'Project Started', description: `Starting ${idea.title} project...` })}>
                      <Code className="w-4 h-4 mr-2" />
                      Start Building
                    </Button>
                    <Button variant="outline" onClick={() => toast({ title: 'Project Guide', description: `Opening detailed guide for ${idea.title}` })}>Get Detailed Guide</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Feedback Modal */}
      <Dialog open={showFeedbackModal} onOpenChange={setShowFeedbackModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Request Feedback for {selectedProject?.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">What specific areas would you like feedback on?</label>
              <Textarea
                rows={4}
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder="e.g., code quality, UI/UX design, performance, security, etc."
                className="mt-2"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowFeedbackModal(false)}>
                Cancel
              </Button>
              <Button
                className="bg-fusteps-red hover:bg-red-600 text-white"
                onClick={submitFeedback}
                disabled={!feedbackText.trim()}
              >
                Submit Request
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Project Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Project: {selectedProject?.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Project Title</label>
              <Input
                value={editForm.title}
                onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                className="mt-2"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Description</label>
              <Textarea
                rows={3}
                value={editForm.description}
                onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                className="mt-2"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Technologies Used</label>
              <Input
                value={editForm.technologies}
                onChange={(e) => setEditForm(prev => ({ ...prev, technologies: e.target.value }))}
                placeholder="React, Node.js, MongoDB..."
                className="mt-2"
              />
            </div>
            <div>
              <label className="text-sm font-medium">GitHub Repository</label>
              <Input
                value={editForm.githubUrl}
                onChange={(e) => setEditForm(prev => ({ ...prev, githubUrl: e.target.value }))}
                className="mt-2"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Live Demo URL</label>
              <Input
                value={editForm.liveUrl}
                onChange={(e) => setEditForm(prev => ({ ...prev, liveUrl: e.target.value }))}
                placeholder="Optional"
                className="mt-2"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowEditModal(false)}>
                Cancel
              </Button>
              <Button
                className="bg-fusteps-red hover:bg-red-600 text-white"
                onClick={saveProjectChanges}
              >
                Save Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Notifications Modal */}
      <Dialog open={showNotificationsModal} onOpenChange={setShowNotificationsModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Notification Settings
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">Configure notifications for {selectedProject?.title}</p>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm">Feedback Received</label>
                <input
                  type="checkbox"
                  checked={notificationSettings.feedbackReceived}
                  onChange={(e) => setNotificationSettings(prev => ({ ...prev, feedbackReceived: e.target.checked }))}
                  className="rounded"
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm">Project Approved</label>
                <input
                  type="checkbox"
                  checked={notificationSettings.projectApproved}
                  onChange={(e) => setNotificationSettings(prev => ({ ...prev, projectApproved: e.target.checked }))}
                  className="rounded"
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm">Deadline Reminders</label>
                <input
                  type="checkbox"
                  checked={notificationSettings.deadlineReminders}
                  onChange={(e) => setNotificationSettings(prev => ({ ...prev, deadlineReminders: e.target.checked }))}
                  className="rounded"
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm">Mentor Messages</label>
                <input
                  type="checkbox"
                  checked={notificationSettings.mentorMessages}
                  onChange={(e) => setNotificationSettings(prev => ({ ...prev, mentorMessages: e.target.checked }))}
                  className="rounded"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowNotificationsModal(false)}>
                Cancel
              </Button>
              <Button
                className="bg-fusteps-red hover:bg-red-600 text-white"
                onClick={saveNotificationSettings}
              >
                Save Settings
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
