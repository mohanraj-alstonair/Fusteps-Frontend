from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Candidate
from skills_management.models import Skill, UserSkill
from django.shortcuts import get_object_or_404
import json

@api_view(['GET', 'POST'])
def manage_skills(request, user_id):
    user = get_object_or_404(Candidate, id=user_id)
    
    if request.method == 'GET':
        # Get user's skills
        user_skills = UserSkill.objects.filter(user=user).select_related('skill')
        skills_data = []
        for us in user_skills:
            skills_data.append({
                'id': us.skill.id,
                'name': us.skill.name,
                'category': us.skill.category,
                'proficiency': us.proficiency,
                'years_of_experience': us.years_of_experience,
                'is_certified': us.is_certified,
                'is_verified': us.is_verified,
                'created_at': us.created_at.isoformat()
            })
        return Response({'skills': skills_data})
    
    elif request.method == 'POST':
        # Add skill to user profile
        skill_name = request.data.get('skill_name')
        proficiency = request.data.get('proficiency', 'BEGINNER')
        years_of_experience = float(request.data.get('years_of_experience', 0))
        is_certified = bool(request.data.get('is_certified', False))
        
        if not skill_name:
            return Response({'error': 'Skill name required'}, status=400)
        
        # Get or create skill
        skill, created = Skill.objects.get_or_create(
            name=skill_name,
            defaults={'category': 'OTHER', 'description': f'{skill_name} skill'}
        )
        
        # Create or update user skill
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
            user_skill.proficiency = proficiency
            user_skill.years_of_experience = years_of_experience
            user_skill.is_certified = is_certified
        
        # Verification logic
        if is_certified or years_of_experience >= 2.0:
            user_skill.is_verified = True
        else:
            user_skill.is_verified = False
        
        user_skill.save()
        
        return Response({
            'success': True,
            'message': 'Skill verified and added successfully' if user_skill.is_verified else 'Skill added (pending verification)',
            'verified': user_skill.is_verified
        })

@api_view(['GET'])
def get_all_skills(request):
    skills = Skill.objects.all()
    skills_data = []
    for skill in skills:
        skills_data.append({
            'id': skill.id,
            'name': skill.name,
            'category': skill.category,
            'description': skill.description
        })
    return Response(skills_data)

@api_view(['POST'])
def create_default_skills(request):
    """Create default skills for the platform"""
    default_skills = [
        ('Python', 'PROGRAMMING'),
        ('JavaScript', 'PROGRAMMING'),
        ('Java', 'PROGRAMMING'),
        ('React', 'FRAMEWORK'),
        ('Django', 'FRAMEWORK'),
        ('SQL', 'DATABASE'),
        ('MongoDB', 'DATABASE'),
        ('AWS', 'CLOUD'),
        ('Docker', 'DEVOPS'),
        ('Git', 'DEVOPS'),
    ]
    
    created_count = 0
    for name, category in default_skills:
        skill, created = Skill.objects.get_or_create(
            name=name,
            defaults={'category': category, 'description': f'{name} programming skill'}
        )
        if created:
            created_count += 1
    
    return Response({
        'message': f'Created {created_count} new skills',
        'total_skills': Skill.objects.count()
    })