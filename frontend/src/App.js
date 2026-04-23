import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { PrivateRoute } from './components/PrivateRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CourseDetail from './pages/CourseDetail';
import VideoWatch from './pages/VideoWatch';
import UserManagement from './pages/UserManagement';
import CreateUser from './pages/CreateUser';
import CourseManagement from './pages/CourseManagement';
import CreateCourse from './pages/CreateCourse';
import AddVideo from './pages/AddVideo';
import EnrollStudent from './pages/EnrollStudent';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/dashboard" element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } />
            <Route path="/course/:id" element={
              <PrivateRoute>
                <CourseDetail />
              </PrivateRoute>
            } />
            <Route path="/video/:id" element={
              <PrivateRoute>
                <VideoWatch />
              </PrivateRoute>
            } />
            <Route path="/users" element={
              <PrivateRoute>
                <UserManagement />
              </PrivateRoute>
            } />
            <Route path="/users/create" element={
              <PrivateRoute>
                <CreateUser />
              </PrivateRoute>
            } />
            <Route path="/courses" element={
              <PrivateRoute>
                <CourseManagement />
              </PrivateRoute>
            } />
            <Route path="/courses/create" element={
              <PrivateRoute>
                <CreateCourse />
              </PrivateRoute>
            } />
            <Route path="/course/:id/add-video" element={
              <PrivateRoute>
                <AddVideo />
              </PrivateRoute>
            } />
            <Route path="/course/:id/enroll" element={
              <PrivateRoute>
                <EnrollStudent />
              </PrivateRoute>
            } />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
