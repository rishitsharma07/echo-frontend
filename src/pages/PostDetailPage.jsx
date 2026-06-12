import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import CommentSection from '../components/CommentSection';
import LoadingSpinner from '../components/LoadingSpinner';
import './PostDetailPage.css';

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function PostDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [liking, setLiking] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const response = await API.get(`/posts/${id}`);
        setPost(response.data);
      } catch (err) {
        if (err.response?.status === 404) {
          setError('Post not found.');
        } else {
          setError('Failed to load post. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const isAuthor = user && post && (user.id === post.authorId || user.username === post.authorUsername);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post? This cannot be undone.')) return;

    setDeleting(true);
    try {
      await API.delete(`/posts/${id}`);
      navigate('/');
    } catch (err) {
      console.error('Failed to delete post:', err);
      alert('Failed to delete post. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  const handleLike = async () => {
    if (!user) {
      alert('Please log in to like this post.');
      return;
    }
    
    setLiking(true);
    try {
      await API.post(`/posts/${id}/like`);
      setPost(prev => ({
        ...prev,
        likedByCurrentUser: !prev.likedByCurrentUser,
        likeCount: prev.likedByCurrentUser ? prev.likeCount - 1 : prev.likeCount + 1
      }));
    } catch (err) {
      console.error('Failed to toggle like:', err);
    } finally {
      setLiking(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading post..." fullPage />;
  }

  if (error) {
    return (
      <div className="post-detail-page container">
        <div className="post-error glass animate-slideUp">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <h2>{error}</h2>
          <Link to="/" className="btn btn-primary">
            <span>Back to Home</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="post-detail-page animate-fadeIn">
      <div className="container container-narrow">
        {/* Back Navigation */}
        <Link to="/" className="post-back-link">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Back to posts
        </Link>

        {/* Article */}
        <article className="post-article">
          <header className="post-header">
            <h1 className="post-title gradient-text">{post.title}</h1>

            <div className="post-meta">
              <div className="post-author-info">
                <div className="post-author-avatar">
                  {post.authorUsername?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div>
                  <p className="post-author-name">{post.authorUsername || 'Unknown'}</p>
                  <p className="post-date">
                    {post.createdAt ? formatDate(post.createdAt) : 'Recently published'}
                  </p>
                </div>
              </div>

              {isAuthor && (
                <div className="post-actions">
                  <Link to={`/edit/${id}`} className="btn btn-secondary btn-sm">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 20h9" />
                      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                    </svg>
                    Edit
                  </Link>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={handleDelete}
                    disabled={deleting}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    </svg>
                    {deleting ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              )}
            </div>
          </header>

          <div className="post-divider" />

          <div className="post-body">
            {post.content}
          </div>

          <div className="post-engagement" style={{ marginTop: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button 
              className={`btn ${post.likedByCurrentUser ? 'btn-danger' : 'btn-secondary'} like-btn`}
              onClick={handleLike}
              disabled={liking}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', transition: 'all 0.2s ease', transform: liking ? 'scale(0.95)' : 'scale(1)' }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill={post.likedByCurrentUser ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transition: 'all 0.2s ease' }}>
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
              <span>{post.likeCount || 0} {post.likeCount === 1 ? 'Like' : 'Likes'}</span>
            </button>
          </div>
        </article>

        <div className="post-divider" />

        {/* Comments */}
        <CommentSection postId={id} />
      </div>
    </div>
  );
}
