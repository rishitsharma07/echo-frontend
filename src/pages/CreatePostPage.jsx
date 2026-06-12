import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import './CreatePostPage.css';

export default function CreatePostPage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      setError('Please enter a title for your post.');
      return;
    }
    if (!content.trim()) {
      setError('Please write some content for your post.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await API.post('/posts', {
        title: title.trim(),
        content: content.trim(),
      });
      navigate(`/posts/${response.data.id}`);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Failed to create post. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="editor-page">
      <div className="container container-narrow">
        <div className="editor-card glass-strong animate-slideUp">
          <div className="editor-header">
            <h1 className="editor-title">
              Create <span className="gradient-text">New Post</span>
            </h1>
            <p className="editor-subtitle">Share your ideas with the world</p>
          </div>

          <form className="editor-form" onSubmit={handleSubmit}>
            {error && (
              <div className="error-message animate-shake">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="15" y1="9" x2="9" y2="15" />
                  <line x1="9" y1="9" x2="15" y2="15" />
                </svg>
                {error}
              </div>
            )}

            <div className="editor-field">
              <label className="editor-label" htmlFor="post-title">Title</label>
              <input
                id="post-title"
                type="text"
                className="editor-title-input"
                placeholder="An interesting title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={200}
                autoFocus
              />
              <span className="editor-char-count">{title.length}/200</span>
            </div>

            <div className="editor-field">
              <label className="editor-label" htmlFor="post-content">Content</label>
              <textarea
                id="post-content"
                className="editor-content-input"
                placeholder="Write your post content here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                maxLength={50000}
              />
              <span className="editor-char-count">{content.length.toLocaleString()} characters</span>
            </div>

            <div className="editor-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate(-1)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary btn-lg"
                disabled={loading}
              >
                <span>
                  {loading ? (
                    'Publishing...'
                  ) : (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline', verticalAlign: 'middle', marginRight: '0.375rem' }}>
                        <line x1="22" y1="2" x2="11" y2="13" />
                        <polygon points="22 2 15 22 11 13 2 9 22 2" />
                      </svg>
                      Publish
                    </>
                  )}
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
