export interface EnvironmentVariables {
  port: Readonly<number>;
  nodeEnv: Readonly<string>;
  googleClientId: Readonly<string>;
  googleClientSecret: Readonly<string>;
  googleRedirectDomain: Readonly<string>;
  oAuthEncryptionPassword: Readonly<string>;
  apiUrl: Readonly<string>;
  gameServerUrl: Readonly<string>;
  authServerUrl: Readonly<string>;
  rabbitMQURI: Readonly<string>;
}
