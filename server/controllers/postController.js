const Post = require('../models/Post');
const Follower = require('../models/Follower');

// @desc    Create a post
// @route   POST /api/posts
// @access  Private
exports.createPost = async (req, res, next) => {
  try {
    const { caption, hashtags } = req.body;
    
    // Parse hashtags if sent as string
    let parsedHashtags = [];
    if (hashtags) {
        parsedHashtags = Array.isArray(hashtags) ? hashtags : hashtags.split(',').map(tag => tag.trim());
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, error: 'Please upload at least one image' });
    }

    const images = req.files.map(file => file.path); // Cloudinary URLs

    const post = await Post.create({
      user: req.user.id,
      images,
      caption,
      hashtags: parsedHashtags
    });

    res.status(201).json({ success: true, data: post });
  } catch (err) {
    next(err);
  }
};

// @desc    Get Feed (Posts from following users + public posts)
// @route   GET /api/posts/feed
// @access  Private
exports.getFeed = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    // Get list of users the current user is following
    const following = await Follower.find({ follower: req.user.id }).select('following');
    const followingIds = following.map(f => f.following);

    // Include the user's own posts in the feed too
    followingIds.push(req.user.id);

    const posts = await Post.find({ user: { $in: followingIds } })
      .populate('user', 'username profileImage')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      count: posts.length,
      data: posts
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get Explore Posts (Trending / Random)
// @route   GET /api/posts/explore
// @access  Public
exports.getExplorePosts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const skip = (page - 1) * limit;

    // Simple trending: sort by likes count
    const posts = await Post.find()
      .populate('user', 'username profileImage')
      .sort({ likesCount: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      count: posts.length,
      data: posts
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete post
// @route   DELETE /api/posts/:id
// @access  Private
exports.deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ success: false, error: 'Post not found' });
    }

    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ success: false, error: 'Not authorized to delete this post' });
    }

    await post.deleteOne(); // This should trigger cascade deletes if set up, or clean manually

    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    next(err);
  }
};

// @desc    Like / Unlike post
// @route   PUT /api/posts/:id/like
// @access  Private
exports.likePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ success: false, error: 'Post not found' });
    }

    // Check if the post has already been liked
    const isLiked = post.likes.includes(req.user.id);

    if (isLiked) {
      // Unlike
      post.likes = post.likes.filter(userId => userId.toString() !== req.user.id);
      post.likesCount = post.likes.length;
    } else {
      // Like
      post.likes.push(req.user.id);
      post.likesCount = post.likes.length;
    }

    await post.save();

    res.status(200).json({ success: true, data: post.likes });
  } catch (err) {
    next(err);
  }
};
