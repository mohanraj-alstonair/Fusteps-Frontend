# Generated manually for project ideas

from django.db import migrations, models, connection


def check_column_exists(table_name, column_name):
    """Check if a column exists in a table"""
    with connection.cursor() as cursor:
        cursor.execute(
            "SELECT COUNT(*) FROM information_schema.columns WHERE table_name = %s AND column_name = %s AND table_schema = DATABASE()",
            [table_name, column_name]
        )
        return cursor.fetchone()[0] > 0


def add_project_fields(apps, schema_editor):
    """Add project idea fields if they don't exist"""
    fields_to_add = [
        ('project_title', 'VARCHAR(255) NULL'),
        ('project_description', 'TEXT NULL'),
        ('estimated_time', 'VARCHAR(100) NULL'),
        ('difficulty_level', 'VARCHAR(50) NULL'),
        ('skills_involved', 'TEXT NULL'),
        ('project_category', 'VARCHAR(100) NULL'),
    ]
    
    with connection.cursor() as cursor:
        for field_name, field_type in fields_to_add:
            if not check_column_exists('candidate', field_name):
                cursor.execute(f"ALTER TABLE candidate ADD COLUMN {field_name} {field_type}")


def remove_project_fields(apps, schema_editor):
    """Remove project idea fields if they exist"""
    fields_to_remove = [
        'project_title', 'project_description', 'estimated_time',
        'difficulty_level', 'skills_involved', 'project_category'
    ]
    
    with connection.cursor() as cursor:
        for field_name in fields_to_remove:
            if check_column_exists('candidate', field_name):
                cursor.execute(f"ALTER TABLE candidate DROP COLUMN {field_name}")


class Migration(migrations.Migration):

    dependencies = [
        ('onboarding_app', '0017_candidate_career_objective_candidate_course_and_more'),
    ]

    operations = [
        migrations.RunPython(add_project_fields, remove_project_fields),
    ]