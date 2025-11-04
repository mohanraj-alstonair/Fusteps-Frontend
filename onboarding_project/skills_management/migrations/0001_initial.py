# Migration for existing skills tables
from django.db import migrations

class Migration(migrations.Migration):
    initial = True
    
    dependencies = [
        ('onboarding_app', '0009_chatmessage_mentor_feedback_and_more'),
    ]
    
    operations = [
        # No operations - tables already exist
    ]
    
    # Mark as applied for existing tables
    atomic = False