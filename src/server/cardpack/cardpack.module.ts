import {Module} from '@nestjs/common';
import {EnvironmentModule} from '../environment/environment.module';
import {CardpackController} from './cardpack.controller';
import {CardpackService} from './cardpack.service';

@Module({
  imports: [EnvironmentModule],
  controllers: [CardpackController],
  providers: [CardpackService]
})
export class CardpackModule {}
