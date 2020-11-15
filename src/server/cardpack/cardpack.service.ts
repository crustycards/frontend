import {Injectable} from '@nestjs/common';
import * as grpc from '@grpc/grpc-js';
import * as CardpackServiceGrpc from '../../../proto-gen-out/api/cardpack_service_grpc_pb';
import {EnvironmentService} from '../environment/environment.service';
import {bindAllFunctionsToSelf} from '../../client/src/helpers/bindAll';

@Injectable()
export class CardpackService {
  public client: CardpackServiceGrpc.CardpackServiceClient;

  constructor(envService: EnvironmentService) {
    this.client = new CardpackServiceGrpc.CardpackServiceClient(
      envService.getArgs().apiUrl,
      grpc.credentials.createInsecure()
    );

    bindAllFunctionsToSelf(this);
    bindAllFunctionsToSelf(this.client);
  }
}
