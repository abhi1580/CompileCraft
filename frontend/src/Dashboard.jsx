import React from 'react';
import { FaProjectDiagram, FaMoneyBillWave, FaUsers, FaTasks, FaChartBar } from 'react-icons/fa';
import { Link } from 'react-router-dom';

function Dashboard() {
  return (
    <section className="dashboard_area py-5" style={{ background: '#f8f9fb', minHeight: '80vh' }}>
      <div className="container">
        <div className="mb-5 text-center">
          <h2 style={{ fontWeight: 800 }}>Welcome to CompileCraft Dashboard</h2>
          <p className="lead" style={{ color: '#747E88' }}>Manage your projects, revenue, and team in one place.</p>
        </div>
        {/* Quick Stats */}
        <div className="row g-4 mb-5 text-center">
          <div className="col-6 col-md-3">
            <div className="bg-white rounded-4 shadow-sm p-4">
              <FaProjectDiagram size={32} color="#F94F4F" className="mb-2" />
              <h4 className="fw-bold mb-0">5</h4>
              <div className="text-muted">Projects</div>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="bg-white rounded-4 shadow-sm p-4">
              <FaMoneyBillWave size={32} color="#F94F4F" className="mb-2" />
              <h4 className="fw-bold mb-0">₹2.5L</h4>
              <div className="text-muted">Revenue (This Month)</div>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="bg-white rounded-4 shadow-sm p-4">
              <FaTasks size={32} color="#F94F4F" className="mb-2" />
              <h4 className="fw-bold mb-0">12</h4>
              <div className="text-muted">Open Tasks</div>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="bg-white rounded-4 shadow-sm p-4">
              <FaUsers size={32} color="#F94F4F" className="mb-2" />
              <h4 className="fw-bold mb-0">8</h4>
              <div className="text-muted">Team Members</div>
            </div>
          </div>
        </div>
        {/* Navigation Cards */}
        <div className="row g-4 justify-content-center">
          <div className="col-6 col-md-2">
            <Link to="/projects" className="text-decoration-none">
              <div className="bg-white rounded-4 shadow-sm p-4 text-center h-100 dashboard-nav-card">
                <FaProjectDiagram size={28} color="#38424D" className="mb-2" />
                <div className="fw-bold">Projects</div>
              </div>
            </Link>
          </div>
          <div className="col-6 col-md-2">
            <Link to="/revenue" className="text-decoration-none">
              <div className="bg-white rounded-4 shadow-sm p-4 text-center h-100 dashboard-nav-card">
                <FaMoneyBillWave size={28} color="#38424D" className="mb-2" />
                <div className="fw-bold">Revenue</div>
              </div>
            </Link>
          </div>
          <div className="col-6 col-md-2">
            <a href="#" className="text-decoration-none">
              <div className="bg-white rounded-4 shadow-sm p-4 text-center h-100 dashboard-nav-card">
                <FaUsers size={28} color="#38424D" className="mb-2" />
                <div className="fw-bold">Clients</div>
              </div>
            </a>
          </div>
          <div className="col-6 col-md-2">
            <a href="#" className="text-decoration-none">
              <div className="bg-white rounded-4 shadow-sm p-4 text-center h-100 dashboard-nav-card">
                <FaTasks size={28} color="#38424D" className="mb-2" />
                <div className="fw-bold">Tasks</div>
              </div>
            </a>
          </div>
          <div className="col-6 col-md-2">
            <a href="#" className="text-decoration-none">
              <div className="bg-white rounded-4 shadow-sm p-4 text-center h-100 dashboard-nav-card">
                <FaChartBar size={28} color="#38424D" className="mb-2" />
                <div className="fw-bold">Reports</div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Dashboard; 