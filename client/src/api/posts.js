import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const getFeed = async (filter = 'all') => {
  const response = await axios.get(`${API_URL}/posts/feed?filter=${filter}`);
  return response.data;
};

export const getMyPosts = async () => {
  const response = await axios.get(`${API_URL}/posts/my-posts`);
  return response.data;
};

export const getPost = async (id) => {
  const response = await axios.get(`${API_URL}/posts/${id}`);
  return response.data;
};

export const createPost = async (content, visibility = 'Public', imageFile = null) => {
  const formData = new FormData();
  formData.append('content', content);
  formData.append('visibility', visibility);
  if (imageFile) {
    formData.append('image', imageFile);
  }
  
  const response = await axios.post(`${API_URL}/posts`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const updatePost = async (id, content, visibility, imageFile = null) => {
  const formData = new FormData();
  formData.append('content', content);
  formData.append('visibility', visibility);
  if (imageFile) {
    formData.append('image', imageFile);
  }
  
  const response = await axios.put(`${API_URL}/posts/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const deletePost = async (id) => {
  const response = await axios.delete(`${API_URL}/posts/${id}`);
  return response.data;
};

export const likePost = async (id) => {
  const response = await axios.post(`${API_URL}/posts/${id}/like`);
  return response.data;
};

export const addComment = async (id, content) => {
  const response = await axios.post(`${API_URL}/posts/${id}/comments`, {
    content,
  });
  return response.data;
};

export const deleteComment = async (postId, commentId) => {
  const response = await axios.delete(
    `${API_URL}/posts/${postId}/comments/${commentId}`
  );
  return response.data;
};

