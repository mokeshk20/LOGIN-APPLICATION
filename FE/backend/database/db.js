const { Sequelize } = require('sequelize');
const logger = require('../src/utils/logger');
const config = require('../src/config/config');

const sequelize = new Sequelize(config.databaseURL, {
  dialect: 'postgres',
  logging: (msg) => logger.debug(msg),
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: process.env.NODE_ENV !== 'production' ? false : true // Only allow non-authorized connections in development
    }
  }
});

const connectDB = async (retryCount = 5) => {
  try {
    await sequelize.authenticate();
    logger.info('Connection has been established successfully.');
  } catch (error) {
    logger.error('Unable to connect to the database:', error);
    if (retryCount > 0) {
      logger.info(`Retrying database connection in 5 seconds... (attempts left: ${retryCount})`);
      await new Promise(resolve => setTimeout(resolve, 5000));
      await connectDB(retryCount - 1);
    } else {
      logger.error('Failed to connect to the database after multiple retries.');
      process.exit(1); // Exit the process if unable to connect after retries
    }
  }
};

connectDB();

module.exports = sequelize;