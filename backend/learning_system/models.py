from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from onboarding_app.models import Candidate
from skills_management.models import Skill

class CourseCategory(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)
    icon = models.CharField(max_length=50, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'course_categories'
        verbose_name_plural = 'Course Categories'
    
    def __str__(self):
        return self.name

class Course(models.Model):
    DIFFICULTY_CHOICES = [
        ('BEGINNER', 'Beginner'),
        ('INTERMEDIATE', 'Intermediate'),
        ('ADVANCED', 'Advanced'),
    ]
    
    title = models.CharField(max_length=255)
    description = models.TextField()
    category = models.ForeignKey(CourseCategory, on_delete=models.SET_NULL, null=True, related_name='courses')
    instructor = models.ForeignKey(Candidate, on_delete=models.CASCADE, related_name='courses_taught')
    difficulty = models.CharField(max_length=20, choices=DIFFICULTY_CHOICES)
    duration_hours = models.IntegerField(validators=[MinValueValidator(0)])
    thumbnail = models.ImageField(upload_to='course_thumbnails/', null=True, blank=True)
    video_url = models.URLField(null=True, blank=True)
    skills_covered = models.ManyToManyField(Skill, related_name='learning_courses')
    prerequisites = models.TextField(null=True, blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    is_free = models.BooleanField(default=False)
    is_published = models.BooleanField(default=False)
    external_url = models.URLField(null=True, blank=True)
    enrollment_count = models.IntegerField(default=0)
    average_rating = models.FloatField(default=0.0, validators=[MinValueValidator(0.0), MaxValueValidator(5.0)])
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'learning_courses'
        ordering = ['-created_at']
    
    def __str__(self):
        return self.title

class LearningModule(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='modules')
    title = models.CharField(max_length=255)
    description = models.TextField()
    order = models.IntegerField(default=0)
    content = models.TextField(null=True, blank=True)
    video_url = models.URLField(null=True, blank=True)
    duration_minutes = models.IntegerField(validators=[MinValueValidator(0)])
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'learning_modules'
        ordering = ['order']
    
    def __str__(self):
        return f"{self.course.title} - {self.title}"

class Quiz(models.Model):
    module = models.ForeignKey(LearningModule, on_delete=models.CASCADE, related_name='quizzes')
    title = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)
    passing_score = models.IntegerField(validators=[MinValueValidator(0), MaxValueValidator(100)])
    time_limit_minutes = models.IntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'quizzes'
        verbose_name_plural = 'Quizzes'
    
    def __str__(self):
        return f"{self.module.title} - {self.title}"

class QuizQuestion(models.Model):
    QUESTION_TYPE_CHOICES = [
        ('MULTIPLE_CHOICE', 'Multiple Choice'),
        ('TRUE_FALSE', 'True/False'),
        ('SHORT_ANSWER', 'Short Answer'),
    ]
    
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE, related_name='questions')
    question_text = models.TextField()
    question_type = models.CharField(max_length=20, choices=QUESTION_TYPE_CHOICES)
    options = models.JSONField(null=True, blank=True)
    correct_answer = models.TextField()
    points = models.IntegerField(default=1)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'quiz_questions'
    
    def __str__(self):
        return f"{self.quiz.title} - Question"

class Enrollment(models.Model):
    STATUS_CHOICES = [
        ('ACTIVE', 'Active'),
        ('COMPLETED', 'Completed'),
        ('DROPPED', 'Dropped'),
    ]
    
    user = models.ForeignKey(Candidate, on_delete=models.CASCADE, related_name='enrollments')
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='enrollments')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='ACTIVE')
    progress_percentage = models.IntegerField(default=0, validators=[MinValueValidator(0), MaxValueValidator(100)])
    completed_modules = models.ManyToManyField(LearningModule, blank=True, related_name='completed_by')
    enrolled_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        db_table = 'enrollments'
        unique_together = ('user', 'course')
        ordering = ['-enrolled_at']
    
    def __str__(self):
        return f"{self.user.name} - {self.course.title}"

class Certificate(models.Model):
    user = models.ForeignKey(Candidate, on_delete=models.CASCADE, related_name='certificates')
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='certificates')
    certificate_id = models.CharField(max_length=255, unique=True)
    issued_date = models.DateTimeField(auto_now_add=True)
    verification_url = models.URLField()
    
    class Meta:
        db_table = 'certificates'
        ordering = ['-issued_date']
    
    def __str__(self):
        return f"{self.user.name} - {self.course.title} Certificate"

class CourseRecommendation(models.Model):
    user = models.ForeignKey(Candidate, on_delete=models.CASCADE, related_name='learning_recommendations')
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='recommendations')
    relevance_score = models.FloatField(validators=[MinValueValidator(0.0)])
    reason = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'learning_recommendations'
        ordering = ['-relevance_score']
    
    def __str__(self):
        return f"{self.user.name} - {self.course.title}"