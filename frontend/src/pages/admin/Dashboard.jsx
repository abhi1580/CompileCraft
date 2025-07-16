import React, { useEffect, useState } from 'react';
import { FaProjectDiagram, FaMoneyBillWave, FaUsers, FaTasks, FaChartBar, FaCheckCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { getProjects } from '../../services/projectService';
import { getUsers } from '../../services/userService';
import { getJobApplications } from '../../services/jobService';
import { FaEnvelopeOpenText } from 'react-icons/fa';

function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [jobApplications, setJobApplications] = useState([]);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const [projectsData, usersData, jobAppsData] = await Promise.all([
          getProjects(),
          getUsers(),
          getJobApplications(),
        ]);
        setProjects(projectsData || []);
        setUsers(usersData || []);
        setJobApplications(jobAppsData || []);
      } catch (err) {
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Calculate open tasks
  const openTasks = projects.reduce((sum, proj) => {
    if (Array.isArray(proj.tasks)) {
      return sum + proj.tasks.filter(task => !task.completed).length;
    }
    return sum;
  }, 0);

  // Calculate total manpower (users with role 'user')
  const manpowerCount = users.filter(u => u.role === 'user').length;

  // Calculate free manpower (users with role 'user' not assigned to any project and not assigned any tasks)
  const userIdSet = new Set(users.filter(u => u.role === 'user').map(u => u._id?.toString?.() || u._id || u.email));
  const assignedToProject = new Set();
  const assignedToTask = new Set();
  projects.forEach(proj => {
    if (Array.isArray(proj.team)) {
      proj.team.forEach(member => {
        // member can be an object or id string
        if (typeof member === 'object' && member._id) {
          assignedToProject.add(member._id.toString());
        } else if (typeof member === 'string') {
          assignedToProject.add(member);
        }
      });
    }
    if (Array.isArray(proj.tasks)) {
      proj.tasks.forEach(task => {
        if (task.assignee) {
          if (typeof task.assignee === 'object' && task.assignee._id) {
            assignedToTask.add(task.assignee._id.toString());
          } else if (typeof task.assignee === 'string') {
            assignedToTask.add(task.assignee);
          }
        }
      });
    }
  });
  const freeManpowerCount = users.filter(u => u.role === 'user' && !assignedToProject.has(u._id?.toString?.() || u._id || u.email) && !assignedToTask.has(u._id?.toString?.() || u._id || u.email)).length;

  // Total Projects
  const totalProjects = projects.length;

  // Projects In Progress
  const projectsInProgress = projects.filter(p => p.status === 'In Progress').length;

  // Projects Completed
  const projectsCompleted = projects.filter(p => p.status === 'Completed').length;

  // Projects Due Soon (next 7 days)
  const now = new Date();
  const in7Days = new Date(now);
  in7Days.setDate(now.getDate() + 7);
  const projectsDueSoon = projects.filter(p => {
    if (!p.deadline) return false;
    const deadline = new Date(p.deadline);
    return deadline >= now && deadline <= in7Days;
  }).length;

  // Revenue (placeholder)
  const revenue = '--';

  return (
    <section className="dashboard_area py-5" style={{ background: '#f8f9fb', minHeight: '80vh' }}>
      <div className="container-fluid">
        <div className="mb-5 text-center">
          <h2 style={{ fontWeight: 800 }}>Welcome to CompileCraft Dashboard</h2>
          <p className="lead" style={{ color: '#747E88' }}>Manage your projects, revenue, and team in one place.</p>
        </div>
        {loading ? (
          <div className="text-center my-5">Loading...</div>
        ) : error ? (
          <div className="text-center text-danger my-5">{error}</div>
        ) : (
          <>
            {/* Quick Stats */}
            <div className="row g-4 mb-5 text-center">
              <div className="col-6 col-md-2">
                <div className="bg-white rounded-4 shadow-sm p-4">
                  <FaProjectDiagram size={32} color="#F94F4F" className="mb-2" />
                  <h4 className="fw-bold mb-0">{totalProjects}</h4>
                  <div className="text-muted">Total Projects</div>
                </div>
              </div>
              <div className="col-6 col-md-2">
                <div className="bg-white rounded-4 shadow-sm p-4">
                  <FaUsers size={32} color="#F94F4F" className="mb-2" />
                  <h4 className="fw-bold mb-0">{manpowerCount}</h4>
                  <div className="text-muted">Total Manpower</div>
                </div>
              </div>
              <div className="col-6 col-md-2">
                <div className="bg-white rounded-4 shadow-sm p-4">
                  <FaUsers size={32} color="#6c757d" className="mb-2" />
                  <h4 className="fw-bold mb-0">{freeManpowerCount}</h4>
                  <div className="text-muted">Free Manpower</div>
                </div>
              </div>
              <div className="col-6 col-md-2">
                <div className="bg-white rounded-4 shadow-sm p-4">
                  <FaTasks size={32} color="#F94F4F" className="mb-2" />
                  <h4 className="fw-bold mb-0">{projectsInProgress}</h4>
                  <div className="text-muted">Projects In Progress</div>
                </div>
              </div>
              <div className="col-6 col-md-2">
                <div className="bg-white rounded-4 shadow-sm p-4">
                  <FaCheckCircle size={32} color="#28a745" className="mb-2" />
                  <h4 className="fw-bold mb-0">{projectsCompleted}</h4>
                  <div className="text-muted">Projects Completed</div>
                </div>
              </div>
              <div className="col-6 col-md-2">
                <div className="bg-white rounded-4 shadow-sm p-4">
                  <FaChartBar size={32} color="#ffc107" className="mb-2" />
                  <h4 className="fw-bold mb-0">{projectsDueSoon}</h4>
                  <div className="text-muted">Projects Due Soon</div>
                </div>
              </div>
              <div className="col-6 col-md-2">
                <div className="bg-white rounded-4 shadow-sm p-4">
                  <FaMoneyBillWave size={32} color="#F94F4F" className="mb-2" />
                  <h4 className="fw-bold mb-0">{revenue}</h4>
                  <div className="text-muted">Revenue</div>
                </div>
              </div>
            </div>
          </>
        )}
        {/* Navigation Cards */}
        <div className="row g-4 justify-content-center">
          <div className="col-6 col-md-2">
            <Link to="/admin/projects" className="text-decoration-none">
              <div className="bg-white rounded-4 shadow-sm p-4 text-center h-100 dashboard-nav-card">
                <FaProjectDiagram size={28} color="#38424D" className="mb-2" />
                <div className="fw-bold">Projects</div>
              </div>
            </Link>
          </div>
          <div className="col-6 col-md-2">
            <Link to="/admin/revenue" className="text-decoration-none">
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
          <div className="col-6 col-md-2">
            <Link to="/admin/job-applications" className="text-decoration-none">
              <div className="bg-white rounded-4 shadow-sm p-4 text-center h-100 dashboard-nav-card">
                <FaEnvelopeOpenText size={28} color="#38424D" className="mb-2" />
                <div className="fw-bold">Job Applications</div>
                <div className="text-muted">{jobApplications.length}</div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Dashboard; 