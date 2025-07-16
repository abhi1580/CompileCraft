import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getJobs, applyForJob } from '../../services/jobService';
import { FaBriefcase, FaMapMarkerAlt, FaClock, FaArrowLeft } from 'react-icons/fa';
import { Modal, Button, Form, Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify';

export default function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showApply, setShowApply] = useState(false);
  const [appForm, setAppForm] = useState({ name: '', email: '', phone: '', coverLetter: '' });
  const [applying, setApplying] = useState(false);
  const [appSuccess, setAppSuccess] = useState(null);
  const [appError, setAppError] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);

  useEffect(() => {
    getJobs()
      .then(jobs => {
        const found = jobs.find(j => j._id === id);
        if (found) setJob(found);
        else setError('Job not found');
      })
      .catch(() => setError('Failed to load job details'))
      .finally(() => setLoading(false));
  }, [id]);

  // Add a useEffect to clear appSuccess/appError when modal is opened/closed
  useEffect(() => {
    if (!showApply) {
      setAppSuccess(null);
      setAppError(null);
    }
  }, [showApply]);

  const handleAppChange = e => {
    const { name, value } = e.target;
    setAppForm(f => ({ ...f, [name]: value }));
  };
  const handleResumeChange = e => {
    setResumeFile(e.target.files[0]);
  };
  const handleApply = async e => {
    e.preventDefault();
    setApplying(true);
    setAppSuccess(null);
    setAppError(null);
    try {
      const formData = new FormData();
      Object.entries(appForm).forEach(([k, v]) => formData.append(k, v));
      if (resumeFile) formData.append('resume', resumeFile);
      await applyForJob(id, formData);
      toast.success('Application submitted successfully!');
      setAppForm({ name: '', email: '', phone: '', coverLetter: '' });
      setResumeFile(null);
      setShowApply(false); // Close modal after success
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to submit application');
    } finally {
      setApplying(false);
    }
  };

  if (loading) return <div className="container py-5 text-center">Loading...</div>;
  if (error) return <div className="container py-5 text-center text-danger">{error}</div>;
  if (!job) return null;

  return (
    <section className="public-section py-5" style={{ background: '#f8f9fb', minHeight: '80vh' }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="bg-white rounded-4 shadow-sm p-4 p-md-5 mb-4">
              <button className="btn btn-outline-secondary mb-3" onClick={() => navigate(-1)}><FaArrowLeft className="me-2" />Back</button>
              <h2 className="mb-2" style={{ fontWeight: 800 }}><FaBriefcase className="me-2 text-primary" />{job.title}</h2>
              <div className="mb-2 text-muted" style={{ fontSize: '1.08rem' }}>
                <FaMapMarkerAlt className="me-1" /> {job.location} &nbsp;|&nbsp; <FaClock className="me-1" /> {job.type}
              </div>
              <p className="mb-3" style={{ fontSize: '1.1rem' }}>{job.description}</p>
              {Array.isArray(job.fields) && job.fields.length > 0 && (
                <div className="mb-3">
                  {job.fields.map((field, idx) => (
                    <div key={idx}>
                      <span style={{ fontWeight: 'bold' }}>{field.name}</span>: {field.value}
                    </div>
                  ))}
                </div>
              )}
              <button className="btn btn-primary w-100 mt-3" onClick={() => { setShowApply(true); setAppSuccess(null); setAppError(null); }}>Apply Now</button>
            </div>
          </div>
        </div>
      </div>
      <Modal show={showApply} onHide={() => setShowApply(false)} centered>
        <Form onSubmit={handleApply}>
          <Modal.Header closeButton><Modal.Title>Apply for {job.title}</Modal.Title></Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Name *</Form.Label>
              <Form.Control name="name" value={appForm.name} onChange={handleAppChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email *</Form.Label>
              <Form.Control type="email" name="email" value={appForm.email} onChange={handleAppChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Phone</Form.Label>
              <Form.Control name="phone" value={appForm.phone} onChange={handleAppChange} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Cover Letter</Form.Label>
              <Form.Control as="textarea" name="coverLetter" value={appForm.coverLetter} onChange={handleAppChange} rows={3} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Resume (PDF, DOC, DOCX)</Form.Label>
              <Form.Control type="file" name="resume" accept=".pdf,.doc,.docx" onChange={handleResumeChange} />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowApply(false)} disabled={applying}>Cancel</Button>
            <Button variant="primary" type="submit" disabled={applying}>{applying ? <Spinner size="sm" animation="border" /> : 'Submit Application'}</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </section>
  );
} 