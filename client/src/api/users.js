import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Search users by username
export const searchUsers = async (query) => {
  const response = await axios.get(`${API_URL}/users/search?q=${encodeURIComponent(query)}`);
  return response.data;
};

// Get user profile
export const getUserProfile = async (username) => {
  const response = await axios.get(`${API_URL}/users/${username}`);
  return response.data;
};

// Follow/Unfollow a user
export const followUser = async (username) => {
  const response = await axios.post(`${API_URL}/users/${username}/follow`);
  return response.data;
};

