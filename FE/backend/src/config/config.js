require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3000,
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key', // Use a strong, randomly generated secret in production
  databasePath: process.env.DATABASE_PATH || './database/database.db',
  logLevel: process.env.LOG_LEVEL || 'info',
};