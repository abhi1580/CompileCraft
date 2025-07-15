import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../redux/slices/authSlice';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading, error } = useSelector((state) => state.auth);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (user) {
      toast.success('Login successful!');
      navigate('/admin/dashboard');
    }
  }, [user, navigate]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login({ email, password }));
  };
  return (
    <section className="login_area d-flex align-items-center justify-content-center" style={{ minHeight: '80vh', background: '#f8f9fb' }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <div className="bg-white rounded-4 shadow-sm p-4 p-md-5">
              <h2 className="mb-3 text-center" style={{ fontWeight: 800 }}>Login</h2>
              <p className="text-center mb-4" style={{ color: '#747E88' }}>
                Sign in to manage your projects and revenue dashboard.
              </p>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="loginEmail" className="form-label">Email address</label>
                  <input type="email" className="form-control" id="loginEmail" placeholder="Enter your email" required value={email} onChange={e => setEmail(e.target.value)} />
                </div>
                <div className="mb-3">
                  <label htmlFor="loginPassword" className="form-label">Password</label>
                  <input type="password" className="form-control" id="loginPassword" placeholder="Enter your password" required value={password} onChange={e => setPassword(e.target.value)} />
                </div>
                <div className="d-grid mb-3">
                  <button type="submit" className="main-btn" disabled={loading}>{loading ? 'Logging in...' : 'Login'}</button>
                </div>
              </form>
              <div className="text-center mt-3" style={{ color: '#adb5bd', fontSize: '0.95rem' }}>
                <span>Demo only. Dashboard access coming soon.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Login; 