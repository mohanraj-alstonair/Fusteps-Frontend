from django.db import models
from django.contrib.auth.hashers import make_password, check_password

class Candidate(models.Model):
    ROLE_CHOICES = [
        ('student', 'Student'),
        ('mentor', 'Mentor'),
        ('employer', 'Employer'),
        ('alumni', 'Alumni'),
        ('admin', 'Admin'),
    ]

    id = models.AutoField(primary_key=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=128)
    name = models.CharField(max_length=100)

    # Role-specific fields (nullable)
    year_of_passout = models.IntegerField(null=True, blank=True)
    degree = models.CharField(max_length=100, null=True, blank=True)
    company_name = models.CharField(max_length=255, null=True, blank=True)
    location = models.CharField(max_length=255, null=True, blank=True)
    field_of_study = models.CharField(max_length=255, null=True, blank=True)
    expertise = models.CharField(max_length=255, null=True, blank=True)
    experience = models.IntegerField(null=True, blank=True)  # renamed from experience_years
    education_level = models.CharField(max_length=100, null=True, blank=True)
    mentor_role = models.CharField(max_length=100, null=True, blank=True)
    employer_role = models.CharField(max_length=100, null=True, blank=True)

    def set_password(self, raw_password):
        self.password = make_password(raw_password)

    def check_password(self, raw_password):
        return check_password(raw_password, self.password)

    def __str__(self):
        return f"{self.name} ({self.role})"

    class Meta:
        db_table = 'candidate'

class ChatMessage(models.Model):
    SENDER_TYPE_CHOICES = [
        ('student', 'Student'),
        ('mentor', 'Mentor'),
        ('employer', 'Employer'),
        ('alumni', 'Alumni'),
        ('admin', 'Admin'),
    ]
    
    MESSAGE_TYPE_CHOICES = [
        ('text', 'Text'),
        ('file', 'File'),
        ('image', 'Image'),
    ]
    
    STATUS_CHOICES = [
        ('sent', 'Sent'),
        ('delivered', 'Delivered'),
        ('read', 'Read'),
        ('pending', 'Pending'),
        ('accepted', 'Accepted'),
        ('rejected', 'Rejected'),
    ]

    id = models.BigAutoField(primary_key=True)
    sender_type = models.CharField(max_length=10, choices=SENDER_TYPE_CHOICES)
    sender_id = models.CharField(max_length=255)
    receiver_id = models.CharField(max_length=255)
    content = models.TextField()
    message_type = models.CharField(max_length=10, choices=MESSAGE_TYPE_CHOICES, default='text')
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='sent')
    timestamp = models.DateTimeField(auto_now_add=True)
    is_deleted = models.BooleanField(default=False)
    is_conversation = models.BooleanField(default=False)
    file_url = models.URLField(blank=True, null=True)
    reply_to_id = models.CharField(max_length=255, blank=True, null=True)
    conversation_data = models.JSONField(default=list, blank=True)  # Store entire conversation as JSON array
    ratings = models.IntegerField(null=True, blank=True)  # Star rating, e.g., 1-5
    feedback = models.TextField(null=True, blank=True)  # Feedback text
    response = models.TextField(null=True, blank=True)  # Mentor response to feedback
    response_date = models.DateTimeField(null=True, blank=True)  # Date when mentor responded

    def __str__(self):
        return f"Message from {self.sender_type} at {self.timestamp}"

    class Meta:
        db_table = 'onboarding_app_chatmessage'
        ordering = ['timestamp']

class BookedSession(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('accepted', 'Accepted'),
        ('rejected', 'Rejected'),
        ('scheduled', 'Scheduled'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]

    id = models.AutoField(primary_key=True)
    student = models.ForeignKey(Candidate, on_delete=models.CASCADE, related_name='booked_sessions_student', limit_choices_to={'role': 'student'})
    mentor = models.ForeignKey(Candidate, on_delete=models.CASCADE, related_name='booked_sessions_mentor', limit_choices_to={'role': 'mentor'})
    topic = models.CharField(max_length=255)
    preferred_date_time = models.DateTimeField()
    message = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    scheduled_date_time = models.DateTimeField(blank=True, null=True)
    meeting_link = models.URLField(blank=True, null=True)
    meeting_id = models.CharField(max_length=100, blank=True, null=True)
    passcode = models.CharField(max_length=100, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.student.name} - {self.mentor.name} - {self.topic} ({self.status})"

    class Meta:
        db_table = 'booked_sessions'
        ordering = ['-created_at']
