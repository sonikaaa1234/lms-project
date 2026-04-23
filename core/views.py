from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import login, logout, authenticate
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.views.decorators.http import require_POST
from django.views.decorators.csrf import csrf_exempt
from django.db.models import Q
import time
from .models import User, Course, Video, UserSession


@csrf_exempt
def login_view(request):
    # Handle login via API
    if request.method == 'POST' and request.content_type == 'application/json':
        try:
            import json
            data = json.loads(request.body)
            username = data.get('username')
            password = data.get('password')
            
            user = authenticate(request, username=username, password=password)
            if user:
                # Log out other sessions for this user
                UserSession.objects.filter(user=user, is_active=True).update(is_active=False)
                
                # Create new session
                login(request, user)
                
                # Track session with proper session key
                session_key = request.session.session_key or f"session_{user.id}_{int(time.time())}"
                UserSession.objects.create(
                    user=user,
                    session_key=session_key,
                    ip_address=request.META.get('REMOTE_ADDR', '0.0.0.0'),
                    user_agent=request.META.get('HTTP_USER_AGENT', '')
                )
                
                from django.http import JsonResponse
                return JsonResponse({
                    'success': True,
                    'user': {
                        'id': user.id,
                        'username': user.username,
                        'email': user.email,
                        'role': user.role,
                        'phone': user.phone
                    },
                    'token': session_key
                })
            else:
                from django.http import JsonResponse
                return JsonResponse({
                    'success': False,
                    'message': 'Invalid username or password'
                }, status=401)
        except Exception as e:
            from django.http import JsonResponse
            return JsonResponse({
                'success': False,
                'message': str(e)
            }, status=400)
    
    # Always redirect to React frontend for GET requests
    return render(request, 'index.html')


# All views simplified to return React frontend
@login_required
def logout_view(request):
    logout(request)
    return render(request, 'index.html')

@login_required
def dashboard(request):
    return render(request, 'index.html')

@login_required
def course_detail(request, course_id):
    return render(request, 'index.html')

@login_required
def video_watch(request, video_id):
    return render(request, 'index.html')

@login_required
def user_management(request):
    return render(request, 'index.html')

@login_required
def create_user(request):
    return render(request, 'index.html')

@login_required
def course_management(request):
    return render(request, 'index.html')

@login_required
def create_course(request):
    return render(request, 'index.html')

@login_required
def add_video(request, course_id):
    return render(request, 'index.html')

@login_required
def enroll_student(request, course_id):
    return render(request, 'index.html')
