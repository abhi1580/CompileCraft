import React from 'react';
import { FaUserTie, FaUserAlt, FaUserSecret, FaRegCalendarCheck, FaRegLightbulb } from 'react-icons/fa';

function About() {
  return (
    <section id="about" className="about_area py-5" style={{ background: '#f8f9fb' }}>
      <div className="container">
        {/* Company Story & Mission */}
        <div className="row justify-content-center mb-5">
          <div className="col-lg-8">
            <div className="bg-white rounded-4 shadow-sm p-4 p-md-5 text-center">
              <h2 className="mb-3" style={{ fontWeight: 800 }}>Our Story</h2>
              <p style={{ fontSize: '1.1rem' }}>
                CompileCraft was founded by passionate technologists who believe in the power of software to transform businesses. Our mission is to empower organizations with innovative, reliable, and scalable technology solutions that drive real results.
              </p>
              <h5 className="mt-4 mb-2" style={{ fontWeight: 700 }}>Our Mission</h5>
              <p>To help businesses grow, innovate, and thrive in a digital-first world.</p>
            </div>
          </div>
        </div>
        {/* Timeline / Milestones */}
        <div className="row justify-content-center mb-5">
          <div className="col-lg-10">
            <div className="bg-light rounded-4 p-4 p-md-5">
              <h3 className="text-center mb-4" style={{ fontWeight: 800 }}>Milestones</h3>
              <div className="row g-4">
                <div className="col-md-4 text-center">
                  <FaRegCalendarCheck size={36} color="#F94F4F" className="mb-2" />
                  <h6 className="fw-bold">2019</h6>
                  <p>Founded with a vision to deliver world-class software solutions.</p>
                </div>
                <div className="col-md-4 text-center">
                  <FaRegLightbulb size={36} color="#F94F4F" className="mb-2" />
                  <h6 className="fw-bold">2021</h6>
                  <p>Launched our first SaaS product and expanded to cloud services.</p>
                </div>
                <div className="col-md-4 text-center">
                  <FaUserTie size={36} color="#F94F4F" className="mb-2" />
                  <h6 className="fw-bold">2023</h6>
                  <p>Grew to a team of 20+ experts, serving clients worldwide.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Team Section */}
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <div className="bg-white rounded-4 shadow-sm p-4 p-md-5">
              <h3 className="text-center mb-4" style={{ fontWeight: 800 }}>Meet the Team</h3>
              <div className="row g-4 justify-content-center">
                {[{
                  icon: <FaUserTie size={48} color="#38424D" className="mb-3" />, name: 'Amit Sharma', role: 'CEO & Founder', desc: 'Visionary leader with 10+ years in software and business strategy.'
                }, {
                  icon: <FaUserAlt size={48} color="#38424D" className="mb-3" />, name: 'Priya Verma', role: 'CTO', desc: 'Tech architect and cloud expert passionate about scalable solutions.'
                }, {
                  icon: <FaUserSecret size={48} color="#38424D" className="mb-3" />, name: 'Rahul Singh', role: 'Lead Designer', desc: 'Creative mind behind our user experiences and product design.'
                }].map((member, idx) => (
                  <div className="col-12 col-md-4" key={member.name}>
                    <div className="card team-card text-center border-0 shadow-sm p-4 h-100" style={{ borderRadius: '1rem', background: '#f8f9fb' }}>
                      {member.icon}
                      <h6 className="fw-bold mb-1">{member.name}</h6>
                      <div className="text-muted mb-2">{member.role}</div>
                      <p className="small">{member.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About; 