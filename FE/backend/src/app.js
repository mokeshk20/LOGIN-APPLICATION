const express = require('express');
const userRoutes = require('./routes/userRoutes');
const logger = require('../utils/logger');
const config = require('./config/config');

const app = express();

app.use(express.json());

// Routes
app.use('/api/users', userRoutes);

// Error handling middleware (example)
app.use((err, req, res, next) => {
  logger.error(`Unhandled error: ${err.message}`, { stack: err.stack });
  res.status(500).json({ error: 'Internal Server Error' });
});

module.exports = app;