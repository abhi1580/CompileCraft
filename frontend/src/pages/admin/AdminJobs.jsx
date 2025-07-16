import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getJobs, addJob, deleteJob } from '../../services/jobService';
import { Button, Form, Spinner } from 'react-bootstrap';
import { FaTrash, FaPlus } from 'react-icons/fa';

export default function AdminJobs() {
  const user = useSelector(state => state.auth.user);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [addForm, setAddForm] = useState({ title: '', location: '', type: '', description: '', fields: [] });
  const [addLoading, setAddLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = () => {
    setLoading(true);
    getJobs()
      .then(setJobs)
      .catch(() => setError('Failed to load jobs'))
      .finally(() => setLoading(false));
  };

  const handleAddChange = e => {
    const { name, value } = e.target;
    setAddForm(f => ({ ...f, [name]: value }));
  };

  // Add handler for dynamic fields
  const handleFieldChange = (idx, key, value) => {
    setAddForm(f => ({
      ...f,
      fields: f.fields.map((field, i) => i === idx ? { ...field, [key]: value } : field)
    }));
  };
  const handleAddField = () => {
    setAddForm(f => ({ ...f, fields: [...(f.fields || []), { name: '', value: '' }] }));
  };
  const handleRemoveField = idx => {
    setAddForm(f => ({ ...f, fields: f.fields.filter((_, i) => i !== idx) }));
  };

  const handleAddJob = async e => {
    e.preventDefault();
    setAddLoading(true);
    try {
      await addJob(addForm);
      setAddForm({ title: '', location: '', type: '', description: '', fields: [] });
      setShowAdd(false);
      fetchJobs();
    } catch {
      alert('Failed to add job');
    } finally {
      setAddLoading(false);
    }
  };

  const handleDeleteJob = async id => {
    setDeleteLoading(id);
    try {
      await deleteJob(id);
      fetchJobs();
    } catch {
      alert('Failed to delete job');
    } finally {
      setDeleteLoading(null);
    }
  };

  if (!user || user.role !== 'admin') {
    return <div className="container py-5"><h2>Unauthorized</h2></div>;
  }

  return (
    <section className="py-5" style={{ background: '#f8f9fb', minHeight: '80vh' }}>
      <div className="container-fluid">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold mb-0">Manage Job Openings</h2>
          <Button variant="primary" onClick={() => setShowAdd(s => !s)}><FaPlus className="me-2" />Add Job</Button>
        </div>
        {showAdd && (
          <div className="card shadow-sm rounded-4 p-4 mb-4 bg-white">
            <Form onSubmit={handleAddJob}>
              <div className="row g-3">
                <div className="col-md-3">
                  <Form.Group>
                    <Form.Label>Title</Form.Label>
                    <Form.Control name="title" value={addForm.title} onChange={handleAddChange} required />
                  </Form.Group>
                </div>
                <div className="col-md-3">
                  <Form.Group>
                    <Form.Label>Location</Form.Label>
                    <Form.Control name="location" value={addForm.location} onChange={handleAddChange} required />
                  </Form.Group>
                </div>
                <div className="col-md-2">
                  <Form.Group>
                    <Form.Label>Type</Form.Label>
                    <Form.Select name="type" value={addForm.type} onChange={handleAddChange} required>
                      <option value="">Select</option>
                      <option value="Full Time">Full Time</option>
                      <option value="Part Time">Part Time</option>
                      <option value="Contract">Contract</option>
                      <option value="Internship">Internship</option>
                    </Form.Select>
                  </Form.Group>
                </div>
                <div className="col-md-4">
                  <Form.Group>
                    <Form.Label>Description</Form.Label>
                    <Form.Control name="description" value={addForm.description} onChange={handleAddChange} as="textarea" rows={1} required />
                  </Form.Group>
                </div>
              </div>
              {/* Dynamic Fields Section */}
              <div className="mt-3">
                <div className="d-flex align-items-center mb-2">
                  <span className="fw-bold me-2">Custom Fields</span>
                  <Button variant="outline-primary" size="sm" onClick={handleAddField} type="button"><FaPlus className="me-1" />Add Field</Button>
                </div>
                {addForm.fields && addForm.fields.length > 0 && addForm.fields.map((field, idx) => (
                  <div className="row g-2 mb-2 align-items-center" key={idx}>
                    <div className="col-md-4">
                      <Form.Control
                        placeholder="Field Name (e.g. Experience)"
                        value={field.name}
                        onChange={e => handleFieldChange(idx, 'name', e.target.value)}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <Form.Control
                        placeholder="Field Value (e.g. 2+ years, React, Full-time)"
                        value={field.value}
                        onChange={e => handleFieldChange(idx, 'value', e.target.value)}
                        required
                      />
                    </div>
                    <div className="col-md-2">
                      <Button variant="outline-danger" size="sm" onClick={() => handleRemoveField(idx)} type="button">Remove</Button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="d-flex justify-content-end mt-3">
                <Button variant="secondary" className="me-2" onClick={() => setShowAdd(false)} disabled={addLoading}>Cancel</Button>
                <Button variant="primary" type="submit" disabled={addLoading}>{addLoading ? <Spinner size="sm" animation="border" /> : 'Add Job'}</Button>
              </div>
            </Form>
          </div>
        )}
        <div className="card shadow-sm rounded-4 p-4 bg-white">
          {loading ? (
            <div>Loading...</div>
          ) : error ? (
            <div className="text-danger">{error}</div>
          ) : jobs.length === 0 ? (
            <div className="text-muted">No job openings.</div>
          ) : (
            <div className="table-responsive">
              <table className="table table-bordered align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Title</th>
                    <th>Location</th>
                    <th>Type</th>
                    <th>Description</th>
                    <th>Posted</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.map(job => (
                    <tr key={job._id}>
                      <td>{job.title}</td>
                      <td>{job.location}</td>
                      <td>{job.type}</td>
                      <td>{job.description}
                        {Array.isArray(job.fields) && job.fields.length > 0 && (
                          <div className="mt-2">
                            {job.fields.map((field, idx) => (
                              <div key={idx}>
                                <span style={{ fontWeight: 'bold' }}>{field.name}</span>: {field.value}
                              </div>
                            ))}
                          </div>
                        )}
                      </td>
                      <td>{job.createdAt ? new Date(job.createdAt).toLocaleDateString() : '-'}</td>
                      <td>
                        <Button variant="outline-danger" size="sm" onClick={() => handleDeleteJob(job._id)} disabled={deleteLoading === job._id}>
                          {deleteLoading === job._id ? <Spinner size="sm" animation="border" /> : <FaTrash />}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </section>
  );
} 