from django.core.management.base import BaseCommand
from users.models import User
from courses.models import Course, CourseVideo

class Command(BaseCommand):
    help = 'Seeds the database with initial data'

    def handle(self, *args, **options):
        if User.objects.exists():
            self.stdout.write(self.style.SUCCESS("Database is already seeded."))
            return

        # Users
        admin = User.objects.create_superuser(email='admin@lms.com', username='admin@lms.com', role='ADMIN', password='password123')
        trainer = User.objects.create_user(email='trainer@lms.com', username='trainer@lms.com', role='TRAINER', password='password123')
        student1 = User.objects.create_user(email='student1@lms.com', username='student1@lms.com', role='STUDENT', password='password123')
        student2 = User.objects.create_user(email='student2@lms.com', username='student2@lms.com', role='STUDENT', password='password123')

        # Course
        course = Course.objects.create(title='React Native Masterclass', description='Learn React Native from scratch.')
        course.assigned_users.add(trainer, student1)

        # Videos
        CourseVideo.objects.create(course=course, title='Introduction to React Native', youtube_link='https://www.youtube.com/watch?v=0-S5a0eXPoc', order=1)
        CourseVideo.objects.create(course=course, title='Components and Props', youtube_link='https://www.youtube.com/watch?v=R9I1i1uPZjg', order=2)

        self.stdout.write(self.style.SUCCESS("Database seeded successfully: admin@lms.com, trainer@lms.com, student[1-2]@lms.com. Pswd: password123"))
