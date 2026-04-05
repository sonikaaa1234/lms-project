from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from .models import User
import uuid
from django.contrib.auth.models import User
from django.contrib.sessions.models import Session
#from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.utils import timezone
 
 

# Home Page
def home(request):
    return render(request, 'home.html')


# Signup
def signup(request):
    if request.method == 'POST':
        username = request.POST['username']
        email = request.POST['email'] 
        password = request.POST['password']
        role = request.POST['role']

        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
            role=role
        )

        login(request, user)
        return redirect('dashboard')

    return render(request, 'signup.html')


# Login
from django.contrib.auth import authenticate, login
from .models import User

def user_login(request):
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']
        role = request.POST['role']

        user = authenticate(request, username=username, password=password)

        if user is not None:

            # ❗ check if user is active
            if not user.is_active:
                return render(request, 'login.html', {'error': 'User disabled'})

            # ✅ SINGLE SESSION LOGIC
            session_id = str(uuid.uuid4())

            user.active_session = session_id
            user.save()

            request.session['session_id'] = session_id

            login(request, user)
            return redirect('dashboard')

        else:
            return render(request, 'login.html', {'error': 'Invalid credentials'})

    return render(request, 'login.html')

# Logout
def user_logout(request):
    logout(request)
    return redirect('home')


# Dashboard
@login_required
def dashboard(request):
    if request.user.role == 'student':
        return render(request, 'student_dashboard.html')

    elif request.user.role == 'trainer':
        return render(request, 'trainer_dashboard.html')

    else:
        return render(request, 'admin_dashboard.html')
    
from django.shortcuts import render
from django.contrib.auth.decorators import login_required

@login_required
def profile(request):
    return render(request, 'profile.html')

@login_required
def view_sessions(request):
    sessions = Session.objects.filter(expire_date__gte=timezone.now())

    session_data = []

    for session in sessions:
        data = session.get_decoded()
        user_id = data.get('_auth_user_id')

        session_data.append({
            'session_key': session.session_key,
            'user_id': user_id
        })

    return render(request, 'sessions.html', {'sessions': session_data})
def force_logout(request, session_key):
    Session.objects.filter(session_key=session_key).delete()
    return redirect('sessions')