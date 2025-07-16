import React, { useEffect, useState } from 'react';
import { getJobApplications } from '../../services/jobService';
import { useNavigate } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';
import { FaEnvelopeOpenText } from 'react-icons/fa';

export default function AdminJobApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getJobApplications()
      .then(setApplications)
      .catch(() => setError('Failed to load job applications'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="py-5" style={{ background: '#f8f9fb', minHeight: '80vh' }}>
      <div className="container-fluid">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold mb-0" style={{ fontSize: '2rem' }}>
            <FaEnvelopeOpenText className="me-2 text-primary" /> Job Applications
          </h2>
        </div>
        {loading ? (
          <div className="d-flex align-items-center"><Spinner animation="border" size="sm" className="me-2" /> Loading applications...</div>
        ) : error ? (
          <div className="alert alert-danger">{error}</div>
        ) : applications.length === 0 ? (
          <div className="alert alert-info py-5 text-center">No job applications found.</div>
        ) : (
          <div className="row g-4">
            {applications.map(app => (
              <div className="col-12 col-md-6 col-lg-4" key={app._id}>
                <div className="bg-white rounded-4 shadow-sm p-4 h-100 d-flex flex-column card-hover" style={{ cursor: 'pointer' }} onClick={() => navigate(`/admin/job-applications/${app._id}`)}>
                  <div className="mb-2 fw-bold" style={{ fontSize: '1.1rem' }}>{app.name}</div>
                  <div className="mb-2 text-muted">{app.job?.title || 'Unknown Job'}</div>
                  <div className="text-muted" style={{ fontSize: '0.95em' }}>{app.createdAt ? new Date(app.createdAt).toLocaleString() : ''}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <style>{`.card-hover:hover { box-shadow: 0 8px 32px rgba(56,66,77,0.10); transform: translateY(-2px) scale(1.02); }`}</style>
    </section>
  );
} 