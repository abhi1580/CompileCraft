import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import * as projectService from '../../services/projectService';
import * as userService from '../../services/userService';
import { FaPlus, FaTrash, FaCheckCircle, FaRegCircle } from 'react-icons/fa';
import { Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify';

export default function ProjectCreate() {
  const [form, setForm] = useState({
    name: '',
    description: '',
    status: 'Planning',
    deadline: '',
    team: [],
    budget: '',
    tasks: [],
  });
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState(null);
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();

  useEffect(() => {
    setUsersLoading(true);
    userService.getUsers()
      .then(setUsers)
      .catch(err => setUsersError(err.response?.data?.error || 'Failed to fetch users'))
      .finally(() => setUsersLoading(false));
  }, []);

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
    setForm(f => ({ ...f, tasks: [...f.tasks, { title: '', completed: false, priority: 'Medium' }] }));
  };
  const handleRemoveTask = idx => {
    setForm(f => ({ ...f, tasks: f.tasks.filter((_, i) => i !== idx) }));
  };

  const handleAddProject = async e => {
    e.preventDefault();
    if (!form.name || !form.deadline) {
      toast.error('Name and deadline are required');
      return;
    }
    try {
      await projectService.addProject({
        name: form.name,
        description: form.description,
        status: form.status,
        deadline: form.deadline,
        team: form.team,
        budget: form.budget ? Number(form.budget) : undefined,
        tasks: form.tasks,
      });
      toast.success('Project added successfully!');
      setTimeout(() => navigate('/admin/projects'), 1000);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to add project');
    }
  };

  if (!user || user.role !== 'admin') {
    return <div className="container py-5"><h2>Unauthorized</h2></div>;
  }

  return (
    <section className="projects_area py-5" style={{ background: '#f8f9fb', minHeight: '80vh' }}>
      <div className="container-fluid">
        <h2 style={{ fontWeight: 800 }}>Add Project</h2>
        <form className="mb-4 p-4 bg-white rounded-4 shadow-sm" onSubmit={handleAddProject}>
          {/* Basic Info */}
          <h5 className="mb-3">Project Information</h5>
          <div className="row g-3 mb-2">
            <div className="col-md-4">
              <label className="form-label fw-bold">Project Name <span className="text-danger">*</span></label>
              <input type="text" className="form-control" name="name" placeholder="e.g. Website Redesign" value={form.name} onChange={handleInputChange} required />
            </div>
            <div className="col-md-4">
              <label className="form-label fw-bold">Description</label>
              <textarea className="form-control" name="description" placeholder="Describe the project..." value={form.description} onChange={handleInputChange} rows={2} />
            </div>
            <div className="col-md-2">
              <label className="form-label fw-bold">Status</label>
              <select className="form-select" name="status" value={form.status} onChange={handleInputChange}>
                <option value="Planning">Planning</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
            <div className="col-md-2">
              <label className="form-label fw-bold">Deadline <span className="text-danger">*</span></label>
              <input type="date" className="form-control" name="deadline" value={form.deadline} onChange={handleInputChange} required />
            </div>
          </div>
          {/* Budget (removed Priority) */}
          <div className="row g-3 mb-2">
            <div className="col-md-3">
              <label className="form-label fw-bold">Budget</label>
              <div className="input-group">
                <span className="input-group-text">₹</span>
                <input type="number" className="form-control" name="budget" placeholder="(optional)" value={form.budget} onChange={handleInputChange} min={0} />
              </div>
              <div className="form-text">Enter the budget in INR</div>
            </div>
            {/* Team Selection */}
            <div className="col-md-6">
              <label className="form-label fw-bold">Team Members</label>
              {usersLoading ? (
                <div className="d-flex align-items-center"><Spinner size="sm" animation="border" className="me-2" /> Loading users...</div>
              ) : usersError ? (
                <div className="text-danger">{usersError}</div>
              ) : (
                <select className="form-select" name="team" multiple value={form.team} onChange={handleInputChange}>
                  {users.filter(u => u.role !== 'admin').map(u => (
                    <option key={u._id} value={u._id}>{u.email} ({u.role})</option>
                  ))}
                </select>
              )}
              <div className="form-text">Hold Ctrl (Windows) or Cmd (Mac) to select multiple team members.</div>
              {/* Show selected team as chips */}
              <div className="mt-2">
                {form.team.length > 0 && users.filter(u => form.team.includes(u._id)).map(u => (
                  <span key={u._id} className="badge bg-secondary me-2 mb-1">{u.email}</span>
                ))}
              </div>
            </div>
          </div>
          {/* Tasks Section */}
          <div className="row mb-2 mt-4">
            <div className="col-12 d-flex align-items-center justify-content-between">
              <h5 className="mb-0">Tasks</h5>
              <button type="button" className="btn btn-outline-secondary" onClick={handleAddTask}>
                <FaPlus className="me-2" /> Add Task
              </button>
            </div>
          </div>
          {form.tasks.length > 0 && (
            <div className="row g-2 mb-2 align-items-center">
              <div className="col-12">
                <div className="table-responsive">
                  <table className="table table-bordered mb-0 align-middle">
                    <thead className="table-light">
                      <tr>
                        <th>Task</th>
                        <th>Assignee</th>
                        <th>Priority</th>
                        <th>Completed</th>
                        <th>Remove</th>
                      </tr>
                    </thead>
                    <tbody>
                      {form.tasks.map((task, idx) => (
                        <tr key={idx}>
                          <td style={{ minWidth: 180 }}>
                            <input type="text" className="form-control" value={task.title} onChange={e => handleTaskChange(idx, 'title', e.target.value)} required placeholder="Task title" />
                          </td>
                          <td style={{ minWidth: 160 }}>
                            <select className="form-select" value={task.assignee || ''} onChange={e => handleTaskChange(idx, 'assignee', e.target.value)}>
                              <option value="">Unassigned</option>
                              {users.filter(u => form.team.includes(u._id)).map(u => (
                                <option key={u._id} value={u._id}>{u.email}</option>
                              ))}
                            </select>
                          </td>
                          <td style={{ minWidth: 120 }}>
                            <select className="form-select" value={task.priority || 'Medium'} onChange={e => handleTaskChange(idx, 'priority', e.target.value)}>
                              <option value="Low">Low</option>
                              <option value="Medium">Medium</option>
                              <option value="High">High</option>
                            </select>
                          </td>
                          <td className="text-center">
                            <button type="button" className="btn btn-link p-0" onClick={() => handleTaskChange(idx, 'completed', !task.completed)} title={task.completed ? 'Mark incomplete' : 'Mark complete'}>
                              {task.completed ? <FaCheckCircle color="green" /> : <FaRegCircle color="#aaa" />}
                            </button>
                          </td>
                          <td className="text-center">
                            <button type="button" className="btn btn-link text-danger p-0" onClick={() => handleRemoveTask(idx)} title="Remove task"><FaTrash /></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
          {/* Error/Success */}
          {/* Actions */}
          <div className="d-flex justify-content-end gap-2 mt-4">
            <button type="button" className="btn btn-outline-secondary" onClick={() => navigate('/admin/projects')}>Cancel</button>
            <button type="submit" className="main-btn">Add Project</button>
          </div>
        </form>
      </div>
    </section>
  );
} 