from django.urls import path
from . import views
from . import skill_views

urlpatterns = [
    path('register/', views.register, name='register'),
    path('register/education/', views.register_education, name='register_education'),
    path('register/complete/', views.complete_profile, name='complete_profile'),
    path('signup/', views.register, name='signup'),
    path('login/', views.login, name='login'),
    path('forgot-password/', views.forgot_password, name='forgot_password'),
    path('onboarding/', views.onboarding, name='onboarding'),
    path('profile/<int:user_id>/', views.get_user_profile, name='get_user_profile'),
    path('profile/<int:user_id>/update/', views.update_user_profile, name='update_user_profile'),
    path('profile/<int:user_id>/data/', views.get_profile_data, name='get_profile_data'),
    path('profile/<int:user_id>/skill-recommendations/', views.get_skill_recommendations, name='get_skill_recommendations'),
    path('skills/all/', views.get_all_skills, name='get_all_skills'),
    path('mentors/', views.get_mentors, name='get_mentors'),
    path('resumes/upload/', views.upload_resume, name='upload_resume'),
    path('resumes/<int:user_id>/', views.get_resume, name='get_resume'),
    path('profile/<int:user_id>/resume/', views.get_resume, name='get_profile_resume'),
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
    path('profile/<int:user_id>/add-skill/', views.add_user_skill, name='add_user_skill'),
    # Skill Management APIs
    path('skills/manage/<int:user_id>/', skill_views.manage_skills, name='manage_skills'),
    path('skills/all/', skill_views.get_all_skills, name='get_all_skills_new'),
    path('skills/create-defaults/', skill_views.create_default_skills, name='create_default_skills'),
]
