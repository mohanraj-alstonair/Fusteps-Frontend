import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { Shield, Award, TrendingUp, BookOpen, QrCode } from 'lucide-react';

interface SkillToken {
  id: number;
  skill: { name: string; category: string };
  token_id: string;
  verification_status: string;
  verification_method: string;
  created_at: string;
}

interface SkillGap {
  id: number;
  skill: { name: string; category: string };
  target_role: string;
  importance_score: number;
  recommendation_text: string;
}

interface UpgradeRecommendation {
  id: number;
  skill: { name: string };
  course_title: string;
  provider: string;
  duration: string;
  difficulty_level: string;
  priority_score: number;
}

export default function SkillValidationDashboard() {
  const [skillTokens, setSkillTokens] = useState<SkillToken[]>([]);
  const [skillGaps, setSkillGaps] = useState<SkillGap[]>([]);
  const [recommendations, setRecommendations] = useState<UpgradeRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    if (!userId) return;
    
    try {
      const [tokensRes, gapsRes, recsRes] = await Promise.all([
        fetch(`http://localhost:8000/api/skills/api/skill-tokens/?user_id=${userId}`),
        fetch(`http://localhost:8000/api/skills/api/skill-gaps/?user_id=${userId}`),
        fetch(`http://localhost:8000/api/skills/api/upgrade-recommendations/?user_id=${userId}`)
      ]);
      
      const tokensData = await tokensRes.json();
      const gapsData = await gapsRes.json();
      const recsData = await recsRes.json();
      
      setSkillTokens(Array.isArray(tokensData) ? tokensData : []);
      setSkillGaps(Array.isArray(gapsData) ? gapsData : []);
      setRecommendations(Array.isArray(recsData) ? recsData : []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateSkillRadarData = () => {
    const categories = ['PROGRAMMING', 'FRAMEWORK', 'DATABASE', 'CLOUD', 'DEVOPS'];
    return categories.map(category => ({
      category,
      verified: skillTokens.filter(token => 
        token.skill.category === category && token.verification_status === 'VERIFIED'
      ).length,
      total: 5
    }));
  };

  const getVerificationIcon = (method: string) => {
    switch (method) {
      case 'AI_VERIFIED': return <Shield className="w-4 h-4 text-blue-500" />;
      case 'CERTIFICATE': return <Award className="w-4 h-4 text-green-500" />;
      default: return <Shield className="w-4 h-4 text-gray-500" />;
    }
  };

  if (loading) {
    return <div className="p-6">Loading dashboard...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Skill Intelligence Dashboard</h1>
        <Badge variant="outline" className="text-lg px-4 py-2">
          AI-Powered Career Intelligence
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Shield className="w-8 h-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{skillTokens.length}</p>
                <p className="text-sm text-gray-600">Skill Tokens</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-8 h-8 text-red-500" />
              <div>
                <p className="text-2xl font-bold">{skillGaps.length}</p>
                <p className="text-sm text-gray-600">Skill Gaps</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <BookOpen className="w-8 h-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{recommendations.length}</p>
                <p className="text-sm text-gray-600">Recommendations</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Award className="w-8 h-8 text-yellow-500" />
              <div>
                <p className="text-2xl font-bold">
                  {skillTokens.filter(t => t.verification_status === 'VERIFIED').length}
                </p>
                <p className="text-sm text-gray-600">Verified Skills</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="tokens" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="tokens">Skill Tokens</TabsTrigger>
          <TabsTrigger value="gaps">Gap Analysis</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="tokens" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {skillTokens.map((token) => (
              <Card key={token.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{token.skill.name}</span>
                    {getVerificationIcon(token.verification_method)}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Token ID:</span>
                      <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                        {token.token_id}
                      </code>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Status:</span>
                      <Badge variant={token.verification_status === 'VERIFIED' ? 'default' : 'secondary'}>
                        {token.verification_status}
                      </Badge>
                    </div>
                    <Button size="sm" variant="outline" className="w-full">
                      <QrCode className="w-4 h-4 mr-2" />
                      Generate QR Code
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="gaps" className="space-y-4">
          <div className="space-y-4">
            {skillGaps.map((gap) => (
              <Card key={gap.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{gap.skill.name}</span>
                    <Badge variant="outline">
                      Priority: {gap.importance_score}%
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-3">{gap.recommendation_text}</p>
                  <Progress value={gap.importance_score} className="mb-3" />
                  <div className="flex gap-2">
                    <Button size="sm">Start Learning</Button>
                    <Button size="sm" variant="outline">Find Courses</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="recommendations" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recommendations.map((rec) => (
              <Card key={rec.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{rec.course_title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Provider:</span>
                      <span className="font-medium">{rec.provider}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Duration:</span>
                      <span>{rec.duration}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Level:</span>
                      <Badge variant="outline">{rec.difficulty_level}</Badge>
                    </div>
                    <Progress value={rec.priority_score} className="mt-2" />
                    <Button className="w-full mt-3">Enroll Now</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Skill Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={generateSkillRadarData()}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="category" />
                    <PolarRadiusAxis angle={90} domain={[0, 5]} />
                    <Radar name="Verified Skills" dataKey="verified" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Gap Priority Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={skillGaps.slice(0, 5)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="skill.name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="importance_score" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}