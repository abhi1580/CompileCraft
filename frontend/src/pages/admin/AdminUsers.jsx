import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Modal, Button, Form, Spinner, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { FaUserAlt, FaEnvelope, FaPhone, FaUserTie, FaUserPlus, FaEdit, FaTrash, FaEye } from 'react-icons/fa';

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
    techStack: '',
  });
  const [addLoading, setAddLoading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState(null);
  const [editLoading, setEditLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewUser, setViewUser] = useState(null);

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
      const techStackArr = addForm.techStack
        ? addForm.techStack.split(',').map(t => t.trim()).filter(Boolean)
        : [];
      await api.post('/register', { ...addForm, techStack: techStackArr });
      toast.success('User added successfully!');
      setShowAddModal(false);
      setAddForm({ name: '', email: '', password: '', phone: '', designation: '', role: 'user', techStack: '' });
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to add user');
    } finally {
      setAddLoading(false);
    }
  };

  const handleEditClick = (user) => {
    setEditForm({ ...user, password: '', techStack: Array.isArray(user.techStack) ? user.techStack.join(', ') : (user.techStack || '') });
    setShowEditModal(true);
  };

  const handleEditChange = e => {
    const { name, value } = e.target;
    setEditForm(f => ({ ...f, [name]: value }));
  };

  const handleEditUser = async e => {
    e.preventDefault();
    setEditLoading(true);
    try {
      const techStackArr = editForm.techStack
        ? editForm.techStack.split(',').map(t => t.trim()).filter(Boolean)
        : [];
      await api.patch(`/users/${editForm._id}`, {
        name: editForm.name,
        email: editForm.email,
        phone: editForm.phone,
        designation: editForm.designation,
        techStack: techStackArr,
        // role: editForm.role, // keep as user
      });
      toast.success('User updated successfully!');
      setShowEditModal(false);
      setEditForm(null);
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update user');
    } finally {
      setEditLoading(false);
    }
  };

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    try {
      await api.delete(`/users/${userToDelete._id}`);
      toast.success('User deleted successfully!');
      setShowDeleteModal(false);
      setUserToDelete(null);
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to delete user');
    }
  };

  const handleViewClick = (user) => {
    setViewUser(user);
    setShowViewModal(true);
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
                      <th>Actions</th>
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
                        <td>
                          <Button variant="outline-info" size="sm" className="me-2" onClick={() => handleViewClick(user)}><FaEye /></Button>
                          <Button variant="outline-primary" size="sm" className="me-2" onClick={() => handleEditClick(user)}><FaEdit /></Button>
                          <Button variant="outline-danger" size="sm" onClick={() => handleDeleteClick(user)}><FaTrash /></Button>
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
                <Form.Select name="designation" value={addForm.designation} onChange={handleAddChange} required>
                  <option value="">Select Designation</option>
                  <option value="Developer">Developer</option>
                  <option value="Tester">Tester</option>
                  <option value="Designer">Designer</option>
                  <option value="Manager">Manager</option>
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Tech Stack</Form.Label>
                <Form.Control name="techStack" value={addForm.techStack} onChange={handleAddChange} placeholder="e.g. React, Node.js, Python" />
                <div className="form-text">Enter technologies separated by commas.</div>
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
        <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
          <Form onSubmit={handleEditUser}>
            <Modal.Header closeButton>
              <Modal.Title>Edit User</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {editForm && (
                <>
                  <Form.Group className="mb-3">
                    <Form.Label>Name *</Form.Label>
                    <Form.Control name="name" value={editForm.name} onChange={handleEditChange} required />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Email *</Form.Label>
                    <Form.Control type="email" name="email" value={editForm.email} onChange={handleEditChange} required />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Phone</Form.Label>
                    <Form.Control name="phone" value={editForm.phone} onChange={handleEditChange} />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Designation</Form.Label>
                    <Form.Select name="designation" value={editForm.designation} onChange={handleEditChange} required>
                      <option value="">Select Designation</option>
                      <option value="Developer">Developer</option>
                      <option value="Tester">Tester</option>
                      <option value="Designer">Designer</option>
                      <option value="Manager">Manager</option>
                    </Form.Select>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Tech Stack</Form.Label>
                    <Form.Control name="techStack" value={editForm.techStack} onChange={handleEditChange} placeholder="e.g. React, Node.js, Python" />
                    <div className="form-text">Enter technologies separated by commas.</div>
                  </Form.Group>
                </>
              )}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowEditModal(false)} disabled={editLoading}>Cancel</Button>
              <Button variant="primary" type="submit" disabled={editLoading}>{editLoading ? <Spinner size="sm" animation="border" /> : 'Save Changes'}</Button>
            </Modal.Footer>
          </Form>
        </Modal>
        <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Delete User</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {userToDelete && (
              <p>Are you sure you want to delete user <strong>{userToDelete.name || userToDelete.email}</strong>?</p>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
            <Button variant="danger" onClick={handleDeleteUser}>Delete</Button>
          </Modal.Footer>
        </Modal>
        <Modal show={showViewModal} onHide={() => setShowViewModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>User Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {viewUser && (
              <div>
                <p><strong>Name:</strong> {viewUser.name}</p>
                <p><strong>Email:</strong> {viewUser.email}</p>
                <p><strong>Phone:</strong> {viewUser.phone || '-'}</p>
                <p><strong>Designation:</strong> {viewUser.designation || '-'}</p>
                <p><strong>Tech Stack:</strong> {viewUser.techStack && viewUser.techStack.length > 0 ? viewUser.techStack.join(', ') : '-'}</p>
                <p><strong>Role:</strong> {viewUser.role}</p>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowViewModal(false)}>Close</Button>
          </Modal.Footer>
        </Modal>
      </div>
    </section>
  );
} 