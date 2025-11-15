import axios from "axios";

const baseURL = "http://localhost:8000"; // Django backend

export const api = axios.create({ baseURL });

// Add response interceptor for error logging
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    return Promise.reject(error);
  }
);

// Role-based headers (if you still want to simulate roles)
export const withRole = (
  role: "employer" | "admin" | "student" | "alumni",
  userId = 1
) => ({
  headers: { "X-User-Role": role, "X-User-Id": String(userId) },
});

// ---- Jobs
export type JobPayload = {
  job_title: string;
  department?: string;
  job_type?: "full-time" | "part-time" | "contract" | "internship";
  location: string;
  salary?: string;
  remote?: "on-site" | "remote" | "hybrid";
  role_overview?: string;
  requirements?: string;
  qualifications?: string;
  status?: "draft" | "pending" | "approved" | "rejected";
  is_active?: boolean;
};

// ✅ Create a new job
export const createJob = (payload: JobPayload) =>
  api.post("/api/jobs/", payload);

// ✅ Update a job
export const updateJob = (id: number, payload: Partial<JobPayload>) =>
  api.put(`/api/jobs/${id}/`, payload, withRole("employer"));

// ✅ List all jobs (employer/admin/student can all hit this for now)
export const listJobs = () => api.get("/api/jobs/");

// ---- Resumes
// ✅ Upload resume
export const uploadResume = (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  return api.post("/api/resumes/upload/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

// Connection Requests
export type ConnectionRequestPayload = {
  student_id: number;
  mentor_id: number;
  message?: string;
};

export const createConnectionRequest = (payload: ConnectionRequestPayload) =>
  api.post("/api/simple-connection-request/", payload);

// List student's connections
export const listStudentConnections = (studentId: number) =>
  api.get(`/api/student/connections/?student_id=${studentId}`);

// List mentor's requests (for mentor dashboard)
export const listMentorRequests = (mentorId: number) =>
  api.get(`/api/mentor/requests/?mentor_id=${mentorId}`);

// Update request status (for mentor)
export const updateRequestStatus = (id: number, status: 'accepted' | 'rejected') =>
  api.patch(`/api/connection-requests/${id}/`, { status });

// Get connection status between student and mentor
export const getConnectionStatus = (studentId: number, mentorId: number) =>
  api.get(`/api/connection-status/?student_id=${studentId}&mentor_id=${mentorId}`);

// Chat Messages
export type MessagePayload = {
  content: string;
  sender_type: 'student' | 'mentor';
  sender_id: number;
  receiver_id: number;
};

export const sendMessage = (payload: MessagePayload) =>
  api.post("/api/messages/", payload);

export const listMessages = (senderId: number, receiverId: number) =>
  api.get(`/api/messages/list/?sender_id=${senderId}&receiver_id=${receiverId}`);

export const getConversation = (studentId: number, mentorId: number) =>
  api.get(`/api/conversations/?student_id=${studentId}&mentor_id=${mentorId}`);

// WebSocket helpers
export const createChatWebSocket = (senderId: number, receiverId: number, onMessage: (message: any) => void) => {
  const ws = new WebSocket(`ws://localhost:8000/ws/chat/${senderId}/${receiverId}/`);
  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.message) {
      onMessage(data.message);
    }
  };
  return ws;
};

export const createStatusWebSocket = (connectionId: number, onStatusUpdate: (statusData: any) => void) => {
  const ws = new WebSocket(`ws://localhost:8000/ws/status/${connectionId}/`);
  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.status_update) {
      onStatusUpdate(data.status_update);
    }
  };
  return ws;
};

// Mentors
export const getMentors = () => api.get("/api/mentors");

// Get accepted mentees for mentor
export const getAcceptedMentees = (mentorId: number) =>
  api.get(`/api/mentor/mentees/?mentor_id=${mentorId}`);

// Booking Sessions
export type BookSessionPayload = {
  student_id: number;
  mentor_id: number;
  topic: string;
  preferred_date_time: string;
  message?: string;
};

export const bookSession = (payload: BookSessionPayload) =>
  api.post("/api/book-session/", payload);

export const getMentorBookingRequests = (mentorId: number) =>
  api.get(`/api/mentor/booking-requests/?mentor_id=${mentorId}`);

export const acceptBooking = (bookingId: number) =>
  api.patch(`/api/booking-status/${bookingId}/`, { status: 'accepted' });

export const rejectBooking = (bookingId: number) =>
  api.patch(`/api/booking-status/${bookingId}/`, { status: 'rejected' });

export const getAcceptedBookings = (mentorId: number) =>
  api.get(`/api/accepted-bookings/?mentor_id=${mentorId}`);

export const submitFeedback = (payload: { student_id: number; mentor_id: number; ratings: number; feedback: string }) =>
  api.post("/api/submit-feedback/", payload);

export const submitMentorFeedback = (payload: { mentor_id: number; student_id: number; mentor_ratings: number; mentor_feedback: string }) =>
  api.post("/api/submit-mentor-feedback/", payload);

export const getMentorSessions = (mentorId: number) =>
  api.get(`/api/mentor/sessions/?mentor_id=${mentorId}`);

export const scheduleSession = (bookingId: number, payload: any) =>
  api.patch(`/api/schedule-session/${bookingId}/`, payload);

export const getStudentSessions = async (studentId: number) => {
  const response = await api.get(`/api/student/sessions/?student_id=${studentId}`);
  return response;
};

export const getMentorFeedback = (mentorId: number) =>
  api.get(`/api/mentor/feedback/?mentor_id=${mentorId}`);

export const respondToFeedback = (feedbackId: number, response: string) =>
  api.post(`/api/feedback/${feedbackId}/respond/`, { response });

// Profile APIs
export const getUserProfile = (userId: number) =>
  api.get(`/api/profile/${userId}/`);

export const updateUserProfile = (userId: number, profileData: any) =>
  api.put(`/api/profile/${userId}/update/`, profileData, {
    headers: { 'Content-Type': 'application/json' }
  });

// Get comprehensive profile data with statistics
export const getProfileData = (userId: number) =>
  api.get(`/api/profile/${userId}/data/`);

// Get all available skills
export const getAllSkills = () =>
  api.get('/api/skills/all/');

// Skills management
export type SkillPayload = {
  name: string;
  category?: string;
  proficiency?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
  years_of_experience?: number;
  is_certified?: boolean;
};

export const addUserSkill = (userId: number, skillData: { name: string; proficiency?: string }) =>
  api.post(`/api/profile/${userId}/add-skill/`, skillData);

export const removeUserSkill = (userId: number, skillId: number) =>
  api.delete(`/api/profile/${userId}/skills/${skillId}/`);

export const updateUserSkill = (userId: number, skillId: number, skill: Partial<SkillPayload>) =>
  api.put(`/api/profile/${userId}/skills/${skillId}/`, skill);

// Get skill recommendations
export const getSkillRecommendations = (userId: number) =>
  api.get(`/api/profile/${userId}/skill-recommendations/`);

// Course APIs
export const getCourses = (params?: { category?: string; level?: string; search?: string }) => {
  const searchParams = new URLSearchParams();
  if (params?.category) searchParams.append('category', params.category);
  if (params?.level) searchParams.append('level', params.level);
  if (params?.search) searchParams.append('search', params.search);
  return api.get(`/api/courses/api/courses/?${searchParams.toString()}`);
};

export const getUserCourses = (userId?: number) => {
  const params = userId ? `?user_id=${userId}` : '';
  return api.get(`/api/courses/api/user-courses/${params}`);
};

export const enrollCourse = (courseId: number, userId?: number) => {
  const payload = userId ? { course_id: courseId, user_id: userId } : { course_id: courseId };
  return api.post('/api/courses/api/user-courses/enroll/', payload);
};

export const getCourseRecommendations = (userId?: number) => {
  const params = userId ? `?user_id=${userId}` : '';
  return api.get(`/api/courses/api/recommendations/${params}`);
};

export const generateCourseRecommendations = (userId?: number) => {
  const payload = userId ? { user_id: userId } : {};
  return api.post('/api/courses/api/recommendations/generate_recommendations/', payload);
};

// Job Recommendation APIs
export const getJobs = (params?: { job_type?: string; location?: string; experience_level?: string; is_remote?: boolean; search?: string }) => {
  const searchParams = new URLSearchParams();
  if (params?.job_type) searchParams.append('job_type', params.job_type);
  if (params?.location) searchParams.append('location', params.location);
  if (params?.experience_level) searchParams.append('experience_level', params.experience_level);
  if (params?.is_remote !== undefined) searchParams.append('is_remote', params.is_remote.toString());
  if (params?.search) searchParams.append('search', params.search);
  return api.get(`/api/jobs/api/jobs/?${searchParams.toString()}`);
};

export const getJobRecommendations = (userId: number) =>
  api.get(`/api/jobs/api/jobs/recommendations/?user_id=${userId}`);

export const applyToJob = (jobId: number, userId: number, coverLetter?: string) =>
  api.post(`/api/jobs/api/jobs/${jobId}/apply/`, { user_id: userId, cover_letter: coverLetter });

export const getUserJobApplications = (userId: number) =>
  api.get(`/api/jobs/api/applications/?user_id=${userId}`);

export const getUserJobMatches = (userId: number) =>
  api.get(`/api/jobs/api/matches/?user_id=${userId}`);

// ATS System APIs
export const analyzeResume = (jobDescription: string, resumeText: string) =>
  api.post('/api/ats/api/analysis/analyze_resume/', {
    job_description: jobDescription,
    resume_text: resumeText
  });

export const getATSAnalysisHistory = () =>
  api.get('/api/ats/api/analysis/');

export const uploadResumeForATS = (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  return api.post('/api/ats/api/resume-files/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};

export const calculateATSScore = (resumeId: number) =>
  api.post(`/api/ats/api/resume-files/${resumeId}/calculate_ats_score/`);

// Learning System APIs
export const getLearningCourses = (params?: { category?: string; difficulty?: string; search?: string }) => {
  const searchParams = new URLSearchParams();
  if (params?.category) searchParams.append('category', params.category);
  if (params?.difficulty) searchParams.append('difficulty', params.difficulty);
  if (params?.search) searchParams.append('search', params.search);
  return api.get(`/api/learning/api/courses/?${searchParams.toString()}`);
};

export const getLearningCourseRecommendations = () =>
  api.get('/api/learning/api/courses/recommendations/');

export const enrollInLearningCourse = (courseId: number) =>
  api.post(`/api/learning/api/courses/${courseId}/enroll/`);

export const getUserEnrollments = () =>
  api.get('/api/learning/api/enrollments/');

export const markModuleCompleted = (moduleId: number) =>
  api.post(`/api/learning/api/modules/${moduleId}/mark_completed/`);

export const getUserCertificates = () =>
  api.get('/api/learning/api/certificates/');

// Skill Tokenisation APIs
export const getUserSkillTokens = (userId: number) =>
  api.get(`/api/skills/api/skill-tokens/?user_id=${userId}`);

export const getUserSkillGaps = (userId: number) =>
  api.get(`/api/skills/api/skill-gaps/?user_id=${userId}`);

export const getUserSkillRecommendations = (userId: number) =>
  api.get(`/api/skills/api/upgrade-recommendations/?user_id=${userId}`);

export const analyzeSkillGaps = (userId: number, targetRole?: string) =>
  api.post('/api/skills/api/skill-gaps/analyze_gaps/', { user_id: userId, target_role: targetRole });

export const verifySkillToken = (tokenId: string) =>
  api.get(`/api/skills/api/skill-tokens/${tokenId}/verify_token/`);

// Project Ideas APIs
export type ProjectIdeaPayload = {
  user_id: number;
  project_title: string;
  description: string;
  estimated_time?: string;
  difficulty_level?: string;
  skills_involved?: string;
  category?: string;
};

export type SendProjectToMentorPayload = {
  mentor_id: number;
  student_id: number;
  literature_review_date?: string;
  prototype_demo_date?: string;
  mentor_review_notes?: string;
};

export const submitProjectIdea = (payload: ProjectIdeaPayload) =>
  api.post('/api/project-ideas/submit/', payload);

export const getProjectIdeas = (userId: number) =>
  api.get(`/api/project-ideas/?user_id=${userId}&_t=${Date.now()}`);

export const updateProjectIdea = (projectId: number, payload: Partial<ProjectIdeaPayload>) =>
  api.put(`/api/project-ideas/${projectId}/update/`, payload);

export const deleteProjectIdea = (projectId: number, userId: number) =>
  api.delete(`/api/project-ideas/${projectId}/delete/`, { data: { user_id: userId } });

export const sendProjectToMentor = (projectId: number, payload: SendProjectToMentorPayload) =>
  api.post(`/api/project-ideas/${projectId}/send-to-mentor/`, payload);

// Mentor Project Ideas APIs
export const getMentorProjectIdeas = (mentorId: number) =>
  api.get(`/api/mentor/project-ideas/?mentor_id=${mentorId}&_t=${Date.now()}`);

export const updateProjectStatus = (projectId: number, payload: { mentor_id: number; action: 'approve' | 'reject' | 'review'; literature_review_date?: string; prototype_demo_date?: string; mentor_review_notes?: string }) =>
  api.patch(`/api/project-ideas/${projectId}/status/`, payload);

export const getMentorNotifications = (mentorId: number) =>
  api.get(`/api/mentor/notifications/?mentor_id=${mentorId}&_t=${Date.now()}`);

// Project Upload APIs
export type ProjectUploadPayload = {
  user_id: number;
  title: string;
  description: string;
  category: string;
  technologies: string;
  github_url: string;
  live_url?: string;
  additional_notes?: string;
};

export const uploadProject = (payload: ProjectUploadPayload) =>
  api.post('/api/projects/upload/', payload);

export const getUploadedProjects = (userId: number) =>
  api.get(`/api/projects/uploaded/?user_id=${userId}&_t=${Date.now()}`);

export const submitProjectFeedback = (projectId: number, payload: { mentor_id: number; feedback: string; rating?: number }) =>
  api.post(`/api/projects/${projectId}/feedback/`, payload);


