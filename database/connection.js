const Sequelize = require('sequelize');
const config = require('./configLoader.js');
let connection = new Sequelize(config.database, config.username, config.password, config);
connection.clear = () => {
  return connection.sync({force: true});
};

module.exports = connection;