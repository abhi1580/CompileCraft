import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as projectService from '../../services/projectService';
import ProgressBar from './ProgressBar';
import { FaArrowLeft, FaEdit, FaUserAlt } from 'react-icons/fa';

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

  // Helper for team avatars
  function getInitials(nameOrEmail) {
    if (!nameOrEmail) return '';
    const parts = nameOrEmail.split('@')[0].split(/[. _-]/);
    return parts.length > 1 ? (parts[0][0] + parts[1][0]).toUpperCase() : nameOrEmail.slice(0, 2).toUpperCase();
  }

  return (
    <section className="projects_area py-5" style={{ background: '#f8f9fb', minHeight: '80vh' }}>
      <div className="container-fluid">
        <div className="d-flex align-items-center mb-4 gap-2">
          <button className="btn btn-outline-secondary" onClick={() => navigate('/admin/projects')}><FaArrowLeft className="me-1" /> Back</button>
          <h2 className="fw-bold mb-0 flex-grow-1" style={{ fontSize: '2rem' }}>{project.name}</h2>
          <span className={`badge fs-6 ${project.status === 'Completed' ? 'bg-success' : project.status === 'In Progress' ? 'bg-warning text-dark' : 'bg-secondary'}`}>{project.status}</span>
          <button className="btn btn-outline-primary ms-2" onClick={() => navigate(`/admin/projects/${project._id}/edit`)}><FaEdit className="me-1" /> Edit</button>
        </div>
        <div className="card shadow-sm rounded-4 p-4 mb-4 bg-white">
          {/* Meta info */}
          <div className="row mb-3 g-3 align-items-center">
            <div className="col-md-4 d-flex flex-column gap-2">
              <span className="badge bg-light text-dark border align-self-start">Deadline: {project.deadline ? new Date(project.deadline).toLocaleDateString() : 'N/A'}</span>
              <span className="badge bg-light text-dark border align-self-start">Budget: {project.budget ? `₹${project.budget.toLocaleString()}` : 'N/A'}</span>
            </div>
            <div className="col-md-4">
              <div className="mb-1 fw-bold">Progress</div>
              <ProgressBar value={project.progress || 0} />
              <div className="text-end text-muted" style={{ fontSize: '0.95em' }}>{project.progress || 0}%</div>
            </div>
            <div className="col-md-4">
              <div className="mb-1 fw-bold">Task Priority Summary</div>
              <span className="badge bg-info text-dark border me-1">High: {project.tasks.filter(t => t.priority === 'High').length}</span>
              <span className="badge bg-warning text-dark border me-1">Medium: {project.tasks.filter(t => t.priority === 'Medium').length}</span>
              <span className="badge bg-secondary text-light border">Low: {project.tasks.filter(t => t.priority === 'Low').length}</span>
            </div>
          </div>
          {/* Description */}
          <div className="mb-4 p-3 rounded-3" style={{ background: '#f4f6fa', border: '1px solid #e9ecef' }}>
            <div className="fw-bold mb-1">Description</div>
            <div>{project.description || <span className="text-muted">No description</span>}</div>
          </div>
          <div className="row g-4">
            {/* Team */}
            <div className="col-md-5">
              <div className="fw-bold mb-2">Team</div>
              {project.team && project.team.length > 0 ? (
                <div className="d-flex flex-wrap gap-2">
                  {project.team.map((member, i) => (
                    <span key={i} className="d-inline-flex align-items-center gap-2 px-3 py-2 rounded-pill bg-secondary text-white" title={member.email} style={{ fontWeight: 600, fontSize: 15 }}>
                      <FaUserAlt className="me-1" />{getInitials(member.email)}
                      <span className="ms-2" style={{ fontSize: 13, color: '#e0e0e0' }}>{member.role === 'admin' ? 'Admin' : 'Member'}</span>
                    </span>
                  ))}
                </div>
              ) : <div className="text-muted">No team members assigned.</div>}
            </div>
            {/* Tasks */}
            <div className="col-md-7">
              <div className="fw-bold mb-2">Tasks</div>
        {project.tasks && project.tasks.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-bordered align-middle mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>Task</th>
                        <th>Assignee</th>
                        <th>Priority</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {project.tasks.map((task, tIdx) => {
                        const assignee = project.team && project.team.find(u => u._id === task.assignee);
                        return (
                          <tr key={tIdx}>
                            <td style={{ textDecoration: task.completed ? 'line-through' : 'none', minWidth: 160 }}>{task.title}</td>
                            <td>{assignee ? (
                              <span className="d-inline-flex align-items-center gap-2 px-2 py-1 rounded-pill bg-light border" style={{ fontWeight: 600, fontSize: 14 }}>
                                <FaUserAlt className="me-1 text-secondary" />{getInitials(assignee.email)}
                                <span className="ms-1 text-muted" style={{ fontSize: 12 }}>{assignee.email}</span>
                              </span>
                            ) : <span className="text-muted">Unassigned</span>}</td>
                            <td><span className={`badge ${task.priority === 'High' ? 'bg-danger' : task.priority === 'Medium' ? 'bg-warning text-dark' : 'bg-info text-dark'}`}>{task.priority}</span></td>
                            <td>{task.completed ? <span className="badge bg-success">Done</span> : <span className="badge bg-secondary">Not Done</span>}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : <div className="text-muted">No tasks assigned.</div>}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 