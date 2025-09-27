import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Admin API calls
export const adminAPI = {
  signUp: (data) => api.post('/admin/signUp', data),
  signIn: (data) => api.post('/admin/signIn', data),
  createCourse: (data) => api.post('/admin/course', data),
  updateCourse: (data) => api.put('/admin/course', data),
  getCourses: () => api.get('/admin/courses/bulk'),
};

// User API calls
export const userAPI = {
  signUp: (data) => api.post('/user/signUp', data),
  signIn: (data) => api.post('/user/signIn', data),
  getPurchases: () => api.get('/user/purchases'),
};

// Course API calls
export const courseAPI = {
  purchaseCourse: (courseId) => api.post('/course/purchase', { courseId }),
  getCoursePreview: () => api.get('/course/preview'),
};

export default api;
