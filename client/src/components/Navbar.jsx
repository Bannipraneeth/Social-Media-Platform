import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className="navbar" role="navigation" aria-label="Main navigation">
      <div className="navbar-content">
        <Link to="/" className="navbar-brand" aria-label="Home">
          Social Media Platform
        </Link>
        <div className="navbar-links">
          {isAuthenticated ? (
            <>
              <Link to="/feed" className="navbar-link">
                Feed
              </Link>
              <Link to="/profile" className="navbar-link">
                Profile
              </Link>
              <span className="navbar-user" aria-label={`Logged in as ${user?.username}`}>
                {user?.username}
              </span>
              <button
                onClick={handleLogout}
                className="btn btn-secondary btn-small"
                aria-label="Logout"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar-link">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary btn-small">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

