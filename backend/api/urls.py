from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    LoginView, UserViewSet, SessionViewSet,
    CourseViewSet, CourseVideoViewSet
)

router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')
router.register(r'sessions', SessionViewSet, basename='session')
router.register(r'courses', CourseViewSet, basename='course')

# For nested routing manually:
course_video_list = CourseVideoViewSet.as_view({
    'get': 'list',
    'post': 'create'
})
course_video_detail = CourseVideoViewSet.as_view({
    'get': 'retrieve',
    'put': 'update',
    'patch': 'partial_update',
    'delete': 'destroy'
})

urlpatterns = [
    path('auth/login/', LoginView.as_view(), name='login'),
    path('', include(router.urls)),
    path('courses/<int:course_pk>/videos/', course_video_list, name='course-videos-list'),
    path('courses/<int:course_pk>/videos/<int:pk>/', course_video_detail, name='course-videos-detail'),
]
