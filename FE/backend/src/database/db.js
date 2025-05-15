const sqlite3 = require('sqlite3').verbose();
const config = require('./../config/config');
const logger = require('./../utils/logger');

const db = new sqlite3.Database(config.databasePath, (err) => {
  if (err) {
    logger.error('Database connection error:', err.message);
  } else {
    logger.info('Connected to the database.');
  }
});

module.exports = db;