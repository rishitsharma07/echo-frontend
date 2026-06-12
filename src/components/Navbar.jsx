import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setMobileOpen(false);
    navigate('/');
  };

  const closeMobile = () => setMobileOpen(false);

  return (
    <nav className="navbar">
      <div className="navbar-inner container">
        <Link to="/" className="navbar-brand" onClick={closeMobile}>
          <svg className="navbar-logo-icon" viewBox="0 0 24 24" fill="none" width="28" height="28">
            <rect x="2" y="3" width="20" height="18" rx="3" stroke="url(#navGrad)" strokeWidth="1.5" />
            <line x1="7" y1="8" x2="17" y2="8" stroke="url(#navGrad)" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="7" y1="12" x2="14" y2="12" stroke="url(#navGrad)" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="7" y1="16" x2="11" y2="16" stroke="url(#navGrad)" strokeWidth="1.5" strokeLinecap="round" />
            <defs>
              <linearGradient id="navGrad" x1="0" y1="0" x2="24" y2="24">
                <stop stopColor="#f43f5e" />
                <stop offset="1" stopColor="#f59e0b" />
              </linearGradient>
            </defs>
          </svg>
          <span className="navbar-brand-text gradient-text">Echo</span>
        </Link>

        <button
          className={`navbar-hamburger ${mobileOpen ? 'active' : ''}`}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div className={`navbar-menu ${mobileOpen ? 'open' : ''}`}>
          <div className="navbar-links">
            <NavLink to="/" className="navbar-link" onClick={closeMobile}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              Home
            </NavLink>
            {isAuthenticated && (
              <NavLink to="/create" className="navbar-link" onClick={closeMobile}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 20h9" />
                  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                </svg>
                New Post
              </NavLink>
            )}
          </div>

          <div className="navbar-actions">
            {isAuthenticated ? (
              <>
                <div className="navbar-user">
                  <div className="navbar-avatar">
                    {user?.username?.charAt(0).toUpperCase()}
                  </div>
                  <span className="navbar-username">{user?.username}</span>
                </div>
                <button className="btn btn-ghost btn-sm" onClick={handleLogout}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-ghost btn-sm" onClick={closeMobile}>
                  Sign In
                </Link>
                <Link to="/register" className="btn btn-primary btn-sm" onClick={closeMobile}>
                  <span>Get Started</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
