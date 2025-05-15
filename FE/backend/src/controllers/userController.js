const jwt = require('jsonwebtoken');
const User = require('../models/user'); // Assuming you have a User model
const config = require('../config/config');

// @desc    Get user profile
// @route   GET /api/users/me
// @access  Private
const getProfile = async (req, res) => {
  try {
    // User ID is already attached to the request object by the authMiddleware
    const userId = req.user.userId;

    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Omit passwordHash from the response
    const { userId: id, username, email } = user;
    res.status(200).json({ userId: id, username, email });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  getProfile,
};