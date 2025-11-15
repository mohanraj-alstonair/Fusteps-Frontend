"""
Admin Views for Skill Tokenisation - Backend Audit Interface
Only visible to admins for verification and audit purposes
"""

from django.contrib.admin.views.decorators import staff_member_required
from django.http import JsonResponse
from django.shortcuts import render
from .models import SkillToken, UserSkill, Skill
from .skill_tokenisation import SkillTokenisationService
from onboarding_app.models import Candidate

@staff_member_required
def token_audit_dashboard(request):
    """Admin dashboard to view all skill tokens for audit"""
    tokens = SkillToken.objects.select_related('user', 'skill').order_by('-verified_on')[:100]
    
    context = {
        'tokens': tokens,
        'total_tokens': SkillToken.objects.count(),
        'verified_skills': UserSkill.objects.filter(is_verified=True).count(),
        'pending_skills': UserSkill.objects.filter(is_verified=False).count()
    }
    
    return render(request, 'admin/token_audit.html', context)

@staff_member_required
def student_token_report(request, student_id):
    """Get detailed token report for a specific student"""
    try:
        student = Candidate.objects.get(id=student_id)
        tokens = SkillTokenisationService.get_student_tokens(student_id)
        
        return JsonResponse({
            'student_name': student.name,
            'student_email': student.email,
            'total_verified_skills': len(tokens),
            'tokens': tokens
        })
    except Candidate.DoesNotExist:
        return JsonResponse({'error': 'Student not found'}, status=404)

@staff_member_required
def verify_token_api(request, token_id):
    """API endpoint for token verification"""
    result = SkillTokenisationService.verify_token(token_id)
    return JsonResponse(result)

@staff_member_required
def skill_verification_stats(request):
    """Get overall skill verification statistics"""
    stats = {
        'total_skills': Skill.objects.count(),
        'total_tokens': SkillToken.objects.count(),
        'verified_skills': UserSkill.objects.filter(is_verified=True).count(),
        'verification_sources': {}
    }
    
    # Count by verification source
    for source, _ in SkillToken._meta.get_field('verification_source').choices:
        count = SkillToken.objects.filter(verification_source=source).count()
        stats['verification_sources'][source] = count
    
    return JsonResponse(stats)