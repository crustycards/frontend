process.env.NODE_ENV = process.env.NODE_ENV || 'development';
process.env.PORT = process.env.PORT || 3000;

const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const session = require('express-session');
const Store = require('connect-session-sequelize')(session.Store);
const db = require('../database');
const url = require('url');
const env = require('dotenv').load();
const path = require('path');
const apiRouter = require('./apiRoutes');
const cookieParser = require('cookie-parser');
const authRouter = require('./authRouter.js');
const passportSocketIo = require('passport.socketio');
const socketHandler = require('./socketHandler.js');

// TODO - Remove this variable
const fakeGame = {
  hand: [
    {id: 54, text: 'cardOne', type: 'white'},
    {id: 34, text: 'cardTwo', type: 'white'},
    {id: 48, text: 'cardThree', type: 'white'},
    {id: 2, text: 'cardFour', type: 'white'},
    {id: 75, text: 'cardFive', type: 'white'}
  ],
  currentBlackCard: {id: 555, text: 'blackCard', type: 'black', answerFields: 2},
  whiteCardsPlayed: [],
  currentJudge: {},
  currentOwner: {},
  otherPlayers: [],
  roundStage: 'card play phase',
  nextStageStart: new Date().getTime(),
  isRunning: true
};

// Create session store
let store = new Store({db: db.connection});

// Initialize passport strategies
require('./auth')(passport, db.User.model);

// Sync database
db.connection.sync().then(() => {
  console.log('Nice! Database looks fine.');
}).catch((err) => {
  console.log('Uh oh. something went wrong when updating the database.');
  console.error(err);
});

// Create app
let app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'pug');

// ---- MIDDLEWARE ----
// Body parser
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
// Cookie parser
app.use(cookieParser());
// Passport and sessions
app.use(session({
  store,
  secret: 'thisisasecret',
  resave: true,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// Setup auth and api routing
app.use('/api', apiRouter(socketHandler));
app.use('/', authRouter); // Middleware redirector

// Serve static files
app.get('*/bundle.js', (req, res) => {
  res.sendFile(path.resolve(__dirname + '/../client/dist/bundle.js'));
});
app.get('/*', (req, res) => {
  res.render('index', {user: req.user ? JSON.stringify(req.user) : JSON.stringify(null), game: JSON.stringify(fakeGame), friends: '[]', requestsSent: '[]', requestsReceived: '[]'});
});

let http = require('http').Server(app);
let io = require('socket.io')(http);

// Launch/export server
if (module.parent) {
  module.exports = http;
} else {
  http.listen(process.env.PORT, () => {
    console.log('Listening on port ' + process.env.PORT);
  });
}

// Setup passport authentication for web sockets
io.use(passportSocketIo.authorize({
  key: 'connect.sid',
  secret: 'thisisasecret',
  store,
  passport: passport,
  cookieParser: cookieParser
}));

// Setup socket event handlers
io.on('connection', (socket) => {
  socketHandler.openSocket(socket);
  socket.on('disconnect', () => {
    socketHandler.closeSocket(socket);
  });
});