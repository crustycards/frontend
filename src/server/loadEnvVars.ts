import * as assert from 'assert';
import * as dotEnv from 'dotenv';

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
  const missingVars: string[] = [];
  requiredVars.forEach((varName) => {
    if (!process.env[varName]) {
      missingVars.push(varName);
    }
  });

  if (missingVars.length) {
    throw new Error(`Missing the following environment variables: ${JSON.stringify(missingVars)}`);
  }
};

interface StringHashObject {
  [indexer: string]: string;
}

const defaultVals: StringHashObject = {
  NODE_ENV: 'production',
  PORT: '80'
};

const applyEnvConfig = () => {
  dotEnv.config();
};

const applyDefaultValues = () => {
  for (const key in defaultVals) {
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

export default function() {
  applyEnvConfig();
  applyCommandLineArguments();
  applyDefaultValues();
  assertVarsExist();
  assert([
    'development',
    'test',
    'production'
  ].includes(process.env.NODE_ENV), 'NODE_ENV must be either development, test, or production');
}
