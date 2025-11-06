import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getMyPosts, deletePost, updatePost } from '../api/posts';
import CreatePost from '../components/CreatePost';
import PostCard from '../components/PostCard';
import toast from 'react-hot-toast';
import './Profile.css';

const Profile = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMyPosts();
  }, []);

  const fetchMyPosts = async () => {
    try {
      setLoading(true);
      const response = await getMyPosts();
      setPosts(response.posts || []);
      setError(null);
    } catch (error) {
      console.error('Profile error:', error);
      setError('Failed to load your posts');
      toast.error('Failed to load your posts');
    } finally {
      setLoading(false);
    }
  };

  const handlePostCreated = (newPost) => {
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
      <div className="profile-page">
        <div className="container">
          <div className="spinner" role="status" aria-label="Loading profile">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-page">
        <div className="container">
          <div className="error-message">
            <p>{error}</p>
            <button onClick={fetchMyPosts} className="btn btn-primary">
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  const publicPostsCount = posts.filter((post) => post.visibility === 'Public').length;
  const privatePostsCount = posts.filter((post) => post.visibility === 'Private').length;

  return (
    <div className="profile-page">
      <div className="container">
        <div className="profile-header">
          <h1 className="page-title">Profile</h1>
          <div className="profile-info">
            <div className="profile-username">
              <span className="username-label">Username:</span>
              <span className="username-value">{user?.username}</span>
            </div>
            <div className="profile-stats">
              <div className="stat-item">
                <span className="stat-value">{posts.length}</span>
                <span className="stat-label">Total Posts</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{publicPostsCount}</span>
                <span className="stat-label">Public Posts</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{privatePostsCount}</span>
                <span className="stat-label">Private Posts</span>
              </div>
            </div>
          </div>
        </div>

        <CreatePost onPostCreated={handlePostCreated} />

        <div className="posts-container">
          <h2 className="section-title">My Posts</h2>
          {posts.length === 0 ? (
            <div className="empty-state">
              <p>You haven't created any posts yet. Start sharing your thoughts!</p>
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

export default Profile;

