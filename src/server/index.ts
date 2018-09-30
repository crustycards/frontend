import * as Hapi from 'hapi';
import * as Bell from 'bell';
import * as fs from 'fs';
import loadEnvVars from './loadEnvVars';
import Api from './api';
import {ResponseToolkit, Request} from 'hapi';

loadEnvVars();

const isProduction = process.env.NODE_ENV === 'production';
const port = parseInt(process.env.PORT);
const cookieName = 'session';

const html = fs.readFileSync(`${__dirname}/../client/dist/index.html`).toString();
const bundle = fs.readFileSync(`${__dirname}/../client/dist/bundle.js`).toString();
const serviceWorker = fs.readFileSync(`${__dirname}/../client/src/serviceWorker/serviceWorker.js`).toString();

const api = new Api({authUrl: process.env.AUTH_SERVER_URL, apiUrl: process.env.API_URL});

const generateScript = (user: any = null) => (
  `<script>
    window.__PRELOADED_STATE__ = ${JSON.stringify({user})}
  </script>
  ${html}`
);

interface GoogleOAuthRequestAuth extends Hapi.RequestAuth {
  credentials: {
    profile: any,
    provider: any
  }
}

interface GoogleOAuthRequest extends Request {
  auth: GoogleOAuthRequestAuth
}

const startServer = async () => {
  const server = new Hapi.Server({
    port,
    host: process.env.HOST || (isProduction ? undefined : 'localhost')
  });

  await server.register(Bell)
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
            handler: async (request: GoogleOAuthRequest, h: ResponseToolkit) => {
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
                const resUser = await api.user.findOrCreate(userData);
                const session = await api.auth.createSession(resUser.id);
                return h.redirect('/').state(cookieName, session.id);
              } catch (err) {
                console.error(err);
                return `Failed to authenticate user: ${err}`;
              }
            }
          }
        });
      });

  server.route([
    {
      method: 'GET',
      path: '/{any*}',
      handler: async (request: Request, h: ResponseToolkit) => {
        try {
          const session = await api.auth.getSession(request.state[cookieName]);
          const user = await api.user.getById(session.userId);
          return generateScript(user);
        } catch (err) {
          return generateScript();
        }
      }
    },
    {
      method: 'GET',
      path: '/bundle.js',
      handler: (request: Request, h: ResponseToolkit) => {
        return bundle;
      }
    },
    { 
      method: 'GET',
      path: '/logout',
      handler: async (request: Request, h: ResponseToolkit) => {
        await api.auth.deleteSession(request.state[cookieName]);
        return h.redirect('/login').unstate(cookieName);
      }
    },
    {
      method: 'GET',
      path: '/firebase-messaging-sw.js',
      handler: (request: Request, h: ResponseToolkit) => {
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
