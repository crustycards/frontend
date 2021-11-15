import {Module} from '@nestjs/common';
import {APP_FILTER} from '@nestjs/core';
import {AppController} from './app.controller';
import {AuthModule} from './auth/auth.module';
import {CardpackModule} from './cardpack/cardpack.module';
import {EnvironmentModule} from './environment/environment.module';
import {GameModule} from './game/game.module';
import {NotFoundExceptionFilter} from './notFoundExceptionFilter';
import {RabbitMQService} from './rabbitmq.service';
import {SocketGateway} from './socket.gateway';
import {UserModule} from './user/user.module';

// TODO - When running the server, it logs a warning message that forRootAsync
// is deprecated. We need to refactor this to resolve that warning.
@Module({
  imports: [
    AuthModule,
    CardpackModule,
    UserModule,
    GameModule,
    EnvironmentModule
  ],
  controllers: [AppController],
  providers: [RabbitMQService, SocketGateway, {
    provide: APP_FILTER,
    useClass: NotFoundExceptionFilter
  }]
})
export class AppModule {}
