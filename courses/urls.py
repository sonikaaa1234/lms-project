from django.urls import path
from . import views

urlpatterns = [
    path('', views.course_list, name='course_list'),
    path('create/', views.create_course, name='create_course'),
    path('<int:course_id>/', views.course_detail, name='course_detail'),
    path('<int:course_id>/add-video/', views.add_video, name='add_video'),
    path('<int:course_id>/assign/', views.assign_students, name='assign_students'),
    path('video/<int:video_id>/watch/', views.watch_video, name='watch_video'),
]