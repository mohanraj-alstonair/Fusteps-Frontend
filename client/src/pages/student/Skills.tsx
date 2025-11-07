import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/hooks/use-auth';
import SimpleSkillDashboard from '../../components/skills/SimpleSkillDashboard';
import { Brain, Zap, Target, Award } from 'lucide-react';

interface Skill {
  id: number;
  name: string;
  category: string;
  description: string;
  is_trending: boolean;
  demand_score: number;
}

interface UserSkill {
  id: number;
  skill: Skill;
  proficiency: string;
  years_of_experience: number;
  is_certified: boolean;
}

interface SkillGap {
  id: number;
  skill: Skill;
  importance_score: number;
  recommendation_text: string;
}

export default function Skills() {
  const { user } = useAuth();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [userSkills, setUserSkills] = useState<UserSkill[]>([]);
  const [skillGaps, setSkillGaps] = useState<SkillGap[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingSkill, setAddingSkill] = useState<number | null>(null);
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [skillForm, setSkillForm] = useState({
    proficiency: 'BEGINNER',
    years_of_experience: 0,
    is_certified: false,
    certificate_file: null as File | null
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    if (!userId) {
      setLoading(false);
      return;
    }
    
    try {
      const [skillsRes, userSkillsRes, gapsRes] = await Promise.all([
        fetch('http://localhost:8000/api/skills/api/skills/'),
        fetch(`http://localhost:8000/api/skills/api/user-skills/?user_id=${userId}`),
        fetch(`http://localhost:8000/api/skills/api/skill-gaps/?user_id=${userId}`)
      ]);
      
      const skillsData = await skillsRes.json();
      const userSkillsData = await userSkillsRes.json();
      const gapsData = await gapsRes.json();
      
      setSkills(Array.isArray(skillsData) ? skillsData : []);
      setUserSkills(Array.isArray(userSkillsData) ? userSkillsData : []);
      setSkillGaps(Array.isArray(gapsData) ? gapsData : []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const openSkillDialog = (skill: Skill) => {
    setSelectedSkill(skill);
    setSkillForm({
      proficiency: 'BEGINNER',
      years_of_experience: 0,
      is_certified: false,
      certificate_file: null
    });
    setDialogOpen(true);
  };
  
  const addSkillToProfile = async () => {
    if (!userId || !selectedSkill) return;
    
    setAddingSkill(selectedSkill.id);
    try {
      const formData = new FormData();
      formData.append('user_id', userId);
      formData.append('proficiency', skillForm.proficiency);
      formData.append('years_of_experience', skillForm.years_of_experience.toString());
      formData.append('is_certified', skillForm.is_certified.toString());
      
      if (skillForm.certificate_file) {
        formData.append('certificate_file', skillForm.certificate_file);
      }
      
      const response = await fetch(`http://localhost:8000/api/skills/api/skills/${selectedSkill.id}/add_to_profile/`, {
        method: 'POST',
        body: formData
      });
      
      const data = await response.json();
      if (data.success) {
        // Refresh user skills
        const userSkillsRes = await fetch(`http://localhost:8000/api/skills/api/user-skills/?user_id=${userId}`);
        const userSkillsData = await userSkillsRes.json();
        setUserSkills(Array.isArray(userSkillsData) ? userSkillsData : []);
        setDialogOpen(false);
      } else {
        console.error('Failed to add skill:', data.error);
      }
    } catch (error) {
      console.error('Error adding skill:', error);
    } finally {
      setAddingSkill(null);
    }
  };
  
  const analyzeSkillGaps = async (targetRole = 'Software Engineer') => {
    if (!userId) return;
    
    try {
      const response = await fetch('http://localhost:8000/api/skills/api/skill-gaps/analyze_gaps/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          target_role: targetRole
        })
      });
      
      const data = await response.json();
      setSkillGaps(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error analyzing skill gaps:', error);
    }
  };
  
  const createDefaultSkills = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/skills/api/skills/create_default/', {
        method: 'POST'
      });
      const data = await response.json();
      if (data.message) {
        fetchAllData();
      }
    } catch (error) {
      console.error('Error creating default skills:', error);
    }
  };

  const generateSkillToken = async (skillId: number) => {
    if (!userId) return;
    
    try {
      const response = await fetch(`http://localhost:8000/api/skills/api/skills/${skillId}/add_to_profile/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          proficiency: 'INTERMEDIATE',
          years_of_experience: 1,
          is_certified: false
        })
      });
      
      const data = await response.json();
      if (data.success && data.skill_token) {
        console.log('Skill token generated:', data.skill_token.token_id);
        fetchAllData();
      }
    } catch (error) {
      console.error('Error generating skill token:', error);
    }
  };

  const getProficiencyColor = (proficiency: string) => {
    switch (proficiency) {
      case 'EXPERT': return 'bg-green-500';
      case 'ADVANCED': return 'bg-blue-500';
      case 'INTERMEDIATE': return 'bg-yellow-500';
      case 'BEGINNER': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  if (loading) {
    return <div className="p-6">Loading skills...</div>;
  }
  
  if (!user || !userId) {
    return <div className="p-6">Please log in to view your skills.</div>;
  }
  
  const userSkillIds = new Set(userSkills.map(us => us.skill.id));

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Skills Management</h1>
      </div>

      <Tabs defaultValue="ai-dashboard" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="ai-dashboard">
            <Brain className="w-4 h-4 mr-2" />
            AI Dashboard
          </TabsTrigger>
          <TabsTrigger value="all-skills">All Skills</TabsTrigger>
          <TabsTrigger value="my-skills">My Skills</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
        </TabsList>
        
        <TabsContent value="ai-dashboard">
          <SimpleSkillDashboard />
        </TabsContent>
        
        <TabsContent value="all-skills" className="space-y-4">
          <div className="mb-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
            <h3 className="font-semibold text-blue-800 mb-2 flex items-center">
              <Zap className="w-5 h-5 mr-2" />
              🚀 AI-Enhanced Skills - Now with Tokenization!
            </h3>
            <p className="text-blue-700 text-sm">
              Each skill you add now generates a unique digital token (e.g., SKL-PYT-A4B8C9D2) for instant verification by employers.
            </p>
          </div>
          {skills.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-gray-500 mb-4">No skills available. Create default skills to get started.</p>
                <Button onClick={createDefaultSkills}>Create Default Skills</Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {skills.map((skill) => (
                <Card key={skill.id} className="hover:shadow-lg transition-shadow border-2 border-blue-100 relative">
                <div className="absolute top-2 right-2">
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">
                    <Brain className="w-3 h-3 mr-1" />
                    AI-Enhanced
                  </Badge>
                </div>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between pr-20">
                    <span>{skill.name}</span>
                    {skill.is_trending && (
                      <Badge variant="secondary">🔥 Trending</Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-2">{skill.description}</p>
                  <div className="flex justify-between items-center">
                    <Badge variant="outline">{skill.category}</Badge>
                    <span className="text-sm font-medium">
                      Demand: {skill.demand_score}%
                    </span>
                  </div>
                  {userSkillIds.has(skill.id) ? (
                    <Button className="w-full mt-3" size="sm" disabled>
                      <Award className="w-4 h-4 mr-2" />
                      ✅ Verified Skill
                    </Button>
                  ) : (
                    <Dialog open={dialogOpen && selectedSkill?.id === skill.id} onOpenChange={setDialogOpen}>
                      <DialogTrigger asChild>
                        <Button 
                          className="w-full mt-3" 
                          size="sm"
                          onClick={() => openSkillDialog(skill)}
                          disabled={addingSkill === skill.id}
                        >
                          <Target className="w-4 h-4 mr-2" />
                          {addingSkill === skill.id ? 'Adding...' : 'Add & Verify Skill'}
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Add {skill.name} to Your Profile</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <p className="text-sm text-yellow-800">
                              <strong>Verification Requirements:</strong><br/>
                              ✅ Certificate OR 2+ years experience = Verified badge<br/>
                              ⏳ Just claiming = Pending verification
                            </p>
                          </div>
                          <div>
                            <Label htmlFor="proficiency">Proficiency Level</Label>
                            <Select value={skillForm.proficiency} onValueChange={(value) => setSkillForm({...skillForm, proficiency: value})}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="BEGINNER">Beginner</SelectItem>
                                <SelectItem value="INTERMEDIATE">Intermediate</SelectItem>
                                <SelectItem value="ADVANCED">Advanced</SelectItem>
                                <SelectItem value="EXPERT">Expert</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="experience">Years of Experience</Label>
                            <Input
                              id="experience"
                              type="number"
                              min="0"
                              step="0.5"
                              value={skillForm.years_of_experience}
                              onChange={(e) => setSkillForm({...skillForm, years_of_experience: parseFloat(e.target.value) || 0})}
                            />
                          </div>
                          <div className="space-y-3">
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id="certified"
                                checked={skillForm.is_certified}
                                onCheckedChange={(checked) => setSkillForm({...skillForm, is_certified: !!checked})}
                              />
                              <Label htmlFor="certified">I have certification in this skill</Label>
                            </div>
                            {skillForm.is_certified && (
                              <div>
                                <Label htmlFor="certificate">Upload Certificate (Optional)</Label>
                                <Input
                                  id="certificate"
                                  type="file"
                                  accept=".pdf,.jpg,.jpeg,.png"
                                  className="mt-1"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0] || null;
                                    setSkillForm({...skillForm, certificate_file: file});
                                  }}
                                />
                                <p className="text-xs text-gray-500 mt-1">Upload certificate to get instant verification</p>
                                {skillForm.certificate_file && (
                                  <p className="text-xs text-green-600 mt-1">✓ {skillForm.certificate_file.name} selected</p>
                                )}
                              </div>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <Button onClick={addSkillToProfile} disabled={addingSkill === skill.id}>
                              {addingSkill === skill.id ? 'Adding...' : 'Add Skill'}
                            </Button>
                            <Button variant="outline" onClick={() => setDialogOpen(false)}>
                              Cancel
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}
                </CardContent>
              </Card>
            ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="my-skills" className="space-y-4">
          {userSkills.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-gray-500">No skills added yet. Start by adding skills from the "All Skills" tab.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {userSkills.map((userSkill) => (
                <Card key={userSkill.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{userSkill.skill.name}</span>
                      <Badge className={getProficiencyColor(userSkill.proficiency)}>
                        {userSkill.proficiency}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Status:</span>
                        <span className="flex items-center">
                          {userSkill.is_verified ? (
                            <Badge className="bg-green-100 text-green-800">
                              ✅ Verified
                            </Badge>
                          ) : (
                            <Badge variant="outline">
                              ⏳ Pending
                            </Badge>
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Experience:</span>
                        <span>{userSkill.years_of_experience} years</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Certified:</span>
                        <span>{userSkill.is_certified ? 'Yes' : 'No'}</span>
                      </div>
                      <Progress value={userSkill.proficiency === 'EXPERT' ? 100 : userSkill.proficiency === 'ADVANCED' ? 75 : userSkill.proficiency === 'INTERMEDIATE' ? 50 : 25} className="mt-2" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="recommendations" className="space-y-4">
          <Card className="mb-4">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Brain className="w-5 h-5 mr-2" />
                AI-Powered Career Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 items-center">
                <Select onValueChange={(value) => analyzeSkillGaps(value)}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Select target role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Data Analyst">Data Analyst</SelectItem>
                    <SelectItem value="Software Engineer">Software Engineer</SelectItem>
                    <SelectItem value="DevOps Engineer">DevOps Engineer</SelectItem>
                    <SelectItem value="UI/UX Designer">UI/UX Designer</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={() => analyzeSkillGaps()}>
                  <Zap className="w-4 h-4 mr-2" />
                  Analyze Gaps
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {skillGaps.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-gray-500 mb-4">Select a target role above to get AI-powered skill recommendations.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {skillGaps.map((gap) => (
                <Card key={gap.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{gap.skill.name}</span>
                      <Badge variant="outline">Priority: {gap.importance_score}%</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-3">{gap.recommendation_text}</p>
                    <div className="flex gap-2">
                      <Button size="sm">Learn Now</Button>
                      <Button size="sm" variant="outline">Find Courses</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}