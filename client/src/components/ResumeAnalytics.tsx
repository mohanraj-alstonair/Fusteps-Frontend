import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  CheckCircle, 
  AlertCircle, 
  XCircle, 
  Target,
  Award,
  Users,
  Eye
} from 'lucide-react';

interface ResumeAnalyticsProps {
  userId: string;
  hasResume: boolean;
  profileData: any;
}

interface ResumeStrength {
  score: number;
  level: 'Poor' | 'Fair' | 'Good' | 'Excellent';
  color: string;
  suggestions: string[];
  completedSections: string[];
  missingSections: string[];
}

export default function ResumeAnalytics({ userId, hasResume, profileData }: ResumeAnalyticsProps) {
  const [resumeStrength, setResumeStrength] = useState<ResumeStrength | null>(null);
  const [viewCount, setViewCount] = useState(0);

  useEffect(() => {
    calculateResumeStrength();
    // Simulate view count (in real app, this would come from backend)
    setViewCount(Math.floor(Math.random() * 50) + 10);
  }, [profileData, hasResume]);

  const calculateResumeStrength = () => {
    let score = 0;
    const completedSections: string[] = [];
    const missingSections: string[] = [];
    const suggestions: string[] = [];

    // Basic Information (20 points)
    if (profileData?.personal?.firstName && profileData?.personal?.lastName) {
      score += 5;
      completedSections.push('Full Name');
    } else {
      missingSections.push('Full Name');
      suggestions.push('Add your complete name');
    }

    if (profileData?.personal?.email) {
      score += 5;
      completedSections.push('Email');
    } else {
      missingSections.push('Email');
      suggestions.push('Add your email address');
    }

    if (profileData?.personal?.phone) {
      score += 5;
      completedSections.push('Phone');
    } else {
      missingSections.push('Phone');
      suggestions.push('Add your phone number');
    }

    if (profileData?.personal?.location) {
      score += 5;
      completedSections.push('Location');
    } else {
      missingSections.push('Location');
      suggestions.push('Add your current location');
    }

    // Education (25 points)
    if (profileData?.academic?.university) {
      score += 8;
      completedSections.push('University');
    } else {
      missingSections.push('University');
      suggestions.push('Add your university/college');
    }

    if (profileData?.academic?.program) {
      score += 8;
      completedSections.push('Degree/Program');
    } else {
      missingSections.push('Degree/Program');
      suggestions.push('Add your degree or program');
    }

    if (profileData?.academic?.year) {
      score += 5;
      completedSections.push('Graduation Year');
    } else {
      missingSections.push('Graduation Year');
      suggestions.push('Add your graduation year');
    }

    if (profileData?.academic?.gpa) {
      score += 4;
      completedSections.push('GPA/Marks');
    } else {
      missingSections.push('GPA/Marks');
      suggestions.push('Add your GPA or percentage');
    }

    // Skills (25 points)
    if (profileData?.skills?.length > 0) {
      if (profileData.skills.length >= 5) {
        score += 25;
        completedSections.push('Skills (5+)');
      } else if (profileData.skills.length >= 3) {
        score += 15;
        completedSections.push('Skills (3+)');
        suggestions.push('Add more skills to strengthen your profile');
      } else {
        score += 8;
        completedSections.push('Skills (Basic)');
        suggestions.push('Add at least 5 relevant skills');
      }
    } else {
      missingSections.push('Skills');
      suggestions.push('Add your technical and soft skills');
    }

    // Resume Upload (20 points)
    if (hasResume) {
      score += 20;
      completedSections.push('Resume Upload');
    } else {
      missingSections.push('Resume Upload');
      suggestions.push('Upload your resume in PDF format');
    }

    // Social Links (10 points)
    let socialScore = 0;
    if (profileData?.social?.linkedin) socialScore += 5;
    if (profileData?.social?.github) socialScore += 3;
    if (profileData?.social?.portfolio) socialScore += 2;
    
    score += socialScore;
    if (socialScore > 0) {
      completedSections.push('Social Links');
    } else {
      missingSections.push('Social Links');
      suggestions.push('Add LinkedIn, GitHub, or portfolio links');
    }

    // Determine level and color
    let level: ResumeStrength['level'];
    let color: string;

    if (score >= 85) {
      level = 'Excellent';
      color = 'text-green-600';
    } else if (score >= 70) {
      level = 'Good';
      color = 'text-blue-600';
    } else if (score >= 50) {
      level = 'Fair';
      color = 'text-yellow-600';
    } else {
      level = 'Poor';
      color = 'text-red-600';
    }

    setResumeStrength({
      score,
      level,
      color,
      suggestions: suggestions.slice(0, 3), // Show top 3 suggestions
      completedSections,
      missingSections
    });
  };

  if (!resumeStrength) return null;

  return (
    <div className="space-y-6">
      {/* Resume Strength Card */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <span>Resume Strength</span>
          </CardTitle>
          <CardDescription>
            Your profile completeness and visibility score
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-2">
                <span className={`text-2xl font-bold ${resumeStrength.color}`}>
                  {resumeStrength.score}%
                </span>
                <Badge 
                  variant="outline" 
                  className={`${resumeStrength.color} border-current`}
                >
                  {resumeStrength.level}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Profile Completion Score
              </p>
            </div>
            <div className="text-right">
              <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                <Eye className="w-4 h-4" />
                <span>{viewCount} profile views</span>
              </div>
            </div>
          </div>
          
          <Progress value={resumeStrength.score} className="h-2" />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className="text-center p-3 bg-white rounded-lg border">
              <CheckCircle className="w-6 h-6 text-green-600 mx-auto mb-1" />
              <div className="text-sm font-medium">{resumeStrength.completedSections.length}</div>
              <div className="text-xs text-muted-foreground">Completed</div>
            </div>
            <div className="text-center p-3 bg-white rounded-lg border">
              <AlertCircle className="w-6 h-6 text-yellow-600 mx-auto mb-1" />
              <div className="text-sm font-medium">{resumeStrength.missingSections.length}</div>
              <div className="text-xs text-muted-foreground">Missing</div>
            </div>
            <div className="text-center p-3 bg-white rounded-lg border">
              <Target className="w-6 h-6 text-blue-600 mx-auto mb-1" />
              <div className="text-sm font-medium">{Math.max(0, 100 - resumeStrength.score)}%</div>
              <div className="text-xs text-muted-foreground">To Complete</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Suggestions Card */}
      {resumeStrength.suggestions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Award className="w-5 h-5 text-orange-600" />
              <span>Improve Your Profile</span>
            </CardTitle>
            <CardDescription>
              Complete these sections to increase your profile strength
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {resumeStrength.suggestions.map((suggestion, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-orange-50 rounded-lg border border-orange-200">
                  <AlertCircle className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-orange-800">{suggestion}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Profile Visibility Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-purple-600" />
            <span>Boost Your Visibility</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
              <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
              <span className="text-sm">Add a professional photo to increase profile views by 40%</span>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
              <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
              <span className="text-sm">Complete all sections to appear in more recruiter searches</span>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
              <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
              <span className="text-sm">Update your skills regularly to stay relevant</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}