import {Injectable} from '@nestjs/common';
import {Request} from 'express';
import {use} from 'passport';
import {Strategy} from 'passport';
import {User} from '../user/interfaces/user.interface';
import {UserService} from '../user/user.service';

class PassportCookieStrategy extends Strategy {
  constructor(
    private readonly cookieName: string,
    private readonly verify: (cookie: string, callback: (err?: Error, user?: User) => void) => void
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
  constructor(userService: UserService) {
    use('cookie', new PassportCookieStrategy('session', async (sessionCookie, cb) => {
      try {
        if (!sessionCookie) {
          cb(null, null);
        }

        const user = await userService.getBySessionId(sessionCookie);
        cb(null, user);
      } catch (err) {
        cb(err);
      }
    }));
  }
}
