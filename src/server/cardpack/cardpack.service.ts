import {Injectable} from '@nestjs/common';
import * as grpc from 'grpc';
import * as CardpackServiceGrpc from '../../../proto-gen-out/api/cardpack_service_grpc_pb';
import {EnvironmentService} from '../environment/environment.service';
import * as _ from 'underscore';

@Injectable()
export class CardpackService {
  public client: CardpackServiceGrpc.CardpackServiceClient;

  constructor(envService: EnvironmentService) {
    this.client = new CardpackServiceGrpc.CardpackServiceClient(
      envService.getArgs().apiUrl,
      grpc.credentials.createInsecure()
    );

    _.bindAll(this, ...Object.getOwnPropertyNames(Object.getPrototypeOf(this)));
    // TODO - Extract this into an helper function and
    // use it in all cases we're currently using _.bindAll().
    _.bindAll(
      this.client,
      ...Object.getOwnPropertyNames(Object.getPrototypeOf(this.client))
        .filter((item) =>
          typeof Object.getPrototypeOf(this.client)[item] === 'function')
    );
  }
}
