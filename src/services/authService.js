import api from './api';
export const loginUser = (p) => api.post('/users/login', p);
export const registerUser = (p) => api.post('/users/register', p);
export const getCurrentUser = (id) => api.get(`/users/${id}`);
