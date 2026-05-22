import React, { useEffect, useState, useRef, useCallback } from 'react';
import axiosInstance from '../axiosInstance';
import { fetchJobs } from '../services/jobServices';
import JobCard from './JobCard';
import JobDetailsModal from './JobDetailsModal';
import JobFilterSort from './JobFilterSort';
import './styles/JobsPage.css';

const JobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [allJobs, setAllJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalJobs, setTotalJobs] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [useInfiniteScroll, setUseInfiniteScroll] = useState(true);
  const observerTarget = useRef(null);

  const [filters, setFilters] = useState({
    q: '',
    location: '',
    source: '',
    skills: '',
    only_bookmarked: false,
    only_applied: false,
  });

  const [sort, setSort] = useState({
    sort_by: 'recent',
    sort_order: 'desc',
  });

  const pageSize = 12;

  const loadJobs = useCallback(async (page = 1, append = false) => {
    setLoading(true);
    try {
      const data = await fetchJobs({
        q: filters.q,
        location: filters.location,
        source: filters.source,
        skills: filters.skills,
        only_bookmarked: filters.only_bookmarked ? 'true' : 'false',
        only_applied: filters.only_applied ? 'true' : 'false',
        sort_by: sort.sort_by,
        sort_order: sort.sort_order,
        page,
        page_size: pageSize,
      });

      setTotalJobs(data.total_jobs);
      setTotalPages(data.total_pages);

      if (append && page > 1) {
        setJobs((prev) => [...prev, ...data.jobs]);
      } else {
        setJobs(data.jobs);
      }
      setCurrentPage(page);
    } catch (error) {
      console.error('Error loading jobs:', error);
    } finally {
      setLoading(false);
    }
  }, [filters, sort]);

  useEffect(() => {
    setCurrentPage(1);
    loadJobs(1, false);
  }, [filters, sort, loadJobs]);

  // Infinite scroll observer
  useEffect(() => {
    if (!useInfiniteScroll) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && currentPage < totalPages) {
          loadJobs(currentPage + 1, true);
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [loading, currentPage, totalPages, useInfiniteScroll, loadJobs]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleSortChange = (newSort) => {
    setSort(newSort);
  };

  const handleBookmark = async (job) => {
    try {
      const response = await axiosInstance.post('/jobs/bookmark/', {
        job_id: job.id || job.external_id,
        job_data: job,
      });

      if (response.data.success) {
        const data = response.data;
        setJobs((prevJobs) =>
          prevJobs.map((j) =>
            (j.id || j.external_id) === (job.id || job.external_id)
              ? { ...j, is_bookmarked: data.is_bookmarked }
              : j
          )
        );
        if (selectedJob && (selectedJob.id || selectedJob.external_id) === (job.id || job.external_id)) {
          setSelectedJob({ ...selectedJob, is_bookmarked: data.is_bookmarked });
        }
      } else {
        console.error('Bookmark failed:', response.data.error);
      }
    } catch (error) {
      console.error('Error bookmarking job:', error);
    }
  };

  const handleApply = async (job, notes = '') => {
    try {
      const response = await axiosInstance.post('/jobs/apply/', {
        job_id: job.id || job.external_id,
        job_data: job,
        notes,
      });

      if (response.data.success) {
        setJobs((prevJobs) =>
          prevJobs.map((j) =>
            (j.id || j.external_id) === (job.id || job.external_id)
              ? { ...j, is_applied: true }
              : j
          )
        );
        if (selectedJob && (selectedJob.id || selectedJob.external_id) === (job.id || job.external_id)) {
          setSelectedJob({ ...selectedJob, is_applied: true });
          setModalOpen(false);
        }
      } else {
        console.error('Apply failed:', response.data.error);
      }
    } catch (error) {
      console.error('Error applying to job:', error);
    }
  };

  const handleViewDetails = (job) => {
    setSelectedJob(job);
    setModalOpen(true);
  };

  const loadNextPage = () => {
    if (currentPage < totalPages && !loading) {
      loadJobs(currentPage + 1, true);
    }
  };

  return (
    <div className="jobs-page-container">
      <div className="jobs-page-header">
        <h1>Job Opportunities</h1>
        <p>Explore remote job listings and apply to your dream positions</p>
      </div>

      <JobFilterSort
        onFilterChange={handleFilterChange}
        onSortChange={handleSortChange}
        totalJobs={totalJobs}
        isLoading={loading}
        currentFilters={filters}
      />

      <div className="jobs-grid-container">
        {loading && jobs.length === 0 ? (
          <div className="loading-message">Loading jobs...</div>
        ) : jobs.length === 0 ? (
          <div className="no-jobs-message">
            <p>No jobs found matching your criteria.</p>
            <p>Try adjusting your filters!</p>
          </div>
        ) : (
          <>
            <div className="jobs-grid">
              {jobs.map((job, index) => (
                <JobCard
                  key={`${job.id || job.external_id}-${index}`}
                  job={job}
                  onBookmark={handleBookmark}
                  onApply={handleApply}
                  onViewDetails={handleViewDetails}
                  isBookmarked={job.is_bookmarked || false}
                  isApplied={job.is_applied || false}
                />
              ))}
            </div>

            {useInfiniteScroll ? (
              <div ref={observerTarget} className="infinite-scroll-observer">
                {currentPage < totalPages && <p>Loading more jobs...</p>}
              </div>
            ) : (
              <div className="pagination-container">
                <button
                  className="btn btn-pagination"
                  onClick={() => loadJobs(currentPage - 1)}
                  disabled={currentPage === 1 || loading}
                >
                  Previous
                </button>
                <span className="pagination-info">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  className="btn btn-pagination"
                  onClick={loadNextPage}
                  disabled={currentPage === totalPages || loading}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <JobDetailsModal
        job={selectedJob}
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedJob(null);
        }}
        onBookmark={handleBookmark}
        onApply={handleApply}
        isBookmarked={selectedJob?.is_bookmarked || false}
        isApplied={selectedJob?.is_applied || false}
      />
    </div>
  );
};

export default JobsPage;