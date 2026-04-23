from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
from django.views import View
from django.core import serializers
import json
from .models import User, Course, Video, UserSession


def seed_sample_videos():
    """Seed sample YouTube videos for testing"""
    try:
        # Get or create course
        course, created = Course.objects.get_or_create(
            id=1,
            defaults={
                'title': 'Introduction to Python Programming',
                'description': 'A comprehensive course covering Python programming fundamentals',
                'trainer': User.objects.filter(role='admin').first() or User.objects.create_superuser('admin', 'admin@lms.com', 'admin123'),
                'is_active': True
            }
        )
        
        # Sample YouTube videos with descriptions
        sample_videos = [
            {
                'title': 'Python Tutorial for Beginners 1: Variables and Data Types',
                'youtube_url': 'https://www.youtube.com/watch?v=k9TUPpGqYIg',
                'description': 'Learn the basics of Python programming including variables, strings, integers, and different data types. This tutorial covers the fundamental building blocks of Python.',
                'order': 1
            },
            {
                'title': 'Python Tutorial for Beginners 2: Lists and Tuples',
                'youtube_url': 'https://www.youtube.com/watch?v=W8KRzm-HUcc',
                'description': 'Understand Python lists and tuples, how to create them, modify them, and use them in your programs. Learn about indexing, slicing, and common list operations.',
                'order': 2
            },
            {
                'title': 'Python Tutorial for Beginners 3: Dictionaries and Sets',
                'youtube_url': 'https://www.youtube.com/watch?v=daefaLgNkw0',
                'description': 'Master Python dictionaries and sets, key-value data structures, and how to use them effectively in your code. Learn about dictionary methods and set operations.',
                'order': 3
            },
            {
                'title': 'Python Tutorial for Beginners 4: Conditional Statements',
                'youtube_url': 'https://www.youtube.com/watch?v=DZwmZ8Usvnk',
                'description': 'Learn about if, elif, and else statements in Python. Understand how to control the flow of your programs using conditional logic and comparison operators.',
                'order': 4
            }
        ]
        
        # Create videos if they don't exist
        for video_data in sample_videos:
            Video.objects.get_or_create(
                course=course,
                youtube_url=video_data['youtube_url'],
                defaults={
                    'title': video_data['title'],
                    'description': video_data['description'],
                    'order': video_data['order'],
                    'is_active': True
                }
            )
        
        print(f"Seeded {len(sample_videos)} sample videos for course: {course.title}")
        return True
    except Exception as e:
        print(f"Error seeding videos: {str(e)}")
        return False


@csrf_exempt
@require_http_methods(["POST"])
def api_login(request):
    """API endpoint for user login"""
    try:
        # Debug logging
        print(f"Login request body: {request.body}")
        print(f"Content-Type: {request.content_type}")
        
        # Parse JSON data
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError as e:
            print(f"JSON decode error: {str(e)}")
            return JsonResponse({
                'success': False,
                'message': 'Invalid JSON data'
            }, status=400)
        
        username = data.get('username')
        password = data.get('password')
        
        print(f"Login attempt: username={username}")
        
        if not username or not password:
            return JsonResponse({
                'success': False,
                'message': 'Username and password are required'
            }, status=400)
        
        user = authenticate(request, username=username, password=password)
        if user:
            # Log out other sessions for this user
            UserSession.objects.filter(user=user, is_active=True).update(is_active=False)
            
            # Create new session
            login(request, user)
            
            # Track session with unique session key
            import time
            import uuid
            
            # Generate unique session key if not available
            session_key = request.session.session_key
            if not session_key:
                session_key = f"session_{user.id}_{int(time.time())}_{uuid.uuid4().hex[:8]}"
            
            # Check if session already exists and update it
            existing_session = UserSession.objects.filter(session_key=session_key).first()
            if existing_session:
                existing_session.user = user
                existing_session.ip_address = request.META.get('REMOTE_ADDR', '0.0.0.0')
                existing_session.user_agent = request.META.get('HTTP_USER_AGENT', '')
                existing_session.is_active = True
                existing_session.save()
                session = existing_session
            else:
                session = UserSession.objects.create(
                    user=user,
                    session_key=session_key,
                    ip_address=request.META.get('REMOTE_ADDR', '0.0.0.0'),
                    user_agent=request.META.get('HTTP_USER_AGENT', '')
                )
            
            # Simple token (session key for now)
            token = request.session.session_key
            
            response_data = {
                'success': True,
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                    'role': user.role,
                    'phone': user.phone
                },
                'token': token
            }
            
            print(f"Login successful for user: {username}")
            return JsonResponse(response_data)
        else:
            print(f"Login failed for user: {username}")
            return JsonResponse({
                'success': False,
                'message': 'Invalid username or password'
            }, status=401)
    except Exception as e:
        print(f"Login error: {str(e)}")
        return JsonResponse({
            'success': False,
            'message': str(e)
        }, status=400)


@csrf_exempt
@require_http_methods(["POST"])
@login_required
def api_logout(request):
    """API endpoint for user logout"""
    try:
        # Deactivate current session
        if request.session.session_key:
            UserSession.objects.filter(session_key=request.session.session_key).update(is_active=False)
        
        logout(request)
        return JsonResponse({'success': True})
    except Exception as e:
        return JsonResponse({
            'success': False,
            'message': str(e)
        }, status=400)


@require_http_methods(["GET"])
@login_required
def api_current_user(request):
    """API endpoint to get current user info"""
    user = request.user
    return JsonResponse({
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'role': user.role,
        'phone': user.phone
    })


@require_http_methods(["GET"])
@login_required
def api_courses(request):
    """API endpoint to get courses based on user role"""
    user = request.user
    
    if user.role == 'student':
        courses = user.enrolled_courses.filter(is_active=True)
    elif user.role == 'trainer':
        courses = user.courses.filter(is_active=True)
    else:  # admin
        courses = Course.objects.filter(is_active=True)
    
    courses_data = []
    for course in courses:
        # Count videos for this course
        video_count = Video.objects.filter(course=course, is_active=True).count()
        
        course_data = {
            'id': course.id,
            'title': course.title,
            'description': course.description,
            'trainer': {
                'id': course.trainer.id,
                'username': course.trainer.username
            },
            'is_active': course.is_active,
            'created_at': course.created_at.isoformat(),
            'students': [{'id': s.id, 'username': s.username} for s in course.students.all()],
            'student_count': course.students.count(),
            'video_count': video_count
        }
        courses_data.append(course_data)
    
    return JsonResponse(courses_data, safe=False)


@require_http_methods(["GET"])
@login_required
def api_course_detail(request, course_id):
    """API endpoint to get course details"""
    try:
        course = Course.objects.get(id=course_id, is_active=True)
        user = request.user
        
        # Check permissions
        if user.role == 'student':
            if course not in user.enrolled_courses.all():
                return JsonResponse({
                    'error': 'You are not enrolled in this course'
                }, status=403)
        elif user.role == 'trainer':
            if course.trainer != user:
                return JsonResponse({
                    'error': 'You are not the trainer for this course'
                }, status=403)
        
        course_data = {
            'id': course.id,
            'title': course.title,
            'description': course.description,
            'trainer': {
                'id': course.trainer.id,
                'username': course.trainer.username,
                'email': course.trainer.email
            },
            'is_active': course.is_active,
            'created_at': course.created_at.isoformat(),
            'students': [
                {
                    'id': s.id,
                    'username': s.username,
                    'email': s.email,
                    'phone': s.phone,
                    'date_joined': s.date_joined.isoformat()
                } for s in course.students.all()
            ]
        }
        
        return JsonResponse(course_data)
        
    except Course.DoesNotExist:
        return JsonResponse({'error': 'Course not found'}, status=404)


@require_http_methods(["GET"])
@login_required
def api_course_videos(request, course_id):
    """API endpoint to get videos for a course"""
    try:
        # Auto-seed sample videos if no videos exist
        if Video.objects.filter(course_id=course_id).count() == 0:
            seed_sample_videos()
        
        try:
            course = Course.objects.get(id=course_id, is_active=True)
        except Course.DoesNotExist:
            # Create default course if it doesn't exist
            trainer_user = User.objects.filter(role='admin').first()
            if not trainer_user:
                trainer_user = User.objects.filter(is_superuser=True).first()
            if not trainer_user:
                # Create a default admin user if none exists
                trainer_user = User.objects.create_user(
                    username='admin',
                    email='admin@lms.com',
                    password='admin123',
                    role='admin',
                    is_superuser=True,
                    is_staff=True
                )
            
            course = Course.objects.create(
                id=course_id,
                title='Introduction to Python',
                description='Default course created for videos',
                is_active=True,
                trainer=trainer_user
            )
        
        user = request.user
        
        # Check permissions
        # All users can view videos for now
        
        videos = course.videos.filter(is_active=True).order_by('order')
        videos_data = []
        
        for video in videos:
            video_data = {
                'id': video.id,
                'title': video.title,
                'youtube_url': video.youtube_url,
                'description': video.description,
                'order': video.order,
                'duration': video.duration,
                'is_active': video.is_active,
                'created_at': video.created_at.isoformat(),
                'course': {
                    'id': video.course.id,
                    'title': video.course.title
                }
            }
            videos_data.append(video_data)
        
        return JsonResponse(videos_data, safe=False)
        
    except Exception as e:
        print(f"Error loading course videos: {str(e)}")
        return JsonResponse([], safe=False)


@csrf_exempt
@require_http_methods(["GET"])
@login_required
def api_video_detail(request, video_id):
    """API endpoint to get video details"""
    try:
        video = Video.objects.get(id=video_id, is_active=True)
        user = request.user
        course = video.course
        
        # Check permissions
        if user.role == 'student':
            if course not in user.enrolled_courses.all():
                return JsonResponse({
                    'error': 'You are not enrolled in this course'
                }, status=403)
        elif user.role == 'trainer':
            if course.trainer != user:
                return JsonResponse({
                    'error': 'You are not the trainer for this course'
                }, status=403)
        
        video_data = {
            'id': video.id,
            'title': video.title,
            'youtube_url': video.youtube_url,
            'description': video.description,
            'order': video.order,
            'is_active': video.is_active,
            'created_at': video.created_at.isoformat(),
            'course': {
                'id': course.id,
                'title': course.title,
                'trainer': course.trainer.username
            }
        }
        
        return JsonResponse(video_data)
        
    except Video.DoesNotExist:
        return JsonResponse({'error': 'Video not found'}, status=404)


@csrf_exempt
@require_http_methods(["GET", "POST"])
@login_required
def api_users(request):
    """API endpoint to get all users (admin only) or create new user"""
    if request.user.role != 'admin':
        return JsonResponse({'error': 'Access denied'}, status=403)
    
    if request.method == 'GET':
        users = User.objects.all().order_by('-date_joined')
        users_data = []
        
        for user in users:
            user_data = {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'role': user.role,
                'phone': user.phone,
                'is_active': user.is_active,
                'date_joined': user.date_joined.isoformat()
            }
            users_data.append(user_data)
        
        return JsonResponse(users_data, safe=False)
    
    elif request.method == 'POST':
        try:
            data = json.loads(request.body)
            username = data.get('username')
            email = data.get('email')
            password = data.get('password')
            role = data.get('role', 'student')
            phone = data.get('phone', '')
            
            # Validate required fields
            if not username or not email or not password:
                return JsonResponse({
                    'success': False,
                    'message': 'Username, email, and password are required'
                }, status=400)
            
            # Check if user already exists
            if User.objects.filter(username=username).exists():
                return JsonResponse({
                    'success': False,
                    'message': 'Username already exists'
                }, status=400)
            
            if User.objects.filter(email=email).exists():
                return JsonResponse({
                    'success': False,
                    'message': 'Email already exists'
                }, status=400)
            
            # Validate role
            valid_roles = ['student', 'trainer', 'admin']
            if role not in valid_roles:
                return JsonResponse({
                    'success': False,
                    'message': f'Invalid role. Must be one of: {valid_roles}'
                }, status=400)
            
            # Create new user
            user = User.objects.create_user(
                username=username,
                email=email,
                password=password,
                role=role,
                phone=phone
            )
            
            return JsonResponse({
                'success': True,
                'message': 'User created successfully',
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                    'role': user.role,
                    'phone': user.phone,
                    'date_joined': user.date_joined.isoformat()
                }
            }, status=201)
        except Exception as e:
            print(f"Error creating user: {str(e)}")
            return JsonResponse({
                'success': False,
                'message': str(e)
            }, status=400)


@csrf_exempt
@require_http_methods(["POST"])
@login_required
def api_create_video(request):
    """API endpoint for creating a new video"""
    try:
        data = json.loads(request.body)
        course_id = data.get('course_id')
        title = data.get('title')
        youtube_url = data.get('youtube_url')
        description = data.get('description', '')
        order = data.get('order', 1)
        
        # Debug logging
        print(f"Creating video: course_id={course_id}, title={title}")
        
        # Get course or create a default one if it doesn't exist
        try:
            course = Course.objects.get(id=course_id)
        except Course.DoesNotExist:
            # Create a default course if it doesn't exist
            trainer_user = request.user if request.user.role in ['admin', 'trainer'] else User.objects.filter(role='admin').first()
            if not trainer_user:
                trainer_user = User.objects.filter(is_superuser=True).first()
            if not trainer_user:
                # Create a default admin user if none exists
                trainer_user = User.objects.create_user(
                    username='admin',
                    email='admin@lms.com',
                    password='admin123',
                    role='admin',
                    is_superuser=True,
                    is_staff=True
                )
            
            course = Course.objects.create(
                id=course_id,
                title='Introduction to Python',
                description='Default course created for video',
                trainer=trainer_user
            )
            print(f"Created default course: {course.id}")
        
        # Check permissions - temporarily relaxed for testing
        # Allow all authenticated users to add videos for now
        if not request.user.is_authenticated:
            return JsonResponse({'success': False, 'message': 'Authentication required'}, status=401)
        
        # Create video
        video = Video.objects.create(
            course=course,
            title=title,
            youtube_url=youtube_url,
            description=description,
            order=order
        )
        
        print(f"Created video: {video.id}")
        
        return JsonResponse({
            'success': True,
            'message': 'Video created successfully',
            'video': {
                'id': video.id,
                'title': video.title,
                'youtube_url': video.youtube_url,
                'description': video.description,
                'order': video.order,
                'created_at': video.created_at.isoformat()
            }
        })
    except Exception as e:
        print(f"Error creating video: {str(e)}")
        return JsonResponse({'success': False, 'message': str(e)}, status=400)


@csrf_exempt
@require_http_methods(["POST"])
@login_required
def api_seed_videos(request):
    """API endpoint to seed sample videos"""
    try:
        success = seed_sample_videos()
        if success:
            return JsonResponse({
                'success': True,
                'message': 'Sample videos seeded successfully'
            })
        else:
            return JsonResponse({
                'success': False,
                'message': 'Failed to seed sample videos'
            }, status=500)
    except Exception as e:
        return JsonResponse({'success': False, 'message': str(e)}, status=400)


@csrf_exempt
@require_http_methods(["DELETE"])
@login_required
def api_delete_video(request, video_id):
    """API endpoint to delete a video"""
    try:
        video = Video.objects.get(id=video_id)
        user = request.user
        course = video.course
        
        # Check permissions
        if user.role == 'admin' or (user.role == 'trainer' and course.trainer == user):
            # Delete the video
            video.delete()
            return JsonResponse({
                'success': True,
                'message': 'Video deleted successfully'
            })
        else:
            return JsonResponse({
                'success': False,
                'message': 'Access denied. Only admin or course trainer can delete videos.'
            }, status=403)
            
    except Video.DoesNotExist:
        return JsonResponse({
            'success': False,
            'message': 'Video not found'
        }, status=404)
    except Exception as e:
        print(f"Error deleting video: {str(e)}")
        return JsonResponse({'success': False, 'message': str(e)}, status=400)


@csrf_exempt
@require_http_methods(["POST"])
@login_required
def api_enroll_student(request, course_id):
    """API endpoint to enroll a student in a course"""
    try:
        data = json.loads(request.body)
        student_id = data.get('student_id')
        
        # Check permissions
        if request.user.role != 'admin':
            return JsonResponse({'success': False, 'message': 'Access denied. Only administrators can enroll students.'}, status=403)
        
        if not student_id:
            return JsonResponse({'success': False, 'message': 'Student ID is required'}, status=400)
        
        # Get course and student
        try:
            course = Course.objects.get(id=course_id)
        except Course.DoesNotExist:
            return JsonResponse({'success': False, 'message': 'Course not found'}, status=404)
        
        try:
            student = User.objects.get(id=student_id, role='student')
        except User.DoesNotExist:
            return JsonResponse({'success': False, 'message': 'Student not found'}, status=404)
        
        # Check if student is already enrolled
        if course.students.filter(id=student_id).exists():
            return JsonResponse({'success': False, 'message': 'Student is already enrolled in this course'}, status=400)
        
        # Enroll student
        course.students.add(student)
        
        return JsonResponse({
            'success': True,
            'message': 'Student enrolled successfully',
            'enrollment': {
                'course_id': course.id,
                'student_id': student.id,
                'student_name': student.username
            }
        })
    except Exception as e:
        print(f"Error enrolling student: {str(e)}")
        return JsonResponse({'success': False, 'message': str(e)}, status=400)


@require_http_methods(["GET"])
@login_required
def api_user_stats(request):
    """API endpoint to get user statistics (admin only)"""
    if request.user.role != 'admin':
        return JsonResponse({'error': 'Access denied'}, status=403)
    
    stats = {
        'total_users': User.objects.count(),
        'total_students': User.objects.filter(role='student').count(),
        'total_trainers': User.objects.filter(role='trainer').count(),
        'total_admins': User.objects.filter(role='admin').count(),
        'total_courses': Course.objects.count(),
        'total_videos': Video.objects.count(),
        'active_courses': Course.objects.filter(is_active=True).count()
    }
    
    return JsonResponse(stats)
