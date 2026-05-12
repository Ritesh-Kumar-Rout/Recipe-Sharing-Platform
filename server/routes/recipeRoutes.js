const express = require('express');
const { createRecipe, getLatestRecipes, getPopularRecipes } = require('../controllers/recipeController');
const { protectAdmin } = require('../middleware/adminAuth');
const upload = require('../middleware/upload');

const router = express.Router();

router.post('/', protectAdmin, upload.single('image'), createRecipe);
router.get('/latest', getLatestRecipes);
router.get('/popular', getPopularRecipes);

module.exports = router;
