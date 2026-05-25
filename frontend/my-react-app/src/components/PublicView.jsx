import React from 'react'
import { Link } from 'react-router-dom'
import ChatBot from './ChatBot'

const PublicView = () => {
  return (
    <div className="container mt-5">
      <section className="hero-section py-5 text-center">
        <h1 className="display-5 fw-bold">AI Job Application Tracker</h1>
        <p className="lead text-muted mt-3">
          Accelerate your job search with intelligent resume parsing, cover letter creation,
          interview prep, ATS scoring, and personalized job matching.
        </p>
        <div className="d-flex justify-content-center gap-3 mt-4 flex-wrap">
          <Link to="/signup" className="btn btn-primary btn-lg">
            Get Started
          </Link>
          <Link to="/login" className="btn btn-outline-secondary btn-lg">
            Sign In
          </Link>
        </div>
      </section>

      <section className="features-grid py-5">
        <div className="row gx-4 gy-4">
          <div className="col-md-4">
            <div className="card h-100 shadow-sm p-4">
              <h3>Resume Analyzer</h3>
              <p>Upload your resume and get instant insight into structure, skills, and optimization tips.</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card h-100 shadow-sm p-4">
              <h3>Cover Letter Generator</h3>
              <p>Generate tailored cover letters in seconds with AI that reads your resume and job role.</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card h-100 shadow-sm p-4">
              <h3>ATS Score Checker</h3>
              <p>Evaluate how strong your resume is for an applicant tracking system and improve keywords.</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card h-100 shadow-sm p-4">
              <h3>Interview Preparation</h3>
              <p>Practice the right questions and answers for your role with AI coaching recommendations.</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card h-100 shadow-sm p-4">
              <h3>Job Matching</h3>
              <p>Match your skills to roles and find opportunities that are the best fit for your profile.</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card h-100 shadow-sm p-4">
              <h3>Live Chat Support</h3>
              <p>Ask the AI assistant anything about your job search directly from the site.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="chat-home-section py-5">
        <div className="card p-4 shadow-sm">
          <div className="row gx-4 gy-4 align-items-center">
            <div className="col-lg-6">
              <div>
                <h2>Live Career AI Chat</h2>
                <p className="text-muted">
                  Get fast, professional advice for your resume, cover letter, interviews, and job search right from the homepage.
                </p>
                <ul className="chat-home-features">
                  <li>Instant answers to career questions</li>
                  <li>Resume and ATS improvement suggestions</li>
                  <li>Interview coaching and behavioral response tips</li>
                  <li>Job role recommendations tailored to your skills</li>
                </ul>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="chat-home-preview">
                <div className="chat-home-preview-title">Try these quick prompts:</div>
                <div className="chat-home-preview-grid">
                  <span>Review my resume for ATS keywords</span>
                  <span>Write a concise cover letter</span>
                  <span>Prepare for a behavioral interview</span>
                  <span>Recommend matching job titles</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-5">
        <ChatBot />
      </section>

      <section className="py-5 text-center">
        <div className="card p-4 shadow-sm border-0 bg-light">
          <h2>Designed for modern job seekers</h2>
          <p className="text-muted mb-4">
            Everything you need in one place: upload your resume, parse it automatically, improve your application,
            and keep your job search organized.
          </p>
          <Link to="/ai-features" className="btn btn-secondary btn-lg me-3">
            Explore AI Tools
          </Link>
          <Link to="/dashboard" className="btn btn-outline-primary btn-lg">
            View Dashboard
          </Link>
        </div>
      </section>
    </div>
  )
}

export default PublicView
