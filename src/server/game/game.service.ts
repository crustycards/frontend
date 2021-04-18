import {Injectable} from '@nestjs/common';
import * as grpc from '@grpc/grpc-js';
import * as GameServiceGrpc from '../../../proto-gen-out/crusty_cards_api/game_service_grpc_pb';
import {EnvironmentService} from '../environment/environment.service';
import {bindAllFunctionsToSelf} from '../../client/src/helpers/bindAll';

@Injectable()
export class GameService {
  public client: GameServiceGrpc.GameServiceClient;

  constructor(envService: EnvironmentService) {
    this.client = new GameServiceGrpc.GameServiceClient(
      envService.getArgs().gameServerUrl,
      grpc.credentials.createInsecure()
    );

    bindAllFunctionsToSelf(this);
    bindAllFunctionsToSelf(this.client);
  }
}
