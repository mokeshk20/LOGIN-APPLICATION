const jwt = require('jsonwebtoken');
const config = require('../config/config');
const logger = require('../utils/logger');

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    logger.warn('Unauthorized access: Missing or invalid Authorization header');
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];

  jwt.verify(token, config.jwtSecret, (err, user) => {
    if (err) {
      logger.warn(`Unauthorized access: Invalid token - ${err.message}`);
      return res.status(401).json({ error: 'Unauthorized' });
    }

    req.user = user; // Attach user payload to the request
    next();
  });
};

module.exports = { authenticate };