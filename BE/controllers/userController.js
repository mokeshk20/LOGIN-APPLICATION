const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
require('dotenv').config();

const userController = {
  register: async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.mapped() });
    }

    User.create(req.body, (err, user) => {
      if (err) {
        if (err.code === 'SQLITE_CONSTRAINT') {
          if (err.message.includes('username')) {
            return res.status(400).json({ errors: { username: ['Username already exists'] } });
          } else if (err.message.includes('email')) {
            return res.status(400).json({ errors: { email: ['Email already exists'] } });
          }
        }
        return res.status(500).json({ errors: { message: ['Failed to register user'] } });
      }
      return res.status(201).json({ message: 'User registered successfully' });
    });
  },

  login: (req, res) => {
    const { username, password } = req.body;

    User.findByUsername(username, (err, user) => {
      if (err) {
        return res.status(500).json({ message: 'Internal server error' });
      }
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) {
          return res.status(500).json({ message: 'Internal server error' });
        }
        if (!isMatch) {
          return res.status(401).json({ message: 'Invalid credentials' });
        }

        const payload = {
          user: {
            id: user.user_id
          }
        };

        jwt.sign(
          payload,
          process.env.JWT_SECRET,
          { expiresIn: '1h' },
          (err, token) => {
            if (err) {
              return res.status(500).json({ message: 'Failed to generate token' });
            }
            return res.json({ token });
          }
        );
      });
    });
  },
  getUserById: (req, res) => {
    User.findById(req.user.id, (err, user) => {
      if (err) {
        return res.status(500).json({ message: 'Internal server error' });
      }
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      // Omit the password from the response
      const { password, ...userData } = user;
      return res.json(userData);
    });
  }
};

module.exports = userController;