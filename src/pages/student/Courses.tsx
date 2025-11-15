import { useState, useMemo, useEffect } from "react";
import { getCourses, getUserCourses, enrollCourse, getCourseRecommendations, generateCourseRecommendations, getUserProfile, analyzeSkillGaps, getUserSkillGaps } from "@/lib/api";
import { useAuth } from "@/hooks/use-auth";
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

  Download,
  Share2,
  Users,
  Zap,

  ArrowRight,
  Grid3X3,
  List,
  Brain,

} from "lucide-react";
import SimpleSkillDashboard from '../../components/skills/SimpleSkillDashboard';

export default function StudentCoursesPage() {
  const { toast } = useToast();
  const { user } = useAuth();

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



  const fetchSkillsData = async () => {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        console.error('No user ID found in localStorage');
        setSkillProfile({
          currentSkills: [],
          targetSkills: [],
          skillGaps: [],
          overallStrength: 0
        });
        return;
      }
      
      const userIdNum = parseInt(userId);
      
      // Get skills from profile
      let currentSkills = [];
      try {
        const profileRes = await getUserProfile(userIdNum);
        const skills = profileRes.data?.skills || [];
        currentSkills = skills.map((skill: any) => skill.name).filter(Boolean);
      } catch (error) {
        console.log('No profile skills found');
      }
      
      // Get skill gaps
      let skillGaps = [];
      try {
        const gapsRes = await getUserSkillGaps(userIdNum);
        skillGaps = (gapsRes.data || []).map((gap: any) => gap.skill?.name).filter(Boolean);
      } catch (error) {
        console.log('No skill gaps found');
      }
      
      // Calculate target skills and strength
      const allPossibleSkills = ['React', 'Python', 'AWS', 'Docker', 'Node.js', 'TypeScript', 'MongoDB'];
      const targetSkills = allPossibleSkills.filter(skill => !currentSkills.includes(skill)).slice(0, 4);
      
      const userSkillCount = currentSkills.length;
      const skillGapCount = skillGaps.length;
      const totalRelevantSkills = Math.max(userSkillCount + skillGapCount, 1);
      
      let baseStrength = (userSkillCount / totalRelevantSkills) * 100;
      if (userSkillCount > 0) {
        baseStrength = Math.max(baseStrength, 20);
      }
      const diversityBonus = Math.min(userSkillCount * 3, 15);
      const gapPenalty = skillGapCount > 0 ? Math.min(skillGapCount * 2, 20) : 0;
      const overallStrength = Math.min(Math.round(baseStrength + diversityBonus - gapPenalty), 100);
      
      setSkillProfile({
        currentSkills,
        targetSkills,
        skillGaps,
        overallStrength
      });
      
    } catch (error) {
      console.error('Error fetching skills data:', error);
      setSkillProfile({
        currentSkills: [],
        targetSkills: [],
        skillGaps: [],
        overallStrength: 0
      });
    }
  };

  const fetchCourseData = async () => {
    try {
      // Get the current user's ID from localStorage
      const userId = localStorage.getItem('userId');
      if (!userId) {
        console.error('No user ID found in localStorage');
        if (!user) {
          throw new Error('User not logged in');
        }
        console.warn('Using fallback: user not fully authenticated');
        return;
      }
      
      // Fetch available courses first
      const coursesRes = await getCourses();
      setAvailableCourses(coursesRes.data || []);
      
      // Fetch enrolled courses for the current user
      const enrolledRes = await getUserCourses(parseInt(userId));
      setEnrolledCourses(enrolledRes.data || []);
      
      // Generate course recommendations based on user's skills
      try {
        await generateCourseRecommendations(parseInt(userId));
        // Fetch the generated recommendations
        const recommendationsRes = await getCourseRecommendations(parseInt(userId));
        setAiRecommendations(recommendationsRes.data || []);
      } catch (recError) {
        console.log('Recommendations not available yet, will show when skills are analyzed');
        setAiRecommendations([]);
      }
      
    } catch (error) {
      console.error('Error fetching course data:', error);
      // Set fallback data
      setAvailableCourses([]);
      setEnrolledCourses([]);
      setAiRecommendations([]);
    }
  };

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

  // ------------------- STATE DATA -------------------
  const [enrolledCourses, setEnrolledCourses] = useState<any[]>([]);
  const [availableCourses, setAvailableCourses] = useState<any[]>([]);

  const [certificates] = useState<any[]>([]);

  const [, setSkillProfile] = useState({
    currentSkills: [] as string[],
    targetSkills: [] as string[],
    skillGaps: [] as string[],
    overallStrength: 0,
  });

  const [, setAiRecommendations] = useState<any[]>([]);
  
  useEffect(() => {
    // Only fetch data if user is available
    if (user || localStorage.getItem('userId')) {
      fetchSkillsData();
      fetchCourseData();
    }
  }, [user]);

  // ------------------- FILTERING -------------------
  const filteredEnrolledCourses = useMemo(() => {
    return enrolledCourses.filter((c: any) => {
      const q = searchQuery.toLowerCase();
      const course = c.course || c;
      const matchesSearch =
        (course.title || '').toLowerCase().includes(q) ||
        (course.instructor || '').toLowerCase().includes(q) ||
        (course.category || '').toLowerCase().includes(q);
      const matchesCategory =
        !selectedCategory || (course.category || '').toLowerCase() === selectedCategory.toLowerCase();
      return matchesSearch && matchesCategory;
    });
  }, [enrolledCourses, searchQuery, selectedCategory]);

  const filteredAvailableCourses = useMemo(() => {
    return availableCourses.filter((c: any) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        (c.title || '').toLowerCase().includes(q) ||
        (c.instructor || '').toLowerCase().includes(q) ||
        (c.category || '').toLowerCase().includes(q);
      const matchesCategory =
        !selectedCategory || (c.category || '').toLowerCase() === selectedCategory.toLowerCase();
      const matchesLevel =
        !selectedLevel || (c.level || '').toLowerCase() === selectedLevel.toLowerCase();
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
  const handleEnrollCourse = async (courseId: number) => {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        toast({ title: "Error", description: "Please log in to enroll in courses", variant: "destructive" });
        return;
      }
      
      await enrollCourse(courseId, parseInt(userId));
      toast({ title: "Course Enrolled", description: "You have successfully enrolled!" });
      fetchCourseData(); // Refresh data
    } catch (error) {
      toast({ title: "Error", description: "Failed to enroll in course", variant: "destructive" });
    }
  };

  const handleDownloadCertificate = () => {
    toast({ title: "Certificate Downloaded", description: "Your certificate is ready!" });
  };

  const handleShareCertificate = (cert: any) => {
    navigator.clipboard.writeText(cert.shareableUrl);
    toast({ title: "Link Copied", description: "Certificate link copied to clipboard!" });
  };



  // ------------------- RENDER -------------------
  // Show loading or login message if user is not available
  if (!user && !localStorage.getItem('userId')) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please Log In</h2>
          <p className="text-gray-600 mb-6">You need to be logged in to view your personalized courses.</p>
          <Button onClick={() => window.location.href = '/login'} className="bg-blue-600 hover:bg-blue-700">
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

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

        {/* AI Skills Dashboard Section */}
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-2xl text-blue-800">
              <div className="flex items-center">
                <Brain className="w-8 h-8 mr-3" />
                🚀 AI-Powered Skills Intelligence
              </div>
              <Button 
                onClick={async () => {
                  const userId = localStorage.getItem('userId');
                  if (userId) {
                    try {
                      await analyzeSkillGaps(parseInt(userId), 'Software Engineer');
                      toast({ title: "Analysis Complete", description: "Skill gaps analyzed and recommendations generated!" });
                      // Refresh the dashboard
                      window.location.reload();
                    } catch (error) {
                      toast({ title: "Analysis Failed", description: "Could not analyze skills. Please try again.", variant: "destructive" });
                    }
                  }
                }}
                variant="outline"
                size="sm"
                className="bg-white hover:bg-blue-50"
              >
                <Zap className="w-4 h-4 mr-2" />
                Analyze Skills
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <SimpleSkillDashboard />
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
                {filteredEnrolledCourses.map((c: any) => (
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
                                {c.course?.title || c.title}
                              </h3>
                              <p className="text-gray-600 mb-2">
                                by {c.course?.instructor || c.instructor} • {c.course?.provider || c.provider}
                              </p>
                              <div className="flex items-center space-x-4 text-sm text-gray-600">
                                <span className="flex items-center">
                                  <Clock className="w-4 h-4 mr-1" />
                                  {c.course?.duration || c.duration}
                                </span>
                                <span className="flex items-center">
                                  <Users className="w-4 h-4 mr-1" />
                                  {c.course?.lessons || c.lessons} lessons
                                </span>
                                <span className="flex items-center">
                                  <Star className="w-4 h-4 mr-1 text-yellow-500" />
                                  {c.course?.rating || c.rating}
                                </span>
                              </div>
                            </div>
                            <Badge variant="secondary">{c.course?.category || c.category}</Badge>
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
                              <p className="text-sm text-gray-600">{c.next_lesson || 'Continue Learning'}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900 mb-1">
                                Estimated Completion
                              </p>
                              <p className="text-sm text-gray-600">{c.estimated_completion || '4 weeks'}</p>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex flex-wrap gap-2">
                              {(c.course?.skills_taught || []).slice(0, 3).map((skill: any, i: number) => (
                                <Badge key={i} variant="outline">
                                  {skill.name || skill}
                                </Badge>
                              ))}
                              {(c.course?.skills_taught || []).length > 3 && (
                                <Badge variant="outline">
                                  +{(c.course?.skills_taught || []).length - 3} more
                                </Badge>
                              )}
                            </div>

                            <Button
                              className="bg-fusteps-red hover:bg-red-600 text-white"
                              onClick={() => {
                                setSelectedCourse(c);
                                setCurrentLesson({
                                  title: c.next_lesson || 'Continue Learning',
                                  content: "This is the content for the lesson: " + (c.next_lesson || 'Continue Learning'),
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
                {filteredAvailableCourses.map((c: any) => (
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
                              <span className="text-sm text-gray-600">{c.match_score || 85}%</span>
                            </div>
                            <Progress value={c.match_score || 85} className="h-3" />
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex flex-wrap gap-2">
                              {(c.skills_taught || []).slice(0, 3).map((skill: any, i: number) => (
                                <Badge key={i} variant="outline">
                                  {skill.name || skill}
                                </Badge>
                              ))}
                              {(c.skills_taught || []).length > 3 && (
                                <Badge variant="outline">
                                  +{(c.skills_taught || []).length - 3} more
                                </Badge>
                              )}
                            </div>

                            <div className="flex items-center space-x-3">
                              <span className="text-lg font-semibold text-gray-900">
                                {c.price}
                              </span>
                              <Button
                                className="bg-fusteps-red hover:bg-red-600 text-white"
                                onClick={() => handleEnrollCourse(c.id)}
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
            {certificates.length === 0 ? (
              <div className="text-center py-12">
                <div className="p-4 bg-gray-100 rounded-xl inline-block mb-4">
                  <Award className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No Certificates Yet
                </h3>
                <p className="text-gray-600 mb-4">
                  Complete courses to earn certificates and showcase your achievements
                </p>
                <Button 
                  variant="outline"
                  onClick={() => (document.querySelector('[value="browse"]') as HTMLElement)?.click()}
                >
                  Browse Courses
                </Button>
              </div>
            ) : (
              <div className="grid gap-6">
                {certificates.map((cert: any) => (
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
                              <Button variant="outline" size="sm" onClick={() => handleShareCertificate(cert)}>
                                <Share2 className="w-4 h-4 mr-2" />
                                Share
                              </Button>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {cert.skills.map((s: any, i: number) => (
                              <Badge key={i} variant="secondary" className="bg-green-100 text-green-800">
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
            )}
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