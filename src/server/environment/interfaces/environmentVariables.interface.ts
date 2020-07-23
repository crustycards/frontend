export interface EnvironmentVariables {
  port: Readonly<number>;
  nodeEnv: Readonly<string>;
  googleClientId: Readonly<string>;
  googleClientSecret: Readonly<string>;
  googleRedirectDomain: Readonly<string>;
  apiUrl: Readonly<string>;
  gameServerUrl: Readonly<string>;
  rabbitMQURI: Readonly<string>;
  jwtSecret: Readonly<string>;
}
