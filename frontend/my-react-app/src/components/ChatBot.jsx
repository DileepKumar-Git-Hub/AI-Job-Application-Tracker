import React, { useState } from 'react';
import axiosInstance from '../axiosInstance';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'Hi! Ask me anything about your resume, job search, or interview prep.' },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const togglePanel = () => {
    setIsOpen((open) => !open);
    setError('');
  };

  const handleSend = async () => {
    if (!message.trim()) {
      return;
    }
    setLoading(true);
    setError('');

    const userMessage = { role: 'user', text: message.trim() };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const response = await axiosInstance.post('/app/chatbot/', { message: message.trim() });
      const reply = response.data?.reply || 'Sorry, I could not generate a reply.';
      setMessages((prev) => [...prev, { role: 'assistant', text: reply }]);
      setMessage('');
    } catch (err) {
      setError('Unable to reach the AI service. Please try again shortly.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {isOpen ? (
        <div style={{
          position: 'fixed',
          right: '20px',
          bottom: '20px',
          width: '360px',
          maxHeight: '640px',
          zIndex: 9999,
          boxShadow: '0 20px 40px rgba(0,0,0,0.18)',
          borderRadius: '20px',
          background: '#fff',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}>
          <div style={{ padding: '14px 16px', background: '#0d6efd', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <strong>Career AI Helper</strong>
              <div style={{ fontSize: '12px', opacity: 0.9 }}>Ask Gemini for resume, interview, or job search advice</div>
            </div>
            <button onClick={togglePanel} style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: '20px', cursor: 'pointer' }}>
              ×
            </button>
          </div>

          <div style={{ padding: '12px', flex: '1 1 auto', overflowY: 'auto', background: '#f8f9fa' }}>
            {messages.map((item, index) => (
              <div key={index} style={{ marginBottom: '12px', textAlign: item.role === 'assistant' ? 'left' : 'right' }}>
                <div style={{ display: 'inline-block', padding: '10px 14px', borderRadius: '16px', background: item.role === 'assistant' ? '#e9ecef' : '#0d6efd', color: item.role === 'assistant' ? '#212529' : '#fff', maxWidth: '100%' }}>
                  {item.text}
                </div>
              </div>
            ))}
          </div>

          <div style={{ padding: '10px 12px', background: '#fff', borderTop: '1px solid #dee2e6' }}>
            {error && <div style={{ color: '#d63384', marginBottom: '8px', fontSize: '13px' }}>{error}</div>}
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask about resumes, cover letters, interviews, or job matching..."
              rows={3}
              style={{ width: '100%', resize: 'vertical', borderRadius: '10px', border: '1px solid #ced4da', padding: '10px' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
              <button
                type="button"
                onClick={handleSend}
                disabled={loading}
                style={{
                  background: '#0d6efd',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '10px 16px',
                  cursor: 'pointer',
                  minWidth: '90px',
                }}
              >
                {loading ? 'Sending…' : 'Send'}
              </button>
              <button
                type="button"
                onClick={() => setMessage('')}
                style={{ background: 'transparent', border: 'none', color: '#6c757d', cursor: 'pointer' }}
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={togglePanel}
          style={{
            position: 'fixed',
            right: '24px',
            bottom: '24px',
            zIndex: 9999,
            background: '#0d6efd',
            color: '#fff',
            border: 'none',
            borderRadius: '999px',
            padding: '14px 20px',
            boxShadow: '0 15px 30px rgba(13, 110, 253, 0.35)',
            cursor: 'pointer',
            fontSize: '14px',
          }}
        >
          Chat AI
        </button>
      )}
    </div>
  )
};

export default ChatBot;
