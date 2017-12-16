require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const session = require('express-session');
const Store = require('connect-session-sequelize')(session.Store);
const db = require('../database');
const url = require('url');
const path = require('path');
const apiRouter = require('./apiRoutes');
const cookieParser = require('cookie-parser');
const authRouter = require('./authRouter.js');
const passportSocketIo = require('passport.socketio');
const socketHandler = require('./socketHandler.js');
const compression = require('compression');

const gameURL = process.env.GAME_URL;
if (!gameURL) {
  throw new Error('Game URL is not defined in .env file');
}

const shouldCompress = (req, res) => {
  if (req.headers['x-no-compression']) {
    // don't compress responses with this request header 
    return false;
  }
 
  // fallback to standard filter function 
  return compression.filter(req, res);
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

app.use(compression({filter: shouldCompress}));

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
  if (req.user) {
    db.Cardpack.getByUserEmail(req.user.email)
      .then((cardpacks) => {
        db.Friend.get(req.user.email)
          .then((friendData) => {
            res.render('index', {
              user: JSON.stringify(req.user),
              gameURL: JSON.stringify(gameURL),
              cardpacks: JSON.stringify(cardpacks),
              friends: JSON.stringify(friendData.friends),
              requestsSent: JSON.stringify(friendData.requestsSent),
              requestsReceived: JSON.stringify(friendData.requestsReceived)
            });
          });
      });
  } else {
    res.render('index', {
      user: JSON.stringify(null),
      gameURL: JSON.stringify(gameURL),
      cardpacks: '[]',
      friends: '[]',
      requestsSent: '[]',
      requestsReceived: '[]'
    });
  }
});

let http = require('http').Server(app);
let io = require('socket.io')(http);

// Launch/export server
if (module.parent) {
  module.exports = http;
} else {
  let port = process.env.PORT || 3000;
  http.listen(port, () => {
    console.log('Listening on port ' + port);
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