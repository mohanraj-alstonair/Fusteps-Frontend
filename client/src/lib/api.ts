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
