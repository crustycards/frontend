import {Injectable} from '@nestjs/common';
import {use} from 'passport';
import {Strategy as PassportGoogleStrategy} from 'passport-google-oauth20';
import {EnvironmentService} from '../environment/environment.service';
import {UserService} from '../user/user.service';

@Injectable()
export class GoogleStrategy {
  constructor(envService: EnvironmentService, userService: UserService) {
    use('google', new PassportGoogleStrategy({
      clientID: envService.getArgs().googleClientId,
      clientSecret: envService.getArgs().googleClientSecret,
      callbackURL: `${envService.getArgs().googleRedirectDomain}/auth/google`,
      scope: ['profile']
    }, async (accessToken, refreshToken, profile, cb) => {
      try {
        const user = await userService.findOrCreate({
          name: profile.displayName,
          oAuthId: profile.id,
          oAuthProvider: 'google'
        });
        cb(null, user);
      } catch (err) {
        cb(err);
      }
    }
    ));
  }
}
