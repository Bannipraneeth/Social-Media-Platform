import React, { useState } from 'react';
import { createPost } from '../api/posts';
import toast from 'react-hot-toast';
import './CreatePost.css';

const CreatePost = ({ onPostCreated }) => {
  const [content, setContent] = useState('');
  const [visibility, setVisibility] = useState('Public');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB');
        return;
      }
      setImageFile(file);
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (content.trim().length === 0 && !imageFile) {
      toast.error('Post content or image is required');
      return;
    }

    if (content.length > 280) {
      toast.error('Post cannot exceed 280 characters');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await createPost(content.trim(), visibility, imageFile);
      if (onPostCreated) {
        onPostCreated(response.post);
      }
      setContent('');
      setVisibility('Public');
      setImageFile(null);
      setImagePreview(null);
      // Reset file input
      const fileInput = document.getElementById('image-input');
      if (fileInput) fileInput.value = '';
      toast.success('Post created successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create post');
    } finally {
      setIsSubmitting(false);
    }
  };

  const remainingChars = 280 - content.length;
  const charCounterClass =
    remainingChars < 20
      ? remainingChars < 0
        ? 'error'
        : 'warning'
      : '';

  return (
    <div className="create-post-card">
      <h2 className="create-post-title">Create a Post</h2>
      <form onSubmit={handleSubmit} className="create-post-form">
        <div className="form-group">
          <textarea
            className="form-textarea"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind?"
            maxLength={280}
            rows={4}
            required
            aria-label="Post content"
            aria-describedby="char-counter"
          />
          <div
            id="char-counter"
            className={`char-counter ${charCounterClass}`}
            role="status"
            aria-live="polite"
          >
            {remainingChars} characters remaining
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="image-input" className="btn btn-secondary btn-small">
            📷 Upload Image
          </label>
          <input
            id="image-input"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={{ display: 'none' }}
            aria-label="Upload image"
          />
          {imagePreview && (
            <div className="image-preview">
              <img src={imagePreview} alt="Preview" />
              <button
                type="button"
                onClick={removeImage}
                className="btn-icon btn-danger-icon"
                aria-label="Remove image"
              >
                ✕
              </button>
            </div>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">Visibility</label>
          <div className="visibility-options">
            <label className="visibility-option">
              <input
                type="radio"
                name="visibility"
                value="Public"
                checked={visibility === 'Public'}
                onChange={(e) => setVisibility(e.target.value)}
                aria-label="Public visibility"
              />
              <span>🌐 Public</span>
            </label>
            <label className="visibility-option">
              <input
                type="radio"
                name="visibility"
                value="Private"
                checked={visibility === 'Private'}
                onChange={(e) => setVisibility(e.target.value)}
                aria-label="Private visibility"
              />
              <span>🔒 Private</span>
            </label>
          </div>
        </div>

        <button
          type="submit"
          className="btn btn-primary btn-full"
          disabled={isSubmitting || (content.trim().length === 0 && !imageFile)}
          aria-label="Submit post"
        >
          {isSubmitting ? 'Posting...' : 'Post'}
        </button>
      </form>
    </div>
  );
};

export default CreatePost;

