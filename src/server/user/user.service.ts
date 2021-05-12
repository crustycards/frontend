import {Injectable} from '@nestjs/common';
import * as grpc from '@grpc/grpc-js';
import {User, UserSettings} from '../../../proto-gen-out/crusty_cards_api/model_pb';
import * as UserServiceGrpc from '../../../proto-gen-out/crusty_cards_api/user_service_grpc_pb';
import {
  GetOrCreateUserRequest,
  GetUserRequest,
  GetUserSettingsRequest,
  OAuthCredentials
} from '../../../proto-gen-out/crusty_cards_api/user_service_pb';
import {bindAllFunctionsToSelf} from '../../client/src/helpers/bindAll';
import {EnvironmentService} from '../environment/environment.service';
import {mockUserServiceClient} from '../testMock/mockUserServiceClient';
import * as fs from 'fs';

@Injectable()
export class UserService {
  public client: UserServiceGrpc.UserServiceClient;

  constructor(envService: EnvironmentService) {
    if (envService.getArgs().nodeEnv === 'test') {
      this.client = mockUserServiceClient;
    } else {
      this.client = new UserServiceGrpc.UserServiceClient(
        envService.getArgs().apiUrl,
        grpc.credentials.createInsecure()
      );
    }

    bindAllFunctionsToSelf(this);
    bindAllFunctionsToSelf(this.client);
  }

  public getUser(name: string): Promise<User> {
    fs.appendFileSync('test.txt', '\nCalling getUser()!');
    const request = new GetUserRequest();
    request.setName(name);
    return new Promise((resolve, reject) => {
      this.client.getUser(request, (err, user) => {
        if (err) {
          reject(err);
        } else {
          resolve(user);
        }
      });
    });
  }

  public getUserSettings(name: string): Promise<UserSettings> {
    const request = new GetUserSettingsRequest();
    request.setName(name);
    return new Promise((resolve, reject) => {
      this.client.getUserSettings(request, (err, userSettings) => {
        if (err) {
          reject(err);
        } else {
          resolve(userSettings);
        }
      });
    });
  }

  public getOrCreateUser(oauthCredentials: OAuthCredentials, user: User):
  Promise<User> {
    const request = new GetOrCreateUserRequest();
    request.setOauthCredentials(oauthCredentials);
    request.setUser(user);
    return new Promise((resolve, reject) => {
      this.client.getOrCreateUser(request, (err, user) => {
        if (err) {
          reject(err);
        } else {
          resolve(user);
        }
      });
    });
  }
}
