import React, { useState } from 'react';
import { stripHtml } from '../utils/htmlHelpers';
import './styles/JobDetailsModal.css';

const JobDetailsModal = ({ job, isOpen, onClose, onBookmark, onApply, isBookmarked, isApplied }) => {
  const [notes, setNotes] = useState('');
  const [showNotesInput, setShowNotesInput] = useState(false);

  if (!isOpen || !job) return null;

  const handleBookmark = () => {
    onBookmark(job);
  };

  const handleApply = () => {
    onApply(job, notes);
    setNotes('');
    setShowNotesInput(false);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>

        <div className="modal-header">
          <div>
            <h1 className="modal-title">{job.title}</h1>
            <p className="modal-company">{job.company}</p>
          </div>
          <button
            className={`bookmark-btn-large ${isBookmarked ? 'bookmarked' : ''}`}
            onClick={handleBookmark}
          >
            ★
          </button>
        </div>

        <div className="modal-meta">
          <div className="meta-item">
            <span className="meta-label">Location:</span>
            <span className="meta-value">{job.location}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">Source:</span>
            <span className="meta-value">{job.source}</span>
          </div>
          {job.salary && job.salary !== 'Not specified' && (
            <div className="meta-item">
              <span className="meta-label">Salary:</span>
              <span className="meta-value">{job.salary}</span>
            </div>
          )}
        </div>

        {job.description && (
          <div className="modal-section">
            <h2>Description</h2>
            <p>{stripHtml(job.description)}</p>
          </div>
        )}

        {job.skills && job.skills.length > 0 && (
          <div className="modal-section">
            <h2>Required Skills</h2>
            <div className="skills-grid">
              {job.skills.map((skill, idx) => (
                <span key={idx} className="skill-badge">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {job.tags && job.tags.length > 0 && (
          <div className="modal-section">
            <h2>Tags</h2>
            <div className="tags-grid">
              {job.tags.map((tag, idx) => (
                <span key={idx} className="tag-badge">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="modal-notes-section">
          <button
            className="btn-toggle-notes"
            onClick={() => setShowNotesInput(!showNotesInput)}
          >
            {showNotesInput ? 'Hide Notes' : 'Add Notes'}
          </button>
          {showNotesInput && (
            <textarea
              className="notes-input"
              placeholder="Add your notes about this job..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows="4"
            />
          )}
        </div>

        <div className="modal-actions">
          <button className="btn-cancel" onClick={onClose}>
            Close
          </button>
          <a
            href={job.apply_url}
            target="_blank"
            rel="noreferrer"
            className="btn-apply-external"
          >
            Open Job Page
          </a>
          {!isApplied && (
            <button className="btn-apply-modal" onClick={handleApply}>
              Mark as Applied
            </button>
          )}
          {isApplied && (
            <button className="btn-applied" disabled>
              ✓ Applied
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobDetailsModal;
