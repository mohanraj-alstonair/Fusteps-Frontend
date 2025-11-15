from rest_framework import serializers
from .models import Course, CourseCategory, LearningModule, Quiz, QuizQuestion, Enrollment, Certificate, CourseRecommendation

class CourseCategorySerializer(serializers.ModelSerializer):
    course_count = serializers.SerializerMethodField()
    
    class Meta:
        model = CourseCategory
        fields = ['id', 'name', 'description', 'icon', 'course_count', 'created_at']
    
    def get_course_count(self, obj):
        return obj.courses.filter(is_published=True).count()

class CourseSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    instructor_name = serializers.CharField(source='instructor.get_full_name', read_only=True)
    skills_covered_names = serializers.StringRelatedField(source='skills_covered', many=True, read_only=True)
    module_count = serializers.SerializerMethodField()
    is_enrolled = serializers.SerializerMethodField()
    
    class Meta:
        model = Course
        fields = [
            'id', 'title', 'description', 'category', 'category_name',
            'instructor', 'instructor_name', 'difficulty', 'duration_hours',
            'thumbnail', 'video_url', 'skills_covered', 'skills_covered_names',
            'prerequisites', 'price', 'is_free', 'external_url',
            'enrollment_count', 'average_rating', 'module_count',
            'is_enrolled', 'created_at', 'updated_at'
        ]
    
    def get_module_count(self, obj):
        return obj.modules.count()
    
    def get_is_enrolled(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.enrollments.filter(user=request.user).exists()
        return False

class LearningModuleSerializer(serializers.ModelSerializer):
    course_title = serializers.CharField(source='course.title', read_only=True)
    is_completed = serializers.SerializerMethodField()
    
    class Meta:
        model = LearningModule
        fields = [
            'id', 'course', 'course_title', 'title', 'description',
            'order', 'content', 'video_url', 'duration_minutes',
            'is_completed', 'created_at'
        ]
    
    def get_is_completed(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            try:
                enrollment = obj.course.enrollments.get(user=request.user)
                return obj in enrollment.completed_modules.all()
            except:
                return False
        return False

class QuizSerializer(serializers.ModelSerializer):
    module_title = serializers.CharField(source='module.title', read_only=True)
    question_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Quiz
        fields = [
            'id', 'module', 'module_title', 'title', 'description',
            'passing_score', 'time_limit_minutes', 'question_count', 'created_at'
        ]
    
    def get_question_count(self, obj):
        return obj.questions.count()

class QuizQuestionSerializer(serializers.ModelSerializer):
    quiz_title = serializers.CharField(source='quiz.title', read_only=True)
    
    class Meta:
        model = QuizQuestion
        fields = [
            'id', 'quiz', 'quiz_title', 'question_text', 'question_type',
            'options', 'correct_answer', 'points', 'created_at'
        ]

class EnrollmentSerializer(serializers.ModelSerializer):
    course_title = serializers.CharField(source='course.title', read_only=True)
    course_difficulty = serializers.CharField(source='course.difficulty', read_only=True)
    course_duration_hours = serializers.IntegerField(source='course.duration_hours', read_only=True)
    instructor_name = serializers.CharField(source='course.instructor.get_full_name', read_only=True)
    completed_modules_count = serializers.SerializerMethodField()
    total_modules_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Enrollment
        fields = [
            'id', 'course', 'course_title', 'course_difficulty',
            'course_duration_hours', 'instructor_name', 'status',
            'progress_percentage', 'completed_modules_count',
            'total_modules_count', 'enrolled_at', 'completed_at'
        ]
    
    def get_completed_modules_count(self, obj):
        return obj.completed_modules.count()
    
    def get_total_modules_count(self, obj):
        return obj.course.modules.count()

class CertificateSerializer(serializers.ModelSerializer):
    course_title = serializers.CharField(source='course.title', read_only=True)
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)
    
    class Meta:
        model = Certificate
        fields = [
            'id', 'course', 'course_title', 'user_name',
            'certificate_id', 'issued_date', 'verification_url'
        ]

class CourseRecommendationSerializer(serializers.ModelSerializer):
    course_title = serializers.CharField(source='course.title', read_only=True)
    course_difficulty = serializers.CharField(source='course.difficulty', read_only=True)
    course_duration_hours = serializers.IntegerField(source='course.duration_hours', read_only=True)
    
    class Meta:
        model = CourseRecommendation
        fields = [
            'id', 'course', 'course_title', 'course_difficulty',
            'course_duration_hours', 'relevance_score', 'reason', 'created_at'
        ]