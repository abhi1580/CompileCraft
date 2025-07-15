import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Modal, Button, Form, Spinner, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { FaUserAlt, FaEnvelope, FaPhone, FaUserTie, FaUserPlus } from 'react-icons/fa';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    designation: '',
    role: 'user',
  });
  const [addLoading, setAddLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    setLoading(true);
    api.get('/users')
      .then(res => {
        setUsers(res.data.users || []);
        setLoading(false);
      })
      .catch(err => {
        setError(err.response?.data?.error || 'Failed to fetch users');
        setLoading(false);
      });
  };

  const handleAddChange = e => {
    const { name, value } = e.target;
    setAddForm(f => ({ ...f, [name]: value }));
  };

  const handleAddUser = async e => {
    e.preventDefault();
    setAddLoading(true);
    try {
      await api.post('/register', addForm);
      toast.success('User added successfully!');
      setShowAddModal(false);
      setAddForm({ name: '', email: '', password: '', phone: '', designation: '', role: 'user' });
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to add user');
    } finally {
      setAddLoading(false);
    }
  };

  // Helper for avatar initials
  function getInitials(nameOrEmail) {
    if (!nameOrEmail) return '';
    const parts = nameOrEmail.split('@')[0].split(/[. _-]/);
    return parts.length > 1 ? (parts[0][0] + parts[1][0]).toUpperCase() : nameOrEmail.slice(0, 2).toUpperCase();
  }

  return (
    <section className="projects_area py-5" style={{ background: '#f8f9fb', minHeight: '80vh' }}>
      <div className="container-fluid">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold mb-0" style={{ fontSize: '2rem' }}>
            <FaUserTie className="me-2 text-primary" /> Manage Users
          </h2>
          <Button variant="primary" className="d-flex align-items-center gap-2" onClick={() => setShowAddModal(true)}>
            <FaUserPlus /> Add User
          </Button>
        </div>
        <div className="card shadow-sm rounded-4 p-4 mb-4 bg-white">
          {loading && <div className="d-flex align-items-center"><Spinner animation="border" size="sm" className="me-2" /> Loading users...</div>}
          {error && <div className="alert alert-danger">{error}</div>}
          {!loading && !error && (
            users.filter(user => user.role !== 'admin').length === 0 ? (
              <div className="alert alert-info d-flex flex-column align-items-center py-5">
                <span style={{ fontSize: 48, color: '#F94F4F' }}>👤</span>
                <div className="mt-3">No users found. Start by adding a new user!</div>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-bordered align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>User</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Designation</th>
                      <th>Role</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.filter(user => user.role !== 'admin').map((user, idx) => (
                      <tr key={idx}>
                        <td>
                          <span className="d-inline-flex align-items-center gap-2 px-3 py-2 rounded-pill bg-secondary text-white" style={{ fontWeight: 600, fontSize: 15 }}>
                            <FaUserAlt className="me-1" />{getInitials(user.name || user.email)}
                          </span>
                          <span className="ms-2 fw-bold">{user.name || '-'}</span>
                        </td>
                        <td>
                          <OverlayTrigger placement="top" overlay={<Tooltip>Email: {user.email}</Tooltip>}>
                            <span className="d-inline-flex align-items-center gap-1">
                              <FaEnvelope className="me-1 text-primary" />{user.email}
                            </span>
                          </OverlayTrigger>
                        </td>
                        <td>
                          {user.phone ? (
                            <OverlayTrigger placement="top" overlay={<Tooltip>Phone: {user.phone}</Tooltip>}>
                              <span className="d-inline-flex align-items-center gap-1">
                                <FaPhone className="me-1 text-success" />{user.phone}
                              </span>
                            </OverlayTrigger>
                          ) : <span className="text-muted">-</span>}
                        </td>
                        <td>
                          {user.designation ? (
                            <OverlayTrigger placement="top" overlay={<Tooltip>Designation: {user.designation}</Tooltip>}>
                              <span className="d-inline-flex align-items-center gap-1">
                                <FaUserTie className="me-1 text-info" />{user.designation}
                              </span>
                            </OverlayTrigger>
                          ) : <span className="text-muted">-</span>}
                        </td>
                        <td>
                          <span className="badge bg-primary">User</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          )}
        </div>
        <Modal show={showAddModal} onHide={() => setShowAddModal(false)} centered>
          <Form onSubmit={handleAddUser}>
            <Modal.Header closeButton>
              <Modal.Title>Add User</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form.Group className="mb-3">
                <Form.Label>Name *</Form.Label>
                <Form.Control name="name" value={addForm.name} onChange={handleAddChange} required />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Email *</Form.Label>
                <Form.Control type="email" name="email" value={addForm.email} onChange={handleAddChange} required />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Password *</Form.Label>
                <Form.Control type="password" name="password" value={addForm.password} onChange={handleAddChange} required minLength={6} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Phone</Form.Label>
                <Form.Control name="phone" value={addForm.phone} onChange={handleAddChange} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Designation</Form.Label>
                <Form.Control name="designation" value={addForm.designation} onChange={handleAddChange} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Role</Form.Label>
                <Form.Select name="role" value={addForm.role} onChange={handleAddChange} disabled>
                  <option value="user">User</option>
                </Form.Select>
                <div className="form-text">Only users can be added here.</div>
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowAddModal(false)} disabled={addLoading}>Cancel</Button>
              <Button variant="primary" type="submit" disabled={addLoading}>{addLoading ? <Spinner size="sm" animation="border" /> : 'Add User'}</Button>
            </Modal.Footer>
          </Form>
        </Modal>
      </div>
    </section>
  );
} 