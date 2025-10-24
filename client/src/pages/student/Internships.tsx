import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  Filter,
  MapPin,
  Clock,
  BookOpen,
  Star,
  Building,
  Bookmark,
  Eye,
  Share2,
  Download,
  X,
  CheckCircle,
  Grid3X3,
  List,
  User,
  Mail,
  Phone,
  FileText,
  Upload
} from "lucide-react";
import { useState, useEffect } from "react";

export default function Internships() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedDuration, setSelectedDuration] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [showInternshipDetails, setShowInternshipDetails] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [selectedInternship, setSelectedInternship] = useState<any>(null);
  const [savedInternships, setSavedInternships] = useState<number[]>([]);
  const [appliedInternships, setAppliedInternships] = useState<number[]>([]);
  const [activeTab, setActiveTab] = useState("all");
  const [viewMode, setViewMode] = useState("list");
  const [internships, setInternships] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [applicationData, setApplicationData] = useState({
    fullName: "",
    email: "",
    phone: "",
    resume: null as File | null,
    motivation: ""
  });

  const mockInternships = [
    { id: 1, title: 'Frontend Developer Intern', company: 'TechCorp Inc.', location: 'Mountain View, CA', type: 'Summer 2024', duration: '12 weeks', compensation: '$8,000/month', logo: '/api/placeholder/60/60', skills: ['React', 'JavaScript', 'CSS', 'HTML'], description: 'Join our team to build amazing user interfaces and learn modern frontend development practices.', posted: '2 days ago', applications: 45, featured: true, requirements: ['Basic JavaScript knowledge', 'HTML/CSS skills'], remote: false },
    { id: 2, title: 'Backend Engineer Intern', company: 'DataFlow Systems', location: 'San Francisco, CA', type: 'Summer 2024', duration: '16 weeks', compensation: '$9,000/month', logo: '/api/placeholder/60/60', skills: ['Python', 'Django', 'PostgreSQL', 'REST APIs'], description: 'Work on scalable backend systems and learn cloud architecture with our engineering team.', posted: '1 week ago', applications: 32, featured: false, requirements: ['Python programming', 'Database knowledge'], remote: true },
    { id: 3, title: 'Data Science Intern', company: 'Analytics Pro', location: 'Seattle, WA', type: 'Fall 2024', duration: '12 weeks', compensation: '$7,500/month', logo: '/api/placeholder/60/60', skills: ['Python', 'Machine Learning', 'Pandas', 'Scikit-learn'], description: 'Analyze large datasets and build predictive models for business insights.', posted: '3 days ago', applications: 28, featured: true, requirements: ['Statistics knowledge', 'Python programming'], remote: false },
  ];

  useEffect(() => {
    setInternships(mockInternships);
    setLoading(false);
  }, []);

  const filteredInternships = internships.filter(internship => {
    const matchesSearch = !searchQuery || internship.title.toLowerCase().includes(searchQuery.toLowerCase()) || internship.company.toLowerCase().includes(searchQuery.toLowerCase()) || internship.skills.some((skill: string) => skill.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesLocation = !savedInternships || internship.location.includes(selectedLocation);
    const matchesType = !selectedType || internship.type === selectedType;
    const matchesDuration = !selectedDuration || internship.duration === selectedDuration;
    return matchesSearch && matchesLocation && matchesType && matchesDuration;
  });

  const getTabInternships = () => {
    switch (activeTab) {
      case "summer": return filteredInternships.filter(i => i.type === "Summer 2024");
      case "fall": return filteredInternships.filter(i => i.type === "Fall 2024");
      case "saved": return filteredInternships.filter(i => savedInternships.includes(i.id));
      default: return filteredInternships;
    }
  };

  const renderInternshipCard = (internship: any, isSaved = false) => {
    if (viewMode === "grid") {
      return (
        <Card key={internship.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-2">
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 bg-gray-100 rounded flex items-center justify-center flex-shrink-0"><Building className="w-3 h-3 text-gray-400" /></div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xs font-semibold text-gray-900 leading-tight break-words">{internship.title}</h3>
                  <p className="text-xs text-gray-600 truncate">{internship.company}</p>
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-1 text-xs text-gray-500"><MapPin className="w-2 h-2 flex-shrink-0" /><span className="truncate text-xs">{internship.location}</span></div>
                <p className="text-xs font-medium text-green-600 truncate">{internship.compensation}</p>
              </div>
              <div className="flex flex-wrap gap-1">
                <Badge variant="secondary" className="text-xs px-1 py-0">{internship.type}</Badge>
                {isSaved && <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-xs px-1 py-0">Saved</Badge>}
                {internship.featured && <Badge className="bg-yellow-100 text-yellow-800 text-xs px-1 py-0">★</Badge>}
              </div>
              <div className="flex gap-1">
                {appliedInternships.includes(internship.id) ? (
                  <Button disabled size="sm" className="flex-1 bg-green-600 hover:bg-green-700 text-xs h-6 px-1">✓</Button>
                ) : (
                  <Button size="sm" className="flex-1 bg-fusteps-red text-white text-xs h-6 px-1 rounded-lg hover:bg-red-600 focus:ring-2 focus:ring-red-300 transition-all duration-200 font-semibold shadow-md hover:shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed disabled:shadow-none" onClick={() => handleApplyInternship(internship)}>Apply</Button>
                )}
                <Button size="sm" variant="outline" onClick={() => handleSaveInternship(internship.id)} className={`h-6 px-1 ${isSaved ? "bg-red-50 border-red-200" : savedInternships.includes(internship.id) ? "bg-blue-50 border-blue-200" : ""}`}>
                  {isSaved ? <X className="w-2 h-2" /> : <Bookmark className="w-2 h-2" />}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      );
    }
    return (
      <Card key={internship.id} className="hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-3">
            <div className="flex gap-3 flex-1">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0"><Building className="w-6 h-6 text-gray-400" /></div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-lg font-semibold text-gray-900">{internship.title}</h3>
                  {internship.featured && <Star className="w-4 h-4 text-yellow-400 fill-current" />}
                </div>
                <p className="text-sm text-gray-600">{internship.company}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => handleSaveInternship(internship.id)} className={savedInternships.includes(internship.id) ? "bg-blue-50 border-blue-200" : ""}>
                <Bookmark className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="outline" onClick={() => handleViewDetails(internship)}>
                <Eye className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="outline">
                <Share2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <MapPin className="w-4 h-4" />
              <span>{internship.location}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Clock className="w-4 h-4" />
              <span>{internship.duration}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <BookOpen className="w-4 h-4" />
              <span>{internship.type}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-green-600">
              <span>{internship.compensation}</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mb-3">
            {internship.skills.map((skill: string, index: number) => (
              <Badge key={index} variant="secondary">{skill}</Badge>
            ))}
          </div>
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-500">Posted {internship.posted} | {internship.applications} applications</p>
            {appliedInternships.includes(internship.id) ? (
              <Button disabled className="bg-green-600 hover:bg-green-700">
                <CheckCircle className="w-4 h-4 mr-2" /> Applied
              </Button>
            ) : (
              <Button className="bg-fusteps-red hover:bg-red-600" onClick={() => handleApplyInternship(internship)}>Apply Now</Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  const handleSaveInternship = (id: number) => {
    setSavedInternships(prev => 
      prev.includes(id) ? prev.filter(savedId => savedId !== id) : [...prev, id]
    );
  };

  const handleViewDetails = (internship: any) => {
    setSelectedInternship(internship);
    setShowInternshipDetails(true);
  };

  const handleApplyInternship = (internship: any) => {
    setSelectedInternship(internship);
    setShowApplyModal(true);
  };

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setApplicationData(prev => ({ ...prev, resume: file }));

      if (!file.name.toLowerCase().endsWith('.pdf')) {
        alert('Please upload a PDF file');
        return;
      }

      try {
        const formDataUpload = new FormData();
        formDataUpload.append('file', file);

        const response = await fetch("http://127.0.0.1:8000/api/resumes/upload/", {
          method: "POST",
          body: formDataUpload,
        });

        if (!response.ok) {
          throw new Error('Failed to parse resume');
        }

        const data = await response.json();
        setApplicationData(prev => ({
          ...prev,
          fullName: data.name || prev.fullName,
          email: data.email || prev.email,
          phone: data.phone || prev.phone,
        }));
      } catch (error) {
        console.error('Error uploading resume:', error);
        alert('Failed to parse resume. Please try again.');
      }
    }
  };

  const handleApplySubmit = () => {
    if (selectedInternship && applicationData.fullName && applicationData.email && applicationData.resume) {
      setAppliedInternships(prev => [...prev, selectedInternship.id]);
      setShowApplyModal(false);
      setApplicationData({
        fullName: "",
        email: "",
        phone: "",
        resume: null,
        motivation: ""
      });
      alert(`Successfully applied to ${selectedInternship.title}!`);
    } else {
      alert('Please fill in all required fields and upload a resume.');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Internship Opportunities</h1>
      
      {/* Search and Filters */}
      <div className="mb-6">
        <div className="flex gap-4 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Search internships, companies, or skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
            <Filter className="w-4 h-4 mr-2" /> Filters
          </Button>
          <Button variant="outline" onClick={() => setViewMode(viewMode === "list" ? "grid" : "list")}>
            {viewMode === "list" ? <Grid3X3 className="w-4 h-4 mr-2" /> : <List className="w-4 h-4 mr-2" />}
            {viewMode === "list" ? "Grid View" : "List View"}
          </Button>
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <Label>Location</Label>
              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger>
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Locations</SelectItem>
                  <SelectItem value="Mountain View, CA">Mountain View, CA</SelectItem>
                  <SelectItem value="San Francisco, CA">San Francisco, CA</SelectItem>
                  <SelectItem value="Seattle, WA">Seattle, WA</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Internship Type</Label>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Types</SelectItem>
                  <SelectItem value="Summer 2024">Summer 2024</SelectItem>
                  <SelectItem value="Fall 2024">Fall 2024</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Duration</Label>
              <Select value={selectedDuration} onValueChange={setSelectedDuration}>
                <SelectTrigger>
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Durations</SelectItem>
                  <SelectItem value="12 weeks">12 weeks</SelectItem>
                  <SelectItem value="16 weeks">16 weeks</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList>
          <TabsTrigger value="all">All Internships</TabsTrigger>
          <TabsTrigger value="summer">Summer 2024</TabsTrigger>
          <TabsTrigger value="fall">Fall 2024</TabsTrigger>
          <TabsTrigger value="saved">Saved ({savedInternships.length})</TabsTrigger>
        </TabsList>
        <TabsContent value={activeTab}>
          {loading ? (
            <p>Loading internships...</p>
          ) : getTabInternships().length === 0 ? (
            <p>No internships found.</p>
          ) : (
            <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" : "space-y-4"}>
              {getTabInternships().map(internship => renderInternshipCard(internship, activeTab === "saved"))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Internship Details Modal */}
      <Dialog open={showInternshipDetails} onOpenChange={setShowInternshipDetails}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedInternship?.title}</DialogTitle>
          </DialogHeader>
          {selectedInternship && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <img src={selectedInternship.logo} alt={selectedInternship.company} className="w-12 h-12 rounded-lg" />
                <div>
                  <h3 className="text-lg font-semibold">{selectedInternship.company}</h3>
                  <p className="text-sm text-gray-500">{selectedInternship.location}</p>
                </div>
              </div>
              <div>
                <h4 className="font-semibold">Description</h4>
                <p className="text-sm">{selectedInternship.description}</p>
              </div>
              <div>
                <h4 className="font-semibold">Requirements</h4>
                <ul className="list-disc pl-5 text-sm">
                  {selectedInternship.requirements.map((req: string, index: number) => (
                    <li key={index}>{req}</li>
                  ))}
                </ul>
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedInternship.skills.map((skill: string, index: number) => (
                  <Badge key={index} variant="secondary">{skill}</Badge>
                ))}
              </div>
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-500">Posted {selectedInternship.posted}</p>
                <div className="flex gap-2">
                  <Button variant="outline">
                    <Download className="w-4 h-4 mr-2" /> Download PDF
                  </Button>
                  <Button onClick={() => handleApplyInternship(selectedInternship)}>Apply Now</Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Apply Modal */}
      <Dialog open={showApplyModal} onOpenChange={setShowApplyModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Apply for {selectedInternship?.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="relative">
              <Label>Full Name</Label>
              <div className="flex items-center">
                <User className="w-4 h-4 text-gray-400 absolute left-3" />
                <Input
                  value={applicationData.fullName}
                  onChange={(e) => setApplicationData(prev => ({ ...prev, fullName: e.target.value }))}
                  placeholder="Enter your full name"
                  className="pl-10"
                />
              </div>
            </div>
            <div className="relative">
              <Label>Email</Label>
              <div className="flex items-center">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3" />
                <Input
                  type="email"
                  value={applicationData.email}
                  onChange={(e) => setApplicationData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Enter your email"
                  className="pl-10"
                />
              </div>
            </div>
            <div className="relative">
              <Label>Phone</Label>
              <div className="flex items-center">
                <Phone className="w-4 h-4 text-gray-400 absolute left-3" />
                <Input
                  type="tel"
                  value={applicationData.phone}
                  onChange={(e) => setApplicationData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="Enter your phone number"
                  className="pl-10"
                />
              </div>
            </div>
            <div className="relative">
              <Label>Resume</Label>
              <div className="flex items-center">
                <FileText className="w-4 h-4 text-gray-400 absolute left-3" />
                <Input
                  type="file"
                  accept=".pdf"
                  onChange={handleResumeUpload}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Label>Why do you want this internship?</Label>
              <Textarea
                value={applicationData.motivation}
                onChange={(e) => setApplicationData(prev => ({ ...prev, motivation: e.target.value }))}
                placeholder="Tell us why you're a great fit..."
                rows={4}
              />
            </div>
            <Button className="w-full" onClick={handleApplySubmit}>
              <Upload className="w-4 h-4 mr-2" /> Submit Application
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}