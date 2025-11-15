from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q
from .models import Job, JobApplication, JobMatch, JobATSScore
from .serializers import JobSerializer, JobApplicationSerializer, JobMatchSerializer
from skills_management.models import UserSkill
from onboarding_app.models import Candidate

class JobViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = JobSerializer
    queryset = Job.objects.filter(is_active=True)
    
    def get_queryset(self):
        queryset = Job.objects.filter(is_active=True)
        
        job_type = self.request.query_params.get('job_type')
        location = self.request.query_params.get('location')
        experience_level = self.request.query_params.get('experience_level')
        is_remote = self.request.query_params.get('is_remote')
        search = self.request.query_params.get('search')
        
        if job_type:
            queryset = queryset.filter(job_type=job_type)
        if location:
            queryset = queryset.filter(location__icontains=location)
        if experience_level:
            queryset = queryset.filter(experience_level=experience_level)
        if is_remote is not None:
            queryset = queryset.filter(is_remote=is_remote.lower() == 'true')
        if search:
            queryset = queryset.filter(
                Q(title__icontains=search) | 
                Q(company__name__icontains=search) |
                Q(description__icontains=search)
            )
        
        return queryset.order_by('-created_at')
    
    @action(detail=False, methods=['get'])
    def recommendations(self, request):
        user_id = request.query_params.get('user_id')
        print(f"Job recommendations requested for user_id: {user_id}")
        
        if not user_id:
            return Response({'error': 'user_id required'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            user = Candidate.objects.get(id=user_id)
            print(f"Found user: {user.full_name or user.name}")
        except Candidate.DoesNotExist:
            print(f"User with id {user_id} not found")
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        user_skills = set(UserSkill.objects.filter(user=user).values_list('skill__name', flat=True))
        print(f"User skills: {user_skills}")
        
        if not user_skills:
            print("No user skills found, returning default jobs")
            jobs = Job.objects.filter(is_active=True)[:10]
            job_recommendations = []
            for job in jobs:
                job_data = self.get_serializer(job).data
                job_data['match_score'] = 40.0
                job_data['matching_skills'] = []
                job_data['missing_skills'] = list(job.skills_required.values_list('name', flat=True))
                job_recommendations.append(job_data)
            
            print(f"Returning {len(job_recommendations)} default job recommendations")
            return Response({
                'recommendations': job_recommendations,
                'total_count': len(job_recommendations)
            })

        recommendations = []
        jobs = Job.objects.filter(is_active=True)

        for job in jobs:
            job_skills = set(job.skills_required.values_list('name', flat=True))
            
            matching_skills = list(user_skills.intersection(job_skills))
            missing_skills = list(job_skills - user_skills)
            
            if job_skills:
                match_score = min(100, (len(matching_skills) / len(job_skills)) * 100 + 20)
            else:
                match_score = 50
            
            job_data = self.get_serializer(job).data
            job_data['match_score'] = round(match_score, 1)
            job_data['matching_skills'] = matching_skills
            job_data['missing_skills'] = missing_skills
            job_data['skills_to_learn'] = len(missing_skills)

            recommendations.append(job_data)

        recommendations.sort(key=lambda x: x['match_score'], reverse=True)
        top_recommendations = recommendations[:10]
        
        print(f"Returning {len(top_recommendations)} personalized job recommendations")
        return Response({
            'recommendations': top_recommendations,
            'total_count': len(top_recommendations)
        })
    
    @action(detail=True, methods=['post'])
    def apply(self, request, pk=None):
        job = self.get_object()
        user_id = request.data.get('user_id')
        if not user_id:
            return Response({'error': 'user_id required'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            user = Candidate.objects.get(id=user_id)
        except Candidate.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        
        if JobApplication.objects.filter(job=job, applicant=user).exists():
            return Response(
                {'error': 'You have already applied for this job'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        application = JobApplication.objects.create(
            job=job,
            applicant=user,
            cover_letter=request.data.get('cover_letter', ''),
            match_score=self.calculate_match_score(user, job)
        )
        
        job.views_count += 1
        job.save()
        
        serializer = JobApplicationSerializer(application)
        return Response({
            'message': 'Application submitted successfully',
            'application': serializer.data
        }, status=status.HTTP_201_CREATED)
    
    def calculate_match_score(self, user, job):
        user_skills = set(UserSkill.objects.filter(user=user).values_list('skill__name', flat=True))
        job_skills = set(job.skills_required.values_list('name', flat=True))
        
        if not job_skills:
            return 50.0
        
        matching_skills = user_skills.intersection(job_skills)
        match_percentage = (len(matching_skills) / len(job_skills)) * 100
        
        return min(match_percentage, 100.0)

class JobApplicationViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = JobApplicationSerializer
    
    def get_queryset(self):
        user_id = self.request.query_params.get('user_id')
        if user_id:
            return JobApplication.objects.filter(applicant_id=user_id).order_by('-applied_at')
        return JobApplication.objects.none()

class JobMatchViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = JobMatchSerializer
    
    def get_queryset(self):
        user_id = self.request.query_params.get('user_id')
        if user_id:
            return JobMatch.objects.filter(user_id=user_id).order_by('-match_score')
        return JobMatch.objects.none()