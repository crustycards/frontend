import {forwardRef, Module} from '@nestjs/common';
import {EnvironmentModule} from '../environment/environment.module';
import {UserModule} from '../user/user.module';
import {AuthController} from './auth.controller';
import {CookieStrategy} from './auth.cookie.strategy';
import {GoogleStrategy} from './auth.google.strategy';
import {AuthService} from './auth.service';

@Module({
  imports: [EnvironmentModule, forwardRef(() => UserModule)],
  controllers: [AuthController],
  providers: [AuthService, GoogleStrategy, CookieStrategy],
  exports: [AuthService]
})
export class AuthModule {}
