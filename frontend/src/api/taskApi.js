import api from './axiosInstance';

export const taskApi = {
  getTasks:    (params) => api.get('/tasks', { params }),
  getAnalytics:()       => api.get('/tasks/analytics'),
  createTask:  (data)   => api.post('/tasks', data),
  updateTask:  (id, data) => api.put(`/tasks/${id}`, data),
  deleteTask:  (id)     => api.delete(`/tasks/${id}`),
  reorderTasks:(data)   => api.put('/tasks/reorder', data),
};
