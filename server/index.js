require('./loadEnvVars')();

const password       = process.env.JWT_SECRET;
const isProduction   = process.env.NODE_ENV === 'production';
const port           = parseInt(process.env.PORT);
const jwtExpTime     = parseInt(process.env.JWT_TIMEOUT_SECONDS);
const jwtRefreshTime = parseInt(process.env.JWT_MIN_REFRESH_DELAY_SECONDS); // TODO - Set this variable in env file and varLoader
const cookieName     = 'session';
// const apiUrl         = process.env.API_URL; // Add this env var to the loadvars file
const apiUrl = 'http://localhost:8080';

const getToken = (userId) => {
  if (!userId) {
    throw new Error('Missing user ID');
  }
  return jwt.sign({userId}, password, {
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
const Boom            = require('boom');

const server = new Hapi.Server();
server.connection({port, host: process.env.HOST || isProduction ? undefined : 'localhost'});

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
          return reply.redirect('/').state(cookieName, getToken(resUser.id));
        } catch (err) {
          console.log(err);
        }
      }
    }
  });
});

server.register({register: require('h2o2')});

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
          reply.state(cookieName, getToken(tokenData.userId));
        }
      } catch (err) {
        // Token has expired or does not exist
      }
      if (tokenData) {
        user = await api.User.get({id: tokenData.userId});
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

server.route([
  {
    method: 'GET',
    path: '/api/cardpack/search',
    handler: (request, reply) => {
      const query = request.query.query;

      reply.proxy({ uri: `${apiUrl}/cardpack/search${query ? `?query=${query}` : ''}` });
    }
  },
  {
    method: 'GET',
    path: '/api/cardpack/search/autocomplete',
    handler: (request, reply) => {
      const query = request.query.query;

      reply.proxy({ uri: `${apiUrl}/cardpack/search/autocomplete${query ? `?query=${query}` : ''}` });
    }
  },
  {
    method: 'GET',
    path: '/api/user/search',
    handler: (request, reply) => {
      const query = request.query.query;

      reply.proxy({ uri: `${apiUrl}/user/search${query ? `?query=${query}` : ''}` });
    }
  },
  {
    method: 'GET',
    path: '/api/user/search/autocomplete',
    handler: (request, reply) => {
      const query = request.query.query;

      reply.proxy({ uri: `${apiUrl}/user/search/autocomplete${query ? `?query=${query}` : ''}` });
    }
  }
]);

server.route([
  {
    method: 'DELETE',
    path: '/api/cardpack/{id}',
    handler: (request, reply) => {
      reply.proxy({ uri: `${apiUrl}/cardpack/{id}` });
    },
    config: { payload: { parse: false } }
  },
  {
    method: 'GET',
    path: '/api/cardpack/{id}',
    handler: (request, reply) => {
      reply.proxy({ uri: `${apiUrl}/cardpack/{id}` });
    }
  },
  {
    method: 'PATCH',
    path: '/api/cardpack/{id}',
    handler: (request, reply) => {
      reply.proxy({ uri: `${apiUrl}/cardpack/{id}` });
    },
    config: { payload: { parse: false } }
  },
  {
    method: 'PUT',
    path: '/api/cardpack/cards/black/{id}',
    handler: (request, reply) => {
      reply.proxy({ uri: `${apiUrl}/cardpack/{id}/cards/black` });
    },
    config: { payload: { parse: false } }
  },
  {
    method: 'PUT',
    path: '/api/cardpack/cards/white/{id}',
    handler: (request, reply) => {
      reply.proxy({ uri: `${apiUrl}/cardpack/{id}/cards/white` });
    },
    config: { payload: { parse: false } }
  },
  {
    method: 'DELETE',
    path: '/api/cards/black/{id}',
    handler: (request, reply) => {
      reply.proxy({ uri: `${apiUrl}/cards/black/{id}` });
    },
    config: { payload: { parse: false } }
  },
  {
    method: 'DELETE',
    path: '/api/cards/white/{id}',
    handler: (request, reply) => {
      reply.proxy({ uri: `${apiUrl}/cards/white/{id}` });
    },
    config: { payload: { parse: false } }
  },
  {
    method: 'PUT',
    path: '/api/cardpacks/{userId}',
    handler: (request, reply) => {
      reply.proxy({ uri: `${apiUrl}/{userId}/cardpack` });
    },
    config: { payload: { parse: false } }
  },
  {
    method: 'GET',
    path: '/api/cardpacks/{id}',
    handler: (request, reply) => {
      reply.proxy({ uri: `${apiUrl}/{id}/cardpacks` });
    }
  }
]);

server.route([
  {
    method: 'GET',
    path: '/api/user/{id}',
    handler: (request, reply) => {
      reply.proxy({ uri: `${apiUrl}/user/{id}` });
    }
  },
  {
    method: 'PATCH',
    path: '/api/user/{id}',
    handler: (request, reply) => {
      reply.proxy({ uri: `${apiUrl}/user/{id}` });
    },
    config: { payload: { parse: false } }
  },
  {
    method: 'GET',
    path: '/api/user/friends/{id}',
    handler: (request, reply) => {
      reply.proxy({ uri: `${apiUrl}/user/{id}/friends` });
    }
  },
  {
    method: 'GET',
    path: '/api/user/friends/requests/sent/{id}',
    handler: (request, reply) => {
      reply.proxy({ uri: `${apiUrl}/user/{id}/friends/requests/sent` });
    }
  },
  {
    method: 'GET',
    path: '/api/user/friends/requests/received/{id}',
    handler: (request, reply) => {
      reply.proxy({ uri: `${apiUrl}/user/{id}/friends/requests/received` });
    }
  },
  {
    method: ['PUT', 'DELETE'],
    path: '/api/user/friends',
    handler: (request, reply) => {
      const { userId, friendId } = request.query;

      if (userId === undefined || friendId === undefined) {
        reply(Boom.badRequest('Must provide query parameters for userId and friendId'))
      } else {
        reply.proxy({ uri: `${apiUrl}/user/${frienderId}/friends/${friendeeId}` });
      }
    },
    config: { payload: { parse: false } }
  }
]);

server.start().then(() => { console.log(`Server is running on port ${port}`); });