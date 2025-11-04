from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

# Simple URL patterns for Learning system
urlpatterns = [
    path('api/courses/', views.course_list, name='course-list'),
    path('api/courses/recommendations/', views.course_recommendations, name='course-recommendations'),
    path('api/courses/<int:pk>/enroll/', views.enroll_course, name='enroll-course'),
    path('api/enrollments/', views.user_enrollments, name='user-enrollments'),
    path('api/modules/<int:pk>/mark_completed/', views.mark_module_completed, name='mark-module-completed'),
    path('api/certificates/', views.user_certificates, name='user-certificates'),
]