import React, { useEffect, useState } from 'react';
import { FaUserTie, FaUserAlt, FaTrash } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import * as projectService from '../../services/projectService';
import ProgressBar from './ProgressBar';
import { Spinner } from 'react-bootstrap';

export default function ProjectList() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('');
  const [sortField, setSortField] = useState('deadline');
  const [sortOrder, setSortOrder] = useState('asc');
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 10;

  // Priority sort order
  const priorityOrder = { High: 3, Medium: 2, Low: 1 };

  useEffect(() => {
    projectService.getProjects()
      .then(setProjects)
      .catch(err => setError(err.response?.data?.error || 'Failed to fetch projects'))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    try {
      await projectService.deleteProject(id);
      setProjects(prev => prev.filter(p => p._id !== id));
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete project');
    }
  };

  const filteredProjects = projects
    .filter(p => !filterStatus || p.status === filterStatus)
    .sort((a, b) => {
      let aVal = a[sortField], bVal = b[sortField];
      if (sortField === 'deadline') {
        aVal = new Date(aVal); bVal = new Date(bVal);
      } else if (sortField === 'priority') {
        aVal = priorityOrder[aVal] || 0; bVal = priorityOrder[bVal] || 0;
      }
      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

  // Pagination logic
  const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);
  const paginatedProjects = filteredProjects.slice((currentPage - 1) * projectsPerPage, currentPage * projectsPerPage);

  return (
    <section className="projects_area py-5" style={{ background: '#f8f9fb', minHeight: '80vh' }}>
      <div className="container-fluid">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 style={{ fontWeight: 800 }}>Projects</h2>
          {user && user.role === 'admin' && (
            <button className="main-btn" onClick={() => navigate('/projects/create')}>Add Project</button>
          )}
        </div>
        <div className="row mb-3">
          <div className="col-md-3">
            <select className="form-select" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
              <option value="">All Statuses</option>
              <option value="Planning">Planning</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
          <div className="col-md-3">
            <select className="form-select" value={sortField} onChange={e => setSortField(e.target.value)}>
              <option value="deadline">Sort by Deadline</option>
              <option value="progress">Sort by Progress</option>
              <option value="priority">Sort by Priority</option>
            </select>
          </div>
          <div className="col-md-3">
            <select className="form-select" value={sortOrder} onChange={e => setSortOrder(e.target.value)}>
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>
        </div>
        {loading && <div className="d-flex align-items-center"><Spinner animation="border" size="sm" className="me-2" /> Loading projects...</div>}
        {error && <div className="alert alert-danger">{error}</div>}
        {!loading && !error && (
          filteredProjects.length === 0 ? (
            <div className="alert alert-info">No projects found.</div>
          ) : (
            <>
              <div className="table-responsive">
                <table className="table table-bordered bg-white rounded-4 shadow-sm">
                  <thead className="table-light">
                    <tr>
                      <th>Name</th>
                      <th>Status</th>
                      <th>Deadline</th>
                      <th>Priority</th>
                      <th>Budget</th>
                      <th>Progress</th>
                      <th>Team</th>
                      <th>Tasks</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedProjects.map((proj) => (
                      <tr key={proj._id}>
                        <td>{proj.name}<br /><small className="text-muted">{proj.description}</small></td>
                        <td>{proj.status}</td>
                        <td>{proj.deadline ? new Date(proj.deadline).toLocaleDateString() : ''}</td>
                        <td>{proj.priority}</td>
                        <td>{proj.budget ? `₹${proj.budget.toLocaleString()}` : '-'}</td>
                        <td style={{ minWidth: 120 }}><ProgressBar value={Number(proj.progress) || 0} /></td>
                        <td>
                          {proj.team && proj.team.map((member) => (
                            <span key={member._id || member.email} className="me-2">
                              {member.role === 'admin' && <FaUserTie title={member.email} />}
                              {member.role !== 'admin' && <FaUserAlt title={member.email} />}
                              <span className="ms-1">{member.email}</span>
                            </span>
                          ))}
                        </td>
                        <td>
                          {proj.tasks && proj.tasks.length > 0 ? (
                            <div style={{ maxHeight: 80, overflowY: 'auto' }}>
                              <ul className="mb-0 ps-3">
                                {proj.tasks.map((task) => (
                                  <li key={task._id || task.title} style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
                                    {task.title}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ) : <span className="text-muted">No tasks</span>}
                        </td>
                        <td>
                          <button className="btn btn-sm btn-outline-info me-1" aria-label="View project details" onClick={() => navigate(`/projects/${proj._id}`)}>Details</button>
                          {user && user.role === 'admin' && (
                            <>
                              <button className="btn btn-sm btn-outline-primary me-1" aria-label="Edit project" onClick={() => navigate(`/projects/${proj._id}/edit`)}>Edit</button>
                              <button className="btn btn-sm btn-outline-danger" aria-label="Delete project" onClick={() => handleDelete(proj._id)}><FaTrash /></button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="d-flex justify-content-center align-items-center mt-3 gap-2">
                  <button className="btn btn-outline-secondary btn-sm" disabled={currentPage === 1} onClick={() => setCurrentPage(p => Math.max(1, p - 1))}>Prev</button>
                  <span>Page {currentPage} of {totalPages}</span>
                  <button className="btn btn-outline-secondary btn-sm" disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}>Next</button>
                </div>
              )}
            </>
          )
        )}
      </div>
    </section>
  );
} 