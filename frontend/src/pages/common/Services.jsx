import React from 'react';
import { FaPencilAlt, FaCloud, FaMobileAlt, FaBolt, FaSmile, FaChartBar } from 'react-icons/fa';

function Services() {
  return (
    <section id="services" className="services_area pt-5 pb-5" style={{ background: '#f8f9fb' }}>
      <div className="container-fluid">
        {/* Services Offered */}
        <div className="row justify-content-center mb-5">
          <div className="col-lg-8">
            <div className="section_title text-center pb-4">
              <h5 className="sub_title">What We Offer</h5>
              <h2 className="main_title">Our Services</h2>
            </div>
          </div>
        </div>
        <div className="row justify-content-center g-4 mb-5">
          {[
            {
              icon: <FaPencilAlt size={40} color="#F94F4F" />,
              title: 'Custom Software',
              desc: 'Tailored solutions to fit your business needs, from MVPs to enterprise systems. We work closely with you to understand your requirements and deliver software that drives results.'
            },
            {
              icon: <FaCloud size={40} color="#F94F4F" />,
              title: 'Cloud & DevOps',
              desc: 'Cloud migration, automation, and scalable infrastructure for modern businesses. We help you leverage the power of the cloud to improve efficiency, security, and scalability.'
            },
            {
              icon: <FaMobileAlt size={40} color="#F94F4F" />,
              title: 'Web & Mobile Apps',
              desc: 'Beautiful, fast, and secure web and mobile applications for any platform. Our team ensures your digital presence is engaging, user-friendly, and high-performing.'
            }
          ].map((service, idx) => (
            <div className="col-12 col-md-6 col-lg-4" key={service.title}>
              <div className="single_services text-center h-100 p-4 bg-white rounded-4 shadow-sm">
                <div className="services_icon mb-3">{service.icon}</div>
                <div className="services_content">
                  <h4 className="services_title mb-2">{service.title}</h4>
                  <p>{service.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* How We Deliver Section */}
        <div className="row justify-content-center mb-5">
          <div className="col-lg-10">
            <div className="bg-light rounded-4 p-4 p-md-5">
              <h3 className="text-center mb-4" style={{ fontWeight: 800 }}>How We Deliver</h3>
              <div className="row g-4 text-center">
                <div className="col-md-4">
                  <FaBolt size={32} color="#38424D" className="mb-2" />
                  <h6 className="fw-bold">Fast & Reliable</h6>
                  <p>We use agile methods to deliver results quickly and efficiently.</p>
                </div>
                <div className="col-md-4">
                  <FaSmile size={32} color="#38424D" className="mb-2" />
                  <h6 className="fw-bold">Client-Centric</h6>
                  <p>Your satisfaction is our top priority. We keep you involved at every step.</p>
                </div>
                <div className="col-md-4">
                  <FaChartBar size={32} color="#38424D" className="mb-2" />
                  <h6 className="fw-bold">Results-Driven</h6>
                  <p>We focus on delivering measurable business value and growth.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Why Choose Us Section */}
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <div className="bg-white rounded-4 shadow-sm p-4 p-md-5 text-center">
              <h3 className="mb-3" style={{ fontWeight: 800 }}>Why Choose CompileCraft?</h3>
              <p style={{ fontSize: '1.1rem' }}>
                We combine technical expertise, creative thinking, and a passion for problem-solving to deliver solutions that make a difference. Partner with us for a seamless, transparent, and rewarding experience.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Services; 