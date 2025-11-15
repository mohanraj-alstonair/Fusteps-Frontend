from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CourseViewSet, UserCourseViewSet, CourseRecommendationViewSet

router = DefaultRouter()
router.register(r'courses', CourseViewSet)
router.register(r'user-courses', UserCourseViewSet, basename='user-courses')
router.register(r'recommendations', CourseRecommendationViewSet, basename='recommendations')

urlpatterns = [
    path('api/', include(router.urls)),
]