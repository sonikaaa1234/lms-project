from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser


class CustomUserAdmin(UserAdmin):
    model = CustomUser
    list_display = ['email', 'full_name', 'role', 'is_active']
    list_filter = ['role', 'is_active']
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal', {'fields': ('full_name', 'mobile', 'role')}),
        ('Session', {'fields': ('last_login_ip', 'last_login_device', 'session_token')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'full_name', 'role', 'password1', 'password2'),
        }),
    )
    search_fields = ['email', 'full_name']
    ordering = ['email']


admin.site.register(CustomUser, CustomUserAdmin)