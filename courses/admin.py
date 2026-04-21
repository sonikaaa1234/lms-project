from django.contrib import admin
from .models import Course, Video


class VideoInline(admin.TabularInline):
    model = Video
    extra = 1


class CourseAdmin(admin.ModelAdmin):
    list_display = ['title', 'is_active', 'created_at']
    list_filter = ['is_active']
    search_fields = ['title']
    inlines = [VideoInline]


admin.site.register(Course, CourseAdmin)
admin.site.register(Video)