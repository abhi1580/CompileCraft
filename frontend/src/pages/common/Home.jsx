import React from 'react';
import { FaCrown, FaUserTie, FaUserSecret, FaRocket, FaShieldAlt, FaHandshake, FaSearch, FaPencilAlt, FaCode, FaThumbsUp, FaLightbulb, FaUsers, FaChartLine } from 'react-icons/fa';

function Home() {
  return (
    <section className="public-section py-5" style={{ background: '#f8f9fb', minHeight: '80vh' }}>
      <div className="container">
        <div className="row justify-content-center mb-5">
          <div className="col-lg-10">
            <div className="bg-white rounded-4 shadow-sm p-4 p-md-5 text-center mb-5">
              <h1 className="hero_title mb-3" style={{ fontWeight: 800, fontSize: '2.7rem' }}>
                Build, Launch, and Scale with <span style={{ color: '#F94F4F' }}>CompileCraft</span>
              </h1>
              <p className="lead mb-4" style={{ fontSize: '1.2rem' }}>
                We help startups and businesses turn ideas into reality with custom software, cloud, and digital solutions.
              </p>
              <a href="/contact" className="main-btn">Start Your Project</a>
            </div>
          </div>
        </div>
        <div className="row justify-content-center mb-5">
          <div className="col-lg-10">
            <div className="bg-white rounded-4 shadow-sm p-4 p-md-5 text-center mb-5">
              <h2 className="main_title mb-4" style={{ fontWeight: 800 }}>Our Key Advantages</h2>
              <div className="row g-4 text-center">
                <div className="col-md-4">
                  <div className="single_services p-4 h-100">
                    <div className="services_icon mb-3"><FaCrown size={36} color="#F94F4F" /></div>
                    <h5 className="fw-bold">Expert Team</h5>
                    <p>Seasoned engineers, designers, and strategists dedicated to your success.</p>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="single_services p-4 h-100">
                    <div className="services_icon mb-3"><FaRocket size={36} color="#F94F4F" /></div>
                    <h5 className="fw-bold">Agile & Fast</h5>
                    <p>Rapid prototyping and delivery using agile methods and best practices.</p>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="single_services p-4 h-100">
                    <div className="services_icon mb-3"><FaShieldAlt size={36} color="#F94F4F" /></div>
                    <h5 className="fw-bold">Secure by Design</h5>
                    <p>Security and privacy are built into every project from day one.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row justify-content-center mb-5">
          <div className="col-lg-10">
            <div className="bg-white rounded-4 shadow-sm p-4 p-md-5 text-center mb-5">
              <h2 className="main_title mb-4" style={{ fontWeight: 800 }}>Our Approach</h2>
              <div className="row g-4 text-center">
                <div className="col-md-4">
                  <div className="single_services p-4 h-100">
                    <div className="services_icon mb-3"><FaLightbulb size={32} color="#38424D" /></div>
                    <h6 className="fw-bold">Innovate</h6>
                    <p>We brainstorm and validate ideas to ensure your product stands out.</p>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="single_services p-4 h-100">
                    <div className="services_icon mb-3"><FaUsers size={32} color="#38424D" /></div>
                    <h6 className="fw-bold">Collaborate</h6>
                    <p>We work closely with you, keeping you in the loop at every step.</p>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="single_services p-4 h-100">
                    <div className="services_icon mb-3"><FaChartLine size={32} color="#38424D" /></div>
                    <h6 className="fw-bold">Grow</h6>
                    <p>We help you scale, optimize, and achieve long-term business growth.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row justify-content-center mb-5">
          <div className="col-lg-10">
            <div className="bg-white rounded-4 shadow-sm p-4 p-md-5 text-center mb-5">
              <h2 className="main_title mb-4" style={{ fontWeight: 800 }}>Our Process</h2>
              <div className="row g-4 text-center">
                <div className="col-md-3">
                  <div className="single_services p-4 h-100">
                    <div className="services_icon mb-3"><FaSearch size={32} color="#38424D" /></div>
                    <h6 className="fw-bold">1. Discover</h6>
                    <p>We listen, research, and understand your business needs.</p>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="single_services p-4 h-100">
                    <div className="services_icon mb-3"><FaPencilAlt size={32} color="#38424D" /></div>
                    <h6 className="fw-bold">2. Design</h6>
                    <p>We craft user-friendly, beautiful, and functional solutions.</p>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="single_services p-4 h-100">
                    <div className="services_icon mb-3"><FaCode size={32} color="#38424D" /></div>
                    <h6 className="fw-bold">3. Develop</h6>
                    <p>Our team builds, tests, and iterates with you at every step.</p>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="single_services p-4 h-100">
                    <div className="services_icon mb-3"><FaThumbsUp size={32} color="#38424D" /></div>
                    <h6 className="fw-bold">4. Deliver</h6>
                    <p>We launch, support, and help you grow your business.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row justify-content-center mb-5">
          <div className="col-lg-10">
            <div className="bg-white rounded-4 shadow-sm p-4 p-md-5 text-center mb-5">
              <h2 className="main_title mb-4" style={{ fontWeight: 800 }}>What Our Clients Say</h2>
              <div className="row g-4 justify-content-center">
                <div className="col-md-6 col-lg-4">
                  <div className="single_services p-4 h-100">
                    <p className="mb-3">“CompileCraft delivered our project on time and exceeded our expectations. Their team is highly skilled and professional.”</p>
                    <div className="d-flex align-items-center justify-content-center">
                      <div className="me-3">
                        <FaUserTie size={40} color="#38424D" style={{ borderRadius: '50%' }} />
                      </div>
                      <div>
                        <strong>Jane Doe</strong><br />
                        <span style={{ fontSize: '0.9em', color: '#747E88' }}>CEO, ExampleCorp</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 col-lg-4">
                  <div className="single_services p-4 h-100">
                    <p className="mb-3">“The CompileCraft team is responsive, creative, and truly cares about our business success.”</p>
                    <div className="d-flex align-items-center justify-content-center">
                      <div className="me-3">
                        <FaUserSecret size={40} color="#38424D" style={{ borderRadius: '50%' }} />
                      </div>
                      <div>
                        <strong>John Smith</strong><br />
                        <span style={{ fontSize: '0.9em', color: '#747E88' }}>CTO, StartupX</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Home; 