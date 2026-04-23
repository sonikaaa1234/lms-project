from django.urls import path
from . import api_views

urlpatterns = [
    # Authentication endpoints
    path('auth/login/', api_views.api_login, name='api_login'),
    path('auth/logout/', api_views.api_logout, name='api_logout'),
    path('auth/user/', api_views.api_current_user, name='api_current_user'),
    
    # Course endpoints
    path('courses/', api_views.api_courses, name='api_courses'),
    path('courses/<int:course_id>/', api_views.api_course_detail, name='api_course_detail'),
    path('courses/<int:course_id>/videos/', api_views.api_course_videos, name='api_course_videos'),
    path('courses/<int:course_id>/enroll/', api_views.api_enroll_student, name='api_enroll_student'),
    
    # Video endpoints
    path('videos/<int:video_id>/', api_views.api_video_detail, name='api_video_detail'),
    path('videos/<int:video_id>/delete/', api_views.api_delete_video, name='api_delete_video'),
    path('videos/create/', api_views.api_create_video, name='api_create_video'),
    path('videos/seed/', api_views.api_seed_videos, name='api_seed_videos'),
    
    # User endpoints
    path('users/', api_views.api_users, name='api_users'),
    path('users/stats/', api_views.api_user_stats, name='api_user_stats'),
]
