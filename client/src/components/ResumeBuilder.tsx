import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { 
  FileText, 
  Download, 
  Plus, 
  X, 
  Eye
} from 'lucide-react';

interface ResumeBuilderProps {
  profileData: any;
  onResumeGenerated: () => void;
}

interface ResumeData {
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    location: string;
    summary: string;
  };
  education: {
    degree: string;
    university: string;
    year: string;
    gpa: string;
  };
  skills: string[];
  experience: Array<{
    title: string;
    company: string;
    duration: string;
    description: string;
  }>;
  projects: Array<{
    name: string;
    description: string;
    technologies: string;
  }>;
}

export default function ResumeBuilder({ profileData, onResumeGenerated }: ResumeBuilderProps) {
  const [resumeData, setResumeData] = useState<ResumeData>({
    personalInfo: {
      name: `${profileData?.personal?.firstName || ''} ${profileData?.personal?.lastName || ''}`.trim(),
      email: profileData?.personal?.email || '',
      phone: profileData?.personal?.phone || '',
      location: profileData?.personal?.location || '',
      summary: ''
    },
    education: {
      degree: profileData?.academic?.program || '',
      university: profileData?.academic?.university || '',
      year: profileData?.academic?.year || '',
      gpa: profileData?.academic?.gpa || ''
    },
    skills: profileData?.skills || [],
    experience: [],
    projects: []
  });

  const [showPreview, setShowPreview] = useState(false);
  const [generating, setGenerating] = useState(false);
  const { toast } = useToast();

  const addExperience = () => {
    setResumeData(prev => ({
      ...prev,
      experience: [...prev.experience, { title: '', company: '', duration: '', description: '' }]
    }));
  };

  const removeExperience = (index: number) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index)
    }));
  };

  const updateExperience = (index: number, field: string, value: string) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.map((exp, i) => 
        i === index ? { ...exp, [field]: value } : exp
      )
    }));
  };

  const addProject = () => {
    setResumeData(prev => ({
      ...prev,
      projects: [...prev.projects, { name: '', description: '', technologies: '' }]
    }));
  };

  const removeProject = (index: number) => {
    setResumeData(prev => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index)
    }));
  };

  const updateProject = (index: number, field: string, value: string) => {
    setResumeData(prev => ({
      ...prev,
      projects: prev.projects.map((proj, i) => 
        i === index ? { ...proj, [field]: value } : proj
      )
    }));
  };

  const generateResume = async () => {
    setGenerating(true);
    try {
      // Generate HTML resume
      const htmlContent = generateHTMLResume(resumeData);
      
      // Convert to PDF (in a real app, you'd use a service like Puppeteer or jsPDF)
      // For now, we'll create a simple HTML file and let the user download it
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `${resumeData.personalInfo.name.replace(/\s+/g, '_')}_Resume.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "Resume Generated",
        description: "Your resume has been generated and downloaded.",
      });

      onResumeGenerated();
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Failed to generate resume. Please try again.",
        variant: "destructive"
      });
    } finally {
      setGenerating(false);
    }
  };

  const generateHTMLResume = (data: ResumeData): string => {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.personalInfo.name} - Resume</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; margin: 0; padding: 20px; color: #333; }
        .container { max-width: 800px; margin: 0 auto; }
        .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
        .header h1 { margin: 0; font-size: 2.5em; color: #2c3e50; }
        .contact-info { margin: 10px 0; }
        .section { margin-bottom: 30px; }
        .section h2 { color: #2c3e50; border-bottom: 1px solid #bdc3c7; padding-bottom: 5px; }
        .skills { display: flex; flex-wrap: wrap; gap: 10px; }
        .skill { background: #3498db; color: white; padding: 5px 10px; border-radius: 15px; font-size: 0.9em; }
        .experience-item, .project-item { margin-bottom: 20px; }
        .experience-item h3, .project-item h3 { margin: 0; color: #2c3e50; }
        .experience-meta { color: #7f8c8d; font-style: italic; }
        @media print { body { padding: 0; } }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>${data.personalInfo.name}</h1>
            <div class="contact-info">
                ${data.personalInfo.email} | ${data.personalInfo.phone} | ${data.personalInfo.location}
            </div>
        </div>

        ${data.personalInfo.summary ? `
        <div class="section">
            <h2>Professional Summary</h2>
            <p>${data.personalInfo.summary}</p>
        </div>
        ` : ''}

        <div class="section">
            <h2>Education</h2>
            <div class="experience-item">
                <h3>${data.education.degree}</h3>
                <div class="experience-meta">${data.education.university} | ${data.education.year}</div>
                ${data.education.gpa ? `<p>GPA: ${data.education.gpa}</p>` : ''}
            </div>
        </div>

        ${data.skills.length > 0 ? `
        <div class="section">
            <h2>Skills</h2>
            <div class="skills">
                ${data.skills.map(skill => `<span class="skill">${skill}</span>`).join('')}
            </div>
        </div>
        ` : ''}

        ${data.experience.length > 0 ? `
        <div class="section">
            <h2>Experience</h2>
            ${data.experience.map(exp => `
                <div class="experience-item">
                    <h3>${exp.title}</h3>
                    <div class="experience-meta">${exp.company} | ${exp.duration}</div>
                    <p>${exp.description}</p>
                </div>
            `).join('')}
        </div>
        ` : ''}

        ${data.projects.length > 0 ? `
        <div class="section">
            <h2>Projects</h2>
            ${data.projects.map(proj => `
                <div class="project-item">
                    <h3>${proj.name}</h3>
                    <p>${proj.description}</p>
                    ${proj.technologies ? `<p><strong>Technologies:</strong> ${proj.technologies}</p>` : ''}
                </div>
            `).join('')}
        </div>
        ` : ''}
    </div>
</body>
</html>
    `;
  };

  if (showPreview) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Resume Preview</h3>
          <div className="space-x-2">
            <Button variant="outline" onClick={() => setShowPreview(false)}>
              <X className="w-4 h-4 mr-2" />
              Close
            </Button>
            <Button onClick={generateResume} disabled={generating}>
              {generating ? (
                <>Generating...</>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </>
              )}
            </Button>
          </div>
        </div>
        
        <div 
          className="border rounded-lg p-6 bg-white"
          dangerouslySetInnerHTML={{ __html: generateHTMLResume(resumeData) }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="w-5 h-5" />
            <span>Build Your Resume</span>
          </CardTitle>
          <CardDescription>
            Create a professional resume using your profile information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Personal Information */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Full Name</Label>
                <Input
                  value={resumeData.personalInfo.name}
                  onChange={(e) => setResumeData(prev => ({
                    ...prev,
                    personalInfo: { ...prev.personalInfo, name: e.target.value }
                  }))}
                />
              </div>
              <div>
                <Label>Email</Label>
                <Input
                  value={resumeData.personalInfo.email}
                  onChange={(e) => setResumeData(prev => ({
                    ...prev,
                    personalInfo: { ...prev.personalInfo, email: e.target.value }
                  }))}
                />
              </div>
              <div>
                <Label>Phone</Label>
                <Input
                  value={resumeData.personalInfo.phone}
                  onChange={(e) => setResumeData(prev => ({
                    ...prev,
                    personalInfo: { ...prev.personalInfo, phone: e.target.value }
                  }))}
                />
              </div>
              <div>
                <Label>Location</Label>
                <Input
                  value={resumeData.personalInfo.location}
                  onChange={(e) => setResumeData(prev => ({
                    ...prev,
                    personalInfo: { ...prev.personalInfo, location: e.target.value }
                  }))}
                />
              </div>
            </div>
            <div className="mt-4">
              <Label>Professional Summary</Label>
              <Textarea
                placeholder="Brief summary of your professional background and goals..."
                value={resumeData.personalInfo.summary}
                onChange={(e) => setResumeData(prev => ({
                  ...prev,
                  personalInfo: { ...prev.personalInfo, summary: e.target.value }
                }))}
              />
            </div>
          </div>

          {/* Experience */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold">Experience</h3>
              <Button variant="outline" size="sm" onClick={addExperience}>
                <Plus className="w-4 h-4 mr-2" />
                Add Experience
              </Button>
            </div>
            {resumeData.experience.map((exp, index) => (
              <Card key={index} className="mb-4">
                <CardContent className="pt-4">
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="font-medium">Experience {index + 1}</h4>
                    <Button variant="ghost" size="sm" onClick={() => removeExperience(index)}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Job Title</Label>
                      <Input
                        value={exp.title}
                        onChange={(e) => updateExperience(index, 'title', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Company</Label>
                      <Input
                        value={exp.company}
                        onChange={(e) => updateExperience(index, 'company', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Duration</Label>
                      <Input
                        placeholder="e.g., Jan 2023 - Present"
                        value={exp.duration}
                        onChange={(e) => updateExperience(index, 'duration', e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <Label>Description</Label>
                    <Textarea
                      placeholder="Describe your responsibilities and achievements..."
                      value={exp.description}
                      onChange={(e) => updateExperience(index, 'description', e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Projects */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold">Projects</h3>
              <Button variant="outline" size="sm" onClick={addProject}>
                <Plus className="w-4 h-4 mr-2" />
                Add Project
              </Button>
            </div>
            {resumeData.projects.map((proj, index) => (
              <Card key={index} className="mb-4">
                <CardContent className="pt-4">
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="font-medium">Project {index + 1}</h4>
                    <Button variant="ghost" size="sm" onClick={() => removeProject(index)}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label>Project Name</Label>
                      <Input
                        value={proj.name}
                        onChange={(e) => updateProject(index, 'name', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Description</Label>
                      <Textarea
                        placeholder="Describe the project and your role..."
                        value={proj.description}
                        onChange={(e) => updateProject(index, 'description', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Technologies Used</Label>
                      <Input
                        placeholder="e.g., React, Node.js, MongoDB"
                        value={proj.technologies}
                        onChange={(e) => updateProject(index, 'technologies', e.target.value)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setShowPreview(true)}>
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
            <Button onClick={generateResume} disabled={generating}>
              {generating ? (
                <>Generating...</>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Generate Resume
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}