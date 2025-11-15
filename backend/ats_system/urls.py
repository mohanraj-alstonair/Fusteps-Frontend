from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

# Simple URL patterns for ATS system
urlpatterns = [
    path('api/analysis/', views.ats_analysis_list, name='ats-analysis-list'),
    path('api/analysis/analyze_resume/', views.analyze_resume, name='analyze-resume'),
    path('api/resume-files/', views.resume_file_list, name='resume-file-list'),
    path('api/resume-files/<int:pk>/calculate_ats_score/', views.calculate_ats_score, name='calculate-ats-score'),
]