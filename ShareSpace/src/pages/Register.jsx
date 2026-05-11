import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  PlusCircle, 
  Mail, 
  Lock, 
  User, 
  Eye, 
  EyeOff,
  ArrowLeft,
  Shield
} from 'lucide-react';
import axios from 'axios';
import './Login.css';

const Register = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    confirmPassword: '',
    admin_code: ''
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

    try {
      const response = await axios.post('/api/auth/register', {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        password: formData.password,
        admin_code: formData.admin_code || undefined
      });

      if (response.data.success) {
        const { token, user } = response.data.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        // Redirect to admin panel if admin, else dashboard
        if (user.is_admin) {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
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

          <div className="form-group">
            <label htmlFor="admin_code">
              <Shield size={14} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
              Admin Code (optional)
            </label>
            <div className="input-group">
              <input
                type="text"
                id="admin_code"
                name="admin_code"
                placeholder="Enter admin code to create admin account"
                value={formData.admin_code}
                onChange={handleChange}
                style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: '1rem', color: '#1f2937', flex: 1 }}
              />
            </div>
            <small style={{ color: '#6b7280', fontSize: '0.75rem', marginTop: '0.25rem' }}>
              Leave blank for regular user account. Contact site owner for admin code.
            </small>
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