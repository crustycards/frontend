import {Injectable} from '@nestjs/common';
import {Request} from 'express';
import {use, Strategy} from 'passport';
import {User} from '../../../proto-gen-out/crusty_cards_api/model_pb';
import {UserService} from '../user/user.service';
import {AuthService} from './auth.service';

class PassportCookieStrategy extends Strategy {
  constructor(
    private readonly cookieName: string,
    private readonly verify: (
      cookie: string,
      callback: (err?: Error, user?: User) => void
    ) => void
  ) {
    super();
  }

  public authenticate(req: Request) {
    this.verify(req.cookies[this.cookieName], (err, user) => {
      if (err) {
        this.error(err);
      } else if (!user) {
        this.fail();
      } else {
        this.success(user);
      }
    });
  }
}

@Injectable()
export class CookieStrategy {
  constructor(authService: AuthService, userService: UserService) {
    // TODO - In the app controllers, `req.user` is always undefined.
    // It should probably be set to the user returned by `cb`.
    use(
      'cookie',
      new PassportCookieStrategy('authToken', async (authToken, cb) => {
        console.log('Auth Token:', authToken);
        if (!authToken) {
          return cb(undefined, undefined);
        }

        const decodedUserName = authService.decodeJwtToUserName(authToken);

        if (decodedUserName === undefined) {
          return cb(undefined, undefined);
        }

        // TODO - getUser() throwing an error doesn't necessarily mean that the
        // user doesn't exist. Let's check whether that's the reason the
        // request actually failed and call cb() with an error if it's not.
        try {
          const user = await userService.getUser(decodedUserName);
          cb(undefined, user);
        } catch (err) {
          // User does not exist.
          cb(undefined, undefined);
        }
      })
    );
  }
}
