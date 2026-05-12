const express = require('express');
const { createPost, getFeed, getExplorePosts, deletePost, likePost } = require('../controllers/postController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

router.post('/', protect, upload.array('images', 5), createPost);
router.get('/feed', protect, getFeed);
router.get('/explore', getExplorePosts);
router.delete('/:id', protect, deletePost);
router.put('/:id/like', protect, likePost);

module.exports = router;
