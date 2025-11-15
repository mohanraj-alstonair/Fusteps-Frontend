#!/usr/bin/env python
"""
Script to add missing columns to the existing candidate table
"""
import os
import sys
import django
from django.db import connection

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'onboarding_project.settings')
django.setup()

def add_missing_columns():
    """Add missing columns to candidate table if they don't exist"""
    with connection.cursor() as cursor:
        # Check existing columns
        cursor.execute("DESCRIBE candidate")
        existing_columns = [row[0] for row in cursor.fetchall()]
        
        # Define new columns to add
        new_columns = {
            'skills_json': 'JSON DEFAULT (JSON_ARRAY())',
            'career_goals': 'TEXT',
            'linkedin_profile': 'VARCHAR(200)',
            'portfolio_url': 'VARCHAR(200)',
            'cgpa': 'DECIMAL(4,2)',
            'status': "VARCHAR(20) DEFAULT 'active'",
            'verified': 'BOOLEAN DEFAULT FALSE',
            'last_login': 'DATETIME',
            'join_date': 'DATETIME DEFAULT CURRENT_TIMESTAMP',
            'department': 'VARCHAR(200)'
        }
        
        # Add missing columns
        for column_name, column_def in new_columns.items():
            if column_name not in existing_columns:
                try:
                    cursor.execute(f"ALTER TABLE candidate ADD COLUMN {column_name} {column_def}")
                    print(f"Added column: {column_name}")
                except Exception as e:
                    print(f"Error adding {column_name}: {e}")
            else:
                print(f"Column {column_name} already exists")

if __name__ == "__main__":
    print("Checking and adding missing columns to candidate table...")
    add_missing_columns()
    print("Done!")