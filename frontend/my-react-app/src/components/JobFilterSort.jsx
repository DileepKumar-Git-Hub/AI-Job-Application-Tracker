import React, { useState } from 'react';
import './styles/JobFilterSort.css';

const JobFilterSort = ({
  onFilterChange,
  onSortChange,
  isLoading,
  totalJobs,
  currentFilters
}) => {
  const [showFilters, setShowFilters] = useState(true);
  const [filters, setFilters] = useState({
    q: currentFilters?.q || '',
    location: currentFilters?.location || '',
    source: currentFilters?.source || '',
    skills: currentFilters?.skills || '',
    only_bookmarked: currentFilters?.only_bookmarked || false,
    only_applied: currentFilters?.only_applied || false,
  });

  const [sort, setSort] = useState({
    sort_by: currentFilters?.sort_by || 'recent',
    sort_order: currentFilters?.sort_order || 'desc',
  });

  const sources = ['RemoteOK', 'ArbeitNow'];
  const sortOptions = [
    { value: 'recent', label: 'Most Recent' },
    { value: 'title', label: 'Job Title (A-Z)' },
    { value: 'company', label: 'Company (A-Z)' },
    { value: 'salary', label: 'Salary' },
  ];

  const handleFilterChange = (field, value) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleSortChange = (field, value) => {
    const newSort = { ...sort, [field]: value };
    setSort(newSort);
    onSortChange(newSort);
  };

  const handleClearFilters = () => {
    const cleared = {
      q: '',
      location: '',
      source: '',
      skills: '',
      only_bookmarked: false,
      only_applied: false,
    };
    setFilters(cleared);
    onFilterChange(cleared);
  };

  return (
    <div className="filter-sort-container">
      <div className="filter-sort-header">
        <button
          className="filter-toggle-btn"
          onClick={() => setShowFilters(!showFilters)}
        >
          {showFilters ? '▼' : '▶'} Filters & Sort
        </button>
        <span className="jobs-count">{totalJobs} Jobs Found</span>
      </div>

      {showFilters && (
        <div className="filter-sort-content">
          <div className="filter-section">
            <h3>Search</h3>
            <input
              type="text"
              placeholder="Search by title, company, or skills..."
              value={filters.q}
              onChange={(e) => handleFilterChange('q', e.target.value)}
              className="filter-input"
            />
          </div>

          <div className="filter-row">
            <div className="filter-section">
              <h3>Location</h3>
              <input
                type="text"
                placeholder="e.g., Remote, USA, UK..."
                value={filters.location}
                onChange={(e) => handleFilterChange('location', e.target.value)}
                className="filter-input"
              />
            </div>

            <div className="filter-section">
              <h3>Skills Required</h3>
              <input
                type="text"
                placeholder="e.g., React, Python, Node.js"
                value={filters.skills}
                onChange={(e) => handleFilterChange('skills', e.target.value)}
                className="filter-input"
              />
            </div>
          </div>

          <div className="filter-row">
            <div className="filter-section">
              <h3>Source</h3>
              <select
                value={filters.source}
                onChange={(e) => handleFilterChange('source', e.target.value)}
                className="filter-select"
              >
                <option value="">All Sources</option>
                {sources.map((src) => (
                  <option key={src} value={src}>
                    {src}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-section">
              <h3>Sort By</h3>
              <select
                value={sort.sort_by}
                onChange={(e) => handleSortChange('sort_by', e.target.value)}
                className="filter-select"
              >
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-section">
              <h3>Order</h3>
              <select
                value={sort.sort_order}
                onChange={(e) => handleSortChange('sort_order', e.target.value)}
                className="filter-select"
              >
                <option value="desc">Descending</option>
                <option value="asc">Ascending</option>
              </select>
            </div>
          </div>

          <div className="filter-checkboxes">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={filters.only_bookmarked}
                onChange={(e) => handleFilterChange('only_bookmarked', e.target.checked)}
              />
              Bookmarked Only
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={filters.only_applied}
                onChange={(e) => handleFilterChange('only_applied', e.target.checked)}
              />
              Applied Only
            </label>
          </div>

          <button
            className="clear-filters-btn"
            onClick={handleClearFilters}
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default JobFilterSort;
