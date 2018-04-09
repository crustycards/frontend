const dotEnv = require('dotenv');
const { getDockerSecrets } = require('get-docker-secrets');
const assert = require('assert');

const defaultVals = {
  NODE_ENV: 'production',
  JWT_TIMEOUT_SECONDS: 60 * 60 * 24,
  PORT: 80
};

const applyDockerSecrets = () => {
  Object.assign(process.env, getDockerSecrets());
};

const applyEnvConfig = () => {
  dotEnv.config();
};

const applyDefaultValues = () => {
  for (let key in defaultVals) {
    if (!process.env[key]) {
      process.env[key] = defaultVals[key];
    }
  }
};

const applyCommandLineArguments = () => {
  process.argv.slice(2).forEach(arg => {
    [key, value] = arg.split('=');
    process.env[key] = value;
  });
};

module.exports = () => {
  applyDockerSecrets();
  applyEnvConfig();
  applyDefaultValues();
  applyCommandLineArguments();
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
  assert(!!process.env.PUBLIC_API_URL, 'Missing public api url - please add docker secret with a name of PUBLIC_API_URL');
  assert(!!process.env.PUBLIC_API_URL, 'Missing private api url - please add docker secret with a name of PRIVATE_API_URL');
};