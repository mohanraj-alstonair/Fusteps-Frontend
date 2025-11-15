import { useState, useEffect } from "react";
import { getJobRecommendations, applyToJob } from "@/lib/api";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { MapPin, DollarSign, Clock, Users, Star, Briefcase } from "lucide-react";

export default function StudentJobsPage() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [jobRecommendations, setJobRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchJobRecommendations = async () => {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) return;

      const response = await getJobRecommendations(parseInt(userId));
      setJobRecommendations(response.data.recommendations || []);
    } catch (error) {
      console.error('Error fetching job recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyToJob = async (jobId: number) => {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        toast({ title: "Error", description: "Please log in to apply", variant: "destructive" });
        return;
      }

      await applyToJob(jobId, parseInt(userId), "I am interested in this position.");
      toast({ title: "Success", description: "Application submitted successfully!" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to apply to job", variant: "destructive" });
    }
  };

  useEffect(() => {
    if (user || localStorage.getItem('userId')) {
      fetchJobRecommendations();
    }
  }, [user]);

  if (!user && !localStorage.getItem('userId')) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please Log In</h2>
          <p className="text-gray-600 mb-6">You need to be logged in to view job recommendations.</p>
          <Button onClick={() => window.location.href = '/login'} className="bg-blue-600 hover:bg-blue-700">
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  if (loading) {
    return <div className="text-center py-8">Loading job recommendations...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Job Recommendations</h1>
          <p className="text-gray-600 mt-1">
            Personalized job matches based on your skills and profile
          </p>
        </div>
      </div>

      {jobRecommendations.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Job Recommendations</h3>
            <p className="text-gray-600 mb-4">
              Add more skills to your profile to get personalized job recommendations
            </p>
            <Button onClick={() => window.location.href = '/student/skills'}>
              Add Skills
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {jobRecommendations.map((job: any) => (
            <Card key={job.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl text-gray-900">{job.title}</CardTitle>
                    <p className="text-lg text-gray-600 mt-1">{job.company_name}</p>
                  </div>
                  <div className="text-right">
                    <Badge 
                      variant="secondary" 
                      className={
                        job.match_score >= 80 ? "bg-green-100 text-green-800" :
                        job.match_score >= 60 ? "bg-yellow-100 text-yellow-800" :
                        "bg-red-100 text-red-800"
                      }
                    >
                      {job.match_score}% Match
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">{job.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-2" />
                    {job.location} {job.is_remote && "(Remote)"}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <DollarSign className="w-4 h-4 mr-2" />
                    ${job.salary_min} - ${job.salary_max}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="w-4 h-4 mr-2" />
                    {job.job_type.replace('_', ' ')}
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">Your Matching Skills:</h4>
                  <div className="flex flex-wrap gap-2">
                    {job.matching_skills.map((skill: string, index: number) => (
                      <Badge key={index} variant="secondary" className="bg-green-100 text-green-800">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                {job.missing_skills.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 mb-2">Skills to Learn:</h4>
                    <div className="flex flex-wrap gap-2">
                      {job.missing_skills.map((skill: string, index: number) => (
                        <Badge key={index} variant="outline" className="border-orange-300 text-orange-700">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-600">
                    <Badge variant="outline">{job.experience_level}</Badge>
                  </div>
                  <Button 
                    onClick={() => handleApplyToJob(job.id)}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Apply Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}