require('./loadEnvVars.ts')();

const isProduction = process.env.NODE_ENV === 'production';
const port = parseInt(process.env.PORT);
const cookieName = 'session';

const fs = require('fs');
const html = fs.readFileSync(`${__dirname}/../client/dist/index.html`).toString();
const bundle = fs.readFileSync(`${__dirname}/../client/dist/bundle.js`).toString();
const serviceWorker = fs.readFileSync(
  `${__dirname}/../client/src/serviceWorker/serviceWorker.js`
).toString();

const generateScript = ({
  user = null
} = {}) => (
  `<script>
    window.__PRELOADED_STATE__ = ${JSON.stringify({user})}
  </script>
  ${html}`
);

const api = require('../api');
const Hapi = require('hapi');
const {Auth} = require('../api');

const startServer = async () => {
  const server = new Hapi.Server({
    port,
    host: process.env.HOST || (isProduction ? undefined : 'localhost')
  });

  await server.register(require('bell'))
    .then(() => {
      server.auth.strategy('google', 'bell', {
        provider: 'google',
        password: process.env.OAUTH_ENCRYPTION_PASSWORD,
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
        options: {
          auth: {
            strategy: 'google',
            mode: 'try'
          },
          handler: async (request, h) => {
            if (!request.auth.isAuthenticated) {
              console.error(request.auth.error);
              return `Authentication failed due to: ${request.auth.error.message}`;
            }

            // Account lookup/registration
            const userData = {
              name: request.auth.credentials.profile.displayName,
              oAuthId: request.auth.credentials.profile.id,
              oAuthProvider: request.auth.credentials.provider
            };
            try {
              const resUser = await api.User.findOrCreate(userData);
              const session = await Auth.createSession(resUser.id);
              return h.redirect('/').state(cookieName, session.id);
            } catch (err) {
              console.error(err);
              return 'Failed to authenticate user:', err;
            }
          }
        }
      });
    });

    server.route([
      {
        method: 'GET',
        path: '/{any*}',
        handler: async (request, h) => {
          try {
            const session = await Auth.getSession(request.state[cookieName]);
            const user = await api.User.get({id: session.userId});
            return generateScript({user});
          } catch (err) {
            return generateScript();
          }
        }
      },
      {
        method: 'GET',
        path: '/bundle.js',
        handler: (request, h) => {
          return bundle;
        }
      },
      {
        method: 'GET',
        path: '/logout',
        handler: async (request, h) => {
          await Auth.deleteSession(request.state[cookieName]);
          return h.redirect('/login').unstate(cookieName);
        }
      },
      {
        method: 'GET',
        path: '/firebase-messaging-sw.js',
        handler: (request, h) => {
          return h.response(serviceWorker).header('Content-Type', 'application/javascript');
        }
      }
    ]);

    await server.register({plugin: require('h2o2')});
    server.route(require('./route'));

    await server.start().then(() => {
      console.log(`Server is running on port ${port}`);
    });

    return server;
};

startServer();
