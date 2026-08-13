import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import LoadingSpinner from '../components/LoadingSpinner';
import './EditPostPage.css';

export default function EditPostPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const response = await API.get(`/posts/${id}`);
        const post = response.data;

        // Verify ownership
        if (user && String(post.authorId) !== String(user.id) && post.authorUsername !== user.username) {
          navigate('/', { replace: true });
          return;
        }

        setTitle(post.title || '');
        setContent(post.content || '');
      } catch (err) {
        if (err.response?.status === 404) {
          setError('Post not found.');
        } else {
          setError('Failed to load post.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id, user, navigate]);

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

    setSaving(true);
    setError('');

    try {
      await API.put(`/posts/${id}`, {
        title: title.trim(),
        content: content.trim(),
      });
      navigate(`/posts/${id}`);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Failed to update post. Please try again.'
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading post..." fullPage />;
  }

  if (error && !title && !content) {
    return (
      <div className="editor-page">
        <div className="container container-narrow">
          <div className="post-error glass animate-slideUp" style={{ padding: '3rem', textAlign: 'center' }}>
            <h2>{error}</h2>
            <button className="btn btn-primary" onClick={() => navigate('/')}>
              <span>Back to Home</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="editor-page">
      <div className="container container-narrow">
        <div className="editor-card glass-strong animate-slideUp">
          <div className="editor-header">
            <h1 className="editor-title">
              Edit <span className="gradient-text">Post</span>
            </h1>
            <p className="editor-subtitle">Make changes to your post</p>
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
              <label className="editor-label" htmlFor="edit-title">Title</label>
              <input
                id="edit-title"
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
              <label className="editor-label" htmlFor="edit-content">Content</label>
              <textarea
                id="edit-content"
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
                onClick={() => navigate(`/posts/${id}`)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary btn-lg"
                disabled={saving}
              >
                <span>
                  {saving ? (
                    'Saving...'
                  ) : (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline', verticalAlign: 'middle', marginRight: '0.375rem' }}>
                        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                        <polyline points="17 21 17 13 7 13 7 21" />
                        <polyline points="7 3 7 8 15 8" />
                      </svg>
                      Update Post
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
