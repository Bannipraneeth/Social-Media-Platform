import express from 'express';
import Post from '../models/Post.js';
import User from '../models/User.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Get user profile (minimal - just username for V1.0)
router.get('/:username', authenticate, async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username })
      .select('username createdAt');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get user's public posts count
    const publicPostsCount = await Post.countDocuments({
      author: user._id,
      visibility: 'Public'
    });

    res.json({
      user: {
        username: user.username,
        createdAt: user.createdAt,
        publicPostsCount
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Failed to fetch user' });
  }
});

export default router;

