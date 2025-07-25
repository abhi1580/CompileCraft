import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, useNavigate, useLocation } from 'react-router-dom';
import Home from './pages/common/Home';
import About from './pages/common/About';
import Services from './pages/common/Services';
import Contact from './pages/common/Contact';
import Login from './pages/common/Login';
import Dashboard from './pages/admin/Dashboard';
import UserDashboard from './pages/user/Dashboard';
import MyProjects from './pages/user/MyProjects';
import MyTasks from './pages/user/MyTasks';
import Revenue from './pages/admin/Revenue';
import { useDispatch, useSelector } from 'react-redux';
import { logoutThunk } from './redux/slices/authSlice';
import { useEffect } from 'react';
import { setUser } from './redux/slices/authSlice';
import api from './services/api';
import AdminNavbar from './pages/admin/AdminNavbar';
import AdminUsers from './pages/admin/AdminUsers';
import AdminSettings from './pages/admin/AdminSettings';
import ProjectList from './pages/admin/ProjectList';
import ProjectCreate from './pages/admin/ProjectCreate';
import ProjectEdit from './pages/admin/ProjectEdit';
import ProjectDetails from './pages/admin/ProjectDetails';
import PublicNavbar from './components/PublicNavbar';
import AdminLayout from './components/admin/AdminLayout';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Careers from './pages/common/Careers';
import UserLayout from './components/user/UserLayout';
import AdminJobs from './pages/admin/AdminJobs';
import JobDetails from './pages/common/JobDetails';
import AdminJobApplications from './pages/admin/AdminJobApplications';
import AdminJobApplicationDetails from './pages/admin/AdminJobApplicationDetails';

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
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const handleLogout = () => {
    dispatch(logoutThunk()).then(() => {
      navigate('/login');
    });
  };

  useEffect(() => {
    api.get('/protected')
      .then(res => {
        if (res.data && res.data.user) {
          dispatch(setUser(res.data.user));
        }
      })
      .catch(() => {
        // Not logged in or token invalid
      });
  }, [dispatch]);

  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="app-flex-root">
      {/* Navbar (shared across all pages) */}
      <PublicNavbar user={user} onLogout={handleLogout} handleNavLinkClick={handleNavLinkClick} />
      {/* Page Content */}
      <div className="main-content-scroll" style={{ minHeight: 'calc(100vh - 140px)', overflowY: 'auto' }}>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/careers/:id" element={<JobDetails />} />
          <Route path="/user/dashboard" element={<UserLayout><UserDashboard /></UserLayout>} />
          <Route path="/user/projects" element={<UserLayout><MyProjects /></UserLayout>} />
          <Route path="/user/tasks" element={<UserLayout><MyTasks /></UserLayout>} />
          {/* Admin routes */}
          <Route path="/admin" element={<AdminLayout><Dashboard /></AdminLayout>} />
          <Route path="/admin/dashboard" element={<AdminLayout><Dashboard /></AdminLayout>} />
          <Route path="/admin/projects" element={<AdminLayout><ProjectList /></AdminLayout>} />
          <Route path="/admin/projects/create" element={<AdminLayout><ProjectCreate /></AdminLayout>} />
          <Route path="/admin/projects/:id/edit" element={<AdminLayout><ProjectEdit /></AdminLayout>} />
          <Route path="/admin/projects/:id" element={<AdminLayout><ProjectDetails /></AdminLayout>} />
          <Route path="/admin/revenue" element={<AdminLayout><Revenue /></AdminLayout>} />
          <Route path="/admin/jobs" element={<AdminLayout><AdminJobs /></AdminLayout>} />
          <Route path="/admin/users" element={<AdminLayout><AdminUsers /></AdminLayout>} />
          <Route path="/admin/settings" element={<AdminLayout><AdminSettings /></AdminLayout>} />
          <Route path="/admin/job-applications" element={<AdminLayout><AdminJobApplications /></AdminLayout>} />
          <Route path="/admin/job-applications/:id" element={<AdminLayout><AdminJobApplicationDetails /></AdminLayout>} />
        </Routes>
      </div>
      {/* Only show main footer on non-admin pages */}
      {!isAdminRoute && (
        <footer className="footer_area text-white">
          <div className="container text-center">
            <p className="mb-0">&copy; {new Date().getFullYear()} CompileCraft. All rights reserved.</p>
          </div>
        </footer>
      )}
      <ToastContainer />
    </div>
  );
}

export default App;
