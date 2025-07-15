import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getProjects } from '../../services/projectService';

export default function MyTasks() {
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

  if (!user) return <div className="container py-5"><h2>Please log in to view your tasks.</h2></div>;

  const userId = String(user._id);
  let assignedTasks = [];
  projects.forEach(p => {
    if (Array.isArray(p.tasks)) {
      assignedTasks = assignedTasks.concat(
        p.tasks.filter(t =>
          String(t.assignee) === userId || (t.assignee && String(t.assignee._id) === userId)
        ).map(t => ({ ...t, project: { _id: p._id, name: p.name } }))
      );
    }
  });

  return (
    <section className="py-5" style={{ background: '#f8f9fb', minHeight: '80vh' }}>
      <div className="container-fluid">
        <h2 className="fw-bold mb-4">My Tasks</h2>
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div className="text-danger">{error}</div>
        ) : assignedTasks.length === 0 ? (
          <div className="text-muted">You have no assigned tasks.</div>
        ) : (
          <div className="table-responsive">
            <table className="table table-bordered align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>Task</th>
                  <th>Project</th>
                  <th>Priority</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {assignedTasks.map((t, idx) => (
                  <tr key={idx}>
                    <td style={{ textDecoration: t.completed ? 'line-through' : 'none' }}>{t.title}</td>
                    <td>{t.project ? t.project.name : '-'}</td>
                    <td><span className={`badge ${t.priority === 'High' ? 'bg-danger' : t.priority === 'Medium' ? 'bg-warning text-dark' : 'bg-info text-dark'}`}>{t.priority}</span></td>
                    <td>{t.completed ? <span className="badge bg-success">Done</span> : <span className="badge bg-secondary">Not Done</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
} 