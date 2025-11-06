import express from 'express';
import Post from '../models/Post.js';
import User from '../models/User.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Search users by username
router.get('/search', authenticate, async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q || q.trim().length < 1) {
      return res.json({ users: [] });
    }

    const searchQuery = new RegExp(q.trim(), 'i'); // Case-insensitive search
    
    const users = await User.find({
      username: searchQuery,
      _id: { $ne: req.user._id } // Exclude current user
    })
    .select('username createdAt followers following')
    .limit(20);

    // Add follow status for each user
    const usersWithFollowStatus = users.map(user => {
      const isFollowing = req.user.following && req.user.following.some(
        id => id.toString() === user._id.toString()
      );
      
      return {
        id: user._id,
        username: user.username,
        createdAt: user.createdAt,
        followersCount: user.followers?.length || 0,
        followingCount: user.following?.length || 0,
        isFollowing
      };
    });

    res.json({ users: usersWithFollowStatus });
  } catch (error) {
    console.error('Search users error:', error);
    res.status(500).json({ message: 'Failed to search users' });
  }
});

// Get user profile
router.get('/:username', authenticate, async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username })
      .select('username createdAt followers following');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get user's public posts count
    const publicPostsCount = await Post.countDocuments({
      author: user._id,
      visibility: 'Public'
    });

    // Check if current user is following this user
    const currentUser = await User.findById(req.user._id);
    const isFollowing = currentUser.following && currentUser.following.some(
      id => id.toString() === user._id.toString()
    );

    // Check if current user is viewing their own profile
    const isOwnProfile = currentUser._id.toString() === user._id.toString();

    res.json({
      user: {
        id: user._id,
        username: user.username,
        createdAt: user.createdAt,
        publicPostsCount,
        followersCount: user.followers?.length || 0,
        followingCount: user.following?.length || 0,
        isFollowing,
        isOwnProfile
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Failed to fetch user' });
  }
});

// Follow a user
router.post('/:username/follow', authenticate, async (req, res) => {
  try {
    const targetUser = await User.findOne({ username: req.params.username });
    
    if (!targetUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (targetUser._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'You cannot follow yourself' });
    }

    const currentUser = await User.findById(req.user._id);

    // Check if already following
    const isFollowing = currentUser.following && currentUser.following.some(
      id => id.toString() === targetUser._id.toString()
    );

    if (isFollowing) {
      // Unfollow
      currentUser.following = currentUser.following.filter(
        id => id.toString() !== targetUser._id.toString()
      );
      targetUser.followers = targetUser.followers.filter(
        id => id.toString() !== currentUser._id.toString()
      );
    } else {
      // Follow
      if (!currentUser.following) {
        currentUser.following = [];
      }
      if (!targetUser.followers) {
        targetUser.followers = [];
      }
      currentUser.following.push(targetUser._id);
      targetUser.followers.push(currentUser._id);
    }

    await currentUser.save();
    await targetUser.save();

    res.json({
      message: isFollowing ? 'Unfollowed successfully' : 'Followed successfully',
      isFollowing: !isFollowing,
      followersCount: targetUser.followers?.length || 0
    });
  } catch (error) {
    console.error('Follow/unfollow error:', error);
    res.status(500).json({ message: 'Failed to follow/unfollow user' });
  }
});

export default router;

