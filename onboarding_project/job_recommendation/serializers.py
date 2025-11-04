from rest_framework import serializers
from .models import Company, Job, JobApplication, JobMatch, JobATSScore

class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = ['id', 'name', 'logo', 'description', 'website', 'industry', 'size', 'location']

class JobSerializer(serializers.ModelSerializer):
    company_name = serializers.CharField(source='company.name', read_only=True)
    company_logo = serializers.ImageField(source='company.logo', read_only=True)
    skills_required_names = serializers.StringRelatedField(source='skills_required', many=True, read_only=True)
    
    class Meta:
        model = Job
        fields = [
            'id', 'title', 'company', 'company_name', 'company_logo', 'description', 
            'requirements', 'responsibilities', 'job_type', 'experience_level', 
            'location', 'is_remote', 'salary_min', 'salary_max', 'currency',
            'skills_required', 'skills_required_names', 'is_active', 'deadline',
            'views_count', 'created_at', 'updated_at'
        ]

class JobApplicationSerializer(serializers.ModelSerializer):
    job_title = serializers.CharField(source='job.title', read_only=True)
    company_name = serializers.CharField(source='job.company.name', read_only=True)
    applicant_name = serializers.SerializerMethodField()
    
    def get_applicant_name(self, obj):
        return obj.applicant.full_name or obj.applicant.name or 'Unknown'
    
    class Meta:
        model = JobApplication
        fields = [
            'id', 'job', 'job_title', 'company_name', 'applicant', 'applicant_name',
            'cover_letter', 'status', 'match_score', 'applied_at', 'updated_at'
        ]

class JobMatchSerializer(serializers.ModelSerializer):
    job_title = serializers.CharField(source='job.title', read_only=True)
    company_name = serializers.CharField(source='job.company.name', read_only=True)
    job_location = serializers.CharField(source='job.location', read_only=True)
    
    class Meta:
        model = JobMatch
        fields = [
            'id', 'job', 'job_title', 'company_name', 'job_location',
            'match_score', 'reasons', 'created_at'
        ]

class JobATSScoreSerializer(serializers.ModelSerializer):
    job_title = serializers.CharField(source='job.title', read_only=True)
    company_name = serializers.CharField(source='job.company.name', read_only=True)
    
    class Meta:
        model = JobATSScore
        fields = [
            'id', 'job', 'job_title', 'company_name', 'keyword_score',
            'skill_score', 'education_score', 'experience_score',
            'total_ats_score', 'match_status', 'calculated_at'
        ]