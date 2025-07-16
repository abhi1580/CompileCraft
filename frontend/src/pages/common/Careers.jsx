import React, { useEffect, useState } from 'react';
import { FaBriefcase, FaMapMarkerAlt, FaClock } from 'react-icons/fa';
import { getJobs } from '../../services/jobService';
import { Link } from 'react-router-dom';

export default function Careers() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getJobs()
      .then(setJobs)
      .catch(() => setError('Failed to load job openings'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="public-section py-5" style={{ background: '#f8f9fb', minHeight: '80vh' }}>
      {/* Hero Section */}
      <div className="container mb-5">
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <div className="bg-white rounded-4 shadow-sm p-4 p-md-5 text-center mb-5">
              <h1 className="mb-3" style={{ fontWeight: 800, fontSize: '2.7rem' }}>Careers at CompileCraft</h1>
              <p className="lead mb-0" style={{ color: '#747E88', fontSize: '1.2rem' }}>
                Join our team of passionate technologists and help shape the future of software!
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="container">
        <div className="row justify-content-center">
          {loading ? (
            <div className="text-center">Loading job openings...</div>
          ) : error ? (
            <div className="text-danger text-center">{error}</div>
          ) : jobs.length === 0 ? (
            <div className="text-muted text-center">No job openings at the moment.</div>
          ) : (
            jobs.map((job, idx) => (
              <div className="col-md-6 col-lg-4 mb-4" key={job._id || idx}>
                <div className="bg-white rounded-4 shadow-sm p-4 h-100 d-flex flex-column" style={{ minHeight: 370, display: 'flex' }}>
                  <h4 className="mb-2" style={{ fontWeight: 700 }}><FaBriefcase className="me-2 text-primary" />{job.title}</h4>
                  <div className="mb-2 text-muted" style={{ fontSize: '0.98rem' }}>
                    <FaMapMarkerAlt className="me-1" /> {job.location} &nbsp;|&nbsp; <FaClock className="me-1" /> {job.type}
                  </div>
                  <p className="flex-grow-1 mb-3">{job.description}</p>
                  {Array.isArray(job.fields) && job.fields.length > 0 && (
                    <div className="mb-3">
                      {job.fields.map((field, fidx) => (
                        <div key={fidx}>
                          <span style={{ fontWeight: 'bold' }}>{field.name}</span>: {field.value}
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="mt-auto">
                    <Link to={`/careers/${job._id}`} className="btn btn-outline-primary w-100">View Details</Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
} 