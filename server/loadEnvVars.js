const dotEnv = require('dotenv');
const { getDockerSecrets } = require('get-docker-secrets');
const assert = require('assert');

const requiredVars = ['NODE_ENV', 'GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET', 'callbackURL', 'JWT_SECRET', 'PUBLIC_API_URL', 'PRIVATE_API_URL'];
const assertVarsExist = () => {
  let missingVars = [];
  requiredVars.forEach((varName) => {
    if (!process.env[varName]) {
      missingVars.push(varName);
    }
  });

  if (missingVars.length) {
    throw new Error(`Missing the following environment variables: ${JSON.stringify(missingVars)}`);
  }
};

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
  applyCommandLineArguments();
  applyDefaultValues();
  assertVarsExist();
  assert([
    'development',
    'test',
    'production'
  ].includes(process.env.NODE_ENV), 'NODE_ENV must be either development, test, or production');
};