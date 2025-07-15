import api from './api';

export const login = async (email, password) => {
  const res = await api.post('/login', { email, password });
  return res.data;
};

export const register = async (email, password) => {
  const res = await api.post('/register', { email, password });
  return res.data;
};

export const createAdmin = async (email, password) => {
  const res = await api.post('/create-admin', { email, password });
  return res.data;
};

export const getProtected = async () => {
  const res = await api.get('/protected');
  return res.data;
};

export const logout = async () => {
  const res = await api.post('/logout');
  return res.data;
}; 