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
  X,
  UserCheck,
  LogOut
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Admin.css';

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [deletingUser, setDeletingUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
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
    is_active: true,
    is_admin: false
  });
  const [formErrors, setFormErrors] = useState({});
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const limit = 10;

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      if (!user.is_admin) {
        setError('Access denied. Admin privileges required.');
        return;
      }
      setCurrentUser(user);
    } else {
      setError('Please log in to access this page.');
      return;
    }
    fetchUsers();
  }, [currentPage, searchTerm]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams({
        page: currentPage,
        limit: limit,
        search: searchTerm
      });
      
      const response = await axios.get(`/api/users?${params}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setUsers(response.data.data);
        setTotalPages(response.data.pagination?.pages || 1);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingUser(null);
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
      is_active: true,
      is_admin: false
    });
    setFormErrors({});
    setShowModal(true);
  };

  const openEditModal = (user) => {
    setEditingUser(user);
    setFormData({
      email: user.email,
      password: '',
      first_name: user.first_name,
      last_name: user.last_name,
      location: user.location || '',
      city: user.city || '',
      state: user.state || '',
      country: user.country || '',
      phone: user.phone || '',
      bio: user.bio || '',
      is_active: user.is_active,
      is_admin: user.is_admin || false
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
    if (!editingUser && !formData.password) errors.password = 'Password is required for new users';
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

      if (editingUser) {
        await axios.put(`/api/users/${editingUser.id}`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post('/api/users', payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      setShowModal(false);
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed');
    }
  };

  const openDeleteModal = (user) => {
    setDeletingUser(user);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!deletingUser) return;
    setIsDeleting(true);
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/users/${deletingUser.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowDeleteModal(false);
      setDeletingUser(null);
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete user');
      setShowDeleteModal(false);
      setDeletingUser(null);
    } finally {
      setIsDeleting(false);
    }
  };

  const getUserStatus = (user) => {
    if (!user.is_active) return { label: 'Inactive', class: 'inactive' };
    return { label: 'Active', class: 'active' };
  };

  if (loading && users.length === 0) {
    return <div className="admin-loading">Loading...</div>;
  }

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div className="admin-title-section">
          <Shield size={32} />
          <div>
            <h1>Users Management</h1>
            <p>Manage all users and administrators</p>
            {currentUser && (
              <p className="admin-user-greeting">Admin: {currentUser.first_name} {currentUser.last_name}</p>
            )}
          </div>
        </div>
        <div className="admin-header-actions">
          <button className="add-admin-btn" onClick={openCreateModal}>
            <Plus size={20} />
            Add User
          </button>
          <button className="logout-btn" onClick={handleLogout}>
            <LogOut size={20} />
            Logout
          </button>
        </div>
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
            placeholder="Search users by name or email..."
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
              <th>Position</th>
              <th>Status</th>
              <th>Verified</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => {
              const status = getUserStatus(user);
              return (
                <tr key={user.id}>
                  <td>
                    <div className="admin-user">
                      <div className="admin-avatar">
                        <User size={20} />
                      </div>
                      <div>
                        <div className="admin-name">{`${user.first_name} ${user.last_name}`}</div>
                        <div className="admin-id">ID: {user.id}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="admin-email">
                      <Mail size={14} />
                      {user.email}
                    </div>
                  </td>
                  <td>
                    <span className={`position-badge ${user.is_admin ? 'admin' : 'user'}`}>
                      <UserCheck size={14} />
                      {user.is_admin ? 'Admin' : 'User'}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge ${status.class}`}>
                      <CheckCircle size={12} />
                      {status.label}
                    </span>
                  </td>
                  <td>
                    {user.is_verified ? (
                      <span className="verified-badge"><CheckCircle size={14} /> Verified</span>
                    ) : (
                      <span className="unverified-badge">Unverified</span>
                    )}
                  </td>
                  <td>
                    <div className="admin-date">
                      <Calendar size={14} />
                      {new Date(user.created_at).toLocaleDateString()}
                    </div>
                  </td>
                  <td>
                    <div className="admin-actions">
                      <button 
                        className="action-btn edit"
                        onClick={() => openEditModal(user)}
                        title="Edit user"
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        className="action-btn delete"
                        onClick={() => openDeleteModal(user)}
                        title="Delete user permanently"
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

        {users.length === 0 && (
          <div className="empty-state">
            <Shield size={48} />
            <h3>No users found</h3>
            <p>Add your first user to get started</p>
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
              <h2>{editingUser ? 'Edit User' : 'Add New User'}</h2>
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
                <label>{editingUser ? 'New Password (optional)' : 'Password *'}</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder={editingUser ? 'Leave blank to keep current' : ''}
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
              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    name="is_admin"
                    checked={formData.is_admin}
                    onChange={handleInputChange}
                  />
                  Admin User
                </label>
              </div>
              {editingUser && (
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
                  {editingUser ? 'Update User' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Confirm Delete User</h2>
              <button className="close-btn" onClick={() => setShowDeleteModal(false)}>
                <X size={24} />
              </button>
            </div>
            <div className="modal-body">
              <div className="delete-warning-icon">
                <AlertCircle size={48} />
              </div>
              <p className="delete-warning-title">Are you sure you want to permanently delete this user?</p>
              <div className="delete-user-info">
                <strong>{deletingUser?.first_name} {deletingUser?.last_name}</strong>
                <span>{deletingUser?.email}</span>
              </div>
              <p className="delete-warning-text">
                This action cannot be undone. The user will be permanently removed from the system and will no longer be able to log in.
              </p>
            </div>
            <div className="modal-actions">
              <button 
                className="cancel-btn" 
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button 
                className="submit-btn delete" 
                onClick={confirmDelete}
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete User'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
