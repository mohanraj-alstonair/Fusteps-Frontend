from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from onboarding_app.models import Candidate
from skills_management.models import Skill

class Course(models.Model):
    LEVEL_CHOICES = [
        ('BEGINNER', 'Beginner'),
        ('INTERMEDIATE', 'Intermediate'),
        ('ADVANCED', 'Advanced'),
    ]
    
    CATEGORY_CHOICES = [
        ('PROGRAMMING', 'Programming'),
        ('AI_ML', 'AI/ML'),
        ('FRONTEND', 'Frontend'),
        ('BACKEND', 'Backend'),
        ('CLOUD_COMPUTING', 'Cloud Computing'),
        ('COMPUTER_SCIENCE', 'Computer Science'),
        ('DEVOPS', 'DevOps'),
        ('DATA_SCIENCE', 'Data Science'),
    ]
    
    title = models.CharField(max_length=255)
    instructor = models.CharField(max_length=255)
    provider = models.CharField(max_length=255)
    description = models.TextField()
    duration = models.CharField(max_length=50)
    lessons = models.IntegerField()
    rating = models.FloatField(validators=[MinValueValidator(0.0), MaxValueValidator(5.0)])
    students = models.IntegerField(default=0)
    price = models.CharField(max_length=50)
    level = models.CharField(max_length=20, choices=LEVEL_CHOICES)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    featured = models.BooleanField(default=False)
    skills_taught = models.ManyToManyField(Skill, related_name='courses')
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'courses'
        ordering = ['-created_at']
    
    def __str__(self):
        return self.title

class UserCourse(models.Model):
    user = models.ForeignKey(Candidate, on_delete=models.CASCADE, related_name='enrolled_courses')
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='enrolled_users')
    progress = models.IntegerField(default=0, validators=[MinValueValidator(0), MaxValueValidator(100)])
    completed_lessons = models.IntegerField(default=0)
    last_accessed = models.DateTimeField(auto_now=True)
    enrolled_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'user_courses'
        unique_together = ('user', 'course')
    
    def __str__(self):
        return f"{self.user.name} - {self.course.title}"

class CourseRecommendation(models.Model):
    PRIORITY_CHOICES = [
        ('HIGH', 'High'),
        ('MEDIUM', 'Medium'),
        ('LOW', 'Low'),
    ]
    
    user = models.ForeignKey(Candidate, on_delete=models.CASCADE, related_name='course_recommendations')
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    reason = models.TextField()
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES)
    match_score = models.IntegerField(validators=[MinValueValidator(0), MaxValueValidator(100)])
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'course_recommendations'
        ordering = ['-match_score', '-created_at']
    
    def __str__(self):
        return f"{self.user.name} - {self.course.title}"