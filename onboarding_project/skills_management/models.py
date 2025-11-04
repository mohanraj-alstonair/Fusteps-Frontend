from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from onboarding_app.models import Candidate
import hashlib
import uuid
from datetime import datetime

class Skill(models.Model):
    CATEGORY_CHOICES = [
        ('PROGRAMMING', 'Programming'),
        ('FRAMEWORK', 'Framework'),
        ('DATABASE', 'Database'),
        ('CLOUD', 'Cloud'),
        ('DEVOPS', 'DevOps'),
        ('SOFT_SKILL', 'Soft Skill'),
        ('DESIGN', 'Design'),
        ('OTHER', 'Other'),
    ]
    
    name = models.CharField(max_length=255, unique=True)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    description = models.TextField(null=True, blank=True)
    is_trending = models.BooleanField(default=False)
    demand_score = models.IntegerField(default=0, validators=[MinValueValidator(0), MaxValueValidator(100)])
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'skills'
        ordering = ['name']
    
    def __str__(self):
        return self.name

class UserSkill(models.Model):
    PROFICIENCY_CHOICES = [
        ('BEGINNER', 'Beginner'),
        ('INTERMEDIATE', 'Intermediate'),
        ('ADVANCED', 'Advanced'),
        ('EXPERT', 'Expert'),
    ]
    
    user = models.ForeignKey(Candidate, on_delete=models.CASCADE, related_name='user_skills')
    skill = models.ForeignKey(Skill, on_delete=models.CASCADE, related_name='user_skills')
    proficiency = models.CharField(max_length=20, choices=PROFICIENCY_CHOICES)
    years_of_experience = models.FloatField(validators=[MinValueValidator(0.0)], default=0.0)
    is_certified = models.BooleanField(default=False)
    is_verified = models.BooleanField(default=False)  # Shows "Verified ✅" badge
    certificate_path = models.CharField(max_length=500, null=True, blank=True)  # Path to uploaded certificate
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'user_skills'
        unique_together = ('user', 'skill')
    
    def __str__(self):
        return f"{self.user.name} - {self.skill.name}"

class SkillSource(models.Model):
    SOURCE_TYPES = [
        ('RESUME', 'Resume Upload'),
        ('CERTIFICATE', 'Course Certificate'),
        ('PROJECT', 'Project/Internship'),
        ('TEST', 'Test/Quiz Completion'),
        ('MANUAL', 'Manual Declaration')
    ]
    
    user = models.ForeignKey(Candidate, on_delete=models.CASCADE)
    source_type = models.CharField(max_length=20, choices=SOURCE_TYPES)
    source_file = models.FileField(upload_to='skill_sources/', null=True, blank=True)
    source_url = models.URLField(null=True, blank=True)
    extracted_skills = models.JSONField(default=list)
    confidence_score = models.FloatField(default=0.0)
    processed_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'skill_sources'

class SkillToken(models.Model):
    """Internal token system - invisible to users, used for verification & audit"""
    user = models.ForeignKey(Candidate, on_delete=models.CASCADE, related_name='skill_tokens')
    skill = models.ForeignKey(Skill, on_delete=models.CASCADE)
    token_id = models.CharField(max_length=255, unique=True)
    verification_source = models.CharField(max_length=50, choices=[
        ('COURSE_COMPLETION', 'Course Completed'),
        ('ASSESSMENT_PASSED', 'Assessment Passed'),
        ('CERTIFICATE_UPLOAD', 'Certificate Uploaded'),
        ('ADMIN_VERIFIED', 'Admin Verified'),
        ('AI_VERIFIED', 'AI Verified')
    ])
    confidence_score = models.FloatField(default=0.96)
    verified_by = models.CharField(max_length=100, default='FuSteps AI')
    verified_on = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=[
        ('ACTIVE', 'Active'),
        ('REVOKED', 'Revoked')
    ], default='ACTIVE')
    metadata = models.JSONField(default=dict)  # Internal audit data
    
    class Meta:
        db_table = 'skill_tokens'
        unique_together = ('user', 'skill')
    
    def save(self, *args, **kwargs):
        if not self.token_id:
            self.token_id = self.generate_token_id()
        super().save(*args, **kwargs)
    
    def generate_token_id(self):
        """Generate unique token: SKL-2025-XXXXXX format"""
        year = datetime.now().year
        sequence = SkillToken.objects.filter(token_id__startswith=f'SKL-{year}').count() + 1
        return f"SKL-{year}-{sequence:06d}"
    
    def __str__(self):
        return f"{self.user.name} - {self.skill.name} (Token: {self.token_id})"

class SkillGapAnalysis(models.Model):
    user = models.ForeignKey(Candidate, on_delete=models.CASCADE, related_name='skill_gaps')
    skill = models.ForeignKey(Skill, on_delete=models.CASCADE)
    target_role = models.CharField(max_length=255, default='Software Engineer')
    importance_score = models.IntegerField(validators=[MinValueValidator(0), MaxValueValidator(100)])
    recommendation_text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'skill_gap_analysis'
        ordering = ['-importance_score']
    
    def __str__(self):
        return f"{self.user.name} - Gap: {self.skill.name}"

class SkillUpgradeRecommendation(models.Model):
    user = models.ForeignKey(Candidate, on_delete=models.CASCADE, related_name='upgrade_recommendations')
    skill = models.ForeignKey(Skill, on_delete=models.CASCADE)
    course_title = models.CharField(max_length=255)
    provider = models.CharField(max_length=100)
    duration = models.CharField(max_length=50)
    difficulty_level = models.CharField(max_length=20, choices=[
        ('BEGINNER', 'Beginner'),
        ('INTERMEDIATE', 'Intermediate'),
        ('ADVANCED', 'Advanced')
    ])
    course_url = models.URLField(blank=True)
    priority_score = models.IntegerField(validators=[MinValueValidator(0), MaxValueValidator(100)])
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'skill_upgrade_recommendations'
        ordering = ['-priority_score']
    
    def __str__(self):
        return f"{self.user.name} - {self.course_title}"