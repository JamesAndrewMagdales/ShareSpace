import React, { useState } from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send,
  Clock,
  MessageCircle
} from 'lucide-react';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    // Reset form after 3 seconds
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 3000);
  };

  return (
    <div className="contact-page">
      <div className="contact-hero">
        <h1>Contact Us</h1>
        <p>Get in touch with our team. We'd love to hear from you!</p>
      </div>

      <div className="contact-content">
        <div className="contact-info">
          <div className="info-card">
            <div className="info-icon">
              <Mail size={24} />
            </div>
            <div className="info-content">
              <h3>Email Us</h3>
              <p>info@sharespace.com</p>
              <p>support@sharespace.com</p>
            </div>
          </div>

          <div className="info-card">
            <div className="info-icon">
              <Phone size={24} />
            </div>
            <div className="info-content">
              <h3>Call Us</h3>
              <p>+63 123 456 7890</p>
              <p>Mon-Fri, 9AM-6PM</p>
            </div>
          </div>

          <div className="info-card">
            <div className="info-icon">
              <MapPin size={24} />
            </div>
            <div className="info-content">
              <h3>Visit Us</h3>
              <p>123 Tech Street</p>
              <p>Manila, Philippines</p>
            </div>
          </div>

          <div className="info-card">
            <div className="info-icon">
              <Clock size={24} />
            </div>
            <div className="info-content">
              <h3>Business Hours</h3>
              <p>Monday - Friday: 9AM - 6PM</p>
              <p>Saturday - Sunday: Closed</p>
            </div>
          </div>
        </div>

        <div className="contact-form-container">
          <div className="form-header">
            <MessageCircle size={32} />
            <h2>Send us a Message</h2>
            <p>Fill out the form below and we'll get back to you as soon as possible.</p>
          </div>

          {submitted ? (
            <div className="success-message">
              <div className="success-icon">✓</div>
              <h3>Message Sent!</h3>
              <p>Thank you for contacting us. We'll respond shortly.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-group">
                <label htmlFor="name">Full Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="subject">Subject *</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  placeholder="What is this about?"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="message">Message *</label>
                <textarea
                  id="message"
                  name="message"
                  placeholder="Tell us how we can help..."
                  value={formData.message}
                  onChange={handleChange}
                  rows="6"
                  required
                />
              </div>

              <button type="submit" className="submit-btn">
                <Send size={20} />
                Send Message
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Contact;