from django.shortcuts import render, redirect
#from .models import Course
from django.contrib.auth.decorators import login_required
#from .models import Video
from .models import Enrollment
from lsmapp.models import User
from .models import Video, Course
from .models import Progress, Video
from django.shortcuts import redirect
from .models import Progress, Video
from .models import Question, Choice, Course
import random
from .models import Question, Choice
from django.contrib import messages
import random
@login_required
def create_course(request):
    if request.method == 'POST':
        title = request.POST['title']
        description = request.POST['description']

        Course.objects.create(
            title=title,
            description=description,
            trainer=request.user
        )

        return redirect('trainer_dashboard')

    return render(request, 'create_course.html')


@login_required
def add_video(request):
    if request.method == 'POST':
        title = request.POST['title']
        link = request.POST['link']
        course_id = request.POST['course']

        Video.objects.create(
            title=title,
            youtube_link=link,
            course_id=course_id
        )

        return redirect('trainer_dashboard')

    courses = Course.objects.filter(trainer=request.user)
    return render(request, 'add_video.html', {'courses': courses})

@login_required
def manage_students(request):
    if request.method == 'POST':
        student_id = request.POST['student']
        course_id = request.POST['course']

        Enrollment.objects.create(
            student_id=student_id,
            course_id=course_id
        )

        return redirect('dashboard')

    students = User.objects.filter(role='student')
    courses = Course.objects.filter(trainer=request.user)

    return render(request, 'manage_students.html', {
        'students': students,
        'courses': courses
    })


@login_required
def student_courses(request):
    enrollments = Enrollment.objects.filter(student=request.user)
    return render(request, 'student_courses.html', {'enrollments': enrollments})



@login_required
def course_videos(request, course_id):
    course = Course.objects.get(id=course_id)
    videos = Video.objects.filter(course=course)

    total = videos.count()
    completed = Progress.objects.filter(
        student=request.user,
        video__in=videos,
        completed=True
    ).count()

    progress = 0
    if total > 0:
        progress = int((completed / total) * 100)

    return render(request, 'course_videos.html', {
        'course': course,
        'videos': videos,
        'progress': progress
    }) 
@login_required
def profile(request):
    return render(request, 'profile.html')

def mark_complete(request, video_id):
    video = Video.objects.get(id=video_id)

    Progress.objects.get_or_create(
        student=request.user,
        video=video,
        defaults={'completed': True}
    )

    return redirect('course_videos', course_id=video.course.id)


def mark_complete(request, video_id):
    video = Video.objects.get(id=video_id)

    Progress.objects.get_or_create(
        student=request.user,
        video=video,
        defaults={'completed': True}
    )

    return redirect('course_videos', course_id=video.course.id)


from django.contrib import messages
import random

def add_question(request):
    courses = Course.objects.all()

    if request.method == 'POST':

        # 🔥 AUTO GENERATE (FOR TRAINER)
        if 'count' in request.POST:
            count = int(request.POST.get('count'))
            course_id = request.POST.get('gen_course')

            all_questions = list(Question.objects.filter(course_id=course_id))

            selected = random.sample(all_questions, min(count, len(all_questions)))

            # ✅ DO NOT SHOW QUIZ HERE
            messages.success(request, f"{len(selected)} questions selected for quiz!")

            return redirect('trainer_dashboard')  # go back

        # ✅ MANUAL ADD
        course_id = request.POST.get('course')
        question_text = request.POST.get('question')
        correct = request.POST.get('correct')

        q = Question.objects.create(
            course_id=course_id,
            text=question_text
        )

        options = [
            request.POST.get('opt1'),
            request.POST.get('opt2'),
            request.POST.get('opt3'),
            request.POST.get('opt4')
        ]

        for i, opt in enumerate(options, start=1):
            Choice.objects.create(
                question=q,
                text=opt,
                is_correct=(str(i) == correct)
            )

        messages.success(request, "Question added successfully!")

    return render(request, 'add_question.html', {'courses': courses})

def take_quiz(request, course_id):
    all_questions = list(Question.objects.filter(course_id=course_id))

    count = 5  # or dynamic later
    questions = random.sample(all_questions, min(count, len(all_questions)))

    return render(request, 'take_quiz.html', {
        'questions': questions,
        'total': len(questions)
    })