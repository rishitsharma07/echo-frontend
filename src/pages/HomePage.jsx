import { useState, useEffect, useMemo } from 'react';
import API from '../api/axios';
import PostCard from '../components/PostCard';
import LoadingSpinner from '../components/LoadingSpinner';
import './HomePage.css';

export default function HomePage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await API.get('/posts');
        setPosts(response.data || []);
      } catch (err) {
        setError('Failed to load posts. Please try again later.');
        console.error('Failed to fetch posts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const filteredPosts = useMemo(() => {
    if (!searchQuery.trim()) return posts;
    const query = searchQuery.toLowerCase();
    return posts.filter(
      (post) =>
        post.title?.toLowerCase().includes(query) ||
        post.content?.toLowerCase().includes(query) ||
        post.authorUsername?.toLowerCase().includes(query)
    );
  }, [posts, searchQuery]);

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-glow" />
        <div className="container hero-content">
          <h1 className="hero-title animate-slideUp">
            Welcome to <span className="gradient-text">Echo</span>
          </h1>
          <p className="hero-subtitle animate-slideUp" style={{ animationDelay: '0.1s' }}>
            A place for ideas, stories, and conversations that matter.
          </p>
          <div className="hero-search animate-slideUp" style={{ animationDelay: '0.2s' }}>
            <svg className="hero-search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="search"
              className="hero-search-input"
              placeholder="Search posts by title, content, or author..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                className="hero-search-clear"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="container posts-section">
        {searchQuery && (
          <p className="search-results-info">
            {filteredPosts.length} result{filteredPosts.length !== 1 ? 's' : ''} for "{searchQuery}"
          </p>
        )}

        {loading ? (
          <div className="posts-grid">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="glass post-card-skeleton-wrapper" style={{ animationDelay: `${i * 0.08}s` }}>
                <div className="post-card-skeleton">
                  <div className="skeleton skeleton-title" />
                  <div className="skeleton skeleton-excerpt-1" />
                  <div className="skeleton skeleton-excerpt-2" />
                  <div className="skeleton skeleton-excerpt-3" />
                  <div className="skeleton-meta">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div className="skeleton skeleton-avatar" />
                      <div className="skeleton skeleton-name" />
                    </div>
                    <div className="skeleton skeleton-date" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="posts-error glass">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <p>{error}</p>
            <button className="btn btn-primary btn-sm" onClick={() => window.location.reload()}>
              <span>Try Again</span>
            </button>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="posts-empty glass">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
            </svg>
            <h3>{searchQuery ? 'No matching posts' : 'No posts yet'}</h3>
            <p className="text-muted">
              {searchQuery
                ? 'Try a different search term.'
                : 'Be the first to share something!'}
            </p>
          </div>
        ) : (
          <div className="posts-grid">
            {filteredPosts.map((post, index) => (
              <PostCard key={post.id} post={post} index={index} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
