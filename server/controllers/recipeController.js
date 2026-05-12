const Recipe = require('../models/Recipe');

// @desc    Create Recipe (Admin Only)
// @route   POST /api/recipes
// @access  Private (Admin)
exports.createRecipe = async (req, res, next) => {
  try {
    const { title, ingredients, steps, prepTime, cookTime, categories } = req.body;

    if (!req.file) {
      return res.status(400).json({ success: false, error: 'Please upload a recipe image' });
    }

    let parsedIngredients = [];
    if (ingredients) {
        parsedIngredients = Array.isArray(ingredients) ? ingredients : JSON.parse(ingredients);
    }
    
    let parsedSteps = [];
    if (steps) {
        parsedSteps = Array.isArray(steps) ? steps : JSON.parse(steps);
    }

    const recipe = await Recipe.create({
      admin: req.admin.id,
      title,
      image: req.file.path,
      ingredients: parsedIngredients,
      steps: parsedSteps,
      prepTime,
      cookTime,
      categories: categories ? (Array.isArray(categories) ? categories : categories.split(',').map(c => c.trim())) : []
    });

    res.status(201).json({ success: true, data: recipe });
  } catch (err) {
    next(err);
  }
};

// @desc    Get Latest Recipes
// @route   GET /api/recipes/latest
// @access  Public
exports.getLatestRecipes = async (req, res, next) => {
  try {
    const recipes = await Recipe.find()
      .populate('admin', 'username')
      .sort({ createdAt: -1 })
      .limit(10);
      
    res.status(200).json({ success: true, data: recipes });
  } catch (err) {
    next(err);
  }
};

// @desc    Get Popular Recipes
// @route   GET /api/recipes/popular
// @access  Public
exports.getPopularRecipes = async (req, res, next) => {
  try {
    const recipes = await Recipe.find()
      .populate('admin', 'username')
      .sort({ savesCount: -1, likesCount: -1 })
      .limit(10);
      
    res.status(200).json({ success: true, data: recipes });
  } catch (err) {
    next(err);
  }
};
