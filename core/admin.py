from django.contrib import admin
from .models import User, Course, Video, UserSession


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ['username', 'email', 'role', 'phone', 'is_active', 'date_joined']
    list_filter = ['role', 'is_active', 'date_joined']
    search_fields = ['username', 'email', 'phone']
    ordering = ['-date_joined']


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ['title', 'trainer', 'is_active', 'student_count', 'video_count', 'created_at']
    list_filter = ['is_active', 'created_at', 'trainer']
    search_fields = ['title', 'description', 'trainer__username']
    ordering = ['-created_at']
    
    def student_count(self, obj):
        return obj.students.count()
    student_count.short_description = 'Students'
    
    def video_count(self, obj):
        return obj.videos.count()
    video_count.short_description = 'Videos'


@admin.register(Video)
class VideoAdmin(admin.ModelAdmin):
    list_display = ['title', 'course', 'order', 'is_active', 'created_at']
    list_filter = ['is_active', 'created_at', 'course']
    search_fields = ['title', 'description', 'course__title']
    ordering = ['course', 'order']


@admin.register(UserSession)
class UserSessionAdmin(admin.ModelAdmin):
    list_display = ['user', 'ip_address', 'is_active', 'created_at', 'last_activity']
    list_filter = ['is_active', 'created_at']
    search_fields = ['user__username', 'ip_address']
    ordering = ['-last_activity']
    readonly_fields = ['session_key', 'ip_address', 'user_agent', 'created_at', 'last_activity']
