from django.shortcuts import render, redirect, get_object_or_404
from .models import Course, Enrollment
from django.contrib.auth.decorators import login_required

@login_required
def enroll_course(request, course_id):
    course = get_object_or_404(Course, id=course_id)

    # prevent duplicate enrollment
    already_enrolled = Enrollment.objects.filter(
        user=request.user, course=course
    ).exists()

    if not already_enrolled:
        Enrollment.objects.create(user=request.user, course=course)

    return redirect('course_list')
# Create your views here.
def course_list(request):
    courses = Course.objects.all()
    return render(request, 'course_list.html', {'courses': courses})

from django.http import HttpResponse

def home(request):
    return HttpResponse("LMS is running 🚀")

from django.shortcuts import render, redirect, get_object_or_404
from .models import Course, Enrollment

# Show all courses
def course_list(request):
    courses = Course.objects.all()
    return render(request, 'course_list.html', {'courses': courses})

# Enroll user in course
def enroll_course(request, course_id):
    course = get_object_or_404(Course, id=course_id)

    already_enrolled = Enrollment.objects.filter(
        user=request.user,
        course=course
    ).exists()

    if not already_enrolled:
        Enrollment.objects.create(user=request.user, course=course)

    return redirect('course_list')

from django.contrib.auth.decorators import login_required

@login_required
def my_courses(request):
    enrollments = Enrollment.objects.filter(user=request.user)
    return render(request, 'core/my_courses.html', {'enrollments': enrollments})
