import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getProjects } from '../../services/projectService';
import { FaProjectDiagram, FaTasks, FaCheckCircle, FaCalendarAlt, FaUserAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export default function UserDashboard() {
  const user = useSelector(state => state.auth.user);
  console.log('Current user:', user);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    let interval;
    function fetchData() {
      setLoading(true);
      getProjects()
        .then(data => {
          setProjects(data);
          console.log('Fetched projects:', data);
        })
        .catch((err) => {
          setError('Failed to load projects');
          console.error('Error fetching projects:', err);
        })
        .finally(() => setLoading(false));
    }
    fetchData();
    interval = setInterval(fetchData, 30000); // every 30 seconds
    return () => clearInterval(interval);
  }, []);

  if (!user) return <div className="container py-5"><h2>Please log in to view your dashboard.</h2></div>;

  // Find projects where user is in the team
  const userId = String(user._id);
  const assignedProjects = projects.filter(
    p => p.team && p.team.some(member => String(member._id || member) === userId)
  );

  // Find tasks assigned to user
  let assignedTasks = [];
  assignedProjects.forEach(p => {
    if (Array.isArray(p.tasks)) {
      assignedTasks = assignedTasks.concat(
        p.tasks.filter(t =>
          String(t.assignee) === userId || (t.assignee && String(t.assignee._id) === userId)
        ).map(t => ({ ...t, project: { _id: p._id, name: p.name } }))
      );
    }
  });

  // Stats
  const openTasks = assignedTasks.filter(t => !t.completed).length;
  const completedTasks = assignedTasks.filter(t => t.completed).length;
  const upcomingDeadlines = assignedProjects.filter(p => {
    if (!p.deadline) return false;
    const deadline = new Date(p.deadline);
    const now = new Date();
    const in7Days = new Date(now);
    in7Days.setDate(now.getDate() + 7);
    return deadline >= now && deadline <= in7Days;
  }).length;

  return (
    <section className="dashboard_area py-5" style={{ background: '#f8f9fb', minHeight: '80vh' }}>
      <div className="container-fluid">
        <div className="mb-5 text-center">
          <h2 style={{ fontWeight: 800 }}>Welcome, {user.name || user.email}!</h2>
          <p className="lead" style={{ color: '#747E88' }}>Here is your project and task overview.</p>
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
                <div className="bg-white rounded-4 shadow-sm p-4 dashboard-nav-card" style={{ cursor: 'pointer' }} onClick={() => navigate('/user/projects')}>
                  <FaProjectDiagram size={32} color="#F94F4F" className="mb-2" />
                  <h4 className="fw-bold mb-0">{assignedProjects.length}</h4>
                  <div className="text-muted">Your Projects</div>
                </div>
              </div>
              <div className="col-6 col-md-2">
                <div className="bg-white rounded-4 shadow-sm p-4 dashboard-nav-card" style={{ cursor: 'pointer' }} onClick={() => navigate('/user/tasks')}>
                  <FaTasks size={32} color="#F94F4F" className="mb-2" />
                  <h4 className="fw-bold mb-0">{openTasks}</h4>
                  <div className="text-muted">Open Tasks</div>
                </div>
              </div>
              <div className="col-6 col-md-2">
                <div className="bg-white rounded-4 shadow-sm p-4">
                  <FaCheckCircle size={32} color="#28a745" className="mb-2" />
                  <h4 className="fw-bold mb-0">{completedTasks}</h4>
                  <div className="text-muted">Completed Tasks</div>
                </div>
              </div>
              <div className="col-6 col-md-2">
                <div className="bg-white rounded-4 shadow-sm p-4">
                  <FaCalendarAlt size={32} color="#ffc107" className="mb-2" />
                  <h4 className="fw-bold mb-0">{upcomingDeadlines}</h4>
                  <div className="text-muted">Upcoming Deadlines</div>
                </div>
              </div>
              <div className="col-6 col-md-4">
                <div className="bg-white rounded-4 shadow-sm p-4">
                  <FaUserAlt size={32} color="#38424D" className="mb-2" />
                  <div className="fw-bold mb-1">Profile</div>
                  <div className="text-muted" style={{ fontSize: 15 }}>{user.designation || 'No designation'}</div>
                  <div className="text-muted" style={{ fontSize: 13 }}>{user.techStack && user.techStack.length > 0 ? (Array.isArray(user.techStack) ? user.techStack.join(', ') : user.techStack) : 'No tech stack'}</div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
} 