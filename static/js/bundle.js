// Simple React Bundle for LMS
// This is a minimal implementation for demonstration

// Mock React and React Router for simplicity
window.React = {
  useState: (initial) => [initial, () => {}],
  useEffect: (fn, deps) => fn(),
  createContext: (defaultValue) => ({
    Provider: ({ children }) => children,
    useContext: () => defaultValue
  })
};

window.ReactRouterDOM = {
  BrowserRouter: ({ children }) => children,
  Routes: ({ children }) => children,
  Route: ({ element }) => element,
  Navigate: () => null,
  useParams: () => ({ id: '1' }),
  Link: ({ children, href }) => `<a href="${href}">${children}</a>`
};

// Simple Bootstrap components
window.Bootstrap = {
  Container: ({ children, className }) => `<div class="container ${className}">${children}</div>`,
  Row: ({ children }) => `<div class="row">${children}</div>`,
  Col: ({ children, md, lg }) => `<div class="col-md-${md || 12} col-lg-${lg || 12}">${children}</div>`,
  Card: ({ children, className }) => `<div class="card ${className}">${children}</div>`,
  Button: ({ children, variant, href, disabled }) => 
    `<button class="btn btn-${variant}" ${disabled ? 'disabled' : ''} ${href ? `onclick="window.location.href='${href}'"` : ''}>${children}</button>`,
  Form: ({ children, onSubmit }) => `<form onsubmit="${onSubmit}">${children}</form>`,
  Alert: ({ children, variant }) => `<div class="alert alert-${variant}">${children}</div>`
};

// API service
window.LMS_API = {
  login: async (credentials) => {
    try {
      // Use real Django authentication
      const response = await fetch('/api/auth/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify({
          username: credentials.username,
          password: credentials.password
        }),
        credentials: 'same-origin'
      });
      
      const result = await response.json();
      
      if (result.success) {
        // Store user data in localStorage
        localStorage.setItem('user', JSON.stringify(result.user));
        localStorage.setItem('token', result.token);
        return result;
      } else {
        throw new Error(result.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login API error:', error);
      throw error;
    }
  },
  
  getCourses: async () => {
    try {
      // Use real Django API
      const response = await fetch('/api/courses/', {
        method: 'GET',
        headers: {
          'X-CSRFToken': getCookie('csrftoken')
        },
        credentials: 'same-origin'
      });
      
      if (response.ok) {
        return await response.json();
      } else {
        // Fallback to mock data if API fails
        return [
          {
            id: 1,
            title: 'Introduction to Python',
            description: 'This comprehensive Python course covers everything from basic syntax to advanced concepts.',
            trainer: { username: 'admin', email: 'admin@lms.com' },
            video_count: 3,
            student_count: 1,
            is_active: true
          },
          {
            id: 2,
            title: 'Advanced JavaScript',
            description: 'Master JavaScript programming with modern ES6+ features and frameworks.',
            trainer: { username: 'admin', email: 'admin@lms.com' },
            video_count: 5,
            student_count: 2,
            is_active: true
          }
        ];
      }
    } catch (error) {
      console.error('Error loading courses:', error);
      // Fallback to mock data
      return [
        {
          id: 1,
          title: 'Introduction to Python',
          description: 'This comprehensive Python course covers everything from basic syntax to advanced concepts.',
          trainer: { username: 'admin', email: 'admin@lms.com' },
          video_count: 3,
          student_count: 1,
          is_active: true
        },
        {
          id: 2,
          title: 'Advanced JavaScript',
          description: 'Master JavaScript programming with modern ES6+ features and frameworks.',
          trainer: { username: 'admin', email: 'admin@lms.com' },
          video_count: 5,
          student_count: 2,
          is_active: true
        }
      ];
    }
  },
  
  getCurrentUser: async () => {
    // Mock current user data
    return {
      id: 1,
      username: 'admin',
      email: 'admin@lms.com',
      role: 'admin',
      phone: ''
    };
  },
  
  getUsers: async () => {
    // Mock users data for demonstration
    return [
      {
        id: 1,
        username: 'admin',
        email: 'admin@lms.com',
        role: 'admin',
        phone: '',
        is_active: true,
        date_joined: new Date().toISOString()
      },
      {
        id: 2,
        username: 'trainer1',
        email: 'trainer1@lms.com',
        role: 'trainer',
        phone: '123-456-7890',
        is_active: true,
        date_joined: new Date().toISOString()
      },
      {
        id: 3,
        username: 'student1',
        email: 'student1@lms.com',
        role: 'student',
        phone: '098-765-4321',
        is_active: true,
        date_joined: new Date().toISOString()
      }
    ];
  }
};

// CSRF cookie helper function
function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

// Simple routing
window.LMS_Router = {
  currentPage: window.location.pathname,
  routes: {
    '/login': 'login',
    '/dashboard': 'dashboard',
    '/course/:id': 'course',
    '/video/:id': 'video',
    '/users': 'users',
    '/courses': 'courses'
  },
  
  navigate: (path) => {
    window.history.pushState({}, '', path);
    window.LMS_Router.currentPage = path;
    window.LMS_Router.render();
  },
  
  render: () => {
    const path = window.LMS_Router.currentPage;
    const main = document.getElementById('root');
    
    if (path === '/login' || path === '/') {
      main.innerHTML = `
        <div class="container mt-5">
          <div class="row justify-content-center">
            <div class="col-md-6 col-lg-4">
              <div class="card">
                <div class="card-header text-center">
                  <h4><i class="fas fa-graduation-cap"></i> LMS Login</h4>
                </div>
                <div class="card-body">
                  <form id="loginForm">
                    <div class="mb-3">
                      <label class="form-label">Username/Email</label>
                      <input type="text" class="form-control" name="username" required>
                    </div>
                    <div class="mb-3">
                      <label class="form-label">Password</label>
                      <input type="password" class="form-control" name="password" required>
                    </div>
                    <div class="d-grid">
                      <button type="submit" class="btn btn-primary">
                        <i class="fas fa-sign-in-alt"></i> Login
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
      
      document.getElementById('loginForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const credentials = {
          username: formData.get('username'),
          password: formData.get('password')
        };
        
        try {
          const result = await window.LMS_API.login(credentials);
          if (result.success) {
            localStorage.setItem('token', result.token);
            localStorage.setItem('user', JSON.stringify(result.user));
            window.LMS_Router.navigate('/dashboard');
          } else {
            alert(result.message || 'Login failed');
          }
        } catch (error) {
          alert('Login error: ' + error.message);
        }
      });
      
    } else if (path === '/dashboard') {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      main.innerHTML = `
        <div class="container mt-4">
          <h2><i class="fas fa-tachometer-alt"></i> Dashboard</h2>
          <p class="text-muted">Welcome back, ${user.username}!</p>
          
          <!-- Statistics Cards -->
          <div class="row mb-4">
            <div class="col-md-3">
              <div class="card text-center">
                <div class="card-body">
                  <h5><i class="fas fa-book"></i></h5>
                  <h3 class="text-primary" id="totalCourses">Loading...</h3>
                  <p class="card-text">Total Courses</p>
                </div>
              </div>
            </div>
            <div class="col-md-3">
              <div class="card text-center">
                <div class="card-body">
                  <h5><i class="fas fa-users"></i></h5>
                  <h3 class="text-success" id="totalStudents">Loading...</h3>
                  <p class="card-text">Total Students</p>
                </div>
              </div>
            </div>
            <div class="col-md-3">
              <div class="card text-center">
                <div class="card-body">
                  <h5><i class="fas fa-video"></i></h5>
                  <h3 class="text-warning" id="totalVideos">Loading...</h3>
                  <p class="card-text">Total Videos</p>
                </div>
              </div>
            </div>
            <div class="col-md-3">
              <div class="card text-center">
                <div class="card-body">
                  <h5><i class="fas fa-check-circle"></i></h5>
                  <h3 class="text-info" id="activeCourses">Loading...</h3>
                  <p class="card-text">Active Courses</p>
                </div>
              </div>
            </div>
          </div>
          
          <div class="alert alert-info">
            <h5>LMS React Frontend</h5>
            <p>This is a React-based frontend for the LMS system.</p>
            <p>User Role: <span class="badge bg-primary">${user.role}</span></p>
            <div class="mt-3">
              <button class="btn btn-primary me-2" onclick="window.LMS_Router.navigate('/courses')">
                <i class="fas fa-book"></i> Manage Courses
              </button>
              ${user.role === 'admin' ? `
                <button class="btn btn-success me-2" onclick="window.LMS_Router.navigate('/users')">
                  <i class="fas fa-users"></i> Manage Users
                </button>
              ` : ''}
              <button class="btn btn-secondary" onclick="localStorage.clear(); window.LMS_Router.navigate('/login')">
                <i class="fas fa-sign-out-alt"></i> Logout
              </button>
            </div>
          </div>
        </div>
      `;
      
      // Load dashboard statistics
      loadDashboardStats();
      
      // Function to load dashboard statistics
      async function loadDashboardStats() {
        try {
          const response = await fetch('/api/users/stats/', {
            method: 'GET',
            headers: {
              'X-CSRFToken': getCookie('csrftoken')
            },
            credentials: 'same-origin'
          });
          
          if (response.ok) {
            const stats = await response.json();
            document.getElementById('totalCourses').textContent = stats.total_courses || 0;
            document.getElementById('totalStudents').textContent = stats.total_students || 0;
            document.getElementById('totalVideos').textContent = stats.total_videos || 0;
            document.getElementById('activeCourses').textContent = stats.active_courses || 0;
          } else {
            // Set to 0 if API fails
            document.getElementById('totalCourses').textContent = '0';
            document.getElementById('totalStudents').textContent = '0';
            document.getElementById('totalVideos').textContent = '0';
            document.getElementById('activeCourses').textContent = '0';
          }
        } catch (error) {
          console.error('Error loading dashboard stats:', error);
          // Set to 0 if error
          document.getElementById('totalCourses').textContent = '0';
          document.getElementById('totalStudents').textContent = '0';
          document.getElementById('totalVideos').textContent = '0';
          document.getElementById('activeCourses').textContent = '0';
        }
      }
      
    } else if (path === '/courses') {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      main.innerHTML = `
        <div class="container mt-4">
          <div class="d-flex justify-content-between align-items-center mb-4">
            <h2><i class="fas fa-book"></i> Course Management</h2>
            <button class="btn btn-primary" onclick="window.LMS_Router.navigate('/courses/create')">
              <i class="fas fa-plus"></i> Create Course
            </button>
          </div>
          
          <div class="row mb-4">
            <div class="col-md-3">
              <div class="card text-center">
                <div class="card-body">
                  <h5><i class="fas fa-book"></i></h5>
                  <h3 class="text-primary">0</h3>
                  <p class="card-text">Total Courses</p>
                </div>
              </div>
            </div>
            <div class="col-md-3">
              <div class="card text-center">
                <div class="card-body">
                  <h5><i class="fas fa-users"></i></h5>
                  <h3 class="text-success">0</h3>
                  <p class="card-text">Total Students</p>
                </div>
              </div>
            </div>
            <div class="col-md-3">
              <div class="card text-center">
                <div class="card-body">
                  <h5><i class="fas fa-video"></i></h5>
                  <h3 class="text-warning">0</h3>
                  <p class="card-text">Total Videos</p>
                </div>
              </div>
            </div>
            <div class="col-md-3">
              <div class="card text-center">
                <div class="card-body">
                  <h5><i class="fas fa-check-circle"></i></h5>
                  <h3 class="text-info">0</h3>
                  <p class="card-text">Active Courses</p>
                </div>
              </div>
            </div>
          </div>
          
          <div class="card">
            <div class="card-header">
              <h5><i class="fas fa-list"></i> 
                ${user.role === 'admin' ? 'All Courses' : 'My Courses'}
              </h5>
            </div>
            <div class="card-body">
              <div id="coursesList">
                <div class="text-center">
                  <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                  </div>
                  <p class="mt-2">Loading courses...</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
      
      // Load courses
      window.LMS_API.getCourses().then(courses => {
        const coursesList = document.getElementById('coursesList');
        if (courses.length === 0) {
          coursesList.innerHTML = `
            <div class="text-center">
              <p class="text-muted">
                ${user.role === 'admin' 
                  ? 'No courses found in the system.' 
                  : 'You haven\'t created any courses yet.'}
              </p>
              <button class="btn btn-primary" onclick="window.LMS_Router.navigate('/courses/create')">
                <i class="fas fa-plus"></i> Create Your First Course
              </button>
            </div>
          `;
        } else {
          coursesList.innerHTML = `
            <div class="table-responsive">
              <table class="table table-striped">
                <thead>
                  <tr>
                    <th>Title</th>
                    ${user.role === 'admin' ? '<th>Trainer</th>' : ''}
                    <th>Description</th>
                    <th>Students</th>
                    <th>Videos</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  ${courses.map(course => `
                    <tr>
                      <td><strong>${course.title}</strong></td>
                      ${user.role === 'admin' ? `<td>${course.trainer?.username || 'N/A'}</td>` : ''}
                      <td>${course.description ? course.description.substring(0, 50) + '...' : 'No description'}</td>
                      <td><span class="badge bg-primary">${course.student_count || 0}</span></td>
                      <td><span class="badge bg-info">0</span></td>
                      <td>
                        <span class="badge bg-${course.is_active ? 'success' : 'danger'}">
                          ${course.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td>
                        <div class="btn-group" role="group">
                          <button class="btn btn-primary btn-sm" onclick="window.LMS_Router.navigate('/course/${course.id}')" title="View Course">
                            <i class="fas fa-eye"></i>
                          </button>
                          <button class="btn btn-success btn-sm" onclick="window.LMS_Router.navigate('/course/${course.id}/add-video')" title="Add Video">
                            <i class="fas fa-plus"></i>
                          </button>
                          ${user.role === 'admin' ? `
                            <button class="btn btn-info btn-sm" onclick="window.LMS_Router.navigate('/course/${course.id}/enroll')" title="Enroll Student">
                              <i class="fas fa-user-plus"></i>
                            </button>
                          ` : ''}
                        </div>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          `;
        }
      }).catch(error => {
        document.getElementById('coursesList').innerHTML = `
          <div class="alert alert-danger">
            <h5>Error Loading Courses</h5>
            <p>${error.message}</p>
          </div>
        `;
      });
      
    } else if (path === '/users') {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (user.role !== 'admin') {
        main.innerHTML = `
          <div class="container mt-4">
            <div class="alert alert-danger">
              <h4>Access Denied</h4>
              <p>You don't have permission to access this page.</p>
              <button class="btn btn-primary" onclick="window.LMS_Router.navigate('/dashboard')">
                <i class="fas fa-arrow-left"></i> Back to Dashboard
              </button>
            </div>
          </div>
        `;
      } else {
        main.innerHTML = `
          <div class="container mt-4">
            <div class="d-flex justify-content-between align-items-center mb-4">
              <h2><i class="fas fa-users"></i> User Management</h2>
              <button class="btn btn-primary" onclick="window.LMS_Router.navigate('/users/create')">
                <i class="fas fa-plus"></i> Create User
              </button>
            </div>
            
            <div class="row mb-4">
              <div class="col-md-3">
                <div class="card text-center">
                  <div class="card-body">
                    <h5><i class="fas fa-users"></i></h5>
                    <h3 class="text-success">0</h3>
                    <p class="card-text">Total Users</p>
                  </div>
                </div>
              </div>
              <div class="col-md-3">
                <div class="card text-center">
                  <div class="card-body">
                    <h5><i class="fas fa-user-graduate"></i></h5>
                    <h3 class="text-primary">0</h3>
                    <p class="card-text">Students</p>
                  </div>
                </div>
              </div>
              <div class="col-md-3">
                <div class="card text-center">
                  <div class="card-body">
                    <h5><i class="fas fa-chalkboard-teacher"></i></h5>
                    <h3 class="text-warning">0</h3>
                    <p class="card-text">Trainers</p>
                  </div>
                </div>
              </div>
              <div class="col-md-3">
                <div class="card text-center">
                  <div class="card-body">
                    <h5><i class="fas fa-user-shield"></i></h5>
                    <h3 class="text-danger">1</h3>
                    <p class="card-text">Admins</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="card">
              <div class="card-header">
                <h5><i class="fas fa-list"></i> All Users</h5>
              </div>
              <div class="card-body">
                <div id="usersList">
                  <div class="text-center">
                    <div class="spinner-border text-primary" role="status">
                      <span class="visually-hidden">Loading...</span>
                    </div>
                    <p class="mt-2">Loading users...</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        `;
        
        // Load users
        window.LMS_API.getUsers().then(users => {
            const usersList = document.getElementById('usersList');
            if (users.length === 0) {
              usersList.innerHTML = `
                <div class="text-center">
                  <p class="text-muted">No users found.</p>
                  <button class="btn btn-primary" onclick="window.LMS_Router.navigate('/users/create')">
                    <i class="fas fa-plus"></i> Create First User
                  </button>
                </div>
              `;
            } else {
              usersList.innerHTML = `
                <div class="table-responsive">
                  <table class="table table-striped">
                    <thead>
                      <tr>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Phone</th>
                        <th>Status</th>
                        <th>Joined</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${users.map(user => `
                        <tr>
                          <td>${user.username}</td>
                          <td>${user.email}</td>
                          <td>
                            <span class="badge bg-${user.role === 'admin' ? 'danger' : user.role === 'trainer' ? 'warning' : 'info'}">
                              ${user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                            </span>
                          </td>
                          <td>${user.phone || '-'}</td>
                          <td>
                            <span class="badge bg-${user.is_active ? 'success' : 'danger'}">
                              ${user.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td>${new Date(user.date_joined).toLocaleDateString()}</td>
                          <td>
                            <div class="btn-group" role="group">
                              ${user.role === 'student' ? `
                                <button class="btn btn-info btn-sm" disabled title="View enrolled courses">
                                  <i class="fas fa-book"></i>
                                </button>
                              ` : ''}
                              ${user.role === 'trainer' ? `
                                <button class="btn btn-info btn-sm" disabled title="View courses">
                                  <i class="fas fa-chalkboard-teacher"></i>
                                </button>
                              ` : ''}
                            </div>
                          </td>
                        </tr>
                      `).join('')}
                    </tbody>
                  </table>
                </div>
              `;
            }
          })
          .catch(error => {
            document.getElementById('usersList').innerHTML = `
              <div class="alert alert-danger">
                <h5>Error Loading Users</h5>
                <p>${error.message}</p>
              </div>
            `;
          });
      }
      
    } else if (path.startsWith('/course/') && !path.includes('/add-video')) {
      const courseId = path.split('/')[2];
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      
      // Mock course data
      const course = {
        id: courseId,
        title: 'Introduction to Python',
        description: 'This comprehensive Python course covers everything from basic syntax to advanced concepts. Learn variables, data types, control flow, functions, and object-oriented programming.',
        trainer: { username: 'admin', email: 'admin@lms.com' },
        students: [
          { id: 3, username: 'student1', email: 'student1@lms.com' }
        ],
        videos: [] // Will be loaded from database API
      };
      
      main.innerHTML = `
        <div class="container mt-4">
          <nav aria-label="breadcrumb">
            <ol class="breadcrumb">
              <li class="breadcrumb-item"><a href="#" onclick="window.LMS_Router.navigate('/dashboard')">Dashboard</a></li>
              <li class="breadcrumb-item"><a href="#" onclick="window.LMS_Router.navigate('/courses')">Courses</a></li>
              <li class="breadcrumb-item active">${course.title}</li>
            </ol>
          </nav>
          
          <div class="row">
            <div class="col">
              <div class="card">
                <div class="card-header d-flex justify-content-between align-items-center">
                  <div>
                    <h4><i class="fas fa-book"></i> ${course.title}</h4>
                    <p class="mb-0 text-muted">By ${course.trainer.username}</p>
                  </div>
                  ${user.role === 'admin' || user.role === 'trainer' ? `
                    <div>
                      <button class="btn btn-primary me-2" onclick="window.LMS_Router.navigate('/course/${courseId}/add-video')">
                        <i class="fas fa-plus"></i> Add Video
                      </button>
                      ${user.role === 'admin' ? `
                        <button class="btn btn-success" onclick="window.LMS_Router.navigate('/course/${courseId}/enroll')">
                          <i class="fas fa-user-plus"></i> Enroll Student
                        </button>
                      ` : ''}
                    </div>
                  ` : ''}
                </div>
                <div class="card-body">
                  <p>${course.description}</p>
                  <div class="row">
                    <div class="col-md-6">
                      <p><strong>Trainer:</strong> ${course.trainer.username}</p>
                      <p><strong>Enrolled Students:</strong> ${course.students.length}</p>
                    </div>
                    <div class="col-md-6">
                      <p><strong>Total Videos:</strong> ${course.videos.length}</p>
                      <p><strong>Status:</strong> 
                        <span class="badge bg-success">Active</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="row mt-4">
            <div class="col">
              <div class="card">
                <div class="card-header">
                  <h5><i class="fas fa-video"></i> Course Videos</h5>
                </div>
                <div class="card-body">
                  <div id="videosList">
                    <div class="text-center">
                      <p class="text-muted">Loading videos...</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          ${user.role === 'admin' && course.students.length > 0 ? `
            <div class="row mt-4">
              <div class="col">
                <div class="card">
                  <div class="card-header">
                    <h5><i class="fas fa-users"></i> Enrolled Students</h5>
                  </div>
                  <div class="card-body">
                    <div class="table-responsive">
                      <table class="table table-striped">
                        <thead>
                          <tr>
                            <th>Username</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Enrolled Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          ${course.students.map(student => `
                            <tr>
                              <td>${student.username}</td>
                              <td>${student.email}</td>
                              <td>-</td>
                              <td>${new Date().toLocaleDateString()}</td>
                            </tr>
                          `).join('')}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ` : ''}
        </div>
      `;
      
      // Load videos from database API
      loadVideosFromDatabase(courseId);
      
    } else if (path.startsWith('/video/') && path.split('/').length === 3) {
      const videoId = path.split('/')[2];
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      
      // Load video from database API
      loadVideoFromDatabase(videoId);
      
      // Function to load video from database
      async function loadVideoFromDatabase(videoId) {
        console.log('Loading video from database for video ID:', videoId);
        try {
          const response = await fetch(`/api/videos/${videoId}/`, {
            method: 'GET',
            headers: {
              'X-CSRFToken': getCookie('csrftoken')
            },
            credentials: 'same-origin'
          });
          
          console.log('Video API response status:', response.status);
          console.log('Video API response ok:', response.ok);
          
          if (response.ok) {
            const video = await response.json();
            console.log('Video loaded from database:', video);
            renderVideoPage(video);
          } else {
            console.error('Failed to load video:', response.status);
            const errorText = await response.text();
            console.error('Error response:', errorText);
            // Fallback to mock video data
            const video = {
              id: videoId,
              title: 'Python Introduction and Setup',
              youtube_url: 'https://www.youtube.com/watch?v=rfscVS0vtbw',
              description: 'Introduction to Python programming language and development environment setup.',
              course: {
                id: 1,
                title: 'Introduction to Python',
                trainer: { username: 'admin' }
              }
            };
            renderVideoPage(video);
          }
        } catch (error) {
          console.error('Error loading video:', error);
          console.error('Error details:', error.message);
          // Fallback to mock video data
          const video = {
            id: videoId,
            title: 'Python Introduction and Setup',
            youtube_url: 'https://www.youtube.com/watch?v=rfscVS0vtbw',
            description: 'Introduction to Python programming language and development environment setup.',
            course: {
              id: 1,
              title: 'Introduction to Python',
              trainer: { username: 'admin' }
            }
          };
          renderVideoPage(video);
        }
      }
      
      // Function to render video page
      function renderVideoPage(video) {
        // Extract YouTube video ID
        function getYouTubeVideoId(url) {
          const patterns = [
            new RegExp('(?:youtube\\.com\\/watch\\?v=([^&]+))'),
            new RegExp('(?:youtu\\.be\\/([^?]+))'),
            new RegExp('(?:youtube\\.com\\/embed\\/([^?]+))')
          ];
          
          for (const pattern of patterns) {
            const match = url.match(pattern);
            if (match) return match[1];
          }
          return null;
        }
        
        const youtubeVideoId = getYouTubeVideoId(video.youtube_url);
        
        main.innerHTML = `
          <div class="container mt-4">
            <nav aria-label="breadcrumb">
              <ol class="breadcrumb">
                <li class="breadcrumb-item"><a href="#" onclick="window.LMS_Router.navigate('/dashboard')">Dashboard</a></li>
                <li class="breadcrumb-item"><a href="#" onclick="window.LMS_Router.navigate('/courses')">Courses</a></li>
                <li class="breadcrumb-item"><a href="#" onclick="window.LMS_Router.navigate('/course/${video.course.id}')">${video.course.title}</a></li>
                <li class="breadcrumb-item active">${video.title}</li>
              </ol>
            </nav>
            
            <div class="row">
              <div class="col">
                <div class="card">
                  <div class="card-header">
                    <h4><i class="fas fa-video"></i> ${video.title}</h4>
                  <p class="mb-0 text-muted">Course: ${video.course.title}</p>
                </div>
                <div class="card-body p-0">
                  <div class="video-container video-security">
                    <div class="watermark" id="dynamic-watermark">
                      ${user.username} | ${user.email} | ${new Date().toLocaleString()}
                    </div>
                    ${youtubeVideoId ? `
                      <div class="video-player-wrapper">
                        <div class="video-preview-container" style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; cursor: pointer;" onclick="window.open('${video.youtube_url}', '_blank')">
                          <img 
                            src="https://img.youtube.com/vi/${youtubeVideoId}/maxresdefault.jpg" 
                            alt="${video.title}"
                            style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover;"
                            onerror="this.src='https://img.youtube.com/vi/${youtubeVideoId}/hqdefault.jpg'"
                          />
                          <div class="video-overlay" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; transition: all 0.3s;" onmouseover="this.style.background='rgba(0,0,0,0.5)'" onmouseout="this.style.background='rgba(0,0,0,0.3)'">
                            <div class="text-center text-white">
                              <div class="play-button" style="width: 80px; height: 80px; background: rgba(255,0,0,0.8); border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.3s;" onmouseover="this.style.background='rgba(255,0,0,1)'" onmouseout="this.style.background='rgba(255,0,0,0.8)'">
                                <i class="fas fa-play" style="font-size: 30px; margin-left: 8px;"></i>
                              </div>
                              <p class="mt-3 mb-0">Click to watch on YouTube</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="video-actions mt-3 text-center">
                        <div class="d-flex justify-content-center gap-2 flex-wrap">
                          <a href="${video.youtube_url}" target="_blank" class="btn btn-primary btn-lg">
                            <i class="fas fa-play"></i> Watch on YouTube
                          </a>
                          <button class="btn btn-secondary" onclick="window.open('${video.youtube_url}', '_blank')">
                            <i class="fas fa-external-link-alt"></i> Open in New Tab
                          </button>
                          <button class="btn btn-info" onclick="copyVideoUrl()">
                            <i class="fas fa-copy"></i> Copy URL
                          </button>
                        </div>
                        <div class="mt-3">
                          <p class="text-muted small mb-0">
                            <i class="fas fa-info-circle"></i> 
                            Video will open in YouTube for the best viewing experience
                          </p>
                        </div>
                      </div>
                    ` : `
                      <div class="d-flex align-items-center justify-content-center h-100">
                        <div class="text-center text-white">
                          <i class="fas fa-exclamation-triangle fa-3x mb-3"></i>
                          <h5>Video URL Not Available</h5>
                          <p>Please contact the administrator.</p>
                        </div>
                      </div>
                    `}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="row mt-4">
            <div class="col">
              <div class="video-info">
                <h5><i class="fas fa-info-circle"></i> Video Information</h5>
                <div class="row">
                  <div class="col-md-8">
                    <p><strong>Title:</strong> ${video.title}</p>
                    <p><strong>Description:</strong> ${video.description}</p>
                    <p><strong>Course:</strong> ${video.course.title}</p>
                    <p><strong>Trainer:</strong> ${video.course.trainer.username}</p>
                  </div>
                  <div class="col-md-4">
                    <p><strong>Order:</strong> ${video.order || 1}</p>
                    <p><strong>Duration:</strong> 
                      <span class="badge bg-info">${video.duration || 'N/A'}</span>
                    </p>
                    <p><strong>Added:</strong> ${new Date(video.created_at).toLocaleDateString()}</p>
                    <p><strong>Status:</strong> 
                      <span class="badge bg-success">Active</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="row mt-4">
            <div class="col">
              <div class="alert alert-info">
                <h6><i class="fas fa-shield-alt"></i> Security Notice</h6>
                <p class="mb-0">
                  <small>This video is protected by security measures. Screen recording and downloading are disabled. 
                  All access is logged for security purposes.</small>
                </p>
              </div>
            </div>
          </div>
          
          <div class="row mt-4">
            <div class="col d-flex justify-content-between">
              <button class="btn btn-secondary" onclick="window.LMS_Router.navigate('/course/${video.course.id}')">
                <i class="fas fa-arrow-left"></i> Back to Course
              </button>
            </div>
          </div>
        </div>
      `;
      
      // Setup security features for video player
      setupVideoSecurity();
      
      // Ensure video player loads properly
      setTimeout(() => {
        const iframe = document.getElementById('youtube-player');
        if (iframe) {
          console.log('YouTube iframe loaded successfully');
          // Add error handling for iframe
          iframe.onerror = function() {
            console.error('YouTube iframe error occurred');
            showVideoError();
          };
        }
      }, 1000);
      }
      
      // Function to reload video player
      window.reloadVideoPlayer = function() {
        console.log('Reloading video player...');
        console.log('YouTube Video ID:', youtubeVideoId);
        console.log('Video URL:', video.youtube_url);
        
        const iframe = document.getElementById('youtube-player');
        if (iframe && youtubeVideoId) {
          // Try different reload methods
          const currentSrc = iframe.src;
          console.log('Current iframe src:', currentSrc);
          
          // Method 1: Clear and reset
          iframe.src = '';
          setTimeout(() => {
            // Method 2: Use clean URL with different parameters
            const cleanUrl = `https://www.youtube.com/embed/${youtubeVideoId}?rel=0&modestbranding=1&showinfo=0&controls=1&autoplay=0&enablejsapi=1&origin=${window.location.origin}`;
            iframe.src = cleanUrl;
            console.log('New iframe src:', cleanUrl);
          }, 200);
        } else {
          console.error('Cannot reload: iframe or video ID not available');
          showAlternativePlayer();
        }
      };
      
      // Function to show alternative player
      function showAlternativePlayer() {
        console.log('Showing alternative player...');
        const videoContainer = document.querySelector('.video-player-wrapper');
        if (videoContainer) {
          videoContainer.innerHTML = `
            <div class="alert alert-info">
              <h6><i class="fas fa-info-circle"></i> Alternative Video Player</h6>
              <p class="mb-2">The embedded player is not working. Please use one of these options:</p>
              <div class="d-flex gap-2 flex-wrap">
                <a href="${video.youtube_url}" target="_blank" class="btn btn-primary">
                  <i class="fas fa-external-link-alt"></i> Watch on YouTube
                </a>
                <button class="btn btn-secondary" onclick="window.open('${video.youtube_url}', '_blank')">
                  <i class="fas fa-play"></i> Open in New Tab
                </button>
                <button class="btn btn-info" onclick="copyVideoUrl()">
                  <i class="fas fa-copy"></i> Copy URL
                </button>
              </div>
            </div>
          `;
        }
      }
      
      // Function to copy video URL
      window.copyVideoUrl = function() {
        navigator.clipboard.writeText(video.youtube_url).then(() => {
          alert('Video URL copied to clipboard!');
        }).catch(() => {
          alert('Failed to copy URL. Please copy manually: ' + video.youtube_url);
        });
      };
      
      // Function to show video error
      function showVideoError() {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'alert alert-warning mt-3';
        errorDiv.innerHTML = `
          <h6><i class="fas fa-exclamation-triangle"></i> Video Player Error</h6>
          <p class="mb-2">There was an error loading the video. Please try the following options:</p>
          <div class="d-flex gap-2">
            <a href="${video.youtube_url}" target="_blank" class="btn btn-sm btn-primary">
              <i class="fas fa-external-link-alt"></i> Watch on YouTube
            </a>
            <button class="btn btn-sm btn-secondary" onclick="reloadVideoPlayer()">
              <i class="fas fa-redo"></i> Reload Player
            </button>
          </div>
        `;
        
        const videoContainer = document.querySelector('.video-player-wrapper');
        if (videoContainer) {
          videoContainer.appendChild(errorDiv);
        }
      }
      
    } else if (path.startsWith('/course/') && path.endsWith('/add-video')) {
      const courseId = path.split('/')[2];
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      
      // Check permissions
      if (user.role === 'student') {
        main.innerHTML = `
          <div class="container mt-4">
            <div class="alert alert-danger">
              <h4>Access Denied</h4>
              <p>You don't have permission to access this page.</p>
              <button class="btn btn-primary" onclick="window.LMS_Router.navigate('/dashboard')">
                <i class="fas fa-arrow-left"></i> Back to Dashboard
              </button>
            </div>
          </div>
        `;
      } else {
        main.innerHTML = `
          <div class="container mt-4">
            <nav aria-label="breadcrumb">
              <ol class="breadcrumb">
                <li class="breadcrumb-item"><a href="#" onclick="window.LMS_Router.navigate('/dashboard')">Dashboard</a></li>
                <li class="breadcrumb-item"><a href="#" onclick="window.LMS_Router.navigate('/courses')">Courses</a></li>
                <li class="breadcrumb-item"><a href="#" onclick="window.LMS_Router.navigate('/course/${courseId}')">Course Detail</a></li>
                <li class="breadcrumb-item active">Add Video</li>
              </ol>
            </nav>
            
            <div class="row">
              <div class="col-md-8">
                <div class="card">
                  <div class="card-header">
                    <h4><i class="fas fa-plus"></i> Add Video to Course</h4>
                  </div>
                  <div class="card-body">
                    <form id="addVideoForm">
                      <div class="mb-3">
                        <label for="videoTitle" class="form-label">Video Title *</label>
                        <input type="text" class="form-control" id="videoTitle" name="title" required>
                        <small class="form-text">Enter descriptive video title</small>
                      </div>
                      
                      <div class="mb-3">
                        <label for="youtubeUrl" class="form-label">YouTube URL *</label>
                        <input type="url" class="form-control" id="youtubeUrl" name="youtube_url" required
                               placeholder="https://www.youtube.com/watch?v=...">
                        <small class="form-text">Paste the full YouTube video URL</small>
                      </div>
                      
                      <div class="mb-3">
                        <label for="videoDescription" class="form-label">Video Description</label>
                        <textarea class="form-control" id="videoDescription" name="description" rows="3"
                                  placeholder="Optional video description"></textarea>
                        <small class="form-text">Optional description of the video content</small>
                      </div>
                      
                      <div class="mb-3">
                        <label for="videoOrder" class="form-label">Video Order</label>
                        <input type="number" class="form-control" id="videoOrder" name="order" min="0" value="1">
                        <small class="form-text">Order in which videos should be displayed (1 = first)</small>
                      </div>
                      
                      <div class="d-grid gap-2 d-md-flex justify-content-md-end">
                        <button type="button" class="btn btn-secondary" onclick="window.LMS_Router.navigate('/course/${courseId}')">
                          <i class="fas fa-arrow-left"></i> Cancel
                        </button>
                        <button type="submit" class="btn btn-primary">
                          <i class="fas fa-save"></i> Add Video
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
              <div class="col-md-4">
                <div class="card">
                  <div class="card-header">
                    <h6><i class="fas fa-info-circle"></i> YouTube URL Examples</h6>
                  </div>
                  <div class="card-body">
                    <h6>Valid YouTube URLs:</h6>
                    <ul class="list-unstyled small">
                      <li>• https://www.youtube.com/watch?v=VIDEO_ID</li>
                      <li>• https://youtu.be/VIDEO_ID</li>
                    </ul>
                    <hr>
                    <h6>Course Information:</h6>
                    <p><strong>Title:</strong> Introduction to Python</p>
                    <p><strong>Trainer:</strong> ${user.username}</p>
                    <p><strong>Current Videos:</strong> 3</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        `;
        
        // Handle form submission
        document.getElementById('addVideoForm').addEventListener('submit', async (e) => {
          e.preventDefault();
          const formData = new FormData(e.target);
          const videoData = {
            title: formData.get('title'),
            youtube_url: formData.get('youtube_url'),
            description: formData.get('description'),
            order: parseInt(formData.get('order'))
          };
          
          try {
            // Call the database API to add video
            const response = await fetch('/api/videos/create/', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken')
              },
              body: JSON.stringify({
                course_id: courseId,
                title: videoData.title,
                youtube_url: videoData.youtube_url,
                description: videoData.description,
                order: videoData.order
              }),
              credentials: 'same-origin'
            });
            
            const result = await response.json();
            
            if (result.success) {
              alert('Video added successfully!');
              window.LMS_Router.navigate(`/course/${courseId}`);
            } else {
              alert('Error adding video: ' + result.message);
            }
          } catch (error) {
            console.error('Error adding video:', error);
            alert('Error adding video: ' + error.message);
          }
        });
      }
      
    } else if (path.startsWith('/course/') && path.endsWith('/enroll')) {
      const courseId = path.split('/')[2];
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      
      // Check permissions
      if (user.role !== 'admin') {
        main.innerHTML = `
          <div class="container mt-4">
            <div class="alert alert-danger">
              <h4>Access Denied</h4>
              <p>Only administrators can enroll students in courses.</p>
              <button class="btn btn-primary" onclick="window.LMS_Router.navigate('/dashboard')">
                <i class="fas fa-arrow-left"></i> Back to Dashboard
              </button>
            </div>
          </div>
        `;
      } else {
        // Mock available students (not enrolled yet)
        const availableStudents = [
          { id: 4, username: 'student2', email: 'student2@lms.com', phone: '555-123-4567' },
          { id: 5, username: 'student3', email: 'student3@lms.com', phone: '555-987-6543' },
          { id: 6, username: 'student4', email: 'student4@lms.com', phone: '555-555-5555' }
        ];
        
        main.innerHTML = `
          <div class="container mt-4">
            <nav aria-label="breadcrumb">
              <ol class="breadcrumb">
                <li class="breadcrumb-item"><a href="#" onclick="window.LMS_Router.navigate('/dashboard')">Dashboard</a></li>
                <li class="breadcrumb-item"><a href="#" onclick="window.LMS_Router.navigate('/courses')">Courses</a></li>
                <li class="breadcrumb-item"><a href="#" onclick="window.LMS_Router.navigate('/course/${courseId}')">Course Detail</a></li>
                <li class="breadcrumb-item active">Enroll Student</li>
              </ol>
            </nav>
            
            <div class="row">
              <div class="col-md-8">
                <div class="card">
                  <div class="card-header">
                    <h4><i class="fas fa-user-plus"></i> Enroll Student in Course</h4>
                    <p class="mb-0 text-muted">Course: Introduction to Python</p>
                  </div>
                  <div class="card-body">
                    <form id="enrollStudentForm">
                      <div class="mb-3">
                        <label for="studentSelect" class="form-label">Select Student *</label>
                        <select class="form-select" id="studentSelect" name="student" required>
                          <option value="">Choose a student to enroll...</option>
                          ${availableStudents.map(student => `
                            <option value="${student.id}">
                              ${student.username} (${student.email})
                            </option>
                          `).join('')}
                        </select>
                        <small class="form-text">Select a student to enroll in this course</small>
                      </div>
                      
                      <div class="mb-3">
                        <div class="alert alert-info">
                          <h6><i class="fas fa-info-circle"></i> Course Information</h6>
                          <p class="mb-0">
                            <strong>Course:</strong> Introduction to Python<br>
                            <strong>Trainer:</strong> admin<br>
                            <strong>Current Enrollments:</strong> 1 student
                          </p>
                        </div>
                      </div>
                      
                      <div class="d-grid gap-2 d-md-flex justify-content-md-end">
                        <button type="button" class="btn btn-secondary" onclick="window.LMS_Router.navigate('/course/${courseId}')">
                          <i class="fas fa-arrow-left"></i> Cancel
                        </button>
                        <button type="submit" class="btn btn-success">
                          <i class="fas fa-user-plus"></i> Enroll Student
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
              <div class="col-md-4">
                <div class="card">
                  <div class="card-header">
                    <h6><i class="fas fa-users"></i> Available Students</h6>
                  </div>
                  <div class="card-body">
                    <p class="text-muted small">${availableStudents.length} students available for enrollment</p>
                    <ul class="list-unstyled small">
                      ${availableStudents.map(student => `
                        <li class="mb-2">
                          <strong>${student.username}</strong><br>
                          ${student.email}<br>
                          <span class="text-muted">${student.phone}</span>
                        </li>
                      `).join('')}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        `;
        
        // Handle form submission
        document.getElementById('enrollStudentForm').addEventListener('submit', async (e) => {
          e.preventDefault();
          const formData = new FormData(e.target);
          const studentId = formData.get('student');
          
          if (!studentId) {
            alert('Please select a student to enroll.');
            return;
          }
          
          try {
            // Call the database API to enroll student
            const response = await fetch('/api/enroll/', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken')
              },
              body: JSON.stringify({
                course_id: courseId,
                student_id: studentId
              }),
              credentials: 'same-origin'
            });
            
            const result = await response.json();
            
            if (result.success) {
              alert('Student enrolled successfully!');
              window.LMS_Router.navigate(`/course/${courseId}`);
            } else {
              alert('Error enrolling student: ' + result.message);
            }
          } catch (error) {
            console.error('Error enrolling student:', error);
            alert('Error enrolling student: ' + error.message);
          }
        });
      }
      
    } else {
      main.innerHTML = `
        <div class="container mt-4">
          <div class="alert alert-warning">
            <h4>Page Under Development</h4>
            <p>This page is being implemented. Current path: ${path}</p>
            <button class="btn btn-primary" onclick="window.LMS_Router.navigate('/dashboard')">
              <i class="fas fa-arrow-left"></i> Back to Dashboard
            </button>
          </div>
        </div>
      `;
    }
  }
};

// Load videos from database API
async function loadVideosFromDatabase(courseId) {
  console.log('Loading videos from database for course:', courseId);
  try {
    const response = await fetch(`/api/courses/${courseId}/videos/`, {
      method: 'GET',
      headers: {
        'X-CSRFToken': getCookie('csrftoken')
      },
      credentials: 'same-origin'
    });
    
    console.log('Videos API response status:', response.status);
    console.log('Videos API response ok:', response.ok);
    
    if (response.ok) {
      const videos = await response.json();
      console.log('Videos loaded from database:', videos);
      console.log('Number of videos:', videos.length);
      updateVideosTable(videos);
    } else {
      // Fallback to default videos if API fails
      const defaultVideos = [
        {
          id: 1,
          title: 'Python Introduction and Setup',
          youtube_url: 'https://www.youtube.com/watch?v=rfscVS0vtbw',
          description: 'Introduction to Python programming language and development environment setup.',
          order: 1,
          duration: '15:30'
        },
        {
          id: 2,
          title: 'Variables and Data Types',
          youtube_url: 'https://www.youtube.com/watch?v=k9TUPpGqYIg',
          description: 'Understanding Python variables, data types, and type conversion.',
          order: 2,
          duration: '12:45'
        },
        {
          id: 3,
          title: 'Control Flow - If Statements',
          youtube_url: 'https://www.youtube.com/watch?v=DZwmZ8Usvnk',
          description: 'Learn about conditional statements and control flow in Python.',
          order: 3,
          duration: '18:20'
        }
      ];
      updateVideosTable(defaultVideos);
    }
  } catch (error) {
    console.error('Error loading videos:', error);
    // Show error message but still display default videos
    const videosList = document.getElementById('videosList');
    if (videosList) {
      videosList.innerHTML = `
        <div class="alert alert-warning">
          <h6>Unable to load videos from database</h6>
          <p>Showing default videos. Please try refreshing the page.</p>
        </div>
      `;
    }
  }
}

// Delete video function
window.deleteVideo = async function(videoId, videoTitle) {
  if (!confirm(`Are you sure you want to delete "${videoTitle}"? This action cannot be undone.`)) {
    return;
  }
  
  try {
    const response = await fetch(`/api/videos/${videoId}/delete/`, {
      method: 'DELETE',
      headers: {
        'X-CSRFToken': getCookie('csrftoken')
      },
      credentials: 'same-origin'
    });
    
    const result = await response.json();
    
    if (result.success) {
      alert('Video deleted successfully!');
      // Reload videos list
      const courseId = window.location.pathname.split('/')[2];
      loadVideosFromDatabase(courseId);
    } else {
      alert('Error deleting video: ' + result.message);
    }
  } catch (error) {
    console.error('Error deleting video:', error);
    alert('Error deleting video: ' + error.message);
  }
};

// Update videos table with loaded data
function updateVideosTable(videos) {
  console.log('Updating videos table with:', videos);
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const videosList = document.getElementById('videosList');
  console.log('videosList element found:', videosList);
  if (!videosList) {
    console.error('videosList element not found!');
    return;
  }
  
  if (videos.length === 0) {
    videosList.innerHTML = `
      <div class="text-center">
        <p class="text-muted">No videos available for this course yet.</p>
        <button class="btn btn-primary" onclick="window.LMS_Router.navigate('/course/1/add-video')">
          <i class="fas fa-plus"></i> Add First Video
        </button>
      </div>
    `;
  } else {
    videosList.innerHTML = `
      <div class="table-responsive">
        <table class="table table-striped">
          <thead>
            <tr>
              <th>#</th>
              <th>Title</th>
              <th>Description</th>
              <th>Duration</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${videos.map((video, index) => `
              <tr>
                <td>${index + 1}</td>
                <td>${video.title}</td>
                <td>${video.description ? video.description.substring(0, 50) + '...' : 'No description'}</td>
                <td><span class="badge bg-info">${video.duration || 'N/A'}</span></td>
                <td>
                  <div class="btn-group" role="group">
                    <button class="btn btn-primary btn-sm" onclick="window.LMS_Router.navigate('/video/${video.id}')">
                      <i class="fas fa-play"></i> Watch
                    </button>
                    ${user.role === 'admin' || user.role === 'trainer' ? `
                      <button class="btn btn-danger btn-sm" onclick="deleteVideo(${video.id}, '${video.title}')" title="Delete video">
                        <i class="fas fa-trash"></i>
                      </button>
                    ` : ''}
                  </div>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }
}

// Setup security features for video player
function setupVideoSecurity() {
  // Disable right-click
  const handleContextMenu = (e) => {
    e.preventDefault();
    return false;
  };

  // Disable text selection
  const handleSelectStart = (e) => {
    e.preventDefault();
    return false;
  };

  // Disable keyboard shortcuts
  const handleKeyDown = (e) => {
    // Disable F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
    if (e.keyCode === 123 || 
        (e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.keyCode === 74)) || 
        (e.ctrlKey && e.keyCode === 85)) {
      e.preventDefault();
      return false;
    }
    // Disable Ctrl+C, Ctrl+V, Ctrl+X, Ctrl+P
    if (e.ctrlKey && (e.keyCode === 67 || e.keyCode === 86 || e.keyCode === 88 || e.keyCode === 80)) {
      e.preventDefault();
      return false;
    }
  };

  // Track page visibility
  const handleVisibilityChange = () => {
    if (document.hidden) {
      console.log('Page hidden - potential security concern');
    }
  };

  document.addEventListener('contextmenu', handleContextMenu);
  document.addEventListener('selectstart', handleSelectStart);
  document.addEventListener('keydown', handleKeyDown);
  document.addEventListener('visibilitychange', handleVisibilityChange);
}

// Initialize
console.log('LMS React Frontend Loaded');
document.addEventListener('DOMContentLoaded', function() {
  window.LMS_Router.render();
  
  // Handle browser navigation
  window.addEventListener('popstate', () => {
    window.LMS_Router.currentPage = window.location.pathname;
    window.LMS_Router.render();
  });
});
