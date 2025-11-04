from rest_framework import serializers
from .models import Skill, UserSkill, SkillGapAnalysis, SkillToken, SkillUpgradeRecommendation

class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = ['id', 'name', 'category', 'description', 'is_trending', 'demand_score', 'created_at']

class UserSkillSerializer(serializers.ModelSerializer):
    skill = SkillSerializer(read_only=True)
    
    class Meta:
        model = UserSkill
        fields = ['id', 'skill', 'proficiency', 'years_of_experience', 'is_certified', 'is_verified', 'certificate_path', 'created_at', 'updated_at']

class SkillTokenSerializer(serializers.ModelSerializer):
    skill = SkillSerializer(read_only=True)
    
    class Meta:
        model = SkillToken
        fields = ['id', 'skill', 'token_id', 'verification_status', 'verification_method', 'metadata', 'created_at']

class SkillGapAnalysisSerializer(serializers.ModelSerializer):
    skill = SkillSerializer(read_only=True)
    
    class Meta:
        model = SkillGapAnalysis
        fields = ['id', 'skill', 'target_role', 'importance_score', 'recommendation_text', 'created_at']

class SkillUpgradeRecommendationSerializer(serializers.ModelSerializer):
    skill = SkillSerializer(read_only=True)
    
    class Meta:
        model = SkillUpgradeRecommendation
        fields = ['id', 'skill', 'course_title', 'provider', 'duration', 'difficulty_level', 'course_url', 'priority_score', 'created_at']