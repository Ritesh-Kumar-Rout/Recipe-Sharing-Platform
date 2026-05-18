const Recipe = require('../models/Recipe');
const User = require('../models/User');

// @desc    Search global (recipes, users, etc.)
// @route   GET /api/search
// @access  Public
exports.searchGlobal = async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q || q.trim() === '') {
      return res.status(200).json({ success: true, recipes: [], users: [] });
    }

    const regex = new RegExp(q, 'i');

    const recipes = await Recipe.find({
      $or: [
        { title: regex },
        { description: regex },
        { categories: regex },
        { hashtags: regex }
      ]
    }).limit(10);

    const users = await User.find({
      $or: [
        { username: regex },
        { name: regex }
      ]
    }).select('username name profileImage').limit(5);

    res.status(200).json({
      success: true,
      recipes,
      users
    });
  } catch (err) {
    next(err);
  }
};
