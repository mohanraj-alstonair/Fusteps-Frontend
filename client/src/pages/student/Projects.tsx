import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { 
  Upload, 
  Github, 
  ExternalLink, 
  Eye, 
  Edit3, 
  Clock, 
  Grid3X3, 
  List, 
  Bell, 
  Plus,
  Star,
  MessageCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { submitProjectIdea, getProjectIdeas, ProjectIdeaPayload, updateProjectIdea, deleteProjectIdea } from "@/lib/api";

export default function StudentProjectsPage() {
  const { toast } = useToast();
  const [viewMode, setViewMode] = useState("list");
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);
  const [showNewIdeaModal, setShowNewIdeaModal] = useState(false);
  const [showViewDetailsModal, setShowViewDetailsModal] = useState(false);
  const [showEditIdeaModal, setShowEditIdeaModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [selectedIdea, setSelectedIdea] = useState<any>(null);
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

  // New idea form state
  const [newIdeaForm, setNewIdeaForm] = useState({
    title: "",
    description: "",
    estimatedTime: "",
    skills: "",
    difficulty: "Intermediate",
    category: "Web Development",
    customCategory: ""
  });

  // Edit idea form state
  const [editIdeaForm, setEditIdeaForm] = useState({
    title: "",
    description: "",
    estimatedTime: "",
    skills: "",
    difficulty: "Intermediate",
    category: "Web Development",
    customCategory: ""
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

  const openViewDetails = (idea: any) => {
    setSelectedIdea(idea);
    setShowViewDetailsModal(true);
  };

  const openEditIdea = (idea: any) => {
    setSelectedIdea(idea);
    setEditIdeaForm({
      title: idea.title,
      description: idea.description,
      estimatedTime: idea.estimated_time || '',
      skills: idea.skills_involved || '',
      difficulty: idea.difficulty_level || 'Intermediate',
      category: idea.category || 'Web Development',
      customCategory: idea.category !== "Other" ? "" : idea.customCategory || ""
    });
    setShowEditIdeaModal(true);
  };

  const submitFeedback = () => {
    if (feedbackText.trim()) {
      toast({
        title: "Feedback Requested",
        description: "Your feedback request has been sent to the mentor!"
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

  const submitNewIdea = async () => {
    if (newIdeaForm.title.trim() && newIdeaForm.description.trim()) {
      const finalCategory = newIdeaForm.category === "Other" 
        ? newIdeaForm.customCategory.trim() || "Uncategorized"
        : newIdeaForm.category;

      try {
        const userId = localStorage.getItem('userId') || localStorage.getItem('studentId') || '4';
        const userIdNum = parseInt(userId);

        const payload: ProjectIdeaPayload = {
          user_id: userIdNum,
          project_title: newIdeaForm.title,
          description: newIdeaForm.description,
          estimated_time: newIdeaForm.estimatedTime,
          difficulty_level: newIdeaForm.difficulty,
          skills_involved: newIdeaForm.skills,
          category: finalCategory
        };
        
        console.log('Submitting payload:', payload);

        const response = await submitProjectIdea(payload);
        console.log('API Response:', response);
        
        toast({
          title: "Idea Submitted!",
          description: `Your idea "${newIdeaForm.title}" has been submitted under "${finalCategory}".`
        });
        
        setShowNewIdeaModal(false);
        setNewIdeaForm({
          title: "", description: "", estimatedTime: "", skills: "",
          difficulty: "Intermediate", category: "Web Development", customCategory: ""
        });
        
        // Refresh project ideas
        loadProjectIdeas();
      } catch (error: any) {
        console.error('Error submitting project idea:', error);
        
        let errorMessage = "Failed to submit project idea. Please try again.";
        
        if (error.response) {
          console.error('Server error:', error.response.status, error.response.data);
          const serverError = error.response.data?.error || error.response.data?.message || 'Unknown error';
          errorMessage = `Server error (${error.response.status}): ${serverError}`;
        } else if (error.request) {
          console.error('Network error:', error.request);
          errorMessage = "Network error: Could not connect to server. Make sure the backend is running on port 8000.";
        } else {
          console.error('Error:', error.message);
          errorMessage = `Error: ${error.message}`;
        }
        
        console.error('Full error object:', error);
        
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive"
        });
      }
    }
  };

  const handleDeleteIdea = async (idea: any) => {
    if (!confirm(`Are you sure you want to delete "${idea.title}"?`)) {
      return;
    }

    try {
      const userId = localStorage.getItem('userId') || localStorage.getItem('studentId') || '4';
      const userIdNum = parseInt(userId);
      await deleteProjectIdea(idea.id, userIdNum);
      
      toast({
        title: "Idea Deleted!",
        description: `Your idea "${idea.title}" has been deleted.`
      });
      
      loadProjectIdeas();
      
    } catch (error: any) {
      console.error('Error deleting project idea:', error);
      
      let errorMessage = "Failed to delete project idea. Please try again.";
      
      if (error.response) {
        const serverError = error.response.data?.error || error.response.data?.message || 'Unknown error';
        errorMessage = `Server error (${error.response.status}): ${serverError}`;
      } else if (error.request) {
        errorMessage = "Network error: Could not connect to server.";
      } else {
        errorMessage = `Error: ${error.message}`;
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    }
  };

  const saveIdeaChanges = async () => {
    const finalCategory = editIdeaForm.category === "Other" 
      ? editIdeaForm.customCategory.trim() || "Uncategorized"
      : editIdeaForm.category;

    try {
      const userId = localStorage.getItem('userId') || localStorage.getItem('studentId') || '4';
      const userIdNum = parseInt(userId);

      const updatePayload = {
        user_id: userIdNum,
        title: editIdeaForm.title,
        description: editIdeaForm.description,
        estimated_time: editIdeaForm.estimatedTime,
        difficulty_level: editIdeaForm.difficulty,
        skills_involved: editIdeaForm.skills,
        category: finalCategory
      };

      const response = await updateProjectIdea(selectedIdea.id, updatePayload);
      
      toast({
        title: "Idea Updated!",
        description: `Your idea "${editIdeaForm.title}" has been updated under "${finalCategory}".`
      });
      
      setShowEditIdeaModal(false);
      loadProjectIdeas();
      
    } catch (error: any) {
      console.error('Error updating project idea:', error);
      
      let errorMessage = "Failed to update project idea. Please try again.";
      
      if (error.response) {
        const serverError = error.response.data?.error || error.response.data?.message || 'Unknown error';
        errorMessage = `Server error (${error.response.status}): ${serverError}`;
      } else if (error.request) {
        errorMessage = "Network error: Could not connect to server.";
      } else {
        errorMessage = `Error: ${error.message}`;
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    }
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

  const [projectIdeas, setProjectIdeas] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadProjectIdeas = async () => {
    try {
      setIsLoading(true);
      const userId = localStorage.getItem('userId') || localStorage.getItem('studentId') || '4';
      const userIdNum = parseInt(userId);
      
      console.log('Loading project ideas for user ID:', userIdNum);
      const response = await getProjectIdeas(userIdNum);
      console.log('Project ideas response:', response);
      
      const freshData = Array.isArray(response.data) ? response.data : [];
      setProjectIdeas(freshData);
      
      console.log('Set project ideas count:', freshData.length);
    } catch (error) {
      console.error('Error loading project ideas:', error);
      setProjectIdeas([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProjectIdeas();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Projects</h1>
          <p className="text-gray-600 mt-1">Showcase your skills and get feedback from mentors</p>
        </div>
      </div>

      <Tabs defaultValue="my-projects" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="my-projects">My Projects ({myProjects.length})</TabsTrigger>
          <TabsTrigger value="upload">Upload Project</TabsTrigger>
          <TabsTrigger value="ideas">Project Ideas</TabsTrigger>
        </TabsList>

        {/* === My Projects Tab === */}
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
                      Request Feedback
                    </Button>
                    <Button variant="outline" onClick={() => openEditModal(project)}>
                      Edit Project
                    </Button>
                    <Button variant="outline" onClick={() => openNotificationsModal(project)}>
                      <Bell className="w-4 h-4 mr-2" />
                      Notifications
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* === Upload Project Tab === */}
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
                      <option>Other</option>
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
                <Button 
                  className="bg-fusteps-red hover:bg-red-600" 
                  onClick={() => toast({ 
                    title: 'Project Uploaded', 
                    description: 'Your project has been submitted for review!' 
                  })}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Project
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => toast({ 
                    title: 'Draft Saved', 
                    description: 'Your project has been saved as draft' 
                  })}
                >
                  Save as Draft
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* === Project Ideas Tab === */}
        <TabsContent value="ideas" className="space-y-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Project Ideas</h2>
            <Button
              className="bg-fusteps-red hover:bg-red-600"
              size="sm"
              onClick={() => setShowNewIdeaModal(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              New Idea
            </Button>
          </div>

          <div className="flex gap-2 mb-4">
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
          
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <div className="text-gray-500">Loading project ideas...</div>
            </div>
          ) : projectIdeas.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No project ideas submitted yet.</p>
              <Button
                className="bg-fusteps-red hover:bg-red-600"
                onClick={() => setShowNewIdeaModal(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Submit Your First Idea
              </Button>
            </div>
          ) : (
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
                              idea.difficulty_level === 'Beginner' ? 'bg-green-100 text-green-800' :
                              idea.difficulty_level === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}
                          >
                            {idea.difficulty_level}
                          </Badge>
                        </div>
                        <CardDescription className="mb-4">
                          {idea.description}
                        </CardDescription>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {idea.estimated_time}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm font-medium mb-2">Skills you'll learn:</p>
                      <div className="flex flex-wrap gap-2">
                        {(idea.skills_involved ? idea.skills_involved.split(',') : []).map((skill: string, idx: number) => (
                          <Badge key={idx} variant="secondary" className="bg-blue-50 text-blue-700">
                            {skill.trim()}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button 
                        className="bg-fusteps-red hover:bg-red-600" 
                        onClick={() => openViewDetails(idea)}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => openEditIdea(idea)}
                      >
                        <Edit3 className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => handleDeleteIdea(idea)}
                        className="text-red-600 hover:text-red-700"
                      >
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* === New Idea Modal === */}
      <Dialog open={showNewIdeaModal} onOpenChange={setShowNewIdeaModal}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Submit New Project Idea
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium">Project Title *</label>
              <Input
                placeholder="e.g., Personal Finance Tracker"
                value={newIdeaForm.title}
                onChange={(e) => setNewIdeaForm(prev => ({ ...prev, title: e.target.value }))}
                className="mt-1"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Description *</label>
              <Textarea
                placeholder="Describe the project idea and its purpose"
                rows={3}
                value={newIdeaForm.description}
                onChange={(e) => setNewIdeaForm(prev => ({ ...prev, description: e.target.value }))}
                className="mt-1"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium">Estimated Time</label>
                <Input
                  placeholder="e.g., 3-4 weeks"
                  value={newIdeaForm.estimatedTime}
                  onChange={(e) => setNewIdeaForm(prev => ({ ...prev, estimatedTime: e.target.value }))}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Difficulty Level</label>
                <select
                  className="w-full p-2 border border-gray-300 rounded-md mt-1 text-sm"
                  value={newIdeaForm.difficulty}
                  onChange={(e) => setNewIdeaForm(prev => ({ ...prev, difficulty: e.target.value }))}
                >
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Advanced</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Skills Involved</label>
              <Input
                placeholder="React, Node.js, MongoDB..."
                value={newIdeaForm.skills}
                onChange={(e) => setNewIdeaForm(prev => ({ ...prev, skills: e.target.value }))}
                className="mt-1"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Category</label>
              <select
                className="w-full p-2 border border-gray-300 rounded-md mt-1 text-sm"
                value={newIdeaForm.category}
                onChange={(e) => setNewIdeaForm(prev => ({ 
                  ...prev, 
                  category: e.target.value,
                  customCategory: e.target.value !== "Other" ? "" : prev.customCategory
                }))}
              >
                <option>Web Development</option>
                <option>Mobile Development</option>
                <option>Backend Development</option>
                <option>AI/ML</option>
                <option>Data Science</option>
                <option>Game Development</option>
                <option>Other</option>
              </select>
            </div>

            {newIdeaForm.category === "Other" && (
              <div>
                <label className="text-sm font-medium">Custom Category *</label>
                <Input
                  placeholder="e.g., Blockchain, IoT, AR/VR..."
                  value={newIdeaForm.customCategory}
                  onChange={(e) => setNewIdeaForm(prev => ({ ...prev, customCategory: e.target.value }))}
                  className="mt-1"
                />
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewIdeaModal(false)}>
              Cancel
            </Button>
            <Button
              className="bg-fusteps-red hover:bg-red-600"
              onClick={submitNewIdea}
              disabled={
                !newIdeaForm.title.trim() || 
                !newIdeaForm.description.trim() ||
                (newIdeaForm.category === "Other" && !newIdeaForm.customCategory.trim())
              }
            >
              Submit Idea
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* === View Details Modal === */}
      <Dialog open={showViewDetailsModal} onOpenChange={setShowViewDetailsModal}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{selectedIdea?.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <p className="text-sm font-medium text-gray-600">Description</p>
              <p className="text-sm">{selectedIdea?.description}</p>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="font-medium text-gray-600">Estimated Time</p>
                <p>{selectedIdea?.estimated_time}</p>
              </div>
              <div>
                <p className="font-medium text-gray-600">Difficulty</p>
                <p>{selectedIdea?.difficulty_level}</p>
              </div>
            </div>
            <div>
              <p className="font-medium text-gray-600">Skills</p>
              <p>{selectedIdea?.skills_involved || 'No skills specified'}</p>
            </div>
            <div>
              <p className="font-medium text-gray-600">Category</p>
              <p>{selectedIdea?.category}</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowViewDetailsModal(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* === Edit Idea Modal === */}
      <Dialog open={showEditIdeaModal} onOpenChange={setShowEditIdeaModal}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Project Idea</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium">Project Title *</label>
              <Input
                value={editIdeaForm.title}
                onChange={(e) => setEditIdeaForm(prev => ({ ...prev, title: e.target.value }))}
                className="mt-1"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Description *</label>
              <Textarea
                rows={3}
                value={editIdeaForm.description}
                onChange={(e) => setEditIdeaForm(prev => ({ ...prev, description: e.target.value }))}
                className="mt-1"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium">Estimated Time</label>
                <Input
                  value={editIdeaForm.estimatedTime}
                  onChange={(e) => setEditIdeaForm(prev => ({ ...prev, estimatedTime: e.target.value }))}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Difficulty Level</label>
                <select
                  className="w-full p-2 border border-gray-300 rounded-md mt-1 text-sm"
                  value={editIdeaForm.difficulty}
                  onChange={(e) => setEditIdeaForm(prev => ({ ...prev, difficulty: e.target.value }))}
                >
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Advanced</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Skills Involved</label>
              <Input
                value={editIdeaForm.skills}
                onChange={(e) => setEditIdeaForm(prev => ({ ...prev, skills: e.target.value }))}
                className="mt-1"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Category</label>
              <select
                className="w-full p-2 border border-gray-300 rounded-md mt-1 text-sm"
                value={editIdeaForm.category}
                onChange={(e) => setEditIdeaForm(prev => ({ 
                  ...prev, 
                  category: e.target.value,
                  customCategory: e.target.value !== "Other" ? "" : prev.customCategory
                }))}
              >
                <option>Web Development</option>
                <option>Mobile Development</option>
                <option>Backend Development</option>
                <option>AI/ML</option>
                <option>Data Science</option>
                <option>Game Development</option>
                <option>Other</option>
              </select>
            </div>

            {editIdeaForm.category === "Other" && (
              <div>
                <label className="text-sm font-medium">Custom Category *</label>
                <Input
                  value={editIdeaForm.customCategory}
                  onChange={(e) => setEditIdeaForm(prev => ({ ...prev, customCategory: e.target.value }))}
                  className="mt-1"
                />
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditIdeaModal(false)}>
              Cancel
            </Button>
            <Button
              className="bg-fusteps-red hover:bg-red-600"
              onClick={saveIdeaChanges}
              disabled={
                !editIdeaForm.title.trim() || 
                !editIdeaForm.description.trim() ||
                (editIdeaForm.category === "Other" && !editIdeaForm.customCategory.trim())
              }
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* === Feedback Modal === */}
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

      {/* === Edit Project Modal === */}
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

      {/* === Notifications Modal === */}
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