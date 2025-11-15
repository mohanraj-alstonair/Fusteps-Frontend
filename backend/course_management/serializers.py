from rest_framework import serializers
from .models import Course, UserCourse, CourseRecommendation
from skills_management.serializers import SkillSerializer

class CourseSerializer(serializers.ModelSerializer):
    skills_taught = SkillSerializer(many=True, read_only=True)
    
    class Meta:
        model = Course
        fields = '__all__'

class UserCourseSerializer(serializers.ModelSerializer):
    course = CourseSerializer(read_only=True)
    next_lesson = serializers.SerializerMethodField()
    estimated_completion = serializers.SerializerMethodField()
    
    class Meta:
        model = UserCourse
        fields = '__all__'
    
    def get_next_lesson(self, obj):
        return f"Lesson {obj.completed_lessons + 1}"
    
    def get_estimated_completion(self, obj):
        if obj.progress >= 100:
            return "Completed"
        remaining = 100 - obj.progress
        weeks = max(1, remaining // 20)
        return f"{weeks} weeks"

class CourseRecommendationSerializer(serializers.ModelSerializer):
    course = CourseSerializer(read_only=True)
    
    class Meta:
        model = CourseRecommendation
        fields = '__all__'