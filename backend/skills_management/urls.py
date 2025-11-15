from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SkillViewSet, UserSkillViewSet, SkillGapAnalysisViewSet, SkillTokenViewSet, SkillUpgradeRecommendationViewSet

router = DefaultRouter()
router.register(r'skills', SkillViewSet)
router.register(r'user-skills', UserSkillViewSet, basename='user-skills')
router.register(r'skill-gaps', SkillGapAnalysisViewSet, basename='skill-gaps')
router.register(r'skill-tokens', SkillTokenViewSet, basename='skill-tokens')
router.register(r'upgrade-recommendations', SkillUpgradeRecommendationViewSet, basename='upgrade-recommendations')

urlpatterns = [
    path('api/', include(router.urls)),
]