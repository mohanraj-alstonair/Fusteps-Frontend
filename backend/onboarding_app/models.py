from django.db import models
from django.contrib.auth.hashers import make_password, check_password
from django.core.validators import MinValueValidator, MaxValueValidator

class Candidate(models.Model):
    ROLE_CHOICES = [
        ('student', 'Student'),
        ('mentor', 'Mentor'),
        ('employer', 'Employer'),
        ('alumni', 'Alumni'),
        ('admin', 'Admin'),
    ]
    
    WORK_STATUS_CHOICES = [
        ('fresher', 'I\'m a fresher'),
        ('experienced', 'I\'m experienced'),
    ]
    
    COURSE_CHOICES = [
        ('btech', 'B.Tech / B.E.'),
        ('bsc', 'B.Sc'),
        ('bcom', 'B.Com'),
        ('ba', 'B.A'),
        ('bba', 'BBA'),
        ('bca', 'BCA'),
        ('mtech', 'M.Tech'),
        ('msc', 'M.Sc'),
        ('mba', 'MBA'),
        ('mca', 'MCA'),
    ]
    
    GRADING_CHOICES = [
        ('percentage', '% Marks of 100 Maximum'),
        ('cgpa', 'Scale 10 Grading System'),
        ('pass', 'Course Requires a Pass'),
    ]

    # Basic Registration Fields
    id = models.AutoField(primary_key=True)
    full_name = models.CharField(max_length=100, default='')
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=128)
    mobile_number = models.CharField(max_length=15, default='')
    work_status = models.CharField(max_length=20, choices=WORK_STATUS_CHOICES, default='fresher')
    current_city = models.CharField(max_length=100, default='')
    
    # Legacy fields
    first_name = models.CharField(max_length=50, blank=True)
    last_name = models.CharField(max_length=50, blank=True)
    name = models.CharField(max_length=100, blank=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='student')
    
    # Education Details
    highest_qualification = models.CharField(max_length=100, blank=True)
    course = models.CharField(max_length=50, choices=COURSE_CHOICES, blank=True)
    course_type = models.CharField(max_length=50, default='Full Time', blank=True)
    specialization = models.CharField(max_length=200, blank=True)
    university_institute = models.CharField(max_length=300, blank=True)
    starting_year = models.IntegerField(null=True, blank=True)
    passing_year = models.IntegerField(null=True, blank=True)
    grading_system = models.CharField(max_length=20, choices=GRADING_CHOICES, blank=True)
    marks_percentage = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    
    # Profile Completion
    resume_headline = models.CharField(max_length=250, blank=True)
    career_objective = models.TextField(blank=True)
    preferred_locations = models.CharField(max_length=500, blank=True)  # JSON string
    expected_salary = models.CharField(max_length=100, blank=True)
    
    # Status Fields
    registration_completed = models.BooleanField(default=False)
    education_completed = models.BooleanField(default=False)
    profile_completed = models.BooleanField(default=False)
    onboarding_completed = models.BooleanField(default=False)
    
    # File Storage
    resume_file = models.BinaryField(null=True, blank=True)
    resume_filename = models.CharField(max_length=255, null=True, blank=True)
    
    # Additional fields for comprehensive profile
    skills_json = models.JSONField(null=True, blank=True, help_text='JSON array of skills')
    career_goals = models.TextField(blank=True, help_text='Career goals and objectives')
    linkedin_profile = models.URLField(blank=True, help_text='LinkedIn profile URL')
    portfolio_url = models.URLField(blank=True, help_text='Portfolio website URL')
    cgpa = models.DecimalField(max_digits=4, decimal_places=2, null=True, blank=True, help_text='CGPA or percentage')
    status = models.CharField(max_length=20, choices=[
        ('active', 'Active'),
        ('inactive', 'Inactive'),
        ('suspended', 'Suspended'),
    ], default='active')
    verified = models.BooleanField(default=False, help_text='Profile verification status')
    last_login = models.DateTimeField(null=True, blank=True)
    join_date = models.DateTimeField(auto_now_add=True, null=True, blank=True)
    department = models.CharField(max_length=200, blank=True, help_text='Academic department')
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True, null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True, null=True, blank=True)
    
    # Legacy fields for backward compatibility
    phone = models.CharField(max_length=20, null=True, blank=True)
    university = models.CharField(max_length=255, null=True, blank=True)
    year_of_passout = models.IntegerField(null=True, blank=True)
    degree = models.CharField(max_length=100, null=True, blank=True)
    field_of_study = models.CharField(max_length=255, null=True, blank=True)
    location = models.CharField(max_length=255, null=True, blank=True)
    company_name = models.CharField(max_length=255, null=True, blank=True)
    expertise = models.CharField(max_length=255, null=True, blank=True)
    experience = models.IntegerField(null=True, blank=True)
    education_level = models.CharField(max_length=100, null=True, blank=True)
    mentor_role = models.CharField(max_length=100, null=True, blank=True)
    employer_role = models.CharField(max_length=100, null=True, blank=True)

    def set_password(self, raw_password):
        self.password = make_password(raw_password)

    def check_password(self, raw_password):
        return check_password(raw_password, self.password)

    def __str__(self):
        return f"{self.full_name or self.name} ({self.role})"
    
    def get_completion_percentage(self):
        total_steps = 3
        completed_steps = sum([
            self.registration_completed,
            self.education_completed, 
            self.profile_completed
        ])
        return int((completed_steps / total_steps) * 100)

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
    is_conversation = models.BooleanField(default=False)
    conversation_data = models.JSONField(default=list, blank=True)  # Store entire conversation as JSON array
    ratings = models.IntegerField(null=True, blank=True)  # Star rating, e.g., 1-5
    feedback = models.TextField(null=True, blank=True)  # Feedback text
    mentor_ratings = models.IntegerField(null=True, blank=True)  # Mentor rating for student, e.g., 1-5
    mentor_feedback = models.TextField(null=True, blank=True)  # Mentor feedback text for student

    def __str__(self):
        return f"Message from {self.sender_type} at {self.timestamp}"

    class Meta:
        db_table = 'onboarding_app_chatmessage'
        ordering = ['timestamp']

class ProjectIdea(models.Model):
    DIFFICULTY_CHOICES = [
        ('Beginner', 'Beginner'),
        ('Intermediate', 'Intermediate'),
        ('Advanced', 'Advanced'),
    ]
    
    CATEGORY_CHOICES = [
        ('Web Development', 'Web Development'),
        ('Mobile Development', 'Mobile Development'),
        ('Backend Development', 'Backend Development'),
        ('AI/ML', 'AI/ML'),
        ('Data Science', 'Data Science'),
        ('Game Development', 'Game Development'),
        ('Other', 'Other'),
    ]
    
    STATUS_CHOICES = [
        ('idea', 'Idea'),
        ('uploaded', 'Uploaded Project'),
        ('under_review', 'Under Review'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]

    id = models.AutoField(primary_key=True)
    student = models.ForeignKey(Candidate, on_delete=models.CASCADE, related_name='project_ideas', limit_choices_to={'role': 'student'})
    title = models.CharField(max_length=255)
    description = models.TextField()
    estimated_time = models.CharField(max_length=100, blank=True)
    difficulty_level = models.CharField(max_length=50, choices=DIFFICULTY_CHOICES, default='Intermediate')
    skills_involved = models.TextField(blank=True)
    category = models.CharField(max_length=100, choices=CATEGORY_CHOICES, default='Web Development')
    
    # Project upload fields
    project_type = models.CharField(max_length=20, choices=STATUS_CHOICES, default='idea')
    technologies = models.TextField(blank=True)
    github_url = models.URLField(blank=True, null=True)
    live_url = models.URLField(blank=True, null=True)
    additional_notes = models.TextField(blank=True)
    
    # Mentor collaboration fields
    assigned_mentor = models.ForeignKey(Candidate, on_delete=models.SET_NULL, null=True, blank=True, related_name='assigned_projects', limit_choices_to={'role': 'mentor'})
    literature_review_date = models.DateField(null=True, blank=True)
    prototype_demo_date = models.DateField(null=True, blank=True)
    mentor_review_notes = models.TextField(blank=True)
    rating = models.DecimalField(max_digits=3, decimal_places=1, null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.student.name} - {self.title}"

    class Meta:
        db_table = 'project_ideas'
        ordering = ['-created_at']

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






