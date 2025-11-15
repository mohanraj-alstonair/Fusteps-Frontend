from rest_framework import serializers
from .models import ATSAnalysis, ResumeFile, ATSFeedback

class ATSAnalysisSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)
    
    class Meta:
        model = ATSAnalysis
        fields = [
            'id', 'user', 'user_name', 'keywords_score', 'skills_score',
            'education_score', 'experience_score', 'format_score', 'total_score',
            'feedback', 'improvement_tips', 'missing_elements', 'score_breakdown',
            'analyzed_at', 'job_description'
        ]
        read_only_fields = ['user', 'analyzed_at']

class ResumeFileSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)
    file_size_mb = serializers.SerializerMethodField()
    
    class Meta:
        model = ResumeFile
        fields = [
            'id', 'user', 'user_name', 'file_name', 'file_path',
            'file_size', 'file_size_mb', 'uploaded_at', 'is_active', 'ats_score'
        ]
        read_only_fields = ['user', 'uploaded_at']
    
    def get_file_size_mb(self, obj):
        return round(obj.file_size / (1024 * 1024), 2) if obj.file_size else 0

class ATSFeedbackSerializer(serializers.ModelSerializer):
    analysis_id = serializers.IntegerField(source='analysis.id', read_only=True)
    user_name = serializers.CharField(source='analysis.user.get_full_name', read_only=True)
    priority_display = serializers.CharField(source='get_priority_display', read_only=True)
    
    class Meta:
        model = ATSFeedback
        fields = [
            'id', 'analysis', 'analysis_id', 'user_name', 'feedback_text',
            'category', 'priority', 'priority_display', 'created_at'
        ]