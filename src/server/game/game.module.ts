import {Module} from '@nestjs/common';
import {EnvironmentModule} from '../environment/environment.module';
import {GameController} from './game.controller';
import {GameService} from './game.service';

@Module({
  imports: [EnvironmentModule],
  controllers: [GameController],
  providers: [GameService]
})
export class GameModule {}
