from django.urls import path
from . import views

urlpatterns = [
    path('', views.login_view, name='login'),
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('dashboard/', views.dashboard, name='dashboard'),
    path('course/<int:course_id>/', views.course_detail, name='course_detail'),
    path('video/<int:video_id>/', views.video_watch, name='video_watch'),
    path('users/', views.user_management, name='user_management'),
    path('users/create/', views.create_user, name='create_user'),
    path('courses/', views.course_management, name='course_management'),
    path('courses/create/', views.create_course, name='create_course'),
    path('course/<int:course_id>/add-video/', views.add_video, name='add_video'),
    path('course/<int:course_id>/enroll/', views.enroll_student, name='enroll_student'),
]
