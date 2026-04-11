import React, { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { 
  Menu, 
  X, 
  Home, 
  Search, 
  User, 
  MessageCircle,
  PlusCircle,
  LogIn,
  UserPlus,
  Mail,
  Info
} from 'lucide-react';
import './Layout.css';

const Layout = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Search', path: '/search', icon: Search },
    { name: 'About', path: '/about', icon: Info },
    { name: 'Contact', path: '/contact', icon: Mail },
  ];

  const userNavigation = [
    { name: 'Login', path: '/login', icon: LogIn },
    { name: 'Register', path: '/register', icon: UserPlus },
  ];

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: Home },
    { name: 'Search Services', path: '/search', icon: Search },
    { name: 'Messages', path: '/messages', icon: MessageCircle },
    { name: 'Create Service', path: '/create-service', icon: PlusCircle },
    { name: 'About', path: '/about', icon: Info },
    { name: 'Contact', path: '/contact', icon: Mail },
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="layout">
      {/* Header */}
      <header className="header">
        <div className="header-container">
          <Link to="/" className="logo">
            <span className="logo-text">ShareSpace</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="desktop-nav">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
              >
                <item.icon size={20} />
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>

          {/* User Actions */}
          <div className="header-actions">
            <Link to="/login" className="action-btn login-btn">
              <LogIn size={20} />
              <span>Login</span>
            </Link>
            <Link to="/register" className="action-btn register-btn">
              <UserPlus size={20} />
              <span>Register</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="mobile-menu-btn"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <nav className={`mobile-nav ${isMenuOpen ? 'open' : ''}`}>
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`mobile-nav-link ${isActive(item.path) ? 'active' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              <item.icon size={20} />
              <span>{item.name}</span>
            </Link>
          ))}
          <div className="mobile-nav-divider"></div>
          {userNavigation.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`mobile-nav-link ${isActive(item.path) ? 'active' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              <item.icon size={20} />
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>
      </header>

      {/* Main Content */}
      <main className="main-content">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-content">
            <div className="footer-section">
              <h3>ShareSpace</h3>
              <p>Empowering communities through shared skills and services.</p>
            </div>
            
            <div className="footer-section">
              <h4>Quick Links</h4>
              <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/search">Search Services</Link></li>
                <li><Link to="/about">About Us</Link></li>
                <li><Link to="/contact">Contact Us</Link></li>
              </ul>
            </div>

            <div className="footer-section">
              <h4>For Providers</h4>
              <ul>
                <li><Link to="/register">Get Started</Link></li>
                <li><Link to="/create-service">Create Service</Link></li>
                <li><Link to="/dashboard">Dashboard</Link></li>
                <li><Link to="/messages">Messages</Link></li>
              </ul>
            </div>

            <div className="footer-section">
              <h4>Contact</h4>
              <ul>
                <li>Email: info@sharespace.com</li>
                <li>Phone: +63 123 456 7890</li>
                <li>Address: 123 Tech Street, Manila</li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <p>&copy; 2024 ShareSpace. All rights reserved.</p>
            <div className="footer-social">
              <Link to="#">Facebook</Link>
              <Link to="#">Twitter</Link>
              <Link to="#">Instagram</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;