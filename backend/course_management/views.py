from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q
from .models import Course, UserCourse, CourseRecommendation
from .serializers import CourseSerializer, UserCourseSerializer, CourseRecommendationSerializer
from skills_management.models import UserSkill, SkillGapAnalysis
from onboarding_app.models import Candidate

class CourseViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    
    def get_queryset(self):
        queryset = Course.objects.all()
        category = self.request.query_params.get('category')
        level = self.request.query_params.get('level')
        search = self.request.query_params.get('search')
        
        if category:
            queryset = queryset.filter(category__iexact=category)
        if level:
            queryset = queryset.filter(level__iexact=level)
        if search:
            queryset = queryset.filter(
                Q(title__icontains=search) |
                Q(instructor__icontains=search) |
                Q(description__icontains=search)
            )
        
        return queryset

class UserCourseViewSet(viewsets.ModelViewSet):
    serializer_class = UserCourseSerializer
    
    def get_queryset(self):
        user_id = self.request.query_params.get('user_id')
        if user_id:
            try:
                user = Candidate.objects.get(id=user_id)
                return UserCourse.objects.filter(user=user)
            except Candidate.DoesNotExist:
                pass
        return UserCourse.objects.none()
    
    @action(detail=False, methods=['post'])
    def enroll(self, request):
        course_id = request.data.get('course_id')
        user_id = request.data.get('user_id')
        try:
            course = Course.objects.get(id=course_id)
            if user_id:
                user = Candidate.objects.get(id=user_id)
            else:
                return Response({'error': 'User ID required'}, status=status.HTTP_400_BAD_REQUEST)
            
            user_course, created = UserCourse.objects.get_or_create(
                user=user,
                course=course
            )
            if created:
                return Response({'message': 'Successfully enrolled'}, status=status.HTTP_201_CREATED)
            else:
                return Response({'message': 'Already enrolled'}, status=status.HTTP_200_OK)
        except Course.DoesNotExist:
            return Response({'error': 'Course not found'}, status=status.HTTP_404_NOT_FOUND)
        except Candidate.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

class CourseRecommendationViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = CourseRecommendationSerializer
    
    def get_queryset(self):
        user_id = self.request.query_params.get('user_id')
        if user_id:
            try:
                user = Candidate.objects.get(id=user_id)
                return CourseRecommendation.objects.filter(user=user)
            except Candidate.DoesNotExist:
                pass
        return CourseRecommendation.objects.none()
    
    @action(detail=False, methods=['post'])
    def generate_recommendations(self, request):
        user_id = request.data.get('user_id')
        if not user_id:
            return Response({'error': 'User ID required'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            user = Candidate.objects.get(id=user_id)
        except Candidate.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        
        # Clear existing recommendations
        CourseRecommendation.objects.filter(user=user).delete()
        
        user_skills = UserSkill.objects.filter(user=user)
        recommendations = []
        
        # Get user's skill names
        user_skill_names = [us.skill.name.lower() for us in user_skills]
        
        # Recommend courses based on existing skills (level up)
        for user_skill in user_skills:
            skill_name = user_skill.skill.name.lower()
            
            # Find courses that teach this skill at a higher level
            matching_courses = Course.objects.filter(
                Q(title__icontains=skill_name) |
                Q(description__icontains=skill_name) |
                Q(category__icontains=skill_name)
            ).exclude(
                id__in=[r.course.id for r in recommendations]
            )[:2]
            
            for course in matching_courses:
                recommendation = CourseRecommendation.objects.create(
                    user=user,
                    course=course,
                    reason=f'Advance your {user_skill.skill.name} skills',
                    priority='HIGH',
                    match_score=90
                )
                recommendations.append(recommendation)
        
        # Recommend complementary skills
        complementary_skills = {
            'python': ['machine learning', 'data science', 'django', 'flask'],
            'data analysis': ['machine learning', 'statistics', 'visualization'],
            'sql': ['database design', 'data warehousing', 'analytics'],
            'javascript': ['react', 'node.js', 'typescript'],
            'java': ['spring', 'microservices', 'android']
        }
        
        for user_skill in user_skills:
            skill_name = user_skill.skill.name.lower()
            if skill_name in complementary_skills:
                for comp_skill in complementary_skills[skill_name][:2]:
                    if comp_skill not in user_skill_names:
                        matching_courses = Course.objects.filter(
                            Q(title__icontains=comp_skill) |
                            Q(description__icontains=comp_skill)
                        ).exclude(
                            id__in=[r.course.id for r in recommendations]
                        )[:1]
                        
                        for course in matching_courses:
                            recommendation = CourseRecommendation.objects.create(
                                user=user,
                                course=course,
                                reason=f'Perfect complement to your {user_skill.skill.name} skills',
                                priority='MEDIUM',
                                match_score=85
                            )
                            recommendations.append(recommendation)
        
        # Add popular courses if we don't have enough recommendations
        if len(recommendations) < 4:
            popular_courses = Course.objects.filter(featured=True).exclude(
                id__in=[r.course.id for r in recommendations]
            )[:4-len(recommendations)]
            
            for course in popular_courses:
                recommendation = CourseRecommendation.objects.create(
                    user=user,
                    course=course,
                    reason=f'Popular {course.category} course',
                    priority='MEDIUM',
                    match_score=75
                )
                recommendations.append(recommendation)
        
        serializer = self.get_serializer(recommendations, many=True)
        return Response({
            'message': f'Generated {len(recommendations)} recommendations',
            'recommendations': serializer.data
        })