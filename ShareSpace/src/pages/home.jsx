import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  MapPin, 
  Star, 
  Users, 
  Shield, 
  Zap,
  ArrowRight,
  Heart,
  Code,
  Brush,
  Wrench,
  BookOpen,
  Music,
  Camera,
  Car,
  Home as HomeIcon,
  Dumbbell
} from 'lucide-react';
import './Home.css';

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [featuredServices, setFeaturedServices] = useState([]);
  const [categories, setCategories] = useState([
    { id: 1, name: 'Tech & IT', icon: Code, count: 124 },
    { id: 2, name: 'Home & Garden', icon: HomeIcon, count: 89 },
    { id: 3, name: 'Teaching', icon: BookOpen, count: 67 },
    { id: 4, name: 'Art & Design', icon: Brush, count: 54 },
    { id: 5, name: 'Health & Fitness', icon: Dumbbell, count: 43 },
    { id: 6, name: 'Music', icon: Music, count: 38 },
    { id: 7, name: 'Photography', icon: Camera, count: 32 },
    { id: 8, name: 'Automotive', icon: Car, count: 28 }
  ]);

  const [testimonials] = useState([
    {
      id: 1,
      name: 'Sarah Johnson',
      role: 'Homeowner',
      content: 'Found an amazing plumber through ShareServe. Professional, affordable, and friendly!',
      rating: 5,
      image: '/avatar1.jpg'
    },
    {
      id: 2,
      name: 'Mike Chen',
      role: 'Web Developer',
      content: 'I love sharing my coding skills with my community. Made great connections!',
      rating: 5,
      image: '/avatar2.jpg'
    },
    {
      id: 3,
      name: 'Emma Wilson',
      role: 'Yoga Instructor',
      content: 'ShareServe helped me build a steady client base in my neighborhood.',
      rating: 5,
      image: '/avatar3.jpg'
    }
  ]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Connect with Local Skills & Services</h1>
          <p className="hero-subtitle">
            Discover trusted neighbors offering their expertise. From home repairs to 
            tutoring, find the perfect help right in your community.
          </p>

          <form className="search-form" onSubmit={handleSearch}>
            <div className="search-input-wrapper">
              <Search className="search-icon" />
              <input
                type="text"
                placeholder="What service are you looking for?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>
            <div className="location-input-wrapper">
              <MapPin className="location-icon" />
              <input
                type="text"
                placeholder="Your location"
                className="location-input"
              />
            </div>
            <button type="submit" className="search-btn">
              <Search size={20} />
              <span>Search</span>
            </button>
          </form>

          <div className="hero-stats">
            <div className="stat">
              <span className="stat-number">10,000+</span>
              <span className="stat-label">Active Users</span>
            </div>
            <div className="stat">
              <span className="stat-number">5,000+</span>
              <span className="stat-label">Services Listed</span>
            </div>
            <div className="stat">
              <span className="stat-number">4.8</span>
              <span className="stat-label">Average Rating</span>
            </div>
          </div>
        </div>

        <div className="hero-illustration">
          <div className="illustration-container">
            <div className="floating-card card-1">
              <Wrench size={24} />
              <span>Home Repair</span>
            </div>
            <div className="floating-card card-2">
              <Code size={24} />
              <span>Web Dev</span>
            </div>
            <div className="floating-card card-3">
              <BookOpen size={24} />
              <span>Tutoring</span>
            </div>
            <div className="floating-card card-4">
              <Camera size={24} />
              <span>Photography</span>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works">
        <h2>How It Works</h2>
        <div className="steps-grid">
          <div className="step">
            <div className="step-icon">
              <Search size={32} />
            </div>
            <h3>1. Search</h3>
            <p>Browse through local services or search for specific skills you need.</p>
          </div>
          <div className="step">
            <div className="step-icon">
              <Users size={32} />
            </div>
            <h3>2. Connect</h3>
            <p>Message providers, discuss details, and agree on terms.</p>
          </div>
          <div className="step">
            <div className="step-icon">
              <Star size={32} />
            </div>
            <h3>3. Get It Done</h3>
            <p>Receive quality service and leave a review to help others.</p>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="categories-section">
        <div className="section-header">
          <h2>Popular Categories</h2>
          <Link to="/search" className="view-all">
            View All <ArrowRight size={16} />
          </Link>
        </div>
        <div className="categories-grid">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/search?category=${category.id}`}
              className={`category-card ${selectedCategory === category.id ? 'selected' : ''}`}
              onClick={() => setSelectedCategory(category.id)}
            >
              <div className="category-icon">
                <category.icon size={28} />
              </div>
              <h3>{category.name}</h3>
              <span className="category-count">{category.count} services</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Services */}
      <section className="featured-section">
        <div className="section-header">
          <h2>Featured Services</h2>
          <Link to="/search" className="view-all">
            View All <ArrowRight size={16} />
          </Link>
        </div>
        <div className="services-grid">
          {/* Sample service cards */}
          <div className="service-card">
            <div className="service-image">
              <img src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400" alt="Web Development" />
              <span className="service-price">₱2,500</span>
            </div>
            <div className="service-content">
              <h3>Custom Website Development</h3>
              <p className="service-provider">
                <img src="https://randomuser.me/api/portraits/men/1.jpg" alt="Provider" />
                <span>John Doe</span>
                <span className="rating">
                  <Star size={14} fill="#fbbf24" /> 4.9 (45)
                </span>
              </p>
              <div className="service-tags">
                <span className="tag">Web Development</span>
                <span className="tag">Tech</span>
              </div>
            </div>
          </div>

          <div className="service-card">
            <div className="service-image">
              <img src="https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400" alt="Home Cleaning" />
              <span className="service-price">₱800</span>
            </div>
            <div className="service-content">
              <h3>Professional House Cleaning</h3>
              <p className="service-provider">
                <img src="https://randomuser.me/api/portraits/women/2.jpg" alt="Provider" />
                <span>Maria Santos</span>
                <span className="rating">
                  <Star size={14} fill="#fbbf24" /> 4.8 (89)
                </span>
              </p>
              <div className="service-tags">
                <span className="tag">Cleaning</span>
                <span className="tag">Home</span>
              </div>
            </div>
          </div>

          <div className="service-card">
            <div className="service-image">
              <img src="https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=400" alt="Guitar Lessons" />
              <span className="service-price">₱500/hr</span>
            </div>
            <div className="service-content">
              <h3>Beginner Guitar Lessons</h3>
              <p className="service-provider">
                <img src="https://randomuser.me/api/portraits/men/3.jpg" alt="Provider" />
                <span>Carlos Reyes</span>
                <span className="rating">
                  <Star size={14} fill="#fbbf24" /> 5.0 (32)
                </span>
              </p>
              <div className="service-tags">
                <span className="tag">Music</span>
                <span className="tag">Lessons</span>
              </div>
            </div>
          </div>

          <div className="service-card">
            <div className="service-image">
              <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400" alt="Photography" />
              <span className="service-price">₱3,500</span>
            </div>
            <div className="service-content">
              <h3>Portrait Photography Session</h3>
              <p className="service-provider">
                <img src="https://randomuser.me/api/portraits/women/4.jpg" alt="Provider" />
                <span>Ana Garcia</span>
                <span className="rating">
                  <Star size={14} fill="#fbbf24" /> 4.9 (67)
                </span>
              </p>
              <div className="service-tags">
                <span className="tag">Photography</span>
                <span className="tag">Portrait</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="why-us">
        <h2>Why Choose ShareServe?</h2>
        <div className="features-grid">
          <div className="feature">
            <div className="feature-icon">
              <Shield size={32} />
            </div>
            <h3>Verified Providers</h3>
            <p>All service providers go through a verification process for your safety.</p>
          </div>
          <div className="feature">
            <div className="feature-icon">
              <Heart size={32} />
            </div>
            <h3>Community Focused</h3>
            <p>Support your local neighbors and build meaningful connections.</p>
          </div>
          <div className="feature">
            <div className="feature-icon">
              <Zap size={32} />
            </div>
            <h3>Quick & Easy</h3>
            <p>Find and book services in minutes with our simple platform.</p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials">
        <h2>What Our Users Say</h2>
        <div className="testimonials-grid">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="testimonial-card">
              <div className="testimonial-content">
                <div className="testimonial-stars">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={16} fill="#fbbf24" color="#fbbf24" />
                  ))}
                </div>
                <p>"{testimonial.content}"</p>
              </div>
              <div className="testimonial-author">
                <img src={testimonial.image} alt={testimonial.name} />
                <div>
                  <h4>{testimonial.name}</h4>
                  <span>{testimonial.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to Get Started?</h2>
          <p>Join thousands of neighbors helping neighbors. Sign up today!</p>
          <div className="cta-buttons">
            <Link to="/register" className="cta-btn primary">
              Create Account <ArrowRight size={20} />
            </Link>
            <Link to="/search" className="cta-btn secondary">
              Browse Services
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;