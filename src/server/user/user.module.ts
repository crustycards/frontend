import {forwardRef, Module} from '@nestjs/common';
import {AuthModule} from '../auth/auth.module';
import {EnvironmentModule} from '../environment/environment.module';
import {UserController} from './user.controller';
import {UserService} from './user.service';

@Module({
  imports: [EnvironmentModule, forwardRef(() => AuthModule)],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule {}
