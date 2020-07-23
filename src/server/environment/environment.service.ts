import {Injectable} from '@nestjs/common';
import * as dotEnv from 'dotenv';
import {
  EnvironmentVariables
} from './interfaces/environmentVariables.interface';

const getEnvVarOrThrowError = (varName: string): string => {
  const envVar = process.env[varName];
  if (envVar === undefined) {
    throw new Error(`Missing the following environment variable: ${JSON.stringify(varName)}.`);
  }
  return envVar;
}

const parseIntOrThrow = (envVar: string): number => {
  const parsedInt = parseInt(envVar, 10);
  if (isNaN(parsedInt)) {
    throw new Error(`Environment variable '${JSON.stringify(envVar)}' must be parseable as an integer.`);
  }
  return parsedInt;
}

@Injectable()
export class EnvironmentService {
  private environmentVariables: EnvironmentVariables;

  private defaultVals: {[indexer: string]: string} = {
    PORT: '80',
    NODE_ENV: 'production'
  };

  constructor() {
    // Load .env file
    dotEnv.config();

    // Load CLI args
    process.argv.slice(2).forEach((arg) => {
      const [key, value] = arg.split('=');
      process.env[key] = value;
    });

    // Apply default values
    for (const key in this.defaultVals) {
      if (!process.env[key]) {
        process.env[key] = this.defaultVals[key];
      }
    }

    const nodeEnv = getEnvVarOrThrowError('NODE_ENV');
    if (!['development', 'test', 'production'].includes(nodeEnv)) {
      throw Error('NODE_ENV must be either development, test, or production');
    }

    this.environmentVariables = {
      port: parseIntOrThrow(getEnvVarOrThrowError('PORT')),
      nodeEnv: getEnvVarOrThrowError('NODE_ENV'),
      googleClientId: getEnvVarOrThrowError('GOOGLE_CLIENT_ID'),
      googleClientSecret: getEnvVarOrThrowError('GOOGLE_CLIENT_SECRET'),
      googleRedirectDomain: getEnvVarOrThrowError('GOOGLE_REDIRECT_DOMAIN'),
      apiUrl: getEnvVarOrThrowError('API_URL'),
      gameServerUrl: getEnvVarOrThrowError('GAME_SERVER_URL'),
      rabbitMQURI: getEnvVarOrThrowError('RABBITMQ_URI'),
      jwtSecret: getEnvVarOrThrowError('JWT_SECRET')
    };
  }

  public getArgs(): EnvironmentVariables {
    return this.environmentVariables;
  }
}
