const express = require('express');
const { toggleLike, addComment, toggleFollow, checkFollow } = require('../controllers/interactionController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/like/:postId', protect, toggleLike);
router.post('/comment/:postId', protect, addComment);
router.post('/follow/:userIdToFollow', protect, toggleFollow);
router.get('/check-follow/:userId', protect, checkFollow);

module.exports = router;
