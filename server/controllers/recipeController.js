const Recipe = require('../models/Recipe');

// @desc    Create Recipe (Admin Only)
// @route   POST /api/recipes
// @access  Private (Admin)
exports.createRecipe = async (req, res, next) => {
  try {
    const { title, description, ingredients, steps, prepTime, cookTime, categories } = req.body;

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

    console.log("REQ ADMIN:", req.admin);
    console.log("REQ USER:", req.user);
    console.log("BODY:", req.body);

    const recipe = await Recipe.create({
      admin: req.admin._id || req.admin.id,
      title,
      description,
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

// @desc    Get Recipe by ID
// @route   GET /api/recipes/:id
// @access  Public
exports.getRecipeById = async (req, res, next) => {
  try {
    const recipe = await Recipe.findById(req.params.id)
      .populate('admin', 'username profileImage');
      
    if (!recipe) {
      return res.status(404).json({ success: false, error: 'Recipe not found' });
    }
      
    res.status(200).json({ success: true, data: recipe });
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
// @desc    Get All Recipes (Public with filtering/sorting/pagination)
// @route   GET /api/recipes/all
// @access  Public
exports.getRecipes = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search, category, sort } = req.query;
    
    const query = {};
    
    // Search by title or ingredients
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { ingredients: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Filter by category
    if (category && category !== 'All') {
      query.categories = category;
    }
    
    // Sorting
    let sortBy = { createdAt: -1 };
    if (sort === 'popular') {
      sortBy = { likesCount: -1, savesCount: -1 };
    } else if (sort === 'oldest') {
      sortBy = { createdAt: 1 };
    }
    
    const skip = (page - 1) * limit;
    
    const recipes = await Recipe.find(query)
      .populate('admin', 'username profileImage')
      .sort(sortBy)
      .skip(skip)
      .limit(parseInt(limit));
      
    const total = await Recipe.countDocuments(query);
      
    res.status(200).json({ 
      success: true, 
      count: recipes.length, 
      total,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit)
      },
      data: recipes 
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get All Recipes (Admin)
// @route   GET /api/recipes/admin
// @access  Private (Admin)
exports.getAllRecipesAdmin = async (req, res, next) => {
  try {
    const recipes = await Recipe.find()
      .populate('admin', 'username')
      .sort({ createdAt: -1 });
      
    res.status(200).json({ success: true, count: recipes.length, data: recipes });
  } catch (err) {
    next(err);
  }
};

// @desc    Update Recipe
// @route   PUT /api/recipes/:id
// @access  Private (Admin)
exports.updateRecipe = async (req, res, next) => {
  try {
    let recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({ success: false, error: 'Recipe not found' });
    }

    const { title, description, ingredients, steps, prepTime, cookTime, categories } = req.body;
    
    const updateData = {
      title,
      description,
      prepTime,
      cookTime,
      categories: categories ? (Array.isArray(categories) ? categories : categories.split(',').map(c => c.trim())) : recipe.categories
    };

    if (ingredients) {
      updateData.ingredients = Array.isArray(ingredients) ? ingredients : JSON.parse(ingredients);
    }
    
    if (steps) {
      updateData.steps = Array.isArray(steps) ? steps : JSON.parse(steps);
    }

    if (req.file) {
      updateData.image = req.file.path;
    }

    recipe = await Recipe.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true
    });

    res.status(200).json({ success: true, data: recipe });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete Recipe
// @route   DELETE /api/recipes/:id
// @access  Private (Admin)
exports.deleteRecipe = async (req, res, next) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ success: false, error: 'Recipe not found' });
    }

    await recipe.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    next(err);
  }
};
