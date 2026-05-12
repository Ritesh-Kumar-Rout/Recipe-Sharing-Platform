const express = require('express');
const { toggleLike, addComment, toggleFollow } = require('../controllers/interactionController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/like/:postId', protect, toggleLike);
router.post('/comment/:postId', protect, addComment);
router.post('/follow/:userIdToFollow', protect, toggleFollow);

module.exports = router;
