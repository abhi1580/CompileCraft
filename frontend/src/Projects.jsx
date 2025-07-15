import React from 'react';
import { FaPlus, FaUserTie, FaUserAlt } from 'react-icons/fa';

const projects = [
  { name: 'Website Redesign', status: 'In Progress', deadline: '2024-07-15', team: ['Amit', 'Priya'] },
  { name: 'Mobile App', status: 'Completed', deadline: '2024-05-30', team: ['Rahul', 'Priya'] },
  { name: 'Cloud Migration', status: 'In Progress', deadline: '2024-08-01', team: ['Amit', 'Rahul'] },
  { name: 'E-commerce Platform', status: 'Planning', deadline: '2024-09-10', team: ['Priya'] },
];

function Projects() {
  return (
    <section className="projects_area py-5" style={{ background: '#f8f9fb', minHeight: '80vh' }}>
      <div className="container">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 style={{ fontWeight: 800 }}>Projects</h2>
          <button className="main-btn d-flex align-items-center" style={{ fontSize: '1rem' }}>
            <FaPlus className="me-2" /> Add Project
          </button>
        </div>
        <div className="table-responsive">
          <table className="table table-bordered bg-white rounded-4 shadow-sm">
            <thead className="table-light">
              <tr>
                <th>Name</th>
                <th>Status</th>
                <th>Deadline</th>
                <th>Team</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((proj, idx) => (
                <tr key={idx}>
                  <td>{proj.name}</td>
                  <td>{proj.status}</td>
                  <td>{proj.deadline}</td>
                  <td>
                    {proj.team.map((member, i) => (
                      <span key={i} className="me-2">
                        {member === 'Amit' && <FaUserTie title="Amit" />}
                        {member === 'Priya' && <FaUserAlt title="Priya" />}
                        {member === 'Rahul' && <FaUserAlt title="Rahul" />}
                        <span className="ms-1">{member}</span>
                      </span>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

export default Projects; 