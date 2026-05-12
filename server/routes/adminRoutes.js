const express = require('express');
const { adminLogin, getUsers, toggleBlockUser } = require('../controllers/adminController');
const { protectAdmin } = require('../middleware/adminAuth');

const router = express.Router();

router.post('/login', adminLogin);
router.get('/users', protectAdmin, getUsers);
router.put('/users/:id/block', protectAdmin, toggleBlockUser);

module.exports = router;
