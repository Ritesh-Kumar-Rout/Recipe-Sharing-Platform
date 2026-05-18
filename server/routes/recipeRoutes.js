const express = require('express');
const { 
  createRecipe, 
  getLatestRecipes, 
  getPopularRecipes, 
  getAllRecipesAdmin, 
  deleteRecipe, 
  getRecipeById, 
  getRecipes, 
  updateRecipe 
} = require('../controllers/recipeController');
const { protectAdmin } = require('../middleware/adminAuth');
const upload = require('../middleware/upload');

const router = express.Router();

router.post('/', protectAdmin, upload.single('image'), createRecipe);
router.get('/', getRecipes); // Public advanced fetching
router.get('/admin', protectAdmin, getAllRecipesAdmin);
router.get('/latest', getLatestRecipes);
router.get('/popular', getPopularRecipes);
router.get('/:id', getRecipeById);
router.put('/:id', protectAdmin, upload.single('image'), updateRecipe);
router.delete('/:id', protectAdmin, deleteRecipe);

module.exports = router;
