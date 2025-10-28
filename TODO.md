# TODO: Modify Mentor Feedback in Mentees Tab

## Tasks
- [x] Add mentorFeedbacks state (Record<string, { rating: number; review: string }>)
- [x] Fetch mentor feedbacks on mount using getMentorFeedback API
- [x] Modify openFeedbackModal to set isViewMode based on existing feedback
- [x] Add isViewMode state to feedback modal
- [x] Update feedback modal UI for view/edit modes
- [x] Update submitFeedback to update mentorFeedbacks state after submission
- [x] Test view/edit functionality
