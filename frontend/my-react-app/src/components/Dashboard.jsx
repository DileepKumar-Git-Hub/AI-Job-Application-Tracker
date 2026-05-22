import React, { useEffect, useState } from 'react';
import './styles/Dashboard.css';

const Dashboard = () => {
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [bookmarkedJobs, setBookmarkedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('applied');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchUserJobs();
  }, []);

  const fetchUserJobs = async () => {
    try {
      setLoading(true);
      const [appliedRes, bookmarkedRes] = await Promise.all([
        fetch('http://127.0.0.1:8000/api/v1/jobs/user/applied/', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          },
        }),
        fetch('http://127.0.0.1:8000/api/v1/jobs/user/bookmarked/', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          },
        }),
      ]);

      if (appliedRes.ok) {
        const appliedData = await appliedRes.json();
        setAppliedJobs(appliedData.jobs || []);
      }

      if (bookmarkedRes.ok) {
        const bookmarkedData = await bookmarkedRes.json();
        setBookmarkedJobs(bookmarkedData.jobs || []);
      }
    } catch (err) {
      console.error('Error fetching jobs:', err);
      setError('Failed to fetch your jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (jobId, newStatus) => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/v1/jobs/update-status/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
        body: JSON.stringify({
          job_id: jobId,
          status: newStatus,
        }),
      });

      if (response.ok) {
        setAppliedJobs(
          appliedJobs.map((job) =>
            job.id === jobId ? { ...job, status: newStatus } : job
          )
        );
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const getFilteredJobs = () => {
    let jobs = activeTab === 'applied' ? appliedJobs : bookmarkedJobs;

    jobs = jobs.filter((job) => {
      const matchesSearch =
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase());

      if (activeTab === 'applied' && filterStatus !== 'all') {
        return matchesSearch && job.status === filterStatus;
      }

      return matchesSearch;
    });

    return jobs;
  };

  const filteredJobs = getFilteredJobs();
  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);
  const paginatedJobs = filteredJobs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getStatusColor = (status) => {
    const colors = {
      applied: '#3b82f6',
      interview: '#f59e0b',
      offer: '#10b981',
      rejected: '#ef4444',
    };
    return colors[status] || '#3b82f6';
  };

  const getStatusIcon = (status) => {
    const icons = {
      applied: '📝',
      interview: '💬',
      offer: '🎉',
      rejected: '❌',
    };
    return icons[status] || '📋';
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading-message">Loading your jobs...</div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>My Job Applications</h1>
        <p>Track your job applications and bookmarks</p>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-value">{appliedJobs.length}</div>
          <div className="stat-label">Applied</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{bookmarkedJobs.length}</div>
          <div className="stat-label">Bookmarked</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">
            {appliedJobs.filter((j) => j.status === 'interview').length}
          </div>
          <div className="stat-label">Interviews</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">
            {appliedJobs.filter((j) => j.status === 'offer').length}
          </div>
          <div className="stat-label">Offers</div>
        </div>
      </div>

      <div className="tabs">
        <button
          className={`tab ${activeTab === 'applied' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('applied');
            setCurrentPage(1);
          }}
        >
          Applied Jobs ({appliedJobs.length})
        </button>
        <button
          className={`tab ${activeTab === 'bookmarked' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('bookmarked');
            setCurrentPage(1);
          }}
        >
          Bookmarked Jobs ({bookmarkedJobs.length})
        </button>
      </div>

      <div className="dashboard-filters">
        <input
          type="text"
          placeholder={`Search ${activeTab === 'applied' ? 'applied' : 'bookmarked'} jobs...`}
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="search-input"
        />

        {activeTab === 'applied' && (
          <select
            value={filterStatus}
            onChange={(e) => {
              setFilterStatus(e.target.value);
              setCurrentPage(1);
            }}
            className="filter-select"
          >
            <option value="all">All Status</option>
            <option value="applied">Applied</option>
            <option value="interview">Interview</option>
            <option value="offer">Offer</option>
            <option value="rejected">Rejected</option>
          </select>
        )}
      </div>

      {error && <div className="error-message">{error}</div>}

      {paginatedJobs.length === 0 ? (
        <div className="no-jobs-message">
          <p>No {activeTab === 'applied' ? 'applied' : 'bookmarked'} jobs found.</p>
          {searchTerm && <p>Try clearing your search filter.</p>}
        </div>
      ) : (
        <>
          <div className="jobs-table-wrapper">
            <table className="jobs-table">
              <thead>
                <tr>
                  <th>Status</th>
                  <th>Job Title</th>
                  <th>Company</th>
                  <th>Location</th>
                  <th>Skills</th>
                  {activeTab === 'applied' && <th>Actions</th>}
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                {paginatedJobs.map((job) => (
                  <tr key={job.id}>
                    {activeTab === 'applied' && (
                      <td>
                        <select
                          value={job.status}
                          onChange={(e) => handleStatusChange(job.id, e.target.value)}
                          className="status-select"
                          style={{ borderColor: getStatusColor(job.status) }}
                        >
                          <option value="applied">Applied</option>
                          <option value="interview">Interview</option>
                          <option value="offer">Offer</option>
                          <option value="rejected">Rejected</option>
                        </select>
                      </td>
                    )}
                    {activeTab === 'bookmarked' && (
                      <td className="status-badge" style={{ color: '#f59e0b' }}>
                        ⭐ Bookmarked
                      </td>
                    )}
                    <td className="job-title">{job.title}</td>
                    <td>{job.company}</td>
                    <td>{job.location}</td>
                    <td>
                      {job.skills && job.skills.length > 0 ? (
                        <div className="skills-cell">
                          {job.skills.slice(0, 2).map((skill, idx) => (
                            <span key={idx} className="skill-badge-small">
                              {skill}
                            </span>
                          ))}
                          {job.skills.length > 2 && (
                            <span className="skill-badge-small more">
                              +{job.skills.length - 2}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span>—</span>
                      )}
                    </td>
                    <td>
                      <a
                        href={job.apply_url}
                        target="_blank"
                        rel="noreferrer"
                        className="view-link"
                      >
                        View →
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="pagination-btn"
              >
                ← Previous
              </button>
              <span className="pagination-info">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="pagination-btn"
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Dashboard;