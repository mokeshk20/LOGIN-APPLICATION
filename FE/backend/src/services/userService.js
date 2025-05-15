const userModel = require('../models/userModel');
const logger = require('../utils/logger');

class UserService {
  async updateProfile(userId, email) {
    try {
      await userModel.updateProfile(userId, email);
      logger.debug(`Profile updated successfully in service for user ID: ${userId}`);
    } catch (error) {
      logger.error(`Error updating profile in service: ${error.message}`, { stack: error.stack });
      throw error;
    }
  }
}

module.exports = new UserService();