const db = require('../connection');
const Sequelize = require('sequelize');

const UserModel = db.define('users', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  googleId: {
    type: Sequelize.STRING,
    unique: true
  },
  firstname: {
    type: Sequelize.STRING,
    notEmpty: true,
    allowNull: false
  },
  lastname: {
    type: Sequelize.STRING,
    notEmpty: true,
    allowNull: false
  },
  email: {
    type: Sequelize.STRING,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: Sequelize.STRING
  }
});

let User = {model: UserModel};

// Accepts a user's email and returns the
// user stored in the database
//
// Exceptions:
// 1. userEmail does not map to any existing users
User.getByEmail = (userEmail) => {
  return User.model.findOne({
    where: {
      email: userEmail
    }
  })
    .then((userData) => {
      if (!userData) {
        return Promise.reject('No user is registered under ' + userEmail);
      } else {
        delete userData.dataValues.password; // Prevents password from being sent over http/sockets
        return userData.dataValues;
      }
    });
};

User.getById = (userId) => {
  return User.model.findById(userId)
    .then((userData) => {
      if (!userData) {
        return Promise.reject('No user has ID ' + userId);
      } else {
        delete userData.dataValues.password;
        return userData.dataValues;
      }
    });
};

module.exports = User;