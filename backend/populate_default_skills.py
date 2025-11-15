#!/usr/bin/env python
"""
Populate default skills in the database
"""
import os
import sys
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'onboarding_project.settings')
django.setup()

from skills_management.models import Skill

def populate_skills():
    """Populate default skills"""
    default_skills = [
        # Programming Languages
        ('Python', 'PROGRAMMING'),
        ('JavaScript', 'PROGRAMMING'),
        ('Java', 'PROGRAMMING'),
        ('C++', 'PROGRAMMING'),
        ('C#', 'PROGRAMMING'),
        ('PHP', 'PROGRAMMING'),
        ('Ruby', 'PROGRAMMING'),
        ('Go', 'PROGRAMMING'),
        ('Rust', 'PROGRAMMING'),
        ('TypeScript', 'PROGRAMMING'),
        
        # Frameworks
        ('React', 'FRAMEWORK'),
        ('Angular', 'FRAMEWORK'),
        ('Vue.js', 'FRAMEWORK'),
        ('Django', 'FRAMEWORK'),
        ('Flask', 'FRAMEWORK'),
        ('Express.js', 'FRAMEWORK'),
        ('Spring Boot', 'FRAMEWORK'),
        ('Laravel', 'FRAMEWORK'),
        ('Ruby on Rails', 'FRAMEWORK'),
        
        # Databases
        ('MySQL', 'DATABASE'),
        ('PostgreSQL', 'DATABASE'),
        ('MongoDB', 'DATABASE'),
        ('Redis', 'DATABASE'),
        ('SQLite', 'DATABASE'),
        ('Oracle', 'DATABASE'),
        
        # Cloud & DevOps
        ('AWS', 'CLOUD'),
        ('Azure', 'CLOUD'),
        ('Google Cloud', 'CLOUD'),
        ('Docker', 'DEVOPS'),
        ('Kubernetes', 'DEVOPS'),
        ('Jenkins', 'DEVOPS'),
        ('Git', 'DEVOPS'),
        
        # Soft Skills
        ('Communication', 'SOFT_SKILL'),
        ('Leadership', 'SOFT_SKILL'),
        ('Problem Solving', 'SOFT_SKILL'),
        ('Team Work', 'SOFT_SKILL'),
        ('Time Management', 'SOFT_SKILL'),
        
        # Design
        ('UI/UX Design', 'DESIGN'),
        ('Figma', 'DESIGN'),
        ('Adobe Photoshop', 'DESIGN'),
        ('Sketch', 'DESIGN'),
    ]
    
    created_count = 0
    for skill_name, category in default_skills:
        skill, created = Skill.objects.get_or_create(
            name=skill_name,
            defaults={
                'category': category,
                'description': f'{skill_name} skill',
                'is_trending': skill_name in ['Python', 'JavaScript', 'React', 'AWS', 'Docker'],
                'demand_score': 80 if skill_name in ['Python', 'JavaScript', 'React'] else 60
            }
        )
        if created:
            created_count += 1
            print(f"Created skill: {skill_name}")
    
    print(f"\nTotal skills created: {created_count}")
    print(f"Total skills in database: {Skill.objects.count()}")

if __name__ == "__main__":
    populate_skills()