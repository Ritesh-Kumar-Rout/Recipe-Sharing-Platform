const Like = require('../models/Like');
const Comment = require('../models/Comment');
const Follower = require('../models/Follower');
const User = require('../models/User');
const Post = require('../models/Post');

// @desc    Toggle Like on Post
// @route   POST /api/interactions/like/:postId
// @access  Private
exports.toggleLike = async (req, res, next) => {
  try {
    const postId = req.params.postId;
    const userId = req.user.id;

    const existingLike = await Like.findOne({ user: userId, post: postId });

    if (existingLike) {
      await existingLike.deleteOne();
      await Post.findByIdAndUpdate(postId, { $inc: { likesCount: -1 } });
      res.status(200).json({ success: true, message: 'Unliked post' });
    } else {
      await Like.create({ user: userId, post: postId });
      await Post.findByIdAndUpdate(postId, { $inc: { likesCount: 1 } });
      res.status(200).json({ success: true, message: 'Liked post' });
    }
  } catch (err) {
    next(err);
  }
};

// @desc    Add Comment
// @route   POST /api/interactions/comment/:postId
// @access  Private
exports.addComment = async (req, res, next) => {
  try {
    const { text, parentComment } = req.body;
    const postId = req.params.postId;

    const comment = await Comment.create({
      user: req.user.id,
      post: postId,
      text,
      parentComment: parentComment || null
    });

    await Post.findByIdAndUpdate(postId, { $inc: { commentsCount: 1 } });

    res.status(201).json({ success: true, data: comment });
  } catch (err) {
    next(err);
  }
};

// @desc    Toggle Follow
// @route   POST /api/interactions/follow/:userIdToFollow
// @access  Private
exports.toggleFollow = async (req, res, next) => {
  try {
    const followerId = req.user.id;
    const followingId = req.params.userIdToFollow;

    if (followerId === followingId) {
      return res.status(400).json({ success: false, error: 'You cannot follow yourself' });
    }

    const existingFollow = await Follower.findOne({ follower: followerId, following: followingId });

    if (existingFollow) {
      await existingFollow.deleteOne();
      await User.findByIdAndUpdate(followerId, { $inc: { followingCount: -1 } });
      await User.findByIdAndUpdate(followingId, { $inc: { followersCount: -1 } });
      res.status(200).json({ success: true, message: 'Unfollowed user' });
    } else {
      await Follower.create({ follower: followerId, following: followingId });
      await User.findByIdAndUpdate(followerId, { $inc: { followingCount: 1 } });
      await User.findByIdAndUpdate(followingId, { $inc: { followersCount: 1 } });
      res.status(200).json({ success: true, message: 'Followed user' });
    }
  } catch (err) {
    next(err);
  }
};
