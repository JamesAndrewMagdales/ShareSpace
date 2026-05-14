import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  User, 
  Star, 
  FileText, 
  MessageCircle, 
  Plus, 
  Settings,
  LogOut,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Heart,
  Shield,
  Edit,
  Trash2,
  X
} from 'lucide-react';
import axios from 'axios';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [services, setServices] = useState([]);
  const [requests, setRequests] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [editFormData, setEditFormData] = useState({
    title: '',
    description: '',
    price: '',
    price_type: 'Fixed',
    city: '',
    location: '',
    is_remote: false,
    duration_minutes: 60,
    is_available: true
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
    } else {
      navigate('/login');
      return;
    }
    
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user'));
      
      if (!user || !token) {
        navigate('/login');
        return;
      }

      // Fetch user's services
      try {
        const servicesResponse = await axios.get(`/api/services/provider/${user.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (servicesResponse.data.success) {
          setServices(servicesResponse.data.data.services || []);
        }
      } catch (err) {
        console.error('Error fetching services:', err);
        // Use empty array if fetch fails
        setServices([]);
      }

      // Fetch user's reviews
      try {
        const reviewsResponse = await axios.get(`/api/users/${user.id}/reviews`);
        
        if (reviewsResponse.data.success) {
          setReviews(reviewsResponse.data.data || []);
        }
      } catch (err) {
        console.error('Error fetching reviews:', err);
        setReviews([]);
      }

      // For requests, we'll use mock data for now as the requests API needs implementation
      setRequests([
        { id: 1, service: 'Web Development', client: 'Sarah Johnson', date: '2024-01-15', status: 'Pending' },
        { id: 2, service: 'Graphic Design', client: 'Mike Chen', date: '2024-01-14', status: 'Accepted' },
        { id: 3, service: 'Web Development', client: 'Emma Wilson', date: '2024-01-10', status: 'Completed' },
      ]);

    } catch (err) {
      setError('Failed to load dashboard data');
      console.error('Dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    totalServices: services.length,
    activeRequests: requests.filter(r => r.status === 'Pending').length,
    completedJobs: requests.filter(r => r.status === 'Completed').length,
    averageRating: 4.8,
    totalReviews: reviews.length,
    totalEarnings: 15600
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'services', label: 'My Services', icon: FileText },
    { id: 'requests', label: 'Requests', icon: MessageCircle },
    { id: 'reviews', label: 'Reviews', icon: Star },
    { id: 'favorites', label: 'Favorites', icon: Heart },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'status-active';
      case 'Pending': return 'status-pending';
      case 'Accepted': return 'status-accepted';
      case 'Completed': return 'status-completed';
      case 'Rejected': return 'status-rejected';
      case 'Cancelled': return 'status-cancelled';
      default: return '';
    }
  };

  // Delete service handler
  const openDeleteModal = (service) => {
    setServiceToDelete(service);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!serviceToDelete) return;
    
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(`/api/services/${serviceToDelete.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setServices(services.filter(s => s.id !== serviceToDelete.id));
        setShowDeleteModal(false);
        setServiceToDelete(null);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete service');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Edit service handler
  const openEditModal = (service) => {
    setEditingService(service);
    setEditFormData({
      title: service.title || '',
      description: service.description || '',
      price: service.price || '',
      price_type: service.price_type || 'Fixed',
      city: service.city || '',
      location: service.location || '',
      is_remote: service.is_remote || false,
      duration_minutes: service.duration_minutes || 60,
      is_available: service.is_available !== undefined ? service.is_available : true
    });
    setShowEditModal(true);
  };

  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editingService) return;

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`/api/services/${editingService.id}`, editFormData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        // Update the service in the list
        setServices(services.map(s => 
          s.id === editingService.id 
            ? { ...s, ...editFormData } 
            : s
        ));
        setShowEditModal(false);
        setEditingService(null);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update service');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div className="profile-section">
          <div className="profile-avatar">
            <User size={48} />
            {user?.is_verified && (
              <span className="verified-badge">
                <Shield size={14} />
              </span>
            )}
          </div>
          <div className="profile-info">
            <h1>{user ? `${user.first_name} ${user.last_name}` : 'Guest User'}</h1>
            <p className="profile-location">Manila, Philippines</p>
            <div className="profile-stats">
              <span className="stat-item">
                <Star size={16} fill="#fbbf24" color="#fbbf24" />
                {stats.averageRating} ({stats.totalReviews} reviews)
              </span>
              {user?.is_verified && (
                <span className="verified-tag">
                  <Shield size={14} /> Verified
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">
              <FileText size={24} />
            </div>
            <div className="stat-content">
              <span className="stat-value">{stats.totalServices}</span>
              <span className="stat-label">Active Services</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">
              <MessageCircle size={24} />
            </div>
            <div className="stat-content">
              <span className="stat-value">{stats.activeRequests}</span>
              <span className="stat-label">Pending Requests</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">
              <CheckCircle size={24} />
            </div>
            <div className="stat-content">
              <span className="stat-value">{stats.completedJobs}</span>
              <span className="stat-label">Completed Jobs</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">
              <TrendingUp size={24} />
            </div>
            <div className="stat-content">
              <span className="stat-value">₱{stats.totalEarnings.toLocaleString()}</span>
              <span className="stat-label">Total Earnings</span>
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <aside className="dashboard-sidebar">
          <nav className="dashboard-nav">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <tab.icon size={20} />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>

          <div className="sidebar-footer">
            <Link to="/create-service" className="create-service-btn">
              <Plus size={20} />
              <span>Create New Service</span>
            </Link>
            <button className="logout-btn" onClick={() => setShowLogoutModal(true)}>
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </aside>

        <main className="dashboard-main">
          {activeTab === 'overview' && (
            <div className="overview-tab">
              <div className="section-header">
                <h2>Recent Activity</h2>
              </div>
              
              <div className="activity-list">
                {requests.slice(0, 5).map((request) => (
                  <div key={request.id} className="activity-item">
                    <div className={`activity-icon ${getStatusColor(request.status)}`}>
                      {request.status === 'Pending' && <Clock size={20} />}
                      {request.status === 'Accepted' && <CheckCircle size={20} />}
                      {request.status === 'Completed' && <CheckCircle size={20} />}
                    </div>
                    <div className="activity-content">
                      <h4>{request.service}</h4>
                      <p>Client: {request.client}</p>
                    </div>
                    <span className={`activity-status ${getStatusColor(request.status)}`}>
                      {request.status}
                    </span>
                  </div>
                ))}
              </div>

              <div className="section-header">
                <h2>Top Rated Services</h2>
              </div>
              
              <div className="services-mini-grid">
                {services.map((service) => (
                  <div key={service.id} className="service-mini-card">
                    <h4>{service.title}</h4>
                    <div className="service-mini-stats">
                      <span>{service.views} views</span>
                      <span>{service.requests} requests</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'services' && (
            <div className="services-tab">
              <div className="section-header">
                <h2>My Services</h2>
                <Link to="/create-service" className="add-btn">
                  <Plus size={20} /> Add Service
                </Link>
              </div>

              {loading ? (
                <div className="loading-state">
                  <div className="spinner"></div>
                  <p>Loading services...</p>
                </div>
              ) : (
                <div className="services-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Service</th>
                        <th>Status</th>
                        <th>Views</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {services.length === 0 ? (
                        <tr>
                          <td colSpan="4" style={{ textAlign: 'center', padding: '2rem' }}>
                            No services yet. <Link to="/create-service">Create your first service</Link>
                          </td>
                        </tr>
                      ) : (
                        services.map((service) => (
                          <tr key={service.id}>
                            <td>{service.title}</td>
                            <td>
                              <span className={`status-badge ${getStatusColor(service.status || 'Active')}`}>
                                {service.status || 'Active'}
                              </span>
                            </td>
                            <td>{service.views_count || service.views || 0}</td>
                            <td>
                              <button 
                                className="action-btn edit" 
                                onClick={() => openEditModal(service)}
                                title="Edit service"
                              >
                                <Edit size={16} />
                              </button>
                              <button 
                                className="action-btn delete" 
                                onClick={() => openDeleteModal(service)}
                                title="Delete service"
                              >
                                <Trash2 size={16} />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === 'requests' && (
            <div className="requests-tab">
              <div className="section-header">
                <h2>Service Requests</h2>
              </div>

              <div className="requests-list">
                {requests.map((request) => (
                  <div key={request.id} className="request-card">
                    <div className="request-header">
                      <h3>{request.service}</h3>
                      <span className={`status-badge ${getStatusColor(request.status)}`}>
                        {request.status}
                      </span>
                    </div>
                    <div className="request-details">
                      <p><strong>Client:</strong> {request.client}</p>
                      <p><strong>Date:</strong> {request.date}</p>
                    </div>
                    {request.status === 'Pending' && (
                      <div className="request-actions">
                        <button className="accept-btn">Accept</button>
                        <button className="reject-btn">Reject</button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="reviews-tab">
              <div className="section-header">
                <h2>My Reviews</h2>
              </div>

              <div className="reviews-list">
                {reviews.map((review) => (
                  <div key={review.id} className="review-card">
                    <div className="review-header">
                      <div className="reviewer-info">
                        <div className="reviewer-avatar">
                          <User size={24} />
                        </div>
                        <div>
                          <h4>{review.author}</h4>
                          <span className="review-date">{review.date}</span>
                        </div>
                      </div>
                      <div className="review-rating">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={18}
                            fill={i < review.rating ? '#fbbf24' : 'none'}
                            color="#fbbf24"
                          />
                        ))}
                      </div>
                    </div>
                    <p className="review-comment">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'favorites' && (
            <div className="favorites-tab">
              <div className="section-header">
                <h2>Saved Services</h2>
              </div>
              <div className="empty-state">
                <Heart size={48} />
                <h3>No saved services yet</h3>
                <p>Save services you're interested in to find them later</p>
                <Link to="/search" className="browse-btn">Browse Services</Link>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="settings-tab">
              <div className="section-header">
                <h2>Account Settings</h2>
              </div>

              <div className="settings-form">
                <div className="settings-section">
                  <h3>Profile Information</h3>
                  <div className="form-row">
                    <div className="form-group">
                      <label>First Name</label>
                      <input type="text" defaultValue={user?.first_name || ''} />
                    </div>
                    <div className="form-group">
                      <label>Last Name</label>
                      <input type="text" defaultValue={user?.last_name || ''} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input type="email" defaultValue={user?.email || ''} />
                  </div>
                  <div className="form-group">
                    <label>Location</label>
                    <input type="text" placeholder="Enter your location" />
                  </div>
                  <div className="form-group">
                    <label>Bio</label>
                    <textarea placeholder="Tell us about yourself" rows="4"></textarea>
                  </div>
                </div>

                <div className="settings-section">
                  <h3>Skills</h3>
                  <div className="skills-input">
                    <input type="text" placeholder="Add a skill" />
                    <button className="add-skill-btn">Add</button>
                  </div>
                  <div className="skills-list">
                    <span className="skill-tag">Web Development <button>×</button></span>
                    <span className="skill-tag">Graphic Design <button>×</button></span>
                  </div>
                </div>

                <button className="save-btn">Save Changes</button>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Confirm Delete</h2>
              <button className="close-btn" onClick={() => setShowDeleteModal(false)}>
                <X size={24} />
              </button>
            </div>
            <div className="modal-body">
              <AlertCircle size={48} style={{ color: '#ef4444', marginBottom: '1rem' }} />
              <p>Are you sure you want to delete this service?</p>
              <p style={{ fontWeight: 'bold', marginTop: '0.5rem' }}>
                "{serviceToDelete?.title}"
              </p>
              <p style={{ color: '#6b7280', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                This action cannot be undone. The service will be marked as inactive.
              </p>
            </div>
            <div className="modal-actions">
              <button 
                className="cancel-btn" 
                onClick={() => setShowDeleteModal(false)}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button 
                className="submit-btn delete" 
                onClick={confirmDelete}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Deleting...' : 'Delete Service'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Service Modal */}
      {showEditModal && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content modal-large" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Edit Service</h2>
              <button className="close-btn" onClick={() => setShowEditModal(false)}>
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleEditSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Service Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={editFormData.title}
                    onChange={handleEditChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Description *</label>
                  <textarea
                    name="description"
                    value={editFormData.description}
                    onChange={handleEditChange}
                    rows="4"
                    required
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Price (₱)</label>
                    <input
                      type="number"
                      name="price"
                      value={editFormData.price}
                      onChange={handleEditChange}
                      min="0"
                    />
                  </div>
                  <div className="form-group">
                    <label>Price Type</label>
                    <select
                      name="price_type"
                      value={editFormData.price_type}
                      onChange={handleEditChange}
                    >
                      <option value="Fixed">Fixed</option>
                      <option value="Hourly">Hourly</option>
                      <option value="Negotiable">Negotiable</option>
                      <option value="Free">Free</option>
                    </select>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>City</label>
                    <input
                      type="text"
                      name="city"
                      value={editFormData.city}
                      onChange={handleEditChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Location</label>
                    <input
                      type="text"
                      name="location"
                      value={editFormData.location}
                      onChange={handleEditChange}
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Duration (minutes)</label>
                    <input
                      type="number"
                      name="duration_minutes"
                      value={editFormData.duration_minutes}
                      onChange={handleEditChange}
                      min="15"
                    />
                  </div>
                  <div className="form-group checkbox-group">
                    <label>
                      <input
                        type="checkbox"
                        name="is_remote"
                        checked={editFormData.is_remote}
                        onChange={handleEditChange}
                      />
                      Available remotely
                    </label>
                  </div>
                </div>
                <div className="form-group checkbox-group">
                  <label>
                    <input
                      type="checkbox"
                      name="is_available"
                      checked={editFormData.is_available}
                      onChange={handleEditChange}
                    />
                    Available for bookings
                  </label>
                </div>
              </div>
              <div className="modal-actions">
                <button 
                  type="button" 
                  className="cancel-btn" 
                  onClick={() => setShowEditModal(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button type="submit" className="submit-btn" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="modal-overlay" onClick={() => setShowLogoutModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Confirm Logout</h2>
              <button className="close-btn" onClick={() => setShowLogoutModal(false)}>
                <X size={24} />
              </button>
            </div>
            <div className="modal-body">
              <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                <LogOut size={48} style={{ color: '#6b7280' }} />
              </div>
              <p style={{ textAlign: 'center' }}>Are you sure you want to logout?</p>
              <p style={{ color: '#6b7280', fontSize: '0.875rem', textAlign: 'center', marginTop: '0.5rem' }}>
                You will be redirected to the login page.
              </p>
            </div>
            <div className="modal-actions">
              <button 
                className="cancel-btn" 
                onClick={() => setShowLogoutModal(false)}
              >
                Cancel
              </button>
              <button 
                className="submit-btn logout" 
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
