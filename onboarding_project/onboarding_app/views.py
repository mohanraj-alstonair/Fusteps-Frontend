from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
import pdfplumber
import re
from .models import Candidate, ChatMessage, BookedSession
from skills_management.models import Skill, UserSkill
from .serializers import ChatMessageSerializer
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from django.db import models
from django.utils import timezone
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from .logger import setup_logger

logger = setup_logger()

@csrf_exempt
def onboarding(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'POST required'}, status=405)

    try:
        # Handle both JSON and form data
        if request.content_type == 'application/json':
            data = json.loads(request.body.decode('utf-8'))
        else:
            data = request.POST

        # Get user ID from request or data
        user_id = data.get('user_id') or request.GET.get('user_id')
        if not user_id:
            return JsonResponse({'error': 'User ID is required'}, status=400)

        # Extract onboarding fields
        phone = data.get('phone')
        university = data.get('university', '')
        field_of_study = data.get('field_of_study', '')
        year_of_passout = data.get('year_of_passout')
        degree = data.get('degree', '')
        cgpa = data.get('cgpa', '')
        skills = data.get('skills', '')
        career_goals = data.get('careerGoals', '')
        linkedin = data.get('linkedIn', '')
        portfolio = data.get('portfolio', '')
        
        # Parse skills if it's a JSON string
        skills_list = []
        if skills:
            try:
                skills_list = json.loads(skills) if isinstance(skills, str) else skills
            except:
                skills_list = []

        if not all([phone, year_of_passout]):
            return JsonResponse({'error': 'Phone and graduation year are required'}, status=400)

        # Convert year_of_passout to integer if provided
        year_of_passout_int = None
        if year_of_passout:
            try:
                year_of_passout_int = int(year_of_passout)
            except ValueError:
                return JsonResponse({'error': 'Invalid graduation year format'}, status=400)

        # Handle resume file if provided
        resume_file_content = None
        resume_filename = None
        if 'resume_file' in request.FILES:
            resume_file = request.FILES['resume_file']
            if resume_file.name.lower().endswith('.pdf'):
                resume_file_content = resume_file.read()
                resume_filename = resume_file.name

        # Update existing candidate with onboarding data
        try:
            candidate = Candidate.objects.get(id=user_id)
            
            # Update onboarding fields
            candidate.phone = phone
            candidate.university = university
            candidate.field_of_study = field_of_study
            candidate.year_of_passout = year_of_passout_int
            candidate.degree = degree
            candidate.onboarding_completed = True  # Mark onboarding as complete
            
            if resume_file_content:
                candidate.resume_file = resume_file_content
                candidate.resume_filename = resume_filename
            
            candidate.save()
            
            # Handle skills through UserSkill model (with error handling)
            try:
                UserSkill.objects.filter(user=candidate).delete()  # Clear existing
                for skill_name in skills_list:
                    if skill_name.strip():
                        skill, created = Skill.objects.get_or_create(
                            name=skill_name.strip(),
                            defaults={'category': 'PROGRAMMING'}
                        )
                        UserSkill.objects.create(
                            user=candidate, 
                            skill=skill, 
                            proficiency='BEGINNER',
                            years_of_experience=0.0,
                            is_certified=False,
                            is_verified=False  # Just claimed during onboarding
                        )
            except Exception as skill_error:
                logger.warning(f"Error handling skills: {str(skill_error)}")

            return JsonResponse({
                'message': 'Onboarding completed successfully',
                'candidate_id': candidate.id,
                'onboarding_completed': True
            })
            
        except Candidate.DoesNotExist:
            return JsonResponse({'error': 'User not found'}, status=404)

    except Exception as e:
        logger.error(f"Onboarding error: {str(e)}")
        return JsonResponse({'error': str(e)}, status=500)

@csrf_exempt
def get_user_profile(request, user_id):
    if request.method != 'GET':
        return JsonResponse({'error': 'GET required'}, status=405)

    try:
        print(f"Fetching profile for user_id: {user_id}")
        candidate = Candidate.objects.get(id=user_id)
        print(f"Found candidate: {candidate.name} ({candidate.email})")
        
        # Get user skills from database
        user_skills = []
        try:
            skills_query = UserSkill.objects.filter(user=candidate).select_related('skill')
            user_skills = [{
                'id': us.skill.id,
                'name': us.skill.name,
                'category': us.skill.category,
                'proficiency': us.proficiency,
                'years_of_experience': us.years_of_experience,
                'is_certified': us.is_certified,
                'is_verified': us.is_verified
            } for us in skills_query]
        except Exception as e:
            logger.warning(f"Error fetching skills for user {user_id}: {str(e)}")
            user_skills = []
        
        # Build comprehensive profile data
        profile_data = {
            'id': candidate.id,
            'name': candidate.name or '',
            'email': candidate.email or '',
            'phone': candidate.phone or '',
            'role': candidate.role or '',
            'university': candidate.university or '',
            'field_of_study': candidate.field_of_study or '',
            'degree': candidate.degree or '',
            'year_of_passout': candidate.year_of_passout,
            'location': candidate.location or '',
            'company_name': candidate.company_name or '',
            'expertise': candidate.expertise or '',
            'experience': candidate.experience or 0,
            'education_level': candidate.education_level or '',
            'mentor_role': candidate.mentor_role or '',
            'employer_role': candidate.employer_role or '',
            'skills': user_skills,
            'has_resume': bool(candidate.resume_file),
            'resume_filename': candidate.resume_filename or '',
            'created_at': candidate.id,  # Using ID as creation indicator
            'profile_completion': calculate_profile_completion(candidate, user_skills)
        }
        
        logger.info(f"Profile data fetched for user {user_id}: {len(user_skills)} skills found")
        return JsonResponse(profile_data)
        
    except Candidate.DoesNotExist:
        return JsonResponse({'error': 'User not found'}, status=404)
    except Exception as e:
        logger.error(f"Error fetching profile for user {user_id}: {str(e)}")
        return JsonResponse({'error': str(e)}, status=500)

def calculate_profile_completion(candidate, skills):
    """Calculate profile completion percentage"""
    total_fields = 0
    completed_fields = 0
    
    # Basic fields (always count)
    basic_fields = ['name', 'email', 'phone']
    for field in basic_fields:
        total_fields += 1
        if getattr(candidate, field, None):
            completed_fields += 1
    
    # Role-specific fields
    if candidate.role == 'student':
        student_fields = ['university', 'field_of_study', 'degree', 'year_of_passout']
        for field in student_fields:
            total_fields += 1
            if getattr(candidate, field, None):
                completed_fields += 1
    elif candidate.role == 'mentor':
        mentor_fields = ['expertise', 'experience', 'education_level', 'company_name']
        for field in mentor_fields:
            total_fields += 1
            if getattr(candidate, field, None):
                completed_fields += 1
    elif candidate.role == 'employer':
        employer_fields = ['company_name', 'location', 'employer_role']
        for field in employer_fields:
            total_fields += 1
            if getattr(candidate, field, None):
                completed_fields += 1
    
    # Skills
    total_fields += 1
    if skills:
        completed_fields += 1
    
    return int((completed_fields / total_fields) * 100) if total_fields > 0 else 0

@csrf_exempt
def update_user_profile(request, user_id):
    if request.method != 'PUT':
        return JsonResponse({'error': 'PUT required'}, status=405)

    try:
        candidate = Candidate.objects.get(id=user_id)
        
        # Handle both JSON and form data
        if request.content_type == 'application/json':
            data = json.loads(request.body.decode('utf-8'))
        else:
            data = request.POST
        
        logger.info(f"Updating profile for user {user_id} with data: {data}")
        
        # Update basic fields
        updateable_fields = [
            'name', 'email', 'phone', 'university', 'field_of_study', 'degree',
            'location', 'company_name', 'expertise', 'education_level', 
            'mentor_role', 'employer_role'
        ]
        
        for field in updateable_fields:
            if field in data:
                setattr(candidate, field, data[field])
        
        # Handle numeric fields
        if 'year_of_passout' in data and data['year_of_passout']:
            try:
                candidate.year_of_passout = int(data['year_of_passout'])
            except (ValueError, TypeError):
                return JsonResponse({'error': 'Invalid year format'}, status=400)
        
        if 'experience' in data and data['experience']:
            try:
                candidate.experience = int(data['experience'])
            except (ValueError, TypeError):
                return JsonResponse({'error': 'Invalid experience format'}, status=400)
        
        # Handle skills update
        if 'skills' in data:
            skills_data = data['skills'] if isinstance(data['skills'], list) else []
            print(f"Updating skills for user {user_id}: {skills_data}")
            logger.info(f"Updating skills for user {user_id}: {skills_data}")
            
            try:
                # Clear existing skills
                UserSkill.objects.filter(user=candidate).delete()
                
                # Add new skills
                for skill_data in skills_data:
                    if isinstance(skill_data, dict) and 'name' in skill_data:
                        skill, created = Skill.objects.get_or_create(
                            name=skill_data['name'],
                            defaults={
                                'category': skill_data.get('category', 'PROGRAMMING'),
                                'description': skill_data.get('description', ''),
                                'is_trending': skill_data.get('is_trending', False),
                                'demand_score': skill_data.get('demand_score', 0)
                            }
                        )
                        
                        # Create UserSkill with proper verification
                        years_exp = float(skill_data.get('years_of_experience', 0.0))
                        is_cert = bool(skill_data.get('is_certified', False))
                        
                        # Apply verification logic
                        is_verified = is_cert or years_exp >= 2.0
                        
                        UserSkill.objects.create(
                            user=candidate,
                            skill=skill,
                            proficiency=skill_data.get('proficiency', 'BEGINNER'),
                            years_of_experience=years_exp,
                            is_certified=is_cert,
                            is_verified=is_verified
                        )
                        
                logger.info(f"Successfully updated {len(skills_data)} skills for user {user_id}")
            except Exception as e:
                logger.error(f"Error updating skills for user {user_id}: {str(e)}")
                return JsonResponse({'error': f'Error updating skills: {str(e)}'}, status=500)
        
        candidate.save()
        
        # Fetch updated profile data
        updated_skills = []
        try:
            skills_query = UserSkill.objects.filter(user=candidate).select_related('skill')
            updated_skills = [{
                'id': us.skill.id,
                'name': us.skill.name,
                'category': us.skill.category,
                'proficiency': us.proficiency,
                'years_of_experience': us.years_of_experience,
                'is_certified': us.is_certified
            } for us in skills_query]
        except Exception as e:
            logger.warning(f"Error fetching updated skills: {str(e)}")
        
        return JsonResponse({
            'message': 'Profile updated successfully',
            'profile': {
                'id': candidate.id,
                'name': candidate.name or '',
                'email': candidate.email or '',
                'phone': candidate.phone or '',
                'role': candidate.role or '',
                'university': candidate.university or '',
                'field_of_study': candidate.field_of_study or '',
                'degree': candidate.degree or '',
                'year_of_passout': candidate.year_of_passout,
                'location': candidate.location or '',
                'company_name': candidate.company_name or '',
                'expertise': candidate.expertise or '',
                'experience': candidate.experience or 0,
                'education_level': candidate.education_level or '',
                'mentor_role': candidate.mentor_role or '',
                'employer_role': candidate.employer_role or '',
                'skills': updated_skills,
                'profile_completion': calculate_profile_completion(candidate, updated_skills)
            }
        })
        
    except Candidate.DoesNotExist:
        return JsonResponse({'error': 'User not found'}, status=404)
    except Exception as e:
        logger.error(f"Error updating profile for user {user_id}: {str(e)}")
        return JsonResponse({'error': str(e)}, status=500)

@csrf_exempt
def get_profile_data(request, user_id):
    """Get comprehensive profile data including statistics and related information"""
    if request.method != 'GET':
        return JsonResponse({'error': 'GET required'}, status=405)

    try:
        candidate = Candidate.objects.get(id=user_id)
        
        # Get user skills
        user_skills = []
        skills_count = 0
        try:
            from django.db import connection
            with connection.cursor() as cursor:
                cursor.execute(
                    "SELECT s.id, s.name, s.category, s.description, s.is_trending, s.demand_score, "
                    "us.proficiency, us.years_of_experience, us.is_certified "
                    "FROM skills s JOIN user_skills us ON s.id = us.skill_id "
                    "WHERE us.user_id = %s ORDER BY s.name",
                    [user_id]
                )
                skills_data = cursor.fetchall()
                
                for skill in skills_data:
                    user_skills.append({
                        'id': skill[0],
                        'name': skill[1],
                        'category': skill[2],
                        'description': skill[3] or '',
                        'is_trending': bool(skill[4]),
                        'demand_score': skill[5],
                        'proficiency': skill[6],
                        'years_of_experience': float(skill[7]),
                        'is_certified': bool(skill[8])
                    })
                skills_count = len(user_skills)
        except Exception as e:
            logger.warning(f"Error fetching skills for user {user_id}: {str(e)}")
        
        # Calculate profile completion
        profile_completion = calculate_profile_completion(candidate, user_skills)
        
        # Build comprehensive response
        profile_data = {
            'id': candidate.id,
            'name': candidate.name or '',
            'email': candidate.email or '',
            'phone': candidate.phone or '',
            'role': candidate.role or '',
            'university': candidate.university or '',
            'field_of_study': candidate.field_of_study or '',
            'degree': candidate.degree or '',
            'year_of_passout': candidate.year_of_passout,
            'location': candidate.location or '',
            'company_name': candidate.company_name or '',
            'expertise': candidate.expertise or '',
            'experience': candidate.experience or 0,
            'education_level': candidate.education_level or '',
            'mentor_role': candidate.mentor_role or '',
            'employer_role': candidate.employer_role or '',
            'skills': user_skills,
            'skills_count': skills_count,
            'profile_completion': profile_completion,
            'last_updated': timezone.now().isoformat()
        }
        
        logger.info(f"Comprehensive profile data fetched for user {user_id}")
        return JsonResponse(profile_data)
        
    except Candidate.DoesNotExist:
        return JsonResponse({'error': 'User not found'}, status=404)
    except Exception as e:
        logger.error(f"Error fetching comprehensive profile for user {user_id}: {str(e)}")
        return JsonResponse({'error': str(e)}, status=500)

@csrf_exempt
def get_all_skills(request):
    """Get all available skills from the database"""
    if request.method != 'GET':
        return JsonResponse({'error': 'GET required'}, status=405)
    
    try:
        from django.db import connection
        with connection.cursor() as cursor:
            cursor.execute(
                "SELECT id, name, category, description, is_trending, demand_score "
                "FROM skills ORDER BY name"
            )
            skills_data = cursor.fetchall()
            
            skills = []
            for skill in skills_data:
                skills.append({
                    'id': skill[0],
                    'name': skill[1],
                    'category': skill[2],
                    'description': skill[3] or '',
                    'is_trending': bool(skill[4]),
                    'demand_score': skill[5]
                })
        
        return JsonResponse({
            'skills': skills,
            'total_count': len(skills)
        })
        
    except Exception as e:
        logger.error(f"Error fetching all skills: {str(e)}")
        return JsonResponse({'error': str(e)}, status=500)

@csrf_exempt
def get_skill_recommendations(request, user_id):
    """Get personalized skill recommendations based on user profile"""
    if request.method != 'GET':
        return JsonResponse({'error': 'GET required'}, status=405)
    
    try:
        candidate = Candidate.objects.get(id=user_id)
        
        # Get user's current skills
        user_skills = []
        try:
            from django.db import connection
            with connection.cursor() as cursor:
                cursor.execute(
                    "SELECT s.name FROM skills s JOIN user_skills us ON s.id = us.skill_id WHERE us.user_id = %s",
                    [user_id]
                )
                user_skills = [row[0].lower() for row in cursor.fetchall()]
        except Exception:
            pass
        
        # Skill recommendations based on field of study and current skills
        recommendations = []
        field = candidate.field_of_study.lower() if candidate.field_of_study else ''
        
        # CS field recommendations based on current skills
        if 'cs' in field or 'computer' in field or 'software' in field:
            # If they have ML, recommend related skills
            if 'machine learning' in [s.lower() for s in user_skills]:
                ml_skills = ['Python', 'TensorFlow', 'PyTorch', 'Data Science', 'Deep Learning', 'Neural Networks']
                recommendations.extend([s for s in ml_skills if s.lower() not in user_skills])
            
            # If they have Cloud Computing, recommend related skills  
            if 'cloud computing' in [s.lower() for s in user_skills]:
                cloud_skills = ['AWS', 'Azure', 'Docker', 'Kubernetes', 'DevOps', 'Microservices']
                recommendations.extend([s for s in cloud_skills if s.lower() not in user_skills])
            
            # Core CS skills gap analysis
            core_skills = ['Python', 'JavaScript', 'SQL', 'Git', 'Data Structures', 'Algorithms']
            recommendations.extend([s for s in core_skills if s.lower() not in user_skills])
        
        # Remove duplicates and limit
        recommendations = list(dict.fromkeys(recommendations))
        
        return JsonResponse({
            'recommendations': recommendations[:10],  # Limit to 10
            'user_skills': user_skills
        })
        
    except Candidate.DoesNotExist:
        return JsonResponse({'error': 'User not found'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@csrf_exempt
def register_basic(request):
    """Step 1: Basic Registration Details"""
    if request.method != 'POST':
        return JsonResponse({'error': 'POST required'}, status=405)

    try:
        data = json.loads(request.body.decode('utf-8'))
        
        # Extract basic registration fields
        full_name = data.get('fullName')
        email = data.get('email')
        password = data.get('password')
        mobile_number = data.get('mobileNumber')
        work_status = data.get('workStatus')
        current_city = data.get('currentCity')

        if not all([full_name, email, password, mobile_number, work_status, current_city]):
            return JsonResponse({'error': 'All fields are required'}, status=400)

        if Candidate.objects.filter(email=email).exists():
            return JsonResponse({'error': 'Email already exists'}, status=400)

        # Handle resume upload if provided
        resume_file_content = None
        resume_filename = None
        if 'resume' in request.FILES:
            resume_file = request.FILES['resume']
            if resume_file.name.lower().endswith(('.pdf', '.doc', '.docx')):
                resume_file_content = resume_file.read()
                resume_filename = resume_file.name

        # Create candidate
        candidate = Candidate(
            full_name=full_name,
            email=email,
            mobile_number=mobile_number,
            work_status=work_status,
            current_city=current_city,
            registration_completed=True,
            resume_file=resume_file_content,
            resume_filename=resume_filename,
            # Legacy fields
            name=full_name,
            first_name=full_name.split()[0] if full_name else '',
            last_name=' '.join(full_name.split()[1:]) if len(full_name.split()) > 1 else ''
        )
        candidate.set_password(password)
        candidate.save()

        return JsonResponse({
            'success': True,
            'message': 'Basic registration completed',
            'candidate_id': candidate.id,
            'next_step': 'education'
        })

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@csrf_exempt
def register_education(request):
    """Step 2: Education Details"""
    if request.method != 'POST':
        return JsonResponse({'error': 'POST required'}, status=405)

    try:
        data = json.loads(request.body.decode('utf-8'))
        user_id = data.get('user_id')
        
        if not user_id:
            return JsonResponse({'error': 'User ID required'}, status=400)

        candidate = Candidate.objects.get(id=user_id)
        
        # Update education fields
        candidate.highest_qualification = data.get('highestQualification', '')
        candidate.course = data.get('course', '')
        candidate.course_type = data.get('courseType', 'Full Time')
        candidate.specialization = data.get('specialization', '')
        candidate.university_institute = data.get('universityInstitute', '')
        candidate.starting_year = data.get('startingYear')
        candidate.passing_year = data.get('passingYear')
        candidate.grading_system = data.get('gradingSystem', '')
        candidate.marks_percentage = data.get('marksPercentage')
        candidate.education_completed = True
        
        # Handle key skills
        key_skills = data.get('keySkills', [])
        if key_skills:
            try:
                UserSkill.objects.filter(user=candidate).delete()
                for skill_name in key_skills:
                    if skill_name.strip():
                        skill, created = Skill.objects.get_or_create(
                            name=skill_name.strip(),
                            defaults={'category': 'TECHNICAL'}
                        )
                        UserSkill.objects.create(
                            user=candidate,
                            skill=skill,
                            proficiency='BEGINNER'
                        )
            except Exception as e:
                logger.warning(f"Error handling skills: {str(e)}")
        
        candidate.save()

        return JsonResponse({
            'success': True,
            'message': 'Education details saved',
            'candidate_id': candidate.id,
            'next_step': 'profile_completion'
        })

    except Candidate.DoesNotExist:
        return JsonResponse({'error': 'User not found'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@csrf_exempt
def complete_profile(request):
    """Step 3: Profile Completion"""
    if request.method != 'POST':
        return JsonResponse({'error': 'POST required'}, status=405)

    try:
        data = json.loads(request.body.decode('utf-8'))
        user_id = data.get('user_id')
        
        if not user_id:
            return JsonResponse({'error': 'User ID required'}, status=400)

        candidate = Candidate.objects.get(id=user_id)
        
        # Update profile completion fields
        candidate.resume_headline = data.get('resumeHeadline', '')
        candidate.career_objective = data.get('careerObjective', '')
        candidate.preferred_locations = json.dumps(data.get('preferredLocations', []))
        candidate.expected_salary = data.get('expectedSalary', '')
        candidate.profile_completed = True
        candidate.onboarding_completed = True
        
        candidate.save()

        return JsonResponse({
            'success': True,
            'message': 'Profile completed successfully',
            'candidate_id': candidate.id,
            'completion_percentage': candidate.get_completion_percentage()
        })

    except Candidate.DoesNotExist:
        return JsonResponse({'error': 'User not found'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

# Keep original register for backward compatibility
@csrf_exempt
def register(request):
    return register_basic(request)

@csrf_exempt
def forgot_password(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'POST required'}, status=405)

    try:
        data = json.loads(request.body.decode('utf-8'))

        email = data.get('email')

        if not email:
            return JsonResponse({'error': 'Email required'}, status=400)

        try:
            candidate = Candidate.objects.get(email=email)
        except Candidate.DoesNotExist:
            return JsonResponse({'error': 'Email not found'}, status=404)
        except Candidate.MultipleObjectsReturned:
            return JsonResponse({'error': 'Multiple accounts found with this email. Please contact support.'}, status=400)

        # For demo purposes, set password to 'newpassword123'
        candidate.set_password('newpassword123')
        candidate.save()

        return JsonResponse({
            'status': 'success',
            'message': 'Password reset successful. Your new password is: newpassword123'
        })

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@csrf_exempt
def login(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'POST required'}, status=405)

    try:
        data = json.loads(request.body.decode('utf-8'))

        email = data.get('email')
        password = data.get('password')

        logger.info(f"Login attempt: email={email}")

        if not all([email, password]):
            logger.warning("Missing required fields: email or password")
            return JsonResponse({'error': 'Email and password required'}, status=400)

        try:
            candidate = Candidate.objects.get(email=email)
            logger.info(f"Found candidate: id={candidate.id}, name={candidate.name}, role={candidate.role}")
        except Candidate.DoesNotExist:
            logger.warning(f"No candidate found with email={email}")
            return JsonResponse({'error': 'Invalid credentials'}, status=401)
        except Candidate.MultipleObjectsReturned:
            logger.warning(f"Multiple candidates found with email={email}")
            return JsonResponse({'error': 'Multiple accounts found with this email. Please contact support.'}, status=400)

        if not candidate.check_password(password):
            logger.warning(f"Password check failed for candidate id={candidate.id}")
            return JsonResponse({'error': 'Invalid credentials'}, status=401)

        logger.info(f"Login successful for candidate id={candidate.id}")

        # Determine if user needs onboarding based on new registration flow
        needs_onboarding = False
        if candidate.role == 'student':
            # For new Naukri-style registration, check if all steps are completed
            if candidate.registration_completed:
                # New registration flow - check all three steps
                needs_onboarding = not (candidate.registration_completed and 
                                      candidate.education_completed and 
                                      candidate.profile_completed)
            else:
                # Legacy registration - check old onboarding_completed field
                needs_onboarding = not candidate.onboarding_completed
        
        return JsonResponse({
            'success': True,
            'message': 'Login successful',
            'user': {
                'id': candidate.id,
                'name': candidate.full_name or candidate.name,
                'first_name': candidate.first_name,
                'last_name': candidate.last_name,
                'email': candidate.email,
                'role': candidate.role,
                'onboarding_completed': not needs_onboarding
            }
        })

    except Exception as e:
        logger.error(f"Error in login: {str(e)}")
        return JsonResponse({'error': str(e)}, status=500)

@csrf_exempt
def get_mentors(request):
    if request.method != 'GET':
        return JsonResponse({'error': 'GET required'}, status=405)

    try:
        mentors = Candidate.objects.filter(role='mentor').order_by('-id').values(
            'id', 'name', 'email', 'expertise', 'experience', 'education_level', 'company_name', 'location', 'field_of_study', 'mentor_role'
        )
        return JsonResponse(list(mentors), safe=False)

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@csrf_exempt
def upload_resume(request):
    import os
    import tempfile
    from django.conf import settings

    if request.method != 'POST':
        return JsonResponse({'error': 'POST required'}, status=405)

    if 'file' not in request.FILES:
        return JsonResponse({'error': 'No file uploaded'}, status=400)

    file = request.FILES['file']

    if not file.name.lower().endswith('.pdf'):
        return JsonResponse({'error': 'Only PDF files allowed'}, status=400)

    try:
        # Read file content for blob storage
        file_content = file.read()
        file.seek(0)  # Reset file pointer
        
        # Create a temporary file to process the PDF
        with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as temp_file:
            for chunk in file.chunks():
                temp_file.write(chunk)
            temp_file_path = temp_file.name

        # Extract text from PDF
        with pdfplumber.open(temp_file_path) as pdf:
            text = ''
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + '\n'

        # Clean up temporary file
        os.unlink(temp_file_path)

        # Parse the extracted text
        parsed_data = parse_resume_text(text)
        
        # Store resume if user_id is provided
        user_id = request.POST.get('user_id')
        if user_id:
            try:
                candidate = Candidate.objects.get(id=user_id)
                candidate.resume_file = file_content
                candidate.resume_filename = file.name
                candidate.save()
                parsed_data['resume_stored'] = True
            except Candidate.DoesNotExist:
                parsed_data['resume_stored'] = False
        
        return JsonResponse(parsed_data)

    except Exception as e:
        # Clean up temporary file if it exists
        try:
            if 'temp_file_path' in locals():
                os.unlink(temp_file_path)
        except:
            pass
        return JsonResponse({'error': f'Failed to parse resume: {str(e)}'}, status=500)

def parse_resume_text(text):
    data = {}

    if not text or not text.strip():
        return {
            'name': '',
            'email': '',
            'phone': '',
            'university': '',
            'degree': '',
            'field_of_study': '',
            'year_of_passout': ''
        }

    # Clean the text
    text = text.replace('\r', '\n').replace('\t', ' ')
    lines = [line.strip() for line in text.split('\n') if line.strip()]

    # Extract email
    email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
    email_match = re.search(email_pattern, text, re.IGNORECASE)
    data['email'] = email_match.group() if email_match else ''

    # Extract phone number
    phone_patterns = [
        r'[\+]?[1-9][0-9]{7,15}',
        r'\(?\d{3}\)?[-\s]?\d{3}[-\s]?\d{4}',
        r'\d{10}'
    ]
    phone = ''
    for pattern in phone_patterns:
        phone_match = re.search(pattern, text)
        if phone_match:
            phone = phone_match.group()
            break
    data['phone'] = phone

    # Extract name (first non-empty line that doesn't contain email or phone)
    name = ''
    for line in lines[:5]:  # Check first 5 lines
        if (line and
            not re.search(email_pattern, line, re.IGNORECASE) and
            not re.search(r'[\+]?[0-9]{7,15}', line) and
            len(line.split()) <= 4 and  # Name shouldn't be too long
            not any(keyword in line.lower() for keyword in ['resume', 'cv', 'curriculum'])):
            name = line
            break
    data['name'] = name

    # Extract university/college
    university_keywords = ['university', 'college', 'institute', 'school', 'academy']
    university = ''
    for line in lines:
        if any(keyword in line.lower() for keyword in university_keywords):
            university = line.strip()
            break
    data['university'] = university

    # Extract degree
    degree_keywords = [
        'bachelor', 'master', 'phd', 'doctorate', 'b.tech', 'm.tech',
        'bsc', 'msc', 'ba', 'ma', 'bca', 'mca', 'be', 'me', 'bcom', 'mcom'
    ]
    degree = ''
    for line in lines:
        line_lower = line.lower()
        if any(keyword in line_lower for keyword in degree_keywords):
            degree = line.strip()
            break
    data['degree'] = degree

    # Extract field of study
    field_keywords = [
        'computer science', 'engineering', 'business', 'mathematics', 'physics',
        'chemistry', 'biology', 'economics', 'finance', 'marketing', 'management',
        'information technology', 'software', 'mechanical', 'electrical', 'civil'
    ]
    field_of_study = ''
    for line in lines:
        line_lower = line.lower()
        for field in field_keywords:
            if field in line_lower:
                field_of_study = field.title()
                break
        if field_of_study:
            break
    data['field_of_study'] = field_of_study

    # Extract graduation year
    year_pattern = r'\b(19|20)\d{2}\b'
    years = re.findall(year_pattern, text)
    # Filter years to reasonable graduation years (1990-2030)
    valid_years = [year for year in years if 1990 <= int(year) <= 2030]
    data['year_of_passout'] = valid_years[-1] if valid_years else ''

    return data

@api_view(['GET'])
def list_student_connections(request):
    try:
        student_id = request.query_params.get('student_id')
        if not student_id:
            return Response({'error': 'student_id query parameter required'}, status=status.HTTP_400_BAD_REQUEST)

        # Validate student exists
        try:
            student = Candidate.objects.get(id=student_id, role='student')
        except Candidate.DoesNotExist:
            return Response({'error': 'Student not found'}, status=status.HTTP_404_NOT_FOUND)

        # Get all connection requests from this student
        connection_requests = ChatMessage.objects.filter(
            sender_id=str(student_id),
            sender_type='student',
            status__in=['pending', 'accepted', 'rejected'],
            message_type='text'
        ).exclude(status='sent')
        
        # Build response with mentor info and connection status
        connections = []
        for req in connection_requests:
            try:
                mentor = Candidate.objects.get(id=req.receiver_id, role='mentor')

                # Get review count for this mentor
                mentor_review_count = ChatMessage.objects.filter(
                    receiver_id=str(req.receiver_id),
                    sender_type='student',
                    status='accepted',
                    ratings__isnull=False,
                    feedback__isnull=False
                ).count()

                connection_data = {
                    'id': req.id,
                    'mentor': int(req.receiver_id),
                    'mentor_name': mentor.name,
                    'mentor_email': mentor.email,
                    'status': req.status,
                    'created_at': req.timestamp.isoformat(),
                    'feedback_submitted': req.ratings is not None and req.feedback is not None,
                    'mentor_review_count': mentor_review_count
                }

                # Add mentor feedback data if it exists in the connection
                if req.mentor_ratings is not None and req.mentor_feedback is not None:
                    connection_data['mentor_ratings'] = req.mentor_ratings
                    connection_data['mentor_feedback'] = req.mentor_feedback

                connections.append(connection_data)
            except Candidate.DoesNotExist:
                continue

        return Response(connections, status=status.HTTP_200_OK)

    except Exception as e:
        logger.error(f"Error in list_student_connections: {str(e)}")
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# Chat Message APIs
@api_view(['POST'])
def send_message(request):
    try:
        content = request.data.get('content')
        sender_type = request.data.get('sender_type')
        sender_id = request.data.get('sender_id')
        receiver_id = request.data.get('receiver_id')

        if not all([content, sender_type, sender_id, receiver_id]):
            return Response({'error': 'content, sender_type, sender_id, and receiver_id are required'}, status=status.HTTP_400_BAD_REQUEST)

        # Determine student and mentor IDs for consistent conversation lookup
        if sender_type == 'student':
            student_id = str(sender_id)
            mentor_id = str(receiver_id)
        else:
            student_id = str(receiver_id)
            mentor_id = str(sender_id)

        # Check if connection is accepted (look for connection in both directions)
        connection = ChatMessage.objects.filter(
            models.Q(
                sender_id=student_id,
                receiver_id=mentor_id,
                sender_type='student'
            ) | models.Q(
                sender_id=mentor_id,
                receiver_id=student_id,
                sender_type='mentor'
            ),
            status='accepted',
            message_type='text'
        ).first()
        
        if not connection:
            return Response({'error': 'No accepted connection found'}, status=status.HTTP_403_FORBIDDEN)

        # Find or create conversation record (always use student as sender for consistency)
        conversation_record = ChatMessage.objects.filter(
            sender_id=student_id,
            receiver_id=mentor_id,
            sender_type='student',
            is_conversation=True
        ).first()

        if not conversation_record:
            conversation_record = ChatMessage.objects.create(
                sender_type='student',
                sender_id=student_id,
                receiver_id=mentor_id,
                content='Conversation started',
                is_conversation=True,
                conversation_data=[]
            )

        # Create message object for JSON storage
        new_message = {
            'id': len(conversation_record.conversation_data) + 1,
            'sender_type': sender_type,
            'sender_id': str(sender_id),
            'receiver_id': str(receiver_id),
            'content': content,
            'timestamp': timezone.now().isoformat(),
            'status': 'sent'
        }

        # Add message to conversation JSON
        conversation_record.conversation_data.append(new_message)
        conversation_record.timestamp = timezone.now()  # Update last activity
        conversation_record.save()

        # Send via WebSocket
        channel_layer = get_channel_layer()
        room_ids = sorted([student_id, mentor_id])
        room_group_name = f'chat_{room_ids[0]}_{room_ids[1]}'
        async_to_sync(channel_layer.group_send)(
            room_group_name,
            {
                'type': 'chat_message',
                'message': new_message,
                'sender_id': str(sender_id),
                'receiver_id': str(receiver_id)
            }
        )

        return Response(new_message, status=status.HTTP_201_CREATED)

    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def list_messages(request):
    try:
        sender_id = request.query_params.get('sender_id')
        receiver_id = request.query_params.get('receiver_id')

        if not sender_id or not receiver_id:
            return Response({'error': 'sender_id and receiver_id query parameters are required'}, status=status.HTTP_400_BAD_REQUEST)

        # Get all chat messages between two users (excluding connection requests)
        messages = ChatMessage.objects.filter(
            models.Q(sender_id=str(sender_id), receiver_id=str(receiver_id)) |
            models.Q(sender_id=str(receiver_id), receiver_id=str(sender_id)),
            message_type='text',
            status='sent'
        ).order_by('timestamp')

        result = []
        for msg in messages:
            result.append({
                'id': msg.id,
                'sender_type': msg.sender_type,
                'content': msg.content,
                'timestamp': msg.timestamp.isoformat()
            })
            
        return Response(result, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



# Connection Request Views
@api_view(['POST'])
def create_connection_request(request):
    try:
        logger.info(f"Request data: {request.data}")

        student_id = request.data.get('student_id')
        mentor_id = request.data.get('mentor_id')
        message = request.data.get('message', 'I would like to connect with you.')

        logger.info(f"Creating connection request: student_id={student_id}, mentor_id={mentor_id}")

        if not student_id or not mentor_id:
            logger.warning("Missing student_id or mentor_id in request data")
            return Response({'error': 'student_id and mentor_id are required'}, status=status.HTTP_400_BAD_REQUEST)

        # Validate that student_id and mentor_id are integers
        try:
            student_id_int = int(student_id)
            mentor_id_int = int(mentor_id)
        except ValueError:
            logger.warning(f"Invalid student_id or mentor_id: student_id={student_id}, mentor_id={mentor_id}")
            return Response({'error': 'student_id and mentor_id must be integers'}, status=status.HTTP_400_BAD_REQUEST)

        logger.info(f"Validated IDs: student_id_int={student_id_int}, mentor_id_int={mentor_id_int}")

        # Validate that student exists
        try:
            student = Candidate.objects.get(id=student_id_int, role='student')
            logger.info(f"Found student: ID={student.id}, Name={student.name}, Email={student.email}")
        except Candidate.DoesNotExist:
            logger.warning(f"Student not found: ID={student_id_int}")
            return Response({'error': 'Student not found'}, status=status.HTTP_404_NOT_FOUND)

        # Validate that mentor exists
        try:
            mentor = Candidate.objects.get(id=mentor_id_int, role='mentor')
            logger.info(f"Found mentor: ID={mentor.id}, Name={mentor.name}, Email={mentor.email}")
        except Candidate.DoesNotExist:
            logger.warning(f"Mentor not found: ID={mentor_id_int}")
            return Response({'error': 'Mentor not found'}, status=status.HTTP_404_NOT_FOUND)

        # Check if a connection request already exists
        existing_request = ChatMessage.objects.filter(
            sender_id=str(student_id_int),
            receiver_id=str(mentor_id_int),
            sender_type='student',
            message_type='text'
        ).exclude(status='sent').first()

        if existing_request:
            logger.info(f"Connection request already exists: ID={existing_request.id}, Status={existing_request.status}")
            return Response({
                'error': f'Connection request already exists with status: {existing_request.status}',
                'request_id': existing_request.id,
                'status': existing_request.status
            }, status=status.HTTP_409_CONFLICT)

        # Create connection request
        connection_request = ChatMessage.objects.create(
            sender_type='student',
            sender_id=str(student_id_int),
            receiver_id=str(mentor_id_int),
            content=message,
            message_type='text',
            status='pending',
            is_conversation=False,
            feedback=None,
            ratings=None
        )

        logger.info(f"Created connection request with ID: {connection_request.id}")

        response_data = {
            'id': connection_request.id,
            'student_id': student_id_int,
            'mentor_id': mentor_id_int,
            'message': message,
            'status': 'pending',
            'created_at': connection_request.timestamp.isoformat()
        }
        return Response(response_data, status=status.HTTP_201_CREATED)

    except Exception as e:
        logger.error(f"Error in create_connection_request: {str(e)}")
        import traceback
        traceback.print_exc()
        return Response({'error': f'Database error checking conversation: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    except Exception as e:
        logger.error(f"Error in create_connection_request: {str(e)}")
        import traceback
        traceback.print_exc()
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@csrf_exempt
def list_mentor_requests(request):
    mentor_id = request.GET.get('mentor_id')
    
    if not mentor_id:
        return JsonResponse({'error': 'mentor_id parameter required'}, status=400)

    logger.info(f"Fetching requests for mentor_id: {mentor_id}")

    # Get all connection requests sent to this mentor from students
    messages = ChatMessage.objects.filter(
        receiver_id=str(mentor_id),
        sender_type='student',
        message_type='text'
    ).exclude(status='sent').order_by('-timestamp')

    logger.info(f"Found {messages.count()} messages for mentor {mentor_id}")

    result = []
    for msg in messages:
        try:
            student = Candidate.objects.get(id=msg.sender_id, role='student')
            result.append({
                'id': msg.id,
                'student': int(msg.sender_id),
                'status': msg.status,
                'message': msg.content,
                'created_at': msg.timestamp.isoformat(),
                'student_name': student.name,
                'student_email': student.email,
                'university': getattr(student, 'field_of_study', '') or '',
                'major': getattr(student, 'field_of_study', '') or '',
                'year': str(getattr(student, 'year_of_passout', '') or ''),
                'location': getattr(student, 'location', '') or ''
            })
            logger.info(f"Added request from student {student.name} with status {msg.status}")
        except Candidate.DoesNotExist:
            logger.warning(f"Student with ID {msg.sender_id} not found")
            continue
        except Exception as e:
            logger.error(f"Error processing message {msg.id}: {str(e)}")
            continue

    logger.info(f"Returning {len(result)} requests")
    return JsonResponse(result, safe=False)

@api_view(['PATCH'])
def update_request_status(request, request_id):
    try:
        new_status = request.data.get('status')

        logger.info(f"Updating request {request_id} to status: {new_status}")

        if new_status not in ['accepted', 'rejected']:
            return Response({'error': 'Status must be accepted or rejected'}, status=status.HTTP_400_BAD_REQUEST)

        # Get the request (allow any status, not just pending)
        try:
            connection_request = ChatMessage.objects.filter(
                id=request_id,
                message_type='text'
            ).exclude(status='sent').first()

            if not connection_request:
                raise ChatMessage.DoesNotExist

            logger.info(f"Found request with current status: {connection_request.status}")
        except ChatMessage.DoesNotExist:
            logger.warning(f"Request with ID {request_id} not found")
            return Response({'error': 'Request not found'}, status=status.HTTP_404_NOT_FOUND)

        # Update status
        old_status = connection_request.status
        connection_request.status = new_status
        connection_request.save()

        logger.info(f"Updated request status from {old_status} to {new_status}")

        # Send status update via WebSocket
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            f'status_{connection_request.id}',
            {
                'type': 'status_update',
                'status_data': {'id': connection_request.id, 'status': connection_request.status}
            }
        )

        response_data = {
            'id': connection_request.id,
            'status': connection_request.status,
            'updated_at': connection_request.timestamp.isoformat()
        }
        return Response(response_data, status=status.HTTP_200_OK)

    except Exception as e:
        logger.error(f"Error in update_request_status: {str(e)}")
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def get_connection_status(request):
    try:
        student_id = request.query_params.get('student_id')
        mentor_id = request.query_params.get('mentor_id')

        logger.info(f"get_connection_status called with student_id={student_id}, mentor_id={mentor_id}")

        if not student_id or not mentor_id:
            logger.warning("Missing student_id or mentor_id in query parameters")
            return Response({'error': 'student_id and mentor_id are required'}, status=status.HTTP_400_BAD_REQUEST)

        # Validate that student_id and mentor_id are integers
        try:
            student_id_int = int(student_id)
            mentor_id_int = int(mentor_id)
        except ValueError:
            logger.warning("Invalid student_id or mentor_id: not an integer")
            return Response({'error': 'student_id and mentor_id must be integers'}, status=status.HTTP_400_BAD_REQUEST)

        # Validate that student and mentor exist
        from .models import Candidate
        try:
            student = Candidate.objects.get(id=student_id_int, role='student')
        except Candidate.DoesNotExist:
            logger.warning(f"Student with id={student_id_int} not found")
            return Response({'error': 'Student not found'}, status=status.HTTP_404_NOT_FOUND)

        try:
            mentor = Candidate.objects.get(id=mentor_id_int, role='mentor')
        except Candidate.DoesNotExist:
            logger.warning(f"Mentor with id={mentor_id_int} not found")
            return Response({'error': 'Mentor not found'}, status=status.HTTP_404_NOT_FOUND)

        # Check if connection request exists
        connection_request = ChatMessage.objects.filter(
            sender_id=str(student_id_int),
            receiver_id=str(mentor_id_int),
            sender_type='student',
            message_type='text'
        ).exclude(status='sent').order_by('-timestamp').first()

        if connection_request:
            logger.info(f"Found connection request with status={connection_request.status}")
            return Response({
                'status': connection_request.status,
                'request_id': connection_request.id
            }, status=status.HTTP_200_OK)
        else:
            logger.info("No connection request found")
            return Response({
                'status': 'none',
                'request_id': None
            }, status=status.HTTP_200_OK)

    except Exception as e:
        logger.error(f"Error in get_connection_status: {str(e)}")
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@csrf_exempt
def test_mentor_requests(request):
    mentor_id = request.GET.get('mentor_id', '5')
    messages = list(ChatMessage.objects.filter(receiver_id=mentor_id, sender_type='student').values())
    return JsonResponse({'count': len(messages), 'messages': messages}, safe=False)

@csrf_exempt
def mentor_requests_fixed(request):
    mentor_id = request.GET.get('mentor_id')
    
    if not mentor_id:
        return JsonResponse({'error': 'mentor_id parameter required'}, status=400)
    
    messages = ChatMessage.objects.filter(
        receiver_id=str(mentor_id), 
        sender_type='student',
        message_type='text'
    ).exclude(status='sent').order_by('-timestamp')
    
    result = []
    for msg in messages:
        try:
            student = Candidate.objects.get(id=msg.sender_id, role='student')
            result.append({
                'id': msg.id,
                'student': int(msg.sender_id),
                'status': msg.status,
                'message': msg.content,
                'created_at': msg.timestamp.isoformat(),
                'student_name': student.name,
                'student_email': student.email,
                'university': getattr(student, 'field_of_study', '') or '',
                'major': getattr(student, 'field_of_study', '') or '',
                'year': str(getattr(student, 'year_of_passout', '') or ''),
                'location': getattr(student, 'location', '') or ''
            })
        except Candidate.DoesNotExist:
            continue
        except Exception:
            continue
    
    return JsonResponse(result, safe=False)

@csrf_exempt
def simple_connection_request(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'POST required'}, status=405)

    try:
        data = json.loads(request.body.decode('utf-8'))
        student_id = data.get('student_id')
        mentor_id = data.get('mentor_id')
        message = data.get('message', 'I would like to connect with you.')

        logger.info(f"Simple connection request: student_id={student_id}, mentor_id={mentor_id}")

        if not student_id or not mentor_id:
            logger.warning("Missing student_id or mentor_id in request data")
            return JsonResponse({'error': 'student_id and mentor_id required'}, status=400)

        # Validate that student_id and mentor_id are integers
        try:
            student_id_int = int(student_id)
            mentor_id_int = int(mentor_id)
        except ValueError:
            logger.warning(f"Invalid student_id or mentor_id: student_id={student_id}, mentor_id={mentor_id}")
            return JsonResponse({'error': 'student_id and mentor_id must be integers'}, status=400)

        logger.info(f"Validated IDs: student_id_int={student_id_int}, mentor_id_int={mentor_id_int}")

        # Validate that student exists
        try:
            student = Candidate.objects.get(id=student_id_int, role='student')
            logger.info(f"Found student: ID={student.id}, Name={student.name}, Email={student.email}")
        except Candidate.DoesNotExist:
            logger.warning(f"Student not found: ID={student_id_int}")
            return JsonResponse({'error': 'Student not found'}, status=404)

        # Validate that mentor exists
        try:
            mentor = Candidate.objects.get(id=mentor_id_int, role='mentor')
            logger.info(f"Found mentor: ID={mentor.id}, Name={mentor.name}, Email={mentor.email}")
        except Candidate.DoesNotExist:
            logger.warning(f"Mentor not found: ID={mentor_id_int}")
            return JsonResponse({'error': 'Mentor not found'}, status=404)

        # Check if a connection request already exists
        existing_request = ChatMessage.objects.filter(
            sender_id=str(student_id_int),
            receiver_id=str(mentor_id_int),
            sender_type='student',
            message_type='text'
        ).exclude(status='sent').first()

        if existing_request:
            logger.info(f"Connection request already exists: ID={existing_request.id}, Status={existing_request.status}")
            return JsonResponse({
                'error': f'Connection request already exists with status: {existing_request.status}',
                'request_id': existing_request.id,
                'status': existing_request.status
            }, status=409)

        # Create connection request
        connection_request = ChatMessage(
            sender_type='student',
            sender_id=str(student_id_int),
            receiver_id=str(mentor_id_int),
            content=message,
            message_type='text',
            status='pending',
            is_conversation=False,
            feedback=None,
            ratings=None
        )
        connection_request.save()

        logger.info(f"Created connection request with ID: {connection_request.id}")

        return JsonResponse({
            'id': connection_request.id,
            'student_id': student_id_int,
            'mentor_id': mentor_id_int,
            'status': 'pending',
            'message': 'Connection request created successfully'
        })

    except Exception as e:
        logger.error(f"Error in simple_connection_request: {str(e)}")
        import traceback
        traceback.print_exc()
        return JsonResponse({'error': str(e)}, status=500)

@csrf_exempt
def get_accepted_mentees(request):
    mentor_id = request.GET.get('mentor_id')

    if not mentor_id:
        return JsonResponse({'error': 'mentor_id parameter required'}, status=400)

    # Get all accepted connections for this mentor
    accepted_requests = ChatMessage.objects.filter(
        receiver_id=str(mentor_id),
        sender_type='student',
        status='accepted',
        message_type='text'
    ).exclude(status='sent')

    mentees = []
    for req in accepted_requests:
        try:
            student = Candidate.objects.get(id=req.sender_id, role='student')
            mentee_data = {
                'id': student.id,
                'name': student.name,
                'email': student.email,
                'university': getattr(student, 'field_of_study', '') or 'Unknown University',
                'major': getattr(student, 'field_of_study', '') or 'Unknown Major',
                'year': str(getattr(student, 'year_of_passout', '') or 'Unknown'),
                'location': getattr(student, 'location', '') or 'Unknown',
                'joinedDate': req.timestamp.strftime('%Y-%m-%d'),
                'lastActive': req.timestamp.strftime('%Y-%m-%d'),
                'status': 'active'
            }

            # Add feedback data if it exists
            if req.ratings is not None and req.feedback is not None:
                mentee_data['feedback'] = {
                    'ratings': req.ratings,
                    'feedback': req.feedback,
                    'submitted_at': req.timestamp.isoformat()
                }

            mentees.append(mentee_data)
        except Candidate.DoesNotExist:
            continue

    return JsonResponse(mentees, safe=False)

@api_view(['GET'])
def get_conversation(request):
    """Get conversation between student and mentor from JSON storage"""
    try:
        student_id = request.query_params.get('student_id')
        mentor_id = request.query_params.get('mentor_id')
        
        if not student_id or not mentor_id:
            return Response({'error': 'student_id and mentor_id are required'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Find conversation record
        conversation_record = ChatMessage.objects.filter(
            sender_id=str(student_id),
            receiver_id=str(mentor_id),
            sender_type='student',
            is_conversation=True
        ).first()
        
        if conversation_record:
            return Response({
                'messages': conversation_record.conversation_data,
                'last_updated': conversation_record.timestamp.isoformat()
            }, status=status.HTTP_200_OK)
        else:
            return Response({
                'messages': [],
                'last_updated': None
            }, status=status.HTTP_200_OK)
            
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def list_conversations(request):
    """List all conversations for a user (student or mentor)"""
    try:
        user_id = request.query_params.get('user_id')
        user_type = request.query_params.get('user_type')  # 'student' or 'mentor'
        
        if not user_id or not user_type:
            return Response({'error': 'user_id and user_type are required'}, status=status.HTTP_400_BAD_REQUEST)
        
        if user_type == 'student':
            conversations = ChatMessage.objects.filter(
                sender_id=str(user_id),
                sender_type='student',
                is_conversation=True
            )
        elif user_type == 'mentor':
            conversations = ChatMessage.objects.filter(
                receiver_id=str(user_id),
                sender_type='student',
                is_conversation=True
            )
        else:
            return Response({'error': 'user_type must be student or mentor'}, status=status.HTTP_400_BAD_REQUEST)
        
        result = []
        for conv in conversations:
            # Get the other user's info
            if user_type == 'student':
                try:
                    other_user = Candidate.objects.get(id=conv.receiver_id, role='mentor')
                    other_user_name = other_user.name
                except Candidate.DoesNotExist:
                    other_user_name = f"Mentor {conv.receiver_id}"
            else:
                try:
                    other_user = Candidate.objects.get(id=conv.sender_id, role='student')
                    other_user_name = other_user.name
                except Candidate.DoesNotExist:
                    other_user_name = f"Student {conv.sender_id}"
            
            # Get last message
            last_message = conv.conversation_data[-1] if conv.conversation_data else None
            
            result.append({
                'student_id': conv.sender_id,
                'mentor_id': conv.receiver_id,
                'other_user_name': other_user_name,
                'last_message': last_message['content'] if last_message else None,
                'last_updated': conv.timestamp.isoformat(),
                'message_count': len(conv.conversation_data)
            })
        
        return Response(result, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# Booking Session Views
@api_view(['POST'])
def book_session(request):
    try:
        student_id = request.data.get('student_id')
        mentor_id = request.data.get('mentor_id')
        topic = request.data.get('topic')
        preferred_date_time = request.data.get('preferred_date_time')
        message = request.data.get('message', '')
        meeting_link = request.data.get('meeting_link')
        meeting_id = request.data.get('meeting_id')
        passcode = request.data.get('passcode')

        if not all([student_id, mentor_id, topic, preferred_date_time]):
            return Response({'error': 'student_id, mentor_id, topic, and preferred_date_time are required'}, status=status.HTTP_400_BAD_REQUEST)

        # Parse IDs to integers
        try:
            student_id_int = int(student_id)
            mentor_id_int = int(mentor_id)
        except ValueError:
            return Response({'error': 'student_id and mentor_id must be integers'}, status=status.HTTP_400_BAD_REQUEST)

        # Parse datetime
        from django.utils.dateparse import parse_datetime
        preferred_date_time_parsed = parse_datetime(preferred_date_time)
        if not preferred_date_time_parsed:
            return Response({'error': 'preferred_date_time must be a valid datetime string'}, status=status.HTTP_400_BAD_REQUEST)

        # Validate student and mentor exist
        try:
            student = Candidate.objects.get(id=student_id_int, role='student')
            mentor = Candidate.objects.get(id=mentor_id_int, role='mentor')
        except Candidate.DoesNotExist:
            return Response({'error': 'Invalid student or mentor ID'}, status=status.HTTP_404_NOT_FOUND)

        # Create booking
        booking = BookedSession.objects.create(
            student=student,
            mentor=mentor,
            topic=topic,
            preferred_date_time=preferred_date_time_parsed,
            message=message,
            status='pending'
        )

        # Set optional meeting details
        if meeting_link:
            booking.meeting_link = meeting_link
        if meeting_id:
            booking.meeting_id = meeting_id
        if passcode:
            booking.passcode = passcode
        booking.save()

        return Response({
            'id': booking.id,
            'status': 'pending',
            'message': 'Booking request sent successfully'
        }, status=status.HTTP_201_CREATED)

    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['PATCH'])
def update_booking_status(request, booking_id):
    try:
        new_status = request.data.get('status')

        if new_status not in ['accepted', 'rejected']:
            return Response({'error': 'Status must be accepted or rejected'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            booking = BookedSession.objects.get(id=booking_id)
        except BookedSession.DoesNotExist:
            return Response({'error': 'Booking not found'}, status=status.HTTP_404_NOT_FOUND)

        booking.status = new_status
        booking.save()

        return Response({
            'id': booking.id,
            'status': booking.status,
            'message': f'Booking {new_status} successfully'
        }, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['PATCH'])
def schedule_session(request, booking_id):
    try:
        scheduled_date_time = request.data.get('scheduled_date_time')
        meeting_link = request.data.get('meeting_link')
        meeting_id = request.data.get('meeting_id')
        passcode = request.data.get('passcode')

        if not scheduled_date_time:
            return Response({'error': 'scheduled_date_time is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            booking = BookedSession.objects.get(id=booking_id, status='accepted')
        except BookedSession.DoesNotExist:
            return Response({'error': 'Accepted booking not found'}, status=status.HTTP_404_NOT_FOUND)

        booking.scheduled_date_time = scheduled_date_time
        booking.meeting_link = meeting_link
        booking.meeting_id = meeting_id
        booking.passcode = passcode
        booking.status = 'scheduled'
        booking.save()

        return Response({
            'id': booking.id,
            'status': 'scheduled',
            'message': 'Session scheduled successfully'
        }, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def get_student_sessions(request):
    try:
        student_id = request.query_params.get('student_id')

        if not student_id:
            return Response({'error': 'student_id query parameter required'}, status=status.HTTP_400_BAD_REQUEST)

        sessions = BookedSession.objects.filter(
            student_id=student_id,
            status__in=['accepted', 'scheduled', 'completed']
        ).select_related('mentor')

        result = []
        for session in sessions:
            result.append({
                'id': session.id,
                'mentor_id': session.mentor.id,
                'mentor_name': session.mentor.name,
                'topic': session.topic,
                'status': session.status,
                'preferred_date_time': session.preferred_date_time.isoformat(),
                'scheduled_date_time': session.scheduled_date_time.isoformat() if session.scheduled_date_time else None,
                'meeting_link': session.meeting_link,
                'meeting_id': session.meeting_id,
                'passcode': session.passcode,
                'message': session.message,
                'created_at': session.created_at.isoformat()
            })

        return Response(result, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def get_mentor_sessions(request):
    try:
        mentor_id = request.query_params.get('mentor_id')

        if not mentor_id:
            return Response({'error': 'mentor_id query parameter required'}, status=status.HTTP_400_BAD_REQUEST)

        sessions = BookedSession.objects.filter(
            mentor_id=mentor_id
        ).select_related('student').order_by('-created_at')

        result = []
        for session in sessions:
            result.append({
                'id': session.id,
                'student_id': session.student.id,
                'student_name': session.student.name,
                'topic': session.topic,
                'status': session.status,
                'preferred_date_time': session.preferred_date_time.isoformat(),
                'scheduled_date_time': session.scheduled_date_time.isoformat() if session.scheduled_date_time else None,
                'meeting_link': session.meeting_link,
                'meeting_id': session.meeting_id,
                'passcode': session.passcode,
                'message': session.message,
                'created_at': session.created_at.isoformat()
            })

        return Response(result, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def get_booking_requests(request):
    try:
        mentor_id = request.query_params.get('mentor_id')

        if not mentor_id:
            return Response({'error': 'mentor_id query parameter required'}, status=status.HTTP_400_BAD_REQUEST)

        requests = BookedSession.objects.filter(
            mentor_id=mentor_id,
            status='pending'
        ).select_related('student')

        result = []
        for req in requests:
            result.append({
                'id': req.id,
                'student_name': req.student.name,
                'student_email': req.student.email,
                'topic': req.topic,
                'preferred_date_time': req.preferred_date_time.isoformat(),
                'message': req.message,
                'status': req.status,
                'created_at': req.created_at.isoformat()
            })

        return Response(result, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
def get_accepted_bookings(request):
    try:
        mentor_id = request.query_params.get('mentor_id')

        if not mentor_id:
            return Response({'error': 'mentor_id query parameter required'}, status=status.HTTP_400_BAD_REQUEST)

        requests = BookedSession.objects.filter(
            mentor_id=mentor_id,
            status__in=['accepted', 'scheduled']
        ).select_related('student')

        result = []
        for req in requests:
            result.append({
                'id': req.id,
                'student_id': req.student.id,
                'student_name': req.student.name,
                'student_email': req.student.email,
                'topic': req.topic,
                'preferred_date_time': req.preferred_date_time.isoformat(),
                'scheduled_date_time': req.scheduled_date_time.isoformat() if req.scheduled_date_time else None,
                'meeting_link': req.meeting_link,
                'meeting_id': req.meeting_id,
                'passcode': req.passcode,
                'message': req.message,
                'status': req.status,
                'created_at': req.created_at.isoformat()
            })

        return Response(result, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
def submit_feedback(request):
    try:
        student_id = request.data.get('student_id')
        mentor_id = request.data.get('mentor_id')
        ratings = request.data.get('ratings')
        feedback = request.data.get('feedback')

        logger.info(f"submit_feedback called with student_id={student_id}, mentor_id={mentor_id}, ratings={ratings}, feedback={feedback}")

        if not all([student_id, mentor_id, ratings, feedback]):
            return Response({'error': 'student_id, mentor_id, ratings, and feedback are required'}, status=status.HTTP_400_BAD_REQUEST)

        # Validate ratings (1-5)
        try:
            ratings_int = int(ratings)
            if not (1 <= ratings_int <= 5):
                raise ValueError
        except ValueError:
            return Response({'error': 'ratings must be an integer between 1 and 5'}, status=status.HTTP_400_BAD_REQUEST)

        # Validate that student and mentor exist and have accepted connection
        try:
            student = Candidate.objects.get(id=student_id, role='student')
            mentor = Candidate.objects.get(id=mentor_id, role='mentor')
            logger.info(f"Found student: {student.name}, mentor: {mentor.name}")
        except Candidate.DoesNotExist:
            return Response({'error': 'Invalid student or mentor ID'}, status=status.HTTP_404_NOT_FOUND)

        # Find the accepted connection ChatMessage
        connection = ChatMessage.objects.filter(
            sender_id=str(student_id),
            receiver_id=str(mentor_id),
            sender_type='student',
            status='accepted',
            message_type='text'
        ).first()

        logger.info(f"Connection found: {connection}")

        if not connection:
            return Response({'error': 'No accepted connection found between student and mentor'}, status=status.HTTP_403_FORBIDDEN)

        # Update the connection with ratings and feedback
        connection.ratings = ratings_int
        connection.feedback = feedback
        connection.save()

        message = "Feedback submitted successfully"
        logger.info("Feedback stored in connection")

        return Response({
            'message': message,
            'ratings': ratings_int,
            'feedback': feedback
        }, status=status.HTTP_201_CREATED)

    except Exception as e:
        logger.error(f"Error in submit_feedback: {str(e)}")
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def get_mentor_feedback(request):
    try:
        mentor_id = request.query_params.get('mentor_id')

        if not mentor_id:
            return Response({'error': 'mentor_id query parameter required'}, status=status.HTTP_400_BAD_REQUEST)

        # Validate mentor exists
        try:
            mentor = Candidate.objects.get(id=mentor_id, role='mentor')
        except Candidate.DoesNotExist:
            return Response({'error': 'Mentor not found'}, status=status.HTTP_404_NOT_FOUND)

        # Get all feedback for this mentor (accepted connections with ratings and feedback)
        feedback_messages = ChatMessage.objects.filter(
            receiver_id=str(mentor_id),
            sender_type='student',
            status='accepted',
            message_type='text',
            ratings__isnull=False,
            feedback__isnull=False
        ).order_by('-timestamp')

        result = []
        for msg in feedback_messages:
            try:
                student = Candidate.objects.get(id=msg.sender_id, role='student')
                # Determine sentiment based on rating
                if msg.ratings >= 4:
                    sentiment = 'positive'
                elif msg.ratings >= 3:
                    sentiment = 'neutral'
                else:
                    sentiment = 'negative'

                feedback_item = {
                    'id': msg.id,
                    'menteeId': msg.sender_id,
                    'menteeName': student.name,
                    'menteeAvatar': '',  # Placeholder, can be added later
                    'sessionTopic': 'Mentoring Session',  # Placeholder, can be enhanced
                    'sessionDate': msg.timestamp.strftime('%Y-%m-%d'),
                    'rating': msg.ratings,
                    'feedback': msg.feedback,
                    'sentiment': sentiment,
                    'categories': [],  # Placeholder, can be enhanced
                    'helpful': False  # Placeholder
                }
                result.append(feedback_item)
            except Candidate.DoesNotExist:
                continue

        return Response(result, status=status.HTTP_200_OK)

    except Exception as e:
        logger.error(f"Error in get_mentor_feedback: {str(e)}")
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
def submit_mentor_feedback(request):
    try:
        mentor_id = request.data.get('mentor_id')
        student_id = request.data.get('student_id')
        mentor_ratings = request.data.get('mentor_ratings')
        mentor_feedback = request.data.get('mentor_feedback')

        logger.info(f"submit_mentor_feedback called with mentor_id={mentor_id}, student_id={student_id}, mentor_ratings={mentor_ratings}, mentor_feedback={mentor_feedback}")

        if not all([mentor_id, student_id, mentor_ratings, mentor_feedback]):
            return Response({'error': 'mentor_id, student_id, mentor_ratings, and mentor_feedback are required'}, status=status.HTTP_400_BAD_REQUEST)

        # Validate mentor_ratings (1-5)
        try:
            mentor_ratings_int = int(mentor_ratings)
            if not (1 <= mentor_ratings_int <= 5):
                raise ValueError
        except ValueError:
            return Response({'error': 'mentor_ratings must be an integer between 1 and 5'}, status=status.HTTP_400_BAD_REQUEST)

        # Validate that mentor and student exist and have accepted connection
        try:
            mentor = Candidate.objects.get(id=mentor_id, role='mentor')
            student = Candidate.objects.get(id=student_id, role='student')
            logger.info(f"Found mentor: {mentor.name}, student: {student.name}")
        except Candidate.DoesNotExist:
            return Response({'error': 'Invalid mentor or student ID'}, status=status.HTTP_404_NOT_FOUND)

        # Find the accepted connection ChatMessage
        connection = ChatMessage.objects.filter(
            sender_id=str(student_id),
            receiver_id=str(mentor_id),
            sender_type='student',
            status='accepted',
            message_type='text'
        ).first()

        logger.info(f"Connection found: {connection}")

        if not connection:
            return Response({'error': 'No accepted connection found between student and mentor'}, status=status.HTTP_403_FORBIDDEN)

        # Update the connection with mentor ratings and feedback
        connection.mentor_ratings = mentor_ratings_int
        connection.mentor_feedback = mentor_feedback
        connection.save()

        message = "Mentor feedback submitted successfully"
        logger.info("Mentor feedback stored in connection")

        return Response({
            'message': message,
            'mentor_ratings': mentor_ratings_int,
            'mentor_feedback': mentor_feedback
        }, status=status.HTTP_201_CREATED)

    except Exception as e:
        logger.error(f"Error in submit_mentor_feedback: {str(e)}")
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@csrf_exempt
def get_resume(request, user_id):
    """Serve resume PDF file from database blob"""
    if request.method not in ['GET', 'HEAD']:
        return JsonResponse({'error': 'GET or HEAD required'}, status=405)
    
    try:
        candidate = Candidate.objects.get(id=user_id)
        
        if not candidate.resume_file:
            return JsonResponse({'error': 'No resume found'}, status=404)
        
        from django.http import HttpResponse
        
        if request.method == 'HEAD':
            # For HEAD requests, just return headers without content
            response = HttpResponse(status=200)
            response['Content-Type'] = 'application/pdf'
            response['Content-Length'] = len(candidate.resume_file)
            response['Content-Disposition'] = f'inline; filename="{candidate.resume_filename or "resume.pdf"}"'
            return response
        
        # For GET requests, return the actual file
        response = HttpResponse(candidate.resume_file, content_type='application/pdf')
        response['Content-Disposition'] = f'inline; filename="{candidate.resume_filename or "resume.pdf"}"'
        return response
        
    except Candidate.DoesNotExist:
        return JsonResponse({'error': 'User not found'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@csrf_exempt
def update_resume(request, user_id):
    """Update user's resume file"""
    if request.method != 'POST':
        return JsonResponse({'error': 'POST required'}, status=405)
    
    if 'file' not in request.FILES:
        return JsonResponse({'error': 'No file uploaded'}, status=400)
    
    file = request.FILES['file']
    
    if not file.name.lower().endswith('.pdf'):
        return JsonResponse({'error': 'Only PDF files allowed'}, status=400)
    
    try:
        candidate = Candidate.objects.get(id=user_id)
        
        # Read and store file content
        file_content = file.read()
        candidate.resume_file = file_content
        candidate.resume_filename = file.name
        candidate.save()
        
        return JsonResponse({
            'message': 'Resume updated successfully',
            'filename': file.name,
            'size': len(file_content)
        })
        
    except Candidate.DoesNotExist:
        return JsonResponse({'error': 'User not found'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@csrf_exempt
def add_user_skill(request, user_id):
    """Add a skill to user's profile"""
    if request.method != 'POST':
        return JsonResponse({'error': 'POST required'}, status=405)
    
    try:
        data = json.loads(request.body.decode('utf-8'))
        skill_name = data.get('name')
        proficiency = data.get('proficiency', 'BEGINNER')
        
        if not skill_name:
            return JsonResponse({'error': 'Skill name required'}, status=400)
        
        user = Candidate.objects.get(id=user_id)
        skill, created = Skill.objects.get_or_create(
            name=skill_name,
            defaults={'category': 'PROGRAMMING'}
        )
        
        user_skill, created = UserSkill.objects.get_or_create(
            user=user,
            skill=skill,
            defaults={'proficiency': proficiency}
        )
        
        if created:
            return JsonResponse({
                'message': 'Skill added successfully',
                'skill': {
                    'id': skill.id,
                    'name': skill.name,
                    'proficiency': user_skill.proficiency
                }
            })
        else:
            return JsonResponse({'message': 'Skill already exists'})
            
    except Candidate.DoesNotExist:
        return JsonResponse({'error': 'User not found'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
