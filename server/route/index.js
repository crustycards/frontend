const searchRoutes = require('./search');
const cardRoutes = require('./card');
const userRoutes = require('./user');

module.exports = [].concat(searchRoutes, cardRoutes, userRoutes);