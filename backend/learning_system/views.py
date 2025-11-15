from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
import json

@csrf_exempt
@api_view(['GET'])
def course_list(request):
    """Get all available courses"""
    sample_courses = [
        {
            'id': 1,
            'title': 'Advanced Python Programming',
            'description': 'Master advanced Python concepts and frameworks',
            'difficulty': 'INTERMEDIATE',
            'duration_hours': 40,
            'price': 99.99,
            'is_free': False,
            'enrollment_count': 1250,
            'average_rating': 4.7
        },
        {
            'id': 2,
            'title': 'React Development Fundamentals',
            'description': 'Learn React from basics to advanced concepts',
            'difficulty': 'BEGINNER',
            'duration_hours': 30,
            'price': 0.00,
            'is_free': True,
            'enrollment_count': 2100,
            'average_rating': 4.5
        }
    ]
    
    return JsonResponse({
        'courses': sample_courses,
        'total_count': len(sample_courses)
    })

@csrf_exempt
@api_view(['GET'])
def course_recommendations(request):
    """Get personalized course recommendations"""
    recommendations = [
        {
            'id': 1,
            'title': 'Advanced Python Programming',
            'difficulty': 'INTERMEDIATE',
            'duration_hours': 40,
            'relevance_score': 85.0,
            'addresses_skill': 'Python',
            'reason': 'Based on your skill gap analysis'
        },
        {
            'id': 3,
            'title': 'Machine Learning Basics',
            'difficulty': 'INTERMEDIATE',
            'duration_hours': 50,
            'relevance_score': 78.0,
            'addresses_skill': 'Machine Learning',
            'reason': 'Complements your programming skills'
        }
    ]
    
    return JsonResponse({
        'recommendations': recommendations,
        'reason': 'Based on your skill profile and career goals'
    })

@csrf_exempt
@api_view(['POST'])
def enroll_course(request, pk):
    """Enroll user in a course"""
    return JsonResponse({
        'course_id': pk,
        'enrollment_id': 1,
        'status': 'ACTIVE',
        'message': 'Successfully enrolled in course'
    })

@csrf_exempt
@api_view(['GET'])
def user_enrollments(request):
    """Get user's enrolled courses"""
    enrollments = [
        {
            'id': 1,
            'course': {
                'id': 1,
                'title': 'Advanced Python Programming',
                'difficulty': 'INTERMEDIATE'
            },
            'status': 'ACTIVE',
            'progress_percentage': 45,
            'enrolled_at': '2024-01-15T10:00:00Z'
        }
    ]
    
    return JsonResponse({
        'enrollments': enrollments,
        'total_count': len(enrollments)
    })

@csrf_exempt
@api_view(['POST'])
def mark_module_completed(request, pk):
    """Mark a learning module as completed"""
    return JsonResponse({
        'module_id': pk,
        'completed': True,
        'progress_updated': True,
        'message': 'Module marked as completed'
    })

@csrf_exempt
@api_view(['GET'])
def user_certificates(request):
    """Get user's earned certificates"""
    certificates = [
        {
            'id': 1,
            'course_title': 'React Development Fundamentals',
            'certificate_id': 'CERT-2024-001',
            'issued_date': '2024-01-20T15:30:00Z',
            'verification_url': 'https://fusteps.com/verify/CERT-2024-001'
        }
    ]
    
    return JsonResponse({
        'certificates': certificates,
        'total_count': len(certificates)
    })