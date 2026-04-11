import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
  Shield
} from 'lucide-react';
import './Dashboard.css';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [services, setServices] = useState([]);
  const [requests, setRequests] = useState([]);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    
    // Mock data
    setServices([
      { id: 1, title: 'Web Development', status: 'Active', views: 124, requests: 5 },
      { id: 2, title: 'Graphic Design', status: 'Active', views: 89, requests: 3 },
    ]);

    setRequests([
      { id: 1, service: 'Web Development', client: 'Sarah Johnson', date: '2024-01-15', status: 'Pending' },
      { id: 2, service: 'Graphic Design', client: 'Mike Chen', date: '2024-01-14', status: 'Accepted' },
      { id: 3, service: 'Web Development', client: 'Emma Wilson', date: '2024-01-10', status: 'Completed' },
    ]);

    setReviews([
      { id: 1, rating: 5, comment: 'Excellent work! Very professional.', author: 'Sarah J.', date: '2024-01-12' },
      { id: 2, rating: 4, comment: 'Great service, would recommend.', author: 'Mike C.', date: '2024-01-08' },
    ]);
  }, []);

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

              <div className="services-table">
                <table>
                  <thead>
                    <tr>
                      <th>Service</th>
                      <th>Status</th>
                      <th>Views</th>
                      <th>Requests</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {services.map((service) => (
                      <tr key={service.id}>
                        <td>{service.title}</td>
                        <td>
                          <span className={`status-badge ${getStatusColor(service.status)}`}>
                            {service.status}
                          </span>
                        </td>
                        <td>{service.views}</td>
                        <td>{service.requests}</td>
                        <td>
                          <button className="action-btn">Edit</button>
                          <button className="action-btn delete">Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
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
    </div>
  );
};

export default Dashboard;