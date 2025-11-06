import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUserProfile, followUser } from '../api/users';
import { getFeed } from '../api/posts';
import PostCard from '../components/PostCard';
import toast from 'react-hot-toast';
import './UserProfile.css';

const UserProfile = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const [profileUser, setProfileUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isFollowingLoading, setIsFollowingLoading] = useState(false);

  useEffect(() => {
    fetchUserProfile();
  }, [username]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const response = await getUserProfile(username);
      setProfileUser(response.user);
      setIsFollowing(response.user.isFollowing || false);

      // Fetch user's public posts
      const postsResponse = await getFeed('all');
      const userPosts = postsResponse.posts.filter(
        (post) => post.author.username === username
      );
      setPosts(userPosts);
    } catch (error) {
      console.error('Profile error:', error);
      toast.error('Failed to load user profile');
      navigate('/feed');
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async () => {
    if (isFollowingLoading) return;

    setIsFollowingLoading(true);
    try {
      const response = await followUser(username);
      setIsFollowing(response.isFollowing);
      setProfileUser((prev) => ({
        ...prev,
        isFollowing: response.isFollowing,
        followersCount: response.followersCount,
      }));
      toast.success(response.message);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to follow/unfollow user');
    } finally {
      setIsFollowingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="user-profile-page">
        <div className="container">
          <div className="spinner" role="status" aria-label="Loading profile">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!profileUser) {
    return (
      <div className="user-profile-page">
        <div className="container">
          <div className="error-message">
            <p>User not found</p>
            <button onClick={() => navigate('/feed')} className="btn btn-primary">
              Back to Feed
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="user-profile-page">
      <div className="container">
        <div className="profile-header">
          <h1 className="page-title">{profileUser.username}'s Profile</h1>
          <div className="profile-info">
            <div className="profile-username">
              <span className="username-label">Username:</span>
              <span className="username-value">{profileUser.username}</span>
              {!profileUser.isOwnProfile && (
                <button
                  onClick={handleFollow}
                  className={`btn ${isFollowing ? 'btn-secondary' : 'btn-primary'} btn-follow`}
                  disabled={isFollowingLoading}
                  aria-label={isFollowing ? 'Unfollow' : 'Follow'}
                >
                  {isFollowingLoading
                    ? '...'
                    : isFollowing
                    ? 'Unfollow'
                    : 'Follow'}
                </button>
              )}
            </div>
            <div className="profile-stats">
              <div className="stat-item">
                <span className="stat-value">{profileUser.publicPostsCount}</span>
                <span className="stat-label">Public Posts</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{profileUser.followersCount}</span>
                <span className="stat-label">Followers</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{profileUser.followingCount}</span>
                <span className="stat-label">Following</span>
              </div>
            </div>
          </div>
        </div>

        <div className="posts-container">
          <h2 className="section-title">Posts</h2>
          {posts.length === 0 ? (
            <div className="empty-state">
              <p>No posts yet.</p>
            </div>
          ) : (
            posts.map((post) => (
              <PostCard
                key={post._id}
                post={post}
                onUpdate={(updatedPost) => {
                  setPosts((prev) =>
                    prev.map((p) => (p._id === updatedPost._id ? updatedPost : p))
                  );
                }}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;

