require('./loadEnvVars')();

const password       = process.env.JWT_SECRET;
const isProduction   = process.env.NODE_ENV === 'production';
const port           = parseInt(process.env.PORT);
const jwtExpTime     = parseInt(process.env.JWT_TIMEOUT_SECONDS);
const jwtRefreshTime = parseInt(process.env.JWT_MIN_REFRESH_DELAY_SECONDS);
const cookieName     = 'session';

const getToken = ({oAuthId, oAuthProvider}) => {
  if (!(oAuthId && oAuthProvider)) {
    throw new Error('Missing parameters');
  }
  return jwt.sign({oAuthId, oAuthProvider}, password, {
    expiresIn: jwtExpTime
  });
};

const generateScript = (html, {user, cardpacks, friends, requestsSent, requestsReceived}) => {
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
  <script>
    window.__PRELOADED_DATA__ = ${JSON.stringify(
      {
        notificationServerURL: process.env.NOTIFICATION_SERVER_URL,
        apiURL: process.env.PUBLIC_API_URL,
        gameServerURL: process.env.GAME_SERVER_URL
      }
    )}
  </script>
  ${html}`
};

const fs = require('fs');
const html = fs.readFileSync(`${__dirname}/../client/dist/index.html`).toString();
const bundle = fs.readFileSync(`${__dirname}/../client/dist/bundle.js`).toString();

const api             = require('../api');
const jwt             = require('jsonwebtoken');
const Hapi            = require('hapi');

const server = new Hapi.Server();
server.connection({port, host: isProduction ? undefined : 'localhost'});

server.register(require('bell'), (err) => {
  server.auth.strategy('google', 'bell', {
    provider: 'google',
    password,
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    location: server.info.uri,
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
          return reply.redirect('/').state(cookieName, getToken(resUser));
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
      let user = null;
      let friends = [];
      let requestsSent = [];
      let requestsReceived = [];
      let cardpacks = [];

      let tokenData;
      try {
        tokenData = jwt.verify(request.state[cookieName], password);
        const secondsToExp = tokenData.exp - Math.floor(Date.now() / 1000);
        if (secondsToExp <= jwtExpTime - jwtRefreshTime) {
          reply.state(cookieName, getToken(tokenData));
        }
      } catch (err) {
        // Token has expired or does not exist
      }
      if (tokenData) {
        user = await api.User.get({oAuthId: tokenData.oAuthId, oAuthProvider: tokenData.oAuthProvider}).catch(() => null);
        friends = await api.Friend.getFriends(user.id);
        requestsSent = await api.Friend.getSentRequests(user.id);
        requestsReceived = await api.Friend.getReceivedRequests(user.id);
        cardpacks = await api.Cardpack.getByUser(user.id);
      }
      
      reply(generateScript(html, {user, cardpacks, friends, requestsSent, requestsReceived}));
    }
  },
  {
    method: 'GET',
    path: '/vendor.js',
    handler: (request, reply) => {
      reply(vendor);
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
  }
]);

server.start().then(() => { console.log(`Server is running on port ${port}`); });