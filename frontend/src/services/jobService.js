import api from './api';

export const getJobs = async () => {
  const res = await api.get('/jobs');
  return res.data.jobs;
};

export const addJob = async (job) => {
  const res = await api.post('/jobs', job);
  return res.data.job;
};

export const deleteJob = async (id) => {
  const res = await api.delete(`/jobs/${id}`);
  return res.data;
};

export const applyForJob = async (jobId, application) => {
  let data = application;
  let config = {};
  if (!(application instanceof FormData)) {
    data = new FormData();
    Object.entries(application).forEach(([k, v]) => {
      if (v !== undefined && v !== null) data.append(k, v);
    });
  } else {
    config.headers = { 'Content-Type': 'multipart/form-data' };
  }
  const res = await api.post(`/jobs/${jobId}/apply`, data, config);
  return res.data;
};

export const getJobApplications = async () => {
  const res = await api.get('/job-applications');
  return res.data.applications;
}; 