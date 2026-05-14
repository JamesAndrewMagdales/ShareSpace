import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Upload, 
  X,
  ArrowLeft,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import axios from 'axios';
import './CreateService.css';

const CreateService = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    price: '',
    priceType: 'Fixed',
    location: '',
    city: '',
    isRemote: false,
    duration: 60
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // Fetch categories from API
    const fetchCategories = async () => {
      try {
        const response = await axios.get('/api/services/categories/all');
        if (response.data.success) {
          setCategories(response.data.data);
        }
      } catch (err) {
        console.error('Failed to fetch categories:', err);
        // Fallback to default categories
        setCategories([
          { id: 1, name: 'Tech & IT' },
          { id: 2, name: 'Home & Garden' },
          { id: 3, name: 'Teaching & Tutoring' },
          { id: 4, name: 'Health & Wellness' },
          { id: 5, name: 'Beauty & Personal Care' },
          { id: 6, name: 'Automotive' },
          { id: 7, name: 'Events & Photography' },
          { id: 8, name: 'Writing & Translation' },
          { id: 9, name: 'Art & Craft' },
          { id: 10, name: 'Business & Legal' },
          { id: 11, name: 'Moving & Delivery' },
          { id: 12, name: 'Cleaning & Laundry' }
        ]);
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      setError('You must be logged in to create a service');
      setIsLoading(false);
      return;
    }

    try {
      const serviceData = {
        title: formData.title,
        description: formData.description,
        category_id: parseInt(formData.category),
        price: parseFloat(formData.price) || 0,
        price_type: formData.priceType,
        location: formData.location,
        city: formData.city,
        is_remote: formData.isRemote,
        duration_minutes: parseInt(formData.duration)
      };

      const response = await axios.post('/api/services', serviceData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.success) {
        setSuccess('Service created successfully!');
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create service. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="create-service-page">
      <div className="create-service-container">
        <div className="page-header">
          <button className="back-btn" onClick={() => navigate(-1)}>
            <ArrowLeft size={20} />
          </button>
          <h1>Create New Service</h1>
          <p>List your skills and start earning</p>
        </div>

        <form onSubmit={handleSubmit} className="service-form">
          {error && (
            <div className="error-message">
              <AlertCircle size={18} />
              <span>{error}</span>
              <button type="button" className="close-error" onClick={() => setError('')}>
                <X size={16} />
              </button>
            </div>
          )}
          {success && (
            <div className="success-message">
              <CheckCircle size={18} />
              <span>{success}</span>
            </div>
          )}

          <div className="form-section">
            <h3>Basic Information</h3>
            
            <div className="form-group">
              <label htmlFor="title">Service Title *</label>
              <input
                type="text"
                id="title"
                name="title"
                placeholder="e.g., Professional Website Development"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description *</label>
              <textarea
                id="description"
                name="description"
                placeholder="Describe your service in detail..."
                value={formData.description}
                onChange={handleChange}
                rows="6"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="category">Category *</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-section">
            <h3>Pricing</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="price">Price (₱)</label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  placeholder="0"
                  min="0"
                  value={formData.price}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="priceType">Price Type</label>
                <select
                  id="priceType"
                  name="priceType"
                  value={formData.priceType}
                  onChange={handleChange}
                >
                  <option value="Fixed">Fixed</option>
                  <option value="Hourly">Hourly</option>
                  <option value="Negotiable">Negotiable</option>
                  <option value="Free">Free</option>
                </select>
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Location & Availability</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="city">City</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  placeholder="e.g., Manila"
                  value={formData.city}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="location">Specific Location (Optional)</label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  placeholder="e.g., Makati Avenue"
                  value={formData.location}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="isRemote"
                  checked={formData.isRemote}
                  onChange={handleChange}
                />
                <span>This service can be done remotely</span>
              </label>
            </div>

            <div className="form-group">
              <label htmlFor="duration">Duration (minutes)</label>
              <select
                id="duration"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
              >
                <option value={30}>30 minutes</option>
                <option value={60}>1 hour</option>
                <option value={90}>1.5 hours</option>
                <option value={120}>2 hours</option>
                <option value={180}>3 hours</option>
                <option value={240}>4 hours</option>
                <option value={480}>8 hours (Full day)</option>
              </select>
            </div>
          </div>

          <div className="form-section">
            <h3>Images (Optional)</h3>
            <div className="image-upload">
              <div className="upload-area">
                <Upload size={48} />
                <p>Drag and drop images here, or click to browse</p>
                <span>PNG, JPG up to 5MB each</span>
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={() => navigate(-1)} disabled={isLoading}>
              Cancel
            </button>
            <button type="submit" className="submit-btn" disabled={isLoading}>
              {isLoading ? (
                <>
                  <div className="spinner"></div>
                  Publishing...
                </>
              ) : (
                <>
                  <Plus size={20} />
                  Publish Service
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateService;