import {Injectable} from '@nestjs/common';
import * as assert from 'assert';
import * as dotEnv from 'dotenv';
import {EnvironmentVariables} from './interfaces/environmentVariables.interface';

@Injectable()
export class EnvironmentService {
  private environmentVariables: EnvironmentVariables;

  private requiredVars = [
    'PORT',
    'NODE_ENV',
    'GOOGLE_CLIENT_ID',
    'GOOGLE_CLIENT_SECRET',
    'GOOGLE_REDIRECT_DOMAIN',
    'OAUTH_ENCRYPTION_PASSWORD',
    'API_URL',
    'GAME_SERVER_URL',
    'AUTH_SERVER_URL',
    'RABBITMQ_URI'
  ];

  private defaultVals: {[indexer: string]: string} = {
    PORT: '80',
    NODE_ENV: 'production'
  };

  constructor() {
    this.applyAndValidateEnvVars();

    this.environmentVariables = {
      port: parseInt(process.env.PORT, 10),
      nodeEnv: process.env.NODE_ENV,
      googleClientId: process.env.GOOGLE_CLIENT_ID,
      googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
      googleRedirectDomain: process.env.GOOGLE_REDIRECT_DOMAIN,
      oAuthEncryptionPassword: process.env.OAUTH_ENCRYPTION_PASSWORD,
      apiUrl: process.env.API_URL,
      gameServerUrl: process.env.GAME_SERVER_URL,
      authServerUrl: process.env.AUTH_SERVER_URL,
      rabbitMQURI: process.env.RABBITMQ_URI
    };
  }

  public getArgs(): EnvironmentVariables {
    return this.environmentVariables;
  }

  private applyAndValidateEnvVars() {
    // Load .env file
    dotEnv.config();

    // Load CLI args
    process.argv.slice(2).forEach((arg) => {
      const [key, value] = arg.split('=');
      process.env[key] = value;
    });

    const applyDefaultValues = () => {
      for (const key in this.defaultVals) {
        if (!process.env[key]) {
          process.env[key] = this.defaultVals[key];
        }
      }
    };

    const assertVarsExist = () => {
      const missingVars: string[] = [];
      this.requiredVars.forEach((varName) => {
        if (!process.env[varName]) {
          missingVars.push(varName);
        }
      });

      if (missingVars.length) {
        throw new Error(`Missing the following environment variables: ${JSON.stringify(missingVars)}`);
      }
    };

    applyDefaultValues();

    assertVarsExist();

    assert([
      'development',
      'test',
      'production'
    ].includes(process.env.NODE_ENV), 'NODE_ENV must be either development, test, or production');

    assert(!isNaN(parseInt(process.env.PORT, 10)), 'PORT must be an integer');
  }
}
