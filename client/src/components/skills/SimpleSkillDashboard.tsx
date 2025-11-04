import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Shield, Award, TrendingUp, BookOpen, QrCode, Brain, Zap, Star, CheckCircle, AlertTriangle, ExternalLink, Clock, Users, Target } from 'lucide-react';
import { getUserSkillTokens, getUserSkillGaps, getUserSkillRecommendations, analyzeSkillGaps } from '@/lib/api';

interface SkillToken {
  id: number;
  skill: { name: string; category?: string };
  token_id: string;
  verification_status: string;
  verification_source: string;
  created_at: string;
  status?: string;
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
        
        const mockTokens = skills.map((skill, index) => ({
          id: skill.id,
          skill: { name: skill.name, category: skill.category },
          token_id: `SKL-${skill.name.substring(0,3).toUpperCase()}-${Math.random().toString(36).substring(2,8).toUpperCase()}`,
          verification_status: 'VERIFIED',
          verification_source: 'AI_VERIFIED',
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

  const getVerificationIcon = (method: string) => {
    switch (method) {
      case 'AI_VERIFIED': return <Shield className="w-5 h-5 text-white" />;
      case 'CERTIFICATE': return <Award className="w-5 h-5 text-white" />;
      case 'COURSE_COMPLETION': return <BookOpen className="w-5 h-5 text-white" />;
      case 'ASSESSMENT_PASSED': return <CheckCircle className="w-5 h-5 text-white" />;
      default: return <Shield className="w-5 h-5 text-white" />;
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
                      <div className="flex items-center bg-white border border-gray-200 rounded-full px-4 py-2 shadow-sm hover:shadow-md transition-all duration-200 hover:border-blue-300">
                        <span className="text-sm font-medium text-gray-800 mr-2">{token.skill?.name}</span>
                        {token.is_verified ? (
                          <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                            <CheckCircle className="w-3 h-3 text-white" />
                          </div>
                        ) : (
                          <div className="w-4 h-4 bg-gray-400 rounded-full flex items-center justify-center">
                            <Clock className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </div>
                      
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                        <div className="font-semibold">
                          {token.is_verified ? '✓ Verified' : '⏳ Pending Verification'}
                        </div>
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
    </div>
  );
}