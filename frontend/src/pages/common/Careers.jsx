import React from 'react';
import { FaBriefcase, FaMapMarkerAlt, FaClock } from 'react-icons/fa';

const jobs = [
  {
    title: 'Frontend Developer',
    location: 'Remote',
    type: 'Full Time',
    description: 'Work with React, modern UI/UX, and help build beautiful web apps.'
  },
  {
    title: 'Backend Developer',
    location: 'Bangalore, India',
    type: 'Full Time',
    description: 'Node.js, Express, MongoDB, REST APIs, and scalable backend systems.'
  },
  {
    title: 'UI/UX Designer',
    location: 'Remote',
    type: 'Contract',
    description: 'Design intuitive interfaces and collaborate with product teams.'
  }
];

export default function Careers() {
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
          {jobs.map((job, idx) => (
            <div className="col-md-6 col-lg-4 mb-4" key={idx}>
              <div className="bg-white rounded-4 shadow-sm p-4 h-100 d-flex flex-column">
                <h4 className="mb-2" style={{ fontWeight: 700 }}><FaBriefcase className="me-2 text-primary" />{job.title}</h4>
                <div className="mb-2 text-muted" style={{ fontSize: '0.98rem' }}>
                  <FaMapMarkerAlt className="me-1" /> {job.location} &nbsp;|&nbsp; <FaClock className="me-1" /> {job.type}
                </div>
                <p className="flex-grow-1 mb-3">{job.description}</p>
                <button className="btn btn-outline-primary w-100" disabled>Apply Now</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 