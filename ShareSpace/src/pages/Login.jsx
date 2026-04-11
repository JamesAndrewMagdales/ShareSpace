import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  LogIn, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff,
  ArrowLeft 
} from 'lucide-react';
import './Login.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
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

    // Simulate API call
    setTimeout(() => {
      // Mock successful login
      if (formData.email === 'user@example.com' && formData.password === 'password123') {
        localStorage.setItem('token', 'mock-jwt-token');
        localStorage.setItem('user', JSON.stringify({
          id: 1,
          email: formData.email,
          first_name: 'John',
          last_name: 'Doe',
          profile_image: null,
          is_verified: true,
          rating_avg: 4.8,
          total_reviews: 24
        }));
        navigate('/dashboard');
      } else {
        setError('Invalid email or password');
      }
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
            <LogIn size={48} />
            <h1>Welcome Back</h1>
            <p>Sign in to your ShareServe account</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

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
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
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

          <div className="form-options">
            <Link to="/forgot-password" className="forgot-link">
              Forgot your password?
            </Link>
          </div>

          <button type="submit" className="login-btn" disabled={isLoading}>
            {isLoading ? (
              <>
                <div className="spinner"></div>
                Signing In...
              </>
            ) : (
              <>
                <LogIn size={20} />
                Sign In
              </>
            )}
          </button>

          <div className="signup-link">
            Don't have an account? <Link to="/register">Sign up here</Link>
          </div>
        </form>

        {/* Demo Credentials */}
        <div className="demo-credentials">
          <h3>Try with Demo Account</h3>
          <div className="demo-info">
            <p><strong>Email:</strong> user@example.com</p>
            <p><strong>Password:</strong> password123</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;