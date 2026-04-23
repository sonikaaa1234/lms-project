import api from './authService';

export const courseService = {
  // Get all courses (filtered by user role)
  getAllCourses: async () => {
    const response = await api.get('/courses/');
    return response.data;
  },

  // Get course by ID
  getCourseById: async (id) => {
    const response = await api.get(`/courses/${id}/`);
    return response.data;
  },

  // Create new course
  createCourse: async (courseData) => {
    const response = await api.post('/courses/', courseData);
    return response.data;
  },

  // Update course
  updateCourse: async (id, courseData) => {
    const response = await api.put(`/courses/${id}/`, courseData);
    return response.data;
  },

  // Delete course
  deleteCourse: async (id) => {
    const response = await api.delete(`/courses/${id}/`);
    return response.data;
  },

  // Get videos for a course
  getCourseVideos: async (courseId) => {
    const response = await api.get(`/courses/${courseId}/videos/`);
    return response.data;
  },

  // Add video to course
  addVideo: async (courseId, videoData) => {
    const response = await api.post(`/courses/${courseId}/videos/`, videoData);
    return response.data;
  },

  // Get video by ID
  getVideoById: async (id) => {
    const response = await api.get(`/videos/${id}/`);
    return response.data;
  },

  // Enroll student in course
  enrollStudent: async (courseId, studentId) => {
    const response = await api.post(`/courses/${courseId}/enroll/`, { student_id: studentId });
    return response.data;
  },

  // Get enrolled students for a course
  getEnrolledStudents: async (courseId) => {
    const response = await api.get(`/courses/${courseId}/students/`);
    return response.data;
  }
};
