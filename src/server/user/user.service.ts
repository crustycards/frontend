import {Injectable} from '@nestjs/common';
import * as grpc from 'grpc';
import * as _ from 'underscore';
import {User, UserSettings} from '../../../proto-gen-out/api/model_pb';
import * as UserServiceGrpc from '../../../proto-gen-out/api/user_service_grpc_pb';
import {
  GetOrCreateUserRequest,
  GetUserRequest,
  GetUserSettingsRequest,
  OAuthCredentials
} from '../../../proto-gen-out/api/user_service_pb';
import {EnvironmentService} from '../environment/environment.service';

@Injectable()
export class UserService {
  public client: UserServiceGrpc.UserServiceClient;

  constructor(envService: EnvironmentService) {
    this.client = new UserServiceGrpc.UserServiceClient(
      envService.getArgs().apiUrl,
      grpc.credentials.createInsecure()
    );

    _.bindAll(this, ...Object.getOwnPropertyNames(Object.getPrototypeOf(this)));
    // TODO - Extract this into an helper function and
    // use it in all cases we're currently using _.bindAll().
    _.bindAll(
      this.client,
      ...Object.getOwnPropertyNames(Object.getPrototypeOf(this.client))
        .filter((item) => typeof Object.getPrototypeOf(this.client)[item] === 'function')
    );
  }

  public getUser(name: string): Promise<User> {
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
