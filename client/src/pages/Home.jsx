import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Home.css';

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="home-page">
      <div className="container">
        <div className="hero-section">
          <h1 className="hero-title">Welcome to Social Media Platform</h1>
          <p className="hero-description">
            Share your thoughts, connect with others, and explore what's happening
            in your community.
          </p>
          {!isAuthenticated ? (
            <div className="hero-actions">
              <Link to="/register" className="btn btn-primary btn-large">
                Get Started
              </Link>
              <Link to="/login" className="btn btn-secondary btn-large">
                Login
              </Link>
            </div>
          ) : (
            <div className="hero-actions">
              <Link to="/feed" className="btn btn-primary btn-large">
                Go to Feed
              </Link>
            </div>
          )}
        </div>

        <div className="features-section">
          <h2 className="section-title">Features</h2>
          <div className="features-grid">
            <div className="feature-card">
              <h3>Share Your Thoughts</h3>
              <p>Create posts and share your ideas with the community.</p>
            </div>
            <div className="feature-card">
              <h3>Interact with Content</h3>
              <p>Like and comment on posts to engage with others.</p>
            </div>
            <div className="feature-card">
              <h3>Privacy Control</h3>
              <p>Control who can see your posts with privacy settings.</p>
            </div>
            <div className="feature-card">
              <h3>Secure Platform</h3>
              <p>Your data is protected with industry-standard security.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

