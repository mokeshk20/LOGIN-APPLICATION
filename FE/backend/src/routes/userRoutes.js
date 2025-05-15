const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

// @route   GET /api/users/me
// @desc    Get user profile
// @access  Private
router.get('/me', authMiddleware.authenticateToken, userController.getProfile);

module.exports = router;