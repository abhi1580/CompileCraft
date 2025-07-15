import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getProjects } from '../../services/projectService';

export default function MyProjects() {
  const user = useSelector(state => state.auth.user);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getProjects()
      .then(data => setProjects(data))
      .catch(() => setError('Failed to load projects'))
      .finally(() => setLoading(false));
  }, []);

  if (!user) return <div className="container py-5"><h2>Please log in to view your projects.</h2></div>;

  const userId = String(user._id);
  const assignedProjects = projects.filter(
    p => p.team && p.team.some(member => String(member._id || member) === userId)
  );

  return (
    <section className="py-5" style={{ background: '#f8f9fb', minHeight: '80vh' }}>
      <div className="container-fluid">
        <h2 className="fw-bold mb-4">My Projects</h2>
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div className="text-danger">{error}</div>
        ) : assignedProjects.length === 0 ? (
          <div className="text-muted">You are not assigned to any projects.</div>
        ) : (
          <div className="row g-4">
            {assignedProjects.map((p) => (
              <div key={p._id} className="col-12 col-md-6 col-lg-4">
                <div className="bg-white rounded-4 shadow-sm p-4 h-100">
                  <div className="fw-bold mb-1">{p.name}</div>
                  <div className="text-muted mb-2">{p.description || 'No description'}</div>
                  <div className="mb-2">
                    <span className={`badge ${p.status === 'Completed' ? 'bg-success' : p.status === 'In Progress' ? 'bg-warning text-dark' : 'bg-secondary'}`}>{p.status}</span>
                  </div>
                  <div className="mb-2">
                    <span className="badge bg-light text-dark border me-2">Deadline: {p.deadline ? new Date(p.deadline).toLocaleDateString() : 'N/A'}</span>
                    <span className="badge bg-light text-dark border">Progress: {p.progress || 0}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
} 