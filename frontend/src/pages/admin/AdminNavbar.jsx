import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logoutThunk } from '../../redux/slices/authSlice';

function AdminNavbar({ user }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogout = () => {
    dispatch(logoutThunk()).then(() => {
      navigate('/login');
    });
  };
  const handleNavLinkClick = () => {
    const navbarCollapse = document.getElementById('navbarNav');
    if (navbarCollapse && navbarCollapse.classList.contains('show')) {
      try {
        if (window.bootstrap && window.bootstrap.Collapse) {
          const collapseInstance = window.bootstrap.Collapse.getOrCreateInstance(navbarCollapse);
          collapseInstance.hide();
        } else {
          navbarCollapse.classList.remove('show');
        }
      } catch (e) {
        navbarCollapse.classList.remove('show');
      }
    }
  };
  return (
    <div className="header_navbar">
      <div className="container">
        <nav className="navbar navbar-expand-lg">
          <NavLink className="navbar-brand" to="/" onClick={handleNavLinkClick}>
            <img src="/assets/images/logo.svg" alt="CompileCraft Logo" />
          </NavLink>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              <li className="nav-item"><NavLink className={({ isActive }) => 'nav-link page-scroll' + (isActive ? ' active' : '')} to="/" onClick={handleNavLinkClick}>Home</NavLink></li>
              <li className="nav-item"><NavLink className={({ isActive }) => 'nav-link page-scroll' + (isActive ? ' active' : '')} to="/admin/dashboard" onClick={handleNavLinkClick}>Dashboard</NavLink></li>
              <li className="nav-item"><NavLink className={({ isActive }) => 'nav-link page-scroll' + (isActive ? ' active' : '')} to="/admin/projects" onClick={handleNavLinkClick}>Projects</NavLink></li>
              <li className="nav-item"><NavLink className={({ isActive }) => 'nav-link page-scroll' + (isActive ? ' active' : '')} to="/admin/revenue" onClick={handleNavLinkClick}>Revenue</NavLink></li>
              {/* Admin-specific links */}
              <li className="nav-item"><NavLink className={({ isActive }) => 'nav-link page-scroll' + (isActive ? ' active' : '')} to="/admin/users" onClick={handleNavLinkClick}>Manage Users</NavLink></li>
              <li className="nav-item"><NavLink className={({ isActive }) => 'nav-link page-scroll' + (isActive ? ' active' : '')} to="/admin/settings" onClick={handleNavLinkClick}>Admin Settings</NavLink></li>
              <li className="nav-item"><button className="nav-link page-scroll btn btn-link" style={{padding:0, color:'#F94F4F'}} onClick={handleLogout}>Logout</button></li>
            </ul>
          </div>
        </nav>
      </div>
    </div>
  );
}

export default AdminNavbar; 