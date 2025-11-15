import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'onboarding_project.settings')
django.setup()

from skills_management.models import Skill

# Sample skills data for AI-driven platform
skills_data = [
    # Programming Languages
    {'name': 'Python', 'category': 'PROGRAMMING', 'description': 'Versatile programming language for data science, web development, and automation', 'is_trending': True, 'demand_score': 95},
    {'name': 'JavaScript', 'category': 'PROGRAMMING', 'description': 'Essential language for web development and modern applications', 'is_trending': True, 'demand_score': 92},
    {'name': 'Java', 'category': 'PROGRAMMING', 'description': 'Enterprise-grade programming language for large-scale applications', 'is_trending': False, 'demand_score': 85},
    {'name': 'TypeScript', 'category': 'PROGRAMMING', 'description': 'Typed superset of JavaScript for better code quality', 'is_trending': True, 'demand_score': 88},
    
    # Frameworks
    {'name': 'React', 'category': 'FRAMEWORK', 'description': 'Popular JavaScript library for building user interfaces', 'is_trending': True, 'demand_score': 90},
    {'name': 'Django', 'category': 'FRAMEWORK', 'description': 'High-level Python web framework for rapid development', 'is_trending': False, 'demand_score': 75},
    {'name': 'Node.js', 'category': 'FRAMEWORK', 'description': 'JavaScript runtime for server-side development', 'is_trending': True, 'demand_score': 87},
    {'name': 'Angular', 'category': 'FRAMEWORK', 'description': 'TypeScript-based web application framework', 'is_trending': False, 'demand_score': 70},
    
    # Databases
    {'name': 'SQL', 'category': 'DATABASE', 'description': 'Standard language for relational database management', 'is_trending': False, 'demand_score': 93},
    {'name': 'MongoDB', 'category': 'DATABASE', 'description': 'NoSQL document database for modern applications', 'is_trending': True, 'demand_score': 78},
    {'name': 'PostgreSQL', 'category': 'DATABASE', 'description': 'Advanced open-source relational database', 'is_trending': False, 'demand_score': 82},
    
    # Cloud Technologies
    {'name': 'AWS', 'category': 'CLOUD', 'description': 'Amazon Web Services cloud computing platform', 'is_trending': True, 'demand_score': 94},
    {'name': 'Azure', 'category': 'CLOUD', 'description': 'Microsoft cloud computing platform', 'is_trending': True, 'demand_score': 85},
    {'name': 'Google Cloud', 'category': 'CLOUD', 'description': 'Google Cloud Platform for scalable applications', 'is_trending': True, 'demand_score': 80},
    
    # DevOps
    {'name': 'Docker', 'category': 'DEVOPS', 'description': 'Containerization platform for application deployment', 'is_trending': True, 'demand_score': 89},
    {'name': 'Kubernetes', 'category': 'DEVOPS', 'description': 'Container orchestration platform', 'is_trending': True, 'demand_score': 86},
    {'name': 'Git', 'category': 'DEVOPS', 'description': 'Version control system for code management', 'is_trending': False, 'demand_score': 98},
    {'name': 'CI/CD', 'category': 'DEVOPS', 'description': 'Continuous Integration and Deployment practices', 'is_trending': True, 'demand_score': 91},
    
    # Data Science & Analytics
    {'name': 'Tableau', 'category': 'OTHER', 'description': 'Data visualization and business intelligence tool', 'is_trending': True, 'demand_score': 83},
    {'name': 'Excel', 'category': 'OTHER', 'description': 'Spreadsheet application for data analysis', 'is_trending': False, 'demand_score': 88},
    {'name': 'Statistics', 'category': 'OTHER', 'description': 'Mathematical analysis of data and patterns', 'is_trending': False, 'demand_score': 79},
    {'name': 'Machine Learning', 'category': 'OTHER', 'description': 'AI techniques for predictive modeling', 'is_trending': True, 'demand_score': 92},
    
    # Design
    {'name': 'Figma', 'category': 'DESIGN', 'description': 'Collaborative design tool for UI/UX', 'is_trending': True, 'demand_score': 85},
    {'name': 'Adobe XD', 'category': 'DESIGN', 'description': 'User experience design software', 'is_trending': False, 'demand_score': 72},
    {'name': 'Prototyping', 'category': 'DESIGN', 'description': 'Creating interactive mockups and wireframes', 'is_trending': True, 'demand_score': 78},
    {'name': 'User Research', 'category': 'DESIGN', 'description': 'Understanding user needs and behaviors', 'is_trending': True, 'demand_score': 81},
    
    # Soft Skills
    {'name': 'Communication', 'category': 'SOFT_SKILL', 'description': 'Effective verbal and written communication', 'is_trending': False, 'demand_score': 96},
    {'name': 'Leadership', 'category': 'SOFT_SKILL', 'description': 'Ability to guide and motivate teams', 'is_trending': False, 'demand_score': 89},
    {'name': 'Problem Solving', 'category': 'SOFT_SKILL', 'description': 'Analytical thinking and solution development', 'is_trending': False, 'demand_score': 94},
    {'name': 'Project Management', 'category': 'SOFT_SKILL', 'description': 'Planning and executing projects effectively', 'is_trending': False, 'demand_score': 87},
]

def populate_skills():
    print("Populating skills database...")
    
    for skill_data in skills_data:
        skill, created = Skill.objects.get_or_create(
            name=skill_data['name'],
            defaults=skill_data
        )
        
        if created:
            print(f"+ Created skill: {skill.name}")
        else:
            print(f"- Skill already exists: {skill.name}")
    
    print(f"\nTotal skills in database: {Skill.objects.count()}")
    print("Skills population completed!")

if __name__ == '__main__':
    populate_skills()