from rest_framework import viewsets, permissions, status, filters
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import action
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from users.models import User, UserSession
from courses.models import Course, CourseVideo
from .serializers import (
    UserSerializer, UserCreateSerializer, UserSessionSerializer,
    CourseSerializer, CourseVideoSerializer
)

class IsAdminUser(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role == 'ADMIN')

class IsTrainerOrAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role in ['ADMIN', 'TRAINER'])

class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        
        user = authenticate(username=email, password=password)
        if user is None:
            # Maybe phone number?
            try:
                user_by_phone = User.objects.get(phone_number=email)
                user = authenticate(username=user_by_phone.email, password=password)
            except User.DoesNotExist:
                user = None

        if user:
            # Invalidate older sessions
            UserSession.objects.filter(user=user, is_active=True).update(is_active=False)
            
            refresh = RefreshToken.for_user(user)
            token_str = str(refresh.access_token)
            
            # Create new session
            x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
            if x_forwarded_for:
                ip = x_forwarded_for.split(',')[0]
            else:
                ip = request.META.get('REMOTE_ADDR')
            
            UserSession.objects.create(
                user=user,
                session_token=token_str,
                ip_address=ip,
                device_info=request.META.get('HTTP_USER_AGENT', ''),
                is_active=True
            )
            
            return Response({
                'refresh': str(refresh),
                'access': token_str,
                'user': UserSerializer(user).data
            })
        return Response({"detail": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    permission_classes = [IsAdminUser]
    
    def get_serializer_class(self):
        if self.action == 'create' or self.action == 'update':
            return UserCreateSerializer
        return UserSerializer

class SessionViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = UserSession.objects.all().order_by('-created_at')
    permission_classes = [IsAdminUser]
    serializer_class = UserSessionSerializer

    @action(detail=True, methods=['post'])
    def force_logout(self, request, pk=None):
        session = self.get_object()
        session.is_active = False
        session.save()
        return Response({"detail": "Session invalidated"}, status=status.HTTP_200_OK)

class CourseViewSet(viewsets.ModelViewSet):
    serializer_class = CourseSerializer
    
    def get_queryset(self):
        user = self.request.user
        if user.role in ['ADMIN', 'TRAINER']:
            return Course.objects.all()
        # Student, only assigned courses
        return Course.objects.filter(assigned_users=user)

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsTrainerOrAdmin()]
        return [permissions.IsAuthenticated()]

class CourseVideoViewSet(viewsets.ModelViewSet):
    serializer_class = CourseVideoSerializer

    def get_queryset(self):
        return CourseVideo.objects.filter(course_id=self.kwargs['course_pk'])

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsTrainerOrAdmin()]
        # Allow authenticated students to read, but they should only read assigned courses videos
        # Ideally would check if user is assigned to course
        return [permissions.IsAuthenticated()]
        
    def perform_create(self, serializer):
        course = Course.objects.get(pk=self.kwargs['course_pk'])
        serializer.save(course=course)
