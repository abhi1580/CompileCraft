import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../redux/slices/authSlice";
import { toast } from "react-toastify";
import { FaLock, FaEnvelope, FaEye, FaEyeSlash } from "react-icons/fa";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading, error } = useSelector((state) => state.auth);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (user) {
      toast.success("Login successful!");
      if (user.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/user/dashboard");
      }
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
    <section
      className="public-section py-5"
      style={{
        background: "linear-gradient(120deg, #f8f9fb 60%, #e9ecef 100%)",
        minHeight: "100vh",
      }}
    >
      <div className="container">
        <div
          className="row justify-content-center align-items-center"
          style={{ minHeight: "80vh" }}
        >
          <div className="col-lg-8">
            <div className="row g-0 shadow-lg rounded-4 overflow-hidden bg-white">
              {/* Left: Branding & Welcome */}
              <div
                className="col-md-6 d-none d-md-flex flex-column justify-content-center align-items-center p-4"
                style={{
                  background: "linear-gradient(135deg, #f8f9fb 60%, #fff 100%)",
                }}
              >
                <img
                  src="/assets/images/logo.png"
                  alt="CompileCraft Logo"
                  style={{ maxWidth: 90, marginBottom: 24 }}
                />
                <h2
                  className="mb-3 text-center"
                  style={{
                    fontWeight: 800,
                    fontSize: "2rem",
                    color: "#38424D",
                  }}
                >
                  Welcome Back!
                </h2>
                <p
                  className="text-center mb-4"
                  style={{ color: "#747E88", fontSize: "1.1rem" }}
                >
                  Sign in to manage your projects, team, and revenue dashboard.
                  <br />
                  <span style={{ color: "#F94F4F", fontWeight: 700 }}>
                    CompileCraft
                  </span>{" "}
                  empowers you to build, launch, and scale with confidence.
                </p>
                <ul
                  className="list-unstyled text-muted small mt-3"
                  style={{ maxWidth: 260 }}
                >
                  <li className="mb-2">
                    <FaLock className="me-2 text-primary" /> Secure admin access
                  </li>
                  <li className="mb-2">
                    <FaEnvelope className="me-2 text-primary" /> Email-based
                    login
                  </li>
                  <li>
                    <span className="me-2 text-primary">🚀</span> Fast, modern
                    dashboard
                  </li>
                </ul>
              </div>
              {/* Right: Login Form */}
              <div className="col-md-6 bg-white p-4 p-md-5 d-flex flex-column justify-content-center">
                <h2 className="mb-3 text-center" style={{ fontWeight: 800 }}>
                  Login
                </h2>
                <form onSubmit={handleSubmit} autoComplete="on">
                  <div className="mb-3">
                    <label htmlFor="loginEmail" className="form-label">
                      Email address
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-light">
                        <FaEnvelope />
                      </span>
                      <input
                        type="email"
                        className="form-control"
                        id="loginEmail"
                        placeholder="Enter your email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        autoComplete="email"
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="loginPassword" className="form-label">
                      Password
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-light">
                        <FaLock />
                      </span>
                      <input
                        type={showPassword ? "text" : "password"}
                        className="form-control"
                        id="loginPassword"
                        placeholder="Enter your password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="current-password"
                      />
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        tabIndex={-1}
                        onClick={() => setShowPassword((s) => !s)}
                        style={{
                          borderTopLeftRadius: 0,
                          borderBottomLeftRadius: 0,
                        }}
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                  </div>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <a
                      href="#"
                      className="small text-primary"
                      style={{ textDecoration: "underline" }}
                    >
                      Forgot password?
                    </a>
                  </div>
                  <div className="d-grid mb-3">
                    <button
                      type="submit"
                      className="main-btn"
                      disabled={loading}
                    >
                      {loading ? "Logging in..." : "Login"}
                    </button>
                  </div>
                  {error && (
                    <div
                      className="alert alert-danger text-center py-2"
                      style={{ fontSize: "0.98rem" }}
                    >
                      {error}
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Login;
