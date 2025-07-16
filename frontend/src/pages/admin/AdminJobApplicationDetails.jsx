import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getJobApplications } from '../../services/jobService';
import { Button, Spinner } from 'react-bootstrap';
import { FaArrowLeft, FaDownload } from 'react-icons/fa';

export default function AdminJobApplicationDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getJobApplications()
      .then(apps => {
        const found = apps.find(a => a._id === id);
        if (found) setApplication(found);
        else setError('Application not found');
      })
      .catch(() => setError('Failed to load application'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="container py-5 text-center"><Spinner animation="border" /></div>;
  if (error) return <div className="container py-5 text-center text-danger">{error}</div>;
  if (!application) return null;

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const apiOrigin = apiUrl.replace(/\/api$/, '');

  return (
    <section className="py-5" style={{ background: '#f8f9fb', minHeight: '80vh' }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="bg-white rounded-4 shadow-sm p-4 p-md-5 mb-4">
              <Button variant="outline-secondary" className="mb-3" onClick={() => navigate(-1)}><FaArrowLeft className="me-2" />Back</Button>
              <h2 className="mb-2 fw-bold">{application.name}</h2>
              <div className="mb-2 text-muted">Applied for: <b>{application.job?.title || 'Unknown Job'}</b></div>
              <div className="mb-2"><b>Email:</b> {application.email}</div>
              {application.phone && <div className="mb-2"><b>Phone:</b> {application.phone}</div>}
              <div className="mb-2"><b>Applied on:</b> {application.createdAt ? new Date(application.createdAt).toLocaleString() : ''}</div>
              {application.coverLetter && (
                <div className="mb-3">
                  <b>Cover Letter:</b>
                  <div className="border rounded-3 p-3 mt-2" style={{ background: '#f4f6fa' }}>{application.coverLetter}</div>
                </div>
              )}
              {application.resume && (
                <div className="mb-2">
                  <b>Resume:</b> <a href={`${apiOrigin}/${application.resume.replace(/^backend[\\/]/, '')}`} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-primary ms-2"><FaDownload className="me-1" />Download</a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 