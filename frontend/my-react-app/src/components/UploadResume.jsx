import React, { useState } from 'react';
import axiosInstance from '../axiosInstance';

const UploadResume = () => {
  const [name, setName] = useState('');
  const [resume, setResume] = useState(null);
  const [message, setMessage] = useState('');
  const [parsedResume, setParsedResume] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!resume) {
      alert("Please select a file");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('name', name || resume.name.replace(/\.[^/.]+$/, ''));
    formData.append('resume', resume);

    try {
      const response = await axiosInstance.post('/resumes/upload-resume/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setMessage(response.data.message || 'Resume uploaded successfully');
      setParsedResume(response.data.data || null);
      setName('');
      setResume(null);
      setFileName('');
    } catch (error) {
      console.error(error)
      const serverMessage = error.response?.data?.message || 'Upload failed. Please try again.'
      setMessage(serverMessage)
    } finally {
      setLoading(false)
    }
  };


  const handleFileChange = (e) => {
    const nextFile = e.target.files[0]
    setResume(nextFile)
    setFileName(nextFile?.name || '')
  };

  return (
      <>

      


  

  
    
 

  
        <div className="container mt-5">

            <div className="card p-4">

                <h2>
                    Upload Your Resume Here
                </h2>
                  <div>
                    <div >
      <h2>Upload Resume</h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Resume owner</label>
          <input
            type="text"
            className="form-control"
            placeholder="Enter your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Resume file</label>
          <input
            type="file"
            className="form-control"
            accept=".pdf,.docx"
            onChange={handleFileChange}
          />
          {fileName && <small className="text-muted">Selected file: {fileName}</small>}
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Uploading...' : 'Upload Resume'}
        </button>
      </form>

      {message && <div className="mt-3 alert alert-info">{message}</div>}
      {parsedResume && (
        <div className="mt-3 p-3 border rounded bg-light">
          <h5>Parsed Resume Preview</h5>
          {parsedResume.headline && <p><strong>Headline:</strong> {parsedResume.headline}</p>}
          {parsedResume.summary && <p><strong>Summary:</strong> {parsedResume.summary}</p>}
          {parsedResume.skills?.length > 0 && <p><strong>Skills:</strong> {parsedResume.skills.join(', ')}</p>}
          {parsedResume.experience && <p><strong>Experience:</strong> {parsedResume.experience}</p>}
        </div>
      )}
    </div>
      
    </div>
                
                

            </div>

        </div>
        </>
    );
};

export default UploadResume;