import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Award, TrendingUp, BookOpen, Brain, CheckCircle, Target, Upload, Play, AlertCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { getUserSkillGaps, getUserSkillRecommendations, analyzeSkillGaps } from '@/lib/api';

interface SkillToken {
  id: number;
  skill: { name: string; category?: string };
  token_id: string;
  verification_status: string;
  verification_source: string;
  created_at: string;
  status?: string;
  is_verified?: boolean;
}

interface SkillGap {
  id: number;
  skill: { name: string; category?: string };
  importance_score: number;
  recommendation_text: string;
}

interface Recommendation {
  id: number;
  course_title: string;
  skill: { name: string };
  provider: string;
  duration: string;
  difficulty_level: string;
  priority_score: number;
}

export default function SimpleSkillDashboard() {
  const [skillTokens, setSkillTokens] = useState<SkillToken[]>([]);
  const [skillGaps, setSkillGaps] = useState<SkillGap[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [verifyDialog, setVerifyDialog] = useState<{ open: boolean; skill: { name: string; category?: string; id?: number } | null }>({ open: false, skill: null });
  const [quizDialog, setQuizDialog] = useState<{ open: boolean; skill: { name: string; category?: string; id?: number } | null }>({ open: false, skill: null });
  const [certificateFile, setCertificateFile] = useState<File | null>(null);
  const [quizState, setQuizState] = useState<{
    questions: Array<{ question: string; options: string[]; correct: number }>;
    currentQuestion: number;
    answers: (number | null)[];
    score: number;
    completed: boolean;
    showAnswer: boolean;
    selectedAnswer: number | null;
  }>({ questions: [], currentQuestion: 0, answers: [], score: 0, completed: false, showAnswer: false, selectedAnswer: null });
  const [certificateProcessing, setCertificateProcessing] = useState(false);

  const fetchSkillData = async () => {
    setLoading(true);
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        setLoading(false);
        return;
      }

      const userIdNum = parseInt(userId);
      
      // Create mock skill tokens from profile skills
      try {
        const profileRes = await fetch(`http://localhost:8000/api/profile/${userIdNum}/`);
        const profileData = await profileRes.json();
        const skills = profileData.skills || [];
        
        const mockTokens = skills.map((skill: any) => ({
          id: skill.id,
          skill: { name: skill.name, category: skill.category },
          token_id: `SKL-${skill.name.substring(0,3).toUpperCase()}-${Math.random().toString(36).substring(2,8).toUpperCase()}`,
          verification_status: 'VERIFIED',
          verification_source: 'AI_VERIFIED',
          is_verified: skill.is_verified || false,
          created_at: new Date().toISOString()
        }));
        
        setSkillTokens(mockTokens);
      } catch (error) {
        console.log('No profile skills found');
        setSkillTokens([]);
      }

      // Fetch skill gaps
      try {
        const gapsRes = await getUserSkillGaps(userIdNum);
        setSkillGaps(gapsRes.data || []);
      } catch (error) {
        console.log('No skill gaps found');
        setSkillGaps([]);
      }

      // Fetch recommendations
      try {
        const recsRes = await getUserSkillRecommendations(userIdNum);
        setRecommendations(recsRes.data || []);
      } catch (error) {
        console.log('No recommendations found');
        setRecommendations([]);
      }

      // If no gaps exist, analyze them
      if (skillGaps.length === 0) {
        try {
          await analyzeSkillGaps(userIdNum, 'Software Engineer');
          const newGapsRes = await getUserSkillGaps(userIdNum);
          setSkillGaps(newGapsRes.data || []);
          
          const newRecsRes = await getUserSkillRecommendations(userIdNum);
          setRecommendations(newRecsRes.data || []);
        } catch (error) {
          console.log('Could not analyze skill gaps');
        }
      }
    } catch (error) {
      console.error('Error fetching skill data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkillData();
  }, []);



  const handleCertificateUpload = (file: File | undefined) => {
    if (file) {
      setCertificateFile(file);
    }
  };

  const parseCertificate = async (file: File): Promise<{ score: number; proficiency: string }> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result;
        const text = (typeof result === 'string' ? result : '').toLowerCase();

        // Simple certificate parsing logic
        let score = 70; // Default score
        let proficiency = 'INTERMEDIATE';

        // Look for grade/score indicators
        if (text.includes('a+') || text.includes('95') || text.includes('excellent')) {
          score = 95;
          proficiency = 'EXPERT';
        } else if (text.includes('a') || text.includes('90') || text.includes('outstanding')) {
          score = 90;
          proficiency = 'ADVANCED';
        } else if (text.includes('b+') || text.includes('85') || text.includes('good')) {
          score = 85;
          proficiency = 'ADVANCED';
        } else if (text.includes('b') || text.includes('80') || text.includes('satisfactory')) {
          score = 80;
          proficiency = 'INTERMEDIATE';
        }

        // Look for completion indicators
        if (text.includes('completed') || text.includes('certified') || text.includes('passed')) {
          score = Math.max(score, 80);
        }

        resolve({ score, proficiency });
      };

      if (file.type === 'application/pdf') {
        // For PDF files, we'll simulate parsing
        setTimeout(() => {
          resolve({ score: 85, proficiency: 'ADVANCED' });
        }, 2000);
      } else {
        reader.readAsText(file);
      }
    });
  };

  const uploadCertificate = async (skill: { name: string; id?: number }, file: File) => {
    const userId = localStorage.getItem('userId');
    if (!userId || !skill || !file) return;

    setCertificateProcessing(true);

    try {
      // Parse certificate to extract score
      const { score, proficiency } = await parseCertificate(file);

      const formData = new FormData();
      formData.append('user_id', userId);
      formData.append('proficiency', proficiency);
      formData.append('years_of_experience', '1');
      formData.append('is_certified', 'true');
      formData.append('certificate_file', file);
      formData.append('certificate_score', score.toString());

      const response = await fetch(`http://localhost:8000/api/skills/api/skills/${skill.id}/add_to_profile/`, {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        setVerifyDialog({ open: false, skill: null });
        setCertificateFile(null);
        fetchSkillData();
      }
    } catch (error) {
      console.error('Certificate upload failed:', error);
    } finally {
      setCertificateProcessing(false);
    }
  };

  const getQuizQuestions = (skillName: string): Array<{ question: string; options: string[]; correct: number }> => {
    const quizBank: Record<string, Array<{ question: string; options: string[]; correct: number }>> = {
      'Python': [
        { question: 'What is the correct way to create a list in Python?', options: ['list = []', 'list = ()', 'list = {}', 'list = ""'], correct: 0 },
        { question: 'Which keyword is used to define a function in Python?', options: ['function', 'def', 'func', 'define'], correct: 1 },
        { question: 'What does "len()" function return?', options: ['Length of string', 'Length of list', 'Length of any sequence', 'All of the above'], correct: 3 },
        { question: 'Which of these is NOT a Python data type?', options: ['int', 'float', 'char', 'str'], correct: 2 },
        { question: 'What is the output of "print(2 ** 3)"?', options: ['6', '8', '9', '23'], correct: 1 }
      ],
      'JavaScript': [
        { question: 'Which method is used to add an element to the end of an array?', options: ['push()', 'add()', 'append()', 'insert()'], correct: 0 },
        { question: 'What does "===" operator do in JavaScript?', options: ['Assignment', 'Equality check', 'Strict equality check', 'Not equal'], correct: 2 },
        { question: 'Which keyword is used to declare a variable in ES6?', options: ['var', 'let', 'const', 'Both let and const'], correct: 3 },
        { question: 'What is the correct way to write a JavaScript array?', options: ['var colors = "red", "green", "blue"', 'var colors = ["red", "green", "blue"]', 'var colors = 1 = ("red"), 2 = ("green"), 3 = ("blue")', 'var colors = (1:"red", 2:"green", 3:"blue")'], correct: 1 },
        { question: 'Which method converts JSON string to JavaScript object?', options: ['JSON.parse()', 'JSON.stringify()', 'JSON.convert()', 'JSON.object()'], correct: 0 }
      ],
      'React': [
        { question: 'What is JSX?', options: ['JavaScript XML', 'Java Syntax Extension', 'JavaScript Extension', 'JSON XML'], correct: 0 },
        { question: 'Which hook is used for state management in functional components?', options: ['useEffect', 'useState', 'useContext', 'useReducer'], correct: 1 },
        { question: 'What is the virtual DOM?', options: ['Real DOM copy', 'JavaScript representation of DOM', 'HTML template', 'CSS framework'], correct: 1 },
        { question: 'How do you pass data from parent to child component?', options: ['Props', 'State', 'Context', 'Redux'], correct: 0 },
        { question: 'Which method is called after component mounts?', options: ['componentDidMount', 'useEffect', 'Both A and B', 'componentWillMount'], correct: 2 }
      ]
    };

    return quizBank[skillName] || [
      { question: `What is the primary use of ${skillName}?`, options: ['Web Development', 'Data Analysis', 'Mobile Apps', 'All of the above'], correct: 3 },
      { question: `${skillName} is commonly used in which industry?`, options: ['Technology', 'Finance', 'Healthcare', 'All industries'], correct: 3 },
      { question: `What level of expertise do you have in ${skillName}?`, options: ['Beginner', 'Intermediate', 'Advanced', 'Expert'], correct: 1 },
      { question: `How long have you been working with ${skillName}?`, options: ['Less than 1 year', '1-2 years', '2-5 years', '5+ years'], correct: 2 },
      { question: `What is your confidence level with ${skillName}?`, options: ['Low', 'Medium', 'High', 'Very High'], correct: 2 }
    ];
  };

  const startQuiz = (skill: { name: string }) => {
    const questions = getQuizQuestions(skill.name);
    setQuizState({ questions, currentQuestion: 0, answers: [], score: 0, completed: false, showAnswer: false, selectedAnswer: null });
  };

  const answerQuestion = (selectedOption: number) => {
    setQuizState(prev => ({ 
      ...prev, 
      selectedAnswer: selectedOption, 
      showAnswer: true 
    }));
  };
  
  const nextQuestion = () => {
    const newAnswers = [...quizState.answers, quizState.selectedAnswer];
    const nextQuestionIndex = quizState.currentQuestion + 1;
    
    if (nextQuestionIndex >= quizState.questions.length) {
      const correctAnswers = quizState.questions.reduce((count: number, question: any, index: number) => {
        return count + (newAnswers[index] === question.correct ? 1 : 0);
      }, 0);
      
      const score = Math.round((correctAnswers / quizState.questions.length) * 100);
      setQuizState(prev => ({ ...prev, answers: newAnswers, score, completed: true }));
      
      if (score >= 80) {
        setTimeout(() => {
          if (quizDialog.skill) {
            verifySkillWithQuiz(quizDialog.skill, score);
          }
          setQuizDialog({ open: false, skill: null });
        }, 2000);
      }
    } else {
      setQuizState(prev => ({ 
        ...prev, 
        answers: newAnswers, 
        currentQuestion: nextQuestionIndex,
        showAnswer: false,
        selectedAnswer: null
      }));
    }
  };

  const verifySkillWithQuiz = async (skill: { name: string; id?: number }, score: number) => {
    const userId = localStorage.getItem('userId');
    if (!userId || !skill) return;

    try {
      // First, get or create the skill in the database
      let skillId = skill.id;
      if (!skillId) {
        await fetch('http://localhost:8000/api/skills/api/skills/create_default/', {
          method: 'POST'
        });
        
        // Find the skill by name
        const skillsResponse = await fetch('http://localhost:8000/api/skills/api/skills/');
        const skills = await skillsResponse.json();
        const foundSkill = skills.find((s: any) => s.name === skill.name);
        skillId = foundSkill?.id;
      }
      
      if (!skillId) {
        console.error('Could not find or create skill');
        return;
      }

      const response = await fetch(`http://localhost:8000/api/skills/api/skills/${skillId}/add_to_profile/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          proficiency: score >= 90 ? 'EXPERT' : score >= 80 ? 'ADVANCED' : 'INTERMEDIATE',
          years_of_experience: 1,
          is_certified: score >= 80,
          quiz_score: score
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('Quiz verification successful:', data);
        
        // Show success message if skill token was created
        if (data.skill_token) {
          console.log('Skill token generated:', data.skill_token.token_id);
        }
        
        // Force refresh after a short delay to ensure backend is updated
        setTimeout(() => {
          fetchSkillData();
        }, 1000);
      }
    } catch (error) {
      console.error('Quiz verification failed:', error);
    }
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex justify-center items-center py-12">
          <div className="text-center">
            <Brain className="w-12 h-12 mx-auto text-blue-500 animate-pulse mb-4" />
            <p className="text-gray-600">Loading AI Skill Intelligence...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="p-6 space-y-8">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold gradient-text font-display">
              Skill Intelligence
            </h1>
            <Button 
              onClick={fetchSkillData}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
              size="sm"
              disabled={loading}
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              {loading ? 'Loading...' : 'Refresh'}
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg border-0">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">{skillTokens.length}</p>
                  <p className="text-blue-100">Skills</p>
                </div>
                <Award className="w-6 h-6" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white shadow-lg border-0">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">{skillGaps.length}</p>
                  <p className="text-red-100">Gaps</p>
                </div>
                <Target className="w-6 h-6" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg border-0">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">{recommendations.length}</p>
                  <p className="text-green-100">Courses</p>
                </div>
                <BookOpen className="w-6 h-6" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Professional Tabs */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100">
          <Tabs defaultValue="tokens" className="w-full">
            <div className="border-b border-gray-200 px-6 pt-6">
              <TabsList className="grid w-full grid-cols-3 bg-gray-50 p-1 rounded-xl">
                <TabsTrigger value="tokens" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  <Award className="w-4 h-4" />
                  Skills
                </TabsTrigger>
                <TabsTrigger value="gaps" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  <Target className="w-4 h-4" />
                  Gap Analysis
                </TabsTrigger>
                <TabsTrigger value="recommendations" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  <BookOpen className="w-4 h-4" />
                  AI Recommendations
                </TabsTrigger>
              </TabsList>
            </div>
        
            {/* Skills Tab */}
            <TabsContent value="tokens" className="p-6">
              {skillTokens.length === 0 ? (
                <div className="text-center py-8">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Skills Added</h3>
                  <Button 
                    onClick={() => window.location.href = '/student/skills'} 
                    className="bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    Add Skills
                  </Button>
                </div>
              ) : (
                <div className="flex flex-wrap gap-3">
                  {skillTokens.map((token) => (
                    <div key={token.id} className="group relative">
                      <div 
                        className={`flex items-center bg-white border rounded-full px-4 py-2 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer ${
                          token.is_verified ? 'border-green-300 hover:border-green-400' : 'border-orange-300 hover:border-orange-400'
                        }`}
                        onClick={() => !token.is_verified && setVerifyDialog({ open: true, skill: token.skill })}
                      >
                        <span className="text-sm font-medium text-gray-800 mr-2">{token.skill?.name}</span>
                        {token.is_verified ? (
                          <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                            <CheckCircle className="w-3 h-3 text-white" />
                          </div>
                        ) : (
                          <div className="w-4 h-4 bg-orange-500 rounded-full flex items-center justify-center">
                            <AlertCircle className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </div>
                      
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                        {token.is_verified ? (
                          <div>
                            <div className="font-semibold">✓ Verified Skill</div>
                            <div className="text-gray-300">Token: {token.token_id}</div>
                          </div>
                        ) : (
                          <div>
                            <div className="font-semibold text-orange-300">⏳ Not Verified</div>
                            <div className="text-blue-300 cursor-pointer" onClick={(e) => { e.stopPropagation(); setVerifyDialog({ open: true, skill: token.skill }); }}>Click to verify →</div>
                          </div>
                        )}
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
        </TabsContent>
        
            {/* Gap Analysis Tab */}
            <TabsContent value="gaps" className="p-6">
              {skillGaps.length === 0 ? (
                <div className="text-center py-8">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Skill Gaps</h3>
                  <Button 
                    onClick={() => window.location.href = '/student/skills'} 
                    className="bg-green-500 hover:bg-green-600 text-white"
                  >
                    Explore Skills
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {skillGaps.filter((gap, index, self) => 
                    index === self.findIndex(g => g.skill?.name === gap.skill?.name)
                  ).map((gap) => (
                    <Card key={gap.id} className="skill-gap-card">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h5 className="font-bold text-gray-900">{gap.skill?.name}</h5>
                            <p className="text-sm text-gray-600">{gap.skill?.category}</p>
                          </div>
                          <Badge className="bg-red-100 text-red-800">
                            {gap.importance_score}% Priority
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-gray-700 mb-3">{gap.recommendation_text}</p>
                        
                        <Progress value={gap.importance_score} className="h-2 mb-3" />
                        
                        <div className="flex gap-2">
                          <Button size="sm" className="bg-red-500 hover:bg-red-600 text-white flex-1">
                            Start Learning
                          </Button>
                          <Button size="sm" variant="outline">
                            Find Courses
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
        
            {/* Recommendations Tab */}
            <TabsContent value="recommendations" className="p-6">
              {recommendations.length === 0 ? (
                <div className="text-center py-8">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Recommendations</h3>
                  <Button 
                    onClick={() => window.location.href = '/student/skills'} 
                    className="bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    Analyze Skills
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {recommendations.filter((rec, index, self) => 
                    index === self.findIndex(r => r.course_title === rec.course_title)
                  ).map((rec) => (
                    <Card key={rec.id} className="recommendation-card">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h5 className="font-bold text-gray-900">{rec.course_title}</h5>
                            <p className="text-sm text-gray-600">{rec.skill?.name}</p>
                          </div>
                          <Badge className="bg-green-100 text-green-800">
                            {rec.priority_score}% Match
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                          <div>
                            <span className="text-gray-600">Provider:</span>
                            <p className="font-medium">{rec.provider}</p>
                          </div>
                          <div>
                            <span className="text-gray-600">Duration:</span>
                            <p className="font-medium">{rec.duration}</p>
                          </div>
                        </div>
                        
                        <Button className="w-full bg-green-500 hover:bg-green-600 text-white">
                          Enroll Now
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>


      </div>

      {/* Skill Verification Dialog */}
      <Dialog open={verifyDialog.open} onOpenChange={(open) => setVerifyDialog({ open, skill: null })}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Award className="w-5 h-5 text-blue-600" />
              Verify {verifyDialog.skill?.name} Skill
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-sm text-gray-600">
              Choose how you'd like to verify your {verifyDialog.skill?.name} skills:
            </div>
            
            <div className="space-y-3">
              <Button 
                className="w-full justify-start h-auto p-4 border-2 border-blue-200 hover:border-blue-400"
                variant="outline"
                onClick={() => {
                  if (verifyDialog.skill) {
                    setVerifyDialog({ open: false, skill: null });
                    setQuizDialog({ open: true, skill: verifyDialog.skill });
                  }
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Play className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold">Take Quick Assessment</div>
                    <div className="text-xs text-gray-500">5-10 questions • 3 minutes</div>
                  </div>
                </div>
              </Button>
              
              <Button 
                className="w-full justify-start h-auto p-4 border-2 border-green-200 hover:border-green-400"
                variant="outline"
                onClick={() => document.getElementById('certificate-upload')?.click()}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Upload className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold">Upload Certificate</div>
                    <div className="text-xs text-gray-500">PDF, JPG, PNG • Instant verification</div>
                  </div>
                </div>
              </Button>
              
              <input
                id="certificate-upload"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                className="hidden"
                onChange={(e) => handleCertificateUpload(e.target.files?.[0])}
              />
            </div>
            
            {certificateFile && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-800">✓ {certificateFile.name} selected</p>
                {certificateProcessing ? (
                  <div className="mt-2 text-sm text-blue-600">
                    <Brain className="w-4 h-4 inline mr-1 animate-spin" />
                    Analyzing certificate...
                  </div>
                ) : (
                  <Button 
                    size="sm" 
                    className="mt-2"
                    onClick={() => verifyDialog.skill && uploadCertificate(verifyDialog.skill, certificateFile)}
                  >
                    Verify with Certificate
                  </Button>
                )}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Quiz Dialog */}
      <Dialog open={quizDialog.open} onOpenChange={(open) => setQuizDialog({ open, skill: null })}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-purple-600" />
              {quizDialog.skill?.name} Assessment
            </DialogTitle>
          </DialogHeader>
          
          {!quizState.completed ? (
            quizState.questions.length === 0 ? (
              <div className="space-y-4">
                <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                  <h4 className="font-semibold text-purple-800 mb-2">Quick Assessment</h4>
                  <p className="text-sm text-purple-700">
                    Answer 5 questions about {quizDialog.skill?.name} to verify your skill level.
                    Score 80%+ to get verified instantly!
                  </p>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    className="flex-1"
                    onClick={() => quizDialog.skill && startQuiz(quizDialog.skill)}
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Start Assessment
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setQuizDialog({ open: false, skill: null })}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    Question {quizState.currentQuestion + 1} of {quizState.questions.length}
                  </span>
                  <Progress value={((quizState.currentQuestion + 1) / quizState.questions.length) * 100} className="w-32" />
                </div>
                
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold mb-4">
                    {quizState.questions[quizState.currentQuestion]?.question}
                  </h4>
                  
                  <div className="space-y-2">
                    {quizState.questions[quizState.currentQuestion]?.options.map((option: string, index: number) => {
                      const isCorrect = index === (quizState.questions[quizState.currentQuestion] as any)?.correct;
                      const isSelected = quizState.selectedAnswer === index;
                      const showFeedback = quizState.showAnswer;
                      
                      let buttonClass = "w-full text-left justify-start h-auto p-3 ";
                      if (showFeedback) {
                        if (isCorrect) {
                          buttonClass += "bg-green-100 border-green-500 text-green-800 ";
                        } else if (isSelected && !isCorrect) {
                          buttonClass += "bg-red-100 border-red-500 text-red-800 ";
                        } else {
                          buttonClass += "opacity-50 ";
                        }
                      }
                      
                      return (
                        <Button
                          key={index}
                          variant="outline"
                          className={buttonClass}
                          onClick={() => !showFeedback && answerQuestion(index)}
                          disabled={showFeedback}
                        >
                          <div className="flex items-center justify-between w-full">
                            <span>{String.fromCharCode(65 + index)}. {option}</span>
                            {showFeedback && isCorrect && <span className="text-green-600 font-bold">✓</span>}
                            {showFeedback && isSelected && !isCorrect && <span className="text-red-600 font-bold">✗</span>}
                          </div>
                        </Button>
                      );
                    })}
                  </div>
                  
                  {quizState.showAnswer && (
                    <div className="mt-4 text-center">
                      <Button 
                        onClick={nextQuestion}
                        className="bg-blue-500 hover:bg-blue-600 text-white"
                      >
                        {quizState.currentQuestion + 1 >= quizState.questions.length ? 'Finish Quiz' : 'Next Question'}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )
          ) : (
            <div className="space-y-4 text-center">
              <div className={`p-6 rounded-lg ${
                quizState.score >= 80 ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
              }`}>
                <div className={`text-6xl mb-4 ${
                  quizState.score >= 80 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {quizState.score >= 80 ? '🎉' : '😔'}
                </div>
                <h3 className={`text-2xl font-bold mb-2 ${
                  quizState.score >= 80 ? 'text-green-800' : 'text-red-800'
                }`}>
                  {quizState.score >= 80 ? 'Congratulations!' : 'Keep Learning!'}
                </h3>
                <p className={`text-lg mb-4 ${
                  quizState.score >= 80 ? 'text-green-700' : 'text-red-700'
                }`}>
                  You scored {quizState.score}%
                </p>
                <p className="text-sm text-gray-600">
                  {quizState.score >= 80 
                    ? 'Your skill has been verified and a skill token has been generated!' 
                    : 'You need 80% or higher to get verified. Try again or upload a certificate.'}
                </p>
                {quizState.score >= 80 && (
                  <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-xs text-blue-700">
                    🏆 Skill token will be generated automatically
                  </div>
                )}
              </div>
              
              <Button 
                onClick={() => {
                  setQuizDialog({ open: false, skill: null });
                  setQuizState({ questions: [], currentQuestion: 0, answers: [], score: 0, completed: false, showAnswer: false, selectedAnswer: null });
                }}
              >
                Close
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}