from django.urls import path, include

urlpatterns = [
    path('api/', include('onboarding_app.urls')),
]
