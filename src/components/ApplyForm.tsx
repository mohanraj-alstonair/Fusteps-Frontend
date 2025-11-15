import { useState } from "react";
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FileText, Upload, X, Send, User } from "lucide-react";
import { toast } from "@/lib/toast";
import { api } from "@/lib/api";

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  university: string;
  major: string;
  gpa: string;
  coverLetter: string;
}

interface ApplyFormProps {
  isOpen: boolean;
  onClose: () => void;
  jobTitle?: string;
}

export default function ApplyForm({ isOpen, onClose, jobTitle = "Job" }: ApplyFormProps) {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const { register, setValue, handleSubmit, reset } = useForm<FormData>({
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      university: '',
      major: '',
      gpa: '',
      coverLetter: '',
    },
  });

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.pdf')) {
      toast({ title: 'Unsupported file type', description: 'Please upload a PDF.' });
      return;
    }

    setResumeFile(file);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await api.post("/api/resumes/parse/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const data = response.data;

      // Auto-fill fields
      setValue("fullName", data.name || "");
      setValue("email", data.email || "");
      setValue("phone", data.phone || "");
      setValue("university", data.university || "");
      setValue("major", data.major || "");
      setValue("gpa", data.gpa || "");

      console.log("Extracted data:", data);
      toast({ title: 'Resume uploaded and parsed successfully!' });
    } catch (error) {
      console.error("Backend FAILED:", error);
      toast({ title: 'Error', description: 'Failed to connect to server. Ensure it’s running at http://127.0.0.1:5001' });
    }
  };

  const submitApplication = (data: FormData) => {
    if (resumeFile) {
      console.log("Form submitted:", { ...data, resumeFile });
      onClose();
      setResumeFile(null);
      reset();
      toast({ title: 'Application submitted successfully!' });
    } else {
      toast({ title: 'Error', description: 'Please upload a resume.' });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Send className="w-5 h-5 text-blue-600" />
            <span>Apply for {jobTitle}</span>
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(submitApplication)} className="space-y-6">
          {/* Profile Details */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900 flex items-center">
              <User className="w-4 h-4 mr-2" />
              Your Profile
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Full Name</Label>
                  <Input {...register("fullName")} className="bg-gray-50" />
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Email</Label>
                  <Input {...register("email")} className="bg-gray-50" />
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Phone</Label>
                  <Input {...register("phone")} className="bg-gray-50" />
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <Label className="text-sm font-medium text-gray-700">University</Label>
                  <Input {...register("university")} className="bg-gray-50" />
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Major</Label>
                  <Input {...register("major")} className="bg-gray-50" />
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">GPA</Label>
                  <Input {...register("gpa")} className="bg-gray-50" />
                </div>
              </div>
            </div>
          </div>

          {/* Resume Upload */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900 flex items-center">
              <FileText className="w-4 h-4 mr-2" />
              Resume
            </h4>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
              {resumeFile ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <FileText className="w-8 h-8 text-blue-600" />
                    <div>
                      <p className="font-medium text-gray-900">{resumeFile.name}</p>
                      <p className="text-sm text-gray-500">{(resumeFile.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setResumeFile(null)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <div className="text-center">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <div className="space-y-2">
                    <p className="text-gray-600">Upload your resume</p>
                    <p className="text-sm text-gray-500">PDF up to 10MB</p>
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handleResumeUpload}
                      className="hidden"
                      id="resume-upload"
                    />
                    <Button
                      variant="outline"
                      onClick={() => document.getElementById('resume-upload')?.click()}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Choose File
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Cover Letter */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900">Cover Letter (Optional)</h4>
            <Textarea
              placeholder="Write a brief cover letter explaining why you're interested in this position..."
              {...register("coverLetter")}
              rows={4}
              className="resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={!resumeFile} className="flex-1 bg-fusteps-red hover:bg-red-600 text-white">
              <Send className="w-4 h-4 mr-2" /> Submit Application
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}