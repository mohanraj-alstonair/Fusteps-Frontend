#!/usr/bin/env python
"""
Setup script for ATS System and Learning System integration
"""
import os
import sys
import django
from django.core.management import execute_from_command_line

def setup_systems():
    """Setup ATS and Learning systems"""
    
    # Set Django settings
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'onboarding_project.settings')
    django.setup()
    
    print("🚀 Setting up ATS System and Learning System...")
    
    # Create media directories
    print("📁 Creating media directories...")
    media_dirs = [
        'media/course_thumbnails',
        'media/resume_files',
        'media/certificates'
    ]
    
    for dir_path in media_dirs:
        os.makedirs(dir_path, exist_ok=True)
        print(f"   ✅ Created {dir_path}")
    
    # Run migrations
    print("\n🔄 Running migrations...")
    
    try:
        # Make migrations for new apps
        execute_from_command_line(['manage.py', 'makemigrations', 'ats_system'])
        print("   ✅ Created ATS system migrations")
    except Exception as e:
        print(f"   ⚠️  ATS migrations: {e}")
    
    try:
        execute_from_command_line(['manage.py', 'makemigrations', 'learning_system'])
        print("   ✅ Created Learning system migrations")
    except Exception as e:
        print(f"   ⚠️  Learning migrations: {e}")
    
    # Apply all migrations
    try:
        execute_from_command_line(['manage.py', 'migrate'])
        print("   ✅ Applied all migrations")
    except Exception as e:
        print(f"   ❌ Migration error: {e}")
    
    print("\n🎯 Integration complete!")
    print("\n📋 Next steps:")
    print("1. Test ATS endpoints: /api/ats/api/analysis/")
    print("2. Test Learning endpoints: /api/learning/api/courses/")
    print("3. Upload sample courses and resumes")

if __name__ == '__main__':
    setup_systems()