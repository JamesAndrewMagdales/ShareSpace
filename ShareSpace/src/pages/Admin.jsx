import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  User, 
  Mail, 
  Calendar,
  AlertCircle,
  CheckCircle,
  X
} from 'lucide-react';
import axios from 'axios';
import './Admin.css';

const Admin = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    location: '',
    city: '',
    state: '',
    country: '',
    phone: '',
    bio: '',
    is_active: true
  });
  const [formErrors, setFormErrors] = useState({});

  const limit = 10;

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      if (!user.is_admin) {
        setError('Access denied. Admin privileges required.');
        return;
      }
    } else {
      setError('Please log in to access this page.');
      return;
    }
    fetchAdmins();
  }, [currentPage, searchTerm]);

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams({
        page: currentPage,
        limit: limit,
        search: searchTerm
      });
      
      const response = await axios.get(`/api/admins?${params}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setAdmins(response.data.data.admins);
        setTotalPages(response.data.data.pagination.totalPages);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load admins');
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingAdmin(null);
    setFormData({
      email: '',
      password: '',
      first_name: '',
      last_name: '',
      location: '',
      city: '',
      state: '',
      country: '',
      phone: '',
      bio: '',
      is_active: true
    });
    setFormErrors({});
    setShowModal(true);
  };

  const openEditModal = (admin) => {
    setEditingAdmin(admin);
    setFormData({
      email: admin.email,
      password: '',
      first_name: admin.first_name,
      last_name: admin.last_name,
      location: admin.location || '',
      city: admin.city || '',
      state: admin.state || '',
      country: admin.country || '',
      phone: admin.phone || '',
      bio: admin.bio || '',
      is_active: admin.is_active
    });
    setFormErrors({});
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.email) errors.email = 'Email is required';
    if (!formData.first_name) errors.first_name = 'First name is required';
    if (!formData.last_name) errors.last_name = 'Last name is required';
    if (!editingAdmin && !formData.password) errors.password = 'Password is required for new admins';
    if (formData.password && formData.password.length < 6) errors.password = 'Password must be at least 6 characters';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const token = localStorage.getItem('token');
      const payload = { ...formData };
      if (!payload.password) delete payload.password;

      if (editingAdmin) {
        await axios.put(`/api/admins/${editingAdmin.id}`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post('/api/admins', payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      setShowModal(false);
      fetchAdmins();
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to deactivate this admin?')) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/admins/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchAdmins();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to deactivate admin');
    }
  };

  const getAdminStatus = (admin) => {
    if (!admin.is_active) return { label: 'Inactive', class: 'inactive' };
    return { label: 'Active', class: 'active' };
  };

  if (loading && admins.length === 0) {
    return <div className="admin-loading">Loading...</div>;
  }

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div className="admin-title-section">
          <Shield size={32} />
          <div>
            <h1>Admin Management</h1>
            <p>Manage administrator accounts and permissions</p>
          </div>
        </div>
        <button className="add-admin-btn" onClick={openCreateModal}>
          <Plus size={20} />
          Add Admin
        </button>
      </div>

      {error && (
        <div className="admin-error">
          <AlertCircle size={20} />
          {error}
          <button onClick={() => setError(null)}><X size={20} /></button>
        </div>
      )}

      <div className="admin-controls">
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search admins by name or email..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Status</th>
              <th>Verified</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {admins.map((admin) => {
              const status = getAdminStatus(admin);
              return (
                <tr key={admin.id}>
                  <td>
                    <div className="admin-user">
                      <div className="admin-avatar">
                        <User size={20} />
                      </div>
                      <div>
                        <div className="admin-name">{`${admin.first_name} ${admin.last_name}`}</div>
                        <div className="admin-id">ID: {admin.id}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="admin-email">
                      <Mail size={14} />
                      {admin.email}
                    </div>
                  </td>
                  <td>
                    <span className={`status-badge ${status.class}`}>
                      <CheckCircle size={12} />
                      {status.label}
                    </span>
                  </td>
                  <td>
                    {admin.is_verified ? (
                      <span className="verified-badge"><CheckCircle size={14} /> Verified</span>
                    ) : (
                      <span className="unverified-badge">Unverified</span>
                    )}
                  </td>
                  <td>
                    <div className="admin-date">
                      <Calendar size={14} />
                      {new Date(admin.created_at).toLocaleDateString()}
                    </div>
                  </td>
                  <td>
                    <div className="admin-actions">
                      <button 
                        className="action-btn edit"
                        onClick={() => openEditModal(admin)}
                        title="Edit admin"
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        className="action-btn delete"
                        onClick={() => handleDelete(admin.id)}
                        title="Deactivate admin"
                        disabled={!admin.is_active}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {admins.length === 0 && (
          <div className="empty-state">
            <Shield size={48} />
            <h3>No admin users found</h3>
            <p>Add your first administrator to get started</p>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="admin-pagination">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => p - 1)}
          >
            Previous
          </button>
          <span>Page {currentPage} of {totalPages}</span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(p => p + 1)}
          >
            Next
          </button>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingAdmin ? 'Edit Admin' : 'Add New Admin'}</h2>
              <button className="close-btn" onClick={() => setShowModal(false)}>
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>First Name *</label>
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleInputChange}
                    className={formErrors.first_name ? 'error' : ''}
                  />
                  {formErrors.first_name && <span className="error-text">{formErrors.first_name}</span>}
                </div>
                <div className="form-group">
                  <label>Last Name *</label>
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleInputChange}
                    className={formErrors.last_name ? 'error' : ''}
                  />
                  {formErrors.last_name && <span className="error-text">{formErrors.last_name}</span>}
                </div>
              </div>
              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={formErrors.email ? 'error' : ''}
                />
                {formErrors.email && <span className="error-text">{formErrors.email}</span>}
              </div>
              <div className="form-group">
                <label>{editingAdmin ? 'New Password (optional)' : 'Password *'}</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder={editingAdmin ? 'Leave blank to keep current' : ''}
                  className={formErrors.password ? 'error' : ''}
                />
                {formErrors.password && <span className="error-text">{formErrors.password}</span>}
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Phone</label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label>Location</label>
                  <input type="text" name="location" value={formData.location} onChange={handleInputChange} />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>City</label>
                  <input type="text" name="city" value={formData.city} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label>State</label>
                  <input type="text" name="state" value={formData.state} onChange={handleInputChange} />
                </div>
              </div>
              <div className="form-group">
                <label>Country</label>
                <input type="text" name="country" value={formData.country} onChange={handleInputChange} />
              </div>
              <div className="form-group">
                <label>Bio</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  rows="3"
                />
              </div>
              {editingAdmin && (
                <div className="form-group checkbox-group">
                  <label>
                    <input
                      type="checkbox"
                      name="is_active"
                      checked={formData.is_active}
                      onChange={handleInputChange}
                    />
                    Active
                  </label>
                </div>
              )}
              <div className="modal-actions">
                <button type="button" className="cancel-btn" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  {editingAdmin ? 'Update Admin' : 'Create Admin'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
