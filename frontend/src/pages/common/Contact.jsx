import React from 'react';
import { FaEnvelopeOpenText, FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaLinkedin, FaTwitter, FaGithub } from 'react-icons/fa';

function Contact() {
  return (
    <section id="contact" className="contact_area py-5" style={{ background: '#f8f9fb' }}>
      <div className="container-fluid">
        <div className="row justify-content-center mb-5">
          <div className="col-lg-8">
            <div className="text-center mb-4">
              <FaEnvelopeOpenText size={40} color="#F94F4F" className="mb-2" />
              <span className="sub_title d-block mb-2" style={{ color: '#F94F4F', fontWeight: 600 }}>Contact Us</span>
              <h2 className="main_title">Let’s Work Together</h2>
              <p className="mt-3 mb-0">Ready to start your next project or have questions? Fill out the form below and our team will get back to you within 24 hours.</p>
            </div>
            <form>
              <div className="row g-3">
                <div className="col-md-6">
                  <input type="text" className="form-control" placeholder="Your Name" required />
                </div>
                <div className="col-md-6">
                  <input type="email" className="form-control" placeholder="Your Email" required />
                </div>
                <div className="col-12">
                  <textarea className="form-control" rows="4" placeholder="Your Message" required></textarea>
                </div>
              </div>
              <div className="text-center mt-4">
                <button type="submit" className="main-btn">Send Message</button>
              </div>
            </form>
          </div>
        </div>
        <div className="row justify-content-center mb-5">
          <div className="col-lg-8">
            <div className="bg-white rounded-4 shadow-sm p-4 p-md-5 text-center">
              <h4 className="mb-3" style={{ fontWeight: 700 }}>Contact Information</h4>
              <div className="row g-4">
                <div className="col-md-4">
                  <FaMapMarkerAlt size={28} color="#38424D" className="mb-2" />
                  <div>123 Startup Lane<br />Bangalore, IN</div>
                </div>
                <div className="col-md-4">
                  <FaPhoneAlt size={28} color="#38424D" className="mb-2" />
                  <div>+91 98765 43210</div>
                </div>
                <div className="col-md-4">
                  <FaEnvelope size={28} color="#38424D" className="mb-2" />
                  <div>hello@compilecraft.com</div>
                </div>
              </div>
              <div className="mt-4">
                <a href="https://linkedin.com" className="me-3" target="_blank" rel="noopener noreferrer"><FaLinkedin size={24} color="#F94F4F" /></a>
                <a href="https://twitter.com" className="me-3" target="_blank" rel="noopener noreferrer"><FaTwitter size={24} color="#F94F4F" /></a>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer"><FaGithub size={24} color="#F94F4F" /></a>
              </div>
            </div>
          </div>
        </div>
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="bg-light rounded-4 p-4 p-md-5 text-center">
              <h4 className="mb-3" style={{ fontWeight: 700 }}>Our Location</h4>
              <div style={{ width: '100%', height: '220px', background: '#e9ecef', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#747E88' }}>
                <span>Map Placeholder</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Contact; 