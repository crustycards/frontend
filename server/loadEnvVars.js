const dotEnv = require('dotenv');
const assert = require('assert');

const requiredVars = [
  'NODE_ENV',
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET',
  'OAUTH_ENCRYPTION_PASSWORD',
  'API_URL',
  'GAME_SERVER_URL',
  'AUTH_SERVER_URL'
];

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
  PORT: 80
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
  process.argv.slice(2).forEach((arg) => {
    const [key, value] = arg.split('=');
    process.env[key] = value;
  });
};

module.exports = () => {
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
