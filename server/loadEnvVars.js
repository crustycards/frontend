const dotEnv = require('dotenv');
const { getDockerSecrets } = require('get-docker-secrets');
const assert = require('assert');

const defaultVals = {
  PORT: 80,
  NODE_ENV: 'production',
  API_URL: 'http://api',
  JWT_TIMEOUT_SECONDS: 60 * 60 * 24
};

module.exports = () => {
  Object.assign(process.env, getDockerSecrets());
  dotEnv.config();
  for (let key in defaultVals) {
    if (!process.env[key]) {
      process.env[key] = defaultVals[key];
    }
  }
  process.argv.slice(2).forEach(arg => {
    [key, value] = arg.split('=');
    process.env[key] = value;
  });
  assert(!!process.env.NODE_ENV, 'Missing environment type - please add docker secret with a name of NODE_ENV');
  assert([
    'development',
    'test',
    'production'
  ].includes(process.env.NODE_ENV), 'NODE_ENV must be either development, test, or production');
  assert(!!process.env.GOOGLE_CLIENT_ID, 'Missing Google oAuth client id - please add docker secret with a name of GOOGLE_CLIENT_ID');
  assert(!!process.env.GOOGLE_CLIENT_SECRET, 'Missing Google oAuth client secret - please add docker secret with a name of GOOGLE_CLIENT_SECRET');
  assert(!!process.env.callbackURL, 'Missing Google oAuth callback URL - please add docker secret with a name of callbackURL');
  assert(!!process.env.JWT_SECRET, 'Missing JWT secret - please add docker secret with a name of JWT_SECRET');
  if (process.env.NODE_ENV === 'production') {
    assert(!!process.env.WEB_TLS_KEY, 'Missing http2 TLS private key - please add docker secret with a name of WEB_TLS_KEY');
    assert(!!process.env.WEB_TLS_CERTIFICATE, 'Missing http2 TLS certificate - please add docker secret with a name of WEB_TLS_CERTIFICATE');
  }
};