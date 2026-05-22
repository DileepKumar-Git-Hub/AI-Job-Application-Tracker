import React from 'react';
import { truncateText } from '../utils/htmlHelpers';
import './styles/JobCard.css';

const JobCard = ({ job, onBookmark, onApply, onViewDetails, isBookmarked, isApplied }) => {
  const handleBookmarkClick = (e) => {
    e.preventDefault();
    onBookmark(job);
  };

  const handleApplyClick = (e) => {
    e.preventDefault();
    onApply(job);
  };

  const handleViewDetails = (e) => {
    e.preventDefault();
    onViewDetails(job);
  };

  return (
    <div className="job-card">
      <div className="job-card-header">
        <div className="job-card-title-section">
          <h3 className="job-title">{job.title}</h3>
          <p className="job-company">{job.company}</p>
        </div>
        <button
          className={`bookmark-btn ${isBookmarked ? 'bookmarked' : ''}`}
          onClick={handleBookmarkClick}
          title={isBookmarked ? 'Remove bookmark' : 'Bookmark this job'}
        >
          ★
        </button>
      </div>

      <div className="job-card-meta">
        <span className="job-location">📍 {job.location}</span>
        <span className="job-source">{job.source}</span>
        {job.salary && job.salary !== 'Not specified' && (
          <span className="job-salary">💰 {job.salary}</span>
        )}
      </div>

      {job.description && (
        <p className="job-description">{truncateText(job.description, 120)}</p>
      )}

      <div className="job-skills">
        {job.skills && job.skills.length > 0 && (
          <>
            <p className="skills-label">Required Skills:</p>
            <div className="skills-tags">
              {job.skills.slice(0, 4).map((skill, idx) => (
                <span key={idx} className="skill-tag">
                  {skill}
                </span>
              ))}
              {job.skills.length > 4 && (
                <span className="skill-tag more-skills">+{job.skills.length - 4}</span>
              )}
            </div>
          </>
        )}
      </div>

      <div className="job-card-actions">
        <button
          className="btn btn-primary-small"
          onClick={handleViewDetails}
        >
          View Details
        </button>
        <button
          className="btn btn-success-small"
          onClick={handleApplyClick}
        >
          {isApplied ? '✓ Applied' : 'Mark as Applied'}
        </button>
      </div>
    </div>
  );
};

export default JobCard;
