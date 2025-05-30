const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { check } = require('express-validator');
const auth = require('../middleware/auth');

// Registration route
router.post(
  '/register',
  [
    check('username', 'Username is required').not().isEmpty().isAlphanumeric().isLength({ min: 3, max: 150 }),
    check('email', 'Please include a valid email').isEmail().isLength({ max: 254 }),
    check(
      'password',
      'Please enter a password with 8 or more characters, one uppercase, one lowercase, one number and one special character'
    ).isLength({ min: 8 }).matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/),
    check('first_name', 'First name must be less than 30 characters').optional().isLength({ max: 30 }),
    check('last_name', 'Last name must be less than 30 characters').optional().isLength({ max: 30 })
  ],
  userController.register
);

// Login route
router.post('/login', [
  check('username', 'Username is required').not().isEmpty(),
  check('password', 'Password is required').not().isEmpty()
], userController.login);

router.get('/me', auth, userController.getUserById);

module.exports = router;