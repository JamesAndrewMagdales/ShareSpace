import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Search as SearchIcon, 
  Filter, 
  Star, 
  MapPin, 
  ChevronDown, 
  Grid, 
  List,
  ArrowUpDown
} from 'lucide-react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import './Search.css';

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [minRating, setMinRating] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
  const [viewMode, setViewMode] = useState('grid');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const categoriesList = [
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
  ];

  // Mock services data
  const mockServices = [
    {
      id: 1,
      title: 'Custom Website Development',
      description: 'Professional web development services for small businesses',
      price: 2500,
      price_type: 'Fixed',
      city: 'Manila',
      is_remote: true,
      provider_name: 'John Doe',
      provider_rating: 4.9,
      provider_verified: true,
      category_name: 'Tech & IT',
      image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400'
    },
    {
      id: 2,
      title: 'Professional House Cleaning',
      description: 'Thorough cleaning service for homes and apartments',
      price: 800,
      price_type: 'Fixed',
      city: 'Quezon City',
      is_remote: false,
      provider_name: 'Maria Santos',
      provider_rating: 4.8,
      provider_verified: true,
      category_name: 'Cleaning & Laundry',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400'
    },
    {
      id: 3,
      title: 'Beginner Guitar Lessons',
      description: 'Learn guitar from scratch with personalized lessons',
      price: 500,
      price_type: 'Hourly',
      city: 'Makati',
      is_remote: true,
      provider_name: 'Carlos Reyes',
      provider_rating: 5.0,
      provider_verified: true,
      category_name: 'Teaching & Tutoring',
      image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=400'
    },
    {
      id: 4,
      title: 'Portrait Photography Session',
      description: 'Professional portrait photography for individuals and families',
      price: 3500,
      price_type: 'Fixed',
      city: 'Pasig',
      is_remote: false,
      provider_name: 'Ana Garcia',
      provider_rating: 4.9,
      provider_verified: true,
      category_name: 'Events & Photography',
      image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400'
    },
    {
      id: 5,
      title: 'Car Detailing Service',
      description: 'Complete car cleaning and polishing service',
      price: 1500,
      price_type: 'Fixed',
      city: 'Taguig',
      is_remote: false,
      provider_name: 'Mike Torres',
      provider_rating: 4.7,
      provider_verified: false,
      category_name: 'Automotive',
      image: 'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?w=400'
    },
    {
      id: 6,
      title: 'Yoga Instruction',
      description: 'Private yoga sessions for all skill levels',
      price: 600,
      price_type: 'Hourly',
      city: 'Manila',
      is_remote: true,
      provider_name: 'Sarah Kim',
      provider_rating: 4.9,
      provider_verified: true,
      category_name: 'Health & Wellness',
      image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400'
    }
  ];

  useEffect(() => {
    const fetchServices = async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams();
        if (searchQuery) params.set('search', searchQuery);
        if (location) params.set('city', location);
        if (selectedCategory) params.set('category', selectedCategory);
        if (priceRange.min) params.set('minPrice', priceRange.min);
        if (priceRange.max) params.set('maxPrice', priceRange.max);
        if (minRating) params.set('minRating', minRating);
        params.set('page', page);
        params.set('limit', 12);
        params.set('sortBy', sortBy);

        const response = await axios.get(`/api/services?${params.toString()}`);
        
        if (response.data.success) {
          setServices(response.data.data.services || []);
          setTotalPages(response.data.data.pagination?.totalPages || 1);
        }
      } catch (err) {
        console.error('Error fetching services:', err);
        // Fallback to mock data if API fails
        setServices(mockServices);
        setTotalPages(3);
      } finally {
        setIsLoading(false);
      }
    };

    fetchServices();
  }, [searchParams, searchQuery, location, selectedCategory, priceRange, minRating, sortBy, page]);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (location) params.set('location', location);
    if (selectedCategory) params.set('category', selectedCategory);
    setSearchParams(params);
    setPage(1);
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId === selectedCategory ? '' : categoryId);
    const params = new URLSearchParams(searchParams);
    if (categoryId) {
      params.set('category', categoryId);
    } else {
      params.delete('category');
    }
    setSearchParams(params);
    setPage(1);
  };

  const formatPrice = (price, type) => {
    return `₱${price.toLocaleString()}${type === 'Hourly' ? '/hr' : ''}`;
  };

  return (
    <div className="search-page">
      {/* Search Header */}
      <div className="search-header">
        <form className="search-bar" onSubmit={handleSearch}>
          <div className="search-input-group">
            <SearchIcon size={20} />
            <input
              type="text"
              placeholder="What service are you looking for?"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="location-input-group">
            <MapPin size={20} />
            <input
              type="text"
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
          <button type="submit" className="search-submit-btn">
            <SearchIcon size={20} />
            Search
          </button>
        </form>
      </div>

       <div className="search-content">
         <Sidebar 
           categories={categoriesList} 
           selectedCategory={selectedCategory}
           onCategoryChange={(categoryName) => {
             const params = new URLSearchParams(searchParams);
             if (categoryName) {
               params.set('category', categoryName);
             } else {
               params.delete('category');
             }
             setSearchParams(params);
             setPage(1);
           }}
         />



        {/* Results Section */}
        <main className="results-section">
          <div className="results-header">
            <div className="results-count">
              <span>{services.length} services found</span>
            </div>
            <div className="results-controls">
              <div className="sort-dropdown">
                <ArrowUpDown size={16} />
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                  <option value="created_at">Newest</option>
                  <option value="price">Price: Low to High</option>
                  <option value="title">Name A-Z</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>
              <div className="view-toggle">
                <button
                  className={viewMode === 'grid' ? 'active' : ''}
                  onClick={() => setViewMode('grid')}
                >
                  <Grid size={18} />
                </button>
                <button
                  className={viewMode === 'list' ? 'active' : ''}
                  onClick={() => setViewMode('list')}
                >
                  <List size={18} />
                </button>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading services...</p>
            </div>
          ) : services.length === 0 ? (
            <div className="empty-state">
              <SearchIcon size={48} />
              <h3>No services found</h3>
              <p>Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className={`services-grid ${viewMode}`}>
              {services.map((service) => (
                <div key={service.id} className="service-card">
                  <div className="service-image">
                    <img src={service.image} alt={service.title} />
                    <span className="service-price">{formatPrice(service.price, service.price_type)}</span>
                    {service.is_remote && <span className="remote-badge">Remote</span>}
                  </div>
                  <div className="service-content">
                    <span className="service-category">{service.category_name}</span>
                    <h3>{service.title}</h3>
                    <p className="service-description">{service.description}</p>
                    <div className="service-provider">
                      <span className="provider-name">{service.provider_name}</span>
                      {service.provider_verified && <span className="verified-badge">✓</span>}
                      <span className="provider-rating">
                        <Star size={14} fill="#fbbf24" color="#fbbf24" />
                        {service.provider_rating}
                      </span>
                    </div>
                    <div className="service-location">
                      <MapPin size={14} />
                      {service.city}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="pagination-btn"
              >
                Previous
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  className={`pagination-btn ${page === i + 1 ? 'active' : ''}`}
                  onClick={() => setPage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
              <button
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
                className="pagination-btn"
              >
                Next
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Search;