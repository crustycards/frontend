const searchRoutes = require('./search');
const cardRoutes = require('./card');
const userRoutes = require('./user');
const gameRoutes = require('./game');
const authRoutes = require('./auth');

module.exports = [].concat(searchRoutes, cardRoutes, userRoutes, gameRoutes, authRoutes);
