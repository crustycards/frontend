import {Injectable} from '@nestjs/common';
import * as grpc from 'grpc';
import * as jwt from 'jsonwebtoken';
import {EnvironmentService} from '../environment/environment.service';

@Injectable()
export class AuthService {
  constructor(private readonly envService: EnvironmentService) {}

  public createJwtFromUserName(userName: string): string {
    return jwt.sign(userName, this.envService.getArgs().jwtSecret);
  }

  public decodeJwtToUserName(authToken: string): string | undefined {
    try {
      const decodedData = jwt.verify(
        authToken,
        this.envService.getArgs().jwtSecret
      );
      if (typeof decodedData === 'string') {
        return decodedData;
      } else {
        return undefined;
      }
    } catch (err) {
      return undefined;
    }
  }
}
