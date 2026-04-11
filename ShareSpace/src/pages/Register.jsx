import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  PlusCircle, 
  Mail, 
  Lock, 
  User, 
  Eye, 
  EyeOff,
  ArrowLeft 
} from 'lucide-react';
import './Login.css';

const Register = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    // Simulate API call
    setTimeout(() => {
      localStorage.setItem('token', 'mock-jwt-token');
      localStorage.setItem('user', JSON.stringify({
        id: 1,
        email: formData.email,
        first_name: formData.first_name,
        last_name: formData.last_name,
        profile_image: null,
        is_verified: false,
        rating_avg: 0,
        total_reviews: 0
      }));
      navigate('/dashboard');
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <Link to="/" className="back-link">
            <ArrowLeft size={20} />
            Back to Home
          </Link>
          <div className="login-logo">
            <PlusCircle size={48} />
            <h1>Create Account</h1>
            <p>Join ShareServe and start sharing your skills</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="form-row" style={{ gap: '1rem' }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label htmlFor="first_name">First Name</label>
              <div className="input-group">
                <User size={20} />
                <input
                  type="text"
                  id="first_name"
                  name="first_name"
                  placeholder="First name"
                  value={formData.first_name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label htmlFor="last_name">Last Name</label>
              <div className="input-group">
                <User size={20} />
                <input
                  type="text"
                  id="last_name"
                  name="last_name"
                  placeholder="Last name"
                  value={formData.last_name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <div className="input-group">
              <Mail size={20} />
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
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-group">
              <Lock size={20} />
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <div className="input-group">
              <Lock size={20} />
              <input
                type={showPassword ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <button type="submit" className="login-btn" disabled={isLoading}>
            {isLoading ? (
              <>
                <div className="spinner"></div>
                Creating Account...
              </>
            ) : (
              <>
                <PlusCircle size={20} />
                Create Account
              </>
            )}
          </button>

          <div className="signup-link">
            Already have an account? <Link to="/login">Sign in here</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;