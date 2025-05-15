const logger = require('../../backend/src/utils/logger');

exports.up = (db) => {
  return new Promise((resolve, reject) => {
    db.run(`
      CREATE TABLE IF NOT EXISTS Users (
        userId INTEGER PRIMARY KEY AUTOINCREMENT,
        username VARCHAR(255) UNIQUE NOT NULL,
        passwordHash VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        resetToken VARCHAR(255) NULL,
        resetTokenExpiry DATETIME NULL,
        failedLoginAttempts INTEGER DEFAULT 0,
        lockoutExpiry DATETIME NULL
      )
    `, (err) => {
      if (err) {
        logger.error(`Migration failed: ${err}`);
        reject(err);
      } else {
        logger.info('Migration: Created Users table');
        resolve();
      }
    });
  });
};

exports.down = (db) => {
  return new Promise((resolve, reject) => {
    db.run(`DROP TABLE IF EXISTS Users`, (err) => {
      if (err) {
        logger.error(`Rollback failed: ${err}`);
        reject(err);
      } else {
        logger.info('Rollback: Dropped Users table');
        resolve();
      }
    });
  });
};