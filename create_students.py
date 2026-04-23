#!/usr/bin/env python
import os
import django

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'LMS.settings')
django.setup()

from core.models import User

# Create sample students
students_data = [
    {'username': 'student1', 'email': 'student1@example.com', 'role': 'student'},
    {'username': 'student2', 'email': 'student2@example.com', 'role': 'student'},
    {'username': 'student3', 'email': 'student3@example.com', 'role': 'student'}
]

for student_data in students_data:
    if not User.objects.filter(username=student_data['username']).exists():
        User.objects.create_user(
            username=student_data['username'],
            email=student_data['email'],
            password='student123',
            role=student_data['role']
        )
        print(f'Created student: {student_data["username"]}')
    else:
        print(f'Student already exists: {student_data["username"]}')

print('Total users:', User.objects.count())
print('Students:', list(User.objects.filter(role='student').values_list('username', flat=True)))
