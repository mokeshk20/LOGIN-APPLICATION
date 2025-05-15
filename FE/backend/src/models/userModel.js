const db = require('../database/db');
const logger = require('../utils/logger');

const getUserById = async (userId) => {
  try {
    const query = 'SELECT user_id, username, password_hash, email, created_at, updated_at FROM users WHERE user_id = ?';
    const [rows] = await db.query(query, [userId]);

    if (rows.length === 0) {
      return null;
    }

    return rows[0];
  } catch (error) {
    logger.error(`Error getting user by ID: ${error.message}`, { stack: error.stack });
    throw error;
  }
};

const updateUser = async (user) => {
    try {
        const query = `
            UPDATE users 
            SET 
                email = ?, 
                password_hash = ?,
                updated_at = ?
            WHERE 
                user_id = ?
        `;
        const [result] = await db.query(query, [user.email, user.password_hash, user.updated_at, user.user_id]);

        if (result.affectedRows === 0) {
            logger.warn(`User not updated. User ID: ${user.user_id}`);
            return false;
        }

        logger.info(`User updated successfully. User ID: ${user.user_id}`);
        return true;
    } catch (error) {
        logger.error(`Error updating user: ${error.message}`, { stack: error.stack });
        throw error;
    }
};


module.exports = {
  getUserById,
  updateUser,
};