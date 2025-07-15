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
      <div className="container">
        <button className="btn btn-link mb-3" onClick={() => navigate('/projects')}>&larr; Back to Projects</button>
        <h2 style={{ fontWeight: 800 }}>{project.name}</h2>
        <p><strong>Description:</strong> {project.description}</p>
        <p><strong>Status:</strong> {project.status}</p>
        <p><strong>Deadline:</strong> {project.deadline ? new Date(project.deadline).toLocaleDateString() : 'N/A'}</p>
        <p><strong>Priority:</strong> {project.priority}</p>
        <p><strong>Budget:</strong> {project.budget ? `₹${project.budget.toLocaleString()}` : 'N/A'}</p>
        <p><strong>Progress:</strong> <ProgressBar value={project.progress || 0} /></p>
        <h5>Team:</h5>
        <ul className="list-unstyled">
          {project.team && project.team.map((member, i) => (
            <li key={i} className="d-flex align-items-center mb-1">
              {member.role === 'admin' && <FaUserTie className="me-2" />}
              {member.role !== 'admin' && <FaUserAlt className="me-2" />}
              <span>{member.email}</span>
            </li>
          ))}
        </ul>
        <h5>Tasks:</h5>
        {project.tasks && project.tasks.length > 0 ? (
          <ul className="list-unstyled">
            {project.tasks.map((task, tIdx) => (
              <li key={tIdx} className="d-flex align-items-center mb-1">
                <span style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>{task.title}</span>
              </li>
            ))}
          </ul>
        ) : <p>No tasks assigned.</p>}
      </div>
    </section>
  );
} 