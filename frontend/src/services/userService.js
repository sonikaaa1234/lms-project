import api from './authService';

export const userService = {
  // Get all users
  getAllUsers: async () => {
    const response = await api.get('/users/');
    return response.data;
  },

  // Get user by ID
  getUserById: async (id) => {
    const response = await api.get(`/users/${id}/`);
    return response.data;
  },

  // Create new user
  createUser: async (userData) => {
    const response = await api.post('/users/', userData);
    return response.data;
  },

  // Update user
  updateUser: async (id, userData) => {
    const response = await api.put(`/users/${id}/`, userData);
    return response.data;
  },

  // Delete user
  deleteUser: async (id) => {
    const response = await api.delete(`/users/${id}/`);
    return response.data;
  },

  // Get user statistics
  getUserStats: async () => {
    const response = await api.get('/users/stats/');
    return response.data;
  },

  // Disable/Enable user
  toggleUserStatus: async (id, isActive) => {
    const response = await api.patch(`/users/${id}/`, { is_active: isActive });
    return response.data;
  }
};
