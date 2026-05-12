const express = require('express');
const { getUserProfile, updateProfile } = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

router.get('/:username', getUserProfile);
router.put('/profile', protect, upload.single('profileImage'), updateProfile);

module.exports = router;
