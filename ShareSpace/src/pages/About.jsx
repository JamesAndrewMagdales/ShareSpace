import React from 'react';
import { 
  Target, 
  Eye, 
  Heart,
  Users,
  Award,
  Globe,
  Star,
  CheckCircle
} from 'lucide-react';
import './About.css';

const About = () => {
  const team = [
    { name: 'John Doe', role: 'CEO & Founder', avatar: null },
    { name: 'Sarah Johnson', role: 'CTO', avatar: null },
    { name: 'Mike Chen', role: 'Head of Product', avatar: null },
    { name: 'Emma Wilson', role: 'Lead Designer', avatar: null },
  ];

  const stats = [
    { icon: Users, value: '10K+', label: 'Active Users' },
    { icon: Star, value: '4.8', label: 'Average Rating' },
    { icon: Globe, value: '50+', label: 'Cities Covered' },
    { icon: Award, value: '15K+', label: 'Services Listed' },
  ];

  const values = [
    {
      icon: Target,
      title: 'Our Mission',
      description: 'To connect talented service providers with clients who need their skills, creating opportunities for everyone in the community.'
    },
    {
      icon: Eye,
      title: 'Our Vision',
      description: 'To be the leading platform for local services, where trust and quality meet convenience and affordability.'
    },
    {
      icon: Heart,
      title: 'Our Values',
      description: 'We believe in transparency, quality, and community. Every interaction on our platform is built on trust and mutual respect.'
    }
  ];

  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="hero-content">
          <h1>About ShareSpace</h1>
          <p>Empowering communities through shared skills and services</p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-container">
          {stats.map((stat, index) => (
            <div key={index} className="stat-card">
              <div className="stat-icon">
                <stat.icon size={32} />
              </div>
              <div className="stat-content">
                <span className="stat-value">{stat.value}</span>
                <span className="stat-label">{stat.label}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Mission, Vision, Values */}
      <section className="mvv-section">
        <div className="mvv-container">
          {values.map((item, index) => (
            <div key={index} className="mvv-card">
              <div className="mvv-icon">
                <item.icon size={48} />
              </div>
              <h2>{item.title}</h2>
              <p>{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Story Section */}
      <section className="story-section">
        <div className="story-container">
          <div className="story-content">
            <h2>Our Story</h2>
            <p>
              ShareSpace was born from a simple idea: everyone has something valuable to share. 
              Whether it's a skill, a service, or expertise, we believe that connecting people 
              through these offerings can transform communities.
            </p>
            <p>
              Founded in 2024, we set out to create a platform where service providers could 
              easily connect with clients, and where quality and trust were at the heart of 
              every transaction. Today, we're proud to serve thousands of users across the 
              country, helping them find the services they need and grow their businesses.
            </p>
            <p>
              Our platform is designed to be simple, secure, and effective. We've built 
              features that matter most to our users: easy service discovery, secure 
              messaging, transparent reviews, and reliable support.
            </p>
          </div>
          <div className="story-features">
            <h3>Why Choose ShareSpace?</h3>
            <div className="feature-list">
              <div className="feature-item">
                <CheckCircle size={24} />
                <span>Verified service providers</span>
              </div>
              <div className="feature-item">
                <CheckCircle size={24} />
                <span>Transparent reviews and ratings</span>
              </div>
              <div className="feature-item">
                <CheckCircle size={24} />
                <span>Secure messaging system</span>
              </div>
              <div className="feature-item">
                <CheckCircle size={24} />
                <span>Easy service discovery</span>
              </div>
              <div className="feature-item">
                <CheckCircle size={24} />
                <span>24/7 customer support</span>
              </div>
              <div className="feature-item">
                <CheckCircle size={24} />
                <span>Money-back guarantee</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="team-section">
        <div className="team-container">
          <h2>Meet Our Team</h2>
          <p className="team-subtitle">The people behind ShareSpace</p>
          <div className="team-grid">
            {team.map((member, index) => (
              <div key={index} className="team-card">
                <div className="team-avatar">
                  <Users size={48} />
                </div>
                <h3>{member.name}</h3>
                <p>{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to Get Started?</h2>
          <p>Join thousands of users who are already sharing their skills and services.</p>
          <div className="cta-buttons">
            <button className="cta-btn primary">Sign Up Now</button>
            <button className="cta-btn secondary">Learn More</button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;