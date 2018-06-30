require('./loadEnvVars')();

const password = process.env.JWT_SECRET;
const isProduction = process.env.NODE_ENV === 'production';
const port = parseInt(process.env.PORT);
const jwtExpTime = parseInt(process.env.JWT_TIMEOUT_SECONDS);
// TODO - Set jwtRefreshTime in env file and varLoader
const jwtRefreshTime = parseInt(process.env.JWT_MIN_REFRESH_DELAY_SECONDS);
const cookieName = 'session';

const getToken = (userId) => {
  if (!userId) {
    throw new Error('Missing user ID');
  }
  return jwt.sign({userId}, password, {
    expiresIn: jwtExpTime
  });
};

const fs = require('fs');
const html = fs.readFileSync(`${__dirname}/../client/dist/index.html`).toString();
const bundle = fs.readFileSync(`${__dirname}/../client/dist/bundle.js`).toString();
const firebaseServiceWorker = fs.readFileSync(`${__dirname}/../client/src/firebase-messaging-sw.js`).toString();

const generateScript = ({user = null, cardpacks = [], friends = [], requestsSent = [], requestsReceived = []} = {}) => {
  return `<script>
    window.__PRELOADED_STATE__ = ${JSON.stringify(
    {
      currentUser: user,
      friends,
      requestsSent,
      requestsReceived,
      cardpacks
    }
  )}
  </script>
  ${html}`;
};

const api = require('../api');
const jwt = require('jsonwebtoken');
const Hapi = require('hapi');

const server = new Hapi.Server();
server.connection({port, host: process.env.HOST || (isProduction ? undefined : 'localhost')});

server.register(require('bell'), (err) => {
  server.auth.strategy('google', 'bell', {
    provider: 'google',
    password,
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    location: process.env.OAUTH_REDIRECT_DOMAIN || server.info.uri,
    isSecure: false
  });

  server.state(cookieName, {
    isSecure: false,
    encoding: 'base64json',
    path: '/'
  });

  server.route({
    method: 'GET',
    path: '/auth/google',
    config: {
      auth: {
        strategy: 'google',
        mode: 'try'
      },
      handler: async (request, reply) => {
        if (!request.auth.isAuthenticated) {
          return reply('Authentication failed due to: ' + request.auth.error.message);
        }

        // Account lookup/registration
        const userData = {
          name: request.auth.credentials.profile.displayName,
          oAuthId: request.auth.credentials.profile.id,
          oAuthProvider: request.auth.credentials.provider
        };
        try {
          let resUser = await api.User.findOrCreate(userData);
          return reply.redirect('/').state(cookieName, getToken(resUser.id));
        } catch (err) {
          console.log(err);
        }
      }
    }
  });
});

server.route([
  {
    method: 'GET',
    path: '/{any*}',
    handler: async (request, reply) => {
      try {
        const tokenData = jwt.verify(request.state[cookieName], password);
        const secondsToExp = tokenData.exp - Math.floor(Date.now() / 1000);
        if (secondsToExp <= jwtExpTime - jwtRefreshTime) {
          reply.state(cookieName, getToken(tokenData.userId));
        }
        const user = await api.User.get({id: tokenData.userId});
        const friends = await api.Friend.getFriends(user.id);
        const requestsSent = await api.Friend.getSentRequests(user.id);
        const requestsReceived = await api.Friend.getReceivedRequests(user.id);
        const cardpacks = await api.Cardpack.getByUser(user.id);
        return reply(generateScript({user, cardpacks, friends, requestsSent, requestsReceived}));
      } catch (err) {
        return reply(generateScript());
      }
    }
  },
  {
    method: 'GET',
    path: '/bundle.js',
    handler: (request, reply) => {
      reply(bundle);
    }
  },
  {
    method: 'GET',
    path: '/logout',
    handler: (request, reply) => {
      reply.redirect('/login').unstate(cookieName);
    }
  },
  {
    method: 'GET',
    path: '/firebase-messaging-sw.js',
    handler: (request, reply) => {
      reply(firebaseServiceWorker).header('Content-Type', 'application/javascript');
    }
  }
]);

server.register({register: require('h2o2')});
server.route(require('./route'));

server.start().then(() => {
 console.log(`Server is running on port ${port}`);
});
