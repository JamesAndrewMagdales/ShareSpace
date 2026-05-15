import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = ({ categories, selectedCategory }) => {
  return (
    <aside className="sidebar">
      <h2>Categories</h2>
      <ul className="category-list">
        {categories.map(category => (
          <li key={category.id}>
            <Link
              to={`/search?category=${encodeURIComponent(category.name)}`}
              className={selectedCategory === category.name ? 'active' : ''}
            >
              {category.name}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;