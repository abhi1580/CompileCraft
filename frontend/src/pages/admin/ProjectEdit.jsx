import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import * as projectService from '../../services/projectService';
import * as userService from '../../services/userService';
import { FaPlus, FaTrash, FaCheckCircle, FaRegCircle } from 'react-icons/fa';

export default function ProjectEdit() {
  const { id } = useParams();
  const [form, setForm] = useState(null);
  const [formError, setFormError] = useState(null);
  const [formSuccess, setFormSuccess] = useState(null);
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState(null);
  const [loading, setLoading] = useState(true);
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    Promise.all([
      projectService.getProjects(),
      userService.getUsers()
    ]).then(([projects, users]) => {
      const project = projects.find(p => p._id === id);
      if (project) {
        setForm({
          ...project,
          team: project.team.map(u => u._id),
          tasks: project.tasks.map(t => ({ ...t })),
        });
      }
      setUsers(users);
    }).catch(err => {
      setFormError('Failed to load project or users');
    }).finally(() => setLoading(false));
  }, [id]);

  const handleInputChange = e => {
    const { name, value, type, selectedOptions } = e.target;
    if (name === 'team') {
      const selected = Array.from(selectedOptions).map(opt => opt.value);
      setForm(f => ({ ...f, team: selected }));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  };

  // Task management
  const handleTaskChange = (idx, field, value) => {
    setForm(f => ({
      ...f,
      tasks: f.tasks.map((t, i) => i === idx ? { ...t, [field]: value } : t)
    }));
  };
  const handleAddTask = () => {
    setForm(f => ({ ...f, tasks: [...f.tasks, { title: '', completed: false }] }));
  };
  const handleRemoveTask = idx => {
    setForm(f => ({ ...f, tasks: f.tasks.filter((_, i) => i !== idx) }));
  };

  const handleEditProject = async e => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);
    try {
      await projectService.updateProject(id, form);
      setFormSuccess('Project updated successfully!');
      setTimeout(() => navigate('/projects'), 1000);
    } catch (err) {
      setFormError(err.response?.data?.error || 'Failed to update project');
    }
  };

  if (!user || user.role !== 'admin') {
    return <div className="container py-5"><h2>Unauthorized</h2></div>;
  }
  if (loading || !form) {
    return <div className="container py-5">Loading...</div>;
  }

  return (
    <section className="projects_area py-5" style={{ background: '#f8f9fb', minHeight: '80vh' }}>
      <div className="container">
        <h2 style={{ fontWeight: 800 }}>Edit Project</h2>
        <form className="mb-4 p-4 bg-white rounded-4 shadow-sm" onSubmit={handleEditProject}>
          <div className="row g-3 mb-2">
            <div className="col-md-4">
              <input type="text" className="form-control" name="name" placeholder="Project Name" value={form.name} onChange={handleInputChange} required />
            </div>
            <div className="col-md-4">
              <input type="text" className="form-control" name="description" placeholder="Description" value={form.description} onChange={handleInputChange} />
            </div>
            <div className="col-md-2">
              <select className="form-select" name="status" value={form.status} onChange={handleInputChange}>
                <option value="Planning">Planning</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
            <div className="col-md-2">
              <input type="date" className="form-control" name="deadline" value={form.deadline} onChange={handleInputChange} required />
            </div>
          </div>
          <div className="row g-3 mb-2">
            <div className="col-md-3">
              <select className="form-select" name="priority" value={form.priority} onChange={handleInputChange}>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
            <div className="col-md-3">
              <input type="number" className="form-control" name="budget" placeholder="Budget (optional)" value={form.budget} onChange={handleInputChange} min={0} />
            </div>
            <div className="col-md-3">
              {usersLoading ? (
                <div>Loading users...</div>
              ) : usersError ? (
                <div className="text-danger">{usersError}</div>
              ) : (
                <select className="form-select" name="team" multiple value={form.team} onChange={handleInputChange}>
                  {users.filter(u => u.role !== 'admin').map(u => (
                    <option key={u._id} value={u._id}>{u.email} ({u.role})</option>
                  ))}
                </select>
              )}
            </div>
            <div className="col-md-3">
              <button type="button" className="btn btn-outline-secondary w-100" onClick={handleAddTask}>
                <FaPlus className="me-2" /> Add Task
              </button>
            </div>
          </div>
          {form.tasks.length > 0 && (
            <div className="row g-2 mb-2 align-items-center">
              <div className="col-12">
                <div className="table-responsive">
                  <table className="table table-bordered mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>Task</th>
                        <th>Completed</th>
                        <th>Remove</th>
                      </tr>
                    </thead>
                    <tbody>
                      {form.tasks.map((task, idx) => (
                        <tr key={idx}>
                          <td>
                            <input type="text" className="form-control" value={task.title} onChange={e => handleTaskChange(idx, 'title', e.target.value)} required />
                          </td>
                          <td className="text-center">
                            <button type="button" className="btn btn-link p-0" onClick={() => handleTaskChange(idx, 'completed', !task.completed)}>
                              {task.completed ? <FaCheckCircle color="green" /> : <FaRegCircle color="#aaa" />}
                            </button>
                          </td>
                          <td className="text-center">
                            <button type="button" className="btn btn-link text-danger p-0" onClick={() => handleRemoveTask(idx)}><FaTrash /></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
          {formError && <div className="alert alert-danger mt-3 mb-0 py-2">{formError}</div>}
          {formSuccess && <div className="alert alert-success mt-3 mb-0 py-2">{formSuccess}</div>}
          <div className="text-end mt-3">
            <button type="submit" className="main-btn">Save Changes</button>
          </div>
        </form>
      </div>
    </section>
  );
} 