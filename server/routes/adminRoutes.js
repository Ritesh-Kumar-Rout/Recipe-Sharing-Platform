const express = require('express');
const { adminLogin, getUsers, toggleBlockUser } = require('../controllers/adminController');
const { getDashboardStats, getGrowthAnalytics } = require('../controllers/adminAnalyticsController');
const { protectAdmin } = require('../middleware/adminAuth');

const router = express.Router();

router.post('/login', adminLogin);
router.get('/users', protectAdmin, getUsers);
router.put('/users/:id/block', protectAdmin, toggleBlockUser);

// Analytics
router.get('/stats', protectAdmin, getDashboardStats);
router.get('/analytics/growth', protectAdmin, getGrowthAnalytics);

module.exports = router;
