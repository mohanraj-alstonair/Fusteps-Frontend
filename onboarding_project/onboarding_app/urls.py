from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.register, name='register'),
    path('signup/', views.register, name='signup'),
    path('login/', views.login, name='login'),
    path('forgot-password/', views.forgot_password, name='forgot_password'),
    path('mentors/', views.get_mentors, name='get_mentors'),
    path('resumes/upload/', views.upload_resume, name='upload_resume'),
    # Connection and Chat APIs
    path('student/connections/', views.list_student_connections, name='list_student_connections'),
    path('messages/', views.send_message, name='send_message'),
    path('messages/list/', views.list_messages, name='list_messages'),
    # Connection Request APIs
    path('connection-requests/', views.create_connection_request, name='create_connection_request'),
    path('simple-connection-request/', views.simple_connection_request, name='simple_connection_request'),
    path('mentor/requests/', views.list_mentor_requests, name='list_mentor_requests'),
    path('connection-requests/<int:request_id>/', views.update_request_status, name='update_request_status'),
    path('connection-status/', views.get_connection_status, name='get_connection_status'),
    path('test-mentor-requests/', views.test_mentor_requests, name='test_mentor_requests'),
    path('mentor-requests-fixed/', views.mentor_requests_fixed, name='mentor_requests_fixed'),
    path('mentor/mentees/', views.get_accepted_mentees, name='get_accepted_mentees'),
    # Conversation APIs
    path('conversations/', views.get_conversation, name='get_conversation'),
    path('conversations/list/', views.list_conversations, name='list_conversations'),
    # Booking Session APIs
    path('book-session/', views.book_session, name='book_session'),
    path('booking-status/<int:booking_id>/', views.update_booking_status, name='update_booking_status'),
    path('schedule-session/<int:booking_id>/', views.schedule_session, name='schedule_session'),
    path('student/sessions/', views.get_student_sessions, name='get_student_sessions'),
    path('mentor/sessions/', views.get_mentor_sessions, name='get_mentor_sessions'),
    path('mentor/booking-requests/', views.get_booking_requests, name='get_booking_requests'),
    path('accepted-bookings/', views.get_accepted_bookings, name='get_accepted_bookings'),
    path('submit-feedback/', views.submit_feedback, name='submit_feedback'),
    path('mentor/feedback/', views.get_mentor_feedback, name='get_mentor_feedback'),
    path('submit-mentor-feedback/', views.submit_mentor_feedback, name='submit_mentor_feedback'),
]
