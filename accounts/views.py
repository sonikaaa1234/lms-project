from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from .models import CustomUser


def login_view(request):
    if request.user.is_authenticated:
        return redirect('dashboard')

    if request.method == 'POST':
        email = request.POST.get('email')
        password = request.POST.get('password')
        user = authenticate(request, email=email, password=password)

        if user and user.is_active:
            # Force logout previous session
            user.session_token = request.session.session_key or ''
            user.last_login_ip = request.META.get('REMOTE_ADDR')
            user.last_login_device = request.META.get('HTTP_USER_AGENT', '')[:255]
            user.save()

            login(request, user)
            return redirect('dashboard')
        else:
            messages.error(request, 'Invalid email or password.')

    return render(request, 'accounts/login.html')


def logout_view(request):
    logout(request)
    return redirect('login')


@login_required
def dashboard_view(request):
    user = request.user
    if user.role == 'admin':
        return redirect('admin_dashboard')
    elif user.role == 'trainer':
        return redirect('trainer_dashboard')
    else:
        return redirect('student_dashboard')


@login_required
def admin_dashboard(request):
    if request.user.role != 'admin':
        return redirect('dashboard')
    from courses.models import Course
    users = CustomUser.objects.all()
    courses = Course.objects.all()
    return render(request, 'accounts/admin_dashboard.html', {
        'users': users,
        'courses': courses,
    })


@login_required
def trainer_dashboard(request):
    if request.user.role != 'trainer':
        return redirect('dashboard')
    from courses.models import Course
    courses = Course.objects.filter(created_by=request.user)
    return render(request, 'accounts/trainer_dashboard.html', {'courses': courses})


@login_required
def student_dashboard(request):
    if request.user.role != 'student':
        return redirect('dashboard')
    courses = request.user.enrolled_courses.filter(is_active=True)
    return render(request, 'accounts/student_dashboard.html', {'courses': courses})


@login_required
def manage_users(request):
    if request.user.role != 'admin':
        return redirect('dashboard')

    if request.method == 'POST':
        action = request.POST.get('action')

        if action == 'create':
            email = request.POST.get('email')
            full_name = request.POST.get('full_name')
            password = request.POST.get('password')
            role = request.POST.get('role')
            if not CustomUser.objects.filter(email=email).exists():
                CustomUser.objects.create_user(email=email, password=password,
                                               full_name=full_name, role=role)
                messages.success(request, f'User {full_name} created successfully.')
            else:
                messages.error(request, 'Email already exists.')

        elif action == 'toggle':
            user_id = request.POST.get('user_id')
            user = CustomUser.objects.get(id=user_id)
            user.is_active = not user.is_active
            user.save()
            status = 'enabled' if user.is_active else 'disabled'
            messages.success(request, f'User {user.full_name} {status}.')

        elif action == 'force_logout':
            user_id = request.POST.get('user_id')
            user = CustomUser.objects.get(id=user_id)
            user.session_token = ''
            user.save()
            messages.success(request, f'{user.full_name} has been logged out.')

        return redirect('manage_users')

    users = CustomUser.objects.all().order_by('role')
    return render(request, 'accounts/manage_users.html', {'users': users})