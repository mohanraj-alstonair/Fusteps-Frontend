from django.db import models
from django.core.validators import MinValueValidator
from onboarding_app.models import Candidate

class ATSAnalysis(models.Model):
    user = models.ForeignKey(Candidate, on_delete=models.CASCADE, related_name='ats_analyses')
    keywords_score = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)
    skills_score = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)
    education_score = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)
    experience_score = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)
    format_score = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)
    total_score = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)
    feedback = models.JSONField(default=list, null=True, blank=True)
    improvement_tips = models.JSONField(default=list, null=True, blank=True)
    missing_elements = models.JSONField(default=list, null=True, blank=True)
    score_breakdown = models.JSONField(default=list, null=True, blank=True)
    analyzed_at = models.DateTimeField(auto_now_add=True)
    job_description = models.TextField(null=True, blank=True)
    
    class Meta:
        db_table = 'ats_analysis'
        ordering = ['-analyzed_at']
    
    def __str__(self):
        return f"{self.user.name} - ATS Analysis ({self.total_score}%)"

class ResumeFile(models.Model):
    user = models.ForeignKey(Candidate, on_delete=models.CASCADE, related_name='resume_files')
    file_name = models.CharField(max_length=255)
    file_path = models.CharField(max_length=500)
    file_size = models.IntegerField(default=0)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)
    ats_score = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)
    
    class Meta:
        db_table = 'resume_files'
        ordering = ['-uploaded_at']
    
    def __str__(self):
        return f"{self.user.name} - {self.file_name}"

class ATSFeedback(models.Model):
    PRIORITY_CHOICES = [
        (1, 'High'),
        (2, 'Medium'),
        (3, 'Low'),
    ]
    
    analysis = models.ForeignKey(ATSAnalysis, on_delete=models.CASCADE, related_name='feedback_items')
    feedback_text = models.TextField()
    category = models.CharField(max_length=50)
    priority = models.IntegerField(choices=PRIORITY_CHOICES, default=2)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'ats_feedback'
        ordering = ['priority', '-created_at']
    
    def __str__(self):
        return f"{self.analysis.user.name} - {self.category} Feedback"