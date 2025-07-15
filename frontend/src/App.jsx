import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import Home from './Home';
import About from './About';
import Services from './Services';
import Contact from './Contact';
import Login from './Login';
import Dashboard from './Dashboard';
import Projects from './Projects';
import Revenue from './Revenue';

function App() {
  // Collapse navbar on link click (for mobile)
  const handleNavLinkClick = () => {
    const navbarCollapse = document.getElementById('navbarNav');
    if (navbarCollapse && navbarCollapse.classList.contains('show')) {
      // Try Bootstrap 5 Collapse API
      try {
        if (window.bootstrap && window.bootstrap.Collapse) {
          const collapseInstance = window.bootstrap.Collapse.getOrCreateInstance(navbarCollapse);
          collapseInstance.hide();
        } else {
          // Fallback: manually remove 'show' class
          navbarCollapse.classList.remove('show');
        }
      } catch (e) {
        // Fallback: manually remove 'show' class
        navbarCollapse.classList.remove('show');
      }
    }
  };
  return (
    <Router>
      {/* Navbar (shared across all pages) */}
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
                <li className="nav-item"><NavLink className={({ isActive }) => 'nav-link page-scroll' + (isActive ? ' active' : '')} to="/login" onClick={handleNavLinkClick}>Login</NavLink></li>
              </ul>
            </div>
          </nav>
        </div>
      </div>
      {/* Page Content */}
      <div className="main-content-scroll" style={{ minHeight: 'calc(100vh - 140px)', overflowY: 'auto' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/revenue" element={<Revenue />} />
        </Routes>
      </div>
      {/* Footer (shared across all pages) */}
      <footer className="footer_area text-white">
        <div className="container text-center">
          <p className="mb-0">&copy; {new Date().getFullYear()} CompileCraft. All rights reserved.</p>
        </div>
      </footer>
    </Router>
  );
}

export default App;
