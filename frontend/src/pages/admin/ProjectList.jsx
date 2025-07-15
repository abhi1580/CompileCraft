import React, { useEffect, useState } from 'react';
import { FaUserTie, FaUserAlt, FaTrash } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import * as projectService from '../../services/projectService';
import ProgressBar from './ProgressBar';
import { Spinner, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { FaEye, FaPencilAlt, FaTrash as FaTrashIcon } from 'react-icons/fa';
import { toast } from 'react-toastify';
import DeleteConfirmDialog from '../../components/admin/DeleteConfirmDialog';

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
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);

  // Remove priorityOrder and priority sort logic

  useEffect(() => {
    projectService.getProjects()
      .then(setProjects)
      .catch(err => setError(err.response?.data?.error || 'Failed to fetch projects'))
      .finally(() => setLoading(false));
  }, []);

  const handleDeleteClick = (id) => {
    setProjectToDelete(id);
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    if (!projectToDelete) return;
    try {
      await projectService.deleteProject(projectToDelete);
      setProjects(prev => prev.filter(p => p._id !== projectToDelete));
      toast.success('Project deleted successfully!');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to delete project');
    } finally {
      setShowDeleteDialog(false);
      setProjectToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteDialog(false);
    setProjectToDelete(null);
  };

  const filteredProjects = projects
    .filter(p => !filterStatus || p.status === filterStatus)
    .sort((a, b) => {
      let aVal = a[sortField], bVal = b[sortField];
      if (sortField === 'deadline') {
        aVal = new Date(aVal); bVal = new Date(bVal);
      }
      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

  // Pagination logic
  const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);
  const paginatedProjects = filteredProjects.slice((currentPage - 1) * projectsPerPage, currentPage * projectsPerPage);

  // Helper for initials
  function getInitials(nameOrEmail) {
    if (!nameOrEmail) return '';
    const parts = nameOrEmail.split('@')[0].split(/[. _-]/);
    return parts.length > 1 ? (parts[0][0] + parts[1][0]).toUpperCase() : nameOrEmail.slice(0, 2).toUpperCase();
  }

  return (
    <section className="projects_area py-5" style={{ background: '#f8f9fb', minHeight: '80vh' }}>
      <div className="container-fluid">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 style={{ fontWeight: 800 }}>Projects</h2>
          {user && user.role === 'admin' && (
            <button className="main-btn" onClick={() => navigate('/admin/projects/create')}>Add Project</button>
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
            <div className="alert alert-info d-flex flex-column align-items-center py-5">
              <span style={{ fontSize: 48, color: '#F94F4F' }}>📁</span>
              <div className="mt-3">No projects found. Start by adding a new project!</div>
            </div>
          ) : (
            <>
              <div className="row g-4">
                {paginatedProjects.map((proj) => {
                  const completedTasks = proj.tasks ? proj.tasks.filter(t => t.completed).length : 0;
                  const totalTasks = proj.tasks ? proj.tasks.length : 0;
                  return (
                    <div key={proj._id} className="col-12 col-md-6 col-lg-4 col-xl-3">
                      <div className="project-card shadow-sm rounded-4 p-4 h-100 d-flex flex-column position-relative bg-white">
                        {/* Status badge */}
                        <span className={`badge position-absolute top-0 end-0 m-3 ${proj.status === 'Completed' ? 'bg-success' : proj.status === 'In Progress' ? 'bg-warning text-dark' : 'bg-secondary'}`}>{proj.status}</span>
                        {/* Project name/desc */}
                        <h5 className="fw-bold mb-1" style={{ fontSize: '1.25rem' }}>{proj.name}</h5>
                        <div className="text-muted mb-2" style={{ minHeight: 32 }}>{proj.description}</div>
                        {/* Progress bar */}
                        <div className="mb-2">
                          <ProgressBar value={Number(proj.progress) || 0} />
                          <div className="text-end text-muted" style={{ fontSize: '0.95em' }}>{proj.progress || 0}%</div>
                        </div>
                        {/* Team avatars */}
                        <div className="mb-2 d-flex flex-wrap align-items-center gap-1">
                          {proj.team && proj.team.map((member) => (
                            <span key={member._id || member.email} className="d-inline-flex align-items-center justify-content-center rounded-circle bg-secondary text-white me-1" style={{ width: 32, height: 32, fontSize: 14, fontWeight: 700 }} title={member.email}>
                              {getInitials(member.email)}
                            </span>
                          ))}
                        </div>
                        {/* Task summary */}
                        <div className="mb-2">
                          {totalTasks > 0 ? (
                            <OverlayTrigger
                              placement="top"
                              overlay={<Tooltip id={`tasks-tooltip-${proj._id}`}>{completedTasks} of {totalTasks} tasks completed</Tooltip>}
                            >
                              <span className="badge bg-primary" style={{ cursor: 'pointer' }}>{completedTasks}/{totalTasks} tasks</span>
                            </OverlayTrigger>
                          ) : <span className="text-muted">No tasks</span>}
                        </div>
                        {/* Deadline, budget, and task priority summary */}
                        <div className="mb-3 d-flex flex-wrap gap-2">
                          <span className="badge bg-light text-dark border">Deadline: {proj.deadline ? new Date(proj.deadline).toLocaleDateString() : 'N/A'}</span>
                          <span className="badge bg-light text-dark border">Budget: {proj.budget ? `₹${proj.budget.toLocaleString()}` : 'N/A'}</span>
                          {/* Task priority summary */}
                          {proj.tasks && proj.tasks.length > 0 && (
                            <span className="badge bg-info text-dark border">
                              {`High: ${proj.tasks.filter(t => t.priority === 'High').length}, `}
                              {`Medium: ${proj.tasks.filter(t => t.priority === 'Medium').length}, `}
                              {`Low: ${proj.tasks.filter(t => t.priority === 'Low').length}`}
                            </span>
                          )}
                        </div>
                        {/* Actions */}
                        <div className="mt-auto d-flex gap-2 justify-content-end">
                          <OverlayTrigger placement="top" overlay={<Tooltip>Details</Tooltip>}>
                            <button className="btn btn-sm btn-outline-info" aria-label="View project details" onClick={() => navigate(`/admin/projects/${proj._id}`)}><FaEye /></button>
                          </OverlayTrigger>
                          {user && user.role === 'admin' && (
                            <>
                              <OverlayTrigger placement="top" overlay={<Tooltip>Edit</Tooltip>}>
                                <button className="btn btn-sm btn-outline-primary" aria-label="Edit project" onClick={() => navigate(`/admin/projects/${proj._id}/edit`)}><FaPencilAlt /></button>
                              </OverlayTrigger>
                              <OverlayTrigger placement="top" overlay={<Tooltip>Delete</Tooltip>}>
                                <button className="btn btn-sm btn-outline-danger" aria-label="Delete project" onClick={() => handleDeleteClick(proj._id)}><FaTrashIcon /></button>
                              </OverlayTrigger>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
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
      <DeleteConfirmDialog
        open={showDeleteDialog}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        message="Are you sure you want to delete this project?"
      />
      <style>{`
        .project-card {
          transition: box-shadow 0.2s, transform 0.2s;
        }
        .project-card:hover {
          box-shadow: 0 8px 32px rgba(56,66,77,0.10);
          transform: translateY(-2px) scale(1.02);
        }
      `}</style>
    </section>
  );
} 