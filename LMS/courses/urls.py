from django.urls import path
'''from .views import create_course
from .views import add_video
from .views import manage_students '''
from .views import student_courses, course_videos
from .views import profile
from .views import create_course, add_video, manage_students, mark_complete
from . import views
urlpatterns = [
    path('create-course/', create_course, name='create_course'),
    path('add-video/', add_video, name='add_video'),
    path('manage-students/', manage_students, name='manage_students'),
    path('complete/<int:video_id>/', mark_complete, name='mark_complete'),
    path('add-question/', views.add_question, name='add_question'),
    path('quiz/<int:course_id>/', views.take_quiz, name='take_quiz'),

]

urlpatterns += [
    path('my-courses/', student_courses, name='student_courses'),
    path('course/<int:course_id>/', course_videos, name='course_videos'),
]

urlpatterns += [
    path('profile/', profile, name='profile'),
]
