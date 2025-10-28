import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  Search,
  BookOpen,
  Clock,
  Award,
  PlayCircle,
  Star,
  TrendingUp,
  Lightbulb,
  Download,
  Share2,
  Users,
  Zap,
  Plus,
  ArrowRight,
  Grid3X3,
  List,
} from "lucide-react";

export default function StudentCoursesPage() {
  const { toast } = useToast();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");
  const [selectedPrice, setSelectedPrice] = useState("");
  const [viewMode, setViewMode] = useState("list");
  const [showContinueLearningModal, setShowContinueLearningModal] = useState(false);
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [currentLesson, setCurrentLesson] = useState<any>(null);
  const [quizAnswers, setQuizAnswers] = useState<{ [key: number]: string }>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  // ------------------- QUIZ DATA -------------------
  const quizData = [
    {
      id: 1,
      question: "What is the primary purpose of a REST API?",
      options: [
        "To create user interfaces",
        "To enable communication between different systems over HTTP",
        "To store data in databases",
        "To handle user authentication",
      ],
      correctAnswer: "To enable communication between different systems over HTTP",
    },
    {
      id: 2,
      question: "Which HTTP method is typically used to retrieve data from a server?",
      options: ["POST", "PUT", "GET", "DELETE"],
      correctAnswer: "GET",
    },
    {
      id: 3,
      question: "What does JSON stand for?",
      options: [
        "JavaScript Object Notation",
        "JavaScript Online Network",
        "Java Simple Object Notation",
        "JavaScript Object Network",
      ],
      correctAnswer: "JavaScript Object Notation",
    },
    {
      id: 4,
      question: "Which of the following is NOT a valid HTTP status code?",
      options: ["200", "404", "500", "999"],
      correctAnswer: "999",
    },
    {
      id: 5,
      question: "What is the purpose of middleware in Express.js?",
      options: [
        "To handle routing",
        "To process requests before they reach route handlers",
        "To connect to databases",
        "To render HTML templates",
      ],
      correctAnswer: "To process requests before they reach route handlers",
    },
  ];

  // ------------------- STATIC DATA -------------------
  const enrolledCourses = [
    {
      id: 1,
      title: "Full Stack Web Development",
      instructor: "Sarah Chen",
      progress: 75,
      duration: "12 weeks",
      lessons: 48,
      completedLessons: 36,
      rating: 4.8,
      nextLesson: "Building REST APIs with Node.js",
      category: "Programming",
      provider: "Coursera",
      skillsTaught: ["React", "Node.js", "MongoDB", "Express"],
      lastAccessed: "2 hours ago",
      estimatedCompletion: "3 weeks",
    },
    {
      id: 2,
      title: "Data Structures & Algorithms",
      instructor: "Dr. Michael Kumar",
      progress: 45,
      duration: "8 weeks",
      lessons: 32,
      completedLessons: 14,
      rating: 4.9,
      nextLesson: "Binary Trees and Traversal",
      category: "Computer Science",
      provider: "edX",
      skillsTaught: ["Algorithms", "Data Structures", "Problem Solving"],
      lastAccessed: "1 day ago",
      estimatedCompletion: "5 weeks",
    },
  ];

  const availableCourses = [
    {
      id: 3,
      title: "Machine Learning Fundamentals",
      instructor: "Prof. Emily Watson",
      duration: "10 weeks",
      lessons: 40,
      rating: 4.7,
      students: 1250,
      price: "Free",
      level: "Beginner",
      category: "AI/ML",
      provider: "Coursera",
      skillsTaught: ["Python", "TensorFlow", "Scikit-learn", "Data Analysis"],
      featured: true,
      matchScore: 95,
    },
    {
      id: 4,
      title: "React Advanced Patterns",
      instructor: "John Martinez",
      duration: "6 weeks",
      lessons: 24,
      rating: 4.9,
      students: 890,
      price: "$49",
      level: "Advanced",
      category: "Frontend",
      provider: "Udemy",
      skillsTaught: ["React Hooks", "Context API", "Performance Optimization"],
      featured: false,
      matchScore: 88,
    },
    {
      id: 5,
      title: "AWS Cloud Practitioner",
      instructor: "Lisa Rodriguez",
      duration: "4 weeks",
      lessons: 20,
      rating: 4.6,
      students: 2100,
      price: "$29",
      level: "Intermediate",
      category: "Cloud Computing",
      provider: "AWS",
      skillsTaught: ["AWS Services", "Cloud Architecture", "DevOps"],
      featured: true,
      matchScore: 92,
    },
  ];

  const certificates = [
    {
      id: 1,
      title: "JavaScript Fundamentals",
      issueDate: "Jan 15, 2024",
      grade: "A+",
      instructor: "David Kim",
      provider: "Coursera",
      verificationCode: "JS-FUND-2024-001",
      shareableUrl: "https://coursera.org/verify/JS-FUND-2024-001",
      skills: ["JavaScript", "ES6", "DOM Manipulation"],
    },
    {
      id: 2,
      title: "Database Design",
      issueDate: "Dec 20, 2023",
      grade: "A",
      instructor: "Lisa Rodriguez",
      provider: "edX",
      verificationCode: "DB-DESIGN-2023-002",
      shareableUrl: "https://edx.org/verify/DB-DESIGN-2023-002",
      skills: ["SQL", "Database Design", "Normalization"],
    },
  ];

  const skillProfile = {
    currentSkills: ["JavaScript", "React", "Node.js", "MongoDB"],
    targetSkills: ["Python", "Machine Learning", "AWS", "Docker"],
    skillGaps: ["Python", "Machine Learning", "AWS", "Docker"],
    overallStrength: 75,
  };

  const aiRecommendations = [
    {
      id: 6,
      title: "Python for Data Science",
      reason: "Based on your interest in Machine Learning",
      priority: "High",
      estimatedTime: "8 weeks",
      skillsGained: ["Python", "Pandas", "NumPy", "Data Analysis"],
    },
    {
      id: 7,
      title: "Docker & Kubernetes",
      reason: "Complements your web development skills",
      priority: "Medium",
      estimatedTime: "6 weeks",
      skillsGained: ["Docker", "Kubernetes", "DevOps", "Containerization"],
    },
  ];

  // ------------------- FILTERING -------------------
  const filteredEnrolledCourses = useMemo(() => {
    return enrolledCourses.filter((c) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        c.title.toLowerCase().includes(q) ||
        c.instructor.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q);
      const matchesCategory =
        !selectedCategory || c.category.toLowerCase() === selectedCategory.toLowerCase();
      return matchesSearch && matchesCategory;
    });
  }, [enrolledCourses, searchQuery, selectedCategory]);

  const filteredAvailableCourses = useMemo(() => {
    return availableCourses.filter((c) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        c.title.toLowerCase().includes(q) ||
        c.instructor.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q);
      const matchesCategory =
        !selectedCategory || c.category.toLowerCase() === selectedCategory.toLowerCase();
      const matchesLevel =
        !selectedLevel || c.level.toLowerCase() === selectedLevel.toLowerCase();
      const matchesPrice =
        !selectedPrice ||
        (selectedPrice === "free" && c.price === "Free") ||
        (selectedPrice === "paid" && c.price !== "Free");
      return matchesSearch && matchesCategory && matchesLevel && matchesPrice;
    });
  }, [availableCourses, searchQuery, selectedCategory, selectedLevel, selectedPrice]);

  // ------------------- TAB RESET -------------------
  const handleTabChange = (value: string) => {
    if (value === "enrolled") {
      setSelectedLevel("");
      setSelectedPrice("");
    } else if (value === "certificates" || value === "quizzes") {
      setSearchQuery("");
      setSelectedCategory("");
      setSelectedLevel("");
      setSelectedPrice("");
    }
  };

  // ------------------- TOAST HANDLERS -------------------
  const handleEnrollCourse = () => {
    toast({ title: "Course Enrolled", description: "You have successfully enrolled!" });
  };

  const handleDownloadCertificate = () => {
    toast({ title: "Certificate Downloaded", description: "Your certificate is ready!" });
  };

  const handleShareCertificate = (cert: any) => {
    navigator.clipboard.writeText(cert.shareableUrl);
    toast({ title: "Link Copied", description: "Certificate link copied to clipboard!" });
  };

  const handleAddToLearningPlan = () => {
    toast({ title: "Added to Plan", description: "Course added to your learning plan!" });
  };

  // ------------------- RENDER -------------------
  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Skill Courses</h1>
            <p className="text-gray-600 mt-1">
              Enhance your skills with expert-led courses and certifications
            </p>
          </div>
        </div>

        {/* Skill Profile */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-3 text-gray-900">
              <div className="p-2 bg-gray-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-gray-600" />
              </div>
              <span>Skill Profile Overview</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {skillProfile.overallStrength}%
                </div>
                <div className="text-sm text-gray-600 mb-4">Overall Skill Strength</div>
                <Progress value={skillProfile.overallStrength} className="h-3" />
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Current Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {skillProfile.currentSkills.map((s, i) => (
                    <Badge key={i} variant="secondary" className="bg-green-100 text-green-800">
                      {s}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Target Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {skillProfile.targetSkills.map((s, i) => (
                    <Badge key={i} variant="outline">
                      {s}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AI Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-3 text-gray-900">
              <div className="p-2 bg-gray-100 rounded-lg">
                <Lightbulb className="w-5 h-5 text-gray-600" />
              </div>
              <span>AI-Powered Recommendations</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {aiRecommendations.map((c) => (
                <div
                  key={c.id}
                  className="p-4 bg-gray-50 rounded-xl border-l-4 border-gray-600"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1">{c.title}</h4>
                      <p className="text-sm text-gray-600 mb-2">{c.reason}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-600">
                        <span className="flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {c.estimatedTime}
                        </span>
                        <Badge
                          variant="secondary"
                          className={
                            c.priority === "High"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                          }
                        >
                          {c.priority} Priority
                        </Badge>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      className="bg-fusteps-red hover:bg-red-600 text-white"
                      onClick={handleAddToLearningPlan}
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      Add
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Search & Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search courses, skills, or instructors..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="programming">Programming</SelectItem>
                  <SelectItem value="ai-ml">AI/ML</SelectItem>
                  <SelectItem value="frontend">Frontend</SelectItem>
                  <SelectItem value="cloud computing">Cloud Computing</SelectItem>
                  <SelectItem value="computer science">Computer Science</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedPrice} onValueChange={setSelectedPrice}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Price" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="free">Free</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="enrolled" className="w-full" onValueChange={handleTabChange}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="enrolled">
              My Courses ({filteredEnrolledCourses.length})
            </TabsTrigger>
            <TabsTrigger value="browse">
              Browse ({filteredAvailableCourses.length})
            </TabsTrigger>
            <TabsTrigger value="certificates">
              Certificates ({certificates.length})
            </TabsTrigger>
            <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
          </TabsList>

          {/* ---------- ENROLLED ---------- */}
          <TabsContent value="enrolled" className="space-y-6 mt-6">
            {filteredEnrolledCourses.length === 0 ? (
              <p className="text-center text-gray-500 py-8">
                No enrolled courses match your search.
              </p>
            ) : (
              <div className="grid gap-6">
                {filteredEnrolledCourses.map((c) => (
                  <Card key={c.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="p-3 bg-gray-100 rounded-xl">
                          <BookOpen className="w-6 h-6 text-gray-600" />
                        </div>

                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className="text-xl font-semibold text-gray-900 mb-1">
                                {c.title}
                              </h3>
                              <p className="text-gray-600 mb-2">
                                by {c.instructor} • {c.provider}
                              </p>
                              <div className="flex items-center space-x-4 text-sm text-gray-600">
                                <span className="flex items-center">
                                  <Clock className="w-4 h-4 mr-1" />
                                  {c.duration}
                                </span>
                                <span className="flex items-center">
                                  <Users className="w-4 h-4 mr-1" />
                                  {c.lessons} lessons
                                </span>
                                <span className="flex items-center">
                                  <Star className="w-4 h-4 mr-1 text-yellow-500" />
                                  {c.rating}
                                </span>
                              </div>
                            </div>
                            <Badge variant="secondary">{c.category}</Badge>
                          </div>

                          <div className="mb-4">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm font-medium text-gray-900">Progress</span>
                              <span className="text-sm text-gray-600">{c.progress}%</span>
                            </div>
                            <Progress value={c.progress} className="h-3" />
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <p className="text-sm font-medium text-gray-900 mb-1">
                                Next Lesson
                              </p>
                              <p className="text-sm text-gray-600">{c.nextLesson}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900 mb-1">
                                Estimated Completion
                              </p>
                              <p className="text-sm text-gray-600">{c.estimatedCompletion}</p>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex flex-wrap gap-2">
                              {c.skillsTaught.slice(0, 3).map((s, i) => (
                                <Badge key={i} variant="outline">
                                  {s}
                                </Badge>
                              ))}
                              {c.skillsTaught.length > 3 && (
                                <Badge variant="outline">
                                  +{c.skillsTaught.length - 3} more
                                </Badge>
                              )}
                            </div>

                            <Button
                              className="bg-fusteps-red hover:bg-red-600 text-white"
                              onClick={() => {
                                setSelectedCourse(c);
                                setCurrentLesson({
                                  title: c.nextLesson,
                                  content: "This is the content for the lesson: " + c.nextLesson,
                                });
                                setShowContinueLearningModal(true);
                              }}
                            >
                              <PlayCircle className="w-4 h-4 mr-2" />
                              Continue Learning
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* ---------- BROWSE ---------- */}
          <TabsContent value="browse" className="space-y-6 mt-6">
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

            {filteredAvailableCourses.length === 0 ? (
              <p className="text-center text-gray-500 py-8">
                No courses found matching your filters.
              </p>
            ) : (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                    : "grid gap-6"
                }
              >
                {filteredAvailableCourses.map((c) => (
                  <Card key={c.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="p-3 bg-gray-100 rounded-xl">
                          <BookOpen className="w-6 h-6 text-gray-600" />
                        </div>

                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className="text-xl font-semibold text-gray-900 mb-1">
                                {c.title}
                              </h3>
                              <p className="text-gray-600 mb-2">
                                by {c.instructor} • {c.provider}
                              </p>
                              <div className="flex items-center space-x-4 text-sm text-gray-600">
                                <span className="flex items-center">
                                  <Clock className="w-4 h-4 mr-1" />
                                  {c.duration}
                                </span>
                                <span className="flex items-center">
                                  <Users className="w-4 h-4 mr-1" />
                                  {c.students} students
                                </span>
                                <span className="flex items-center">
                                  <Star className="w-4 h-4 mr-1 text-yellow-500" />
                                  {c.rating}
                                </span>
                              </div>
                            </div>

                            <div className="text-right">
                              <Badge variant="secondary" className="mb-2">
                                {c.category}
                              </Badge>
                              {c.featured && (
                                <Badge
                                  variant="secondary"
                                  className="bg-yellow-100 text-yellow-800"
                                >
                                  Featured
                                </Badge>
                              )}
                            </div>
                          </div>

                          <div className="mb-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-gray-900">
                                Match Score
                              </span>
                              <span className="text-sm text-gray-600">{c.matchScore}%</span>
                            </div>
                            <Progress value={c.matchScore} className="h-3" />
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex flex-wrap gap-2">
                              {c.skillsTaught.slice(0, 3).map((s, i) => (
                                <Badge key={i} variant="outline">
                                  {s}
                                </Badge>
                              ))}
                              {c.skillsTaught.length > 3 && (
                                <Badge variant="outline">
                                  +{c.skillsTaught.length - 3} more
                                </Badge>
                              )}
                            </div>

                            <div className="flex items-center space-x-3">
                              <span className="text-lg font-semibold text-gray-900">
                                {c.price}
                              </span>
                              <Button
                                className="bg-fusteps-red hover:bg-red-600 text-white"
                                onClick={handleEnrollCourse}
                              >
                                <ArrowRight className="w-4 h-4 mr-2" />
                                Enroll Now
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* ---------- CERTIFICATES ---------- */}
          <TabsContent value="certificates" className="space-y-6 mt-6">
            <div className="grid gap-6">
              {certificates.map((cert) => (
                <Card key={cert.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="p-3 bg-gray-100 rounded-xl">
                        <Award className="w-6 h-6 text-gray-600" />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-1">
                              {cert.title}
                            </h3>
                            <p className="text-gray-600 mb-2">
                              by {cert.instructor} • {cert.provider}
                            </p>
                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                              <span>Issued: {cert.issueDate}</span>
                              <span>Grade: {cert.grade}</span>
                              <span>Code: {cert.verificationCode}</span>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2">
                            <Button variant="outline" size="sm" onClick={handleDownloadCertificate}>
                              <Download className="w-4 h-4 mr-2" />
                              Download
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleShareCertificate(cert)}
                            >
                              <Share2 className="w-4 h-4 mr-2" />
                              Share
                            </Button>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {cert.skills.map((s, i) => (
                            <Badge
                              key={i}
                              variant="secondary"
                              className="bg-green-100 text-green-800"
                            >
                              {s}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* ---------- QUIZZES ---------- */}
          <TabsContent value="quizzes" className="space-y-6 mt-6">
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="p-4 bg-gray-100 rounded-xl inline-block mb-4">
                    <Zap className="w-8 h-8 text-gray-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Interactive Quizzes
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Test your knowledge with quizzes and assessments
                  </p>
                  <Button
                    className="bg-fusteps-red hover:bg-red-600 text-white"
                    onClick={() => {
                      setQuizAnswers({});
                      setQuizSubmitted(false);
                      setQuizScore(0);
                      setShowQuizModal(true);
                    }}
                  >
                    <PlayCircle className="w-4 h-4 mr-2" />
                    Start Quiz
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* ---------- CONTINUE LEARNING MODAL ---------- */}
      <Dialog open={showContinueLearningModal} onOpenChange={setShowContinueLearningModal}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedCourse?.title} - {currentLesson?.title}
            </DialogTitle>
          </DialogHeader>
          <div className="p-4">
            <p>{currentLesson?.content}</p>
            <div className="mt-6 flex justify-between">
              <Button
                onClick={() => {
                  setCurrentLesson({
                    title: "Next Lesson Title",
                    content: "Content for the next lesson...",
                  });
                }}
              >
                Next Lesson
              </Button>
              <Button variant="outline" onClick={() => setShowContinueLearningModal(false)}>
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ---------- QUIZ MODAL ---------- */}
      <Dialog open={showQuizModal} onOpenChange={setShowQuizModal}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Course Quiz: General Knowledge</DialogTitle>
          </DialogHeader>

          <div className="p-4">
            {!quizSubmitted ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  let score = 0;
                  quizData.forEach((q) => {
                    if (quizAnswers[q.id] === q.correctAnswer) score++;
                  });
                  setQuizScore(score);
                  setQuizSubmitted(true);
                }}
              >
                {quizData.map((q) => (
                  <div key={q.id} className="mb-6 p-4 border rounded-lg">
                    <p className="font-semibold mb-3">
                      {q.id}. {q.question}
                    </p>
                    <RadioGroup
                      value={quizAnswers[q.id] ?? ""}
                      onValueChange={(v) =>
                        setQuizAnswers((prev) => ({ ...prev, [q.id]: v }))
                      }
                    >
                      {q.options.map((opt, i) => (
                        <div key={i} className="flex items-center space-x-2 mb-2">
                          <RadioGroupItem
                            value={opt}
                            id={`q${q.id}_opt${i}`}
                          />
                          <Label htmlFor={`q${q.id}_opt${i}`} className="cursor-pointer">
                            {opt}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                ))}

                <div className="flex justify-end space-x-4 mt-6">
                  <Button type="submit" className="bg-fusteps-red hover:bg-red-600 text-white">
                    Submit Quiz
                  </Button>
                  <Button variant="outline" onClick={() => setShowQuizModal(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            ) : (
              <div className="text-center py-8">
                <div className="text-5xl font-bold text-fusteps-red mb-4">
                  {quizScore} / {quizData.length}
                </div>
                <p className="text-lg text-gray-700 mb-6">
                  {quizScore >= 4 ? "Great job! You passed!" : "Keep learning! Try again."}
                </p>
                <div className="flex justify-center gap-4">
                  <Button
                    onClick={() => {
                      setQuizAnswers({});
                      setQuizSubmitted(false);
                      setQuizScore(0);
                    }}
                  >
                    Retake Quiz
                  </Button>
                  <Button variant="outline" onClick={() => setShowQuizModal(false)}>
                    Close
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}