# Learning Management System (LMS)

A simple and friendly Learning Management System built with Django and React. This platform helps teachers create courses and share video lessons with students.

## 🎯 What This Project Does

- **Course Management**: Teachers can create and manage courses
- **Video Lessons**: Add YouTube videos to your courses with descriptions
- **User Roles**: Three types of users - Admin, Teacher, and Student
- **Easy Login**: Simple authentication system for all users

## 🚀 Getting Started

### Prerequisites

Before you start, make sure you have:
- Python 3.6 or higher installed
- Node.js and npm installed
- Basic understanding of command line

### Installation Steps

1. **Clone the project**
   ```bash
   git clone https://github.com/sonikaaa1234/lms-project.git
   cd lms-project
   ```

2. **Set up the Backend (Django)**
   ```bash
   # Create a virtual environment
   python -m venv venv
   
   # Activate it
   # On Windows: venv\Scripts\activate
   # On Mac/Linux: source venv/bin/activate
   
   # Install Django and other packages
   pip install django djangorestframework django-cors-headers
   
   # Set up the database
   python manage.py makemigrations
   python manage.py migrate
   
   # Create an admin user
   python manage.py createsuperuser
   ```

3. **Set up the Frontend (React)**
   ```bash
   # Go to the frontend folder
   cd frontend
   
   # Install React packages
   npm install
   
   # Go back to the main folder
   cd ..
   ```

4. **Run the Application**
   
   **Terminal 1 - Start Django Backend:**
   ```bash
   python manage.py runserver
   ```
   
   **Terminal 2 - Start React Frontend:**
   ```bash
   cd frontend
   npm start
   ```

5. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - Admin Panel: http://localhost:8000/admin

## 📚 How to Use

### For Teachers
1. Log in with your teacher account
2. Create new courses from the dashboard
3. Add YouTube videos to your courses
4. Enroll students in your courses

### For Students
1. Log in with your student account
2. Browse available courses
3. Watch video lessons
4. Track your progress

### For Admins
1. Access the admin panel at `/admin`
2. Manage users, courses, and videos
3. Create teacher and student accounts

## 🛠️ Project Structure

```
lms-project/
├── LMS/                 # Django project settings
├── core/                # Main Django app with models and views
├── frontend/            # React application
├── templates/           # HTML templates
├── static/             # Static files
├── manage.py           # Django management script
└── README.md           # This file
```

## 🎥 Adding YouTube Videos

When adding videos to courses:
1. Copy the YouTube video URL
2. Add a title and description
3. Set the order (1, 2, 3...) to arrange videos
4. Save and the video will appear in the course

## 🔧 Common Issues

**Problem:** "ModuleNotFoundError: No module named 'django'"
**Solution:** Make sure you activated your virtual environment and installed Django

**Problem:** Frontend not loading
**Solution:** Make sure both Django and React servers are running in different terminals

**Problem:** Can't access admin panel
**Solution:** Create a superuser using `python manage.py createsuperuser`

## 🤝 Contributing

This is a team project with 50+ members working together. To contribute:

1. Create a new branch for your feature
2. Make your changes
3. Test everything works
4. Commit your changes with clear messages
5. Push your branch and create a pull request

## 📝 License

This project is for educational purposes. Feel free to learn from it and improve it!

## 🆘 Need Help?

If you're stuck:
1. Check if all installations are correct
2. Make sure both servers are running
3. Ask a team member for help
4. Check the Django admin panel for any issues

Happy Learning! 🎓
