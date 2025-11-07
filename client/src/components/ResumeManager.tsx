import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  FileText, 
  Upload, 
  Eye, 
  Download, 
  RefreshCw, 
  CheckCircle, 
  AlertCircle,
  Loader2 
} from 'lucide-react';
import ResumeUpload from './ResumeUpload';

interface ResumeManagerProps {
  userId: string;
  hasResume: boolean;
  isEditing: boolean;
  onResumeUpdate: () => void;
}

interface ParsedData {
  name?: string;
  email?: string;
  phone?: string;
  university?: string;
  degree?: string;
  field_of_study?: string;
  year_of_passout?: string;
  skills?: string[];
}

export default function ResumeManager({ userId, hasResume, isEditing, onResumeUpdate }: ResumeManagerProps) {
  const [parsing, setParsing] = useState(false);
  const [parsedData, setParsedData] = useState<ParsedData | null>(null);
  const [showParsedData, setShowParsedData] = useState(false);
  const { toast } = useToast();

  const handleViewResume = () => {
    window.open(`http://localhost:8000/api/profile/${userId}/resume/`, '_blank');
  };

  const handleDownloadResume = () => {
    const link = document.createElement('a');
    link.href = `http://localhost:8000/api/profile/${userId}/resume/`;
    link.download = 'resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleParseResume = async () => {
    setParsing(true);
    try {
      // First get the resume file
      const resumeResponse = await fetch(`http://localhost:8000/api/profile/${userId}/resume/`);
      if (!resumeResponse.ok) throw new Error('Failed to fetch resume');
      
      const resumeBlob = await resumeResponse.blob();
      const formData = new FormData();
      formData.append('file', resumeBlob, 'resume.pdf');
      
      // Parse the resume
      const parseResponse = await fetch('http://localhost:8000/api/resumes/upload/', {
        method: 'POST',
        body: formData,
      });
      
      if (!parseResponse.ok) throw new Error('Failed to parse resume');
      
      const parsed = await parseResponse.json();
      setParsedData(parsed);
      setShowParsedData(true);
      
      toast({
        title: "Resume Parsed",
        description: "Your resume has been analyzed successfully.",
      });
    } catch (error) {
      toast({
        title: "Parsing Failed",
        description: "Failed to parse resume. Please try again.",
        variant: "destructive"
      });
    } finally {
      setParsing(false);
    }
  };

  const handleApplyParsedData = async () => {
    if (!parsedData) return;
    
    try {
      // Update profile with parsed data
      const response = await fetch(`http://localhost:8000/api/profile/${userId}/update/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: parsedData.name,
          email: parsedData.email,
          phone: parsedData.phone,
          university: parsedData.university,
          degree: parsedData.degree,
          field_of_study: parsedData.field_of_study,
          year_of_passout: parsedData.year_of_passout,
        }),
      });
      
      if (!response.ok) throw new Error('Failed to update profile');
      
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated with resume data.",
      });
      
      setShowParsedData(false);
      onResumeUpdate();
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update profile. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (!hasResume) {
    return (
      <div className="space-y-6">
        <div className="text-center p-8">
          <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground mb-4">No resume uploaded yet</p>
          <p className="text-sm text-muted-foreground">
            Upload your resume to showcase your skills and experience
          </p>
        </div>
        
        {isEditing && (
          <ResumeUpload userId={userId} onUploadSuccess={onResumeUpdate} />
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Resume Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <FileText className="w-5 h-5 text-indigo-600" />
          <span className="font-medium">Resume.pdf</span>
          <Badge variant="outline" className="text-xs">
            <CheckCircle className="w-3 h-3 mr-1" />
            Uploaded
          </Badge>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={handleViewResume}>
            <Eye className="w-4 h-4 mr-2" />
            View
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownloadResume}>
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleParseResume}
            disabled={parsing}
          >
            {parsing ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4 mr-2" />
            )}
            Parse
          </Button>
          {isEditing && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowBuilder(true)}
            >
              <FileText className="w-4 h-4 mr-2" />
              Builder
            </Button>
          )}
        </div>
      </div>

      {/* PDF Preview */}
      <div className="border rounded-lg overflow-hidden">
        <iframe
          src={`http://localhost:8000/api/profile/${userId}/resume/`}
          className="w-full h-96"
          title="Resume Preview"
        />
      </div>

      {/* Parsed Data Display */}
      {showParsedData && parsedData && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-blue-600" />
              <span>Parsed Resume Data</span>
            </CardTitle>
            <CardDescription>
              Review the extracted information and apply it to your profile
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {parsedData.name && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Name</label>
                  <p className="text-sm bg-white p-2 rounded border">{parsedData.name}</p>
                </div>
              )}
              {parsedData.email && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Email</label>
                  <p className="text-sm bg-white p-2 rounded border">{parsedData.email}</p>
                </div>
              )}
              {parsedData.phone && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Phone</label>
                  <p className="text-sm bg-white p-2 rounded border">{parsedData.phone}</p>
                </div>
              )}
              {parsedData.university && (
                <div>
                  <label className="text-sm font-medium text-gray-700">University</label>
                  <p className="text-sm bg-white p-2 rounded border">{parsedData.university}</p>
                </div>
              )}
              {parsedData.degree && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Degree</label>
                  <p className="text-sm bg-white p-2 rounded border">{parsedData.degree}</p>
                </div>
              )}
              {parsedData.year_of_passout && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Graduation Year</label>
                  <p className="text-sm bg-white p-2 rounded border">{parsedData.year_of_passout}</p>
                </div>
              )}
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowParsedData(false)}>
                Cancel
              </Button>
              <Button onClick={handleApplyParsedData}>
                Apply to Profile
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upload new resume when editing */}
      {isEditing && (
        <div className="p-4 border-t">
          <h4 className="text-sm font-medium mb-3">Update Resume</h4>
          <ResumeUpload userId={userId} onUploadSuccess={onResumeUpdate} />
        </div>
      )}
    </div>
  );
}