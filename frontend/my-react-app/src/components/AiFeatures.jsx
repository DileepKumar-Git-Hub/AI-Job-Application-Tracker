import React, { useState, useEffect } from 'react';
import axiosInstance from '../axiosInstance';

const featureCards = [
  {
    id: 'resume',
    title: 'Resume Analyzer',
    subtitle: 'Get AI-driven feedback on your resume content and ATS readiness.',
  },
  {
    id: 'cover',
    title: 'Cover Letter Generator',
    subtitle: 'Create a tailored cover letter for any job posting.',
  },
  {
    id: 'interview',
    title: 'Interview Preparation',
    subtitle: 'Practice questions and answers for your next interview.',
  },
  {
    id: 'matching',
    title: 'AI Job Matching',
    subtitle: 'Match your skills to relevant jobs and roles.',
  },
  {
    id: 'ats',
    title: 'ATS Score Checker',
    subtitle: 'Evaluate your resume against a job description for ATS fit.',
  },
  {
    id: 'career',
    title: 'Career Guide',
    subtitle: 'Receive structured career advice for goals, growth, and next steps.',
  },
];

const AiFeatures = () => {
  const [activeFeature, setActiveFeature] = useState('resume');
  const [formState, setFormState] = useState({
    resumeText: '',
    jobTitle: '',
    company: '',
    targetRole: '',
    experience: '',
    skills: '',
    jobDescription: '',
  });
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const [resumeMessage, setResumeMessage] = useState('');

  useEffect(() => {
    const loadResume = async () => {
      try {
        const response = await axiosInstance.get('/resumes/latest/');
        const resume = response.data;
        if (resume) {
          setFormState((prev) => ({
            ...prev,
            resumeText: resume.parsed_text || resume.summary || prev.resumeText,
            skills: Array.isArray(resume.skills) ? resume.skills.join(', ') : prev.skills,
            experience: resume.experience || resume.summary || prev.experience,
          }));
          setResumeMessage('Loaded your latest parsed resume data.');
        }
      } catch (err) {
        setResumeMessage('No parsed resume available yet. Upload one to auto-fill the AI tools.');
      }
    };

    loadResume();
  }, []);

  const handleSelection = (featureId) => {
    setActiveFeature(featureId);
    setResult('');
    setError('');
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const analyzeResume = (text) => {
    if (!text.trim()) {
      return 'Paste your resume text to get instant feedback.';
    }

    const suggestions = [];
    if (text.length < 250) {
      suggestions.push('Your resume is short. Add more detail about achievements and results.');
    }
    if (!/experience|worked|achieved/i.test(text)) {
      suggestions.push('Add action-oriented achievements and measurable outcomes to stand out.');
    }
    if (!/skills|tools|technologies/i.test(text)) {
      suggestions.push('Include a dedicated skills section with relevant keywords.');
    }
    if (suggestions.length === 0) {
      return 'Your resume looks strong. Make sure it is tailored to the job and includes measurable results.';
    }
    return suggestions.join(' ');
  };

  const generateCoverLetter = ({ jobTitle, company, resumeText, skills }) => {
    if (!jobTitle.trim() || !company.trim() || !resumeText.trim()) {
      return 'Enter the job title, company, and a short resume summary to generate a cover letter.';
    }

    return `Dear Hiring Team at ${company},\n\nI am excited to apply for the ${jobTitle} role. My background includes ${resumeText.trim().split('\n').slice(0, 2).join(' ')}. I bring strong skills in ${skills || 'problem solving and teamwork'}, and I am confident I can contribute to your team at ${company}.\n\nThank you for your consideration.\n\nSincerely,\n[Your Name]`;
  };

  const prepareInterview = ({ targetRole, experience, skills }) => {
    if (!targetRole.trim()) {
      return 'Enter the role you are interviewing for to get practice questions.';
    }

    return `Interview Prep for ${targetRole}:\n\n1. Tell me about yourself and your experience in ${experience || 'this field'}.\n2. How have you used ${skills || 'your key skills'} to solve a challenge?\n3. Why are you interested in this role and company?\n\nPractice answering these questions with concrete examples and measurable results.`;
  };

  const careerGuide = ({ targetRole, experience, skills, resumeText }) => {
    if (!targetRole.trim() && !skills.trim() && !resumeText.trim()) {
      return 'Tell me your target role, main skills, or a short resume summary so I can provide a career guide.';
    }

    return `Career Guide:\n\n• Target role: ${targetRole.trim() || 'A role that fits your strongest skills.'}\n• Experience: ${experience.trim() || 'Highlight roles with measurable results.'}\n• Key skills: ${skills.trim() || 'Focus on strengths such as communication, leadership, and technical delivery.'}\n\nAction Plan:\n1. Tailor your resume to one target role and include metrics for each achievement.\n2. Practice one story for leadership, one for impact, and one for innovation.\n3. Apply to 3-5 prioritized roles each week and follow up within 48 hours.\n4. Build a short networking message for hiring managers and alumni.`;
  };

  const matchJobs = ({ skills }) => {
    if (!skills.trim()) {
      return 'Enter your top skills so the system can suggest matching job types.';
    }

    const skillList = skills.split(/[;,\n]/).map((skill) => skill.trim()).filter(Boolean);
    return `Based on your skills (${skillList.join(', ')}), good job matches include: ${skillList
      .slice(0, 3)
      .map((skill) => `${skill} Specialist`)
      .join(', ')}. Also consider hybrid roles that combine strong communication and technical ability.`;
  };

  const checkAtsScore = ({ resumeText, jobDescription }) => {
    if (!resumeText.trim() || !jobDescription.trim()) {
      return 'Paste both your resume content and a job description to get an ATS readiness summary.';
    }

    const keywords = jobDescription
      .toLowerCase()
      .match(/\b\w{4,}\b/g)
      ?.filter((word, index, array) => array.indexOf(word) === index) || [];
    const matches = keywords.filter((keyword) => resumeText.toLowerCase().includes(keyword));
    const score = Math.min(100, Math.round((matches.length / Math.max(10, keywords.length)) * 100));

    return `ATS Score: ${score}%\nMatched keywords: ${matches.slice(0, 12).join(', ') || 'None yet'}.\nTry integrating more exact job keywords from the posting into your resume.`;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError('');

    let output = '';
    switch (activeFeature) {
      case 'resume':
        output = analyzeResume(formState.resumeText);
        break;
      case 'cover':
        output = generateCoverLetter(formState);
        break;
      case 'interview':
        output = prepareInterview(formState);
        break;
      case 'matching':
        output = matchJobs(formState);
        break;
      case 'ats':
        output = checkAtsScore(formState);
        break;
      case 'career':
        output = careerGuide(formState);
        break;
      default:
        output = 'Select a feature to begin.';
    }

    setResult(output);
  };

  return (
    <div className="container my-5">
      <div className="card shadow-sm p-4">
        <div className="mb-4">
          <h2 className="mb-2">AI Career Toolkit</h2>
          <p className="text-muted">Choose a tool to improve your resume, cover letter, interview prep, job matching, or ATS score.</p>
          {resumeMessage && <div className="alert alert-info py-2">{resumeMessage}</div>}
        </div>

        <div className="ai-feature-topbar mb-4">
          {featureCards.map((feature) => (
            <button
              key={feature.id}
              type="button"
              className={`ai-feature-tab ${activeFeature === feature.id ? 'active' : ''}`}
              onClick={() => handleSelection(feature.id)}
            >
              <div className="feature-label">{feature.title}</div>
              <div className="feature-subtitle">{feature.subtitle}</div>
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="mb-4">
          {activeFeature === 'resume' && (
            <div className="mb-3">
              <label className="form-label">Paste your resume text</label>
              <textarea
                className="form-control"
                name="resumeText"
                rows="8"
                value={formState.resumeText}
                onChange={handleChange}
                placeholder="Start with your headline, experience, and skills..."
              />
            </div>
          )}

          {activeFeature === 'cover' && (
            <>
              <div className="row gy-3 mb-3">
                <div className="col-md-6">
                  <label className="form-label">Job title</label>
                  <input
                    className="form-control"
                    name="jobTitle"
                    value={formState.jobTitle}
                    onChange={handleChange}
                    placeholder="e.g. Product Marketing Manager"
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Company</label>
                  <input
                    className="form-control"
                    name="company"
                    value={formState.company}
                    onChange={handleChange}
                    placeholder="e.g. Acme Corp"
                  />
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label">Resume summary or key strengths</label>
                <textarea
                  className="form-control"
                  name="resumeText"
                  rows="5"
                  value={formState.resumeText}
                  onChange={handleChange}
                  placeholder="Summarize your most relevant experience and skills..."
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Top skills</label>
                <input
                  className="form-control"
                  name="skills"
                  value={formState.skills}
                  onChange={handleChange}
                  placeholder="e.g. React, communication, leadership"
                />
              </div>
            </>
          )}

          {activeFeature === 'interview' && (
            <> 
              <div className="mb-3">
                <label className="form-label">Target role</label>
                <input
                  className="form-control"
                  name="targetRole"
                  value={formState.targetRole}
                  onChange={handleChange}
                  placeholder="e.g. Frontend Engineer"
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Experience summary</label>
                <textarea
                  className="form-control"
                  name="experience"
                  rows="4"
                  value={formState.experience}
                  onChange={handleChange}
                  placeholder="Describe your experience in the role or industry..."
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Key skills</label>
                <input
                  className="form-control"
                  name="skills"
                  value={formState.skills}
                  onChange={handleChange}
                  placeholder="e.g. React, communication, project leadership"
                />
              </div>
            </>
          )}

          {activeFeature === 'matching' && (
            <>
              <div className="mb-3">
                <label className="form-label">Skills and interests</label>
                <textarea
                  className="form-control"
                  name="skills"
                  rows="4"
                  value={formState.skills}
                  onChange={handleChange}
                  placeholder="List your top skills, technologies, and job interests..."
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Brief career summary</label>
                <textarea
                  className="form-control"
                  name="experience"
                  rows="4"
                  value={formState.experience}
                  onChange={handleChange}
                  placeholder="Describe your experience level and career goals..."
                />
              </div>
            </>
          )}

          {activeFeature === 'career' && (
            <>
              <div className="mb-3">
                <label className="form-label">Desired role</label>
                <input
                  className="form-control"
                  name="targetRole"
                  value={formState.targetRole}
                  onChange={handleChange}
                  placeholder="e.g. Senior Product Manager"
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Your experience summary</label>
                <textarea
                  className="form-control"
                  name="experience"
                  rows="4"
                  value={formState.experience}
                  onChange={handleChange}
                  placeholder="Summarize your work experience and achievements..."
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Key strengths and skills</label>
                <textarea
                  className="form-control"
                  name="skills"
                  rows="3"
                  value={formState.skills}
                  onChange={handleChange}
                  placeholder="List your strongest skills and tools..."
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Resume summary or highlights</label>
                <textarea
                  className="form-control"
                  name="resumeText"
                  rows="3"
                  value={formState.resumeText}
                  onChange={handleChange}
                  placeholder="Paste a short resume highlight or summary..."
                />
              </div>
            </>
          )}

          {activeFeature === 'ats' && (
            <>
              <div className="mb-3">
                <label className="form-label">Job description</label>
                <textarea
                  className="form-control"
                  name="jobDescription"
                  rows="5"
                  value={formState.jobDescription}
                  onChange={handleChange}
                  placeholder="Paste the job description here..."
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Resume text</label>
                <textarea
                  className="form-control"
                  name="resumeText"
                  rows="5"
                  value={formState.resumeText}
                  onChange={handleChange}
                  placeholder="Paste your resume content here..."
                />
              </div>
            </>
          )}

          <div className="d-flex gap-2">
            <button type="submit" className="btn btn-primary">
              Run {featureCards.find((feature) => feature.id === activeFeature)?.title}
            </button>
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => {
                setFormState({
                  resumeText: '',
                  jobTitle: '',
                  company: '',
                  targetRole: '',
                  experience: '',
                  skills: '',
                  jobDescription: '',
                });
                setResult('');
                setError('');
              }}
            >
              Clear
            </button>
          </div>
        </form>

        {error && <div className="alert alert-danger">{error}</div>}

        {result && (
          <div className="card bg-light p-3 ai-result-panel">
            <h5 className="mb-3">Result</h5>
            <pre className="mb-0" style={{ whiteSpace: 'pre-wrap' }}>
              {result}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default AiFeatures;
