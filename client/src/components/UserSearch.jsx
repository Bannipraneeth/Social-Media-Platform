import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchUsers, followUser } from '../api/users';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import './UserSearch.css';

const UserSearch = ({ onUserClick }) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();
  const searchRef = useRef(null);
  const resultsRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target) &&
        resultsRef.current &&
        !resultsRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const searchUsersAsync = async () => {
      if (query.trim().length < 1) {
        setUsers([]);
        setIsOpen(false);
        return;
      }

      setLoading(true);
      try {
        const response = await searchUsers(query);
        setUsers(response.users || []);
        setIsOpen(true);
      } catch (error) {
        console.error('Search error:', error);
        toast.error('Failed to search users');
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(() => {
      searchUsersAsync();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [query]);

  const handleFollow = async (username, isFollowing) => {
    try {
      await followUser(username);
      // Update local state
      setUsers((prev) =>
        prev.map((u) =>
          u.username === username
            ? { ...u, isFollowing: !isFollowing }
            : u
        )
      );
      toast.success(isFollowing ? 'Unfollowed successfully' : 'Followed successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to follow/unfollow user');
    }
  };

  return (
    <div className="user-search-container" ref={searchRef}>
      <div className="search-input-wrapper">
        <input
          type="text"
          className="search-input"
          placeholder="Search users..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.trim().length > 0 && setIsOpen(true)}
          aria-label="Search users"
        />
        <span className="search-icon">🔍</span>
      </div>

      {isOpen && (loading || users.length > 0 || query.trim().length > 0) && (
        <div className="search-results" ref={resultsRef}>
          {loading ? (
            <div className="search-loading">Loading...</div>
          ) : users.length > 0 ? (
            <ul className="users-list">
              {users.map((userResult) => (
                <li key={userResult.id} className="user-item">
                  <div
                    className="user-info"
                    onClick={() => {
                      if (onUserClick) {
                        onUserClick(userResult.username);
                      } else {
                        navigate(`/user/${userResult.username}`);
                      }
                      setIsOpen(false);
                      setQuery('');
                    }}
                  >
                    <span className="user-username">{userResult.username}</span>
                    <span className="user-stats">
                      {userResult.followersCount} followers
                    </span>
                  </div>
                  {user && user.id !== userResult.id && (
                    <button
                      className={`btn btn-small ${userResult.isFollowing ? 'btn-secondary' : 'btn-primary'}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFollow(userResult.username, userResult.isFollowing);
                      }}
                      aria-label={userResult.isFollowing ? 'Unfollow' : 'Follow'}
                    >
                      {userResult.isFollowing ? 'Unfollow' : 'Follow'}
                    </button>
                  )}
                </li>
              ))}
            </ul>
          ) : query.trim().length > 0 ? (
            <div className="no-results">No users found</div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default UserSearch;

