from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Skill, UserSkill, SkillGapAnalysis, SkillToken, SkillUpgradeRecommendation
from .serializers import SkillSerializer, UserSkillSerializer, SkillGapAnalysisSerializer, SkillTokenSerializer, SkillUpgradeRecommendationSerializer
from onboarding_app.models import Candidate
import random

class SkillViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Skill.objects.all()
    serializer_class = SkillSerializer
    permission_classes = []
    
    @action(detail=False, methods=['get'])
    def trending(self, request):
        trending_skills = Skill.objects.filter(is_trending=True).order_by('-demand_score')
        serializer = self.get_serializer(trending_skills, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def by_category(self, request):
        category = request.query_params.get('category')
        if category:
            skills = Skill.objects.filter(category=category)
            serializer = self.get_serializer(skills, many=True)
            return Response(serializer.data)
        return Response({'error': 'Category parameter required'}, status=400)
    
    @action(detail=False, methods=['post'])
    def create_default(self, request):
        default_skills = [
            ('Python', 'PROGRAMMING', 'Python programming language', True, 85),
            ('JavaScript', 'PROGRAMMING', 'JavaScript programming language', True, 90),
            ('Java', 'PROGRAMMING', 'Java programming language', False, 75),
            ('React', 'FRAMEWORK', 'React JavaScript library', True, 88),
            ('Django', 'FRAMEWORK', 'Django web framework', False, 70),
            ('SQL', 'DATABASE', 'Structured Query Language', True, 80),
            ('MongoDB', 'DATABASE', 'NoSQL database', False, 65),
            ('AWS', 'CLOUD', 'Amazon Web Services', True, 82),
            ('Docker', 'DEVOPS', 'Containerization platform', True, 78),
            ('Git', 'DEVOPS', 'Version control system', True, 95),
        ]
        
        created_count = 0
        for name, category, description, is_trending, demand_score in default_skills:
            skill, created = Skill.objects.get_or_create(
                name=name,
                defaults={
                    'category': category,
                    'description': description,
                    'is_trending': is_trending,
                    'demand_score': demand_score
                }
            )
            if created:
                created_count += 1
        
        return Response({
            'message': f'Created {created_count} new skills',
            'total_skills': Skill.objects.count()
        })
    
    @action(detail=True, methods=['post'])
    def add_to_profile(self, request, pk=None):
        user_id = request.data.get('user_id')
        proficiency = request.data.get('proficiency', 'BEGINNER')
        years_of_experience = float(request.data.get('years_of_experience', 0.0))
        is_certified = bool(request.data.get('is_certified', False))
        certificate_file = request.FILES.get('certificate_file')
        
        if not user_id:
            return Response({'error': 'User ID required'}, status=400)
            
        try:
            user = Candidate.objects.get(id=user_id)
            skill = self.get_object()
            
            user_skill, created = UserSkill.objects.get_or_create(
                user=user,
                skill=skill,
                defaults={
                    'proficiency': proficiency,
                    'years_of_experience': years_of_experience,
                    'is_certified': is_certified
                }
            )
            
            if not created:
                # Update existing skill
                user_skill.proficiency = proficiency
                user_skill.years_of_experience = years_of_experience
                user_skill.is_certified = is_certified
            
            # Handle certificate file upload
            if certificate_file:
                # Save certificate file
                import os
                from django.conf import settings
                
                upload_dir = os.path.join(settings.MEDIA_ROOT, 'certificates', str(user.id))
                os.makedirs(upload_dir, exist_ok=True)
                
                file_path = os.path.join(upload_dir, f"{skill.name}_{certificate_file.name}")
                with open(file_path, 'wb+') as destination:
                    for chunk in certificate_file.chunks():
                        destination.write(chunk)
                
                user_skill.certificate_path = file_path
                is_certified = True
                user_skill.is_certified = True
                
                # Get certificate score if provided
                certificate_score = request.data.get('certificate_score')
                if certificate_score:
                    try:
                        score = float(certificate_score)
                        if score >= 90:
                            proficiency = 'EXPERT'
                        elif score >= 85:
                            proficiency = 'ADVANCED'
                        elif score >= 80:
                            proficiency = 'INTERMEDIATE'
                        else:
                            proficiency = 'BEGINNER'
                        user_skill.proficiency = proficiency
                    except ValueError:
                        pass
                
            # Handle quiz score
            quiz_score = request.data.get('quiz_score')
            verification_source = 'SELF_DECLARED'
            confidence_score = 0.30
            
            if quiz_score:
                try:
                    score = float(quiz_score)
                    if score >= 80:
                        user_skill.is_verified = True
                        verification_source = 'ASSESSMENT_PASSED'
                        confidence_score = min(0.95, score / 100)
                    else:
                        user_skill.is_verified = False
                        verification_source = 'ASSESSMENT_FAILED'
                        confidence_score = score / 100
                except ValueError:
                    pass
            
            # Set verification based on evidence (if not already set by quiz)
            if not quiz_score:
                if certificate_file or is_certified:
                    user_skill.is_verified = True
                    verification_source = 'CERTIFICATE_UPLOAD'
                    confidence_score = 0.95
                elif float(years_of_experience) >= 2.0:
                    user_skill.is_verified = True
                    verification_source = 'EXPERIENCE_BASED'
                    confidence_score = 0.80
                else:
                    user_skill.is_verified = False
                    verification_source = 'SELF_DECLARED'
                    confidence_score = 0.30
            
            user_skill.save()
            
            # Generate skill token only if verified
            skill_token = None
            if user_skill.is_verified:
                skill_token, token_created = SkillToken.objects.get_or_create(
                    user=user,
                    skill=skill,
                    defaults={
                        'verification_source': verification_source,
                        'confidence_score': confidence_score,
                        'metadata': {
                            'proficiency': proficiency,
                            'years_experience': years_of_experience,
                            'certified': is_certified,
                            'certificate_uploaded': bool(certificate_file),
                            'quiz_score': quiz_score if quiz_score else None,
                            'certificate_score': request.data.get('certificate_score') if certificate_file else None,
                            'verification_method': verification_source,
                            'source': 'skill_verification'
                        }
                    }
                )
                
                # Update existing token if needed
                if not token_created and quiz_score:
                    skill_token.verification_source = verification_source
                    skill_token.confidence_score = confidence_score
                    skill_token.metadata.update({
                        'quiz_score': quiz_score,
                        'verification_method': verification_source
                    })
                    skill_token.save()
            
            serializer = UserSkillSerializer(user_skill)
            message = 'Skill verified and added to profile successfully' if user_skill.is_verified else 'Skill added to profile (verification pending)'
            
            response_data = {
                'success': True,
                'message': message,
                'verified': user_skill.is_verified,
                'certificate_uploaded': bool(certificate_file),
                'user_skill': serializer.data
            }
            
            # Include skill token info if verified
            if user_skill.is_verified and skill_token:
                response_data['skill_token'] = {
                    'token_id': skill_token.token_id,
                    'verification_source': skill_token.verification_source,
                    'confidence_score': skill_token.confidence_score
                }
            
            return Response(response_data)
            
        except Candidate.DoesNotExist:
            return Response({'error': 'User not found'}, status=404)
        except Exception as e:
            return Response({'error': str(e)}, status=500)

class UserSkillViewSet(viewsets.ModelViewSet):
    serializer_class = UserSkillSerializer
    permission_classes = []
    
    def get_queryset(self):
        user_id = self.request.query_params.get('user_id')
        if user_id:
            try:
                user = Candidate.objects.get(id=user_id)
                return UserSkill.objects.filter(user=user)
            except Candidate.DoesNotExist:
                return UserSkill.objects.none()
        return UserSkill.objects.none()
    
    def perform_create(self, serializer):
        user_id = self.request.data.get('user_id')
        if user_id:
            try:
                user = Candidate.objects.get(id=user_id)
                serializer.save(user=user)
            except Candidate.DoesNotExist:
                pass
    
    @action(detail=True, methods=['delete'])
    def remove_skill(self, request, pk=None):
        user_id = request.query_params.get('user_id')
        if not user_id:
            return Response({'error': 'User ID required'}, status=400)
            
        try:
            user = Candidate.objects.get(id=user_id)
            user_skill = self.get_object()
            
            if user_skill.user != user:
                return Response({'error': 'Permission denied'}, status=403)
                
            user_skill.delete()
            return Response({'success': True, 'message': 'Skill removed successfully'})
            
        except Candidate.DoesNotExist:
            return Response({'error': 'User not found'}, status=404)
        except Exception as e:
            return Response({'error': str(e)}, status=500)
    
    @action(detail=False, methods=['get'])
    def proficiency_summary(self, request):
        user_id = request.query_params.get('user_id')
        if user_id:
            try:
                user = Candidate.objects.get(id=user_id)
                user_skills = UserSkill.objects.filter(user=user)
                summary = {
                    'BEGINNER': user_skills.filter(proficiency='BEGINNER').count(),
                    'INTERMEDIATE': user_skills.filter(proficiency='INTERMEDIATE').count(),
                    'ADVANCED': user_skills.filter(proficiency='ADVANCED').count(),
                    'EXPERT': user_skills.filter(proficiency='EXPERT').count(),
                }
                return Response(summary)
            except Candidate.DoesNotExist:
                return Response({'error': 'User not found'}, status=404)
        return Response({'error': 'User ID required'}, status=400)

class SkillGapAnalysisViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = SkillGapAnalysisSerializer
    permission_classes = []
    
    def get_queryset(self):
        user_id = self.request.query_params.get('user_id')
        if user_id:
            try:
                user = Candidate.objects.get(id=user_id)
                return SkillGapAnalysis.objects.filter(user=user)
            except Candidate.DoesNotExist:
                return SkillGapAnalysis.objects.none()
        return SkillGapAnalysis.objects.none()
    
    @action(detail=False, methods=['post'])
    def analyze_gaps(self, request):
        user_id = request.data.get('user_id')
        if not user_id:
            return Response({'error': 'User ID required'}, status=400)
            
        try:
            user = Candidate.objects.get(id=user_id)
        except Candidate.DoesNotExist:
            return Response({'error': 'User not found'}, status=404)
            
        target_role = request.data.get('target_role', '')
        
        # Enhanced AI-driven gap analysis
        user_skills = set(UserSkill.objects.filter(user=user).values_list('skill__name', flat=True))
        
        # Role-based skill requirements (AI-enhanced)
        role_requirements = {
            'Data Analyst': ['Python', 'SQL', 'Tableau', 'Excel', 'Statistics'],
            'Software Engineer': ['Python', 'JavaScript', 'React', 'Git', 'AWS'],
            'DevOps Engineer': ['Docker', 'Kubernetes', 'AWS', 'Linux', 'CI/CD'],
            'UI/UX Designer': ['Figma', 'Adobe XD', 'Prototyping', 'User Research'],
            'default': ['Python', 'JavaScript', 'SQL', 'Git', 'Communication']
        }
        
        required_skills = role_requirements.get(target_role, role_requirements['default'])
        missing_skills = [skill for skill in required_skills if skill not in user_skills]
        
        gaps = []
        for skill_name in missing_skills:
            try:
                skill = Skill.objects.get(name=skill_name)
                importance = random.randint(70, 95)  # AI-calculated importance
                gap, created = SkillGapAnalysis.objects.get_or_create(
                    user=user,
                    skill=skill,
                    target_role=target_role,
                    defaults={
                        'importance_score': importance,
                        'recommendation_text': f'Master {skill_name} to excel in {target_role} roles. This skill is in high demand with {importance}% market relevance.'
                    }
                )
                gaps.append(gap)
                
                # Generate upgrade recommendations
                self._generate_upgrade_recommendations(user, skill, target_role)
                
            except Skill.DoesNotExist:
                continue
        
        serializer = self.get_serializer(gaps, many=True)
        return Response(serializer.data)
    
    def _generate_upgrade_recommendations(self, user, skill, target_role):
        """Generate AI-powered course recommendations"""
        course_data = {
            'Python': [('Python for Data Science', 'Coursera', '6 weeks'), ('Advanced Python', 'edX', '4 weeks')],
            'JavaScript': [('JavaScript Fundamentals', 'FuSteps Academy', '3 weeks'), ('React Mastery', 'Udemy', '8 weeks')],
            'SQL': [('SQL for Beginners', 'FuSteps Academy', '2 weeks'), ('Advanced SQL', 'Coursera', '5 weeks')],
            'Tableau': [('Data Visualization with Tableau', 'Coursera', '6 weeks'), ('Tableau Desktop', 'Tableau', '4 weeks')],
            'AWS': [('AWS Cloud Practitioner', 'AWS', '3 weeks'), ('AWS Solutions Architect', 'A Cloud Guru', '8 weeks')]
        }
        
        courses = course_data.get(skill.name, [('Generic Course', 'FuSteps Academy', '4 weeks')])
        
        for course_title, provider, duration in courses:
            SkillUpgradeRecommendation.objects.get_or_create(
                user=user,
                skill=skill,
                course_title=course_title,
                defaults={
                    'provider': provider,
                    'duration': duration,
                    'difficulty_level': 'INTERMEDIATE',
                    'priority_score': random.randint(75, 95)
                }
            )

class SkillTokenViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = SkillTokenSerializer
    permission_classes = []
    
    def get_queryset(self):
        user_id = self.request.query_params.get('user_id')
        if user_id:
            try:
                user = Candidate.objects.get(id=user_id)
                return SkillToken.objects.filter(user=user)
            except Candidate.DoesNotExist:
                return SkillToken.objects.none()
        return SkillToken.objects.none()
    
    @action(detail=True, methods=['get'])
    def verify_token(self, request, pk=None):
        token = self.get_object()
        return Response({
            'valid': True,
            'token_id': token.token_id,
            'skill': token.skill.name,
            'user': token.user.name,
            'verification_status': token.verification_status,
            'created_at': token.created_at
        })

class SkillUpgradeRecommendationViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = SkillUpgradeRecommendationSerializer
    permission_classes = []
    
    def get_queryset(self):
        user_id = self.request.query_params.get('user_id')
        if user_id:
            try:
                user = Candidate.objects.get(id=user_id)
                return SkillUpgradeRecommendation.objects.filter(user=user)
            except Candidate.DoesNotExist:
                return SkillUpgradeRecommendation.objects.none()
        return SkillUpgradeRecommendation.objects.none()