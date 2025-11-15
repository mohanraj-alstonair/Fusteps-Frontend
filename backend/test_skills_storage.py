#!/usr/bin/env python
"""
Test script to verify skills storage during signup
"""
import os
import sys
import django
from django.db import connection

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'onboarding_project.settings')
django.setup()

from onboarding_app.models import Candidate
from skills_management.models import Skill, UserSkill

def test_skills_storage():
    """Test if skills are being stored properly"""
    print("Testing skills storage...")
    
    # Check if skills tables exist
    with connection.cursor() as cursor:
        cursor.execute("SHOW TABLES LIKE 'skills'")
        skills_table = cursor.fetchone()
        
        cursor.execute("SHOW TABLES LIKE 'user_skills'")
        user_skills_table = cursor.fetchone()
        
        print(f"Skills table exists: {bool(skills_table)}")
        print(f"User skills table exists: {bool(user_skills_table)}")
        
        if skills_table:
            cursor.execute("SELECT COUNT(*) FROM skills")
            skills_count = cursor.fetchone()[0]
            print(f"Total skills in database: {skills_count}")
        
        if user_skills_table:
            cursor.execute("SELECT COUNT(*) FROM user_skills")
            user_skills_count = cursor.fetchone()[0]
            print(f"Total user skills in database: {user_skills_count}")
            
            # Show sample user skills
            cursor.execute("""
                SELECT c.name, s.name, us.proficiency 
                FROM user_skills us 
                JOIN candidate c ON us.user_id = c.id 
                JOIN skills s ON us.skill_id = s.id 
                LIMIT 5
            """)
            sample_skills = cursor.fetchall()
            print("\nSample user skills:")
            for user, skill, proficiency in sample_skills:
                print(f"  {user}: {skill} ({proficiency})")
        
        # Check candidate table for skills_json column
        cursor.execute("DESCRIBE candidate")
        columns = [row[0] for row in cursor.fetchall()]
        has_skills_json = 'skills_json' in columns
        print(f"\nCandidate table has skills_json column: {has_skills_json}")
        
        if has_skills_json:
            cursor.execute("SELECT name, skills_json FROM candidate WHERE skills_json IS NOT NULL AND skills_json != '[]' LIMIT 3")
            candidates_with_skills = cursor.fetchall()
            print("\nCandidates with skills_json:")
            for name, skills_json in candidates_with_skills:
                print(f"  {name}: {skills_json}")

if __name__ == "__main__":
    test_skills_storage()