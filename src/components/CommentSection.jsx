import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import './CommentSection.css';

function timeAgo(dateString) {
  const now = new Date();
  const date = new Date(dateString);
  const seconds = Math.floor((now - date) / 1000);

  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks}w ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function CommentSection({ postId }) {
  const { user, isAuthenticated } = useAuth();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const fetchComments = useCallback(async () => {
    try {
      setLoading(true);
      const response = await API.get(`/posts/${postId}/comments`);
      setComments(response.data || []);
    } catch (err) {
      console.error('Failed to fetch comments:', err);
    } finally {
      setLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    setSubmitting(true);
    setError('');
    try {
      const response = await API.post(`/posts/${postId}/comments`, { content: content.trim() });
      setComments((prev) => [...prev, response.data]);
      setContent('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post comment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (commentId) => {
    if (!window.confirm('Delete this comment?')) return;

    try {
      await API.delete(`/posts/${postId}/comments/${commentId}`);
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    } catch (err) {
      console.error('Failed to delete comment:', err);
    }
  };

  return (
    <section className="comment-section">
      <h2 className="comment-section-title">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
        Comments
        <span className="comment-count">{comments.length}</span>
      </h2>

      {isAuthenticated && (
        <form className="comment-form" onSubmit={handleSubmit}>
          <div className="comment-form-header">
            <div className="comment-form-avatar">
              {user?.username?.charAt(0).toUpperCase()}
            </div>
            <span className="comment-form-username">{user?.username}</span>
          </div>
          <textarea
            className="comment-form-input"
            placeholder="Share your thoughts..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={3}
            maxLength={2000}
          />
          {error && <div className="error-message">{error}</div>}
          <div className="comment-form-actions">
            <span className="comment-form-char-count">
              {content.length}/2000
            </span>
            <button
              type="submit"
              className="btn btn-primary btn-sm"
              disabled={submitting || !content.trim()}
            >
              <span>{submitting ? 'Posting...' : 'Post Comment'}</span>
            </button>
          </div>
        </form>
      )}

      <div className="comment-list">
        {loading ? (
          <div className="comment-loading">
            {[1, 2, 3].map((i) => (
              <div key={i} className="comment-skeleton glass">
                <div className="skeleton" style={{ width: 32, height: 32, borderRadius: '50%' }} />
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div className="skeleton" style={{ height: 14, width: '30%' }} />
                  <div className="skeleton" style={{ height: 14, width: '90%' }} />
                  <div className="skeleton" style={{ height: 14, width: '60%' }} />
                </div>
              </div>
            ))}
          </div>
        ) : comments.length === 0 ? (
          <div className="comment-empty">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            <p>No comments yet.</p>
            <p className="text-muted">Be the first to share your thoughts!</p>
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="comment-item animate-slideUp">
              <div className="comment-avatar">
                {comment.authorUsername?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="comment-content">
                <div className="comment-header">
                  <span className="comment-author">{comment.authorUsername || 'Unknown'}</span>
                  <span className="comment-time">{comment.createdAt ? timeAgo(comment.createdAt) : ''}</span>
                </div>
                <p className="comment-text">{comment.content}</p>
                {user && (user.id === comment.authorId || user.username === comment.authorUsername) && (
                  <button
                    className="comment-delete"
                    onClick={() => handleDelete(comment.id)}
                    title="Delete comment"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    </svg>
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
