const dotEnv = require('dotenv');
const { getDockerSecrets } = require('get-docker-secrets');
const assert = require('assert');

const defaultVals = {
  PORT: 80,
  NODE_ENV: 'production',
  API_URL: 'http://api',
  JWT_TIMEOUT_SECONDS: 1000
};

module.exports = () => {
  Object.assign(process.env, getDockerSecrets());
  dotEnv.config();
  for (let key in defaultVals) {
    if (!process.env[key]) {
      process.env[key] = defaultVals[key];
    }
  }
  assert(!!process.env.NODE_ENV, 'Missing environment type - please add docker secret with a name of NODE_ENV');
  assert([
    'development',
    'test',
    'production'
  ].includes(process.env.NODE_ENV), 'NODE_ENV must be either development, test, or production');
  assert(!!process.env.JWT_SECRET, 'Missing Google oAuth client id - please add docker secret with a name of GOOGLE_CLIENT_ID');
  assert(!!process.env.JWT_SECRET, 'Missing Google oAuth client secret - please add docker secret with a name of GOOGLE_CLIENT_SECRET');
  assert(!!process.env.JWT_SECRET, 'Missing Google oAuth callback URL - please add docker secret with a name of callbackURL');
  assert(!!process.env.JWT_SECRET, 'Missing JWT secret - please add docker secret with a name of JWT_SECRET');
  assert(!!process.env.WEB_TLS_KEY, 'Missing http2 TLS private key - please add docker secret with a name of WEB_TLS_KEY');
  assert(!!process.env.WEB_TLS_CERTIFICATE, 'Missing http2 TLS certificate - please add docker secret with a name of WEB_TLS_CERTIFICATE');
  process.env.PORT = parseInt(process.env.PORT);
  process.env.JWT_TIMEOUT_SECONDS = parseInt(process.env.JWT_TIMEOUT_SECONDS);
};



// PORT=3000
// NODE_ENV=development/test/production
// API_URL=http://localhost:8080/
// JWT_SECRET=supersecretpassword
// JWT_TIMEOUT_SECONDS=1000

// # Google OAuth
// GOOGLE_CLIENT_ID=test.example.com
// GOOGLE_CLIENT_SECRET=123456789
// callbackURL=http://localhost:3000/auth/google/callback

// # Game Logic Microservice URL
// GAME_URL=http://localhost:8000