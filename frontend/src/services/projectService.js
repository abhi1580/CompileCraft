import api from './api';

export const getProjects = async () => {
  const res = await api.get('/projects');
  return res.data.projects;
};

export const addProject = async (project) => {
  const res = await api.post('/projects', project);
  return res.data.project;
};

export const updateProject = async (id, project) => {
  const res = await api.patch(`/projects/${id}`, project);
  return res.data.project;
};

export const deleteProject = async (id) => {
  const res = await api.delete(`/projects/${id}`);
  return res.data;
}; 