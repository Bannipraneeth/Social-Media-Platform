import express from 'express';
import Post from '../models/Post.js';
import User from '../models/User.js';
import { authenticate } from '../middleware/auth.js';
import { validatePost, validateComment, sanitizeString, handleValidationErrors } from '../middleware/validation.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

// Get feed - supports filtering by following users
router.get('/feed', authenticate, async (req, res) => {
  try {
    const { filter = 'all' } = req.query; // 'all' or 'following'
    
    let query = { visibility: 'Public' };

    // If filtering by following, only show posts from users the current user follows
    if (filter === 'following') {
      const currentUser = await User.findById(req.user._id).select('following');
      if (!currentUser.following || currentUser.following.length === 0) {
        return res.json({ posts: [] });
      }
      query.author = { $in: currentUser.following };
    }

    const posts = await Post.find(query)
      .populate('author', 'username')
      .populate('likes', 'username')
      .populate('comments.author', 'username')
      .sort({ createdAt: -1 })
      .limit(100);

    res.json({ posts });
  } catch (error) {
    console.error('Feed error:', error);
    res.status(500).json({ message: 'Failed to fetch feed' });
  }
});

// Get user's own posts (including private)
router.get('/my-posts', authenticate, async (req, res) => {
  try {
    const posts = await Post.find({ author: req.user._id })
      .populate('author', 'username')
      .populate('likes', 'username')
      .populate('comments.author', 'username')
      .sort({ createdAt: -1 });

    res.json({ posts });
  } catch (error) {
    console.error('Get my posts error:', error);
    res.status(500).json({ message: 'Failed to fetch your posts' });
  }
});

// Create a new post (with optional image upload)
router.post('/', authenticate, upload.single('image'), validatePost, async (req, res) => {
  try {
    const { content, visibility = 'Public' } = req.body;
    
    // Get image URL if file was uploaded
    let imageUrl = null;
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    }

    const post = new Post({
      author: req.user._id,
      content: sanitizeString(content),
      visibility,
      image: imageUrl
    });

    await post.save();
    await post.populate('author', 'username');
    await post.populate('likes', 'username');
    await post.populate('comments.author', 'username');

    res.status(201).json({ 
      message: 'Post created successfully',
      post 
    });
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ message: 'Failed to create post' });
  }
});

// Get a single post by ID
router.get('/:id', authenticate, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'username')
      .populate('likes', 'username')
      .populate('comments.author', 'username');

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check visibility
    if (post.visibility === 'Private' && post.author._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json({ post });
  } catch (error) {
    console.error('Get post error:', error);
    res.status(500).json({ message: 'Failed to fetch post' });
  }
});

// Update a post (only author) - supports image update
router.put('/:id', authenticate, upload.single('image'), validatePost, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check authorization
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only edit your own posts' });
    }

    const { content, visibility } = req.body;

    if (content) {
      post.content = sanitizeString(content);
    }
    if (visibility) {
      post.visibility = visibility;
    }
    
    // Handle image update
    if (req.file) {
      // Delete old image if exists
      if (post.image) {
        const fs = await import('fs');
        const path = await import('path');
        const { fileURLToPath } = await import('url');
        const { dirname } = await import('path');
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = dirname(__filename);
        const oldImagePath = path.join(__dirname, '..', post.image);
        try {
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        } catch (err) {
          console.error('Error deleting old image:', err);
        }
      }
      post.image = `/uploads/${req.file.filename}`;
    }

    post.updatedAt = Date.now();
    await post.save();
    await post.populate('author', 'username');
    await post.populate('likes', 'username');
    await post.populate('comments.author', 'username');

    res.json({ 
      message: 'Post updated successfully',
      post 
    });
  } catch (error) {
    console.error('Update post error:', error);
    res.status(500).json({ message: 'Failed to update post' });
  }
});

// Delete a post (only author)
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check authorization
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only delete your own posts' });
    }

    await Post.findByIdAndDelete(req.params.id);

    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({ message: 'Failed to delete post' });
  }
});

// Like/Unlike a post
router.post('/:id/like', authenticate, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'username')
      .populate('likes', 'username');

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check visibility
    if (post.visibility === 'Private' && post.author._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const userId = req.user._id;
    const likeIndex = post.likes.findIndex(
      like => like._id.toString() === userId.toString()
    );

    if (likeIndex > -1) {
      // Unlike
      post.likes.splice(likeIndex, 1);
    } else {
      // Like
      post.likes.push(userId);
    }

    await post.save();
    await post.populate('likes', 'username');
    await post.populate('comments.author', 'username');

    res.json({ 
      message: likeIndex > -1 ? 'Post unliked' : 'Post liked',
      post 
    });
  } catch (error) {
    console.error('Like post error:', error);
    res.status(500).json({ message: 'Failed to like/unlike post' });
  }
});

// Add a comment to a post
router.post('/:id/comments', authenticate, validateComment, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check visibility
    if (post.visibility === 'Private' && post.author._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { content } = req.body;

    post.comments.push({
      author: req.user._id,
      content: sanitizeString(content)
    });

    await post.save();
    await post.populate('author', 'username');
    await post.populate('likes', 'username');
    await post.populate('comments.author', 'username');

    res.status(201).json({ 
      message: 'Comment added successfully',
      post 
    });
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({ message: 'Failed to add comment' });
  }
});

// Delete a comment (post author only - optional V1 feature)
router.delete('/:id/comments/:commentId', authenticate, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Only post author can delete comments
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only delete comments on your own posts' });
    }

    const commentIndex = post.comments.findIndex(
      comment => comment._id.toString() === req.params.commentId
    );

    if (commentIndex === -1) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    post.comments.splice(commentIndex, 1);
    await post.save();
    await post.populate('author', 'username');
    await post.populate('likes', 'username');
    await post.populate('comments.author', 'username');

    res.json({ 
      message: 'Comment deleted successfully',
      post 
    });
  } catch (error) {
    console.error('Delete comment error:', error);
    res.status(500).json({ message: 'Failed to delete comment' });
  }
});

export default router;

