"""
Skill Tokenisation Service - Invisible Backend Workflow
Automatically generates tokens when skills are verified
"""

from .models import SkillToken, UserSkill, Skill
from onboarding_app.models import Candidate
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

class SkillTokenisationService:
    """
    Handles invisible skill tokenisation workflow
    - Triggers on skill completion/verification
    - Generates internal tokens for audit
    - Updates skill verification status
    """
    
    @staticmethod
    def skill_verified(student_id, skill_id, source='AI_VERIFIED', metadata=None):
        """
        Main trigger function - called when skill is verified
        
        Args:
            student_id: ID of the student
            skill_id: ID of the skill
            source: Verification source (COURSE_COMPLETION, ASSESSMENT_PASSED, etc.)
            metadata: Additional data for audit trail
        """
        try:
            user = Candidate.objects.get(id=student_id)
            skill = Skill.objects.get(id=skill_id)
            
            # Update UserSkill to verified status
            user_skill, created = UserSkill.objects.get_or_create(
                user=user,
                skill=skill,
                defaults={
                    'proficiency': 'INTERMEDIATE',
                    'is_verified': True
                }
            )
            
            if not created:
                user_skill.is_verified = True
                user_skill.save()
            
            # Generate invisible token for backend tracking
            token, token_created = SkillToken.objects.get_or_create(
                user=user,
                skill=skill,
                defaults={
                    'verification_source': source,
                    'confidence_score': 0.96,
                    'verified_by': 'FuSteps AI',
                    'metadata': metadata or {}
                }
            )
            
            logger.info(f"Skill verified: {user.name} - {skill.name} (Token: {token.token_id})")
            
            return {
                'success': True,
                'token_id': token.token_id,
                'verified': True
            }
            
        except Exception as e:
            logger.error(f"Skill verification failed: {e}")
            return {'success': False, 'error': str(e)}
    
    @staticmethod
    def course_completed(student_id, course_name, skills_learned):
        """
        Trigger when course is completed
        
        Args:
            student_id: Student ID
            course_name: Name of completed course
            skills_learned: List of skill names learned
        """
        results = []
        
        for skill_name in skills_learned:
            try:
                skill = Skill.objects.get(name=skill_name)
                result = SkillTokenisationService.skill_verified(
                    student_id=student_id,
                    skill_id=skill.id,
                    source='COURSE_COMPLETION',
                    metadata={
                        'course_name': course_name,
                        'completion_date': datetime.now().isoformat()
                    }
                )
                results.append(result)
            except Skill.DoesNotExist:
                logger.warning(f"Skill not found: {skill_name}")
                
        return results
    
    @staticmethod
    def assessment_passed(student_id, assessment_name, skill_name, score):
        """
        Trigger when assessment is passed
        """
        try:
            skill = Skill.objects.get(name=skill_name)
            return SkillTokenisationService.skill_verified(
                student_id=student_id,
                skill_id=skill.id,
                source='ASSESSMENT_PASSED',
                metadata={
                    'assessment_name': assessment_name,
                    'score': score,
                    'passed_date': datetime.now().isoformat()
                }
            )
        except Skill.DoesNotExist:
            return {'success': False, 'error': f'Skill not found: {skill_name}'}
    
    @staticmethod
    def get_verification_status(student_id, skill_id):
        """
        Check if skill is verified (for UI display)
        """
        try:
            user_skill = UserSkill.objects.get(
                user_id=student_id,
                skill_id=skill_id
            )
            return {
                'verified': user_skill.is_verified,
                'proficiency': user_skill.proficiency
            }
        except UserSkill.DoesNotExist:
            return {'verified': False}
    
    @staticmethod
    def get_student_tokens(student_id):
        """
        Get all tokens for a student (admin view only)
        """
        tokens = SkillToken.objects.filter(user_id=student_id).select_related('skill')
        return [{
            'token_id': token.token_id,
            'skill_name': token.skill.name,
            'verified_on': token.verified_on,
            'verified_by': token.verified_by,
            'source': token.verification_source,
            'confidence': token.confidence_score
        } for token in tokens]
    
    @staticmethod
    def verify_token(token_id):
        """
        Verify token authenticity (for employers/admins)
        """
        try:
            token = SkillToken.objects.get(token_id=token_id)
            return {
                'valid': token.status == 'ACTIVE',
                'token_id': token.token_id,
                'skill_name': token.skill.name,
                'student_name': token.user.name,
                'verified_by': token.verified_by,
                'verified_on': token.verified_on.isoformat(),
                'confidence': token.confidence_score
            }
        except SkillToken.DoesNotExist:
            return {'valid': False, 'error': 'Token not found'}

# Usage Examples:
"""
# When course is completed
SkillTokenisationService.course_completed(
    student_id=123,
    course_name="Python Basics",
    skills_learned=["Python", "Programming"]
)

# When assessment is passed
SkillTokenisationService.assessment_passed(
    student_id=123,
    assessment_name="Python Quiz",
    skill_name="Python",
    score=85
)

# Check verification status for UI
status = SkillTokenisationService.get_verification_status(
    student_id=123,
    skill_id=1
)
# Returns: {'verified': True, 'proficiency': 'INTERMEDIATE'}
"""