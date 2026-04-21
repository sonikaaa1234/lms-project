from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from .models import Course, Video
from accounts.models import CustomUser


@login_required
def course_list(request):
    if request.user.role == 'admin':
        courses = Course.objects.all()
    elif request.user.role == 'trainer':
        courses = Course.objects.filter(created_by=request.user)
    else:
        courses = request.user.enrolled_courses.filter(is_active=True)
    return render(request, 'courses/course_list.html', {'courses': courses})


@login_required
def create_course(request):
    if request.user.role not in ['admin', 'trainer']:
        return redirect('dashboard')

    if request.method == 'POST':
        title = request.POST.get('title')
        description = request.POST.get('description')
        course = Course.objects.create(
            title=title,
            description=description,
            created_by=request.user
        )
        # Assign students
        student_ids = request.POST.getlist('students')
        course.assigned_students.set(student_ids)
        messages.success(request, f'Course "{title}" created successfully!')
        return redirect('course_list')

    students = CustomUser.objects.filter(role='student', is_active=True)
    return render(request, 'courses/create_course.html', {'students': students})


@login_required
def course_detail(request, course_id):
    course = get_object_or_404(Course, id=course_id)

    # Students can only see assigned courses
    if request.user.role == 'student':
        if course not in request.user.enrolled_courses.all():
            messages.error(request, 'You are not enrolled in this course.')
            return redirect('dashboard')

    videos = course.videos.all()
    return render(request, 'courses/course_detail.html', {
        'course': course,
        'videos': videos,
    })


@login_required
def add_video(request, course_id):
    course = get_object_or_404(Course, id=course_id)
    if request.user.role not in ['admin', 'trainer']:
        return redirect('dashboard')

    if request.method == 'POST':
        title = request.POST.get('title')
        youtube_url = request.POST.get('youtube_url')
        order = request.POST.get('order', 0)
        Video.objects.create(
            course=course,
            title=title,
            youtube_url=youtube_url,
            order=order
        )
        messages.success(request, f'Video "{title}" added successfully!')
        return redirect('course_detail', course_id=course.id)

    return render(request, 'courses/add_video.html', {'course': course})


@login_required
def watch_video(request, video_id):
    video = get_object_or_404(Video, id=video_id)
    course = video.course

    if request.user.role == 'student':
        if course not in request.user.enrolled_courses.all():
            messages.error(request, 'Access denied.')
            return redirect('dashboard')

    youtube_id = video.get_youtube_id()
    watermark = request.user.full_name + ' | ' + request.user.email

    return render(request, 'courses/watch_video.html', {
        'video': video,
        'course': course,
        'youtube_id': youtube_id,
        'watermark': watermark,
    })


@login_required
def assign_students(request, course_id):
    if request.user.role not in ['admin', 'trainer']:
        return redirect('dashboard')

    course = get_object_or_404(Course, id=course_id)
    if request.method == 'POST':
        student_ids = request.POST.getlist('students')
        course.assigned_students.set(student_ids)
        messages.success(request, 'Students assigned successfully!')
        return redirect('course_detail', course_id=course.id)

    students = CustomUser.objects.filter(role='student', is_active=True)
    return render(request, 'courses/assign_students.html', {
        'course': course,
        'students': students,
        'assigned': course.assigned_students.all(),
    })