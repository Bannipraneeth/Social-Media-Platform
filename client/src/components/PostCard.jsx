import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { likePost, deletePost, updatePost, addComment, deleteComment } from '../api/posts';
import toast from 'react-hot-toast';
import './PostCard.css';

const PostCard = ({ post, onUpdate, onDelete }) => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(post.content);
  const [editVisibility, setEditVisibility] = useState(post.visibility);
  const [isLiking, setIsLiking] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentContent, setCommentContent] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  const userId = user?.id || user?._id;
  const isAuthor = user && (userId === post.author._id || userId === post.author.id);
  const isLiked =
    user && post.likes && post.likes.some((like) => {
      const likeId = like._id || like.id;
      return likeId === userId;
    });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  const handleLike = async () => {
    if (isLiking) return;
    setIsLiking(true);
    try {
      const response = await likePost(post._id);
      if (onUpdate) {
        onUpdate(response.post);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to like post');
    } finally {
      setIsLiking(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditContent(post.content);
    setEditVisibility(post.visibility);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditContent(post.content);
    setEditVisibility(post.visibility);
  };

  const handleSaveEdit = async () => {
    if (editContent.trim().length === 0) {
      toast.error('Post content cannot be empty');
      return;
    }
    if (editContent.length > 280) {
      toast.error('Post cannot exceed 280 characters');
      return;
    }

    try {
      const response = await updatePost(post._id, editContent, editVisibility);
      if (onUpdate) {
        onUpdate(response.post);
      }
      setIsEditing(false);
      toast.success('Post updated successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update post');
    }
  };

  const handleDelete = async () => {
    if (isDeleting) return;
    setIsDeleting(true);
    try {
      await deletePost(post._id);
      if (onDelete) {
        onDelete(post._id);
      }
      toast.success('Post deleted successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete post');
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleToggleLikeUsers = () => {
    // TODO: Show modal with list of users who liked
    if (post.likes && post.likes.length > 0) {
      const usernames = post.likes.map((like) => like.username).join(', ');
      toast.success(`Liked by: ${usernames}`);
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (commentContent.trim().length === 0) {
      toast.error('Comment cannot be empty');
      return;
    }
    if (commentContent.length > 500) {
      toast.error('Comment cannot exceed 500 characters');
      return;
    }

    setIsSubmittingComment(true);
    try {
      const response = await addComment(post._id, commentContent.trim());
      if (onUpdate) {
        onUpdate(response.post);
      }
      setCommentContent('');
      setShowComments(true);
      toast.success('Comment added successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add comment');
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!isAuthor) {
      toast.error('You can only delete comments on your own posts');
      return;
    }

    try {
      const response = await deleteComment(post._id, commentId);
      if (onUpdate) {
        onUpdate(response.post);
      }
      toast.success('Comment deleted successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete comment');
    }
  };

  return (
    <article className="post-card" aria-label={`Post by ${post.author.username}`}>
      <div className="post-header">
        <div className="post-author">
          <span className="author-username">{post.author.username}</span>
          <span className="post-timestamp" aria-label={`Posted ${formatDate(post.createdAt)}`}>
            {formatDate(post.createdAt)}
          </span>
          {post.visibility === 'Private' && (
            <span className="post-visibility" aria-label="Private post">
              🔒 Private
            </span>
          )}
        </div>
        {isAuthor && (
          <div className="post-actions">
            {!isEditing && (
              <>
                <button
                  onClick={handleEdit}
                  className="btn-icon"
                  aria-label="Edit post"
                  title="Edit post"
                >
                  ✏️
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="btn-icon btn-danger-icon"
                  aria-label="Delete post"
                  title="Delete post"
                >
                  🗑️
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {isEditing ? (
        <div className="post-edit">
          <textarea
            className="form-textarea"
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            maxLength={280}
            rows={4}
            aria-label="Edit post content"
          />
          <div className="post-edit-footer">
            <div className="char-counter">
              {editContent.length}/280
            </div>
            <div className="post-visibility-select">
              <label>
                <input
                  type="radio"
                  name="visibility"
                  value="Public"
                  checked={editVisibility === 'Public'}
                  onChange={(e) => setEditVisibility(e.target.value)}
                />
                Public
              </label>
              <label>
                <input
                  type="radio"
                  name="visibility"
                  value="Private"
                  checked={editVisibility === 'Private'}
                  onChange={(e) => setEditVisibility(e.target.value)}
                />
                Private
              </label>
            </div>
            <div className="post-edit-actions">
              <button
                onClick={handleCancelEdit}
                className="btn btn-secondary btn-small"
                aria-label="Cancel editing"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="btn btn-primary btn-small"
                aria-label="Save changes"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="post-content">{post.content}</div>

          <div className="post-actions-bar">
            <button
              onClick={handleLike}
              className={`action-button like-button ${isLiked ? 'liked' : ''}`}
              disabled={isLiking}
              aria-label={isLiked ? 'Unlike this post' : 'Like this post'}
              aria-pressed={isLiked}
            >
              <span className="action-icon">❤️</span>
              <span className="action-count" onClick={handleToggleLikeUsers}>
                {post.likes?.length || 0}
              </span>
            </button>
            <button
              onClick={() => setShowComments(!showComments)}
              className="action-button comment-button"
              aria-label={`${showComments ? 'Hide' : 'Show'} comments`}
              aria-expanded={showComments}
            >
              <span className="action-icon">💬</span>
              <span className="action-count">
                {post.comments?.length || 0}
              </span>
            </button>
          </div>

          {showComments && (
            <div className="comments-section" aria-label="Comments section">
              <div className="comments-list">
                {post.comments && post.comments.length > 0 ? (
                  post.comments.map((comment) => (
                    <div key={comment._id} className="comment-item">
                      <div className="comment-header">
                        <span className="comment-author">{comment.author.username}</span>
                        <span className="comment-timestamp">
                          {formatDate(comment.createdAt)}
                        </span>
                        {isAuthor && (
                          <button
                            onClick={() => handleDeleteComment(comment._id)}
                            className="btn-icon btn-danger-icon btn-small"
                            aria-label={`Delete comment by ${comment.author.username}`}
                            title="Delete comment"
                          >
                            🗑️
                          </button>
                        )}
                      </div>
                      <div className="comment-content">{comment.content}</div>
                    </div>
                  ))
                ) : (
                  <p className="no-comments">No comments yet. Be the first to comment!</p>
                )}
              </div>
              <form onSubmit={handleSubmitComment} className="comment-form">
                <textarea
                  className="form-textarea comment-input"
                  value={commentContent}
                  onChange={(e) => setCommentContent(e.target.value)}
                  placeholder="Write a comment..."
                  maxLength={500}
                  rows={3}
                  required
                  aria-label="Comment input"
                />
                <div className="comment-form-footer">
                  <div className="char-counter">
                    {commentContent.length}/500
                  </div>
                  <button
                    type="submit"
                    className="btn btn-primary btn-small"
                    disabled={isSubmittingComment || commentContent.trim().length === 0}
                    aria-label="Submit comment"
                  >
                    {isSubmittingComment ? 'Posting...' : 'Comment'}
                  </button>
                </div>
              </form>
            </div>
          )}
        </>
      )}

      {showDeleteConfirm && (
        <div className="delete-confirm-modal" role="dialog" aria-labelledby="delete-title">
          <div className="modal-content">
            <h3 id="delete-title">Delete Post</h3>
            <p>Are you sure you want to delete this post? This action cannot be undone.</p>
            <div className="modal-actions">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="btn btn-secondary"
                aria-label="Cancel deletion"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="btn btn-danger"
                disabled={isDeleting}
                aria-label="Confirm deletion"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </article>
  );
};

export default PostCard;

