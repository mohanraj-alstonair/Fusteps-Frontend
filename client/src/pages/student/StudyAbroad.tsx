import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Globe, 
  MapPin, 
  DollarSign, 
  Calendar, 
  Users, 
  Star, 
  Search,
  Filter,
  BookOpen,
  FileText,
  Award,
  Clock,
  CheckCircle,
  AlertCircle,
  Info,
  ExternalLink,
  Download,
  Share2,
  Bookmark,
  Eye,
  ArrowRight,
  Plus,
  Minus,
  TrendingUp,
  Building,
  GraduationCap,
  Flag,
  Plane,
  Home,
  Mail,
  Phone,
  Globe as GlobeIcon,
  Target,
  Zap,
  Lightbulb,
  MessageCircle,
  CalendarDays,
  Clock3,
  UserCheck,
  Award as AwardIcon,
  TrendingUp as TrendingUpIcon,
  Grid3X3,
  List
} from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function StudyAbroadPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("explorer");
  const [selectedCountry, setSelectedCountry] = useState("all");
  const [selectedProgram, setSelectedProgram] = useState("all");
  const [selectedBudget, setSelectedBudget] = useState("all");
  const [viewMode, setViewMode] = useState("grid");

  // Countries data
  const countries = [
    {
      name: "United States",
      flag: "🇺🇸",
      universities: 4500,
      avgTuition: 45000,
      avgLivingCost: 15000,
      visaDifficulty: "Medium",
      popularity: 95,
      topUniversities: ["MIT", "Stanford", "Harvard", "UC Berkeley"],
      programs: ["Computer Science", "Engineering", "Business", "Arts"],
      scholarships: 1200,
      applicationDeadline: "December 1st",
      requirements: ["GRE", "TOEFL", "SOP", "LORs", "Transcripts"]
    },
    {
      name: "United Kingdom",
      flag: "🇬🇧",
      universities: 160,
      avgTuition: 35000,
      avgLivingCost: 12000,
      visaDifficulty: "Medium",
      popularity: 88,
      topUniversities: ["Oxford", "Cambridge", "Imperial College", "UCL"],
      programs: ["Computer Science", "Engineering", "Business", "Arts"],
      scholarships: 800,
      applicationDeadline: "January 15th",
      requirements: ["IELTS", "Personal Statement", "LORs", "Transcripts"]
    },
    {
      name: "Canada",
      flag: "🇨🇦",
      universities: 97,
      avgTuition: 25000,
      avgLivingCost: 10000,
      visaDifficulty: "Easy",
      popularity: 92,
      topUniversities: ["University of Toronto", "UBC", "McGill", "Waterloo"],
      programs: ["Computer Science", "Engineering", "Business", "Arts"],
      scholarships: 600,
      applicationDeadline: "February 1st",
      requirements: ["IELTS", "SOP", "LORs", "Transcripts"]
    },
    {
      name: "Germany",
      flag: "🇩🇪",
      universities: 400,
      avgTuition: 500,
      avgLivingCost: 8000,
      visaDifficulty: "Medium",
      popularity: 85,
      topUniversities: ["TU Munich", "LMU Munich", "Heidelberg", "RWTH Aachen"],
      programs: ["Computer Science", "Engineering", "Business", "Arts"],
      scholarships: 400,
      applicationDeadline: "July 15th",
      requirements: ["German Language", "SOP", "LORs", "Transcripts"]
    },
    {
      name: "Australia",
      flag: "🇦🇺",
      universities: 43,
      avgTuition: 30000,
      avgLivingCost: 12000,
      visaDifficulty: "Easy",
      popularity: 82,
      topUniversities: ["University of Melbourne", "ANU", "USyd", "UNSW"],
      programs: ["Computer Science", "Engineering", "Business", "Arts"],
      scholarships: 500,
      applicationDeadline: "November 30th",
      requirements: ["IELTS", "SOP", "LORs", "Transcripts"]
    },
    {
      name: "Singapore",
      flag: "🇸🇬",
      universities: 6,
      avgTuition: 35000,
      avgLivingCost: 10000,
      visaDifficulty: "Easy",
      popularity: 78,
      topUniversities: ["NUS", "NTU", "SMU"],
      programs: ["Computer Science", "Engineering", "Business", "Arts"],
      scholarships: 200,
      applicationDeadline: "January 31st",
      requirements: ["IELTS", "SOP", "LORs", "Transcripts"]
    }
  ];

  // Scholarships data
  const scholarships = [
    {
      name: "Fulbright Scholarship",
      country: "United States",
      amount: 50000,
      deadline: "October 15, 2024",
      eligibility: "Graduates with strong academic record",
      type: "Full Scholarship",
      difficulty: "Very High",
      applications: 15000
    },
    {
      name: "Chevening Scholarship",
      country: "United Kingdom",
      amount: 45000,
      deadline: "November 2, 2024",
      eligibility: "Leadership potential and academic excellence",
      type: "Full Scholarship",
      difficulty: "High",
      applications: 8000
    },
    {
      name: "Vanier CGS",
      country: "Canada",
      amount: 50000,
      deadline: "November 6, 2024",
      eligibility: "PhD students with research potential",
      type: "Full Scholarship",
      difficulty: "Very High",
      applications: 3000
    },
    {
      name: "DAAD Scholarship",
      country: "Germany",
      amount: 850,
      deadline: "October 15, 2024",
      eligibility: "Graduates with German language skills",
      type: "Monthly Stipend",
      difficulty: "Medium",
      applications: 5000
    }
  ];

  // Application timeline
  const timeline = [
    {
      month: "August",
      tasks: [
        "Research universities and programs",
        "Take standardized tests (GRE/IELTS)",
        "Start drafting SOP and LORs"
      ],
      status: "completed"
    },
    {
      month: "September",
      tasks: [
        "Finalize university shortlist",
        "Complete test preparation",
        "Begin application forms"
      ],
      status: "in-progress"
    },
    {
      month: "October",
      tasks: [
        "Submit test scores",
        "Finalize SOP and LORs",
        "Apply for scholarships"
      ],
      status: "pending"
    },
    {
      month: "November",
      tasks: [
        "Submit applications",
        "Follow up with recommenders",
        "Prepare for interviews"
      ],
      status: "pending"
    },
    {
      month: "December",
      tasks: [
        "Complete all applications",
        "Track application status",
        "Prepare for visa process"
      ],
      status: "pending"
    }
  ];

  // Tools and resources
  const tools = [
    {
      name: "SOP Builder",
      description: "AI-powered Statement of Purpose generator",
      icon: FileText,
      status: "available",
      action: "Start Writing"
    },
    {
      name: "LOR Request Manager",
      description: "Track and manage recommendation letters",
      icon: Users,
      status: "available",
      action: "Manage LORs"
    },
    {
      name: "Visa Guide",
      description: "Step-by-step visa application process",
      icon: Globe,
      status: "available",
      action: "View Guide"
    },
    {
      name: "Cost Calculator",
      description: "Calculate total study abroad expenses",
      icon: DollarSign,
      status: "available",
      action: "Calculate"
    }
  ];

  // Handler functions
  const handleCountrySelect = (country: any) => {
    setSelectedCountry(country.name);
    toast({
      title: "Country Selected",
      description: `Exploring opportunities in ${country.name}`,
    });
  };

  const handleScholarshipApply = (scholarship: any) => {
    alert(`Starting application for ${scholarship.name}`);
  };

  const handleToolAction = (tool: any) => {
    alert(`Opening ${tool.name}...`);
  };

  const handleExploreDetails = (country: any) => {
    alert(`Viewing detailed information for ${country.name}`);
  };

  const handleBookmarkScholarship = (scholarship: any) => {
    alert(`${scholarship.name} added to bookmarks`);
  };

  const handleExportPlan = () => {
    alert("Your study abroad plan has been exported successfully");
  };

  const handleSharePlan = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Study abroad plan link copied to clipboard");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in-progress":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Very High":
        return "bg-red-100 text-red-800";
      case "High":
        return "bg-orange-100 text-orange-800";
      case "Medium":
        return "bg-yellow-100 text-yellow-800";
      case "Easy":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Study Abroad</h1>
          <p className="text-gray-600 mt-1">Explore global education opportunities and plan your journey</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleExportPlan}>
            <Download className="w-4 h-4 mr-2" />
            Export Plan
          </Button>
          <Button variant="outline" onClick={handleSharePlan}>
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Globe className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Countries</p>
                <p className="text-xl font-bold">6</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-green-100 rounded-lg">
                <Building className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Universities</p>
                <p className="text-xl font-bold">5,200+</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Award className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Scholarships</p>
                <p className="text-xl font-bold">3,700+</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Calendar className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Days Left</p>
                <p className="text-xl font-bold">45</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="explorer">Country Explorer</TabsTrigger>
          <TabsTrigger value="scholarships">Scholarships</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="tools">Tools</TabsTrigger>
        </TabsList>

        {/* Country Explorer Tab */}
        <TabsContent value="explorer" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <Input placeholder="Search countries or universities..." className="pl-10" />
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                </div>
                <Select value={selectedProgram} onValueChange={setSelectedProgram}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Program" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Programs</SelectItem>
                    <SelectItem value="cs">Computer Science</SelectItem>
                    <SelectItem value="engineering">Engineering</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                    <SelectItem value="arts">Arts</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={selectedBudget} onValueChange={setSelectedBudget}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Budget" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Any Budget</SelectItem>
                    <SelectItem value="low">Under $30K</SelectItem>
                    <SelectItem value="medium">$30K - $50K</SelectItem>
                    <SelectItem value="high">Over $50K</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* View Toggle */}
          <div className="flex justify-between items-center mb-4">
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

          {/* Countries Grid */}
          <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "grid gap-4"}>
            {countries.map((country, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleCountrySelect(country)}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-3xl">{country.flag}</span>
                      <div>
                        <CardTitle className="text-lg">{country.name}</CardTitle>
                        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                          {country.popularity}% Popular
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Universities</p>
                      <p className="font-medium">{country.universities.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Avg Tuition</p>
                      <p className="font-medium">${country.avgTuition.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Living Cost</p>
                      <p className="font-medium">${country.avgLivingCost.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Visa</p>
                      <Badge variant="outline" className="text-xs">
                        {country.visaDifficulty}
                      </Badge>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Top Universities</p>
                    <div className="flex flex-wrap gap-1">
                      {country.topUniversities.slice(0, 3).map((uni, uniIndex) => (
                        <Badge key={uniIndex} variant="outline" className="text-xs">
                          {uni}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Requirements</p>
                    <div className="flex flex-wrap gap-1">
                      {country.requirements.slice(0, 3).map((req, reqIndex) => (
                        <Badge key={reqIndex} variant="outline" className="text-xs">
                          {req}
                        </Badge>
                      ))}
                      {country.requirements.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{country.requirements.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <Button className="w-full" variant="outline" onClick={() => handleExploreDetails(country)}>
                    <Eye className="w-4 h-4 mr-2" />
                    Explore Details
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Scholarships Tab */}
        <TabsContent value="scholarships" className="space-y-6">
          {/* View Toggle */}
          <div className="flex justify-between items-center mb-4">
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
          
          <div className={viewMode === "grid" ? "grid grid-cols-1 lg:grid-cols-2 gap-6" : "grid gap-4"}>
            {scholarships.map((scholarship, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl">{scholarship.name}</CardTitle>
                      <CardDescription>{scholarship.country}</CardDescription>
                    </div>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      ${scholarship.amount.toLocaleString()}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Type</p>
                      <p className="font-medium">{scholarship.type}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Difficulty</p>
                      <Badge variant="outline" className={getDifficultyColor(scholarship.difficulty)}>
                        {scholarship.difficulty}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Deadline</p>
                      <p className="font-medium">{scholarship.deadline}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Applications</p>
                      <p className="font-medium">{scholarship.applications.toLocaleString()}</p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Eligibility</p>
                    <p className="text-sm text-gray-600">{scholarship.eligibility}</p>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button className="flex-1 bg-fusteps-red hover:bg-red-600" onClick={() => handleScholarshipApply(scholarship)}>
                      <ArrowRight className="w-4 h-4 mr-2" />
                      Apply Now
                    </Button>
                    <Button variant="outline" onClick={() => handleBookmarkScholarship(scholarship)}>
                      <Bookmark className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Timeline Tab */}
        <TabsContent value="timeline" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Application Timeline</CardTitle>
              <CardDescription>Track your study abroad application progress</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {timeline.map((month, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        month.status === "completed" ? "bg-green-500" :
                        month.status === "in-progress" ? "bg-blue-500" : "bg-gray-300"
                      }`}>
                        {month.status === "completed" ? (
                          <CheckCircle className="w-5 h-5 text-white" />
                        ) : month.status === "in-progress" ? (
                          <Clock className="w-5 h-5 text-white" />
                        ) : (
                          <AlertCircle className="w-5 h-5 text-white" />
                        )}
                      </div>
                      {index < timeline.length - 1 && (
                        <div className="w-0.5 h-12 bg-gray-300 mt-2"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold text-lg">{month.month}</h3>
                        <Badge variant="outline" className={getStatusColor(month.status)}>
                          {month.status}
                        </Badge>
                      </div>
                      <ul className="space-y-1">
                        {month.tasks.map((task, taskIndex) => (
                          <li key={taskIndex} className="flex items-center space-x-2 text-sm text-gray-600">
                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                            <span>{task}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tools Tab */}
        <TabsContent value="tools" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tools.map((tool, index) => {
              const Icon = tool.icon;
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Icon className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{tool.name}</CardTitle>
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          {tool.status}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4">{tool.description}</p>
                    <Button 
                      className="w-full bg-fusteps-red hover:bg-red-600"
                      onClick={() => handleToolAction(tool)}
                    >
                      {tool.action}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 