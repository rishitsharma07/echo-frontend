import { Link } from 'react-router-dom';
import './PostCard.css';

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function PostCard({ post, index = 0 }) {
  const excerpt =
    post.content && post.content.length > 150
      ? post.content.substring(0, 150) + '...'
      : post.content || '';

  return (
    <Link
      to={`/posts/${post.id}`}
      className="post-card glass"
      style={{ animationDelay: `${index * 0.08}s` }}
    >
      <div className="post-card-accent" />

      <article className="post-card-body">
        <h3 className="post-card-title">{post.title}</h3>
        <p className="post-card-excerpt">{excerpt}</p>

        <div className="post-card-meta">
          <div className="post-card-author">
            <div className="post-card-author-avatar">
              {post.authorUsername?.charAt(0).toUpperCase() || 'U'}
            </div>
            <span className="post-card-author-name">{post.authorUsername || 'Unknown'}</span>
          </div>

          <div className="post-card-info">
            <span className="post-card-date">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              {post.createdAt ? formatDate(post.createdAt) : 'Recently'}
            </span>

            {typeof post.likeCount !== 'undefined' && (
              <span className="post-card-likes" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill={post.likedByCurrentUser ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: post.likedByCurrentUser ? 'var(--color-danger)' : 'inherit' }}>
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
                {post.likeCount}
              </span>
            )}

            {typeof post.commentCount !== 'undefined' && (
              <span className="post-card-comments" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                {post.commentCount}
              </span>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}
