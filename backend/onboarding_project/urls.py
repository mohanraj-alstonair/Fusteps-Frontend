from django.urls import path, include

urlpatterns = [
    path('api/', include('onboarding_app.urls')),
    path('api/skills/', include('skills_management.urls')),
    path('api/courses/', include('course_management.urls')),
    path('api/jobs/', include('job_recommendation.urls')),
    path('api/ats/', include('ats_system.urls')),
    path('api/learning/', include('learning_system.urls')),
]
