from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import JobViewSet, JobApplicationViewSet, JobMatchViewSet

router = DefaultRouter()
router.register(r'jobs', JobViewSet)
router.register(r'applications', JobApplicationViewSet, basename='applications')
router.register(r'matches', JobMatchViewSet, basename='matches')

urlpatterns = [
    path('api/', include(router.urls)),
]