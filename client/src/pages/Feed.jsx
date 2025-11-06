import React, { useState, useEffect } from 'react';
import { getFeed, likePost, addComment } from '../api/posts';
import CreatePost from '../components/CreatePost';
import PostCard from '../components/PostCard';
import toast from 'react-hot-toast';
import './Feed.css';

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFeed();
  }, []);

  const fetchFeed = async () => {
    try {
      setLoading(true);
      const response = await getFeed();
      setPosts(response.posts || []);
      setError(null);
    } catch (error) {
      console.error('Feed error:', error);
      setError('Failed to load feed');
      toast.error('Failed to load feed');
    } finally {
      setLoading(false);
    }
  };

  const handlePostCreated = (newPost) => {
    // Add new post to the beginning of the feed
    setPosts((prev) => [newPost, ...prev]);
  };

  const handlePostUpdate = (updatedPost) => {
    setPosts((prev) =>
      prev.map((post) => (post._id === updatedPost._id ? updatedPost : post))
    );
  };

  const handlePostDelete = (postId) => {
    setPosts((prev) => prev.filter((post) => post._id !== postId));
  };

  if (loading) {
    return (
      <div className="feed-page">
        <div className="container">
          <div className="spinner" role="status" aria-label="Loading feed">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="feed-page">
        <div className="container">
          <div className="error-message">
            <p>{error}</p>
            <button onClick={fetchFeed} className="btn btn-primary">
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="feed-page">
      <div className="container">
        <h1 className="page-title">Feed</h1>
        <p className="page-subtitle">Discover what's happening in your community</p>

        <CreatePost onPostCreated={handlePostCreated} />

        <div className="posts-container">
          {posts.length === 0 ? (
            <div className="empty-state">
              <p>No posts yet. Be the first to share something!</p>
            </div>
          ) : (
            posts.map((post) => (
              <PostCard
                key={post._id}
                post={post}
                onUpdate={handlePostUpdate}
                onDelete={handlePostDelete}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Feed;

