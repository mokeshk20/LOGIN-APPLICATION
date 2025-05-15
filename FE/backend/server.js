const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./src/routes/userRoutes');
const db = require('./database/db');
const logger = require('./src/utils/logger');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// Routes
app.use('/api/users', userRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).send('Something broke!');
});

// Function to start the server
async function startServer() {
  try {
    await db.sync();
    app.listen(port, () => {
      logger.info(`Server is running on port ${port}`);
    });
  } catch (err) {
    logger.error('Unable to connect to the database:', err);
  }
}

// Start the server
startServer();