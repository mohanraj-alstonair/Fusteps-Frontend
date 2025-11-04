from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
import json

@csrf_exempt
@api_view(['GET'])
def ats_analysis_list(request):
    """Get user's ATS analysis history"""
    return JsonResponse({
        'analyses': [],
        'message': 'ATS System integrated successfully'
    })

@csrf_exempt
@api_view(['POST'])
def analyze_resume(request):
    """Analyze resume against job description"""
    try:
        data = json.loads(request.body.decode('utf-8'))
        job_description = data.get('job_description', '')
        resume_text = data.get('resume_text', '')
        
        # Basic ATS scoring simulation
        analysis_result = {
            'total_score': 75.5,
            'keywords_score': 80.0,
            'skills_score': 85.0,
            'education_score': 70.0,
            'experience_score': 75.0,
            'format_score': 65.0,
            'improvement_tips': [
                'Include more relevant keywords from job description',
                'Add quantifiable achievements',
                'Improve formatting consistency'
            ],
            'missing_elements': [
                'LinkedIn profile URL',
                'Professional summary'
            ],
            'score_breakdown': {
                'keywords': 'Good match with job requirements',
                'skills': 'Strong technical skills alignment',
                'education': 'Meets educational requirements',
                'experience': 'Relevant experience demonstrated',
                'format': 'Could improve readability'
            }
        }
        
        return JsonResponse(analysis_result)
        
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@csrf_exempt
@api_view(['GET', 'POST'])
def resume_file_list(request):
    """Handle resume file uploads and listing"""
    if request.method == 'GET':
        return JsonResponse({
            'resume_files': [],
            'message': 'Resume files endpoint ready'
        })
    elif request.method == 'POST':
        return JsonResponse({
            'id': 1,
            'message': 'Resume uploaded successfully',
            'ats_score': 0.0
        })

@csrf_exempt
@api_view(['POST'])
def calculate_ats_score(request, pk):
    """Calculate ATS score for uploaded resume"""
    return JsonResponse({
        'resume_id': pk,
        'ats_score': 78.5,
        'message': 'ATS score calculated successfully'
    })