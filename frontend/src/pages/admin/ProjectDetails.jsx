import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as projectService from '../../services/projectService';
import { FaUserTie, FaUserAlt } from 'react-icons/fa';
import ProgressBar from './ProgressBar';

export default function ProjectDetails() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    projectService.getProjects()
      .then(projects => {
        const proj = projects.find(p => p._id === id);
        setProject(proj);
      })
      .catch(err => setError('Failed to fetch project'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="container py-5">Loading...</div>;
  if (error || !project) return <div className="container py-5"><h2>Project not found</h2></div>;

  return (
    <section className="projects_area py-5" style={{ background: '#f8f9fb', minHeight: '80vh' }}>
      <div className="container-fluid">
        <button className="btn btn-link mb-3" onClick={() => navigate('/admin/projects')}>&larr; Back to Projects</button>
        <div className="card shadow-sm rounded-4 p-4 mb-4 bg-white">
          <h2 className="fw-bold mb-2">{project.name}</h2>
          <div className="mb-3">
            <span className={`badge me-2 ${project.status === 'Completed' ? 'bg-success' : project.status === 'In Progress' ? 'bg-warning text-dark' : 'bg-secondary'}`}>{project.status}</span>
            <span className="badge bg-light text-dark me-2">Deadline: {project.deadline ? new Date(project.deadline).toLocaleDateString() : 'N/A'}</span>
            <span className="badge bg-light text-dark">Budget: {project.budget ? `₹${project.budget.toLocaleString()}` : 'N/A'}</span>
          </div>
          <p className="mb-2"><strong>Description:</strong> {project.description || <span className="text-muted">No description</span>}</p>
          <div className="mb-3">
            <strong>Progress:</strong> <span className="align-middle"><ProgressBar value={project.progress || 0} /></span>
          </div>
          <div className="row">
            <div className="col-md-6 mb-3">
              <h5 className="fw-bold">Team</h5>
              <ul className="list-unstyled mb-0">
                {project.team && project.team.length > 0 ? project.team.map((member, i) => (
                  <li key={i} className="d-flex align-items-center mb-1">
                    <span className="badge bg-secondary me-2">{member.role === 'admin' ? 'Admin' : 'Member'}</span>
                    <span>{member.email}</span>
                  </li>
                )) : <li className="text-muted">No team members assigned.</li>}
              </ul>
            </div>
            <div className="col-md-6 mb-3">
              <h5 className="fw-bold">Tasks</h5>
              {project.tasks && project.tasks.length > 0 ? (
                <ul className="list-unstyled mb-0">
                  {project.tasks.map((task, tIdx) => {
                    const assignee = project.team && project.team.find(u => u._id === task.assignee);
                    return (
                      <li key={tIdx} className="d-flex align-items-center mb-1">
                        <span style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>{task.title}</span>
                        <span className="ms-2 text-muted" style={{ fontSize: '0.95em' }}>
                          {assignee ? `(${assignee.email})` : '(Unassigned)'}
                        </span>
                        <span className={`badge ms-2 ${task.priority === 'High' ? 'bg-danger' : task.priority === 'Medium' ? 'bg-warning text-dark' : 'bg-info text-dark'}`}>{task.priority}</span>
                        {task.completed && <span className="badge bg-success ms-2">Done</span>}
                      </li>
                    );
                  })}
                </ul>
              ) : <p className="text-muted">No tasks assigned.</p>}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 