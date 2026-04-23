import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.PROD 
    ? (import.meta.env.VITE_API_URL || 'https://taskflow-smart-productivity-task-manager.onrender.com/api')
    : '/api',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('tm_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle 401 globally (token expired / invalid)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('tm_token');
      localStorage.removeItem('tm_user');
      window.location.href = '/auth';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
