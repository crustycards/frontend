import {NestFactory} from '@nestjs/core';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import {AppModule} from './app.module';

const bootstrap = async () => {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  // Processes the body as a Buffer object for all requests
  // with Content-Type header set to one of these values.
  app.use(bodyParser.raw({type: ['application/octet-stream'], limit: '10mb'}));
  // Set max json payload to 50mb
  app.use(bodyParser.json({limit: '50mb'}));
  // TODO - If possible, use EnvironmentService to get the port number.
  const port = parseInt(process.env.PORT || '80', 10);
  await app.listen(port);
  console.log(`Server is listening on port ${port}`);
};

bootstrap();
