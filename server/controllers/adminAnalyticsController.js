const User = require('../models/User');
const Recipe = require('../models/Recipe');
const Post = require('../models/Post');
const Like = require('../models/Like');
const Comment = require('../models/Comment');

// @desc    Get Dashboard Statistics
// @route   GET /api/admin/stats
// @access  Private (Admin)
exports.getDashboardStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalRecipes = await Recipe.countDocuments();
    const totalPosts = await Post.countDocuments();
    
    // Recent activity
    const recentUsers = await User.find().sort({ createdAt: -1 }).limit(5).select('username email profileImage createdAt');
    const recentRecipes = await Recipe.find().sort({ createdAt: -1 }).limit(5).select('title image createdAt');

    // Engagement stats
    const totalLikes = await Like.countDocuments();
    const totalComments = await Comment.countDocuments();

    res.status(200).json({
      success: true,
      data: {
        counts: {
          users: totalUsers,
          recipes: totalRecipes,
          posts: totalPosts,
          likes: totalLikes,
          comments: totalComments
        },
        recentActivity: {
          users: recentUsers,
          recipes: recentRecipes
        }
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get Growth Analytics (Last 7 days)
// @route   GET /api/admin/analytics/growth
// @access  Private (Admin)
exports.getGrowthAnalytics = async (req, res, next) => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const userGrowth = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: sevenDaysAgo }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const recipeGrowth = await Recipe.aggregate([
      {
        $match: {
          createdAt: { $gte: sevenDaysAgo }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        userGrowth,
        recipeGrowth
      }
    });
  } catch (err) {
    next(err);
  }
};
