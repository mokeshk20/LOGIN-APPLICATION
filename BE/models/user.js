const db = require('../config/database');
const bcrypt = require('bcrypt');

const User = {
  create: (userData, callback) => {
    bcrypt.hash(userData.password, 10, (err, hash) => {
      if (err) {
        return callback(err);
      }
      db.run(
        'INSERT INTO users (username, email, password, first_name, last_name) VALUES (?, ?, ?, ?, ?)',
        [userData.username, userData.email, hash, userData.first_name, userData.last_name],
        function(err) {
          if (err) {
            return callback(err);
          }
          return callback(null, { user_id: this.lastID });
        }
      );
    });
  },

  findByUsername: (username, callback) => {
    db.get('SELECT * FROM users WHERE username = ?', [username], (err, row) => {
      if (err) {
        return callback(err);
      }
      return callback(null, row);
    });
  },

  findById: (id, callback) => {
    db.get('SELECT * FROM users WHERE user_id = ?', [id], (err, row) => {
      if (err) {
        return callback(err);
      }
      return callback(null, row);
    });
  }
};

module.exports = User;