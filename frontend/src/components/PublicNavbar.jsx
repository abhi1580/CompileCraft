import React from 'react';
import { NavLink } from 'react-router-dom';

function PublicNavbar({ user, onLogout, handleNavLinkClick }) {
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
              <li className="nav-item"><NavLink className={({ isActive }) => 'nav-link page-scroll' + (isActive ? ' active' : '')} to="/about" onClick={handleNavLinkClick}>About</NavLink></li>
              <li className="nav-item"><NavLink className={({ isActive }) => 'nav-link page-scroll' + (isActive ? ' active' : '')} to="/services" onClick={handleNavLinkClick}>Services</NavLink></li>
              <li className="nav-item"><NavLink className={({ isActive }) => 'nav-link page-scroll' + (isActive ? ' active' : '')} to="/contact" onClick={handleNavLinkClick}>Contact</NavLink></li>
              {!user && <li className="nav-item"><NavLink className={({ isActive }) => 'nav-link page-scroll' + (isActive ? ' active' : '')} to="/login" onClick={handleNavLinkClick}>Login</NavLink></li>}
              {user && <li className="nav-item"><button className="nav-link page-scroll btn btn-link" style={{padding:0, color:'#F94F4F'}} onClick={onLogout}>Logout</button></li>}
            </ul>
          </div>
        </nav>
      </div>
    </div>
  );
}

export default PublicNavbar; 