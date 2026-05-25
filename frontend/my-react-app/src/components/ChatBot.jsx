import React, { useState } from 'react'
import axiosInstance from '../axiosInstance'

const quickPrompts = [
  {
    label: 'Career Plan',
    prompt: 'I want a clear career path for growth from my current role. Help me map next steps.',
  },
  {
    label: 'Resume Audit',
    prompt: 'Review my resume and suggest the top improvements for hiring managers and ATS systems.',
  },
  {
    label: 'Cover Letter',
    prompt: 'Create a professional cover letter for a software engineering position with strong leadership focus.',
  },
  {
    label: 'Interview Prep',
    prompt: 'Give me three strong interview answers for behavioral and technical questions.',
  },
  {
    label: 'Job Match',
    prompt: 'Recommend job titles for someone with experience in product, analytics, and stakeholder communication.',
  },
]

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: 'Welcome to your complete career guide. Ask me about resumes, cover letters, interview prep, job search strategy, or career growth, and I will respond with actionable advice.',
    },
  ])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const sendMessage = async (text) => {
    const trimmed = (text || '').trim()
    if (!trimmed) {
      return
    }

    const userMessage = { role: 'user', text: trimmed }
    const nextMessages = [...messages, userMessage]
    setMessages(nextMessages)
    setLoading(true)
    setError('')

    try {
      const response = await axiosInstance.post('/app/chatbot/', {
        message: trimmed,
        history: messages,
      })
      const reply = response.data?.reply || 'Sorry, I could not generate a reply.'
      setMessages((prev) => [...prev, { role: 'assistant', text: reply }])
      setMessage('')
    } catch (err) {
      setError('Unable to reach the AI service. Please try again shortly.')
      setMessages((prev) => [...prev, { role: 'assistant', text: 'I could not connect to the AI service right now.' }])
    } finally {
      setLoading(false)
    }
  }

  const handleSend = () => {
    sendMessage(message)
  }

  const handleQuickPrompt = (prompt) => {
    setMessage(prompt)
    sendMessage(prompt)
  }

  return (
    <div className="chatbot-widget">
      {!isOpen ? (
        <button
          type="button"
          className="chatbot-toggle-button"
          onClick={() => setIsOpen(true)}
        >
          Career AI Guide
        </button>
      ) : (
        <div className="chatbot-panel">
          <div className="chatbot-panel-header">
            <div>
              <h3>Career AI Guide</h3>
              <p>Ask any question about career strategy, resume optimization, interviewing, or role matching.</p>
            </div>
            <button className="chatbot-close-button" onClick={() => setIsOpen(false)}>
              ×
            </button>
          </div>

          <div className="chatbot-grid">
            <div className="chatbot-quick-actions">
              <h4>Quick prompts</h4>
              <div className="quick-action-list">
                {quickPrompts.map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    className="btn btn-outline-infobtn quick-action"
                    onClick={() => handleQuickPrompt(item.prompt)}
                    disabled={loading}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="chatbot-conversation">
              <div className="chatbot-messages">
                {messages.map((item, index) => (
                  <div key={index} className={`chat-message ${item.role === 'assistant' ? 'assistant' : 'user'}`}>
                    <div className="chat-bubble">{item.text}</div>
                  </div>
                ))}
              </div>

              {error && <div className="alert alert-danger">{error}</div>}

              <div className="chatbot-input-row">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type a career or resume question..."
                  rows={4}
                  className="form-control"
                />
                <div className="chatbot-actions">
                  <button type="button" className="btn" onClick={handleSend} disabled={loading}>
                    {loading ? 'Processing...' : 'Send'}
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => setMessage('')}
                    disabled={loading}
                  >
                    Clear
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ChatBot
