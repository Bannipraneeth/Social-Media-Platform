import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  content: {
    type: String,
    required: [true, 'Post content is required'],
    maxlength: [280, 'Post cannot exceed 280 characters'],
    trim: true
  },
  visibility: {
    type: String,
    enum: ['Public', 'Private'],
    default: 'Public',
    index: true
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  comments: [{
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    content: {
      type: String,
      required: true,
      maxlength: [500, 'Comment cannot exceed 500 characters'],
      trim: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update updatedAt before saving
postSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index for efficient feed queries
postSchema.index({ visibility: 1, createdAt: -1 });

const Post = mongoose.model('Post', postSchema);

export default Post;

